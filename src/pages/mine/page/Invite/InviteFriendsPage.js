/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/10/16.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    Platform,
    TouchableWithoutFeedback,
    ImageBackground,
    Image,
} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';


import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { UIImage } from '../../../../components/ui';
import { MRText as Text } from '../../../../components/ui';
import CommShareModal from '../../../../comm/components/CommShareModal';
import bridge from '../../../../utils/bridge';
import apiEnvironment from '../../../../api/ApiEnvironment';
// import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import user from '../../../../model/user';
import {track, trackEvent} from '../../../../utils/SensorsTrack';
import { SmoothPushPreLoadHighComponentFirstDelay } from '../../../../comm/components/SmoothPushHighComponent';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

const {
    button: {
        back_white
    },
    invite: {
        bgColor,
        bgContent,
        shareBtn,
        textBg,
        QRBg,
        wenan,
        defaultHeader
    }
} = res;

type Props = {};
@SmoothPushPreLoadHighComponentFirstDelay
export default class InviteFriendsPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            disable: false,
            path: '',
            inviteCode: '',
        };
        this._bind();
        this.linkUrl = `${apiEnvironment.getCurrentH5Url()}/register?upuserid=${user.code || ''}&signUpSource=fxhy`;
    }

    $navigationBarOptions = {
        title: '',
        show: false// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
        this.creatQRCodeImage = this.creatQRCodeImage.bind(this);
    }

    componentDidMount() {
        track(trackEvent.ViewInviteFriends,{});
        this.loadPageData();
    }

    /**
     * @func 调用生成二维码图片方法
     */
    loadPageData() {
        this.creatQRCodeImage(this.linkUrl);
    }

    /**
     * @func 调用原生方法生成二维码图片，
     * @param  QRCodeStr {String} 传入地址URL
     */
    creatQRCodeImage(QRCodeStr) {
        bridge.creatQRCodeImage(QRCodeStr, (path, QRCodeUrl) => {
            this.setState({
                path: Platform.OS === 'android' ? 'file://' + path : '' + path,
                inviteCode: QRCodeUrl
            });
        },()=>{
        },'invite');
    }

    // //截屏
    // _saveImg = () => {
    //     let logo = 'logo.png';
    //     if (user && user.headImg && user.headImg.length > 4) {
    //         logo = user.headImg;
    //     }
    //     // track(trackEvent.QrcodeShareto, { qrCodeID: this.linkUrl, shareMethod: '保存图片' });
    //     this.setState({
    //         disable: true
    //     }, () => {
    //         bridge.saveInviteFriendsImage(this.linkUrl, logo, () => {
    //             this.$toastShow('保存成功');
    //             this.__timer__ = setTimeout(() => {
    //                 this.setState({
    //                     disable: false
    //                 });
    //             }, 2500);
    //         }, () => {
    //             this.$toastShow('保存失败');
    //             this.setState({
    //                 disable: false
    //             });
    //         });
    //     });
    // };

    _render() {

        let height = ScreenUtils.height;
        if(ScreenUtils.isAllScreenDevice && !ScreenUtils.getBarShow()){
            height = ExtraDimensions.get('REAL_WINDOW_HEIGHT')
        }else if(ScreenUtils.isAllScreenDevice && ScreenUtils.getBarShow()) {
            if (ScreenUtils.getHasNotchScreen()) {
                height = ExtraDimensions.get('REAL_WINDOW_HEIGHT') - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT') + ExtraDimensions.get('STATUS_BAR_HEIGHT')
            } else {
                height = ExtraDimensions.get('REAL_WINDOW_HEIGHT') - ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT')
            }
        }

        let name =  user.nickname && user.nickname.length > 8 ? user.nickname.replace(/^(\d{3})\d*(\d{4})$/,'$1****$2') : user.nickname;
        return(
            <View style={styles.contain}>
                <ImageBackground source={bgColor} style={{width: ScreenUtils.width, height, alignItems: 'center'}}>
                    <View style={styles.headerStyle}>
                        <Image source={wenan} style={styles.wenanStyle}/>
                        <View style={{alignItems: 'center'}}>
                            <View style={{width:64,height:64,borderRadius:32,backgroundColor: '#FBF6CF',alignItems:'center',justifyContent:'center'}}>
                            {
                                user && user.headImg && user.headImg.length > 4 ?
                                    <UIImage source={{uri: user.headImg}}
                                             style={{
                                                 height: autoSizeWidth(58),
                                                 width: autoSizeWidth(58),
                                                 borderRadius: autoSizeWidth(29)
                                             }}/>
                                    :
                                    <UIImage source={defaultHeader}
                                             style={{
                                                 height: autoSizeWidth(58),
                                                 width: autoSizeWidth(58),
                                                 borderRadius: autoSizeWidth(29)
                                             }}/>
                            }
                            </View>
                            <ImageBackground source={textBg}
                                             style={styles.textBgStyle}>
                                <Text style={{color: '#B93C3B', fontSize: 13, marginTop: 10}}>{name || ''}</Text>
                                <Text style={{color: '#B93C3B', fontSize: 13}}>已有4000000+用户领取成功～</Text>
                            </ImageBackground>
                        </View>
                    </View>
                    {this.state.path ? <UIImage source={{uri: this.state.path}}
                                                resizeMode={'stretch'}
                                                style={{
                                                    width: 144,
                                                    height: 144,
                                                }}/> :
                        <Image source={QRBg} style={{width: 144, height: 144, backgroundColor: 'white'}}/>
                    }
                    <Text style={{color: '#FFFFFF', fontSize: 13, marginTop: 5}}>手机扫一扫注册新用户</Text>
                    <Image source={bgContent}
                           style={styles.btnText}/>
                </ImageBackground>

                <View style={{
                    width: ScreenUtils.width,
                    height: 52,
                    bottom: 33,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.shareModal && this.shareModal.open();
                    }}>
                        <View>
                            <Image source={shareBtn}
                                   style={{width: 201, height: 52}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <TouchableWithoutFeedback onPress={() => {
                    this.$navigateBack();
                }}>
                    <View style={{
                        width: 40,
                        height: 44,
                        top: ScreenUtils.statusBarHeight,
                        left: 0,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <UIImage source={back_white} style={{width: 30, height: 30}}/>
                    </View>
                </TouchableWithoutFeedback>

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                defaultModalVisible={this.params.openShareModal}
                                type={'Invite'}
                                imageJson={{
                                    imageType: 'invite',
                                    titleStr:'',
                                    imageUrlStr:'',
                                    QRCodeStr: this.state.inviteCode || this.linkUrl,
                                }}
                                webJson={{
                                    title: '送你1张免费商品兑换券，海量好物0元领！',
                                    dec: '新人尊享，价值269元好礼在等你，惊喜连连福利不断~',
                                    linkUrl: this.linkUrl,
                                    thumImage: `${apiEnvironment.getCurrentOssHost()}/sharegoods/h5/resource/icon/shareIcon.png`,
                                }}
                                trackParmas={{QrCodeID: this.linkUrl}}
                                trackEvent={trackEvent.QrCodeShareto}
                                taskShareParams={{ //分享完成后，请求后台
                                    uri: this.linkUrl,
                                    code: 10,
                                    data: ''
                                }}
                    // luckyDraw={true}
                />
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.height * 264 / 667,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10
    },
    wenanStyle: {
        width: ScreenUtils.width - 80,
        height: (ScreenUtils.width - 80) * 118 / 292,
        marginTop: 29
    },
    textBgStyle: {
        height: autoSizeWidth(58),
        width: ScreenUtils.width - 116,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnContainer: {
        borderRadius: autoSizeWidth(25),
        width: autoSizeWidth(145),
        height: autoSizeWidth(50),
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        bottom: 0,
        position: 'absolute',
        width: ScreenUtils.width,
        height: autoSizeWidth(ScreenUtils.width * 1334 / 750),
        alignItems: 'center'
    },
    logo: {
        width: autoSizeWidth(40),
        height: autoSizeWidth(40),
        top: autoSizeWidth(60),
        left: autoSizeWidth(60),
        position: 'absolute',
        borderRadius: autoSizeWidth(20),
        overflow: 'hidden'
    }
});
