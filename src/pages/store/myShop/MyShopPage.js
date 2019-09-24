//我的店铺页面
//三种角色身份 普通 店长 店员

import React from 'react';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import BasePage from '../../../BasePage';
import { MRText as Text } from '../../../components/ui';
import ShopHeader from './components/ShopHeader';
import MembersRow from './components/MembersRow';
import InfoRow from './components/InfoRow';
import ActionSheetView from '../components/ActionSheetView';
import ReportAlert from '../components/ReportAlert';
import SpellShopApi from '../api/SpellShopApi';
import spellStatusModel from '../SpellStatusModel';
import CommShareModal from '../../../comm/components/CommShareModal';
import apiEnvironment from '../../../api/ApiEnvironment';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';
import user from '../../../model/user';
import resCommon from '../../../comm/res';
import LinearGradient from 'react-native-linear-gradient';
import { trackEvent } from '../../../utils/SensorsTrack';
import { ShopCardView, ShopProductItemView } from './components/ShopDetailItemView';
import MyShopDetailModel from './MyShopDetailModel';
import { IntervalMsgView, IntervalType } from '../../../comm/components/IntervalMsgView';
import StringUtils from '../../../utils/StringUtils';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import { navigateBackToStore, routePush } from '../../../navigation/RouterMap';
import DateUtils from '../../../utils/DateUtils';
// 图片资源

const icons8_Shop_50px = res.shopRecruit.icons8_Shop_50px;
const NavLeft = resCommon.button.back_white;
const shezhi = res.myShop.shezhi;
const my_Shop_gengduo = res.myShop.my_Shop_gengduo;

const RmbIcon = res.myShop.zje_11;
const QbIcon = res.myShop.dzfhj_03_03;
const system_charge = res.myShop.system_charge;
const myShop_join = res.myShop.myShop_join;
const { isNoEmpty } = StringUtils;

@observer
export default class MyShopPage extends BasePage {

