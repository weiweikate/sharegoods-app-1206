import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import GoodsItem from '../components/confirmOrder/GoodsItem';
import { confirmOrderModel } from '../model/ConfirmOrderModel';
import { observer } from 'mobx-react/native';
import BasePage from '../../../BasePage';
import { NavigationActions } from 'react-navigation';
import DesignRule from '../../../constants/DesignRule';
import ConfirmAddressView from '../components/confirmOrder/ConfirmAddressView';
import ConfirmPriceView from '../components/confirmOrder/ConfirmPriceView';
import ConfirmBottomView from '../components/confirmOrder/ConfirmBottomView';
// import { renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import SelectOneTicketModel from '../components/confirmOrder/SelectOneTicketModel';
import SelectTicketModel from '../components/confirmOrder/SelectTicketModel';

@observer
export default class ConfirmOrderPage extends BasePage {
    constructor(props) {
        super(props);
        this.params.orderParamVO = {orderProducts: [{ skuCode: 'SKU000000890001', //string 平台skuCode
                                        quantity: 1, //int 购买数量
                activityCode: '', //string 活动code
                batchNo: 1}],source : 1}
        confirmOrderModel.orderParamVO = this.params.orderParamVO;
    }

    $navigationBarOptions = {
        title: '确认订单',
        show: true // false则隐藏导航
    };
    //**********************************ViewPart******************************************
    _renderContent = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: ScreenUtils.safeBottom }}>
                <ScrollView
                    ref={(e) => this.listView = e}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}>
                    <ConfirmAddressView selectAddress={() => this.selectAddress()}/>
                    {
                        confirmOrderModel.productOrderList.map((item, index) => {
                            return this._renderItem(item, index)
                        })
                    }
                    <ConfirmPriceView
                    jumpToCouponsPage={(params) => this.jumpToCouponsPage(params)}
                    inputFocus={() => {
                        this.listView.scrollToEnd();
                    }}/>
                </ScrollView>
                <ConfirmBottomView commitOrder={() => this.commitOrder()}/>
                <SelectOneTicketModel ref={(ref)=>{this.oneTicketModel = ref}}/>
                <SelectTicketModel ref={(ref)=>{this.ticketModel = ref}} />
            </View>
        );
    };

    _renderItem = (item, index) => {
        return (<GoodsItem
            key={index}
            uri={item.specImg}
            activityCodes={item.activityList || []}
            goodsName={item.productName}
            salePrice={StringUtils.formatMoneyString(item.unitPrice)}
            category={item.spec}
            goodsNum={'x' + item.quantity}
            onPress={() => {
            }}
        />);
    };

    componentWillUnmount() {
        confirmOrderModel.clearData();
        clearTimeout();
    }

    _render() {
        return (
            <View style={styles.container}>
                {this._renderContent()}
            </View>
        );
    }

    componentDidMount() {
        setTimeout(() => {
            this.loadPageData();
        }, 1000);
    }

    loadPageData = (params) => {
        // 获取订单数据
        confirmOrderModel.makeSureProduct();
    };

    // 地址重新选择
    selectAddress = () => {
        this.$navigate('mine/address/AddressManagerPage', {
            from: 'order',
            currentId: confirmOrderModel.addressId,
            callBack: (json) => {
                confirmOrderModel.selectAddressId(json.id)
            }
        });
    };

    // 提交订单
    commitOrder = () => {
        confirmOrderModel.submitProduct(
            (data) => {
                let replace = NavigationActions.replace({
                    key: this.props.navigation.state.key,
                    routeName: 'payment/PaymentPage',
                    params: {
                        orderNum: data.platformOrderNo,
                        amounts: data.payInfo.payAmount,
                        orderProductList: data.orderProductList,
                        platformOrderNo: data.platformOrderNo
                    },
                });
                this.props.navigation.dispatch(replace);
            }
        );
    };

    // 选择优惠券
    jumpToCouponsPage = (params) => {
        if (params === 'justOne') {//一元券
            let payAmount = parseInt(confirmOrderModel.payAmount); //要实付钱
            let tokenCoin =  parseInt(confirmOrderModel.tokenCoin);//一元优惠的券
            let orderAmount = payAmount + tokenCoin;
            if (orderAmount < 1){//订单总价格要大于1
                this.$toastShow('订单价格大于1元才可使用一元优惠');
                return;
            }
            //打开一券选择框
            this.oneTicketModel && this.oneTicketModel.open(orderAmount, (data) => {
                //选择完以后回调
                data = parseInt(data);
                if (data >= 0) {
                    let params = {
                        tokenCoin: data,
                        userCouponCode: confirmOrderModel.userCouponCode,
                        addressId: confirmOrderModel.addressId
                    };
                    confirmOrderModel.tokenCoin = data;
                    confirmOrderModel.tokenCoinText = data !== 0 ? '-¥' + data : '选择使用1元券';
                    setTimeout(() => {
                        this.loadPageData(params);
                    }, 0);
                }
            })
        } else {
            track(trackEvent.ViewCoupon,{couponModuleSource:3});
            this.ticketModel && this.ticketModel.open(confirmOrderModel.orderParamVO, (data) => {
                console.log('CouponsPage', data);
                confirmOrderModel.couponData=data;
                if (data && data.id) {
                    let params = {
                        userCouponCode: data.code,
                        tokenCoin: 0,
                        addressId: confirmOrderModel.addressId
                    };
                    confirmOrderModel.userCouponCode = data.code;
                    confirmOrderModel.couponName = data.name;
                    confirmOrderModel.tokenCoin = 0;
                    confirmOrderModel.tokenCoinText = '选择使用1元券';
                    setTimeout(() => {
                        this.loadPageData(params);
                    }, 0);
                } else if (data === 'giveUp') {
                    confirmOrderModel.giveUpCou= true;
                    confirmOrderModel.userCouponCode = null;
                    confirmOrderModel.couponName = null;
                    // confirmOrderModel.tokenCoin = 0;
                    // confirmOrderModel.tokenCoinText = '选择使用1元券';
                    setTimeout(() => {
                        this.loadPageData({
                            userCouponCode: null,
                            tokenCoin: confirmOrderModel.tokenCoin ,
                            addressId: confirmOrderModel.addressId
                        });
                    }, 0);
                }
            });
            return;
            // this.$navigate('mine/coupons/CouponsPage', {
            //     fromOrder: 1,
            //     orderParam: confirmOrderModel.orderParamVO, callBack:
            // });
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    }
});
