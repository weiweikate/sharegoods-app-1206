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
    // ActivityIndicator,
    Alert,
    Animated,
    Clipboard,
    // Image,
    // Linking,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
// import ShowShareImage from './ShowShareImage';

import { MRText, UIImage, UIText } from '../../components/ui';

import ScreenUtils from '../../utils/ScreenUtils';
import CommModal from './CommModal';
import res from '../res';
// import resHome from '../../pages/mine/res';
import bridge from '../../utils/bridge';
import DesignRule from '../../constants/DesignRule';
import { track } from '../../utils/SensorsTrack';
import user from '../../model/user';
import { getSource } from '@mr/image-placeholder/oos';
import ShareUtil from '../../utils/ShareUtil';
import RouterMap, { routeNavigate } from '../../navigation/RouterMap';
//const saveMarginBottom = ScreenUtils.saveMarginBottom;
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
        this.defaultShareType = 1;
        this.setState({ modalVisible: true, shareType: this.defaultShareType, showToastImage: false });
        this.modal && this.modal.open();
        // this.state.y.setValue(autoSizeWidth(340));
        // Animated.spring(
        //     // Animate value over time
        //     this.state.y, // The value to drive
        //     {
        //         toValue: 0,
        //         duration: 500
        //     }
        // ).start();
        // if (this.props.type !== 'Image') {
        //     this.showImage();
        // }
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
        if (type === 'show') {
            if (this.state.path.length === 0) {
                if (type === 'show') {
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
        this.setState({ modalVisible: false });
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

        if(platformType === 4){
            let name = user.nickname && user.nickname.length > 8 ? user.nickname.replace(/^(\d{3})\d*(\d{4})$/, '$1****$2') : user.nickname;
            params.title = '';
            params.dec = `${name}的文章 ${params.title}(想看更多？下载：@秀购App：https://h5.sharegoodsmall.com/download )文章链接请点击：`;
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
        // this.state.scale.setValue(0.5);
        // Animated.spring(
        //     // Animate value over time
        //     this.state.scale, // The value to drive
        //     {
        //         toValue: 1,
        //         duration: 500
        //     }
        // ).start();
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
        const { type } = this.props;
        // const { shareType } = this.state;
        let scale =  667 / 375;
        this.imageWidth = 240;
        this.imageHeight = 335;
        if (this.imageWidth * scale >= (ScreenUtils.height - 275 - ScreenUtils.safeBottom)) {
            this.imageHeight = (ScreenUtils.height - 275 - ScreenUtils.safeBottom - ScreenUtils.statusBarHeight);
            this.imageWidth = this.imageHeight / scale;
        } else {
            this.imageHeight = this.imageWidth * scale;
        }

        // let arrayImage = [];
        let arrayWeb = [];
        // let currentType = type === 'showImage' || type === 'showWeb' || type === 'showVideo' || type === 'show';

        arrayWeb.push({
            image: res.share.wechat, title: '微信好友', onPress: () => {
                this.setState({ shareType: 1 }, () => {
                    this.share(0);
                });
            }
        });

        arrayWeb.push({
            image: res.share.QQ, title: 'QQ好友', onPress: () => {
                this.setState({ shareType: 1 }, () => {
                    this.share(2);
                });
                this.share(2);
            }
        });

        arrayWeb.push({
            image: res.share.weibo, title: '微博', onPress: () => {
                this.setState({ shareType: 1 }, () => {
                    this.share(4);
                });
            }
        });

        if( type === 'show'){
            this.showImage();
            arrayWeb.push({
                image: res.share.download, title: '下载推广图片', onPress: () => {
                    this.setState({ shareType: 0 }, () => {
                        console.log('this.state.path',this.state.path)
                        this.saveImage(this.state.path);
                    });
                }
            });
        }

        // arrayWeb.push({
        //     image: res.share.copyURL, title: '复制链接发圈', onPress: () => {
        //         this.setState({ shareType: 1 }, () => {
        //             this.copyUrl();
        //         });
        //     }
        // });

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
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => {
                        this.close();
                    }}>
                        <Animated.View style={{
                            transform: [{ translateY: this.state.y }],
                            paddingBottom: ScreenUtils.safeBottom,
                            backgroundColor: 'white',
                            borderRadius: 10,

                        }}>
                            <View
                                style={[styles.contentContainer, { height: autoSizeWidth(180) }]}>
                                <View style={{flex: 1, alignItems: 'center',justifyContent:'center'}}>
                                    <MRText style={{
                                        color: DesignRule.textColor_mainTitle,
                                        fontSize: autoSizeWidth(12),
                                        marginHorizontal: 7,
                                        fontWeight: '600'
                                    }}>点击下方按钮，分享给好友吧</MRText>
                                    <MRText style={{
                                        color: DesignRule.textColor_mainTitle,
                                        fontSize: autoSizeWidth(12),
                                        marginHorizontal: 7,
                                    }}>{type === 'showImage' ? '文案已复制，图片已下载到相册' :
                                        type === 'showVideo' ? '文案已复制，视频已下载到相册' : ''}</MRText>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', borderRadius: 10,justifyContent:'center' }}>
                                    {
                                        arrayWeb.map((item, index) => {
                                            return (
                                                <TouchableWithoutFeedback key={index + 'item'} onPress={item.onPress}>
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

                            </View>

                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'white'
    },
    contentContainer: {
        backgroundColor: 'white',
        height: autoSizeWidth(175),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    header: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    bottomBtn: {
        height: autoSizeWidth(45),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    item: {
        width: (ScreenUtils.width - 30) / 4 - 0.1,
        height: 80,
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
    }
});
