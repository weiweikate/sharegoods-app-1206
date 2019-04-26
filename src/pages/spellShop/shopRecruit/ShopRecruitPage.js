//招募中店铺的页面
import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl, Alert
} from 'react-native';

import {
    MRText as Text
} from '../../../components/ui';

import RecruitMembersRow from './components/RecruitMembersRow';
import RecruitHeaderView from './components/RecruitHeaderView';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import ScreenUtils from '../../../utils/ScreenUtils';
import ActionSheetView from '../components/ActionSheetView';
import ReportAlert from '../components/ReportAlert';

// 图片资源
import spellStatusModel from '../model/SpellStatusModel';
// import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import CommShareModal from '../../../comm/components/CommShareModal';
import apiEnvironment from '../../../api/ApiEnvironment';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import resCommon from '../../../comm/res';
import user from '../../../model/user';
import LinearGradient from 'react-native-linear-gradient';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import { track, trackEvent } from '../../../utils/SensorsTrack';

const NavLeft = resCommon.button.white_back;
const icons8_Shop_50px = res.shopRecruit.icons8_Shop_50px;
const icons9_shop = res.shopRecruit.icons9_shop;

export default class ShopRecruitPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    _NavBarRenderRightItem = () => {
        return (<View style={styles.transparentView}>
                <View style={styles.leftBarItemContainer}>
                    {!this.props.leftNavItemHidden ?
                        <TouchableOpacity style={{ width: 44 }} onPress={() => {
                            this.$navigateBack();
                        }}>
                            <Image source={NavLeft}/>
                        </TouchableOpacity> : null}
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, color: '#ffffff' }} allowFontScaling={false}>店铺招募中</Text>
                </View>
                <View style={styles.rightBarItemContainer}>
                    <TouchableOpacity onPress={() => {
                        this.$navigate('spellShop/recommendSearch/RecommendPage');
                    }
                    }>
                        <Image style={{ marginRight: 10 }} source={icons8_Shop_50px}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._clickSettingItem}>
                        <Image source={icons9_shop}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            refreshing: false,

            storeCode: this.props.storeCode,
            storeData: {},
            canOpen: false
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._refreshing
            }
        };
    };

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                console.log('didFocus', state);
                if (state && state.routeName === 'MyShop_RecruitPage') {//tab出现的时候
                    this._loadPageData();
                }
            }
        );
    }

    _refreshing = () => {
        this.setState({
            refreshing: true
        }, () => {
            this._loadPageData();
            spellStatusModel.getUser(0);
        });
    };

    _loadPageData = () => {
        SpellShopApi.getById({ storeCode: this.state.storeCode }).then((data) => {
            let dataTemp = data.data || {};
            const { userCount, storeNumber, maxUser } = dataTemp;
            this.setState({
                loadingState: PageLoadingState.success,
                refreshing: false,

                storeData: dataTemp,
                storeCode: storeNumber,
                canOpen: maxUser && maxUser <= userCount
            });
            track(trackEvent.SeePingdian, {
                pinCode: storeNumber
            });
        }).catch((error) => {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: error,
                refreshing: false
            });
        });
    };

    _clickAllMembers = () => {
        //自己只能查看列表
        if (this.state.storeData.myStore) {
            this.$navigate('spellShop/myShop/ShopAssistantPage', { storeData: this.state.storeData });
        }
    };
    _clickSettingItem = () => {
        let arr = ['分享店铺'];
        this.actionSheetRef.show({
            items: arr
        }, (item, index) => {
            if (index === 0) {
                setTimeout(() => {
                    this.shareModal && this.shareModal.open();
                }, 500);
            } else if (index === 1) {
                // 举报弹框
                setTimeout(() => {
                    this.reportAlert && this.reportAlert.show({
                        confirmCallBack: (text) => {
                            SpellShopApi.storeTipOffInsert({
                                content: text,
                                storeCode: this.state.storeCode
                            }).then(() => {
                                this.$toastShow('举报成功');
                            }).catch((error) => {
                                this.$toastShow(error.msg);
                            });
                        }
                    });
                }, 500);
            }
        });
    };

    //关闭店铺
    _closeStore = () => {
        Alert.alert('提示', '确定取消招募成员?', [{
            text: '取消'
        }, {
            text: '确定', onPress: () => {
                this.$loadingShow();
                SpellShopApi.closeStore({ status: 0 }).then((data) => {
                    if (!this.props.leftNavItemHidden) {
                        this.$navigateBack();
                    }
                    spellStatusModel.getUser(2);
                    this.$loadingDismiss();
                }).catch((error) => {
                    this.$loadingDismiss();
                    this.$toastShow(error.msg);
                });
            }
        }]);
    };

    //开启店铺
    _openStore = () => {
        SpellShopApi.startStore({ status: 1 }).then((data) => {
            if (!this.props.leftNavItemHidden) {
                this.props.propReload();
            }
            spellStatusModel.getUser(2);
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    //加入店铺
    _joinStore = () => {
        // this.refs.delAlert && this.refs.delAlert.show({
        //     title: `·该店铺为新发起店铺，需满足人员招募后才会正式开启;\n·如开启成功，则自动加入;\n·如开启不成功，则可以选择加入其他店铺`,
        //     confirmCallBack: () => {
        //         this.$loadingShow();
        //         SpellShopApi.addToStore({ storeId: this.state.storeId }).then((data) => {
        //             if (!this.props.leftNavItemHidden) {
        //                 this._loadPageData();
        //             }
        //             spellStatusModel.getUser(2);
        //             this.$loadingDismiss();
        //         }).catch((error) => {
        //             this.$toastShow(error.msg);
        //             this.$loadingDismiss();
        //         });
        //     },
        //     alignType: 'left'
        // });

        Alert.alert('提示', '·该店铺为新发起店铺，需满足人员招募后才会正式开启;\n·如开启成功，则自动加入;\n·如开启不成功，则可以选择加入其他店铺',
            [
                {
                    text: '取消', onPress: () => {
                    }
                },
                {
                    text: '确定', onPress: () => {
                        this.$loadingShow();
                        SpellShopApi.addToStore({ storeCode: this.state.storeCode }).then((data) => {
                            if (!this.props.leftNavItemHidden) {
                                this._loadPageData();
                            }
                            spellStatusModel.getUser(2);
                            this.$loadingDismiss();
                        }).catch((error) => {
                            this.$loadingDismiss();
                            this.$toastShow(error.msg);
                        });
                    }
                }
            ]
        );

    };

    //退出店铺
    _quitStore = () => {
        Alert.alert('提示', '确定要退出么?', [{
            text: '取消'
        }, {
            text: '退出', onPress: () => {
                this.$loadingShow();
                SpellShopApi.quitStore({ storeCode: this.state.storeCode }).then((data) => {
                    if (!this.props.leftNavItemHidden) {
                        this._loadPageData();
                    }
                    spellStatusModel.getUser(2);
                    this.$loadingDismiss();
                }).catch((error) => {
                    this.$loadingDismiss();
                    this.$toastShow(error.msg);
                });
            }
        }]);
    };

    // 渲染头
    renderHeader = () => {
        return <RecruitHeaderView storeData={this.state.storeData}/>;
    };

    // 渲染店铺
    renderMembers = () => {
        return <RecruitMembersRow clickAllMembers={this._clickAllMembers} //点击全部成员
                                  storeData={this.state.storeData}/>;
    };

    renderOpenShopSetting = () => {
        //myStore 是否是店主
        //userStatus
        //0:不在店铺 1:以加入 2-申请中 3-邀请加入中 4-取消申请 5-邀请不加入 6-邀请取消 9-已经退出 10:店铺关闭
        const { myStore, userStatus } = this.state.storeData;
        if (myStore) {
            return (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: ScreenUtils.autoSizeHeight(76),
                    marginBottom: 30
                }}>
                    <TouchableOpacity onPress={this._closeStore}
                                      style={[styles.unOpen, {
                                          borderRadius: this.state.canOpen ? 5 : ScreenUtils.autoSizeWidth(345) / 2,
                                          width: this.state.canOpen ? ScreenUtils.autoSizeWidth(168) : ScreenUtils.autoSizeWidth(260)
                                      }]}>
                        <Text style={{ fontSize: 16, color: DesignRule.mainColor }}
                              allowFontScaling={false}>{'取消开启'}</Text>
                    </TouchableOpacity>
                    {
                        this.state.canOpen ? <NoMoreClick onPress={this._openStore} style={styles.open}>
                            <Text style={{ fontSize: 16, color: 'white' }} allowFontScaling={false}>{'开启店铺'}</Text>
                        </NoMoreClick> : null
                    }
                </View>
            );
        }

        return (
            <View style={{
                alignItems: 'center',
                marginTop: ScreenUtils.autoSizeHeight(76),
                marginBottom: 30
            }}>
                {
                    userStatus === 1 ?
                        <TouchableOpacity onPress={this._quitStore}
                                          style={[styles.unOpen, {
                                              borderRadius: 24,
                                              width: ScreenUtils.autoSizeWidth(260)
                                          }]}>
                            <Text style={{ fontSize: 16, color: DesignRule.mainColor }}
                                  allowFontScaling={false}>{'退出拼店'}</Text>
                        </TouchableOpacity>
                        : <TouchableOpacity onPress={this._joinStore}
                                            style={[styles.OutStore]}>
                            <Text style={{ fontSize: 16, color: 'white' }} allowFontScaling={false}>{'加入拼店'}</Text>
                        </TouchableOpacity>
                }

            </View>
        );
    };

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        let oldSt = this.st;
        if (Y <= 0) {
            this.st = 0;
        } else {
            this.st = 1;
        }
        if (oldSt === this.st) {
            return;
        }
        this.LinearGradient.setNativeProps({
            opacity: this.st
        });
    };

    _render() {
        const { name, headUrl, profile, storeNumber } = this.state.storeData || {};
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#FF1C89', '#FF156E']}
                                ref={e => this.LinearGradient = e}
                                style={styles.LinearGradient}/>
                {this._NavBarRenderRightItem()}
                <ScrollView showsVerticalScrollIndicator={false}
                            style={DesignRule.bgColor}
                            onScroll={this._onScroll}
                            scrollEventThrottle={30}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._refreshing.bind(this)}
                                    title="下拉刷新"
                                    tintColor={DesignRule.textColor_instruction}
                                    titleColor={DesignRule.textColor_instruction}
                                    colors={[DesignRule.mainColor]}/>}>
                    {this.renderHeader()}
                    {this.renderMembers()}
                    {this.renderOpenShopSetting()}
                </ScrollView>
                <ActionSheetView ref={ref => {
                    this.actionSheetRef = ref;
                }}/>
                <ReportAlert ref={ref => {
                    this.reportAlert = ref;
                }}/>
                {/*<ConfirmAlert ref="delAlert"/>*/}

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                trackParmas={{
                                    pinSummary: profile,
                                    pinCode: storeNumber
                                }}
                                trackEvent={trackEvent.SharePin}
                                webJson={{
                                    title: `加入店铺:${name}`,
                                    dec: '店铺',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/download?upuserid=${user.code || ''}`,
                                    thumImage: `${headUrl}`
                                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    LinearGradient: {
        opacity: 0,
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 3,
        height: ScreenUtils.headerHeight
    },
    transparentView: {
        top: ScreenUtils.statusBarHeight,
        height: 44,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 15,
        right: 15,
        zIndex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 88
    },
    leftBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 88
    },
    unOpen: {
        height: 48,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    OutStore: {
        width: ScreenUtils.autoSizeWidth(260),
        height: 48,
        backgroundColor: DesignRule.mainColor,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    open: {
        marginLeft: 10,
        width: ScreenUtils.autoSizeWidth(168),
        height: 48,
        backgroundColor: DesignRule.mainColor,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
