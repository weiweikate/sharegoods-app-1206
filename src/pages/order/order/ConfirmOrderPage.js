import React from "react";
import {
    StyleSheet,
    View,
    ScrollView, Alert
} from "react-native";
import StringUtils from "../../../utils/StringUtils";
import ScreenUtils from "../../../utils/ScreenUtils";
import bridge from "../../../utils/bridge";
import GoodsItem from "../components/confirmOrder/GoodsItem";
import { confirmOrderModel } from "../model/ConfirmOrderModel";
import { observer } from "mobx-react/native";
import BasePage from "../../../BasePage";
import { NavigationActions } from "react-navigation";
import DesignRule from "../../../constants/DesignRule";
import ConfirmAddressView from "../components/confirmOrder/ConfirmAddressView";
import ConfirmPriceView from "../components/confirmOrder/ConfirmPriceView";
import ConfirmBottomView from "../components/confirmOrder/ConfirmBottomView";
import { PageLoadingState, renderViewByLoadingState } from "../../../components/pageDecorator/PageState";


@observer
export default class ConfirmOrderPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: []
        };
        this.canCommit = true;
    }

    $navigationBarOptions = {
        title: "确认订单",
        show: true // false则隐藏导航
    };
    $getPageStateOptions = () => {
        return {
            loadingState: confirmOrderModel.loadingState,
            netFailedProps: {
                netFailedInfo: confirmOrderModel.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    _reload = () => {
        confirmOrderModel.netFailedInfo = null;
        confirmOrderModel.loadingState = PageLoadingState.loading;
        this.loadPageData();
    };
    //**********************************ViewPart******************************************
    _renderContent = () => {
        return (
            <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: ScreenUtils.safeBottom }}>
                <ScrollView>
                    <ConfirmAddressView selectAddress={() => this.selectAddress()}/>
                    {this.state.viewData.map((item, index) => {
                        return <GoodsItem
                            uri={item.specImg}
                            goodsName={item.productName}
                            salePrice={StringUtils.formatMoneyString(item.unitPrice)}
                            category={item.specValues}
                            goodsNum={"x" + item.quantity}
                            onPress={()=>{}}
                        />;
                    })}
                    <ConfirmPriceView jumpToCouponsPage={(params) => this.jumpToCouponsPage(params)}/>
                </ScrollView>
                <ConfirmBottomView commitOrder={() => this.commitOrder()}/>
            </View>
        );

    };
    componentWillUnmount(){
        confirmOrderModel.clearData();
    }

    _render() {
        return (
            <View style={styles.container}>
                {renderViewByLoadingState(this.$getPageStateOptions(), this._renderContent)}
            </View>

        );
    }

    componentDidMount() {
        this.loadPageData();
    }

    async loadPageData(params) {
        bridge.showLoading();
        try {
            let data = await  confirmOrderModel.makeSureProduct(this.params.orderParamVO, params);
            this.setState({ viewData: data.orderProductList });
        } catch (err) {
               if(confirmOrderModel.isError){
               this.setState({viewData: []})
            }
            if (err.code === 10009) {
                this.$navigate("login/login/LoginPage", {
                    callback: () => {
                        this.loadPageData();
                    }
                });
            } else if (err.code === 10003 && err.msg.indexOf("不在限制的购买时间") !== -1) {
                Alert.alert("提示", err.msg, [
                    {
                        text: "确定", onPress: () => {
                            this.$navigateBack();
                        }
                    }
                    // { text: '否' }
                ]);
            } else if (err.code === 54001) {
                bridge.$toast("商品库存不足！");
                this.$navigateBack();
            }
            else {
                this.$toastShow(err.msg);
            }
        }


    }

    selectAddress = () => {//地址重新选择
        if(confirmOrderModel.isError){
            return;
        }
        this.$navigate("mine/address/AddressManagerPage", {
            from: "order",
            callBack: (json) => {
                console.log(json);

                let params = {
                    addressId: json.id,
                    tokenCoin: 0,
                    userCouponCode: this.state.userCouponCode
                };
                confirmOrderModel.tokenCoinText="选择使用1元券",
                    confirmOrderModel.tokenCoin=0
                confirmOrderModel.addressId = json.id;
                this.loadPageData(params);
            }
        });
    };
    commitOrder = async () => {
        if(!this.canCommit||confirmOrderModel.isError){
            return;
        }
        this.canCommit=false;
        bridge.showLoading();
        try {
            let data = await confirmOrderModel.submitProduct(this.params.orderParamVO);
            this.canCommit=true;
            this.replaceRouteName(data);
        } catch (err) {
            this.canCommit=true
            if (err.code === 10009) {
                this.$navigate("login/login/LoginPage", {
                    callback: () => {
                        this.loadPageData;
                    }
                });
            } else if (err.code === 10003 && err.msg.indexOf("不在限制的购买时间") !== -1) {
                Alert.alert("提示", err.msg, [
                    {
                        text: "确定", onPress: () => {
                            this.$navigateBack();
                        }
                    }
                    // { text: '否' }
                ]);
            } else if (err.code === 54001) {
                bridge.$toast("商品库存不足！");
                this.$navigateBack();
            }
            else {
                this.$toastShow(err.msg);
            }
        }

    };
    //选择优惠券
    jumpToCouponsPage = (params) => {
        if(confirmOrderModel.isError){
            return;
        }
        if (params === "justOne") {
            this.$navigate("mine/coupons/CouponsPage", {
                justOne: (parseInt(confirmOrderModel.payAmount) + parseInt(confirmOrderModel.tokenCoin)) ? (parseInt(confirmOrderModel.payAmount) + parseInt(confirmOrderModel.tokenCoin)) : 1,
                callBack: (data) => {
                    console.log(typeof data);
                    if (parseInt(data) >= 0) {
                        let params = {
                            tokenCoin: parseInt(data) > 0 && parseInt(data) <= (parseInt(confirmOrderModel.payAmount) + parseInt(confirmOrderModel.tokenCoin)) ? parseInt(data) : 0,
                            userCouponCode: confirmOrderModel.userCouponCode,
                            addressId: confirmOrderModel.addressId
                        };
                        confirmOrderModel.tokenCoin = parseInt(data) > 0 && parseInt(data) <= (parseInt(confirmOrderModel.payAmount) + parseInt(confirmOrderModel.tokenCoin)) ? parseInt(data) : 0,
                            confirmOrderModel.tokenCoinText = parseInt(data) > 0 && (parseInt(confirmOrderModel.payAmount) + parseInt(confirmOrderModel.tokenCoin)) ? "-¥" + parseInt(data) : "选择使用1元券";
                        this.loadPageData(params);
                    }
                }
            });
        } else {
            this.$navigate("mine/coupons/CouponsPage", {
                fromOrder: 1,
                orderParam: confirmOrderModel.orderParamVO, callBack: (data) => {
                    console.log("CouponsPage", data);
                    if (data && data.id) {
                        let params = { userCouponCode: data.code, tokenCoin: 0,addressId: confirmOrderModel.addressId};
                        confirmOrderModel.userCouponCode = data.code,
                            confirmOrderModel.couponName = data.name,
                            confirmOrderModel.tokenCoin = 0,
                            confirmOrderModel.tokenCoinText = "选择使用1元券",
                            this.loadPageData(params);
                    } else if (data === "giveUp") {
                        confirmOrderModel.userCouponCode = null,
                            confirmOrderModel.couponName = null,
                            confirmOrderModel.tokenCoin = 0,
                            confirmOrderModel.tokenCoinText = "选择使用1元券",
                        this.loadPageData({userCouponCode: null, tokenCoin: 0,addressId: confirmOrderModel.addressId});
                    }
                }
            });
        }
    };

    replaceRouteName(data) {
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            routeName: "payment/PaymentMethodPage",
            params: {
                orderNum: data.orderNo,
                amounts: data.payAmount,
                pageType: 0
            }
        });
        this.props.navigation.dispatch(replace);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    }
});
