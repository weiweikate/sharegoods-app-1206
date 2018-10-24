import React from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    ImageBackground,
    Image,
    Platform,
    Linking,
    Text,
    TouchableWithoutFeedback
} from "react-native";
import BasePage from "../../../BasePage";
import UIText from "../../../components/ui/UIText";
import UIImage from "../../../components/ui/UIImage";
import { color } from "../../../constants/Theme";
import StringUtils from "../../../utils/StringUtils";
import ScreenUtils from "../../../utils/ScreenUtils";
import { PageLoadingState } from "../../../components/pageDecorator/PageState";
import user from "../../../model/user";
// import whiteArrowRight from "../res/homeBaseImg/icon3_03.png";
import arrowRight from "../res/homeBaseImg/icon3_07.png";
import waitPay from "../res/homeBaseImg/icon_03-04.png";
import waitDelivery from "../res/homeBaseImg/icon_03-05.png";
import waitReceive from "../res/homeBaseImg/icon1-03.png";
import hasFinished from "../res/homeBaseImg/icon3_03-06.png";
import headBg from "../res/homeBaseImg/bg3_01.png";
import inviteFr from "../res/homeBaseImg/icon3_16.png";
import coupons from "../res/homeBaseImg/icon3_16-09.png";
import myData from "../res/homeBaseImg/icon3_16-10.png";
import myCollet from "../res/homeBaseImg/icon3_31.png";
import myHelper from "../res/homeBaseImg/icon_31-12.png";
import address from "../res/homeBaseImg/icon31-13.png";
// import leftBg from "../res/homeBaseImg/bg_03.png";
import levelBg from "../res/homeBaseImg/icon3_03-02.png";
import setting from "../res/homeBaseImg/icon_03.png";
import service from "../res/homeBaseImg/icon02.png";
import promotion from "../res/homeBaseImg/me_icon_tuiguang_nor.png";
import NoMoreClick from "../../../components/ui/NoMoreClick";
import MineApi from "../api/MineApi";
import { observer } from "mobx-react/native";
import showImg from "../res/homeBaseImg/icon_faxian.png";

const { px2dp } = ScreenUtils;

