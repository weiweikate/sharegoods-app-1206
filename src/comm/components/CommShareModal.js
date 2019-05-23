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
    ActivityIndicator
} from 'react-native';

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
        this.defaultShareType = (props.type === 'miniProgram' ) ? 2 : 1;
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
        }
        let props = this.props;
        this.defaultShareType = (props.type === 'miniProgram' ) ? 2 : 1;
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
        if (type === 'promotionShare' || type === 'Image') {
            if (this.state.path.length === 0) {
                if (type === 'promotionShare') {
                    bridge.createPromotionShareImage(this.props.webJson.linkUrl, (path) => {
                        this.setState({ path: Platform.OS === 'android' ? 'file://' + path : '' + path }, () => {
                            setTimeout(() => {
                                this.startAnimated();
                            }, 350);
                        });
                    });
                } else if (type === 'Image') {
                    let url = this.props.imageJson && this.props.imageJson.imageUrlStr;
                    this.props.imageJson && (this.props.imageJson.imageUrlStr = getSource(url, this.imageWidth, this.imageHeight));
                    bridge.creatShareImage(this.props.imageJson, (path) => {
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

        ShareUtil.onShare(params, that.props.api, trackParmas,trackEvent , () => {
            console.log('分享成功结束后回调');
            this.props.reloadWeb && this.props.reloadWeb();
        }, that.props.luckyDraw);
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
        Clipboard.setString(this.props.webJson.linkUrl);
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

        this.imageHeight = autoSizeWidth(350);
        this.imageWidth = autoSizeWidth(250);
        if (this.props.type === 'promotionShare') {
            this.imageHeight = autoSizeWidth(348);
            this.imageWidth = autoSizeWidth(279);
        }

        let array = [];
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

        if (type === 'Image' || type === 'promotionShare') {
            if (shareType === 2 || shareType === 1) {
                array.push({
                    image: res.share.copyURL, title: '复制链接', onPress: () => {
                        this.copyUrl();
                    }
                });
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
        } else if (type === 'miniProgramWithCopyUrl') {
            array.push({
                image: res.share.copyURL, title: '复制链接', onPress: () => {
                    this.copyUrl();
                }
            });
        } else if (type === 'task') {
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
        if (shareMoneyText === 0) {
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
                                {
                                    this.props.type === 'Image' ?
                                        <MRText style={{
                                            color: DesignRule.textColor_secondTitle,
                                            fontSize: autoSizeWidth(17),
                                            marginHorizontal: 7
                                        }}>{`分享秀一秀 `}<MRText
                                            style={{ color: DesignRule.mainColor }}>{shareMoneyText || ''}</MRText>{shareMoneyText ? '起' : ''}
                                        </MRText>
                                        :
                                        <MRText style={{
                                            color: DesignRule.textColor_secondTitle,
                                            fontSize: autoSizeWidth(17),
                                            marginHorizontal: 7
                                        }}>分享到</MRText>
                                }
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
                        this.props.type === 'promotionShare' || (this.props.type === 'Image' && this.state.showToastImage) ?
                            <Animated.View style={{
                                height: this.imageHeight,
                                width: this.imageWidth,
                                position: 'absolute',
                                top: ScreenUtils.height - autoSizeWidth(255) - this.imageHeight - ScreenUtils.safeBottom,
                                left: (autoSizeWidth(375) - this.imageWidth) / 2,
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
                                               height: this.imageHeight,
                                               width: this.imageWidth,
                                               backgroundColor: 'white'
                                           }}/>
                                </TouchableWithoutFeedback>
                                {
                                    this.state.path === '' ? <ActivityIndicator
                                        color="#aaaaaa"
                                        style={{
                                            position: 'absolute',
                                            width: 10,
                                            height: 10,
                                            top: this.imageHeight / 2.0 - 5,
                                            left: this.imageWidth / 2.0 - 5
                                        }}/> : null
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
