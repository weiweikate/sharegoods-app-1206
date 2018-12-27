/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/10/15.
 * props type 'Image'(有分享图片和web) 'nomal'（分享web） 'miniProgram'小程序 task 任务 promotionShare 推广分享
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
      trackParmas={}埋点
      trackEvent= ''
 gh_a7c8f565ea2e uat  gh_aa91c3ea0f6c 测试
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
    Linking
} from 'react-native';

import {
    UIText,
    UIImage
} from '../../components/ui';

import ScreenUtils from '../../utils/ScreenUtils';
//const saveMarginBottom = ScreenUtils.saveMarginBottom;
const autoSizeWidth = ScreenUtils.autoSizeWidth;
import CommModal from 'CommModal';
import res from '../res';
import bridge from '../../utils/bridge';
import { track } from '../../utils/SensorsTrack';
import DesignRule from 'DesignRule';
import user from '../../model/user';

export default class CommShareModal extends React.Component {

    constructor(props) {
        super(props);
        this._bind();
        this.defaultShareType = (props.type === 'miniProgram' || props.type === 'task' || props.type === 'Image' || props.type === 'promotionShare') ? 2 : 1;

        this.state = {
            modalVisible: false,
            shareType: this.defaultShareType, //如果是type小程序分享，默认分享方式是小程序分享。其余的type，默认分享类型是web图文
            path: '',
            scale: new Animated.Value(0.5),
            y: new Animated.Value(autoSizeWidth(300))
        };
    }

