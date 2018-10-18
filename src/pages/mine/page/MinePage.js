import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ImageBackground,
    Image,
    Platform,
    Linking,
    Text
} from 'react-native';
import BasePage from '../../../BasePage';
import UIText from '../../../components/ui/UIText';
import UIImage from '../../../components/ui/UIImage';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import user from '../../../model/user';
import whiteArrowRight from '../res/homeBaseImg/icon3_03.png';
import arrowRight from '../res/homeBaseImg/icon3_07.png';
import waitPay from '../res/homeBaseImg/icon_03-04.png';
import waitDelivery from '../res/homeBaseImg/icon_03-05.png';
import waitReceive from '../res/homeBaseImg/icon1-03.png';
import hasFinished from '../res/homeBaseImg/icon3_03-06.png';
import headBg from '../res/homeBaseImg/bg3_01.png';
import inviteFr from '../res/homeBaseImg/icon3_16.png';
import calendar from '../res/homeBaseImg/icon3_16-08.png';
import coupons from '../res/homeBaseImg/icon3_16-09.png';
import myData from '../res/homeBaseImg/icon3_16-10.png';
import myCollet from '../res/homeBaseImg/icon3_31.png';
import myHelper from '../res/homeBaseImg/icon_31-12.png';
import address from '../res/homeBaseImg/icon31-13.png';
import track from '../res/homeBaseImg/icon_31-14.png';
import leftBg from '../res/homeBaseImg/bg_03.png';
import levelBg from '../res/homeBaseImg/icon3_03-02.png';
import setting from '../res/homeBaseImg/icon_03.png';
import service from '../res/homeBaseImg/icon02.png';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import MineApi from '../api/MineApi';
import { observer } from 'mobx-react/native';
import showImg from '../res/homeBaseImg/icon_faxian.png'

