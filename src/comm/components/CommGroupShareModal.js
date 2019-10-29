/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/10/15.
 * props type 'Image'(有分享图片和web) 'nomal'（分享web） 'miniProgram'小程序 task 任务 promotionShare 推广分享 miniProgramWithCopyUrl小程序带链接
 *
 *     imageJson:{
 *     imageUrlStr: 'http//：xxxx.png',
            titleStr: '商品标题',
            priceStr: '¥100.00',
            QRCodeStr: '分享的链接',
 *     }
 *     webJson:{
 *    title:分享标题(当为图文分享时候使用)
      dec:内容(当为图文分享时候使用)
      linkUrl:(图文分享下的链接)
      thumImage:(分享图标小图(http链接)图文分享使用)
 *     }
 *     miniProgramJson:
 *     {
 *     title
       dec
       thumImage
       linkUrl"兼容微信低版本网页地址";
       hdImageURL
       userName //"小程序username，如 gh_3ac2059ac66f";
       miniProgramPath //"小程序页面路径，如 pages/page10007/page10007";
       }
 api: { 分享完成调用
    url: '',
    methods: 'GET',
    params: {}
}
 luckyDraw: bool, //ture 分享成功后是否调用增加抽奖码的接口
 trackParmas={}埋点
 trackEvent= ''
 gh_a7c8f565ea2e uat  gh_aa91c3ea0f6c 测试
 taskShareParams: { //分享完成后，请求后台
 uri
 code:
 data:
 }
 */


'use strict';

import React from 'react';

