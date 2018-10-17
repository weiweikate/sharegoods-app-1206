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
import settingLogo from './res/dp_03-02.png';
import icons8_Shop_50px from '../shopRecruit/src/icons8_Shop_50px.png';
import icons9_shop from '../shopRecruit/src/icons9_shop.png';

import onSc_03 from './res/sc_03.png';
import unSc_03 from './res/wsc_03.png';

import RmbIcon from './res/zje_11.png';
import ZuanIcon from './res/cs_12.png';
import MoneyIcon from './res/fhje_14.png';
import QbIcon from './res/dzfhj_03-03.png';

import SpellShopApi from '../api/SpellShopApi';
import DateUtils from '../../../utils/DateUtils';
import StringUtils from '../../../utils/StringUtils';
import spellStatusModel from '../model/SpellStatusModel';

@observer
export default class MyShopPage extends BasePage {
    // 导航配置
    $navigationBarOptions = {
        title: '我的店铺',
        leftNavItemHidden: this.props.leftNavItemHidden
    };
    $NavBarRenderRightItem = () => {
        const { myStore, userStatus } = this.state.storeData;
        if (userStatus === 1) {
            return (
                <View style={styles.rightBarItemContainer}>
                    <TouchableOpacity onPress={() => {
                        this.$navigate('spellShop/recommendSearch/RecommendPage',{havaShop:true})}
                    }>
                        <Image style={{ marginRight: 20 }} source={icons8_Shop_50px}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._clickSettingItem} style={styles.rightBarItemContainer}>
                        <Image style={{ marginRight: 20 }} source={myStore ? settingLogo : icons9_shop}/>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <TouchableOpacity onPress={this.state.isLike ? this._clickUnLikeItem : this._clickLikeItem}
                                  style={styles.rightBarItemContainer}>
                    <Image style={{ marginRight: 20 }} source={this.state.isLike ? onSc_03 : unSc_03}/>
                </TouchableOpacity>
            );
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            storeData: {},
            storeId: this.params.storeId || this.props.storeId,
            isLike: false,
            isRefresh: false
        };
    }

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
        //店铺信息
        SpellShopApi.getById({ id: this.state.storeId }).then((data) => {
            let dataTemp = data.data || {};
            this.setState({
                storeData: dataTemp,
                storeId: dataTemp.id,
                isRefresh: false
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
            this.setState({
                isRefresh: false
            });
        });

        //是否收藏店铺
        SpellShopApi.getByStoreId({ storeId: this.state.storeId }).then((data) => {
            if (data.data) {
                this.setState({
                    isLike: true
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
            this.$navigate('spellShop/shopSetting/ShopPageSettingPage', { storeData: this.state.storeData });
        } else {
            this.actionSheetRef.show({
                items: ['分享店铺', '举报店铺', '退出店铺']//
            }, (item, index) => {
                if (index === 0) {

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
        const { storeMaxUser, storeUserList = [] } = this.state.storeData;
        let canJoin = this.state.storeData.userStatus === 0 && this.state.storeData.recruitStatus !== 2 && storeMaxUser > storeUserList.length;
        if (canJoin) {
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
    };

    renderHeader = () => {
        return (<ShopHeader onPressShopAnnouncement={this._clickShopAnnouncement} item={this.state.storeData}/>);
    };


    _renderRow = (icon, title, desc) => {
        return <InfoRow icon={icon} title={title} desc={desc}/>;
    };

    _renderBottom = () => {
        let { myStore, saleBonus, totalTradeVolume, bonusCount, bossBonus, updateTime, createTime, userStatus } = this.state.storeData;
        if (userStatus === 1) {
            return (
                <View>
                    {myStore && this._renderRow(RmbIcon, '店铺已完成分红总额', `${saleBonus || 0}元`)}
                    <View style={{ height: 10 }}/>

                    {myStore ? this._renderRow(ZuanIcon, '个人分红次数', `${bonusCount || 0}次`)
                        : this._renderRow(RmbIcon, '个人已完成交易总额', `${totalTradeVolume || 0}元`)}
                    {this.renderSepLine()}

                    {myStore ? this._renderRow(MoneyIcon, '个人已获得分红金', `${saleBonus || 0}元`)
                        : this._renderRow(ZuanIcon, '分红次数', `${bonusCount || 0}次`)}
                    {myStore && this.renderSepLine()}

                    {myStore ? this._renderRow(QbIcon, '个人获得店长分红金', `${bossBonus || 0}元`)
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
        let btnText;
        const { storeMaxUser, storeUserList = [] } = this.state.storeData;
        let canJoin = this.state.storeData.userStatus === 0 && this.state.storeData.recruitStatus !== 2 && storeMaxUser > storeUserList.length;
        switch (this.state.storeData.userStatus) {
            case 0: {
                if (this.state.storeData.recruitStatus === 0) {
                    btnText = '申请加入';
                    if (!canJoin) {
                        btnText = '人员已满';
                    }
                } else if (this.state.storeData.recruitStatus === 1) {
                    btnText = '加入店铺';
                    if (!canJoin) {
                        btnText = '人员已满';
                    }
                } else {
                    btnText = '暂不允许加入';
                }
            }
                break;
            case 2:
                btnText = '已提交申请';
                break;
            case 4:
                btnText = '取消申请';
                break;
        }
        if (!StringUtils.isEmpty(this.state.storeData.userStatus) && this.state.storeData.userStatus !== 1) {
            return <TouchableOpacity style={{
                height: 48,
                width: 150,
                backgroundColor: canJoin ? '#D51243' : 'rgb(221,109,140)',
                borderRadius: 5,
                marginTop: 30,
                alignSelf: 'center', justifyContent: 'center', alignItems: 'center'
            }}
                                     onPress={this._joinBtnAction}>
                <Text style={{ fontSize: 16, color: '#FFFFFF' }}>{btnText}</Text>
            </TouchableOpacity>;
        } else {
            return null;
        }

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
                {this.renderBodyView()}
                <ActionSheetView ref={ref => {
                    this.actionSheetRef = ref;
                }}/>
                <ReportAlert ref={ref => {
                    this.reportAlert = ref;
                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    // 顶部条 右边item容器
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
