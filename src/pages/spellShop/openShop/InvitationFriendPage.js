//邀请好友加入店铺
import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import QRCode from 'react-native-qrcode';
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';
import CommShareModal from '../../../comm/components/CommShareModal';
import bridge from '../../../utils/bridge';
import apiEnvironment from '../../../api/ApiEnvironment';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import user from '../../../model/user';
import UIImage from '@mr/image-placeholder';
import {
    MRText as Text
} from '../../../components/ui';


const Banner = res.openShop.yqhy_03;
const Center = res.openShop.yqhy_04;
const yqhy_Btn = res.openShop.yqhy_Btn;

const gap = -5;

export default class InvitationToShopPage extends BasePage {

    $navigationBarOptions = {
        title: '邀请好友加入店铺'
    };

    constructor(props) {
        super(props);
        this.state = {
            disable: false,
            codeString: `${apiEnvironment.getCurrentH5Url()}/download?upuserid=${user.code || ''}`,
            wxTip: '分享至微信，为您的店铺增添活力'
        };
    }

    info = {};

    componentDidMount() {
    }

    //截屏
    _saveImg = () => {
        const shareInfo = this.params.shareInfo || {};
        const { manager = {} } = shareInfo;
        this.setState({
            disable: true
        }, () => {
            bridge.saveShopInviteFriendsImage({
                headerImg: `${shareInfo.headUrl}`,
                shopName: `${shareInfo.name}`,
                shopId: `ID: ${shareInfo.showNumber}`,
                shopPerson: `店主: ${manager.nickname || ''}`,
                codeString: this.state.codeString,
                wxTip: this.state.wxTip
            }, () => {
                this.setState({
                    disable: false
                });
                this.$toastShow('保存成功');
            }, () => {
                this.setState({
                    disable: false
                });
                this.$toastShow('保存失败');
            });
        });
    };

    _shareImg = () => {
        this.shareModal.open();
    };

    _onLayout = ({ nativeEvent }) => {
        const { layout } = nativeEvent;
        this.info.width = layout.width - (gap * 2);
        this.info.height = layout.height - (gap * 2);
        this.info.left = 40 + gap;
    };

    _onLayoutImg = ({ nativeEvent }) => {
        const { layout } = nativeEvent;
        this.info.imgHeight = layout.height;
    };

    _render() {
        // 需要分享的参数信息
        const shareInfo = this.params.shareInfo || {};
        const { manager = {} } = shareInfo;
        const imgWidth = ScreenUtils.width;
        let imgHeight = ScreenUtils.height - ScreenUtils.headerHeight;
        let minHeight = ScreenUtils.autoSizeHeight(171) + ScreenUtils.autoSizeWidth(35 + 8 + 380) + 8;
        imgHeight = imgHeight < minHeight ? minHeight : imgHeight;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <ImageBackground style={{
                            alignItems: 'center',
                            width: imgWidth,
                            height: imgHeight
                        }} source={Center} resizeMode={'stretch'}>
                            <ImageBackground style={{
                                marginTop: ScreenUtils.autoSizeHeight(171),
                                width: ScreenUtils.autoSizeWidth(325),
                                height: ScreenUtils.autoSizeWidth(380)
                            }} source={Banner}>
                                <View style={{ height: ScreenUtils.autoSizeWidth(130), justifyContent: 'center' }}>
                                    <View style={styles.topContainer}>
                                        {
                                            shareInfo.headUrl ?
                                                <UIImage style={styles.topImg} source={{ uri: shareInfo.headUrl }}/> :
                                                <View style={styles.topImg}/>
                                        }
                                        <View style={{ justifyContent: 'space-between' }}>
                                            <Text style={styles.text}
                                                  allowFontScaling={false}>{shareInfo.name || ''}</Text>
                                            <Text style={styles.text}
                                                  allowFontScaling={false}>店铺ID：{shareInfo.showNumber || ''}</Text>
                                            <Text style={styles.text}
                                                  allowFontScaling={false}>店主：{manager.nickname || ''}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.qrContainer}>
                                    <QRCode
                                        value={this.state.codeString}
                                        size={ScreenUtils.autoSizeWidth(136)}
                                        bgColor={DesignRule.textColor_mainTitle}
                                        fgColor={'white'}/>
                                </View>
                                <Text style={styles.wxTip} allowFontScaling={false}>{this.state.wxTip}</Text>
                            </ImageBackground>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: ScreenUtils.autoSizeWidth(8),
                                justifyContent: 'center'
                            }}>
                                <TouchableOpacity onPress={this._saveImg}
                                                  disabled={this.state.disable}>
                                    <ImageBackground source={yqhy_Btn} style={styles.bottomBtn}>
                                        <Text style={styles.textBtn} allowFontScaling={false}>保存图片</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginLeft: 20 }}
                                                  onPress={this._shareImg}>
                                    <ImageBackground source={yqhy_Btn} style={styles.bottomBtn}>
                                        <Text style={styles.textBtn} allowFontScaling={false}>分享到...</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </View>
                </ScrollView>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                webJson={{
                                    title: `加入店铺:${shareInfo.name}`,
                                    dec: '店铺',
                                    linkUrl: this.state.codeString,
                                    thumImage: `${shareInfo.headUrl}`
                                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topContainer: {
        flexDirection: 'row'
    },
    topImg: {
        width: ScreenUtils.autoSizeWidth(68),
        height: ScreenUtils.autoSizeWidth(68),
        borderRadius: ScreenUtils.autoSizeWidth(34),
        marginRight: ScreenUtils.autoSizeWidth(12),
        marginLeft: ScreenUtils.autoSizeWidth(26 + 14.5)
    },


    text: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    qrContainer: {
        alignSelf: 'center',
        width: ScreenUtils.autoSizeWidth(136),
        height: ScreenUtils.autoSizeWidth(136),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: ScreenUtils.autoSizeWidth(20)
    },

    wxTip: {
        alignSelf: 'center',
        fontSize: 13,
        color: DesignRule.textColor_secondTitle,
        marginTop: 15
    },
    bottomBtn: {
        height: ScreenUtils.autoSizeWidth(35),
        width: ScreenUtils.autoSizeWidth(94),
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBtn: {
        fontSize: 12,
        color: DesignRule.textColor_mainTitle
    }

});