@observer
export default class MinePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            nickname: user.phone,
            headImg: '',
            availableBalance: 0,//现金余额
            blockedBalance: 0,//待提现
            levelName: 'V0',
            userScore: 0,//秀豆
            refreshing: false,
            netFailedInfo: null,
            loadingState: PageLoadingState.success
        };
    }

    $navigationBarOptions = {
        show: false // false则隐藏导航
    };
    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };
    timeoutCallBack = () => {
        this.$loadingDismiss();
    };

    componentDidMount() {
        if (!user.isLogin) {
            this.props.navigation.navigate('login/login/LoginPage', { callback: this.refresh });
            return;
        }
        this.refresh();
    }

    refresh = () => {
        this.$loadingShow('加载中...', { timeout: 1, timeoutCallBack: () => this.timeoutCallBack });
        MineApi.getUser().then(res => {
            this.$loadingDismiss();
            if (res.code == 10000) {
                let data = res.data;
                user.saveUserInfo(data);
                this.setState({
                    availableBalance: data.availableBalance,
                    headImg: data.headImg,
                    levelName: data.levelName,
                    userScore: data.userScore,
                    blockedBalance: data.blockedBalance
                });
            }
        }).catch(err => {
            if (err.code === 10009) {
                this.props.navigation.navigate('login/login/LoginPage', { callback: this.refresh });
            }
        });
    };

    _reload() {
        alert('relod');
    }

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
            </View>
        );
    }

    jumpToUserInformationPage = () => {
        if (!user.isLogin) {
            this.props.navigation.navigate('login/login/LoginPage');
            return;
        }
        this.props.navigation.navigate('mine/userInformation/UserInformationPage');
    };
    renderUserHead = () => {
        return (
            <View style={{
                height: 462 + (ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 0),
                width: ScreenUtils.width
            }}>
                <ImageBackground style={{
                    height: 240 + (ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 0),
                    width: ScreenUtils.width
                }} source={headBg}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 5,
                        justifyContent: 'flex-end',
                        height: 40,
                        marginTop: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 20
                    }}>
                        <UIImage source={setting} style={{ height: 18, width: 22, marginRight: 15 }}
                                 onPress={() => this.jumpToSettingPage()}/>
                        <UIImage source={service} style={{ height: 18, width: 22 }}
                                 onPress={() => this.jumpToServicePage()}/>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <NoMoreClick onPress={this.jumpToUserInformationPage}>
                        <ImageBackground style={{
                            height: 60,
                            width: 60,
                            marginLeft: 21,
                            marginTop: 5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} source={leftBg}>
                            {
                                StringUtils.isEmpty(user.headImg) ? null :
                                    <Image source={{ uri: user.headImg ? user.headImg : '' }} style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 25
                                    }}/>
                            }
                        </ImageBackground>
                        </NoMoreClick>
                        <View style={{
                            marginLeft: 20,
                            justifyContent: 'space-between',
                            marginTop: 11
                        }}>
                            <NoMoreClick style={{ flexDirection: 'row', alignItems: 'center' }}
                                         onPress={this.jumpToUserInformationPage}>
                                <UIText value={user.nickname ? user.nickname : (user.phone ? user.phone : 1234)}
                                        style={{ fontSize: 15, color: '#ffffff' }}/>
                                <Image source={whiteArrowRight}
                                       style={{ height: 14, marginLeft: 12 }}
                                       resizeMode={'contain'}/>
                            </NoMoreClick>
                            <ImageBackground style={{ width: 53, height: 14, alignItems: 'center', marginTop: 2 }}
                                             source={levelBg}>
                                <Text style={{
                                    fontSize: 9,
                                    color: '#ffa351'
                                }}>{this.state.levelName ? this.state.levelName : `${'VO'}`}</Text>
                            </ImageBackground>
                            <UIText value={'已帮你省：0.00元'} style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 12,
                                color: '#ffffff',
                                marginTop: 5
                            }}/>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 32, marginTop: 20 }}>
                        <NoMoreClick style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                                     onPress={() => this.go2CashDetailPage(2)}>
                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 14,
                                color: '#ffffff'
                            }}>{this.state.userScore ? this.state.userScore : 0}</Text>
                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 11,
                                color: '#ffffff'
                            }}>秀豆</Text>
                        </NoMoreClick>
                        <View style={{ width: 1, height: '80%', backgroundColor: '#fff' }}/>
                        <NoMoreClick style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                                     onPress={() => this.go2CashDetailPage(3)}>
                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 14,
                                color: '#ffffff'
                            }}>{StringUtils.formatMoneyString(this.state.blockedBalance)}元</Text>
                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 11,
                                color: '#ffffff'
                            }}>待提现金额(元)</Text>
                        </NoMoreClick>
                    </View>
                </ImageBackground>

                <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 10 }}>
                    <View style={{
                        marginLeft: 16,
                        marginRight: 16,
                        height: 106,
                        backgroundColor: color.white,
                        borderRadius: 10
                    }}>
                        <View style={{ flexDirection: 'row', marginLeft: 15, height: 44, alignItems: 'center' }}>
                            <View
                                style={{ width: 3, height: 12, backgroundColor: color.red }}/>
                            <UIText value={'我的钱包'} style={[styles.blackText, { marginLeft: 8 }]}/>
                        </View>
                        {this.renderMyWallet()}
                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 10, marginTop: 50 }}>
                    <View style={{
                        marginLeft: 16,
                        marginRight: 16,
                        height: 128,
                        backgroundColor: color.white,
                        borderRadius: 10
                    }}>
                        <NoMoreClick style={{
                            height: 44,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }} onPress={() => {
                            this.jumpToAllOrder();
                        }}>
                            <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                                <View
                                    style={{ width: 3, height: 12, backgroundColor: color.red }}/>
                                <UIText value={'我的订单'} style={[styles.blackText, { marginLeft: 8 }]}/>
                            </View>
                            <View style={{ flexDirection: 'row', marginRight: 15, alignItems: 'center' }}>
                                <UIText value={'查看全部'}
                                        style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 12, color: '#999999' }}/>
                                <Image source={arrowRight} style={{ height: 12, marginLeft: 6 }}
                                       resizeMode={'contain'}/>
                            </View>
                        </NoMoreClick>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {this.renderOrderStates()}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    renderBodyView = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {this.renderUserHead()}
                <View style={{
                    marginLeft: 16,
                    marginRight: 16,
                    flexDirection: 'row',
                    backgroundColor: color.white,
                    borderRadius: 10,
                    flexWrap: 'wrap'
                }}>

                    {this.renderMenu()}
                </View>

            </ScrollView>
        );
    };

    renderOrderStates = () => {
        let statesImage = [waitPay, waitDelivery, waitReceive, hasFinished];
        let statesText = ['待付款', '待发货', '待收货', '售后/退款'];
        let arr = [];
        for (let i = 0; i < statesImage.length; i++) {
            arr.push(
                <NoMoreClick style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                             onPress={() => this.jumpToOrderAccordingStates(i)} key={i}>
                    <Image source={statesImage[i]}
                           style={{ height: 24, width: 24, marginBottom: 10 }}/>
                    <UIText value={statesText[i]} style={styles.blackText}/>
                </NoMoreClick>
            );
        }
        return arr;
    };
    renderMenu = () => {
        let leftImage = [inviteFr, calendar, coupons, myData, myCollet, myHelper, address, track, showImg];
        let leftText = ['邀请好友', '活动日历', '优惠券', '我的数据', '收藏店铺', '帮助', '地址', '足迹', '发现收藏'];
        let arr = [];
        for (let i = 0; i < leftImage.length; i++) {
            arr.push(
                <NoMoreClick style={{
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10
                }} onPress={() => this.orderMenuJump(i)} key={i}>
                    <Image source={leftImage[i]}
                           style={{ height: 24, width: 24, marginBottom: 10 }}/>
                    <UIText value={leftText[i]} style={styles.greyText}/>
                </NoMoreClick>
            );
        }
        return arr;
    };

    renderMyWallet() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <NoMoreClick style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
                             onPress={() => this.go2CashDetailPage(1)}>
                    <Text style={{
                        fontSize: 14,
                        color: '#212121'
                    }}>{StringUtils.formatMoneyString(this.state.availableBalance)}元</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 11,
                            color: '#666666',
                            marginTop: 8
                        }}>现金余额</Text>
                        <Image source={arrowRight} style={{ width: 5, height: 8, marginLeft: 4, marginTop: 8 }}/>
                    </View>
                </NoMoreClick>
                <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}/>
            </View>
        );
    }

    //跳转到对应的订单状态页面
    jumpToOrderAccordingStates = (index) => {
        if (!user.isLogin) {
            this.props.navigation.navigate('login/login/LoginPage');
            return;
        }
        switch (index) {
            case 0:
                this.props.navigation.navigate('order/order/MyOrdersListPage', { index: 1 });
                break;
            case 1:
                this.props.navigation.navigate('order/order/MyOrdersListPage', { index: 2 });
                break;
            case 2:
                this.props.navigation.navigate('order/order/MyOrdersListPage', { index: 3 });
                break;
            case 3:
                this.props.navigation.navigate('order/afterSaleService/AfterSaleListPage', { index: 4 });
                break;
        }
    };

    //跳转到对应的账户页面
    go2CashDetailPage(i) {
        switch (i) {
            case 1:
                this.$navigate('mine/userInformation/MyCashAccountPage', { availableBalance: this.state.availableBalance });
                break;
            case 2:
                this.$navigate('mine/userInformation/MyIntegralAccountPage', { userScore: this.state.userScore ? this.state.userScore : 0 });
                break;
            case 3:
                this.$navigate('mine/userInformation/WaitingForWithdrawCashPage', { blockedBalance: this.state.blockedBalance ? this.state.blockedBalance : 0 });
                break;
            default:
            // this.props.navigation.navigate('order/order/ConfirOrderPage', { orderParam: { orderType: 2 } });
        }
    }

    orderMenuJump = (index) => {
        // if (!user.isLogin) {
        //     this.props.navigation.navigate('login/login/LoginPage');
        //     return;
        // }
        // let leftText = ['邀请好友', '活动日历', '优惠券', '我的数据', '收藏店铺', '帮助', '地址', '足迹'];
        switch (index) {
            case 0:
                this.props.navigation.navigate('mine/InviteFriendsPage');
                break;
            case 1:
                this.props.navigation.navigate('coupons/CouponsPage');
                break;
            case 2:
                this.props.navigation.navigate('mine/coupons/CouponsPage');
                break;
            case 3:
                this.props.navigation.navigate('mine/MyPromotionPage');
                break;
            case 4:
                // this.props.navigation.navigate('order/order/MyOrdersListPage', { index: 2 });
                this.props.navigation.navigate('mine/MyCollectPage');
                break;
            case 5:
                // this.props.navigation.navigate('mine/MyCollectPage');
                this.props.navigation.navigate('mine/helper/MyHelperPage');
                break;
            case 6:
                this.props.navigation.navigate('mine/AddressManagerPage');
                break;
            case 7:
                // this.props.navigation.navigate('mine/MyAddressBookPage');
                // this.props.navigation.navigate('topic/TopicDetailPage',{activityType:3});
                break;
            case 8:
                this.props.navigation.navigate('show/ShowConnectPage');
                break;
            //邀请评分
            case 10:
                //
                const appId = '1';
                const url = `https://itunes.apple.com/cn/app/id${appId}?mt=8`;
                Platform.OS === 'ios' && Linking.canOpenURL(url).then(() => {
                    Linking.openURL(url);
                }).catch(e => {
                    console.warn(e);
                    // Toast.toast('无法前往AppStore');
                });
                break;
            default:

                break;
        }
    };

    jumpToAllOrder = () => {
        if (!user.isLogin) {
            this.props.navigation.navigate('login/login/LoginPage');
            return;
        }
        this.props.navigation.navigate('order/order/MyOrdersListPage', { index: 0 });
    };
    jumpToServicePage = () => {
        if (!user.isLogin) {
            this.props.navigation.navigate('login/login/LoginPage');
            return;
        }
        this.props.navigation.navigate('message/MessageCenterPage');
    };

    jumpToSettingPage = () => {
        // if (!user.isLogin) {
        //     this.props.navigation.navigate('login/login/LoginPage');
        //     return;
        // }
        this.props.navigation.navigate('mine/SettingPage', { callBack: () => this.loadPageData() });

    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1
        // marginTop: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 0
    },
    whatLeft: {  // 组件定义了一个上边框
        flex: 1,
        borderTopWidth: 1,
        borderColor: 'black',
        backgroundColor: 'green' //每个界面背景颜色不一样
    },
    whiteText: {
        fontSize: 15,
        color: '#ffffff'
    },
    greyText: {
        fontFamily: 'PingFang-SC-Regular',
        fontSize: 12,
        color: '#212121'
    },
    blackText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#000000'
    }

});

