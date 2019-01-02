//我的店铺页面
//三种角色身份 普通 店长 店员

import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Alert
} from 'react-native';

import { observer } from 'mobx-react/native';
import BasePage from '../../../BasePage';
import {
    MRText as Text
} from '../../../components/ui';

import ShopHeader from './components/ShopHeader';
import ShopHeaderBonus from './components/ShopHeaderBonus';
import MembersRow from './components/MembersRow';
import InfoRow from './components/InfoRow';
import ActionSheetView from '../components/ActionSheetView';
import ReportAlert from '../components/ReportAlert';
// 图片资源

import SpellShopApi from '../api/SpellShopApi';
import DateUtils from '../../../utils/DateUtils';
import StringUtils from '../../../utils/StringUtils';
import spellStatusModel from '../model/SpellStatusModel';
// import ConfirmAlert from "../../../components/ui/ConfirmAlert";
import CommShareModal from '../../../comm/components/CommShareModal';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import apiEnvironment from '../../../api/ApiEnvironment';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';
import user from '../../../model/user';
// import bridge from '../../../utils/bridge';
import resCommon from '../../../comm/res';
import LinearGradient from 'react-native-linear-gradient';

const icons8_Shop_50px = res.shopRecruit.icons8_Shop_50px;
const NavLeft = resCommon.button.white_back;
const shezhi = res.myShop.shezhi;
const my_Shop_gengduo = res.myShop.my_Shop_gengduo;
const onSc_03 = res.myShop.sc_03;
const unSc_03 = res.myShop.wsc_03;

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
            storeCode: this.props.storeCode,
            isLike: false
        };
    }

    // 导航配置
    $navigationBarOptions = {
        show: false
    };

    _NavBarRender = () => {
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
                    <TouchableOpacity onPress={() => {
                        this.$navigate('spellShop/recommendSearch/RecommendPage');
                    }}>
                        <Image style={{ marginRight: 10 }} source={icons8_Shop_50px}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._clickSettingItem}>
                        <Image source={myStore ? shezhi : my_Shop_gengduo}/>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.rightBarItemContainer}>
                    <TouchableOpacity onPress={this.state.isLike ? this._clickUnLikeItem : this._clickLikeItem}>
                        <Image source={this.state.isLike ? onSc_03 : unSc_03}/>
                    </TouchableOpacity>
                </View>
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

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                console.log('willFocus', state);
                if (state && state.routeName === 'MyShop_RecruitPage') {//tab出现的时候
                    this._loadPageData();
                }
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    componentDidMount() {
        this._loadPageData();
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
        this._requestGetByStoreId();
    };

    _requestGetById = () => {
        //店铺信息
        SpellShopApi.getById({ storeCode: this.state.storeCode }).then((data) => {
            let dataTemp = data.data || {};
            const { userStatus } = dataTemp;
            this.setState({
                loadingState: PageLoadingState.success,
                isRefresh: false,
                storeData: dataTemp,
                storeCode: dataTemp.storeNumber,
                tittle: userStatus === 1 ? '我的店铺' : '店铺详情'
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

    _requestGetByStoreId = () => {
        //是否收藏店铺
        SpellShopApi.getByStoreId({ storeCode: this.state.storeCode }).then((data) => {
            if (data.data) {
                this.setState({
                    isLike: true
                });
            } else {
                this.setState({
                    isLike: false
                });
            }
        }).catch((error) => {
        });
    };

    //收藏
    _clickLikeItem = () => {
        SpellShopApi.storeCollectionCollection({ storeCode: this.state.storeCode }).then(() => {
            this.setState({
                isLike: true
            });
            this.$toastShow('收藏成功');
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };
    //取消收藏
    _clickUnLikeItem = () => {
        SpellShopApi.storeCollectionCancel({ storeCode: this.state.storeCode }).then(() => {
            this.setState({
                isLike: false
            });
            this.$toastShow('取消收藏成功');
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };
    // 点击店铺设置
    _clickSettingItem = () => {
        const { myStore } = this.state.storeData;
        if (myStore) {
            this.$navigate('spellShop/shopSetting/ShopPageSettingPage', {
                storeData: this.state.storeData,
                myShopCallBack: this._loadPageData
            });
        } else {
            this.actionSheetRef.show({
                items: ['分享店铺', '举报店铺', '退出店铺']//
            }, (item, index) => {
                if (index === 0) {
                    setTimeout(() => {
                        this.shareModal.open();
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
            });
        }
    };

    // 点击店铺公告
    _clickShopAnnouncement = () => {
        this.$navigate('spellShop/shopSetting/AnnouncementListPage', { storeData: this.state.storeData });
    };

    // 点击全部成员
    _clickAllMembers = () => {
        if (this.state.storeData.userStatus === 1) {
            this.$navigate('spellShop/myShop/ShopAssistantPage', { storeData: this.state.storeData });
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
                    <View style={{ height: 10 }}/>
                    {this._renderRow(RmbIcon, '店铺已完成奖励总额', `¥${((totalTradeBalance - tradeBalance) || 0).toFixed(2)}`)}
                    {this.renderSepLine()}
                    {this._renderRow(system_charge, '个人已获得奖励', `${(myStore ? totalBonusMoney : clerkBonusCount) || 0}元`)}

                    <View style={{ height: 10 }}/>
                    {this._renderRow(QbIcon, '店铺成立时间', createTimeStr)}
                    {!myStore ? this.renderSepLine() : null}
                    {!myStore ? this._renderRow(myShop_join, '加入时间', updateTime) : null}
                </View>
            );
        } else {
            return (
                <View>
                    <View style={{ height: 10 }}/>
                    {this._renderRow(RmbIcon, '店铺已完成奖励总额', `¥${((totalTradeBalance - tradeBalance) || 0).toFixed(2)}`)}
                    <View style={{ height: 10 }}/>
                    {this._renderRow(QbIcon, '店铺成立时间', createTimeStr)}
                </View>
            );
        }
    };

    _renderJoinBtn = () => {
        const { storeMaxUser, storeUserList = [], recruitStatus, userStatus, status } = this.state.storeData;
        //已经加入||为空
        if (userStatus === 1 || StringUtils.isEmpty(userStatus)) {
            return null;
        }
        let btnText;
        //2,10,店铺未没关闭&&允许加入&&人数未满
        let canJoin = (userStatus !== 10 && userStatus !== 2 && status !== 0) && (recruitStatus === 0 || recruitStatus === 1) && storeMaxUser > storeUserList.length;
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

        return <TouchableOpacity onPress={this._joinBtnAction}
                                 disabled={!canJoin}
                                 style={{
                                     height: 48,
                                     width: 150,
                                     backgroundColor: canJoin ? DesignRule.mainColor : 'rgb(221,109,140)',
                                     borderRadius: 5,
                                     marginTop: 30,
                                     alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
                                 }}>
            <Text style={{ fontSize: 16, color: 'white' }} allowFontScaling={false}>{btnText}</Text>
        </TouchableOpacity>;
    };

    renderSepLine = () => {
        return (<View style={{
            height: StyleSheet.hairlineWidth,backgroundColor:DesignRule.lineColor_inWhiteBg
        }}/>);
    };
    // 主题内容
    renderBodyView = () => {
        let { userStatus, storeUserList } = this.state.storeData;
        storeUserList = storeUserList || [];
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        onScroll={this._onScroll}
                        refreshControl={<RefreshControl
                            onRefresh={this._onRefresh}
                            refreshing={this.state.isRefresh}
                            progressViewOffset={ScreenUtils.headerHeight}
                            colors={[DesignRule.mainColor]}
                        />}>
                <ShopHeader onPressShopAnnouncement={this._clickShopAnnouncement} item={this.state.storeData}/>
                {userStatus === 1 ? <ShopHeaderBonus storeData={this.state.storeData}/> : null}
                <MembersRow dealerList={storeUserList.slice()}
                            userStatus={userStatus}
                            onPressAllMembers={this._clickAllMembers}
                            onPressMemberItem={this._clickItemMembers}/>
                {this._renderBottom()}
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
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#FF1C89', '#FF156E']}
                                ref={e => this.LinearGradient = e}
                                style={styles.LinearGradient}/>
                {this._NavBarRender()}
                {this.renderBodyView()}
                <ActionSheetView ref={ref => {
                    this.actionSheetRef = ref;
                }}/>
                <ReportAlert ref={ref => {
                    this.reportAlert = ref;
                }}/>
                {/*<ConfirmAlert ref={(ref) => this.delAlert = ref}/>*/}
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                webJson={{
                                    title: `加入店铺:${this.state.storeData.name}`,
                                    dec: '店铺',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/download?upuserid=${user.code || ''}`,
                                    thumImage: `${this.state.storeData.headUrl}`
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
    }
});
