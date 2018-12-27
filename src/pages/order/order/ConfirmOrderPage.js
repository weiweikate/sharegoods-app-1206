import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity, ScrollView, Alert
} from 'react-native';
import {
    UIText, UIImage, RefreshList, MRText as Text, MRTextInput as RNTextInput, NoMoreClick
} from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import bridge from '../../../utils/bridge';
import GoodsItem from '../components/GoodsItem';
import user from '../../../model/user';
// import Toast from '../../../utils/bridge';
import BasePage from '../../../BasePage';
import OrderApi from './../api/orderApi';
import MineApi from '../../mine/api/MineApi';
import API from '../../../api';
import { NavigationActions } from 'react-navigation';
import DesignRule from 'DesignRule';
import userOrderNum from '../../../model/userOrderNum';
import res from '../res';
import { track, trackEvent } from '../../../utils/SensorsTrack';

const position = res.dizhi;
const arrow_right = res.arrow_right;
const colorLine = res.addressLine;
const couponIcon = res.coupons_icon;
export default class ConfirmOrderPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            defaultAddress: false,
            viewData: {
                express: {}
            },
            tokenCoin: 0,
            addressId: null,
            userCouponCode: null,
            tokenCoinText: null,
            couponName: null,
            orderParam: this.params.orderParamVO ? this.params.orderParamVO : [],
            canUseCou: false
        };
        this.canCommit = true;
    }

    $navigationBarOptions = {
        title: '确认订单',
        show: true // false则隐藏导航
    };

    //**********************************ViewPart******************************************
    renderAddress = () => {
        return (StringUtils.isNoEmpty(this.state.addressId) ?
                <NoMoreClick
                    style={styles.addressSelectStyle}
                    onPress={() => this.selectAddress()}>
                    <UIImage source={position} style={{
                        height: ScreenUtils.autoSizeHeight(20),
                        width: ScreenUtils.autoSizeWidth(20),
                        marginLeft: ScreenUtils.autoSizeWidth(20)
                    }} resizeMode={'contain'}/>
                    <View style={{
                        flex: 1,
                        marginLeft: ScreenUtils.autoSizeWidth(15),
                        marginRight: ScreenUtils.autoSizeWidth(15)
                    }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={[styles.commonTextStyle, { flex: 1 }]}
                                  allowFontScaling={false}>收货人：{this.state.viewData.express.receiverName}</Text>
                            <Text style={styles.commonTextStyle}
                                  allowFontScaling={false}>{this.state.viewData.express.receiverNum}</Text>
                        </View>
                        <UIText
                            value={
                                '收货地址：' + this.state.viewData.express.provinceString
                                + this.state.viewData.express.cityString
                                + this.state.viewData.express.areaString
                                + this.state.viewData.express.receiverAddress
                            }
                            style={styles.receiverAddressStyle}/>
                    </View>
                    <Image source={arrow_right} style={styles.arrowRightStyle} resizeMode={'contain'}/>
                </NoMoreClick> :
                <NoMoreClick
                    style={{
                        height: ScreenUtils.autoSizeWidth(87),
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    onPress={() => this.selectAddress()}>
                    <UIImage source={position} style={{
                        height: ScreenUtils.autoSizeWidth(20),
                        width: ScreenUtils.autoSizeWidth(20),
                        marginLeft: ScreenUtils.autoSizeWidth(20)
                    }} resizeMode={'contain'}/>
                    <View style={{
                        flex: 1,
                        marginLeft: ScreenUtils.autoSizeWidth(15),
                        marginRight: ScreenUtils.autoSizeWidth(20)
                    }}>
                        <UIText value={'请添加一个收货人地址'} style={styles.hintStyle}/>
                    </View>
                    <Image source={arrow_right} style={styles.arrowRightStyle} resizeMode={'contain'}/>
                </NoMoreClick>
        );
    };
    renderSelectImage = () => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={{ marginBottom: ScreenUtils.autoSizeWidth(10) }}>
                    <Image source={colorLine} style={{ height: 3, width: ScreenUtils.width }}/>
                </View>
                {this.state.orderParam && this.state.orderParam.orderType === 3 ?
                    <View style={styles.giftOutStyle}>
                        <View style={styles.giftInnerStyle}>
                            <Text style={styles.giftTextStyles} allowFontScaling={false}>礼包</Text>
                        </View>
                    </View>
                    :
                    null}
            </View>
        );
    };
    renderDetail = () => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <NoMoreClick style={styles.couponsStyle}
                             disabled={!this.state.canUseCou}
                             onPress={() => this.jumpToCouponsPage()}>
                    <UIText value={'优惠券'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={!this.state.canUseCou ? '不支持使用优惠券' : (this.state.couponName ? this.state.couponName : '选择优惠券')}
                            style={[styles.grayText, { marginRight: ScreenUtils.autoSizeWidth(15) }]}/>
                        <Image source={arrow_right}/>
                    </View>
                </NoMoreClick>
                {this.renderLine()}
                {!user.tokenCoin ? null :
                    <View>
                        <NoMoreClick style={styles.couponsStyle}
                                     onPress={() => this.jumpToCouponsPage('justOne')}>
                            <UIText value={'1元现金券'} style={styles.blackText}/>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <UIText
                                    value={this.state.tokenCoin ? this.state.tokenCoinText : '选择1元现金券'}
                                    style={[styles.grayText, { marginRight: ScreenUtils.autoSizeWidth(15) }]}/>
                                <Image source={arrow_right}/>
                            </View>
                        </NoMoreClick>
                        {this.renderLine()}
                    </View>
                }
                <NoMoreClick style={styles.couponsStyle}>
                    <UIText value={'运费'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText value={`¥${this.state.viewData.totalFreightFee}`}
                                style={[styles.grayText]}/>
                    </View>
                </NoMoreClick>
                {this.renderLine()}
                <NoMoreClick style={styles.couponsStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText value={'买家留言'} style={styles.blackText}/>
                        <RNTextInput
                            style={styles.inputTextStyle}
                            onChangeText={text => this.setState({ message: text })}
                            placeholder={'选填：填写内容已与卖家协商确认'}
                            placeholderTextColor={DesignRule.textColor_instruction}
                            numberOfLines={1}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                </NoMoreClick>
                {this.renderLine()}
            </View>
        );
    };
    renderHeader = () => {
        return (
            <View>
                {this.renderAddress()}
                {this.renderSelectImage()}
            </View>
        );
    };
    renderFootder = () => {
        return (
            <View>
                {this.renderCouponsPackage()}
                {this.renderDetail()}
            </View>
        );
    };
    renderCouponsPackage = () => {
        return (
            <View style={{ borderTopColor: DesignRule.lineColor_inWhiteBg, borderTopWidth: 0.5 }}>
                {this.state.viewData.couponList ?
                    this.state.viewData.couponList.map((item, index) => {
                        return <View style={{ backgroundColor: 'white' }} key={index}>
                            {index === 0 ? <Image source={couponIcon} style={styles.couponIconStyle}/> : null}
                            <View style={styles.couponsOutStyle}>
                                <Text style={styles.couponsTextStyle}>{item.couponName}</Text>
                                <Text style={styles.couponsNumStyle}>x1</Text>
                            </View>
                            <View style={styles.couponsLineStyle}/>
                        </View>;
                    })
                    :
                    null}
            </View>
        );
    };
    renderCommitOrder = () => {
        return (
            <View>
                {this.renderLine()}
                <View style={styles.commitOutStyle}>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                        <UIText value={'应付款：'} style={{
                            fontSize: ScreenUtils.px2dp(15),
                            color: DesignRule.textColor_mainTitle
                        }}/>
                        <UIText
                            value={StringUtils.formatMoneyString(this.state.viewData.totalAmounts)}
                            style={styles.commitAmountStyle}/>
                    </View>
                    <NoMoreClick
                        style={styles.commitTouStyle}
                        disabled={!this.canCommit}
                        onPress={() => this.commitOrder()}>
                        <UIText value={'提交订单'}
                                style={{
                                    fontSize: ScreenUtils.px2dp(16),
                                    color: 'white',
                                    paddingLeft: 15,
                                    paddingRight: 15
                                }}/>
                    </NoMoreClick>
                </View>
                {this.renderLine()}
            </View>
        );
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <RefreshList
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFootder}
                        data={this.state.viewData.list}
                        renderItem={this.renderItem}
                        extraData={this.state}
                    />
                </ScrollView>
                {this.renderCommitOrder()}
            </View>

        );
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity>
                <GoodsItem
                    uri={item.uri}
                    goodsName={item.goodsName}
                    salePrice={StringUtils.formatMoneyString(item.salePrice)}
                    category={item.category}
                    goodsNum={'X' + item.goodsNum}
                    onPress={() => {
                    }}
                />
            </TouchableOpacity>
        );
        // }

    };
    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };

    componentDidMount() {
        this.loadPageData();
        let arr = [];
        let params = {};
        console.log('loadmore', this.state.orderParam);
        if (this.params.orderParamVO.orderType == 99) {
            this.state.orderParam.orderProducts.map((item, index) => {
                arr.push({
                    priceCode: item.skuCode,
                    productCode: item.productCode,
                    amount: item.quantity || item.num
                });
            });
            params = { productPriceIds: arr };
            API.listAvailable({ page: 1, pageSize: 20, ...params }).then(resp => {
                let data = resp.data || {};
                let dataList = data.data || [];
                if (dataList.length === 0) {
                    this.setState({ couponName: '暂无优惠券' });
                }
            }).catch(result => {
                console.log(result);
            });
        }
        // else{
        //     this.state.orderParam.orderProducts.map((item, index) => {
        //         arr.push({
        //             priceCode: item.skuCode,
        //             productCode: item.productCode,
        //             amount: 1
        //         });
        //
        //     });
        //     params={productPriceIds: arr,activityCode: this.state.orderParam.activityCode, activityType: this.state.orderParam.orderType}
        // }
    }

    loadPageData(params) {
        bridge.showLoading();
        switch (this.state.orderParam.orderType) {
            case 1://秒杀
                OrderApi.SeckillMakeSureOrder({
                    activityCode: this.params.orderParamVO.orderProducts[0].code,
                    channel: 2,
                    num: this.params.orderParamVO.orderProducts[0].num,
                    source: 2,
                    submitType: 1,
                    ...params
                }).then(response => {
                    bridge.hiddenLoading();
                    this.handleNetData(response.data);
                }).catch(err => {
                    bridge.hiddenLoading();
                    bridge.$toast(err.msg);
                    if (err.code === 10009) {
                        this.gotoLoginPage({
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
                break;
            case 2://降价拍
                OrderApi.DepreciateMakeSureOrder({
                    activityCode: this.params.orderParamVO.orderProducts[0].code,
                    channel: 2,
                    num: this.params.orderParamVO.orderProducts[0].num,
                    source: 2,
                    submitType: 1,
                    ...params
                }).then(response => {
                    bridge.hiddenLoading();
                    this.handleNetData(response.data);
                }).catch(err => {
                    bridge.hiddenLoading();
                    bridge.$toast(err.msg);
                    if (err.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
                break;
            case 99://普通商品
                OrderApi.makeSureOrder({
                    orderType: 1,//1.普通订单 2.活动订单  -- 下单必传
                    //orderSubType:  1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source: this.params.orderParamVO.source,//1.购物车 2.直接下单
                    channel: 2,//1.小程序 2.APP 3.H5
                    orderProductList: this.params.orderParamVO.orderProducts,
                    ...params
                }).then(response => {
                    bridge.hiddenLoading();
                    this.handleNetData(response.data);
                }).catch(err => {
                    console.log('err', err);
                    bridge.hiddenLoading();
                    if (err.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    } else if (err.code === 10003 && err.msg.indexOf('不在限制的购买时间') !== -1) {
                        Alert.alert('提示', err.msg, [
                            {
                                text: '确定', onPress: () => {
                                    this.$navigateBack();
                                }
                            }
                            // { text: '否' }
                        ]);
                    } else if (err.code === 54001) {
                        bridge.$toast('商品库存不足！');
                        // shopCartCacheTool.getShopCartGoodsListData();
                        this.$navigateBack();
                    }
                    else {
                        this.$toastShow(err.msg);
                    }
                });
                break;
            case 3://礼包
                OrderApi.PackageMakeSureOrder({
                    activityCode: this.params.orderParamVO.activityCode,
                    orderType: 2,//1.普通订单 2.活动订单  -- 下单必传
                    orderSubType: this.params.orderParamVO.orderSubType,//,1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                    source: 2,//1.购物车 2.直接下单
                    channel: 2,//1.小程序 2.APP 3.H5
                    orderProductList: this.params.orderParamVO.orderProducts,
                    submitType: 1,
                    quantity: 1,
                    ...params
                }).then(
                    response => {
                        bridge.hiddenLoading();
                        this.handleNetData(response.data);
                    }
                ).catch(err => {
                    console.log(err);
                    this.$toastShow(err.msg);
                    bridge.hiddenLoading();
                    // bridge.toast(err.msg);
                    if (err.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
                break;
        }


    }

    handleNetData = (data) => {
        let arrData = [];
        let viewData = this.state.viewData;
        data.orderProductList.map((item, index) => {
            arrData.push({
                uri: item.specImg,
                goodsName: item.productName,
                salePrice: item.unitPrice,
                category: item.specValues.replace(/@/g, '—'),
                goodsNum: item.quantity,
                restrictions: item.restrictions
                // activityId: item.activityId
            });
        });
        let addressData = data.userAddressDTO || data.userAddress || {};
        if (addressData.address) {
            viewData.express = {
                id: addressData.id,
                receiverName: addressData.receiver,
                receiverNum: addressData.receiverPhone,
                receiverAddress: addressData.address,
                areaCode: addressData.areaCode,
                cityCode: addressData.cityCode,
                provinceCode: addressData.provinceCode,
                provinceString: addressData.province,
                cityString: addressData.city,
                areaString: addressData.area
            };
        } else {
            // viewData.express = {};
        }
        viewData.totalAmounts = data.payAmount;
        viewData.totalFreightFee = data.totalFreightFee ? data.totalFreightFee : 0;
        viewData.list = arrData;
        viewData.couponList = data.couponList ? data.couponList : null;
        arrData.map((item) => {
            if (item.restrictions & 1 === 1) {
                this.setState({ canUseCou: true });
            }
        });
        this.setState({ viewData, addressId: addressData.id });
    };

    clickItem = (index, item) => {
        if (item.productType === 99) {
            this.$navigate('home/product/ProductDetailPage', {
                productId: item.productId
            });
        } else if (this.state.orderParam.orderType === 1 || this.state.orderParam.orderType === 2) {
            this.$navigate('topic/TopicDetailPage', {
                activityCode: this.state.orderParam.orderProducts[0].code,
                activityType: this.state.orderParam.orderType
            });
        } else if (this.state.orderParam.orderType === 3) {
            this.$navigate('topic/TopicDetailPage', {
                activityCode: this.state.orderParam.packageCode,
                activityType: this.state.orderParam.orderType
            });
        }

    };
    selectAddress = () => {//地址重新选择
        this.$navigate('mine/address/AddressManagerPage', {
            from: 'order',
            callBack: (json) => {
                console.log(json);
                this.setState({ addressId: json.id, defaultAddress: true });
                let params = {
                    addressId: json.id,
                    tokenCoin: 0,
                    tokenCoinText: '选择使用1元券',
                    userCouponCode: this.state.userCouponCode
                };
                this.loadPageData(params);
            }
        });
    };
    commitOrder = () => {
        if (StringUtils.isEmpty(this.state.addressId)) {
            bridge.$toast('请先添加地址');
            return;
        }
        if (!this.canCommit) {
            return;
        }
        this.canCommit = false;
        this.$loadingShow();
        let baseParams = {
            message: this.state.message,
            tokenCoin: this.state.tokenCoin,
            userCouponCode: this.state.userCouponCode,
            addressId: this.state.addressId
        };
        if (this.state.orderParam && this.state.orderParam.orderType === 1 || this.state.orderParam.orderType === 2) {
            let params = {
                ...baseParams,
                activityCode: this.params.orderParamVO.orderProducts[0].code,
                channel: 2,
                num: this.params.orderParamVO.orderProducts[0].num,
                source: 2,
                submitType: 2
            };
            if (this.state.orderParam && this.state.orderParam.orderType === 1) {//如果是秒杀的下单
                OrderApi.SeckillSubmitOrder(params).then((response) => {
                    this.$loadingDismiss();
                    this.canCommit = true;
                    let data = response.data;
                    track(trackEvent.submitOrder, {
                        orderId: data.orderNo,
                        orderAmount: data.payAmount,
                        transportationCosts: data.totalFreightFee,
                        receiverName: data.userAddress.receiver,
                        receiverProvince: data.userAddress.province,
                        receiverCity: data.userAddress.city,
                        receiverArea: data.userAddress.area,
                        receiverAddress: data.userAddress.address,
                        discountName: this.state.tokenCoinText,
                        discountAmount: 1,
                        ifUseYiYuan: !!this.state.tokenCoin,
                        numberOfYiYuan: this.state.tokenCoin,
                        yiYuanDiscountAmount: this.state.tokenCoin
                    });
                    MineApi.getUser().then(res => {
                        this.$loadingDismiss();
                        let data = res.data;
                        userOrderNum.getUserOrderNum();
                        user.saveUserInfo(data);
                    }).catch(err => {
                    });
                    this.replaceRouteName(data);

                }).catch(e => {
                    this.$loadingDismiss();
                    console.log(e);
                    this.canCommit = true;
                    this.$toastShow(e.msg);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
            } else if (this.state.orderParam && this.state.orderParam.orderType === 2) {
                OrderApi.DepreciateSubmitOrder(params).then((response) => {
                    this.$loadingDismiss();
                    this.canCommit = true;
                    let data = response.data;
                    track(trackEvent.submitOrder, {
                        orderId: data.orderNo,
                        orderAmount: data.payAmount,
                        transportationCosts: data.totalFreightFee,
                        receiverName: data.userAddress.receiver,
                        receiverProvince: data.userAddress.province,
                        receiverCity: data.userAddress.city,
                        receiverArea: data.userAddress.area,
                        receiverAddress: data.userAddress.address,
                        discountName: this.state.tokenCoinText,
                        discountAmount: 1,
                        ifUseYiYuan: !!this.state.tokenCoin,
                        numberOfYiYuan: this.state.tokenCoin,
                        yiYuanDiscountAmount: this.state.tokenCoin
                    });
                    MineApi.getUser().then(res => {
                        this.$loadingDismiss();
                        let data = res.data;
                        userOrderNum.getUserOrderNum();
                        user.saveUserInfo(data);
                    }).catch(err => {
                    });
                    this.replaceRouteName(data);
                }).catch(e => {
                    this.$loadingDismiss();
                    console.log(e);
                    this.canCommit = true;
                    this.$toastShow(e.msg);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
            }
        }
        else if (this.state.orderParam && this.state.orderParam.orderType === 3) {
            let params1 = {
                ...baseParams,
                activityCode: this.params.orderParamVO.activityCode,
                orderType: 2,//1.普通订单 2.活动订单  -- 下单必传
                orderSubType: this.params.orderParamVO.orderSubType,//,1.秒杀 2.降价拍 3.升级礼包 4.普通礼包
                source: 2,//1.购物车 2.直接下单
                channel: 2,//1.小程序 2.APP 3.H5
                orderProductList: this.params.orderParamVO.orderProducts,
                submitType: 2,
                quantity: 1
            };
            OrderApi.PackageSubmitOrder(params1).then((response) => {
                this.$loadingDismiss();
                let data = response.data;
                this.canCommit = true;
                MineApi.getUser().then(res => {
                    this.$loadingDismiss();
                    let data = res.data;
                    track(trackEvent.submitOrder, {
                        orderId: data.orderNo,
                        orderAmount: data.payAmount,
                        transportationCosts: data.totalFreightFee,
                        receiverName: data.userAddress.receiver,
                        receiverProvince: data.userAddress.province,
                        receiverCity: data.userAddress.city,
                        receiverArea: data.userAddress.area,
                        receiverAddress: data.userAddress.address,
                        discountName: this.state.tokenCoinText,
                        discountAmount: 1,
                        ifUseYiYuan: !!this.state.tokenCoin,
                        numberOfYiYuan: this.state.tokenCoin,
                        yiYuanDiscountAmount: this.state.tokenCoin
                    });
                    user.saveUserInfo(data);
                    userOrderNum.getUserOrderNum();
                }).catch(err => {
                });
                this.replaceRouteName(data);
            }).catch(e => {
                this.$loadingDismiss();
                console.log(e);
                this.canCommit = true;
                this.$toastShow(e.msg);
                if (e.code === 10009) {
                    this.$navigate('login/login/LoginPage', {
                        callback: () => {
                            this.loadPageData();
                        }
                    });
                }
            });

        }
        else {
            let params = {
                ...baseParams,
                orderProductList: this.state.orderParam.orderProducts,
                // orderType: this.state.orderParam.orderType,
                orderType: 1,
                source: this.state.orderParam.source,
                channel: 2
            };
            OrderApi.submitOrder(params).then((response) => {
                this.$loadingDismiss();
                let data = response.data;
                this.canCommit = true;
                track(trackEvent.submitOrder, {
                    orderId: data.orderNo,
                    orderAmount: data.payAmount,
                    transportationCosts: data.totalFreightFee,
                    receiverName: data.userAddressDTO.receiver,
                    receiverProvince: data.userAddressDTO.province,
                    receiverCity: data.userAddressDTO.city,
                    receiverArea: data.userAddressDTO.area,
                    receiverAddress: data.userAddressDTO.address,
                    discountName: this.state.tokenCoinText,
                    discountAmount: 1,
                    ifUseYiYuan: !!this.state.tokenCoin,
                    numberOfYiYuan: this.state.tokenCoin,
                    yiYuanDiscountAmount: this.state.tokenCoin
                });
                MineApi.getUser().then(res => {
                    this.$loadingDismiss();
                    let data = res.data;
                    userOrderNum.getUserOrderNum();
                    user.saveUserInfo(data);
                }).catch(err => {
                });

                this.replaceRouteName(data);

            }).catch(e => {
                this.$loadingDismiss();
                this.canCommit = true;
                this.$toastShow(e.msg);
                if (e.code === 54001) {
                    this.$toastShow('商品库存不足！');
                    // shopCartCacheTool.getShopCartGoodsListData();
                    this.$navigateBack();
                }
            });

        }
    };
    //选择优惠券
    jumpToCouponsPage = (params) => {
        if (params === 'justOne') {
            this.$navigate('mine/coupons/CouponsPage', {
                justOne: (parseInt(this.state.viewData.totalAmounts) + parseInt(this.state.tokenCoin)) ? (parseInt(this.state.viewData.totalAmounts) + parseInt(this.state.tokenCoin)) : 1,
                callBack: (data) => {
                    console.log(typeof data);
                    if (parseInt(data) >= 0) {
                        let params = {
                            tokenCoin: parseInt(data) > 0 && parseInt(data) <= (parseInt(this.state.viewData.totalAmounts) + parseInt(this.state.tokenCoin)) ? parseInt(data) : 0,
                            userCouponCode: this.state.userCouponCode,
                            addressId: this.state.addressId
                        };
                        this.setState({
                            addressId: this.state.addressId,
                            tokenCoin: parseInt(data) > 0 && parseInt(data) <= (parseInt(this.state.viewData.totalAmounts) + parseInt(this.state.tokenCoin)) ? parseInt(data) : 0,
                            tokenCoinText: parseInt(data) > 0 && (parseInt(this.state.viewData.totalAmounts) + parseInt(this.state.tokenCoin)) ? '-¥' + parseInt(data) : '选择使用1元券'
                        });
                        this.loadPageData(params);
                    }
                }
            });
        } else {
            this.$navigate('mine/coupons/CouponsPage', {
                fromOrder: 1,
                orderParam: this.state.orderParam, callBack: (data) => {
                    console.log('CouponsPage', data);
                    if (data && data.id) {
                        let params = { userCouponCode: data.code, tokenCoin: 0 };
                        this.setState({
                            userCouponCode: data.code,
                            couponName: data.name,
                            tokenCoin: 0,
                            tokenCoinText: '选择使用1元券',
                            addressId: this.state.addressId
                        });
                        this.loadPageData(params);
                    } else if (data === 'giveUp') {
                        this.setState({ userCouponCode: null, couponName: null, addressId: this.state.addressId });
                        this.loadPageData();
                    }
                }
            });
        }
    };

    replaceRouteName(data) {
        // this.$navigate('payment/PaymentMethodPage',
        //     {
        //         orderNum: data.orderNo,
        //         amounts: data.payAmount,
        //         pageType: 0,
        //        }
        // )
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
        flex: 1, backgroundColor: DesignRule.bgColor, justifyContent: 'flex-end', marginBottom: ScreenUtils.safeBottom
    }, selectText: {
        fontSize: ScreenUtils.px2dp(16), color: 'white'
    }, blackText: {
        fontSize: ScreenUtils.px2dp(13),
        lineHeight: ScreenUtils.autoSizeWidth(18),
        color: DesignRule.textColor_mainTitle
    }, grayText: {
        fontSize: ScreenUtils.px2dp(13),
        lineHeight: ScreenUtils.autoSizeWidth(18),
        color: DesignRule.textColor_instruction
    }, inputTextStyle: {
        marginLeft: ScreenUtils.autoSizeWidth(20),
        height: ScreenUtils.autoSizeWidth(40),
        flex: 1,
        backgroundColor: 'white',
        fontSize: ScreenUtils.px2dp(14)
    }, selectView: {
        flex: 1,
        borderRadius: 3,
        backgroundColor: DesignRule.textColor_secondTitle,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: DesignRule.textColor_secondTitle,
        justifyContent: 'center',
        alignItems: 'center'
    }, unSelectView: {
        flex: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: DesignRule.textColor_secondTitle,
        justifyContent: 'center',
        alignItems: 'center'
    }, couponsStyle: {
        height: ScreenUtils.autoSizeWidth(44),
        flexDirection: 'row',
        paddingLeft: ScreenUtils.autoSizeWidth(15),
        paddingRight: ScreenUtils.autoSizeWidth(15),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addressSelectStyle: {
        minHeight: ScreenUtils.autoSizeWidth(80),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: ScreenUtils.autoSizeWidth(10),
        paddingBottom: ScreenUtils.autoSizeWidth(10)
    },
    commonTextStyle: {
        fontSize: ScreenUtils.px2dp(15),
        color: DesignRule.textColor_mainTitle
    },
    receiverAddressStyle: {
        fontSize: ScreenUtils.px2dp(13),
        color: DesignRule.textColor_mainTitle,
        marginTop: ScreenUtils.autoSizeWidth(5)
    },
    hintStyle: {
        fontSize: ScreenUtils.px2dp(13),
        color: DesignRule.textColor_hint,
        marginLeft: ScreenUtils.autoSizeWidth(15)
    },
    arrowRightStyle: {
        width: ScreenUtils.autoSizeWidth(10),
        height: ScreenUtils.autoSizeWidth(14),
        marginRight: ScreenUtils.autoSizeWidth(15)
    },
    giftOutStyle: {
        marginTop: ScreenUtils.autoSizeWidth(20),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    giftInnerStyle: {
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: DesignRule.mainColor,
        marginLeft: ScreenUtils.autoSizeWidth(20)
    },
    giftTextStyles: {
        fontSize: ScreenUtils.px2dp(11),
        color: DesignRule.mainColor,
        padding: ScreenUtils.autoSizeWidth(3)
    },
    couponIconStyle: {
        width: ScreenUtils.autoSizeWidth(15),
        height: ScreenUtils.autoSizeWidth(12),
        position: 'absolute',
        left: ScreenUtils.autoSizeWidth(15),
        top: ScreenUtils.autoSizeWidth(12)
    },
    couponsOutStyle: {
        height: ScreenUtils.autoSizeWidth(34),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: ScreenUtils.autoSizeWidth(36)
    },
    couponsTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: ScreenUtils.px2dp(13),
        alignSelf: 'center'
    },
    couponsNumStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: ScreenUtils.px2dp(13),
        alignSelf: 'center',
        marginRight: ScreenUtils.autoSizeWidth(13.5)
    },
    couponsLineStyle: {
        marginLeft: ScreenUtils.autoSizeWidth(36),
        backgroundColor: DesignRule.bgColor,
        height: 0.5,
        width: '100%'
    },
    commitOutStyle: {
        height: ScreenUtils.autoSizeHeight(49),
        flexDirection: 'row',
        backgroundColor: DesignRule.white,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    commitAmountStyle: {
        fontSize: ScreenUtils.px2dp(15),
        color: DesignRule.mainColor,
        marginRight: ScreenUtils.autoSizeWidth(15)
    },
    commitTouStyle: {
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        height: ScreenUtils.autoSizeHeight(49)
    }
});
