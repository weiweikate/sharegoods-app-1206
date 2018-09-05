import React, { Component } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image,
    Platform,
    Linking,
    Text
} from "react-native";
import UIText from "../../../components/ui/UIText";
import UIImage from "../../../components/ui/UIImage";
import {  color } from "../../../constants/Theme";
import StringUtils from "../../../utils/StringUtils";
import ScreenUtils from "../../../utils/ScreenUtils";
import { PageLoadingState } from "PageState";
import user from "../../../model/user";
import whiteArrowRight from "../res/homeBaseImg/icon3_03.png";
import arrowRight from "../res/homeBaseImg/icon3_07.png";
import waitPay from "../res/homeBaseImg/icon_03-04.png";
import waitDelivery from "../res/homeBaseImg/icon_03-05.png";
import waitReceive from "../res/homeBaseImg/icon1-03.png";
import hasFinished from "../res/homeBaseImg/icon3_03-06.png";
import headBg from "../res/homeBaseImg/bg3_01.png";
import inviteFr from "../res/homeBaseImg/icon3_16.png";
import calendar from "../res/homeBaseImg/icon3_16-08.png";
import coupons from "../res/homeBaseImg/icon3_16-09.png";
import myData from "../res/homeBaseImg/icon3_16-10.png";
import myCollet from "../res/homeBaseImg/icon3_31.png";
import myHelper from "../res/homeBaseImg/icon_31-12.png";
import address from "../res/homeBaseImg/icon31-13.png";
import track from "../res/homeBaseImg/icon_31-14.png";
import leftBg from "../res/homeBaseImg/bg_03.png";
import levelBg from "../res/homeBaseImg/icon3_03-02.png";
import setting from "../res/homeBaseImg/icon_03.png";
import service from "../res/homeBaseImg/icon02.png";

