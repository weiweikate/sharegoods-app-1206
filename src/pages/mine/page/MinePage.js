import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ImageBackground,
    Image,
    Platform,
    Linking,
    Text,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';
import BasePage from '../../../BasePage';
import UIText from '../../../components/ui/UIText';
import UIImage from '../../../components/ui/UIImage';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import user from '../../../model/user';
import arrowRight from '../res/homeBaseImg/icon3_07.png';
import waitPay from '../res/homeBaseImg/icon_tool_wait_pay.png';
import waitDelivery from '../res/homeBaseImg/icon_tool_wait_commit.png';
import waitReceive from '../res/homeBaseImg/icon_tool_wait_ensure.png';
import hasFinished from '../res/homeBaseImg/icon_tool_refund.png';

import inviteFr from '../res/homeBaseImg/icon3_16.png';
import coupons from '../res/homeBaseImg/icon3_16-09.png';
import myData from '../res/homeBaseImg/icon3_16-10.png';
import myCollet from '../res/homeBaseImg/icon3_31.png';
import myHelper from '../res/homeBaseImg/icon_31-12.png';
import address from '../res/homeBaseImg/icon31-13.png';
import levelBg from '../res/homeBaseImg/me_bg_vip_nor.png';
import setting from '../res/homeBaseImg/tongyong_icon_shezhi_nor.png';
import service from '../res/homeBaseImg/tongyong_icon_xiaoxi_nor.png';
import promotion from '../res/homeBaseImg/me_icon_tuiguang_nor.png';
import task_icon from '../res/homeBaseImg/me_task_icon.png';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import MineApi from '../api/MineApi';
import { observer } from 'mobx-react/native';
import showImg from '../res/homeBaseImg/icon_faxian.png';
import bgImg from '../res/homeBaseImg/bg_img_user.png';
import rightIcon from '../res/homeBaseImg/me_icon_jinru_nor.png';
import userOrderNum from '../../../model/userOrderNum';
import RouterMap from 'RouterMap';
import DesignRule from 'DesignRule';

/**
 * @author chenxiang
 * @date on 2018/9/13
 * @describe 订单列表
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */

const headerBgSize = { width: 375, height: 200 };

