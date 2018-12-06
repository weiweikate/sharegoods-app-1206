import React from 'react';
import {
    View,
    StyleSheet,
    AppState,
    Linking
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
import geolocation from '@mr/geolocation';
import ConfirmAlert from '../../components/ui/ConfirmAlert';
import ScreenUtils from '../../utils/ScreenUtils';

@observer
export default class MyShop_RecruitPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            data: {},
            isHome: !this.params.storeId,
            permissionsErr: ''
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

                if (this.state.permissionsErr === 'permissionsErr') {
                    this.ConfirmAlert.show({
                        title: `定位服务未开启，请进入系统【设置】【隐私】【定位服务】中打开开关，并且允许秀购使用定位服务`,
                        closeCallBack: () => {
                            this.$navigateBackToHome();
                        },
                        confirmCallBack: () => {
                            this.$navigateBackToHome();
                            if (ScreenUtils.isIOS) {
                                Linking.openURL('app-settings:');
                            }
                        },
                        rightText: '去设置'
                    });
                }

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

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    componentDidMount() {
        this._loadPageData();
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            //初始化init  定位存储  和app变活跃 会定位
            this.state.permissionsErr = '';
            geolocation.getLastLocation().then(result => {
                Storage.set('storage_MrLocation', result);
            }).catch((error) => {
                    this.state.permissionsErr = error.code;
                }
            );
        }
    };

    _loadPageData = () => {
        const { isHome } = this.state;
        spellStatusModel.getUser(0).then((data) => {
            if (isHome) {//首页
                this.setState({
                    loadingState: PageLoadingState.success
                });
            } else {//其他店铺 有权限或者自己的能看
                if (spellStatusModel.canSeeGroupStore || spellStatusModel.storeId === this.params.storeId) {
                    SpellShopApi.getById({ id: this.params.storeId }).then((data) => {
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
        if (isHome ? user.isLogin : (spellStatusModel.canSeeGroupStore || spellStatusModel.storeId === this.params.storeId) && user.isLogin) {
            //首页
            switch (statust) {
                case 1://店铺开启中
                    return <MyShopPage navigation={this.props.navigation}
                                       leftNavItemHidden={isHome}
                                       storeId={this.params.storeId}/>;
                case 3://招募中的店铺
                    return <ShopRecruitPage navigation={this.props.navigation}
                                            leftNavItemHidden={isHome}
                                            storeId={this.params.storeId}
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
                <ConfirmAlert ref={(ref) => this.ConfirmAlert = ref}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

