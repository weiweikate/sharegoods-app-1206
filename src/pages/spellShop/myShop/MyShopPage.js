//我的店铺页面
//三种角色身份 普通 店长 店员

import React from 'react';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { observer } from 'mobx-react';
import BasePage from '../../../BasePage';
import { MRText as Text } from '../../../components/ui';

import ShopHeader from './components/ShopHeader';
import ShopHeaderBonus from './components/ShopHeaderBonus';
import MembersRow from './components/MembersRow';
import InfoRow from './components/InfoRow';
import ActionSheetView from '../components/ActionSheetView';
import ReportAlert from '../components/ReportAlert';
import SpellShopApi from '../api/SpellShopApi';
import DateUtils from '../../../utils/DateUtils';
import StringUtils from '../../../utils/StringUtils';
import spellStatusModel from '../model/SpellStatusModel';
// import ConfirmAlert from "../../../components/ui/ConfirmAlert";
import CommShareModal from '../../../comm/components/CommShareModal';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import apiEnvironment from '../../../api/ApiEnvironment';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';
import user from '../../../model/user';
// import bridge from '../../../utils/bridge';
import resCommon from '../../../comm/res';
import LinearGradient from 'react-native-linear-gradient';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { ShopBottomBannerView, ShopCardView, ShopProductItemView } from './components/ShopDetailItemView';
import MyShopDetailModel from './MyShopDetailModel';
import { IntervalMsgView, IntervalType } from '../../../comm/components/IntervalMsgView';
import RouterMap from '../../../navigation/RouterMap';
// 图片资源

const icons8_Shop_50px = res.shopRecruit.icons8_Shop_50px;
const NavLeft = resCommon.button.back_white;
const shezhi = res.myShop.shezhi;
const my_Shop_gengduo = res.myShop.my_Shop_gengduo;

const RmbIcon = res.myShop.zje_11;
const QbIcon = res.myShop.dzfhj_03_03;
const system_charge = res.myShop.system_charge;
const myShop_join = res.myShop.myShop_join;

