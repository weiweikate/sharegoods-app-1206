import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    NativeModules,
    TouchableOpacity, Alert, Switch, Platform, AsyncStorage,
    Linking,
    DeviceEventEmitter
} from 'react-native';

const { CachesModule } = NativeModules;
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import shopCartStore from '../../../shopCart/model/ShopCartStore';
import DeviceInfo from 'react-native-device-info';
import bridge from '../../../../utils/bridge';
import DesignRule from '../../../../constants/DesignRule';
// import QYChatUtil from '../helper/QYChatModel';
import res from '../../res';
import { getSizeFromat } from '../../../../utils/FileSizeFormate';
import { homeModule } from '../../../home/model/Modules';
import { logout } from '../../../../utils/SensorsTrack';
import { MRText as Text } from '../../../../components/ui';
import userOrderNum from '../../../../model/userOrderNum';
import apiEnvironment from '../../../../api/ApiEnvironment';
import loginModel from '../../../login/model/LoginModel';
import StringUtils from '../../../../utils/StringUtils';
import { QYChatTool } from '../../../../utils/QYModule/QYChatTool';
import WhiteModel from '../../../show/model/WhiteModel';

/**
 * @author luoyongming
 * @date on 2018/9/13
 * @describe 设置页面
 * @org www.sharegoodsmall.com
 * @email luoyongming@meeruu.com
 */

const arrow_right = res.button.arrow_right;

class SettingPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            isShowLoginOutModal: false,
            updateData: {},
            showUpdate: false,
            version: DeviceInfo.getVersion(),
            updateContent: '',
            value: true
        };
    }

    $navigationBarOptions = {
        title: '设置',
        show: true // false则隐藏导航
        // hiddenNav:false
    };

    //CachesModule
    componentDidMount() {
        this.getAllCachesSize();
        if (Platform.OS === 'android') {
            bridge.isPushStopped((value) => {
                this.setState({
                    value: !value
                });
            });
        }
    }

    //**********************************ViewPart******************************************
    _render = () => {
        return (
            <View style={styles.container}>

                {this.renderWideLine()}
                <View style={{ backgroundColor: 'white' }}>
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumpToAccountSettingPage()}>
                        <UIText value={'账号与安全'} style={styles.blackText}/>
                        <Image source={arrow_right}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumpToAddressManagePage()}>
                        <UIText value={'收货地址管理'} style={styles.blackText}/>
                        <Image source={arrow_right}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    {Platform.OS === 'ios' ? null :
                        <View>
                            <TouchableOpacity style={styles.viewStyle}>
                                <UIText value={'消息推送'} style={styles.blackText}/>
                                <Switch value={this.state.value}
                                        onTintColor={'#00D914'}
                                        thumbTintColor={Platform.OS === 'android' ? 'white' : ''}
                                        tintColor={DesignRule.textColor_hint}
                                        onValueChange={(value) => {
                                            this.setState({
                                                value: value
                                            });
                                            if (value) {
                                                bridge.resumePush();
                                            } else {
                                                bridge.stopPush();
                                            }
                                        }}/>
                            </TouchableOpacity>
                            {this.renderLine()}
                        </View>}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.clearAllCaches()}>
                        <UIText value={'清除缓存'} style={styles.blackText}/>
                        <UIText value={this.state.memorySize}
                                style={{ fontSize: 13, color: DesignRule.textColor_secondTitle }}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumptToAboutUsPage()}>
                        <UIText value={'关于我们'} style={styles.blackText}/>
                        <Image source={arrow_right}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle}
                                      onPress={() => this.getNewVersion()}>
                        <UIText value={'版本检测'} style={[styles.blackText, { flex: 1 }]}/>
                        <UIText value={'当前版本v' + this.state.version}
                                style={{ fontSize: 13, color: DesignRule.textColor_secondTitle }}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{
                    marginTop: 42,
                    backgroundColor: DesignRule.mainColor,
                    width: ScreenUtils.width - 84,
                    height: 50,
                    marginLeft: 42,
                    marginRight: 42,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 25
                }} onPress={() => this.toLoginOut()}>
                    <Text style={{ fontSize: 17, color: 'white' }}>退出登录</Text>
                </TouchableOpacity>

            </View>
        );
    };
    clearAllCaches = () => {
        Alert.alert('提示', '确定清理缓存?',
            [
                {
                    text: '取消', onPress: () => {
                    }
                },
                {
                    text: '确定', onPress: () => {
                        if (ScreenUtils.isIOS) {
                            CachesModule.clearCaches(() => {
                                this.getAllCachesSize();
                            });
                        } else {
                            bridge.clearAllCache(() => {
                                this.getAllCachesSize();
                            });
                        }
                    }
                }
            ]
        );
    };

    getAllCachesSize = () => {
        if (ScreenUtils.isIOS) {
            CachesModule && CachesModule.getCachesSize((allSize) => {
                let temp = getSizeFromat(allSize);
                this.setState({
                    memorySize: temp
                });
            });
        } else {
            bridge.getTotalCacheSize((allSize) => {
                let temp = getSizeFromat(allSize);
                this.setState({
                    memorySize: temp
                });
            });
        }
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };
    renderLine = () => {
        return (
            <View style={{
                height: 0.5,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginLeft: 15,
                marginRight: 15
            }}/>
        );
    };
    toLoginOut = () => {
        Alert.alert(
            '退出登录',
            '是否确认退出登录',
            [
                {
                    text: '取消', onPress: () => {
                    }
                },
                {
                    text: '确认', onPress: () => {
                        AsyncStorage.removeItem('lastMessageTime').catch(e => {
                        });
                        // this.$loadingShow();
                        // 正常退出，或者登录超时，都去清空数据
                        user.clearUserInfo();
                        user.clearToken();
                        userOrderNum.clean();
                        bridge.clearCookies();
                        loginModel.clearPassword();
                        //清空购物车
                        shopCartStore.data = [];
                        this.$navigateBackToHome();
                        DeviceEventEmitter.emit('login_out');
                        homeModule.loadHomeList();
                        MineApi.signOut();
                        // 退出七鱼
                        QYChatTool.qiYULogout();
                        this.$loadingDismiss();
                        WhiteModel.clearStatus();
                        // 神策退出登录
                        logout();
                    }
                }
            ]
        );
    };


    //**********************************BusinessPart******************************************
    jumpToAddressManagePage = () => {
        this.$navigate('mine/address/AddressManagerPage');
    };
    jumptToAboutUsPage = () => {
        this.$navigate('HtmlPage', {
            title: '关于我们',
            uri: apiEnvironment.getCurrentH5Url() + '/static/protocol/about-us.html'
        });
    };
    // 账户设置
    jumpToAccountSettingPage = () => {
        if (user.isLogin) {
            this.$navigate('mine/setting/AccountSettingPage');
        } else {
            this.gotoLoginPage();
        }
    };

    // 版本检测
    getNewVersion = () => {
        // Android调用原生检测版本
        MineApi.getVersion({ version: DeviceInfo.getVersion() }).then((resp) => {
            if (resp.data.upgrade === 1) {
                Alert.alert('提示', '是否更新为V' + resp.data.version + '版本？',
                    [
                        {
                            text: '取消', onPress: () => {
                            }
                        },
                        {
                            text: '确定', onPress: () => {
                                this.toUpdate(resp.data);
                            }
                        }
                    ]
                );
            } else {
                bridge.$toast('当前已是最新版本');
            }
        }).catch((data) => {
            bridge.$toast(data.msg);
        });
    };

    toUpdate = (data) => {
        this.setState({
            showUpdate: false
        });
        if (Platform.OS === 'ios') {
            // 前往appstore
            if (StringUtils.isEmpty(data.url)) {
                Linking.openURL('https://itunes.apple.com/cn/app/id1439275146');
            } else {
                Linking.openURL(data.url);
            }
        } else {
            // 更新app
            NativeModules.commModule.updateable(JSON.stringify(data), false, null);
        }
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: DesignRule.bgColor,
        flexDirection: 'column',
        flex: 1
    },
    viewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 21,
        paddingRight: 23,
        backgroundColor: 'white',
        height: 44,
        alignItems: 'center'
    },
    blackText: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    }
});

export default SettingPage;
