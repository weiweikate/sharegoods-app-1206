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
    Text
} from 'react-native';

import { observer } from 'mobx-react/native';
import BasePage from '../../../BasePage';

import ShopHeader from './components/ShopHeader';
import MembersRow from './components/MembersRow';
import InfoRow from './components/InfoRow';
import ActionSheetView from '../components/ActionSheetView';
import ReportAlert from '../components/ReportAlert';
// 图片资源
import NavLeft from './res/NavLeft.png';
import shezhi from './res/shezhi.png';
import icons8_Shop_50px from '../shopRecruit/src/icons8_Shop_50px.png';
import my_Shop_gengduo from './res/my_Shop_gengduo.png';

import onSc_03 from './res/sc_03.png';
import unSc_03 from './res/wsc_03.png';

import RmbIcon from './res/zje_11.png';
import ZuanIcon from './res/cs_12.png';
import QbIcon from './res/dzfhj_03-03.png';
import system_charge from './res/system-charge.png';
import hangye_gift from './res/hangye-gift.png';

import SpellShopApi from '../api/SpellShopApi';
import DateUtils from '../../../utils/DateUtils';
import StringUtils from '../../../utils/StringUtils';
import spellStatusModel from '../model/SpellStatusModel';
import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import CommShareModal from '../../../comm/components/CommShareModal';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import apiEnvironment from '../../../api/ApiEnvironment';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';

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
            storeId: this.params.storeId || this.props.storeId,
            isLike: false
        };
    }

    // 导航配置
    $navigationBarOptions = {
        show: false
    };
    // leftNavItemHidden: this.props.leftNavItemHidden


    _NavBarRenderRightItem = () => {
        return (<View style={styles.transparentView}>
                <View style={styles.leftBarItemContainer}>
                    {!this.props.leftNavItemHidden ?
                        <TouchableOpacity onPress={() => {
                            this.$navigateBack();
                        }}>
                            <Image source={NavLeft}/>
                        </TouchableOpacity> : null}
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, color: '#ffffff' }}>{this.state.tittle}</Text>
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
                reloadBtnClick: () => {
                    this._loadPageData();
                }
            }
        };
    };

    componentDidMount() {
        this._loadPageData();
    }


    _onRefresh = () => {
        this.setState({
            isRefresh: true
        });
        this._loadPageData();
    };

    _loadPageData = () => {
        this._requestGetById();
        this._requestGetByStoreId();
    };

    _requestGetById = () => {
        //店铺信息
        SpellShopApi.getById({ id: this.state.storeId }).then((data) => {
            let dataTemp = data.data || {};
            const { userStatus } = dataTemp;
            this.setState({
                loadingState: PageLoadingState.success,
                isRefresh: false,
                storeData: dataTemp,
                storeId: dataTemp.id,
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
        SpellShopApi.getByStoreId({ storeId: this.state.storeId }).then((data) => {
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
        SpellShopApi.storeCollectionCollection({ storeId: this.state.storeId }).then(() => {
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
        SpellShopApi.storeCollectionCancel({ storeId: this.state.storeId }).then(() => {
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
                                    storeId: this.state.storeId
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
                    SpellShopApi.quitStore({ storeId: this.state.storeId }).then((data) => {
                        if (!this.props.propReload) {
                            //不是首页刷新当前页面
                            this._loadPageData();
                        }
                        //刷新首页
                        spellStatusModel.getUser(2);
                        this.$loadingDismiss();
                    }).catch((error) => {
                        this.$toastShow(error.msg);
                        this.$loadingDismiss();
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
        this.delAlert.show({
            title: `确定要申请${name}吗?`,
            confirmCallBack: () => {
                this.$loadingShow();
                SpellShopApi.addToStore({ storeId: this.state.storeId }).then((data) => {
                    //加入肯定是推荐搜索来的   刷新首页和当前页
                    this._loadPageData();

                    if (!this.props.propReload) {
                        //不是首页刷新当前页面
                        this._loadPageData();
                    }
                    //刷新首页
                    spellStatusModel.getUser(2);
                    this.$loadingDismiss();
                }).catch((error) => {
                    this.$toastShow(error.msg);
                    this.$loadingDismiss();
                });
            }
        });
    };

    renderHeader = () => {
        return (<ShopHeader onPressShopAnnouncement={this._clickShopAnnouncement} item={this.state.storeData}/>);
    };


    _renderRow = (icon, title, desc) => {
        return <InfoRow icon={icon} title={title} desc={desc}/>;
    };

    _renderBottom = () => {
        let {
            userStatus, myStore,
            clerkTotalBonusMoney, clerkBonusCount,
            manager, totalTradeBalance, tradeBalance,
            updateTime,
            createTime
        } = this.state.storeData;
        //店员
        //clerkTotalBonusMoney店员个人已完成分红总额
        //clerkBonusCount店铺内个人分红次数
        //加入时间

        //店长
        //totalTradeBalance累计收入- tradeBalance本月收入  店铺已完成分红总额
        //bonusCount店长个人分红次数
        //totalBonusMoney店长个人已获得分红金
        //managerTotalBonusMoney作为店长的总分红
        const { bonusCount, totalBonusMoney, managerTotalBonusMoney } = manager;
        if (userStatus === 1) {
            return (
                <View>
                    {myStore && this._renderRow(RmbIcon, '店铺已完成分红总额', `${(totalTradeBalance - tradeBalance) || 0}元`)}
                    <View style={{ height: 10 }}/>

                    {myStore ? this._renderRow(ZuanIcon, '个人分红次数', `${bonusCount || 0}次`)
                        : this._renderRow(RmbIcon, '个人已完成分红总额', `${clerkTotalBonusMoney || 0}元`)}
                    {this.renderSepLine()}

                    {myStore ? this._renderRow(system_charge, '个人已获得分红金', `${totalBonusMoney || 0}元`)
                        : this._renderRow(ZuanIcon, '分红次数', `${clerkBonusCount || 0}次`)}
                    {myStore && this.renderSepLine()}

                    {myStore ? this._renderRow(hangye_gift, '个人获得店长分红金', `${managerTotalBonusMoney || 0}元`)
                        : this._renderRow(QbIcon, '加入时间', DateUtils.formatDate(updateTime, 'yyyy-MM-dd'))}
                </View>
            );
        } else {
            return (
                <View>
                    <View style={{ height: 10 }}/>
                    {this._renderRow(QbIcon, '成立时间', DateUtils.formatDate(createTime, 'yyyy-MM-dd'))}
                </View>
            );
        }
    };

    _renderJoinBtn = () => {
        const { storeMaxUser, storeUserList = [], recruitStatus, userStatus, status } = this.state.storeData;
        //有店&&没关闭(需要刷新 需求有待商榷)||已经加入||为空
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
            <Text style={{ fontSize: 16, color: 'white' }}>{btnText}</Text>
        </TouchableOpacity>;
    };

    renderSepLine = () => {
        return (<View style={{
            height: StyleSheet.hairlineWidth,
            borderWidth: 0.5,
            borderColor: '#fdfcfc'
        }}/>);
    };

    // 主题内容
    renderBodyView = () => {
        let { myStore, storeUserList } = this.state.storeData;
        storeUserList = storeUserList || [];
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl
                            onRefresh={this._onRefresh} refreshing={this.state.isRefresh}/>}>
                {this.renderHeader()}
                <MembersRow dealerList={storeUserList.slice()}
                            isYourStore={myStore}
                            onPressAllMembers={this._clickAllMembers}
                            onPressMemberItem={this._clickItemMembers}/>
                {this.renderSepLine()}
                {this._renderBottom()}
                {this._renderJoinBtn()}
            </ScrollView>
        );

    };

    _render() {
        return (
            <View style={styles.container}>
                {this._NavBarRenderRightItem()}
                {this.renderBodyView()}
                <ActionSheetView ref={ref => {
                    this.actionSheetRef = ref;
                }}/>
                <ReportAlert ref={ref => {
                    this.reportAlert = ref;
                }}/>
                <ConfirmAlert ref={(ref) => this.delAlert = ref}/>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                webJson={{
                                    title: `加入店铺:${this.state.storeData.name}`,
                                    dec: '店铺',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/download`,
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
    transparentView: {
        top: ScreenUtils.statusBarHeight,
        height: 44,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 15,
        right: 15,
        zIndex: 3,
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
