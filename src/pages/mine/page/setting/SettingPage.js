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
            showUpdate: false
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
                    {/*{this.renderLine()}*/}
                    {/*<TouchableOpacity style={styles.viewStyle}*/}
                    {/*onPress={() => this.getNewVersion()}>*/}
                    {/*<UIText value={'版本检测'} style={styles.blackText}/>*/}
                    {/*<UIText value={'v' + DeviceInfo.getVersion()}*/}
                    {/*style={[styles.blackText]}/>*/}
                    {/*<Image source={arrow_right} style={{ width: 12, height: 20 }} resizeMode={'contain'}/>*/}
                    {/*</TouchableOpacity>*/}
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
                        // 正常退出，或者登录超时，都去清空数据
                        user.clearUserInfo();
                        user.clearToken();
                        //清空购物车
                        shopCartStore.data = [];
                        this.$navigateReset();
                        MineApi.signOut()
                        this.$loadingDismiss();
                            
                    }}
                    no={() => {
                        this.setState({ isShowLoginOutModal: false });
                    }}
                />
                {/*<CommModal*/}
                {/*animationType='fade'*/}
                {/*transparent={true}*/}
                {/*visible={this.state.isShow}>*/}
                {/*<View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>*/}
                {/*{this.renderContent()}*/}
                {/*</View>*/}
                {/*</CommModal>*/}
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
    // getNewVersion = () => {
    //     // Android调用原生检测版本
    //     MineApi.getVersion().then((data) => {
    //         // 调用原生dialog
    //     }).catch((data) => {
    //         bridge.$toast(data.msg);
    //     });
    // };
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
