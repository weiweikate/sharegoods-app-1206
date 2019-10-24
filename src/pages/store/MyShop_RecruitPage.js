import React from 'react';
import { AppState, BackHandler, StyleSheet, View } from 'react-native';

import BasePage from '../../BasePage';
import NetInfo from '@react-native-community/netinfo';
import { observer } from 'mobx-react';
import MyShopPage from './myShop/MyShopPage';
import RecommendPage from './recommendSearch/RecommendPage';
import { PageLoadingState, renderViewByLoadingState } from '../../components/pageDecorator/PageState';
import spellStatusModel from './SpellStatusModel';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar';
import store from '@mr/rn-store';
import geolocation from '@mr/rn-geolocation';
import { track, trackEvent } from '../../utils/SensorsTrack';
import NoAccessPage from './NoAccessPage';

@observer
export default class MyShop_RecruitPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    _getPageStateOptions = () => {
        return {
            loadingState: spellStatusModel.loadingState,
            netFailedProps: {
                netFailedInfo: spellStatusModel.netFailedInfo,
                reloadBtnClick: () => {
                    this._loadPageData();
                }
            }
        };
    };

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            //初始化init和app变活跃 会定位存储
            geolocation.getLastLocation().then(result => {
                store.save('@mr/storage_MrLocation', result);
            }).catch((error) => {
            });
        }
    };

    handleBackPress = () => {
        this.$navigateBackToHome();
        return true;
    };

    componentDidMount() {
        //app状态
        AppState.addEventListener('change', this._handleAppStateChange);

        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
            }
        );
        //页面出现时
        this.willFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                if (!state.params) {//二级页面不返回首页 //安卓回退
                    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
                }
                NetInfo.fetch().then(state => {
                    // 有网络
                    if (state.isConnected) {
                        // 请求定位
                        geolocation.getLastLocation().then(result => {
                            store.save('@mr/storage_MrLocation', result);
                        }).catch((error) => {
                                spellStatusModel.alertAction(error, () => {
                                    this.$navigateBackToHome();
                                }, () => {
                                    this.$navigateBackToHome();
                                });
                            }
                        );
                    } else {
                        this.$toastShow('网络异常，请检查网络连接');
                    }
                });

                /*0：未知 1.V1用户页面 2.店铺列表 3.我的店铺*/
                let pinShopPageType = 1;
                if (spellStatusModel.storeStatus === 1 || spellStatusModel.storeStatus === 3) {
                    pinShopPageType = 3;
                } else if (spellStatusModel.canSeeGroupStore) {
                    pinShopPageType = 2;
                }
                track(trackEvent.ViewPinShop, { pinShopPageType });
                spellStatusModel.requestHome();
            }
        );
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
    }

    _renderContainer = () => {
        const { storeCode, errorCode } = spellStatusModel;
        if (storeCode) {
            return <MyShopPage wayToPinType={this.params.wayToPinType || 0}
                               navigation={this.props.navigation}
                               storeCode={storeCode}/>;
        } else if (errorCode === null) {
            return <RecommendPage navigation={this.props.navigation} isHome={true}/>;
        } else {
            return <NoAccessPage navigation={this.props.navigation}/>;
        }
    };

    _render() {
        return (
            <View style={styles.container}>
                {spellStatusModel.loadingState === PageLoadingState.fail &&
                <NavigatorBar title={'拼店'} leftPressed={() => {
                    this.$navigateBack();
                }} leftNavItemHidden={true}/>}
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