import {
    Alert,
    Animated,
    Clipboard,
    Text,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { getSource } from '@mr/image-placeholder/oos';
import { observer } from 'mobx-react';

import { UIImage, UIText } from '../../components/ui';
import GroupShareImage from './GroupShareImage';
import ScreenUtils from '../../utils/ScreenUtils';
import CommModal from './CommModal';
import res from '../res';
import bridge from '../../utils/bridge';
import DesignRule from '../../constants/DesignRule';
import { track } from '../../utils/SensorsTrack';
import user from '../../model/user';
import ShareUtil from '../../utils/ShareUtil';
import RouterMap, { routeNavigate } from '../../navigation/RouterMap';
import TimeModel from '../../pages/mine/model/TimeModel';
import EmptyUtils from '../../utils/EmptyUtils';
import DateUtils from '../../utils/DateUtils';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

// 0：未知
// 1：微信好友2：微信朋友圈3：qq好友4：qq空间5：微博6：复制链接7：分享图片
// 100：其他

const TrackShareType = {
    unknown: 0,
    wx: 1, //微信好友
    wxTimeline: 2, //微信朋友圈
    qq: 3, //qq好友
    qqSpace: 4, //qq空间
    weibo: 5, // 微博
    copyLink: 6, //复制链接
    saveImage: 7, //分享图片
    other: 100//其他
};

@observer
export default class CommShowShareModal extends React.Component {

    constructor(props) {
        super(props);
        this._bind();
        this.defaultShareType = 1;
        this.state = {
            shortUrl: '',
            modalVisible: props.defaultModalVisible || false,
            shareType: this.defaultShareType, //如果是type小程序分享，默认分享方式是小程序分享。其余的type，默认分享类型是web图文
            path: '',
            showToastImage: false,
            scale: new Animated.Value(1),
            y: new Animated.Value(autoSizeWidth(0))
        };
    }

    /** public*/
    open() {
        if (user.isLogin) {
            user.userShare();
        } else {
            Alert.alert('', '为了给您提供更完整的服务，\n请登录后操作',
                [{
                    text: '继续浏览', onPress: () => {
                    }
                },
                    {
                        text: '马上登录', onPress: () => {
                            routeNavigate(RouterMap.LoginPage);
                        }
                    }]);
            return;
        }
        console.log('type', this.props.type);
        if(!EmptyUtils.isEmpty(this.props.endTime)) {
            //判断是否有即将结束的参团，存在则触发定时器
            TimeModel.getGroupModalTime();
        }
        this.defaultShareType = 1;
        this.setState({ modalVisible: true, shareType: this.defaultShareType, showToastImage: false });
        this.modal && this.modal.open();
    }

    /**
     * 显示图片,如果是分享商品，分享推广，下载图片展示图片动画
     */
    showImage() {
        const { type, imageJson } = this.props;
        let params = { ...(imageJson || {}) };
        let name = user.nickname && user.nickname.length > 8 ? user.nickname.replace(/^(\d{3})\d*(\d{4})$/, '$1****$2') : user.nickname;
        params.shareMoney && (params.shareMoney = this.getMoneyText(params.shareMoney));
        params = { headerImage: user.headImg || '', userName: name || '', ...params };
        if (type.toLowerCase() === 'group') {
            if (this.state.path.length === 0) {
                if (type.toLowerCase() === 'group') {
                    let url = params && params.imageUrlStr;
                    this.props.imageJson && (params.imageUrlStr = getSource({ uri: url }, this.imageWidth, this.imageHeight, 'lfit').uri);
                    bridge.creatShareImage(params, (path) => {
                        this.setState({ path: Platform.OS === 'android' ? 'file://' + path : '' + path }, () => {
                            this.changeShareType(0);
                            setTimeout(() => {
                                this.startAnimated();
                            }, 350);
                        });
                    });
                }
            } else {//已经有图片就直接展示
                this.changeShareType(0);
                this.startAnimated();
            }
        }
    }

    close() {
        this.setState({modalVisible: false}, () => {
            TimeModel.stopGroupModalTime()
        });
    }

    /** public end */
    _bind() {
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {

    }

    /**
     jsonData 参数
     info:包含截屏参数
     shareType : 0图片分享 1 图文链接分享 2小程序
     platformType: 0 朋友圈 1 会话
     title:分享标题(当为图文分享时候使用)
     dec:内容(当为图文分享时候使用)
     linkUrl:(图文分享下的链接)
     thumImage:(分享图标小图(http链接)图文分享使用)
     shareImage:分享的大图(本地URL)图片分享使用
     **/
    share(platformType) {
        this.close();
        this.props.clickShareBtn && this.props.clickShareBtn();
        let that = this;
        let params = {};
        let trackParmas = this.props.trackParmas;
        let trackEvent = this.props.trackEvent;
        if (this.state.shareType === 0) {//图片分享
            params.shareImage = this.state.path;
        } else if (this.state.shareType === 1) {//图文链接分享
            params = this.props.webJson;
        } else if (this.state.shareType === 2) {
            params = this.props.miniProgramJson;
        }

        params = {
            ...params,
            shareType: this.state.shareType,
            platformType: platformType
        };

        ShareUtil.onShare(params, that.props.api, trackParmas, trackEvent, this.props.successCallBack, that.props.luckyDraw, this.props.taskShareParams);
    }

    saveImage(path) {
        if (this.props.trackEvent) {
            track(this.props.trackEvent, { shareType: TrackShareType.saveImage, ...this.props.trackParmas });
        }
        bridge.saveImage(path);
        this.close();
    }

    copyUrl() {
        if (this.props.trackEvent) {
            track(this.props.trackEvent, { shareType: TrackShareType.copyLink, ...this.props.trackParmas });
        }
        if (this.props.webJson.linkUrl) {
            Clipboard.setString(ShareUtil.queryString(this.props.webJson.linkUrl, { pageSource: 6 }));
            bridge.$toast('复制链接成功');
        } else {
            bridge.$toast('链接不存在');
        }
    }

    changeShareType(shareType) {//切换是分享图片还是分享网页
    }

    startAnimated() {
    }

    getMoneyText = (shareMoney) => {
        //shareMoney 4.0 - 5.0
        let shareMoneyText = (shareMoney && shareMoney !== '?') ? `${shareMoney.split('-').shift()}` : '';
        //值相等  不要使用===  0,0.0的时候不显示
        if (shareMoneyText == 0) {
            shareMoneyText = null;
        }
        return shareMoneyText;
    };

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        const { needPerson, endTime } = this.props;
        let  backtime = DateUtils.getDateDiffFun(Number(endTime), TimeModel.groupModalDate);
        let arrayWeb = [];
        arrayWeb.push({
            image: res.share.wechat, title: '微信好友', onPress: () => {
                this.setState({ shareType: 1 }, () => {
                    this.share(0);
                });
            }
        });

        arrayWeb.push({
            image: res.share.saveImage, title: '海报', onPress: () => { //生成海报
                //判断是否传入分享数据 存在type则为传入了分享数据 其他则没传入
                this.showImage();
                this.setState({shareType:0})
            }
        });

        arrayWeb.push({
            image: res.share.FaceToFace, title: '面对面扫码', onPress: () => {
                this.close();
                routeNavigate(RouterMap.FaceToFaceQRcode,{data:this.props.imageJson})
            }
        });

        arrayWeb.push({
            image: res.share.QQ, title: 'QQ', onPress: () => {
                this.setState({ shareType: 1 }, () => {
                    this.share(2);
                });

            }
        });

        arrayWeb.push({
            image: res.share.qqKongJian, title: 'QQ空间', onPress: () => {
                this.setState({ shareType: 1 }, () => {
                    this.share(3);
                });
            }
        });

        return (
            <CommModal onRequestClose={this.close}
                       visible={this.state.modalVisible}
                       ref={(ref) => {
                           this.modal = ref;
                       }}
            >
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute'
                }}
                >
                    {this.state.shareType !== 1 ?
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {
                                this.close();
                            }}>

                            <GroupShareImage data={this.props.imageJson}
                                             download={() => {
                                                 this.setState({shareType: 0}, () => {
                                                     this.saveImage(this.state.path);
                                                     this.close();
                                                 });
                                             }}/>

                        </TouchableOpacity> :
                        <View style={{flex: 1, justifyContent: 'flex-end',}}>
                            <Animated.View style={{
                                transform: [{translateY: this.state.y}],
                                backgroundColor: 'white',
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                            }}>
                                <View style={[styles.contentContainer,
                                    {height: needPerson && endTime ? 230 + ScreenUtils.safeBottom : 195 + ScreenUtils.safeBottom,}]}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        {endTime ? this.timeFormat(backtime) : null}
                                        <View
                                            style={[styles.timeView, {alignItems: needPerson && endTime? 'flex-start' : 'center'}]}>
                                            {needPerson ?
                                                <Text style={{fontSize: 13, color: '#333333'}}>
                                                    还差<Text style={{fontSize: 16, color: '#FF0050'}}>{needPerson}</Text>人，可拼团成功
                                                </Text> :
                                                <Text style={{fontSize: 16, color: '#333333', fontWeight: '400',marginTop: 5}}>
                                                    邀请好友参加拼团
                                                </Text>
                                            }
                                        </View>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {
                                            arrayWeb.map((item, index) => {
                                                return (
                                                    <TouchableWithoutFeedback key={index + 'item'}
                                                                              onPress={item.onPress}>
                                                        <View style={styles.item}>
                                                            <UIImage source={item.image} style={{
                                                                height: autoSizeWidth(35),
                                                                width: autoSizeWidth(35)
                                                            }}/>
                                                            <UIText value={item.title} style={{
                                                                marginTop: 5,
                                                                color: DesignRule.textColor_mainTitle,
                                                                fontSize: autoSizeWidth(11)
                                                            }}/>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                );
                                            })
                                        }
                                    </View>

                                    <View style={{width: '100%', height: 5, backgroundColor: DesignRule.bgColor}}/>
                                    <TouchableOpacity activeOpacity={0.7}
                                                      style={styles.btnTouchStyle}
                                                      onPress={() => {
                                                          this.close();
                                                      }}>
                                        <Text style={{color: '#0076FF', fontSize: 17}} allowFontScaling={false}>
                                            取消
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    }
                </View>
            </CommModal>
        );
    }

    /**
     * 获取倒计时的日期时间
     * time = {
            years: 0, 剩余 年数
            days: 0,  剩余天数
            hours: 0, 剩余小时
            min: 0,   剩余分钟
            sec: 0,   剩余描述
            millisec: 0, 剩余毫秒
            allSecond:0  总秒数
        }
     */
    timeFormat = (time)=>{
        let format = {hours: '00', min: '00', sec: '00'};
        if (time.days > 0) {
            format['day'] = `${time.days < 10 ? '0' + time.days : time.days}`;
        }
        if (time.hours > 0) {
            format.hours = `${time.hours < 10 ? '0' + time.hours : time.hours}`;
        }
        if (time.min > 0) {
            format.min = `${time.min < 10 ? '0' + time.min : time.min}`;
        }
        if (time.sec > 0) {
            format.sec = `${time.sec < 10 ? '0' + time.sec : time.sec}`;
        }

        return (
            <View style={[styles.timeView,{flex: 2}]}>
                {format.day ?
                    <View style={styles.timeText}>
                        <Text style={{color: 'white', fontSize: 16}}>{format.day}</Text>
                    </View>
                    : null
                }
                {format.day ?
                    <Text style={{marginHorizontal: 8, color: '#333333', fontSize: 13}}>天</Text>
                    : null
                }

                <View style={styles.timeText}>
                    <Text style={{color: 'white', fontSize: 16}}>{format.hours}</Text>
                </View>
                <Text style={{marginHorizontal: 8}}>:</Text>
                <View style={styles.timeText}>
                    <Text style={{color: 'white', fontSize: 16}}>{format.min}</Text>
                </View>
                <Text style={{marginHorizontal: 8}}>:</Text>
                <View style={styles.timeText}>
                    <Text style={{color: 'white', fontSize: 16}}>{format.sec?format.sec:'00'}</Text>
                </View>
                <Text style={{marginHorizontal: 8, color: '#333333', fontSize: 13}}>后结束</Text>
            </View>);
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'white'
    },
    contentContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        paddingBottom: ScreenUtils.safeBottom,
    },
    item: {
        width: (ScreenUtils.width - 30) / 5 - 0.1,
        height: 90,
        marginTop: autoSizeWidth(0),
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeImgStyle: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: autoSizeWidth(18),
        height: autoSizeWidth(18)

    },
    userIcon: {
        width: 26,
        height: 26,
        borderRadius: 13
    },
    timeView:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    timeText:{
        width: 24,
        height: 24,
        backgroundColor: '#3A3D46',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },
    btnTouchStyle:{
        height: 44,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