@observer
export default class MinePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            nickname: user.phone,
            headImg: "",
            availableBalance: 0,//现金余额
            blockedBalance: 0,//待提现
            levelName: "V0",
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
            this.props.navigation.navigate("login/login/LoginPage", { callback: this.refresh });
            return;
        }
        this.refresh();
    }

    refresh = () => {
        this.$loadingShow("加载中...", { timeout: 1, timeoutCallBack: () => this.timeoutCallBack });
        MineApi.getUser().then(res => {
            this.$loadingDismiss();
            if (res.code == 10000) {
                let data = res.data;
                // user.saveUserInfo(data);
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
                this.props.navigation.navigate("login/login/LoginPage", { callback: this.refresh });
            }
        });
    };

    _reload() {
        alert("relod");
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
            this.props.navigation.navigate("login/login/LoginPage");
            return;
        }
        this.props.navigation.navigate("mine/userInformation/UserInformationPage");
    };

    // renderUserHead = () => {
    //     return (
    //         <View style={{
    //             height: 462 + (ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 0),
    //             width: ScreenUtils.width
    //         }}>
    //             <ImageBackground style={{
    //                 height: 240 + (ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 0),
    //                 width: ScreenUtils.width
    //             }} source={headBg}>
    //                 <View style={{
    //                     flexDirection: "row",
    //                     alignItems: "center",
    //                     marginRight: 5,
    //                     justifyContent: "flex-end",
    //                     height: 40,
    //                     marginTop: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 20
    //                 }}>
    //                     <UIImage source={setting} style={{ height: 18, width: 22, marginRight: 15 }}
    //                              onPress={() => this.jumpToSettingPage()}/>
    //                     <UIImage source={service} style={{ height: 18, width: 22 }}
    //                              onPress={() => this.jumpToServicePage()}/>
    //                 </View>
    //                 <View style={{ flexDirection: "row", alignItems: "center" }}>
    //                     <NoMoreClick onPress={this.jumpToUserInformationPage}>
    //                         <ImageBackground style={{
    //                             height: 60,
    //                             width: 60,
    //                             marginLeft: 21,
    //                             marginTop: 5,
    //                             justifyContent: "center",
    //                             alignItems: "center"
    //                         }} source={leftBg}>
    //                             {
    //                                 StringUtils.isEmpty(user.headImg) ? null :
    //                                     <Image source={{ uri: user.headImg ? user.headImg : "" }} style={{
    //                                         height: 50,
    //                                         width: 50,
    //                                         borderRadius: 25
    //                                     }}/>
    //                             }
    //                         </ImageBackground>
    //                     </NoMoreClick>
    //                     <View style={{
    //                         marginLeft: 20,
    //                         justifyContent: "space-between",
    //                         marginTop: 11
    //                     }}>
    //                         <NoMoreClick style={{ flexDirection: "row", alignItems: "center" }}
    //                                      onPress={this.jumpToUserInformationPage}>
    //                             <UIText value={user.nickname ? user.nickname : (user.phone ? user.phone : 1234)}
    //                                     style={{ fontSize: 15, color: "#ffffff" }}/>
    //                             <Image source={whiteArrowRight}
    //                                    style={{ height: 14, marginLeft: 12 }}
    //                                    resizeMode={"contain"}/>
    //                         </NoMoreClick>
    //                         <ImageBackground style={{ width: 53, height: 14, alignItems: "center", marginTop: 2 }}
    //                                          source={levelBg}>
    //                             <Text style={{
    //                                 fontSize: 9,
    //                                 color: "#ffa351"
    //                             }}>{this.state.levelName ? this.state.levelName : `${"VO"}`}</Text>
    //                         </ImageBackground>
    //                         <UIText value={"已帮你省：0.00元"} style={{
    //                             fontFamily: "PingFang-SC-Medium",
    //                             fontSize: 12,
    //                             color: "#ffffff",
    //                             marginTop: 5
    //                         }}/>
    //                     </View>
    //                 </View>
    //                 <View style={{ flexDirection: "row", alignItems: "center", height: 32, marginTop: 20 }}>
    //                     <NoMoreClick style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    //                                  onPress={() => this.go2CashDetailPage(2)}>
    //                         <Text style={{
    //                             fontFamily: "PingFang-SC-Medium",
    //                             fontSize: 14,
    //                             color: "#ffffff"
    //                         }}>{this.state.userScore ? this.state.userScore : 0}</Text>
    //                         <Text style={{
    //                             fontFamily: "PingFang-SC-Medium",
    //                             fontSize: 11,
    //                             color: "#ffffff"
    //                         }}>秀豆</Text>
    //                     </NoMoreClick>
    //                     <View style={{ width: 1, height: "80%", backgroundColor: "#fff" }}/>
    //                     <NoMoreClick style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    //                                  onPress={() => this.go2CashDetailPage(3)}>
    //                         <Text style={{
    //                             fontFamily: "PingFang-SC-Medium",
    //                             fontSize: 14,
    //                             color: "#ffffff"
    //                         }}>{StringUtils.formatMoneyString(this.state.blockedBalance)}元</Text>
    //                         <Text style={{
    //                             fontFamily: "PingFang-SC-Medium",
    //                             fontSize: 11,
    //                             color: "#ffffff"
    //                         }}>待提现金额(元)</Text>
    //                     </NoMoreClick>
    //                 </View>
    //             </ImageBackground>
    //
    //             <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 10 }}>
    //                 <View style={{
    //                     marginLeft: 16,
    //                     marginRight: 16,
    //                     height: 106,
    //                     backgroundColor: color.white,
    //                     borderRadius: 10
    //                 }}>
    //                     <View style={{ flexDirection: "row", marginLeft: 15, height: 44, alignItems: "center" }}>
    //                         <View
    //                             style={{ width: 3, height: 12, backgroundColor: color.red }}/>
    //                         <UIText value={"我的钱包"} style={[styles.blackText, { marginLeft: 8 }]}/>
    //                     </View>
    //                     {this.renderMyWallet()}
    //                 </View>
    //             </View>
    //
    //             <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 10, marginTop: 50 }}>
    //                 <View style={{
    //                     marginLeft: 16,
    //                     marginRight: 16,
    //                     height: 128,
    //                     backgroundColor: color.white,
    //                     borderRadius: 10
    //                 }}>
    //                     <NoMoreClick style={{
    //                         height: 44,
    //                         flexDirection: "row",
    //                         alignItems: "center",
    //                         justifyContent: "space-between"
    //                     }} onPress={() => {
    //                         this.jumpToAllOrder();
    //                     }}>
    //                         <View style={{ flexDirection: "row", marginLeft: 15, alignItems: "center" }}>
    //                             <View
    //                                 style={{ width: 3, height: 12, backgroundColor: color.red }}/>
    //                             <UIText value={"我的订单"} style={[styles.blackText, { marginLeft: 8 }]}/>
    //                         </View>
    //                         <View style={{ flexDirection: "row", marginRight: 15, alignItems: "center" }}>
    //                             <UIText value={"查看全部"}
    //                                     style={{ fontFamily: "PingFang-SC-Medium", fontSize: 12, color: "#999999" }}/>
    //                             <Image source={arrowRight} style={{ height: 12, marginLeft: 6 }}
    //                                    resizeMode={"contain"}/>
    //                         </View>
    //                     </NoMoreClick>
    //                     <View style={{ flex: 1, flexDirection: "row" }}>
    //                         {this.renderOrderStates()}
    //                     </View>
    //                 </View>
    //             </View>
    //         </View>
    //     );
    // };

    renderUserHead = () => {
        return (
            <ImageBackground style={styles.headerBgStyle} source={headBg}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingRight: px2dp(15),
                    height: 40
                }}>
                    <View style={{ flex: 1 }}/>
                    <Text style={{ justifySelf: "center", color: "#212121", fontSize: px2dp(17) }}>
                        我的
                    </Text>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", flexDirection: "row" }}>
                        <UIImage tintColor={"#222222"} source={setting}
                                 style={{ height: px2dp(17), width: px2dp(17), marginRight: 15 }}
                                 onPress={() => this.jumpToSettingPage()}/>
                        <UIImage tintColor={"#222222"} source={service} style={{ height: px2dp(16), width: px2dp(20) }}
                                 onPress={() => this.jumpToServicePage()}/>
                    </View>
                </View>
                <View style={{ flex: 1 }}/>
                <View style={{ height: px2dp(54), marginBottom: px2dp(43), flexDirection: "row" }}>
                    <TouchableWithoutFeedback onPress={this.jumpToUserInformationPage}>

                    {
                        StringUtils.isEmpty(user.headImg) ? <Image style={styles.userIconStyle}/> :
                            <Image source={{ uri: user.headImg ? user.headImg : "" }} style={styles.userIconStyle}/>
                    }
                    </TouchableWithoutFeedback>
                    <View style={{
                        paddingVertical: px2dp(8),
                        height: px2dp(54),
                        marginLeft: px2dp(8),
                        justifyContent: "space-between"
                    }}>
                        <Text style={{ color: "#666666", fontSize: px2dp(18), includeFontPadding: false }}>
                            {`${user.nickname ? user.nickname : (user.phone ? user.phone : 1234)}  `}
                            <Text style={{ color: "#999999", fontSize: px2dp(18), includeFontPadding: false }}>
                                >
                            </Text>
                        </Text>

                        <ImageBackground style={{ width: 53, height: 14, alignItems: "center", marginTop: 2 }}
                                         source={levelBg}>
                            <Text style={{
                                fontSize: 9,
                                color: "white"
                            }}>{this.state.levelName ? this.state.levelName : `${"VO"}`}</Text>
                        </ImageBackground>
                    </View>
                </View>
                <View style={styles.saveMoneyWrapper}>
                    <Text style={{ color: "white", fontSize: px2dp(14), includeFontPadding: false }}>
                        21.00元
                    </Text>
                    <Text style={{ color: "white", fontSize: px2dp(12), includeFontPadding: false }}>
                        已帮你省
                    </Text>
                </View>
            </ImageBackground>
        );
    };

    accountRender = () => {
        return (
            <View style={{ backgroundColor: "white", marginTop: px2dp(11) }}>
                <View style={{ height: px2dp(44), paddingHorizontal: px2dp(15), justifyContent: "center" }}>
                    <Text style={{ color: "#666666", fontSize: px2dp(16) }}>
                        我的资产
                    </Text>
                </View>
                <View style={{
                    backgroundColor: "#f3f2f3",
                    width: ScreenUtils.width - px2dp(30),
                    height: px2dp(0.5),
                    alignSelf: "center"
                }}/>
                <View style={{
                    flexDirection: "row",
                    paddingVertical: px2dp(22),
                    paddingHorizontal: px2dp(15),
                    justifyContent: "space-between"
                }}>
                    {this.accountItemView(StringUtils.formatMoneyString(this.state.availableBalance), "现金账户", "#FF4F6E")}
                    {this.accountItemView(this.state.userScore ? this.state.userScore : 0, "秀豆账户", "#FFC079")}
                    {this.accountItemView(StringUtils.formatMoneyString(this.state.blockedBalance), "待提现账户", "#8EC7FF")}
                </View>
            </View>
        );
    };

    accountItemView(num, text, color) {
        return (
            <View style={{
                backgroundColor: color,
                width: px2dp(110),
                height: px2dp(62),
                borderRadius: px2dp(5),
                elevation: 2,
                shadowColor: "#000000",
                shadowOffset: { h: 2, w: 2 },
                shadowRadius: px2dp(6),
                shadowOpacity: 0.1,
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: px2dp(16),
                paddingBottom: px2dp(11),
            }}>
                <Text style={{ color: "white", fontSize: px2dp(19), includeFontPadding: false }}>
                    {num}
                </Text>

                <Text style={{ color: "white", fontSize: px2dp(11), includeFontPadding: false }}>
                    {text}
                </Text>

            </View>
        );
    }

    orderRender() {
        return (


            <View style={{
                backgroundColor: color.white,
                marginTop: px2dp(10)
            }}>
                <View style={{
                    height: px2dp(44),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <View style={{ flexDirection: "row", marginLeft: 15, alignItems: "center" }}>
                        <UIText value={"我的订单"} style={{ fontSize: px2dp(16), color: "#666666" }}/>
                    </View>
                    <TouchableWithoutFeedback onPress={this.jumpToAllOrder}>
                        <View style={{ flexDirection: "row", marginRight: 15, alignItems: "center" }}>
                            <UIText value={"查看全部"}
                                    style={{
                                        fontFamily: "PingFang-SC-Medium",
                                        fontSize: px2dp(12),
                                        color: "#999999"
                                    }}/>
                            <Image source={arrowRight} style={{ height: 12, marginLeft: 6 }}
                                   resizeMode={"contain"}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{
                    backgroundColor: "#f3f2f3",
                    width: ScreenUtils.width - px2dp(30),
                    height: px2dp(0.5),
                    alignSelf: "center"
                }}/>
                <View style={{ flex: 1, flexDirection: "row", paddingBottom: px2dp(28) }}>
                    {this.renderOrderStates()}
                </View>
            </View>

        );
    }

    utilsRender(){
        return(
            <View style={{
                flexDirection: "row",
                backgroundColor: color.white,
                flexWrap: "wrap",
                marginTop:px2dp(10)
            }}>
                <View style={{ height: px2dp(44), paddingHorizontal: px2dp(15), justifyContent: "center" }}>
                    <Text style={{ color: "#666666", fontSize: px2dp(16) }}>
                        我的资产
                    </Text>
                </View>
                <View style={{
                    backgroundColor: "#f3f2f3",
                    width: ScreenUtils.width - px2dp(30),
                    height: px2dp(0.5),
                    alignSelf: "center"
                }}/>
                {this.renderMenu()}
            </View>
        )
    }

    renderBodyView = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {this.renderUserHead()}
                {this.accountRender()}
                {this.orderRender()}
                {this.utilsRender()}
            </ScrollView>
        );
    };

    renderOrderStates = () => {
        let statesImage = [waitPay, waitDelivery, waitReceive, hasFinished];
        let statesText = ["待付款", "待发货", "待收货", "售后/退款"];
        let arr = [];
        for (let i = 0; i < statesImage.length; i++) {
            arr.push(
                <NoMoreClick style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: px2dp(30) }}
                             onPress={() => this.jumpToOrderAccordingStates(i)} key={i}>
                    <ImageBackground source={statesImage[i]}
                                     style={{ height: 24, width: 24, marginBottom: 10, overflow: "visible" }}>
                        <View style={{
                            width: px2dp(18),
                            height: px2dp(18),
                            borderRadius: px2dp(9),
                            position: "absolute",
                            top: px2dp(-10),
                            right: px2dp(-10),
                            backgroundColor: "#D51243",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Text style={{ includeFontPadding: false, color: "white", fontSize: px2dp(10) }}>
                                1
                            </Text>
                        </View>

                    </ImageBackground>
                    <UIText value={statesText[i]}
                            style={{ color: "#212121", includeFontPadding: false, fontSize: px2dp(12) }}/>
                </NoMoreClick>
            );
        }
        return arr;
    };
    renderMenu = () => {
        let leftImage = [inviteFr, coupons, myData, myCollet, myHelper, address, promotion, showImg];
        let leftText = ["邀请好友", "优惠券", "我的数据", "收藏店铺", "帮助", "地址", "我的推广", "发现收藏"];

        let arr = [];
        for (let i = 0; i < leftImage.length; i++) {
            arr.push(
                <NoMoreClick style={{
                    width: "25%",
                    justifyContent: "center",
                    alignItems: "center",
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
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <NoMoreClick style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
                             onPress={() => this.go2CashDetailPage(1)}>
                    <Text style={{
                        fontSize: 14,
                        color: "#212121"
                    }}>{StringUtils.formatMoneyString(this.state.availableBalance)}元</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{
                            fontFamily: "PingFang-SC-Medium",
                            fontSize: 11,
                            color: "#666666",
                            marginTop: 8
                        }}>现金余额</Text>
                        <Image source={arrowRight} style={{ width: 5, height: 8, marginLeft: 4, marginTop: 8 }}/>
                    </View>
                </NoMoreClick>
                <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}/>
            </View>
        );
    }

//跳转到对应的订单状态页面
    jumpToOrderAccordingStates = (index) => {
        if (!user.isLogin) {
            this.props.navigation.navigate("login/login/LoginPage");
            return;
        }
        switch (index) {
            case 0:
                this.props.navigation.navigate("order/order/MyOrdersListPage", { index: 1 });
                break;
            case 1:
                this.props.navigation.navigate("order/order/MyOrdersListPage", { index: 2 });
                break;
            case 2:
                this.props.navigation.navigate("order/order/MyOrdersListPage", { index: 3 });
                break;
            case 3:
                this.props.navigation.navigate("order/afterSaleService/AfterSaleListPage", { index: 4 });
                break;
        }
    };

//跳转到对应的账户页面
    go2CashDetailPage(i) {
        switch (i) {
            case 1:
                this.$navigate("mine/userInformation/MyCashAccountPage", { availableBalance: this.state.availableBalance });
                break;
            case 2:
                this.$navigate("mine/userInformation/MyIntegralAccountPage", { userScore: this.state.userScore ? this.state.userScore : 0 });
                break;
            case 3:
                this.$navigate("mine/userInformation/WaitingForWithdrawCashPage", { blockedBalance: this.state.blockedBalance ? this.state.blockedBalance : 0 });
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
                this.props.navigation.navigate("mine/InviteFriendsPage");
                break;
            case 1:
                this.props.navigation.navigate("mine/coupons/CouponsPage");
                break;
            case 2:
                this.props.navigation.navigate("mine/MyPromotionPage");
                break;
            case 3:
                // this.props.navigation.navigate('order/order/MyOrdersListPage', { index: 2 });
                this.props.navigation.navigate("mine/MyCollectPage");
                break;
            case 4:
                // this.props.navigation.navigate('mine/MyCollectPage');
                this.props.navigation.navigate("mine/helper/MyHelperPage");
                break;
            case 5:
                this.props.navigation.navigate("mine/AddressManagerPage");
                break;
            case 6:
                this.props.navigation.navigate("mine/promotion/UserPromotionPage");
                break;
            case 7:
                this.props.navigation.navigate("show/ShowConnectPage");
                break;
            case 8:

            //邀请评分
            case 9:
                //
                const appId = "1";
                const url = `https://itunes.apple.com/cn/app/id${appId}?mt=8`;
                Platform.OS === "ios" && Linking.canOpenURL(url).then(() => {
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
            this.props.navigation.navigate("login/login/LoginPage");
            return;
        }
        this.props.navigation.navigate("order/order/MyOrdersListPage", { index: 0 });
    };
    jumpToServicePage = () => {
        if (!user.isLogin) {
            this.props.navigation.navigate("login/login/LoginPage");
            return;
        }
        this.props.navigation.navigate("message/MessageCenterPage");
    };

    jumpToSettingPage = () => {
        // if (!user.isLogin) {
        //     this.props.navigation.navigate('login/login/LoginPage');
        //     return;
        // }
        this.props.navigation.navigate("mine/SettingPage", { callBack: () => this.loadPageData() });

    };
}
const headerBgSize = { width: 375, height: 200 };
const styles = StyleSheet.create({
    container: {
        flex: 1
        // marginTop: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 0
    },
    whatLeft: {  // 组件定义了一个上边框
        flex: 1,
        borderTopWidth: 1,
        borderColor: "black",
        backgroundColor: "green" //每个界面背景颜色不一样
    },
    whiteText: {
        fontSize: 15,
        color: "#ffffff"
    },
    greyText: {
        fontFamily: "PingFang-SC-Regular",
        fontSize: 12,
        color: "#212121"
    },
    blackText: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color: "#000000"
    },
    headerBgStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.getImgHeightWithWidth(headerBgSize),
        paddingTop: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 20
    },
    userIconStyle: {
        width: px2dp(54),
        height: px2dp(54),
        borderRadius: px2dp(27),
        backgroundColor: "red",
        marginLeft: px2dp(23)
    },
    saveMoneyWrapper: {
        height: px2dp(34),
        width: px2dp(100),
        borderBottomLeftRadius: px2dp(17),
        borderTopLeftRadius: px2dp(17),
        backgroundColor: "#FFC079",
        position: "absolute",
        right: 0,
        bottom: px2dp(38),
        justifyContent: "space-between",
        paddingLeft: px2dp(22)
    }


});

