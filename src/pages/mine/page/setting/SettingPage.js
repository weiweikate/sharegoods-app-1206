import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    NativeModules,
    TouchableOpacity, Alert, Switch, Text, Platform
} from 'react-native';

const { CachesModule } = NativeModules;
import BasePage from '../../../../BasePage';
import CommonTwoChoiceModal from '../../model/CommonTwoChoiceModal';
import UIText from '../../../../components/ui/UIText';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';
import arrow_right from '../../../mine/res/customerservice/icon_06-03.png';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import shopCartStore from '../../../shopCart/model/ShopCartStore';
import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import bridge from '../../../../utils/bridge';
import CommModal from 'CommModal';


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
            memorySize: 0,
            updateData: {},
            showUpdate: false,
            version: DeviceInfo.getVersion(),
            updateContent: ''
        };
    }

    $navigationBarOptions = {
        title: '设置',
        show: true // false则隐藏导航
        // hiddenNav:false
    };

    //CachesModule
    _componentDidMount() {
        this.getAllCachesSize();
    }

    //**********************************ViewPart******************************************
    _render = () => {
        const desc = ((this.state.memorySize / 1024 / 1024) > 1) ? `${(this.state.memorySize / 1024 / 1024).toFixed(2)}G` : (((this.state.memorySize / 1024) > 1) ? `${(this.state.memorySize / 1024).toFixed(2)}M` : `${(this.state.memorySize).toFixed(2)}kb`);
        return (
            <View style={styles.container}>
                {this.renderModal()}
                {this.renderWideLine()}
                <View style={{ backgroundColor: 'white' }}>
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumpToAccountSettingPage()}>
                        <UIText value={'账号与安全'} style={styles.blackText}/>
                        <Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumpToAddressManagePage()}>
                        <UIText value={'收货地址管理'} style={styles.blackText}/>
                        <Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle}>
                        <UIText value={'消息推送'} style={styles.blackText}/>
                        <Switch value={this.state.value}
                                onTintColor={'#00D914'}
                                thumbTintColor={Platform.OS === 'android' ? 'white' : ''}
                                tintColor={'#C8C8C8'}
                                onValueChange={(value) => {
                                    this.setState({
                                        value: value,
                                        changeTxt: value ? 'switch 打开了' : 'switch 关闭了'
                                    });
                                }}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.clearAllCaches()}>
                        <UIText value={'清除缓存'} style={styles.blackText}/>
                        <UIText value={desc}
                                style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, color: '#666666' }}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle} onPress={() => this.jumptToAboutUsPage()}>
                        <UIText value={'关于我们'} style={styles.blackText}/>
                        <Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
                    </TouchableOpacity>
                    {this.renderLine()}
                    <TouchableOpacity style={styles.viewStyle}
                                      onPress={() => this.getNewVersion()}>
                        <UIText value={'版本检测'} style={[styles.blackText, { flex: 1 }]}/>
                        <UIText value={'当前版本v' + this.state.version}
                                style={{ fontSize: 13, color: '#666666' }}/>
                        <Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{
                    marginTop: 42,
                    backgroundColor: color.red,
                    width: ScreenUtils.width - 84,
                    height: 48,
                    marginLeft: 42,
                    marginRight: 42,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5
                }} onPress={() => this.toLoginOut()}>
                    <Text style={{ fontSize: 13, color: 'white' }}
                          onPress={() => this.toLoginOut()}>退出登录</Text>
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
                                // 清楚七鱼缓存
                                // NativeModules.commModule.toast('删除成功');
                            });
                        } else {
                            // NativeModules.commModule.toast('暂未对接缓存模块');
                        }
                    }
                }
            ]
        );
    };
    getAllCachesSize = () => {
        CachesModule && CachesModule.getCachesSize((allSize) => {
            this.setState({
                memorySize: allSize
            });
        });
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: color.page_background }}/>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: '#eeeeee', marginLeft: 15, marginRight: 15 }}/>
        );
    };
    toLoginOut = () => {
        this.setState({ isShowLoginOutModal: true });

    };
    renderModal = () => {
        return (
            <View>
                <CommonTwoChoiceModal
                    isShow={this.state.isShowLoginOutModal}
                    detail={{ title: '', context: '是否确认退出登录', no: '取消', yes: '确认' }}
                    closeWindow={() => {
                        this.setState({ isShowLoginOutModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowLoginOutModal: false });
                        this.$loadingShow();
                        MineApi.signOut().then((response) => {
                            this.$loadingDismiss();
                            if (response.code === 10000) {
                                // 正常退出，或者登录超时，都去清空数据
                                //this.params.callBack&&this.params.callBack();
                                user.clearUserInfo();
                                user.clearToken();
                                //清空购物车
                                shopCartStore.data = [];
                                this.$navigateReset();
                            }
                        }).catch(err => {
                            this.$loadingDismiss();
                            this.$toastShow(err.msg);
                            if (err.code === 10009) {
                                user.clearUserInfo();
                                // this.$navigate('login/login/LoginPage');
                                let resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
                                    ]
                                });
                                this.props.navigation.dispatch(resetAction);
                            }
                        });
                    }}
                    no={() => {
                        this.setState({ isShowLoginOutModal: false });
                    }}
                />
                <CommModal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.showUpdate}>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center',
                        backgroundColor: '#fff',
                        width: ScreenUtils.width - 84,
                        borderRadius: 10,
                        borderWidth: 0
                    }}>
                        <UIText value={this.state.updateContent}
                                style={{
                                    fontSize: 17,
                                    color: '#333',
                                    marginTop: 40,
                                    marginBottom: 40,
                                    alignSelf: 'center'
                                }}/>
                        <View style={{ height: 0.5, backgroundColor: '#eee' }}/>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 45 }}
                                onPress={() => {
                                    this.setState({ showUpdate: false });
                                }}>
                                <UIText value={'以后再说'} style={{ color: '#999' }}/>
                            </TouchableOpacity>
                            <View style={{ width: 0.5, backgroundColor: '#eee' }}/>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 45,
                                    backgroundColor: '#d51243',
                                    borderBottomRightRadius: 10
                                }}
                                onPress={() => {
                                    this.toUpdate();
                                }}>
                                <UIText value={'立即更新'} style={{ color: '#fff' }}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </CommModal>
            </View>

        );
    };

    //**********************************BusinessPart******************************************


    jumpToAddressManagePage = () => {
        this.$navigate('mine/address/AddressManagerPage');
    };
    jumptToAboutUsPage = () => {
        this.$navigate('mine/setting/AboutUsPage');
    };
    // 账户设置
    jumpToAccountSettingPage = () => {
        this.$navigate('mine/setting/AccountSettingPage');
    };

    // 版本检测
    getNewVersion = () => {
        // Android调用原生检测版本
        MineApi.getVersion({ vsersion: this.state.version }).then((res) => {
            if (res.data.upgrade === 1) {
                this.setState({
                    updateData: res.data,
                    showUpdate: true,
                    updateContent: '是否更新为V' + res.data.version + '版本？'
                });
            } else {
                bridge.$toast('当前已是最新版本');
            }
        }).catch((data) => {
            bridge.$toast(data.msg);
        });
    };

    toUpdate = () => {
        this.setState({
            showUpdate: false
        });
        if (Platform.OS === 'ios') {
            // 前往appstore
        } else {
            // 更新app
            NativeModules.commModule.updateable(JSON.stringify(this.state.updateData), false);
        }
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.page_background,
        flexDirection: 'column'
    },
    viewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 21,
        paddingRight: 23,
        backgroundColor: color.white,
        height: 44,
        alignItems: 'center'
    },
    blackText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#222222'
    }
});

export default SettingPage;