@observer
export default class MyShopPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            isRefresh: false,
            tittle: '店铺详情',

            storeData: {},
            storeCode: this.props.storeCode || user.storeCode,
            isLike: false
        };
    }

    MyShopDetailModel = new MyShopDetailModel();

    // 导航配置
    $navigationBarOptions = {
        show: false
    };

    _NavBarRender = () => {
        return (<View style={styles.transparentView}>
                <View style={styles.leftBarItemContainer}>
                    {!this.props.leftNavItemHidden ?
                        <TouchableOpacity
                            activeOpacity={0.7} style={{ width: 40, justifyContent: 'center' }}
                            onPress={() => {
                                this.$navigateBack();
                            }}>
                            <Image source={NavLeft} style={{ width: 30, height: 30 }}/>
                        </TouchableOpacity> : null}
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, color: '#ffffff' }} allowFontScaling={false}>{this.state.tittle}</Text>
                </View>
                {this._RightItem()}
            </View>
        );
    };

    _RightItem = () => {
        const { myStore, userStatus } = this.state.storeData;
        if (userStatus === 1) {
            return (
                <View style={styles.rightBarItemContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            this.$navigate(RouterMap.RecommendPage);
                        }}>
                        <Image style={{ marginRight: 10, width: 18, height: 18 }} source={icons8_Shop_50px}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this._clickSettingItem}>
                        <Image source={myStore ? shezhi : my_Shop_gengduo} style={{ width: 18, height: 18 }}/>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.rightBarItemContainer}/>
            );
        }
    };

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._onRefresh
            }
        };
    };

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.timeInterval && clearInterval(this.timeInterval);
    }

    requestShopMsg = () => {
        this.MyShopDetailModel.questShopMsg(this.state.storeCode);
    };

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                console.log('willFocus', state);
                if (state && state.routeName === 'MyShop_RecruitPage') {//tab出现的时候
                    this._loadPageData();
                }
            }
        );
        /*上面的方法第一次_loadPageData不会执行  page已经出现了*/
        this._loadPageData();
        this.requestShopMsg();
        this.timeInterval = setInterval(this.requestShopMsg, 1000 * 30);
    }


    _onRefresh = () => {
        this.setState({
            isRefresh: true
        }, () => {
            this._loadPageData();
            spellStatusModel.getUser(0);
        });
    };

    _loadPageData = () => {
        this._requestGetById();
        this.MyShopDetailModel.requestShopBanner();
        this.MyShopDetailModel.requestShopProducts();
    };

    _requestGetById = () => {
        //店铺信息
        SpellShopApi.getById({ storeCode: this.state.storeCode }).then((data) => {
            let dataTemp = data.data || {};
            const { userStatus, storeNumber } = dataTemp;
            this.setState({
                loadingState: PageLoadingState.success,
                isRefresh: false,
                storeData: dataTemp,
                storeCode: storeNumber,
                tittle: userStatus === 1 ? '我的店铺' : '店铺详情'
            });
            track(trackEvent.PinShopEnter, {
                pinCode: storeNumber,
                wayToPinType: this.props.wayToPinType
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: error,
                isRefresh: false
            });
        });
    };

    // 点击店铺设置
    _clickSettingItem = () => {
        const { myStore } = this.state.storeData;
        if (myStore) {
            this.$navigate(RouterMap.ShopPageSettingPage, {
                storeData: this.state.storeData,
                myShopCallBack: this._loadPageData
            });
        } else {
            this.actionSheetRef.show({
                items: ['分享店铺', '举报店铺', '退出店铺']//
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
                } else if (index === 2) {
                    setTimeout(() => {
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
                    }, 500);
                }
            });
        }
    };

    // 点击店铺公告
    _clickShopAnnouncement = () => {
        this.$navigate(RouterMap.AnnouncementListPage, { storeData: this.state.storeData });
    };

    // 点击全部成员
    _clickAllMembers = () => {
        if (this.state.storeData.userStatus === 1) {
            this.$navigate(RouterMap.ShopAssistantPage, { storeData: this.state.storeData });
        }
    };

    // 点击具体成员
    _clickItemMembers = (id, info) => {
    };

    //加入店铺
    _joinBtnAction = () => {
        const { name } = this.state.storeData;
        // this.delAlert.show({
        //     title: `确定要申请${name}吗?`,
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
        //     }
        // });

        Alert.alert('提示', `确定要申请${name}么?`,
            [
                {
                    text: '算了', onPress: () => {
                    }
                },
                {
                    text: '申请', onPress: () => {
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

    _renderRow = (icon, title, desc) => {
        return <InfoRow icon={icon} title={title} desc={desc}/>;
    };

    _renderBottom = () => {
        let {
            userStatus, myStore,
            clerkBonusCount,
            manager, totalTradeBalance, tradeBalance,
            storeUser,
            createTimeStr
        } = this.state.storeData;
        storeUser = storeUser || {};
        let updateTime = StringUtils.isNoEmpty(storeUser.updateTime) ? DateUtils.formatDate(storeUser.updateTime, 'yyyy-MM-dd') : '';
        //店员
        //clerkTotalBonusMoney店员个人已完成分红总额
        //clerkBonusCount店铺内个人分红次数
        //加入时间

        //店长
        //totalTradeBalance累计收入- tradeBalance本月收入  店铺已完成分红总额
        //bonusCount店长个人分红次数
        //totalBonusMoney店长个人已获得分红金
        //managerTotalBonusMoney作为店长的总分红
        const { totalBonusMoney } = manager;
        if (userStatus === 1) {
            return (
                <View>
                    {this._renderRow(RmbIcon, '店铺已完成奖励总额', `¥${((totalTradeBalance - tradeBalance) || 0).toFixed(2)}`)}
                    {this._renderRow(system_charge, '个人已获得奖励', `${(myStore ? totalBonusMoney : clerkBonusCount) || 0}元`)}
                    {this._renderRow(QbIcon, '店铺成立时间', createTimeStr)}
                    {!myStore ? this._renderRow(myShop_join, '加入时间', updateTime) : null}
                </View>
            );
        } else {
            return (
                <View>
                    {this._renderRow(RmbIcon, '店铺已完成奖励总额', `¥${((totalTradeBalance - tradeBalance) || 0).toFixed(2)}`)}
                    {this._renderRow(QbIcon, '店铺成立时间', createTimeStr)}
                </View>
            );
        }
    };

    _renderJoinBtn = () => {
        const { storeMaxUser, userCount, recruitStatus, userStatus, status } = this.state.storeData;
        //已经加入||为空
        if (userStatus === 1 || StringUtils.isEmpty(userStatus)) {
            return null;
        }
        let btnText;
        //2,10,店铺未没关闭&&允许加入&&人数未满
        let canJoin = (userStatus !== 10 && userStatus !== 2 && status !== 0) && (recruitStatus === 0 || recruitStatus === 1) && storeMaxUser > userCount;
        switch (userStatus) {
            case 2:
                btnText = '申请中';
                break;
            case 10:
                btnText = '店铺关闭';
                break;
            default:
                if (recruitStatus === 0) {
                    if (canJoin) {
                        btnText = '申请加入';
                    } else {
                        btnText = '人员已满';
                    }
                } else if (recruitStatus === 1) {
                    if (canJoin) {
                        btnText = '加入店铺';
                    } else {
                        btnText = '人员已满';

                    }
                } else {
                    btnText = '暂不允许加入';
                }
                break;
        }

        if (status === 0) {
            btnText = '店铺已关闭';
        }

        return <TouchableOpacity
            activeOpacity={0.7}
            onPress={this._joinBtnAction}
            disabled={!canJoin}
            style={{
                height: 40,
                width: 150,
                backgroundColor: canJoin ? DesignRule.mainColor : 'rgb(221,109,140)',
                borderRadius: 20,
                marginTop: 30,
                marginBottom: 30,
                alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
            }}>
            <Text style={{ fontSize: 16, color: 'white' }} allowFontScaling={false}>{btnText}</Text>
        </TouchableOpacity>;
    };

    renderSepLine = () => {
        return (<View style={{
            height: StyleSheet.hairlineWidth, backgroundColor: DesignRule.lineColor_inWhiteBg
        }}/>);
    };
    // 主题内容
    renderBodyView = () => {
        let { userStatus, storeUserList, userCount } = this.state.storeData;
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        onScroll={this._onScroll}
                        scrollEventThrottle={30}
                        refreshControl={<RefreshControl
                            onRefresh={this._onRefresh}
                            refreshing={this.state.isRefresh}
                            progressViewOffset={ScreenUtils.headerHeight}
                            colors={[DesignRule.mainColor]}
                        />}>
                <ShopHeader onPressShopAnnouncement={this._clickShopAnnouncement} item={this.state.storeData}/>
                {userStatus === 1 && <ShopCardView/>}
                <ShopProductItemView MyShopDetailModel={this.MyShopDetailModel}/>
                {userStatus === 1 ? <ShopHeaderBonus storeData={this.state.storeData}/> : null}
                <MembersRow storeUserList={storeUserList || []}
                            userCount={userCount}
                            userStatus={userStatus}
                            onPressAllMembers={this._clickAllMembers}
                            onPressMemberItem={this._clickItemMembers}/>
                {this._renderBottom()}
                <ShopBottomBannerView MyShopDetailModel={this.MyShopDetailModel}/>
                {this._renderJoinBtn()}
            </ScrollView>
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
                {this._NavBarRender()}
                {this.renderBodyView()}
                <IntervalMsgView pageType={IntervalType.shopDetail} storeCode={this.state.storeCode}/>
                <ActionSheetView ref={ref => {
                    this.actionSheetRef = ref;
                }}/>
                <ReportAlert ref={ref => {
                    this.reportAlert = ref;
                }}/>
                {/*<ConfirmAlert ref={(ref) => this.delAlert = ref}/>*/}
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
        left: 5,
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
    }
});