    /** public*/
    open() {
        if (user.isLogin) {
            user.userShare();
        }

        this.setState({ modalVisible: true, shareType: this.defaultShareType });
        this.modal && this.modal.open();
        this.state.y.setValue(autoSizeWidth(340));
        Animated.spring(
            // Animate value over time
            this.state.y, // The value to drive
            {
                toValue: 0,
                duration: 500
            }
        ).start();
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
     shareType : 0图片分享 1 图文链接分享 3小程序
     platformType: 0 朋友圈 1 会话
     title:分享标题(当为图文分享时候使用)
     dec:内容(当为图文分享时候使用)
     linkUrl:(图文分享下的链接)
     thumImage:(分享图标小图(http链接)图文分享使用)
     shareImage:分享的大图(本地URL)图片分享使用
     **/
    share(platformType) {
        this.close();
        let params = { shareType: this.state.shareType, platformType: platformType };
        if (this.state.shareType === 0) {//图片分享
            params.shareImage = this.state.path;
        } else if (this.state.shareType === 1) {//图文链接分享
            let { title, dec, linkUrl, thumImage } = this.props.webJson;
            params.title = title;
            params.dec = dec;
            params.linkUrl = linkUrl;
            params.thumImage = thumImage;
        } else if (this.state.shareType === 2) {
            let { title, dec, linkUrl, thumImage, userName, miniProgramPath, hdImageURL } = this.props.miniProgramJson;
            params.title = title;
            params.dec = dec;
            params.linkUrl = linkUrl;
            params.thumImage = thumImage;

            // params.userName = userName || uat 'gh_a7c8f565ea2e';// 测试 gh_aa91c3ea0f6c
            params.userName = userName || 'gh_a7c8f565ea2e';
            params.miniProgramPath = miniProgramPath;
            params.hdImageURL = hdImageURL;
        }
        if (this.props.trackEvent) {
            let p = this.props.trackParmas || {};
            let shareMethod = ['微信好友', '朋友圈', 'QQ好友', 'QQ空间', '微博'][platformType];
            track(this.props.trackEvent, {shareMethod, ...p});
        }
        bridge.share(params, () => {

        }, (errorStr) => {

        });
    }

    saveImage(path) {
        if (this.props.trackEvent) {
            track(this.props.trackEvent, {shareMethod: '保存图片',...this.props.trackParmas});
        }
        bridge.saveImage(path);
    }

    copyUrl() {
        if (this.props.trackEvent) {
            track(this.props.trackEvent, {shareMethod: '复制链接',...this.props.trackParmas});
        }
        Clipboard.setString(this.props.webJson.linkUrl);
        NativeModules.commModule.toast('复制链接成功');
    }

    changeShareType(shareType) {//切换是分享图片还是分享网页
        this.setState({ shareType: shareType });

        if (this.state.path.length === 0 && shareType === 0) {
            if (this.props.type === 'promotionShare') {
                bridge.createPromotionShareImage(this.props.webJson.linkUrl, (path) => {
                    this.setState({ path: Platform.OS === 'android' ? 'file://' + path : '' + path });
                    this.startAnimated();
                });
            } else {
                bridge.creatShareImage(this.props.imageJson, (path) => {
                    this.setState({ path: Platform.OS === 'android' ? 'file://' + path : '' + path });
                    this.startAnimated();
                });
            }
        } else {//已经有图片就直接展示
            this.startAnimated();
        }
    }

    startAnimated() {
        this.state.scale.setValue(0.5);
        Animated.spring(
            // Animate value over time
            this.state.scale, // The value to drive
            {
                toValue: 1,
                duration: 500
            }
        ).start();
    }

    render() {
        let array = [];
        let { isLogin, needLogin } = this.props;
        let isShow = false;
        if (needLogin === true && isLogin === false) {
            isShow = true;
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
        array.push({
            image: res.share.qqKongJian, title: 'QQ空间', onPress: () => {
                this.share(3);
            }
        });
        array.push({
            image: res.share.weibo, title: '微博', onPress: () => {
                this.share(4);
            }
        });
        if (this.props.type === 'Image' || this.props.type === 'promotionShare') {
            if (this.state.shareType === 2 || this.state.shareType === 1) {
                array.push({
                    image: res.share.copyURL, title: '复制链接', onPress: () => {
                        this.copyUrl();
                    }
                });
                array.push({
                    image: res.share.saveImage, title: '保存图片', onPress: () => {
                        this.changeShareType(0);
                    }
                });
            }
            if (this.state.shareType === 0) {
                array.push({
                    image: res.share.download, title: '下载图片', onPress: () => {
                        this.saveImage(this.state.path);
                    }
                });
            }
        }

        if (this.props.type === 'task') {
            array = [{
                image: res.share.weiXin, title: '微信好友', onPress: () => {
                    this.share(0);
                }
            }];
        }

        let imageHeight = autoSizeWidth(650 / 2);
        let imageWidth = autoSizeWidth(250);
        if (this.props.type === 'promotionShare') {
            imageHeight = autoSizeWidth(348);
            imageWidth = autoSizeWidth(279);
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
                        backgroundColor: 'white'
                    }}>
                        <View style={[styles.contentContainer]}>
                            <View style={styles.header}>
                                <View style={{
                                    flex: 1,
                                    marginLeft: autoSizeWidth(25),
                                    height: 1,
                                    backgroundColor: DesignRule.lineColor_inColorBg
                                }}/>
                                <UIText value={'分享到'}
                                        style={{
                                            color: DesignRule.textColor_secondTitle,
                                            fontSize: autoSizeWidth(17),
                                            marginHorizontal: 7
                                        }}/>
                                <View style={{
                                    flex: 1,
                                    marginRight: autoSizeWidth(25),
                                    height: 1,
                                    backgroundColor: DesignRule.lineColor_inColorBg
                                }}/>
                            </View>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                {
                                    array.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback key={index + 'item'} onPress={item.onPress}>
                                                <View style={styles.item}>
                                                    <UIImage source={item.image} style={{
                                                        height: autoSizeWidth(47),
                                                        width: autoSizeWidth(47)
                                                    }}/>
                                                    <UIText value={item.title} style={{
                                                        marginTop: 5,
                                                        color: DesignRule.textColor_secondTitle,
                                                        fontSize: autoSizeWidth(11)
                                                    }}/>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        );
                                    })
                                }
                            </View>
                        </View>
                        <View style={{ flex: 1 }}/>
                        <View style={{
                            height: 1,
                            backgroundColor: DesignRule.lineColor_inColorBg
                        }}/>
                        <TouchableWithoutFeedback onPress={() => {
                            this.close();
                        }}
                        >
                            <View style={styles.bottomBtn}>
                                <UIText value={'取消'} style={{
                                    color: DesignRule.textColor_secondTitle,
                                    fontSize: autoSizeWidth(16)
                                }}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                    {
                        this.state.shareType === 0 ?
                            <Animated.View style={{
                                height: imageHeight,
                                width: imageWidth,
                                position: 'absolute',
                                top: ScreenUtils.height - autoSizeWidth(255) - imageHeight - ScreenUtils.safeBottom,
                                left: (autoSizeWidth(375) - imageWidth) / 2,
                                borderRadius: 10,
                                borderColor: DesignRule.textColor_placeholder,
                                shadowOpacity: 0.3,
                                borderWidth: this.props.type === 'promotionShare' ? 0 : 0.5,
                                overflow: 'hidden',
                                shadowColor: DesignRule.textColor_placeholder,
                                transform: [{ scale: this.state.scale }]

                            }}>
                                <TouchableWithoutFeedback onLongPress={() => {
                                    if (this.props.type === 'promotionShare') {
                                        Linking.openURL(this.props.webJson.linkUrl);
                                    }
                                }}>
                                    <Image source={{ uri: this.state.path }}
                                           style={{
                                               height: imageHeight,
                                               width: imageWidth,
                                               backgroundColor: 'white'
                                           }}/>
                                </TouchableWithoutFeedback>
                                {
                                    isShow ? <UIText value={'登陆以后分享才能获取奖励'}
                                                     style={{
                                                         position: 'absolute',
                                                         left: 0,
                                                         right: 0,
                                                         height: 20,
                                                         top: imageWidth - 20,
                                                         backgroundColor: 'rgba(0,0,0,0.3)',
                                                         fontSize: 12,
                                                         textAlign: 'center',
                                                         color: 'white'
                                                     }}/>
                                        : null

                                }
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
        height: autoSizeWidth(255)
    },
    header: {
        flexDirection: 'row',
        height: autoSizeWidth(45),
        alignItems: 'center'
    },
    bottomBtn: {
        height: autoSizeWidth(45),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    item: {
        width: ScreenUtils.width / 4 - 0.1,
        height: autoSizeWidth(187.5 / 2),
        marginTop: autoSizeWidth(0),
        alignItems: 'center',
        justifyContent: 'center'
    }
});
