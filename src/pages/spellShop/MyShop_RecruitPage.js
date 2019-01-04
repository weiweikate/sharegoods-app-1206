import React from 'react';
import {
    View,
    StyleSheet,
    AppState,
    Linking,
    PermissionsAndroid, Alert, NetInfo
} from 'react-native';

import BasePage from '../../BasePage';

import { observer } from 'mobx-react';
import MyShopPage from './myShop/MyShopPage';
import ShopRecruitPage from './shopRecruit/ShopRecruitPage';
import RecommendPage from './recommendSearch/RecommendPage';
import SpellShopApi from './api/SpellShopApi';
import { PageLoadingState, renderViewByLoadingState } from '../../components/pageDecorator/PageState';
import spellStatusModel from './model/SpellStatusModel';
import NoAccessPage from './NoAccessPage';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar';
import user from '../../model/user';
import Storage from '../../utils/storage';
import geolocation from '@mr/rn-geolocation';
import ScreenUtils from '../../utils/ScreenUtils';

@observer
export default class MyShop_RecruitPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            data: {},
            isHome: !this.params.storeCode
        };
    }

    $navigationBarOptions = {
        show: false
    };

    _getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: () => {
                    this._loadPageData();
                }
            }
        };
    };

    componentWillMount() {
        AppState.addEventListener('change', this._handleAppStateChange);

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;

                NetInfo.isConnected.fetch().done((isConnected) => {
                    // 有网络
                    if (isConnected) {
                        // 请求定位
                        geolocation.getLastLocation().then(result => {
                            Storage.set('storage_MrLocation', result);
                        }).catch((error) => {
                                spellStatusModel.permissionsErr = error.code;
                                if (spellStatusModel.permissionsErr === 'permissionsErr' || spellStatusModel.permissionsErr === '12') {
                                    Alert.alert('提示', '定位服务未开启，请进入系统－设置－定位服务中打开开关，允许秀购使用定位服务',
                                        [
                                            {
                                                text: '取消', onPress: () => {
                                                    this.$navigateBackToHome();
                                                }
                                            },
                                            {
                                                text: '去设置', onPress: () => {
                                                    if (ScreenUtils.isIOS) {
                                                        Linking.openURL('app-settings:');
                                                    } else {
                                                        if (spellStatusModel.permissionsErr === '12') {
                                                            geolocation.goLocationSetting();
                                                        } else {
                                                            PermissionsAndroid.request(
                                                                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                                                                {
                                                                    message:
                                                                        '定位服务未开启，请进入系统－设置－应用－应用管理－权限管理中打开开关，并且允许秀购使用定位服务',
                                                                    buttonNegative: '取消',
                                                                    buttonPositive: '确定'
                                                                }
                                                            );
                                                        }
                                                    }
                                                    this.$navigateBackToHome();
                                                }
                                            }
                                        ],
                                        { cancelable: false }
                                    );
                                }
                            }
                        );

                    } else {
                        this.$toastShow('网络异常，请检查网络连接');
                    }
                });
                if (!this.unFirst) {//第一次不多余刷新user
                    this.unFirst = true;
                    return;
                }
                if (state && state.routeName === 'MyShop_RecruitPage') {//tab出现的时候刷新user
                    spellStatusModel.getUser(0).then().catch((error) => {
                    });
                }
            }
        );
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            //初始化init  定位存储  和app变活跃 会定位
            spellStatusModel.permissionsErr = '';
            geolocation.getLastLocation().then(result => {
                Storage.set('storage_MrLocation', result);
            }).catch((error) => {
                    spellStatusModel.permissionsErr = error.code;
                }
            );
        }
    };

    componentDidMount() {
        this._loadPageData();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    _loadPageData = () => {
        const { isHome } = this.state;
        spellStatusModel.getUser(0).then((data) => {
            if (isHome) {//首页
                this.setState({
                    loadingState: PageLoadingState.success
                });
            } else {//其他店铺 有权限或者自己的能看
                if (spellStatusModel.canSeeGroupStore || spellStatusModel.storeCode === this.params.storeCode) {
                    SpellShopApi.getById({ storeCode: this.params.storeCode }).then((data) => {
                        let dataTemp = data.data || {};
                        this.setState({
                            loadingState: PageLoadingState.success,
                            data: dataTemp
                        });
                    }).catch((error) => {
                        this._error(error);
                    });
                } else {
                    this.setState({
                        loadingState: PageLoadingState.success
                    });
                }
            }
        }).catch((error) => {
            this._error(error);
        });
    };

    _error = (error) => {
        this.setState({
            loadingState: error.code === 10009 ? PageLoadingState.success : PageLoadingState.fail,
            netFailedInfo: error
        });
    };

    _renderContainer = () => {
        const { isHome } = this.state;
        const { status } = this.state.data;
        let statust = isHome ? spellStatusModel.storeStatus : status;
        //1.首页自己的店铺不管有无权限都能看
        //2.首页推荐页面缴纳了保证金的不管有没有权限都能看

        //3.非首页  自己的||有权限和首页逻辑一样
        if (isHome ? user.isLogin : (spellStatusModel.canSeeGroupStore || spellStatusModel.storeCode === this.params.storeCode) && user.isLogin) {
            //首页
            switch (statust) {
                case 1://店铺开启中
                    return <MyShopPage navigation={this.props.navigation}
                                       leftNavItemHidden={isHome}
                                       storeCode={this.params.storeCode}/>;
                case 3://招募中的店铺
                    return <ShopRecruitPage navigation={this.props.navigation}
                                            leftNavItemHidden={isHome}
                                            storeCode={this.params.storeCode}
                                            propReload={this._loadPageData}/>;//不是首页 关闭或者开启店铺
                case 2://店铺已缴纳保证金
                    return (
                        <RecommendPage navigation={this.props.navigation} leftNavItemHidden={isHome}/>);
                default://0 null
                    if (spellStatusModel.canSeeGroupStore) {
                        return (
                            <RecommendPage navigation={this.props.navigation} leftNavItemHidden={isHome}/>);
                    } else {
                        return (
                            <NoAccessPage navigation={this.props.navigation} leftNavItemHidden={isHome}/>);
                    }
            }
        } else {
            //拼店首页未登录   其他页面未登录||没权限
            return <NoAccessPage navigation={this.props.navigation} leftNavItemHidden={isHome}/>;
        }

    };

    _render() {
        let dic = this._getPageStateOptions();
        const { isHome } = this.state;
        return (
            //隐藏了导航栏 失败需要自定义状态管理页面
            <View style={styles.container}>
                {dic.loadingState === PageLoadingState.fail ?
                    <NavigatorBar title={isHome ? '拼店' : '店铺详情'} leftPressed={() => {
                        this.$navigateBack();
                    }} leftNavItemHidden={isHome}/> : null}
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderContainer)}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

