//我的店铺页面
//三种角色身份 普通 店长 店员

import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';

import { observer } from 'mobx-react/native';
import storeModel from '../model/storeModel';
// import spellStatusModel from './model/spellStatusModel';

import BasePage from '../../../BasePage';

import ShopHeader from './components/ShopHeader';
import MembersRow from './components/MembersRow';
import InfoRow from './components/InfoRow';
import ActionSheetView from '../components/ActionSheetView';
import ReportAlert from './components/ReportAlert';
// 图片资源
import ShopItemLogo from './res/dp_03.png';
import MoreItemLogo from './res/dp_03-02.png';
import ItemLogo from './res/more_icon.png';
import RmbIcon from './res/zje_11.png';
import ZuanIcon from './res/cs_12.png';
import MoneyIcon from './res/fhje_14.png';
import QbIcon from './res/dzfhj_03-03.png';


@observer
export default class MyShopPage extends BasePage {


    // 导航配置
    $navigationBarOptions = {
        title: '我的店铺'
    };
    $NavBarRenderRightItem = () => {
        return <View style={styles.rightBarItemContainer}>
            <TouchableOpacity onPress={this._clickShopItem}>
                <Image style={{ marginRight: 11 }} source={ShopItemLogo}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._clickSettingItem}>
                <Image style={{ marginRight: 20 }} source={storeModel.isYourStore ? MoreItemLogo : ItemLogo}/>
            </TouchableOpacity>
        </View>;
    };

    componentDidMount() {
        this.$NavigationBarHiddenLeftItem(this.props.leftNavItemHidden);
    }

    // 点击店铺
    _clickShopItem = () => {
        // this._navigate('spellShop/shopSetting/ShopRecommendPage');
    };

    // 点击店铺设置
    _clickSettingItem = () => {
        if (storeModel.isYourStore) {
            // this._navigate('spellShop/shopSetting/ShopPageSettingPage');
        } else {
            this.actionSheetRef.show({
                items: ['分享店铺', '举报店铺', '退出店铺']//
            }, (item, index) => {
                if (index === 0) {
                    // const shareInfo = {
                    //     name: storeModel.store.name,//店铺名称
                    //     id: storeModel.store.id,//店铺id
                    //     headUrl: storeModel.store.headUrl,//店铺头像url
                    //     storeUser: storeModel.store.storeUser
                    // };
                    // this._navigate('spellShop/invite/InvitationToShopPage', { shareInfo });
                } else if (index === 1) {
                    // 举报弹框
                    setTimeout(() => {
                        this.reportAlert && this.reportAlert.show({
                            confirmCallBack: () => {
                                // SpellShopApi.addStoreReport({
                                //     content: '违法赌博',
                                //     storeId: storeModel.storeId
                                // }).then(response => {
                                //     if (response.ok) {
                                //         Toast.toast('举报成功');
                                //     } else {
                                //         Toast.toast(response.msg);
                                //     }
                                // });
                            }
                        });
                    }, 500);
                } else if (index === 2) {
                    // SpellShopApi.quitStore().then(response => {
                    //     if (response.ok) {
                    //         spellStatusModel.loadBaseInfoByType(2);
                    //         this.props.navigation.popToTop();
                    //         Toast.toast('退出成功');
                    //     } else {
                    //         Toast.toast(response.msg);
                    //     }
                    // });
                }
            });
        }
    };

    // 点击店铺公告
    _clickShopAnnouncement = () => {
        // this._navigate('spellShop/announcement/AnnouncementListPage');
    };

    // 点击全部成员
    _clickAllMembers = () => {
        this.$navigate('spellShop/myShop/ShopAssistantPage');
    };

    // 点击具体成员
    _clickItemMembers = (id, info) => {
        // this._navigate('spellShop/assistant/AssistantDetailPage',{
        //     id,info,
        // });
    };

    // 店长点击邀请
    _clickAddMembers = () => {
        // 跳转到通讯录页面
        // 判断 1.等级满足条件 2.未参加拼店的人员 3.不能邀请自己的上级参加拼店
        // this._navigate('spellShop/openShop/AddressBookPage', {
        //     inviteJoinShop: true,
        //     shopId: storeModel.store.id
        // });
    };


    renderHeader = () => {
        return (<ShopHeader onPressShopAnnouncement={this._clickShopAnnouncement}/>);
    };


    _renderRow = (icon, title, desc) => {
        return <InfoRow icon={icon} title={title} desc={desc}/>;
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

        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl
                            refreshing={storeModel.refreshing}
                            onRefresh={this._onRefresh}
                        />
                        }>
                {this.renderHeader()}
                <MembersRow dealerList={storeModel.dealerList.slice()}
                            isYourStore={storeModel.isYourStore}
                            onPressAddItem={this._clickAddMembers}
                            onPressAllMembers={this._clickAllMembers}
                            onPressMemberItem={this._clickItemMembers}/>
                {this.renderSepLine()}
                {storeModel.isYourStore ? this._renderRow(RmbIcon, '店铺已完成分红总额', `${storeModel.storeBonusDto.storeThisTimeBonus || 0}元`) : null}
                <View style={{ height: 10 }}/>
                {!storeModel.isYourStore ? this._renderRow(RmbIcon, '个人已完成交易总额', `${(storeModel.storeBonusDto.dealerThisTimeBonus || 0) + (storeModel.storeBonusDto.dealerTotalBonus || 0)}元`) : null}
                {this._renderRow(ZuanIcon, '个人分红次数', `${storeModel.storeBonusDto.dealerTotalBonusCount || 0}次`)}
                {this.renderSepLine()}
                {this._renderRow(MoneyIcon, '个人已获得分红金', `${(storeModel.storeBonusDto.dealerTotalBonus || 0)}元`)}
                {this.renderSepLine()}
                {storeModel.isYourStore ? this._renderRow(QbIcon, '个人获得店长分红金', `${storeModel.storeBonusDto.storeManagerBonus || 0}元`) : this._renderRow(QbIcon, '加入时间', storeModel.addStoreTime)}
                <View style={{ height: 15 }}/>
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