    MyShopDetailModel = new MyShopDetailModel();
    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.MyShopDetailModel.wayToPinType = props.wayToPinType;
        this.MyShopDetailModel.storeCode = props.storeCode || this.params.storeCode;
    }

    //拆分开店后storeCode会变化  需要刷新
    needUpdateStoreCode = autorun(() => {
        const { storeCode } = spellStatusModel;
        if (this.props.storeCode && this.MyShopDetailModel.storeCode !== storeCode) {
            this.MyShopDetailModel.storeCode = storeCode;
            this._loadPageData && this._loadPageData();
        }
    });

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                console.log('willFocus', state);
                if (state && state.routeName === 'MyShop_RecruitPage') {//tab出现的时候
                    this.MyShopDetailModel.requestAppStore();
                }
            }
        );
        /*上面的方法第一次_loadPageData不会执行  page已经出现了*/
        this._loadPageData();
        this.requestShopMsg();
        this.timeInterval = setInterval(this.requestShopMsg, 1000 * 30);
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.timeInterval && clearInterval(this.timeInterval);
    }

    requestShopMsg = () => {
        this.MyShopDetailModel.questShopMsg(this.MyShopDetailModel.storeCode);
    };


    _onRefresh = () => {
        this.MyShopDetailModel.isRefresh = true;
        this._loadPageData();
        spellStatusModel.requestHome();
    };

    _loadPageData = () => {
        this.MyShopDetailModel.checkOpenStore();
        this.MyShopDetailModel.requestAppStore();
        this.MyShopDetailModel.requestShopBanner();
        this.MyShopDetailModel.requestShopProducts();
    };

    _NavBarRender = () => {
        const { storeCode } = this.props;
        const { storeData } = this.MyShopDetailModel;
        return (<View style={styles.transparentView}>
                <View style={styles.leftBarItemContainer}>
                    {!storeCode ?
                        <TouchableOpacity style={{ width: 40, justifyContent: 'center' }}
                                          onPress={() => {
                                              this.$navigateBack();
                                          }}>
                            <Image source={NavLeft} style={{ width: 30, height: 30 }}/>
                        </TouchableOpacity> : null}
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, color: '#ffffff' }}>{storeData.name}</Text>
                </View>
                {this._RightItem()}
            </View>
        );
    };

    _RightItem = () => {
        const { roleType } = this.MyShopDetailModel.storeData;
        if (isNoEmpty(roleType)) {
            return (
                <View style={styles.rightBarItemContainer}>
                    <TouchableOpacity onPress={() => {
                        this.$navigate('store/recommendSearch/RecommendPage');
                    }}>
                        <Image style={{ marginRight: 10, width: 18, height: 18 }} source={icons8_Shop_50px}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._clickSettingItem}>
                        <Image source={roleType === 0 ? shezhi : my_Shop_gengduo} style={{ width: 18, height: 18 }}/>
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
        const { loadingState, netFailedInfo, requestAppStore } = this.MyShopDetailModel;
        return {
            loadingState: loadingState,
            netFailedProps: {
                netFailedInfo: netFailedInfo,
                reloadBtnClick: () => {
                    this.props.storeCode && spellStatusModel.requestHome();
                    requestAppStore();
                }
            }
        };
    };

    // 点击店铺设置
    _clickSettingItem = () => {
        const { storeData, storeCode, canOpenShop } = this.MyShopDetailModel;
        const { roleType } = storeData;
        const items = canOpenShop ? ['分享店铺', '拆分开店', '举报店铺', '退出店铺'] : ['分享店铺', '举报店铺', '退出店铺'];
        if (roleType === 0) {
            this.$navigate('store/shopSetting/ShopPageSettingPage', {
                storeData: this.MyShopDetailModel.storeData,
                myShopCallBack: this.MyShopDetailModel.requestAppStore
            });
        } else {
            this.actionSheetRef.show({ items }, (item) => {
                if (item === '分享店铺') {
                    setTimeout(() => {
                        this.shareModal && this.shareModal.open();
                    }, 500);
                } else if (item === '拆分开店') {
                    routePush('store/shopSetting/SetShopNamePage', { isSplit: true });
                } else if (item === '举报店铺') {
                    setTimeout(() => {
                        this.reportAlert && this.reportAlert.show({
                            confirmCallBack: (text) => {
                                SpellShopApi.storeTipOffInsert({
                                    content: text,
                                    storeCode: storeCode
                                }).then(() => {
                                    this.$toastShow('举报成功');
                                }).catch((error) => {
                                    this.$toastShow(error.msg);
                                });
                            }
                        });
                    }, 500);
                } else if (item === '退出店铺') {
                    setTimeout(() => {
                        Alert.alert('提示', '确定要退出么?', [{
                            text: '取消'
                        }, {
                            text: '退出', onPress: () => {
                                this.$loadingShow();
                                SpellShopApi.quitStore().then(() => {
                                    this.$loadingDismiss();
                                    spellStatusModel.requestHome();
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
        const { storeData } = this.MyShopDetailModel;
        this.$navigate('store/shopSetting/AnnouncementListPage', { storeData: storeData });
    };

    // 点击全部成员
    _clickAllMembers = () => {
        const { storeData } = this.MyShopDetailModel;
        const { roleType } = storeData;
        if (roleType === 0) {
            this.$navigate('store/myShop/ShopAssistantPage', { storeData });
        }
    };

    //加入店铺
    _joinBtnAction = () => {
        const { name } = this.MyShopDetailModel.storeData;
        Alert.alert('提示', `确定要申请${name}么?`,
            [
                {
                    text: '算了', onPress: () => {
                    }
                },
                {
                    text: '申请', onPress: () => {
                        this.$loadingShow();
                        SpellShopApi.user_apply({ storeCode: this.MyShopDetailModel.storeCode }).then(() => {
                            this.$loadingDismiss();
                            navigateBackToStore();
                            spellStatusModel.requestHome();
                        }).catch((error) => {
                            this.$loadingDismiss();
                            this.$toastShow(error.msg);
                        });
                    }
                }
            ]
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
        const {
            name, headUrl, profile, storeCode, storeTotalBonus,
            roleType, totalBonusMoney, buildTime, joinTime
        } = this.MyShopDetailModel.storeData;
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#FF1C89', '#FF156E']}
                                ref={e => this.LinearGradient = e}
                                style={styles.LinearGradient}/>
                {this._NavBarRender()}
                <ScrollView showsVerticalScrollIndicator={false}
                            onScroll={this._onScroll}
                            scrollEventThrottle={30}
                            refreshControl={<RefreshControl
                                onRefresh={this._onRefresh}
                                refreshing={this.MyShopDetailModel.isRefresh}
                                progressViewOffset={ScreenUtils.headerHeight}
                                colors={[DesignRule.mainColor]}
                            />}>
                    <ShopHeader onPressShopAnnouncement={this._clickShopAnnouncement}
                                MyShopDetailModel={this.MyShopDetailModel}/>
                    {isNoEmpty(roleType) &&
                    <ShopCardView/>}
                    <ShopProductItemView MyShopDetailModel={this.MyShopDetailModel}/>
                    <MembersRow MyShopDetailModel={this.MyShopDetailModel}
                                onPressAllMembers={this._clickAllMembers}/>
                    <View>
                        <InfoRow icon={RmbIcon} title={'店铺已完成奖励总额'} desc={`${storeTotalBonus || 0}元`}/>
                        {isNoEmpty(roleType) &&
                        <InfoRow icon={system_charge} title={'个人已获得奖励'} desc={`${totalBonusMoney || 0}元`}/>}
                        <InfoRow icon={QbIcon} title={'店铺成立时间'}
                                 desc={buildTime || ''}/>
                        {isNoEmpty(roleType) &&
                        <InfoRow icon={myShop_join} title={'加入时间'}
                                 desc={joinTime ? DateUtils.formatDate(joinTime, 'yyyy年MM月dd日') : ''}/>}
                    </View>
                    {!isNoEmpty(roleType) &&
                    <NoMoreClick style={styles.joinBtn} onPress={this._joinBtnAction}>
                        <Text style={styles.joinText}>申请加入</Text>
                    </NoMoreClick>}
                </ScrollView>
                <IntervalMsgView pageType={IntervalType.shopDetail} storeCode={this.MyShopDetailModel.storeCode}/>
                <ActionSheetView ref={ref => {
                    this.actionSheetRef = ref;
                }}/>
                <ReportAlert ref={ref => {
                    this.reportAlert = ref;
                }}/>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                trackParmas={{
                                    pinSummary: profile,
                                    pinCode: storeCode
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
    },
    joinBtn: {
        alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 14,
        width: ScreenUtils.px2dp(345), height: 40, backgroundColor: DesignRule.bgColor_btn, borderRadius: 20
    },
    joinText: {
        fontSize: 17, color: 'white'
    }
});
