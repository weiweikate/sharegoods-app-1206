import React from 'react';
import {
    StyleSheet,
    View, FlatList
} from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import bridge from '../../../utils/bridge';
import GoodsItem from '../components/confirmOrder/GoodsItem';
import { confirmOrderModel } from '../model/ConfirmOrderModel';
import { observer } from 'mobx-react/native';
import BasePage from '../../../BasePage';
import { NavigationActions } from 'react-navigation';
import DesignRule from '../../../constants/DesignRule';
import ConfirmAddressView from '../components/confirmOrder/ConfirmAddressView';
import ConfirmPriceView from '../components/confirmOrder/ConfirmPriceView';
import ConfirmBottomView from '../components/confirmOrder/ConfirmBottomView';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';

@observer
export default class ConfirmOrderPage extends BasePage {
    constructor(props) {
        super(props);
        confirmOrderModel.clearData();
    }

    $navigationBarOptions = {
        title: '确认订单',
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
            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: ScreenUtils.safeBottom }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={confirmOrderModel.orderProductList}
                    ListHeaderComponent={<ConfirmAddressView selectAddress={() => this.selectAddress()}/>}
                    ListFooterComponent={<ConfirmPriceView
                        jumpToCouponsPage={(params) => this.jumpToCouponsPage(params)}/>}
                    onRefresh={this.loadPageData()}
                    refreshing={false}
                    renderItem={this._renderItem}
                />
                <ConfirmBottomView commitOrder={() => this.commitOrder()}/>
            </View>
        );
    };

    _renderItem = (item) => {
        alert(item.item.toString());
        return (<GoodsItem
            key={item.index}
            uri={item.item.specImg}
            goodsName={item.item.productName}
            salePrice={StringUtils.formatMoneyString(item.item.unitPrice)}
            category={item.item.specValues}
            goodsNum={'x' + item.item.quantity}
            onPress={() => {
            }}
        />);
    };

    componentWillUnmount() {
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
        setTimeout(() => {
            this.loadPageData();
        }, 100);
        // this.keyboardDidShowListener=Keyboard.addListener('keyboardWillChangeFrame', (event)=>this._keyboardDidShow(event));
        // this.keyboardDidHideListener=Keyboard.addListener('keyboardWillHide', (event)=>this._keyboardDidHide(event));
    }

    loadPageData = (params) => {
        bridge.hiddenLoading();
        // 获取订单数据
        confirmOrderModel.makeSureProduct(this.params.orderParamVO, params);
    };

    selectAddress = () => {
        // 地址重新选择
        this.$navigate('mine/address/AddressManagerPage', {
            from: 'order',
            currentId: confirmOrderModel.addressId,
            callBack: (json) => {
                console.log(json);

                let params = {
                    addressId: json.id,
                    tokenCoin: 0,
                    userCouponCode: confirmOrderModel.userCouponCode
                };
                confirmOrderModel.tokenCoinText = '选择使用1元券',
                    confirmOrderModel.tokenCoin = 0;
                confirmOrderModel.addressId = json.id;
                setTimeout(() => {
                    this.loadPageData(params);
                }, 100);
            }
        });
    };

    // 提交订单
    commitOrder = () => {
        if (!confirmOrderModel.canCommit) {
            bridge.hiddenLoading();
            return;
        }
        confirmOrderModel.canCommit = false;
        confirmOrderModel.submitProduct(this.params.orderParamVO);
    };

    //选择优惠券
    jumpToCouponsPage = (params) => {
        if (params === 'justOne') {
            this.$navigate('mine/coupons/CouponsPage', {
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
                            confirmOrderModel.tokenCoinText = parseInt(data) > 0 && (parseInt(confirmOrderModel.payAmount) + parseInt(confirmOrderModel.tokenCoin)) ? '-¥' + parseInt(data) : '选择使用1元券';
                        setTimeout(() => {
                            this.loadPageData(params);
                        }, 100);
                    }
                }
            });
        } else {
            this.$navigate('mine/coupons/CouponsPage', {
                fromOrder: 1,
                orderParam: confirmOrderModel.orderParamVO, callBack: (data) => {
                    console.log('CouponsPage', data);
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
                        }, 100);
                    } else if (data === 'giveUp') {
                        confirmOrderModel.userCouponCode = null;
                        confirmOrderModel.couponName = null;
                        confirmOrderModel.tokenCoin = 0;
                        confirmOrderModel.tokenCoinText = '选择使用1元券';
                        setTimeout(() => {
                            this.loadPageData({
                                userCouponCode: null,
                                tokenCoin: 0,
                                addressId: confirmOrderModel.addressId
                            });
                        }, 100);
                    }
                }
            });
        }
    };

    replaceRouteName(data) {
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            routeName: 'payment/PaymentMethodPage',
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
