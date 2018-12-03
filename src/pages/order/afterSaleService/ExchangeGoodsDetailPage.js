/**
 * pageType 0 退款详情  1 退货详情   2 换货详情
 * returnProductId
 */
import React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    DeviceEventEmitter,
    Alert
} from "react-native";
import BasePage from "../../../BasePage";
import AddressItem from "../components/AddressItem";
import UserSingleItem from "../components/UserSingleItem";
import { UIText } from "../../../components/ui";
import UIImage from "@mr/image-placeholder";
import StringUtils from "../../../utils/StringUtils";
import GoodsItem from "../components/GoodsGrayItem";
// import DateUtils from '../../../utils/DateUtils';
import EmptyUtils from "../../../utils/EmptyUtils";
import OrderApi from "../api/orderApi";
import DesignRule from "DesignRule";
import ScreenUtils from "../../../utils/ScreenUtils";
import {
    CustomerServiceView,
    AfterSaleInfoView,
    OperationApplyView,
    TipView,
    HeaderView
} from "./components";
import res from "../res";

const {
    right_arrow,
    addressLine
} = res;

class ExchangeGoodsDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            pageType: this.params.pageType ? this.params.pageType : 0
        };

        this._bindFunc();

    }

    $navigationBarOptions = {
        title: ["退款详情", "退货详情", "换货详情"][this.params.pageType],
        show: true// false则隐藏导航
    };

    $NavigationBarDefaultLeftPressed = () => {
        this.$navigateBack("order/order/MyOrdersDetailPage");
    };

    _bindFunc() {
        this.renderReturnGoodsView = this.renderReturnGoodsView.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
    }

    //**********************************ViewPart******************************************
    _render() {
        if (EmptyUtils.isEmpty(this.state.pageData)) {
            return;
        }
        let { pageType } = this.params;
        let { status } = this.state.pageData;
        let isShow_operationApplyView = status === 1;
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TipView pageType={pageType} status={status}/>
                    <HeaderView pageType={pageType} status={status}/>
                    {isShow_operationApplyView ?
                        <OperationApplyView pageType={pageType}
                                            cancelPress={this.cancelPress}
                                            changePress={this.changePress}/> : null}
                    {this.renderArefundView()}
                    {this.renderReturnGoodsView()}
                    {this.renderHuan()}
                    {this.renderAddress()}
                    {this.renderLogistics()}
                    {this.renderOrder()}
                    <GoodsItem
                        uri={this.state.pageData.specImg}
                        goodsName={this.state.pageData.productName}
                        salePrice={StringUtils.formatMoneyString(this.state.pageData.price)}
                        category={this.state.pageData.spec}
                        goodsNum={this.state.pageData.num}
                        style={{ backgroundColor: DesignRule.white }}
                    />
                    <AfterSaleInfoView pageData={this.state.pageData}
                                       pageType={pageType}
                    />
                </ScrollView>
                <CustomerServiceView/>
            </View>
        );
    }

    //取消申请
    cancelPress = () => {
        this.loadPageData(() => this.onPressOperationApply(true));
    };
    //修改申请
    changePress = () => {
        this.loadPageData(() => this.onPressOperationApply(false));
    };

    /**  退款详情专用  中间一段View */
    renderArefundView = () => {
        if (this.state.pageData === null || this.state.pageData.undefined || this.params.pageType !== 0) {
            return null;// 数据没有请求下来，或不是退款详情页面
        }
        //退款成功的时候页面是和其他状态不一样的
        let isSuccess = this.state.pageData.status === 6 ? true : false;
        // if (this.state.pageData.status === 1){
        //     return null;
        // }
        let isRefused = this.state.pageData.status === 3 ? true : false;
        return this.renderItems(isSuccess, isRefused);
    };

    renderHuan = () => {
        if (this.state.pageData === null || this.state.pageData.undefined || this.params.pageType !== 2) {
            return null;// 数据没有请求下来，或不是换货详情页面
        }
        if (this.state.pageData.status === 3 || this.state.pageData.status === 9) {
            return this.renderItems(false, true);
        }
    };

    /**  退货详情专用  中间一段View */
    renderReturnGoodsView() {
        if (this.state.pageData === null || this.state.pageData.undefined || this.params.pageType !== 1) {
            return null;// 数据没有请求下来，或不是退款详情页面
        }
        if (this.state.pageData.status === 6) {
            return this.renderItems(true, false);
        } else if (this.state.pageData.status === 3 || this.state.pageData.status === 9) {
            return (
                <View style={{
                    height: 44,
                    flexDirection: "row",
                    backgroundColor: "white",
                    alignItems: "center",
                    marginBottom: 10
                }}>
                    <UIText value={"拒绝原因：" + this.state.pageData.refusalReason}
                            style={{ color: DesignRule.textColor_mainTitle, fontSize: 13, marginLeft: 15 }}/>
                </View>
            );
        } else if (this.state.pageData.status === 1) {
            return this.renderItems(false, false);
        }
    }

    renderItems(isSuccess, isRefused) {
        let orderReturnAmounts = this.state.pageData.orderReturnAmounts || {};
        return (
            <View>
                <View style={{
                    height: 44,
                    marginTop: isSuccess === false && isRefused === false ? 10 : 0,//没成功，也没失败，申请中
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 15,
                    paddingRight: 15
                }}>
                    <View style={{
                        height: 44,
                        flexDirection: "row",
                        backgroundColor: "white",
                        alignItems: "center"
                    }}>{
                        isRefused ?
                            <UIText value={"拒绝原因：" + this.state.pageData.refusalReason}
                                    style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
                            :
                            <View style={{ height: 44, flexDirection: "row", alignItems: "center" }}>
                                <UIText value={"退款金额:"}
                                        style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
                                <UIText value={StringUtils.formatMoneyString(this.state.pageData.totalRefundPrice)}
                                        style={{ color: DesignRule.mainColor, fontSize: 13, marginLeft: 5 }}/>
                            </View>
                    }

                    </View>
                    {
                        isSuccess ? <UIText value={"已退款"}
                                            style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/> : null
                    }
                </View>
                {
                    isSuccess ? (
                        <View>
                            <View
                                style={{
                                    backgroundColor: DesignRule.bgColor,
                                    height: 40,
                                    justifyContent: "center",
                                    paddingLeft: 15
                                }}>
                                <UIText value={"退款明细"}
                                        style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
                            </View>
                            <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={"退回银行卡"}
                                            leftTextStyle={{
                                                color: DesignRule.textColor_mainTitle,
                                                fontSize: 13
                                            }}
                                            rightText={StringUtils.formatMoneyString(orderReturnAmounts.actualAmounts)}
                                            rightTextStyle={{
                                                color: DesignRule.textColor_mainTitle,
                                                fontSize: 13,
                                                marginRight: 5
                                            }}
                                            isArrow={false} isLine={false}/>
                            {this.renderLine()}
                            <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={"退回余额账户"}
                                            leftTextStyle={{
                                                color: DesignRule.textColor_mainTitle,
                                                fontSize: 13
                                            }}
                                            rightText={StringUtils.formatMoneyString(orderReturnAmounts.actualBalance)}
                                            rightTextStyle={{
                                                color: DesignRule.textColor_mainTitle,
                                                fontSize: 13,
                                                marginRight: 5
                                            }}
                                            isArrow={false} isLine={false}/>
                            {this.renderLine()}
                            <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={"1元现金券"}
                                            leftTextStyle={{
                                                color: DesignRule.textColor_mainTitle,
                                                fontSize: 13
                                            }}
                                            rightText={parseInt(orderReturnAmounts.actualTokenCoin) + "张"}
                                            rightTextStyle={{
                                                color: DesignRule.textColor_mainTitle,
                                                fontSize: 13,
                                                marginRight: 5
                                            }}
                                            isArrow={false} isLine={false}/>
                            {this.renderWideLine()}
                        </View>
                    ) : null
                }
            </View>
        );
    }

    renderLogistics = () => {
        /** 显示物流*/
        let pageType = this.params.pageType;
        let pageData = this.state.pageData;
        if (pageType === 0 ||
            EmptyUtils.isEmpty(pageData) ||
            pageData.status === 1 ||
            pageData.status === 3 ||
            pageData.status === 9 ||
            pageData.status === 7
        ) {
            //退款无物流
            //申请中、 申请拒绝、商家收到货后拒绝
            return;
        }
        return (
            <View>
                <TouchableOpacity style={{
                    height: 44,
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 15,
                    paddingRight: 15
                }} onPress={() => this.returnLogists()}>
                    <UIText value={["无物流", "退货物流", "换货物流"][pageType]}
                            style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
                    <View style={{
                        height: 44,
                        flexDirection: "row",
                        backgroundColor: "white",
                        alignItems: "center"
                    }}>
                        <UIText
                            value={EmptyUtils.isEmpty(pageData.expressNo) === false ? `${pageData.expressName}(${pageData.expressNo})` : "请填写寄回物流信息"}
                            style={{
                                color: EmptyUtils.isEmpty(pageData.expressNo) === false ? DesignRule.textColor_mainTitle : DesignRule.textColor_hint,
                                fontSize: 12,
                                marginRight: 15
                            }}/>
                        <UIImage source={right_arrow} style={{ height: 10, width: 7 }}/>
                    </View>
                </TouchableOpacity>
                {
                    pageData.ecExpressNo ?
                        <View>
                            {this.renderLine()}
                            <TouchableOpacity style={{
                                height: 44,
                                backgroundColor: "white",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingLeft: 15,
                                paddingRight: 15
                            }} onPress={() => this.shopLogists()}>
                                <UIText value={"商家物流"}
                                        style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
                                <View style={{
                                    height: 44,
                                    flexDirection: "row",
                                    backgroundColor: "white",
                                    alignItems: "center"
                                }}>
                                    <UIText value={`${pageData.ecExpressName}(${pageData.ecExpressNo})`}
                                            style={{
                                                color: DesignRule.textColor_mainTitle,
                                                fontSize: 12,
                                                marginRight: 15
                                            }}/>
                                    <UIImage source={right_arrow} style={{ height: 10, width: 7 }}/>
                                </View>
                            </TouchableOpacity>
                        </View> : null
                }
            </View>
        );
    };
    renderAddress = () => {
        let pageData = this.state.pageData;
        if (pageData === null || pageData === undefined) {
            return;
        }
        let status = pageData.status;
        let returnAddress = pageData.returnAddress || {};
        if (this.params.pageType === 0) {
            return;
        } else if (this.params.pageType === 1) {
            if (status === 1 || status === 3 || status === 7) {
                //退货 状态为申请中、申请已拒绝，不显示寄回地址
                return;
            }
        } else if (this.params.pageType === 2) {
            if (status === 1 || status === 3 || status === 7) {
                //退货 状态为申请中、申请已拒绝，不显示寄回地址
                return;
            }
        }
        return (
            <View>
                {
                    this.params.pageType === 2 ?
                        <View>
                            <AddressItem
                                name={"收货人：" + pageData.receiver}
                                phone={pageData.receivePhone}
                                address={pageData.receiveAddress}
                            />
                            < UIImage source={addressLine} style={{ width: ScreenUtils.width, height: 3 }}/>
                            {this.renderWideLine()}
                        </View> : null
                }
                <View style={{
                    flexDirection: "row",
                    height: 82,
                    alignItems: "center",
                    backgroundColor: "white"
                }}>
                    <View style={{
                        width: 43,
                        height: 36,
                        borderColor: DesignRule.mainColor,
                        borderWidth: 0.5,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 16
                    }}>
                        <UIText value={"寄回\n地址"} style={{ fontSize: 12, color: DesignRule.mainColor }}/>
                    </View>
                    <View style={{ backgroundColor: DesignRule.lineColor_inColorBg, width: 1, height: 40 }}/>
                    <AddressItem height={82}
                                 style={{
                                     flex: 1,
                                     flexDirection: "row",
                                     justifyContent: "space-between",
                                     alignItems: "center",
                                     backgroundColor: "white"
                                 }}
                                 name={"收货人：" + returnAddress.receiver}
                                 phone={returnAddress.recevicePhone}
                                 address={returnAddress.provinceName +
                                 returnAddress.cityName +
                                 returnAddress.areaName +
                                 returnAddress.address}
                        // name={'收货人：' + pageData.receiver}
                        // phone={pageData.recevicePhone || ''}
                        // address={pageData.receiveAddress || ''}
                    />
                </View>
                {this.renderWideLine()}
            </View>

        );
    };

    renderOrder = () => {
        return (
            <View
                style={{
                    backgroundColor: DesignRule.bgColor,
                    height: 40,
                    justifyContent: "center",
                    paddingLeft: 15
                }}>
                <UIText value={["退款订单", "退货订单", "换货订单"][this.params.pageType]}
                        style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
            </View>
        );
    };

    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData(callBack) {
        this.$loadingShow();
        OrderApi.returnProductLookDetail({ returnProductId: this.params.returnProductId }).then((response) => {
            this.$loadingDismiss();
            let pageData = response.data;
            if (callBack) {
                if (pageData.status === 1) {
                    callBack();
                    return;
                } else {
                    this.$toastShow("订单状态已修改");
                }
            }
            if (pageData.status === 3 && pageData.expressName && pageData.expressNo) {
                /** 将原来的拒绝状态（3），分成 3 -》 商家拒绝申请 和 9 -》 表示寄出商品后商家拒绝退款
                 * 状态为已拒绝，且有寄出物流的信息，新增加状态 9 -》 表示寄出商品后商家拒绝退款
                 */
                pageData.status = 9;
            }
            if (this.params.pageType === 2 && pageData.status === 4 && pageData.ecExpressNo && pageData.ecExpressName) {
                /**
                 * 在换货的详情，将原来的发货中状态（4）， 分成 3 -》用户发货，等待商家确认 和 10 =》表示商家发货，等待买家确认
                 */
                pageData.status = 10;
            }

            this.setState({ pageData: pageData });
            if (response.data.status === 2 && (this.params.pageType === 1 || this.params.pageType === 2)) {
                /**为退货，或换货的详情。状态为同意申请,开始定时器倒计，倒计用户给商家发货的剩余时间*/
                this.startTimer(pageData.outTime);
            } else {
                this.stopTimer();
            }
        }).catch(e => {
            this.stopTimer();
            this.$loadingDismiss();
        });
    }

    returnLogists = () => {
        if (EmptyUtils.isEmpty(this.state.pageData.expressNo)) {
            this.$navigate("order/afterSaleService/FillReturnLogisticsPage", {
                pageData: this.state.pageData,
                callBack: this.loadPageData
            });
        } else {
            this.$navigate("order/logistics/LogisticsDetailsPage", {
                orderId: this.state.pageData.orderNum,
                expressNo: this.state.pageData.expressNo
            });
        }
    };

    shopLogists() {
        if (EmptyUtils.isEmpty(this.state.pageData.expressNo)) {
            this.$toastShow("请填写完整的退货物流信息\n才可以查看商家的物流信息");
            return;
        }
        this.$navigate("order/logistics/LogisticsDetailsPage", {
            orderNum: this.state.pageData.orderNum,
            expressNo: this.state.pageData.ecExpressNo
        });
    }


    /**
     * 撤销、修改
     * @param cancel true -》撤销 、false -》修改申请
     */
    onPressOperationApply(cancel) {
        let that = this;
        // pageType 0 退款详情  1 退货详情   2 换货详情
        if (cancel) {
            let tips = ["确认撤销本次退款申请？", "确认撤销本次退货退款申请？", "确认撤销本次换货申请？"];
            Alert.alert("",
                tips[this.params.pageType],
                [
                    {
                        text: "取消",
                        style: "cancel"
                    },
                    {
                        text: "确认",
                        onPress: () => {
                            that.$loadingShow();
                            OrderApi.revokeApply({ returnProductId: this.state.pageData.id }).then(result => {
                                that.$loadingDismiss();
                                DeviceEventEmitter.emit("OrderNeedRefresh");
                                that.$navigateBack("order/order/MyOrdersDetailPage");
                            }).catch(error => {
                                that.$loadingDismiss();
                                that.$toastShow(error.msg || "操作失败，请重试");
                            });
                        }
                    }
                ]);
        } else {
            let { orderProductId, returnReason, remark, imgList, exchangePriceId, exchangeSpec, exchangeSpecImg, productId } = this.state.pageData;
            imgList = imgList || [];
            for (let i = 0; i < imgList.length; i++) {
                imgList[i].imageThumbUrl = imgList[i].smallImg;
                imgList[i].imageUrl = imgList[i].originalImg;
            }
            this.$navigate("order/afterSaleService/AfterSaleServicePage", {
                pageType: this.params.pageType,
                returnProductId: this.state.pageData.id,
                isEdit: true,
                callBack: this.loadPageData,
                orderProductId,
                returnReason,
                remark,
                imgList,
                exchangePriceId,
                exchangeSpec,
                exchangeSpecImg,
                productId
            });

        }
    }

    /**
     * 获取剩余时间的字符串
     * @param out_time 失效时间 number
     * return 如果当前时间大于 out_time 返回 null
     */
    getRemainingTime(out_time) {
        let timestamp = Date.parse(new Date()) / 1000;
        out_time = out_time;

        if (timestamp >= out_time) {
            return "已超时";
        }

        let remainingTime = out_time - timestamp;
        let s = remainingTime % 60;
        remainingTime = (remainingTime - s) / 60;
        let m = remainingTime % 60;
        remainingTime = (remainingTime - m) / 60;
        let H = remainingTime % 24;
        remainingTime = (remainingTime - H) / 24;
        let d = remainingTime;

        return "剩余" + d + "天" + H + "小时" + m + "分" + s + "秒";
    }

    startTimer(out_time) {
        this.stopTimer();
        if (out_time === null || out_time === undefined) {
            return;
        }
        /** 当前的时间已经超出，不开启定时器*/
        let timestamp = Date.parse(new Date()) / 1000;
        out_time = out_time / 1000;
        if (timestamp >= out_time) {
            return;
        }
        this.timer = setInterval(() => {
            let timeStr = this.getRemainingTime(out_time);
            this.setState({ timeStr: timeStr });
            if (timeStr === "已超时") {
                DeviceEventEmitter.emit("OrderNeedRefresh");
                this.stopTimer();
                this.loadPageData();
            } else {

            }
        }, 1000);
    }

    stopTimer() {
        this.timer && clearInterval(this.timer);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor,
        justifyContent: "flex-end"
    },
    addressStyle: {}
});

export default ExchangeGoodsDetailPage;
