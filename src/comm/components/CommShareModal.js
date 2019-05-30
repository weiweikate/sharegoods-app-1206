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
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Animated,
    Image,
    Platform,
    TouchableOpacity,
    Clipboard,
    NativeModules,
    Linking,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native';
import ShowShareImage from './ShowShareImage';

import {
    UIText,
    UIImage,
    MRText
} from '../../components/ui';

import ScreenUtils from '../../utils/ScreenUtils';
//const saveMarginBottom = ScreenUtils.saveMarginBottom;
const autoSizeWidth = ScreenUtils.autoSizeWidth;
import CommModal from './CommModal';
import res from '../res';
import bridge from '../../utils/bridge';
import DesignRule from '../../constants/DesignRule';
import { track } from '../../utils/SensorsTrack';
import user from '../../model/user';
import { getSource } from '@mr/image-placeholder/oos';
import ShareUtil from '../../utils/ShareUtil';
import {navigate} from '../../navigation/RouterMap';
import RouterMap from '../../navigation/RouterMap';

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

export default class CommShareModal extends React.Component {

    constructor(props) {
        super(props);
        this._bind();
        this.defaultShareType = 1;
        this.state = {
            modalVisible: false,
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
        }else {
            Alert.alert('', '为了给您提供更完整的服务，\n请登录后操作',
                [{
                        text: '继续浏览', onPress: () => {
                        }
                    },
                    {
                        text: '马上登录', onPress: () => {
                            navigate(RouterMap.LoginPage);
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
        let type = this.props.type;
        let params = this.props.imageJson || {};
        params = {headerImage:user.headImg, userName: user.nickname, ...params};
        if (type === 'promotionShare' || type === 'Image' || type === 'Show') {
            if (this.state.path.length === 0) {
                if (type === 'promotionShare') {
                    bridge.createPromotionShareImage(params.webJson.linkUrl, (path) => {
                        this.setState({ path: Platform.OS === 'android' ? 'file://' + path : '' + path }, () => {
                            setTimeout(() => {
                                this.startAnimated();
                            }, 350);
                        });
                    });
                } else if (type === 'Image' || type === 'Show') {
                    let url = params && params.imageUrlStr;
                    this.props.imageJson && (params.imageUrlStr = getSource(url, this.imageWidth, this.imageHeight));
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
            params = this.props.miniProgramJson
        }

        params = {
            ...params,
            shareType: this.state.shareType,
            platformType: platformType
        };

        ShareUtil.onShare(params, that.props.api, trackParmas,trackEvent ,this.props.successCallBack, that.props.luckyDraw,this.props.taskShareParams);
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
        Clipboard.setString(ShareUtil.queryString(this.props.webJson.linkUrl,{pageSource:6}));
        NativeModules.commModule.toast('复制链接成功');
    }

    changeShareType(shareType) {//切换是分享图片还是分享网页
        this.setState({ shareType: shareType });
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

    render() {
        const { type } = this.props;
        const { shareType } = this.state;
        let scale = 667 / 375;
        this.imageWidth = ScreenUtils.width - 60;
        this.imageHeight = (ScreenUtils.width - 93) * scale;
        if(this.imageWidth * scale >= (ScreenUtils.height - 151)){
            this.imageHeight = (ScreenUtils.height - 151);
            this.imageWidth = this.imageHeight / scale;
        }else {
            this.imageHeight = (ScreenUtils.width -33) * scale;
        }

        if (this.props.type === 'promotionShare') {
            this.imageHeight = ((ScreenUtils.width - 93) * scale);
            this.imageWidth = ScreenUtils.width - 60;
        }

        let array = [];
        if (type === 'Image' || type === 'promotionShare' || type === 'Show') {
            if (shareType === 2 || shareType === 1) {
                array.push({
                    image: res.share.saveImage, title: '分享图片', onPress: () => {
                        this.setState({
                            showToastImage: true
                        }, () => {
                            this.showImage();
                        });
                    }
                });
            } else if (shareType === 0) {
                array.push({
                    image: res.share.download, title: '下载图片', onPress: () => {
                        this.saveImage(this.state.path);
                    }
                });
            }
        }
        array.push({
            image: res.share.wechat, title: '微信好友', onPress: () => {
                this.share(0);
            }
        });
        array.push({
            image: res.share.weiXinTimeLine, title: '朋友圈', onPress: () => {
                this.share(1);
            }
        });
        array.push({
            image: res.share.QQ, title: 'QQ好友', onPress: () => {
                this.share(2);
            }
        });
        // array.push({
        //     image: res.share.qqKongJian, title: 'QQ空间', onPress: () => {
        //         this.share(3);
        //     }
        // });
        array.push({
            image: res.share.weibo, title: '微博', onPress: () => {
                this.share(4);
            }
        });

        if ((type === 'miniProgramWithCopyUrl'||type === 'Image' || type === 'promotionShare' || type === 'Show')&&shareType != 0) {
            array.push({
                image: res.share.copyURL, title: '复制链接', onPress: () => {
                    this.copyUrl();
                }
            });
        }

        if (type === 'task') {
            array = [{
                image: res.share.weiXin, title: '微信好友', onPress: () => {
                    this.share(0);
                }
            }];
        }
        //shareMoney 4.0 - 5.0
        const { shareMoney } = this.props.imageJson || {};
        let shareMoneyText = (shareMoney && shareMoney !== '?') ? `${shareMoney.split('-').shift()}` : '';
        //值相等  不要使用===  0的时候不显示
        if (shareMoneyText == 0) {
            shareMoneyText = null;
        }

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
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                        this.close();
                    }}/>
                    <Animated.View style={{
                        transform: [{ translateY: this.state.y }],
                        paddingBottom: ScreenUtils.safeBottom,
                        backgroundColor: 'white',
                        borderTopLeftRadius:10,
                        borderTopRightRadius:10,
                    }}>
                        <View style={[styles.contentContainer]}>
                            <View style={styles.header}>
                                <View style={{
                                    flex: 1,
                                    marginLeft: autoSizeWidth(25),
                                    height: 1,
                                    backgroundColor: DesignRule.lineColor_inColorBg
                                }}/>
                                {
                                    this.props.type === 'Image' ?
                                        <MRText style={{
                                            color: DesignRule.textColor_mainTitle,
                                            fontSize: autoSizeWidth(15),
                                            marginHorizontal: 7,
                                            fontWeight:'bold'
                                        }}>{'分享秀一秀 '}<MRText
                                            style={{ color: DesignRule.mainColor }}>{shareMoneyText || ''}</MRText>{shareMoneyText ? '起' : ''}
                                        </MRText>
                                        :
                                        <MRText style={{
                                            color: DesignRule.textColor_mainTitle,
                                            fontSize: autoSizeWidth(15),
                                            marginHorizontal: 7,
                                            fontWeight:'bold'
                                        }}>分享到</MRText>
                                }
                                <View style={{
                                    flex: 1,
                                    marginRight: autoSizeWidth(25),
                                    height: 1,
                                    backgroundColor: DesignRule.lineColor_inColorBg
                                }}/>
                            </View>
                            <ScrollView horizontal
                                        bounces={false}
                                        showsHorizontalScrollIndicator={false}>
                                {
                                    array.map((item, index) => {
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
                            </ScrollView>
                        </View>
                        <View style={{ flex: 1 }}/>
                        <View style={{
                            height: 1,
                            backgroundColor: DesignRule.lineColor_inColorBg
                        }}/>
                    </Animated.View>
                    {
                        this.props.type === 'promotionShare' || (this.props.type === 'Image' && this.state.showToastImage) || (this.props.type === 'Show' && this.state.showToastImage) ?
                            <Animated.View style={{
                                height: this.imageHeight,
                                width: this.imageWidth,
                                position: 'absolute',
                                top: 33,
                                left: (ScreenUtils.width - this.imageWidth) / 2,
                                borderRadius: 10,
                                borderColor: DesignRule.textColor_placeholder,
                                shadowOpacity: 0.3,
                                borderWidth: this.props.type === 'promotionShare' ? 0 : 0.5,
                                overflow: 'hidden',
                                shadowColor: DesignRule.textColor_placeholder,
                                transform: [{ scale: this.state.scale }]

                            }}>
                                {this.props.type === 'Image' ?
                                <TouchableWithoutFeedback onLongPress={() => {
                                    if (this.props.type === 'promotionShare') {
                                        Linking.openURL(this.props.webJson.linkUrl);
                                    }
                                }}>
                                    <Image source={{ uri: this.state.path }}
                                           resizeMode={'contain'}
                                           style={{
                                               height: this.imageHeight,
                                               width: this.imageWidth,
                                               backgroundColor: 'white'
                                           }}/>
                                </TouchableWithoutFeedback>  : null
                                }
                                {this.props.type === 'Show' ?
                                <ShowShareImage modalWidth={this.imageWidth} modalHeight={this.imageHeight*2/3}
                                                data={this.props.imageJson} modal={this.modal}/> : null
                                }
                                {
                                    this.state.path === ''&&!this.props.type === 'Show' ? <ActivityIndicator
                                        color="#aaaaaa"
                                        style={{
                                            position: 'absolute',
                                            width: 10,
                                            height: 10,
                                            top: this.imageHeight / 2.0 - 5,
                                            left: this.imageWidth / 2.0 - 5
                                        }}/> : null
                                }
                                <TouchableWithoutFeedback onPress={()=>{this.close()}}>
                                    <Image style={styles.closeImgStyle}
                                           source={res.share.close_black}/>
                                </TouchableWithoutFeedback>
                            </Animated.View> : null
                    }
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
        height: autoSizeWidth(170),
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
    },
    header: {
        flexDirection: 'row',
        height: autoSizeWidth(45),
        alignItems: 'center',
    },
    bottomBtn: {
        height: autoSizeWidth(45),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    item: {
        width: ScreenUtils.width / 6 - 0.1,
        height: autoSizeWidth(187.5 / 2),
        marginTop: autoSizeWidth(0),
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeImgStyle:{
        position: 'absolute',
        top: 10,
        right:10,
        width: autoSizeWidth(18),
        height: autoSizeWidth(18),

    },
});