const { px2dp, statusBarHeight } = ScreenUtils;
const headerHeight = ScreenUtils.statusBarHeight + 44;
const offset = ScreenUtils.getImgHeightWithWidth(headerBgSize) - headerHeight;
@observer
export default class MinePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            nickname: user.phone,
            headImg: '',
            netFailedInfo: null,
            loadingState: PageLoadingState.success,
            isRefreshing: false
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
        userOrderNum.getUserOrderNum();
        this.refresh();
    }

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y < offset) {
            this.st = Y / offset;
        } else {
            this.st = 1;
        }
        this.headerBg.setNativeProps({
            opacity: this.st
        });
    };

    refresh = () => {
        userOrderNum.getUserOrderNum();
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
                    userScore: data.userScore ? data.userScore : 0,
                    blockedBalance: data.blockedBalance
                });
            }
        }).catch(err => {
            if (err.code === 10009) {
                this.props.navigation.navigate('login/login/LoginPage', { callback: this.refresh });
            }
        });
    };

    _reload = () => {
        userOrderNum.getUserOrderNum();
        this.setState({
            isRefreshing: true
        });
        MineApi.getUser().then(res => {
            if (res.code == 10000) {
                let data = res.data;
                user.saveUserInfo(data);
                this.setState({
                    availableBalance: data.availableBalance,
                    headImg: data.headImg,
                    levelName: data.levelName,
                    userScore: data.userScore ? data.userScore : 0,
                    blockedBalance: data.blockedBalance,
                    isRefreshing: false
                });
            }
        }).catch(err => {
            this.setState({
                isRefreshing: false
            });
            if (err.code === 10009) {
                this.props.navigation.navigate('login/login/LoginPage', { callback: this.refresh });
            }
        });
    };

    jumpToUserInformationPage = () => {
        if (!user.isLogin) {
            this.props.navigation.navigate('login/login/LoginPage');
            return;
        }
        this.props.navigation.navigate('mine/userInformation/UserInformationPage');
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
                {this.navBackgroundRender()}
                {this.navRender()}
            </View>
        );
    }

    navBackgroundRender() {
        return (
            <View ref={(ref) => this.headerBg = ref}
                  style={{
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 84 : 60) : 60,
                      opacity: 0
                  }}/>
        );
    }

    navRender() {
        return (
            <View
                style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <View style={{ height: ScreenUtils.statusBarHeight }}/>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: px2dp(15),
                    height: 44
                }}>
                    <View style={{ flex: 1 }}/>
                    <Text style={{ justifySelf: 'center', color: '#212121', fontSize: px2dp(17) }}>
                        我的
                    </Text>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        flexDirection: 'row'
                    }}>
                        <UIImage tintColor={DesignRule.textColor_mainTitle} source={setting}
                                 style={{ height: px2dp(17), width: px2dp(17), marginRight: 15 }}
                                 onPress={() => this.jumpToSettingPage()}/>
                        <UIImage tintColor={DesignRule.textColor_mainTitle} source={service}
                                 style={{ height: px2dp(17), width: px2dp(17) }}
                                 onPress={() => this.jumpToServicePage()}/>
                    </View>
                </View>
            </View>
        );
    }

    renderUserHead = () => {
        return (
            <ImageBackground style={styles.headerBgStyle} source={bgImg}>

                <View style={{ flex: 1 }}/>
                <View style={{ height: px2dp(54), marginBottom: px2dp(43), flexDirection: 'row' }}>
                    <TouchableWithoutFeedback onPress={this.jumpToUserInformationPage}>
                        {
                            StringUtils.isEmpty(user.headImg) ?
                                <View style={[styles.userIconStyle, { backgroundColor: 'gray' }]}/> :
                                <Image source={{ uri: user.headImg }} style={styles.userIconStyle}/>
                        }
                    </TouchableWithoutFeedback>
                    <View style={{
                        paddingVertical: px2dp(8),
                        height: px2dp(54),
                        marginLeft: px2dp(8),
                        justifyContent: 'space-between'
                    }}>
                        <TouchableWithoutFeedback onPress={this.jumpToUserInformationPage}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    color: DesignRule.textColor_secondTitle,
                                    fontSize: px2dp(18),
                                    includeFontPadding: false
                                }}>
                                    {`${user.nickname ? user.nickname : (user.phone ? user.phone : '未登陆')}`}
                                </Text>
                                <Image source={rightIcon}
                                       style={{ height: px2dp(12), width: px2dp(7), marginLeft: px2dp(16) }}
                                       resizeMode={'stretch'}/>

                            </View>
                        </TouchableWithoutFeedback>

                        <ImageBackground style={{
                            width: px2dp(44),
                            height: px2dp(24),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                                         source={levelBg}>
                            <Text style={{
                                fontSize: px2dp(12),
                                color: 'white',
                                includeFontPadding: false,
                                marginLeft: px2dp(4.5),
                                marginTop: px2dp(-3)
                            }}>{user.levelName ? user.levelName : `${'VO'}`}</Text>
                        </ImageBackground>
                    </View>
                </View>
                {/*<View style={styles.saveMoneyWrapper}>*/}
                {/*<Text style={{ color: "white", fontSize: px2dp(14), includeFontPadding: false }}>*/}
                {/*21.00元*/}
                {/*</Text>*/}
                {/*<Text style={{ color: "white", fontSize: px2dp(12), includeFontPadding: false }}>*/}
                {/*已帮你省*/}
                {/*</Text>*/}
                {/*</View>*/}
            </ImageBackground>
        );
    };

    accountRender = () => {
        return (
            <View style={{ backgroundColor: 'white', marginTop: px2dp(11) }}>
                <View style={{ height: px2dp(44), paddingHorizontal: px2dp(15), justifyContent: 'center' }}>
                    <Text style={{ color: DesignRule.textColor_secondTitle, fontSize: px2dp(16) }}>
                        我的资产
                    </Text>
                </View>
                <View style={{
                    backgroundColor: '#f3f2f3',
                    width: ScreenUtils.width - px2dp(30),
                    height: px2dp(0.5),
                    alignSelf: 'center'
                }}/>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: px2dp(22),
                    paddingHorizontal: px2dp(15),
                    justifyContent: 'space-between'
                }}>
                    {this.accountItemView(StringUtils.formatMoneyString(user.availableBalance), '现金账户', '#FF4F6E', () => {
                        this.go2CashDetailPage(1);
                    })}
                    {this.accountItemView(StringUtils.isEmpty(user.userScore) ? '0' : user.userScore + '', '秀豆账户', DesignRule.bgColor_yellowCard, () => {
                        this.go2CashDetailPage(2);
                    })}
                    {this.accountItemView(StringUtils.formatMoneyString(user.blockedBalance), '待提现账户', '#8EC7FF', () => {
                        this.go2CashDetailPage(3);
                    })}
                </View>
            </View>
        );
    };


    getAdjustsFontSize = (text) => {
        let fontSize = Math.sqrt(80 * 20 / text.length);
        fontSize = Math.min(fontSize, 19);
        return Math.max(fontSize, 1);
    };

    accountItemView = (num, text, color, onPress) => {
        console.log(num);
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={{
                    backgroundColor: color,
                    width: px2dp(110),
                    height: px2dp(62),
                    borderRadius: px2dp(5),
                    elevation: 2,
                    shadowColor: '#000000',
                    shadowOffset: { h: 2, w: 2 },
                    shadowRadius: px2dp(6),
                    shadowOpacity: 0.1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: px2dp(16),
                    paddingBottom: px2dp(11)
                }}>
                    <Text allowFontScaling={true} style={{
                        textAlign: 'center',
                        color: 'white',
                        includeFontPadding: false,
                        width: 80,
                        height: 20,
                        fontSize: this.getAdjustsFontSize(num)
                    }}>
                        {num}
                    </Text>

                    <Text style={{ color: 'white', fontSize: px2dp(11), includeFontPadding: false }}>
                        {text}
                    </Text>

                </View>
            </TouchableWithoutFeedback>
        );
    };

    orderRender() {
        return (
            <View style={{
                backgroundColor: color.white,
                marginTop: px2dp(10)
            }}>
                <View style={{
                    height: px2dp(44),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                        <UIText value={'我的订单'}
                                style={{ fontSize: px2dp(16), color: DesignRule.textColor_secondTitle }}/>
                    </View>
                    <TouchableWithoutFeedback onPress={this.jumpToAllOrder}>
                        <View style={{ flexDirection: 'row', marginRight: 15, alignItems: 'center' }}>
                            <UIText value={'查看全部'}
                                    style={{
                                        fontSize: px2dp(12),
                                        color: DesignRule.textColor_instruction
                                    }}/>
                            <Image source={arrowRight} style={{ height: 12, marginLeft: 6 }}
                                   resizeMode={'contain'}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{
                    backgroundColor: '#f3f2f3',
                    width: ScreenUtils.width - px2dp(30),
                    height: px2dp(0.5),
                    alignSelf: 'center'
                }}/>
                <View style={{ flex: 1, flexDirection: 'row', paddingBottom: px2dp(28) }}>
                    {this.renderOrderStates()}
                </View>
            </View>

        );
    }

    utilsRender() {
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: color.white,
                flexWrap: 'wrap',
                marginVertical: px2dp(10)
            }}>
                <View style={{ height: px2dp(44), paddingHorizontal: px2dp(15), justifyContent: 'center' }}>
                    <Text style={{ color: DesignRule.textColor_secondTitle, fontSize: px2dp(16) }}>
                        常用工具
                    </Text>
                </View>
                <View style={{
                    backgroundColor: '#f3f2f3',
                    width: ScreenUtils.width - px2dp(30),
                    height: px2dp(0.5),
                    alignSelf: 'center'
                }}/>
                {this.renderMenu()}
            </View>
        );
    }

    renderBodyView = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        onScroll={this._onScroll.bind(this)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._reload}
                                progressViewOffset={statusBarHeight + 44}
                                colors={[DesignRule.mainColor]}
                                title="下拉刷新"
                                tintColor="#999"
                                titleColor="#999"
                            />}
            >
                {this.renderUserHead()}
                {this.accountRender()}
                {this.orderRender()}
                {this.utilsRender()}
            </ScrollView>
        );
    };

    renderOrderStates = () => {
        let statesImage = [waitPay, waitDelivery, hasFinished, waitReceive];
        let statesText = ['待付款', '待发货', '待收货', '售后/退款'];
        let arr = [];
        for (let i = 0; i < statesImage.length; i++) {
            let num = this.getOrderNum(i);
            let numView = num ? (
                <View style={{
                    width: px2dp(16),
                    height: px2dp(16),
                    borderRadius: px2dp(8),
                    position: 'absolute',
                    top: px2dp(-10),
                    right: px2dp(-10),
                    backgroundColor: DesignRule.mainColor,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(10) }}>
                        {num > 99 ? 99 : num}
                    </Text>
                </View>
            ) : null;

            arr.push(
                <NoMoreClick style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: px2dp(30) }}
                             onPress={() => this.jumpToOrderAccordingStates(i)} key={i}>
                    <ImageBackground source={statesImage[i]}
                                     style={{ height: 24, width: 24, marginBottom: 10, overflow: 'visible' }}>
                        {numView}
                    </ImageBackground>
                    <UIText value={statesText[i]}
                            style={{ color: '#212121', includeFontPadding: false, fontSize: px2dp(12) }}/>
                </NoMoreClick>
            );
        }
        return arr;
    };

    getOrderNum(index) {
        switch (index) {
            case 0:
                return userOrderNum.waitPayNum;
                break;
            case 1:
                return userOrderNum.waitSendNum;
                break;
            case 2:
                return userOrderNum.waitReceiveNum;
                break;
            case 3:
                return userOrderNum.afterSaleServiceNum;
                break;
            default:
                return 0;
                break;
        }
    }

    renderMenu = () => {
        let leftImage = [inviteFr, coupons, myData, myCollet, myHelper, address, promotion, task_icon, showImg];
        let leftText = ['邀请好友', '优惠券', '我的数据', '收藏店铺', '帮助与客服', '地址', '我的推广', '我的任务', '发现收藏'];

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
                this.$navigate('mine/userInformation/MyCashAccountPage', { availableBalance: user.availableBalance });
                break;
            case 2:
                this.$navigate('mine/userInformation/MyIntegralAccountPage', { userScore: user.userScore ? user.userScore : 0 });
                break;
            case 3:
                this.$navigate('mine/userInformation/WaitingForWithdrawCashPage', { blockedBalance: user.blockedBalance ? user.blockedBalance : 0 });
                break;
            default:
            // this.props.navigation.navigate('order/order/ConfirOrderPage', { orderParam: { orderType: 2 } });
        }
    }

    orderMenuJump = (index) => {
        // if (!user.isLogin) {
        //     this.props.navigation.navigate('login/login/LoginPage');
        //     return;
        //let leftText = ['邀请好友', '优惠券', '我的数据', '收藏店铺', '帮助', '地址', '足迹', '发现收藏'];
        switch (index) {
            case 0:
                this.props.navigation.navigate(RouterMap.InviteFriendsPage);
                break;
            case 1:
                this.props.navigation.navigate(RouterMap.CouponsPage);
                break;
            case 2:
                this.props.navigation.navigate(RouterMap.MyPromotionPage);
                break;
            case 3:
                // this.props.navigation.navigate('order/order/MyOrdersListPage', { index: 2 });
                this.props.navigation.navigate(RouterMap.MyCollectPage);
                break;
            case 4:
                // this.props.navigation.navigate('mine/MyCollectPage');
                this.props.navigation.navigate(RouterMap.MyHelperPage);
                break;
            case 5:
                this.props.navigation.navigate(RouterMap.AddressManagerPage);
                break;
            case 6:
                this.props.navigation.navigate(RouterMap.UserPromotionPage);
                break;
            case 7:
                this.props.navigation.navigate(RouterMap.ShareTaskListPage);
                break;
            case 8:
                this.props.navigation.navigate(RouterMap.ShowConnectPage);
                break;
            //邀请评分
            case 9:
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
        this.props.navigation.navigate('mine/SettingPage', { callBack: () => this.loadPageData() });

    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    whatLeft: {  // 组件定义了一个上边框
        flex: 1,
        borderTopWidth: 1,
        borderColor: 'black',
        backgroundColor: 'green' //每个界面背景颜色不一样
    },
    whiteText: {
        fontSize: 15,
        color: 'white'
    },
    greyText: {
        fontSize: 12,
        color: '#212121'
    },
    blackText: {
        fontSize: 13,
        color: '#000000'
    },
    headerBgStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.getImgHeightWithWidth(headerBgSize),
        paddingTop: ScreenUtils.statusBarHeight
    },
    userIconStyle: {
        width: px2dp(54),
        height: px2dp(54),
        borderRadius: px2dp(27),
        marginLeft: px2dp(23)
    },
    saveMoneyWrapper: {
        height: px2dp(34),
        width: px2dp(100),
        borderBottomLeftRadius: px2dp(17),
        borderTopLeftRadius: px2dp(17),
        backgroundColor: '#FFC079',
        position: 'absolute',
        right: 0,
        bottom: px2dp(38),
        justifyContent: 'space-between',
        paddingLeft: px2dp(22),
        paddingVertical: px2dp(1)
    }
});

