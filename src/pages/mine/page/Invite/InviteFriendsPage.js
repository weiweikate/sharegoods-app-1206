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
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import {UIImage} from '../../../../components/ui'
import {MRText as Text} from '../../../../components/ui'

const autoSizeWidth = ScreenUtils.autoSizeWidth;
import CommShareModal from '../../../../comm/components/CommShareModal';
import bridge from '../../../../utils/bridge';
import apiEnvironment from '../../../../api/ApiEnvironment';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import user from '../../../../model/user';
import { trackEvent, track} from '../../../../utils/SensorsTrack';

const {
    button: {
        white_back
    },
    invite: {
        bg,
        button,
        hongbao,
        wenan
    }
} = res;

type Props = {};
export default class InviteFriendsPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            disable: false,
            path: ''
        };
        this._bind();
        this.linkUrl = `${apiEnvironment.getCurrentH5Url()}/register?upuserid=${user.code || ''}`;
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
        this.loadPageData();
    }

    loadPageData() {
        this.creatQRCodeImage(this.linkUrl);
    }

    creatQRCodeImage(QRCodeStr) {
        bridge.creatQRCodeImage(QRCodeStr, (path) => {
            this.setState({ path: Platform.OS === 'android' ? 'file://' + path : '' + path });
        });
    }

    //截屏
    _saveImg = () => {
        track(trackEvent.QrcodeShareto, {qrCodeID: this.linkUrl, shareMethod: '保存图片'})
        this.setState({
            disable: true
        }, () => {
            bridge.saveInviteFriendsImage(this.linkUrl, () => {
                this.$toastShow('保存成功');
                this.__timer__ = setTimeout(() => {
                    this.setState({
                        disable: false
                    });
                }, 2500);
            }, () => {
                this.$toastShow('保存失败');
                this.setState({
                    disable: false
                });
            });
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                <Image source={bg}
                       style={{ width: ScreenUtils.width, height: ScreenUtils.height, position: 'absolute' }}/>
                <View style={{ flex: 1 }}/>
                <UIImage source={wenan}
                         style={{
                             width: autoSizeWidth(174),
                             height: autoSizeWidth(70),
                             marginBottom: 30,
                             alignSelf: 'flex-start',
                             marginLeft: 50
                         }}/>
                <UIImage source={hongbao}
                         style={{
                             width: autoSizeWidth(350),
                             height: autoSizeWidth(490) + ScreenUtils.safeBottom

                         }}/>
                <TouchableWithoutFeedback onPress={() => {
                    this.$navigateBack();
                }}>
                    <View style={{
                        width: 44,
                        height: 44,
                        top: ScreenUtils.statusBarHeight,
                        left: 0,
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <UIImage source={white_back}
                                 style={{
                                     width: 10,
                                     height: 18
                                 }}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{
                    backgroundColor: 'white',
                    width: autoSizeWidth(180),
                    height: autoSizeWidth(180),
                    bottom: autoSizeWidth(200),
                    left: autoSizeWidth(85 + 12.5),
                    position: 'absolute',
                    shadowColor: DesignRule.mainColor,
                    shadowOpacity: 0.3,
                    justifyContent:'center',
                    alignItems:'center',
                }}>
                    <UIImage source={{ uri: this.state.path }}
                             style={{
                                 width: autoSizeWidth(160),
                                 height: autoSizeWidth(160)
                             }}/>
                </View>
                <View style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    left: 0,
                    width: ScreenUtils.width,
                    bottom: 35 + ScreenUtils.safeBottom,
                    alignItems: 'center',
                    paddingHorizontal: 40
                }}>
                    <TouchableOpacity onPress={this._saveImg} disabled={this.state.disable}>
                        <ImageBackground source={button} style={styles.btnContainer} onPress={this._saveImg}>

                            <Text style={styles.btnText}>
                                保存图片
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}/>
                    <TouchableOpacity onPress={() => {
                        this.shareModal.open();
                    }}>
                        <ImageBackground source={button} style={styles.btnContainer}>
                            <Text style={styles.btnText}>
                                立即分享
                            </Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                    // type={'promotionShare'}
                    //  imageJson={{
                    //      imageUrlStr: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539577593172&di=c87eead9eb2e2073b50758daf6194c62&imgtype=0&src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Farchive%2F59c914525c484566292f8d8d3d29c964ca59c7ca.jpg',
                    //      titleStr: '商品标题',
                    //      priceStr: '¥100.00',
                    //      QRCodeStr: '分享的链接'
                    //  }}
                                webJson={{
                                    title: '分享好友免费领取福利',
                                    dec: '属你的惊喜福利活动\n数量有限赶快参与吧～',
                                    linkUrl: this.linkUrl,
                                    thumImage: 'logo.png'
                                }}
                    // miniProgramJson = {{
                    //     title: '分享小程序title',
                    //     dec: '分享小程序子标题',
                    //     thumImage: 'logo.png',
                    //     linkUrl: '${apiEnvironment.getCurrentH5Url()}/pages/index/index',
                    //     userName: 'gh_3ac2059ac66f',
                    //     miniProgramPath: 'pages/index/index'}}
                                trackParmas={{QrCodeID: this.linkUrl}}
                                trackEvent={trackEvent.QrcodeShareto}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    btnContainer: {
        borderRadius: autoSizeWidth(25),
        width: autoSizeWidth(145),
        height: autoSizeWidth(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    btnText: {
        fontSize: DesignRule.fontSize_mediumBtnText,
        color: 'white'
    }
});