export default class MinePage extends Component {
    $PageOptions = {
        navigationBarOptions: {
            hideNavBar: true,
        },
        renderByPageState: true
    };

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            list: [],
            refreshing: false,
            netFailedInfo: null,
            loadingState: PageLoadingState.success
        };
    }

    jr_getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    _reload() {
        alert("relod");
    }

    //**********************************ViewPart******************************************
    render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
            </View>
        );
    }

    renderUserHead = () => {
        return (
            <View style={{ height: 442, width: ScreenUtils.width }}>
                    <ImageBackground style={{ height: 220, width: ScreenUtils.width }} source={headBg}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 5,justifyContent:'flex-end',height:44 }}>
                            <UIImage source={setting} style={{ height: 18, width: 22, marginRight: 15 }}
                                     onPress={() => this.jumpToMessagePage()}/>
                            <UIImage source={service} style={{ height: 18, width: 22 }}
                                     onPress={() => this.jumpToSettingPage()}/>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <ImageBackground style={{
                                height: 60,
                                width: 60,
                                marginLeft: 21,
                                marginTop: 11,
                                justifyContent: "center",
                                alignItems: "center"
                            }} source={leftBg}>
                                {
                                    StringUtils.isEmpty("222") ? null :
                                        <Image source={headBg} style={{
                                            height: 50,
                                            width: 50,
                                            borderRadius: 25
                                        }}/>
                                }
                            </ImageBackground>
                            <View style={{
                                marginLeft: 20,
                                justifyContent: "space-between",
                                marginTop: 11
                            }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <UIText value={"鲍勃"}
                                            style={{ fontFamily: "PingFang-SC-Bold", fontSize: 15, color: "#ffffff" }}/>
                                    <Image source={whiteArrowRight}
                                           style={{ height: 14, marginLeft: 12 }}
                                           resizeMode={"contain"}/>
                                </View>
                                <ImageBackground style={{ width: 53, height: 14, alignItems: "center", marginTop: 2 }}
                                                 source={levelBg}>
                                    <Text style={{ fontFamily: "DFPYaSongW9", fontSize: 9, color: "#ffa351" }}>V3</Text>
                                </ImageBackground>
                                <UIText value={"已帮你省：1234.85元"} style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: 12,
                                    color: "#ffffff",
                                    marginTop: 5
                                }}/>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", height: 32, marginTop: 20 }}>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: 14,
                                    color: "#ffffff"
                                }}>0</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: 11,
                                    color: "#ffffff"
                                }}>秀豆</Text>
                            </View>
                            <View style={{ width: 1, height: "80%", backgroundColor: "#fff" }}/>
                            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: 14,
                                    color: "#ffffff"
                                }}>0</Text>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: 11,
                                    color: "#ffffff"
                                }}>待体现金额(元)</Text>
                            </View>
                        </View>
                    </ImageBackground>

                <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 10 }}>
                    <View style={{
                        marginLeft: 16,
                        marginRight: 16,
                        height: 106,
                        backgroundColor: color.white,
                        borderRadius: 10
                    }}>
                        <TouchableOpacity style={{
                            height: 44,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }} onPress={() => {
                            this.jumpToAllOrder();
                        }}>
                            <View style={{ flexDirection: "row", marginLeft: 15, alignItems: "center" }}>
                                <View
                                    style={{ width: 3, height: 12, backgroundColor: color.red }}/>
                                <UIText value={"我的钱包"} style={[styles.blackText, { marginLeft: 8 }]}/>
                            </View>
                        </TouchableOpacity>
                        {this.renderMyWallet()}
                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 10, marginTop: 50 }}>
                    <View style={{
                        marginLeft: 16,
                        marginRight: 16,
                        height: 128,
                        backgroundColor: color.white,
                        borderRadius: 10
                    }}>
                        <TouchableOpacity style={{
                            height: 44,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }} onPress={() => {
                            this.jumpToAllOrder();
                        }}>
                            <View style={{ flexDirection: "row", marginLeft: 15, alignItems: "center" }}>
                                <View
                                    style={{ width: 3, height: 12, backgroundColor: color.red }}/>
                                <UIText value={"我的订单"} style={[styles.blackText, { marginLeft: 8 }]}/>
                            </View>
                            <View style={{ flexDirection: "row", marginRight: 15, alignItems: "center" }}>
                                <UIText value={"查看全部"} style={{fontFamily: "PingFang-SC-Medium", fontSize: 12, color: "#999999"}}/>
                                <Image source={arrowRight} style={{ height: 12,marginLeft:6 }} resizeMode={"contain"}/>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flex: 1, flexDirection: "row" }}>
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
                    flexDirection: "row",
                    backgroundColor: color.white,
                    borderRadius: 10,
                    flexWrap: "wrap"
                }}>

                    {this.renderMenu()}
                </View>

            </ScrollView>
        );
    };

    renderOrderStates = () => {
        let statesImage = [waitPay, waitDelivery, waitReceive, hasFinished];
        let statesText = ["待付款", "待发货", "待收货", "售后/退款"];
        let arr = [];
        for (let i = 0; i < statesImage.length; i++) {
            arr.push(
                <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                                  onPress={() => this.jumpToOrderAccordingStates(i)} key={i}>
                    <Image source={statesImage[i]}
                           style={{ height: 24, width: 24, marginBottom: 10 }}/>
                    <UIText value={statesText[i]} style={styles.blackText}/>
                </TouchableOpacity>
            );
        }
        return arr;
    };
    renderMenu = () => {
        let leftImage = [inviteFr, calendar, coupons, myData, myCollet, myHelper, address, track];
        let leftText = ["邀请好友", "活动日历", "优惠券", "我的数据", "收藏店铺", "帮助", "地址", "足迹"];
        let arr = [];
        for (let i = 0; i < leftImage.length; i++) {
            arr.push(
                <TouchableOpacity style={{
                    width: "25%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 10
                }} onPress={() => this.orderMenuJump(i)} key={i}>
                    <Image source={leftImage[i]}
                           style={{ height: 24, width: 24, marginBottom: 10 }}/>
                    <UIText value={leftText[i]} style={styles.blackText}/>
                </TouchableOpacity>
            );
        }
        return arr;
    };
    renderMyWallet = () => {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
                    <Text style={{ fontFamily: "PingFang-SC-Bold", fontSize: 14, color: "#212121" }}>234234.45元</Text>
                    <Text style={{
                        fontFamily: "PingFang-SC-Medium",
                        fontSize: 11,
                        color: "#666666",
                        marginTop: 8
                    }}>现金余额</Text>
                </View>
                <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
                    <Text style={{ fontFamily: "PingFang-SC-Bold", fontSize: 14, color: "#212121" }}>234234.45元</Text>
                    <Text style={{
                        fontFamily: "PingFang-SC-Medium",
                        fontSize: 11,
                        color: "#666666",
                        marginTop: 8
                    }}>现金余额</Text>
                </View>

            </View>
        );
    };
    //**********************************BusinessPart******************************************
    jumpToOrderAccordingStates = (index) => {
        if (!user.isLogin) {
            this.navigate("login/Login");
            return;
        }
        switch (index) {
            case 0:
                this.navigate("order/order/MyOrdersListPage", { index: 1 });
                break;
            case 1:
                this.navigate("order/order/MyOrdersListPage", { index: 2 });
                break;
            case 2:
                this.navigate("order/order/MyOrdersListPage", { index: 3 });
                break;
            case 3:
                this.navigate("order/order/MyOrdersListPage", { index: 4 });
                break;
        }
    };
    orderMenuJump = (index) => {
        if (!user.isLogin) {
            this.navigate("login/Login");
            return;
        }
        // let leftText=['我的账户','我的优惠劵','我的数据','我的库存','发货订单','我的收藏','收藏店铺','通讯录','邀请好友','帮助与客服',]
        switch (index) {
            case 0:
                this.navigate("mine/myAccount/MyAccountPage");
                break;
            case 1:
                this.navigate("coupons/CouponsPage");
                break;
            case 2:
                this.navigate("mine/myData/MyDataPage");
                break;
            case 3:
                this.navigate("mine/inventory/AddPage");
                break;
            case 4:
                this.navigate("order/order/MyOrdersListPage", { index: 2 });
                break;
            case 5:
                this.navigate("mine/MyCollectPage");
                break;
            case 6:
                this.navigate("spellShop/collect/ShopCollectPage");
                break;
            case 7:
                this.navigate("mine/MyAddressBookPage");
                break;
            case 8:
                this.navigate("mine/myData/InvitationPage");
                break;
            case 9:
                this.navigate("mine/MyHelperPage");
                break;
            //邀请评分
            case 10:
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

    loadPageData() {
    }

    jumpToAllOrder = () => {
        if (!user.isLogin) {
            this.navigate("login/Login");
            return;
        }
        this.navigate("order/order/MyOrdersListPage");
    };
    jumpToMessagePage = () => {
        if (!user.isLogin) {
            this.navigate("login/Login");
            return;
        }
        this.navigate("message/MessageCenterPage");
    };

    jumpToSettingPage = () => {
        if (!user.isLogin) {
            this.navigate("login/Login");
            return;
        }
        this.navigate("setting/SettingPage", { callBack: () => this.loadPageData() });

    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1
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
    blackText: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color: "#000000"
    }

});

