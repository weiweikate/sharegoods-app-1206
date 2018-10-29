import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Image,
    TextInput as RNTextInput,
    Text,
    TouchableOpacity,ScrollView
} from 'react-native';
import {
    UIText, UIImage, RefreshList
} from '../../../components/ui';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import position from '../res/position.png';
import arrow_right from '../res/arrow_right.png';
import colorLine from '../res/addressLine.png';
import GoodsItem from '../components/GoodsItem';
import user from '../../../model/user';
import Toast from '../../../utils/bridge';
import BasePage from '../../../BasePage';
import OrderApi from './../api/orderApi';
import MineApi from '../../mine/api/MineApi';

// let oldViewData, oldPriceList;
export default class ConfirOrderPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            selectExpress: true,//快递
            message: '',
            pickedUp: StringUtils.isNoEmpty(user.pickedUp),
            oldViewData: {},
            oldPriceList: {},
            defaultAddress: false,
            viewData: {
                express: {},
                list: [
                    {}
                ],
                priceList: [
                    {}
                ],
                couponList:null,
                userScore: 0,
                reducePrice: 0,
                canUseScore: true,
                totalFreightFee: 0,
                totalAmounts: 0
            },
            tokenCoin: 0,
            couponId: null,
            tokenCoinText: null,
            orderParam: this.params.orderParamVO ? this.params.orderParamVO : []

        };
    }

    $navigationBarOptions = {
        title: '确认订单',
        show: true // false则隐藏导航
    };
    //**********************************ViewPart******************************************
    renderAddress = () => {
        return (StringUtils.isNoEmpty(this.state.viewData.express.receiverNum) ?
                <TouchableOpacity
                    style={{ height: 87, backgroundColor: color.white, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => this.selectAddress()}>
                    <UIImage source={position} style={{ height: 20, width: 20, marginLeft: 20 }}/>
                    <View style={{ flex: 1, marginLeft: 15, marginRight: 20 }}>
                        <View style={{ flexDirection: 'row',alignItems:'center', }}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Text style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 15, color: '#222222'}}>收货人:</Text>
                                <UIText value={ this.state.viewData.express.receiverName}
                                           style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 15, color: '#222222'}}/>
                            </View>
                           <View style={{flex:1,alignItems:'flex-end'}}>
                               <UIText value={this.state.viewData.express.receiverNum}
                                       style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 15, color: '#222222'}}/>
                           </View>

                        </View>
                        <UIText
                            value={
                                '收货地址：' + this.state.viewData.express.provinceString
                                + this.state.viewData.express.cityString
                                + this.state.viewData.express.areaString
                                + this.state.viewData.express.receiverAddress
                            }
                            style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 13,
                                color: '#222222',
                                marginTop: 5
                            }}/>
                    </View>
                    <Image source={arrow_right} style={{ height: 14, marginRight: 15 }}/>
                </TouchableOpacity> :
                <TouchableOpacity
                    style={{ height: 87, backgroundColor: color.white, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => this.selectAddress()}>
                    <UIImage source={position} style={{ height: 20, width: 20, marginLeft: 20 }}/>
                    <View style={{ flex: 1, marginLeft: 15, marginRight: 20 }}>
                        <UIText value={'请添加一个收货人地址'} style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 13,
                            color: '#c8c8c8',
                            marginLeft: 15
                        }}/>
                    </View>
                    <Image source={arrow_right} style={{ height: 14, marginRight: 15 }}/>
                </TouchableOpacity>
        );
    };
    renderSelectImage = () => {
        return (
            <View>
                <View style={{}}>
                    <Image source={colorLine} style={{ height: 3, width: ScreenUtils.width }}/>
                </View>
                {this.state.orderParam && this.state.orderParam.orderType === 3 ?

                    <View style={{
                        marginTop: 20,
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <View style={{
                            borderWidth: 1,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: '#e60012',
                            marginLeft: 20
                        }}>
                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 11,
                                color: '#e60012',
                                padding: 3
                            }}>礼包</Text>
                        </View>
                        <Text style={{
                            marginLeft: 10,
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 12,
                            color: '#999999'
                        }}>{this.state.viewData.list[0].goodsName}</Text>
                    </View>
                    :
                    null}
            </View>
        );
    };
    renderDetail = () => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <TouchableOpacity style={{
                    height: 44,
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                                  disabled={(this.state.viewData.list[0].restrictions & 1) == 1 || this.state.orderParam.orderType == 1 || this.state.orderParam.orderType == 2}
                                  onPress={() => this.jumpToCouponsPage()}>
                    <UIText value={'优惠券'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={(this.state.viewData.list[0].restrictions & 1) == 1 || this.state.orderParam.orderType == 1 || this.state.orderParam.orderType == 2 ? '不可使用优惠券' : (this.state.couponName ? this.state.couponName : '选择优惠券')}
                            style={[styles.grayText, { marginRight: 15 }]}/>
                        <Image source={arrow_right}/>
                    </View>
                </TouchableOpacity>

                {this.renderLine()}
                {!user.tokenCoin ? null :
                    <TouchableOpacity style={{
                        height: 44,
                        flexDirection: 'row',
                        paddingLeft: 15,
                        paddingRight: 15,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                                      onPress={() => this.jumpToCouponsPage('justOne')}>
                        <UIText value={'1元现金券'} style={styles.blackText}/>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <UIText
                                value={ this.state.tokenCoin ? this.state.tokenCoinText : '选择1元现金券'}
                                style={[styles.grayText, { marginRight: 15 }]}/>
                            <Image source={arrow_right}/>
                        </View>
                    </TouchableOpacity>
                }
                {this.renderLine()}
                {this.renderLine()}
                <TouchableOpacity style={{
                    height: 44,
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <UIText value={'运费'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText value={StringUtils.formatMoneyString(this.state.viewData.totalFreightFee)}
                                style={[styles.grayText]}/>
                    </View>
                </TouchableOpacity>
                {this.renderLine()}
                <TouchableOpacity style={{
                    height: 44,
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText value={'买家留言'} style={styles.blackText}/>
                        <RNTextInput
                            style={styles.inputTextStyle}
                            onChangeText={text => this.setState({ message: text })}
                            placeholder={'选填：填写内容已与卖家协商确认'}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                </TouchableOpacity>
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
                {this.renderLine()}
                {this.renderDetail()}
            </View>
        );
    };
    renderCouponsPackage =() =>{
        return(
            <View style={{borderColor:'#DDDDDD',borderWidth:1}}>
                {this.state.viewData.couponList?
                    this.state.viewData.couponList.map((item,index)=>{
                        return <View style={{backgroundColor:'white'}}>
                        <View style={{height:34,flexDirection:'row',justifyContent:'space-between',marginLeft:36}}>
                            <Text style={{color: color.black_999, fontSize: 13,alignSelf:'center'}}>{item.couponName}</Text>
                            <Text style={{color: color.black_999, fontSize: 13,alignSelf:'center',marginRight:14}}>X1</Text>
                        </View>
                            <View style={{marginLeft:36,backgroundColor:'#F7F7F7',height:0.5,width:'100%'}}/>
                        </View>
                    })
                :
                null}
                <View style={{backgroundColor:'#F7F7F7',height:10,width:'100%'}}/>
            </View>
        )
    };
    renderCommitOrder = () => {
        return (
            <View>
                {this.renderLine()}
                <View style={{ height: 49, flexDirection: 'row' }}>
                    <View
                        style={{ width: 264, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <UIText value={'应付款：'} style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 15,
                            color: '#222222',
                            marginRight: 12
                        }}/>
                        <UIText
                            value={StringUtils.formatMoneyString(this.state.viewData.totalAmounts)}
                            style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 15,
                                color: color.red,
                                marginRight: 12
                            }}/>
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: color.red, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.commitOrder()}>
                        <UIText value={'提交订单'}
                                style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 16, color: '#ffffff' }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    _render() {
        return (
            // data={this.state.orderParam && this.state.orderParam.orderType === 3 || this.state.orderParam.orderType === 98 ? this.state.priceList : this.state.viewData.list}
//this.params.orderParamVO.orderProducts
            <View style={styles.container}>
                <ScrollView>
                <RefreshList
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFootder}
                    data={this.state.orderParam && this.state.orderParam.orderType === 3 || this.state.orderParam.orderType === 98 ? this.params.orderParamVO.orderProducts[0].priceList : this.state.viewData.list}
                    renderItem={this.renderItem}
                    extraData={this.state}
                />
                </ScrollView>
                {this.renderCommitOrder()}
            </View>

        );
    };

    renderItem = ({ item, index }) => {
        console.log(item);
        if (this.state.orderParam && this.state.orderParam.orderType === 3 || this.state.orderParam.orderType === 98) {
            return (
                <View>
                <GoodsItem
                    uri={item.specImg}
                    goodsName={item.productName}
                    category={item.spec}
                    goodsNum={'X' + item.num}
                    onPress={() => this.clickItem(index, item)}
                />

                </View>
            );
        } else {
            return (
                <TouchableOpacity>
                    <GoodsItem
                        uri={item.uri}
                        goodsName={item.goodsName}
                        salePrice={StringUtils.formatMoneyString(item.salePrice)}
                        category={item.category}
                        goodsNum={'X' + item.goodsNum}
                        onPress={() => this.clickItem(index, item)}

                    />
                </TouchableOpacity>
            );
        }

    };
    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: color.line }}/>
        );
    };

    componentDidMount() {
        this.loadPageData();
    }

   loadPageData(params) {
        Toast.showLoading();
        switch (this.state.orderParam.orderType) {
            case 1://秒杀
                OrderApi.SeckillMakeSureOrder({
                    orderType: this.params.orderParamVO.orderType,
                    code: this.params.orderParamVO.orderProducts[0].code,
                    num: this.params.orderParamVO.orderProducts[0].num,
                    ...params
                }).then(response => {
                    Toast.hiddenLoading();
                    this.handleNetData(response.data);
                }).catch(err => {
                    Toast.hiddenLoading();
                    this.$toastShow(err.msg);
                    if (err.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
                break;
            case 2://降价拍
                OrderApi.DepreciateMakeSureOrder({
                    orderType: this.params.orderParamVO.orderType,
                    code: this.params.orderParamVO.orderProducts[0].code,
                    num: this.params.orderParamVO.orderProducts[0].num,
                    ...params
                }).then(response => {
                    Toast.hiddenLoading();
                    this.handleNetData(response.data);
                }).catch(err => {
                    Toast.hiddenLoading();
                    this.$toastShow(err.msg);
                    if (err.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
                break;
            case 99:
                OrderApi.makeSureOrder({
                    orderType: this.params.orderParamVO.orderType,
                    orderProducts: this.params.orderParamVO.orderProducts,
                    ...params
                }).then(response => {
                   console.log('resa',response);
                    Toast.hiddenLoading();
                    this.handleNetData(response.data);
                }).catch(err => {
                    console.log('err',err);
                    Toast.hiddenLoading();

                    this.$toastShow(err.msg);
                    if (err.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
                break;
            case 3://礼包
                console.log(this.params.orderParamVO);
                OrderApi.PackageMakeSureOrder({
                    packageCode: this.params.orderParamVO.packageCode,
                    orderType: 5,
                    orderProducts: this.params.orderParamVO.orderProducts,
                    ...params
                }).then(
                    response => {
                        Toast.hiddenLoading();
                        this.handleNetData(response.data);
                    }
                ).catch(err => {
                    Toast.hiddenLoading();
                    this.$toastShow(err.msg);
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
                productId: item.productId,
                uri: item.specImg,
                goodsName: item.productName,
                salePrice: item.price,
                category: item.spec,
                goodsNum: item.num,
                originalPrice: item.originalPrice,
                restrictions: item.restrictions
                // activityId: item.activityId
            });
        });
        if (data.userAddress && !this.state.defaultAddress) {
            viewData.express = {
                id: data.userAddress.id,
                receiverName: data.userAddress.receiver,
                receiverNum: data.userAddress.receiverPhone,
                receiverAddress: data.userAddress.address,
                areaCode: data.userAddress.areaCode,
                cityCode: data.userAddress.cityCode,
                provinceCode: data.userAddress.provinceCode,
                provinceString: data.userAddress.province,
                cityString: data.userAddress.city,
                areaString: data.userAddress.area
            };
        } else {
            // viewData.express = {};
        }
        viewData.totalAmounts = data.totalAmounts;
        viewData.totalFreightFee = data.totalFreightFee;
        viewData.list = arrData;
        viewData.couponList=data.couponList?data.couponList:null;
        this.setState({ viewData });
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
    selectAddress = () => {
        this.$navigate('mine/address/AddressManagerPage', {
            from: 'order',
            callBack: (json) => {
                console.log(json);
                let viewData = this.state.viewData;
                viewData.express = {
                    id: json.id,
                    receiverName: json.receiver,
                    receiverNum: json.receiverPhone,
                    receiverAddress: json.address,
                    areaCode: json.areaCode,
                    cityCode: json.cityCode,
                    provinceCode: json.provinceCode,
                    provinceString: json.province,
                    cityString: json.city,
                    areaString: json.area
                };
                this.setState({ viewData, defaultAddress: true });
                let params = {
                    areaCode: json.areaCode,
                    cityCode: json.cityCode,
                    provinceCode: json.provinceCode
                };
                this.loadPageData(params);
            }
        });
    };
    commitOrder = () => {
        let address;//Y:收货地址	string
        let areaCode;//	Y:收货区code	number
        let buyerRemark = this.state.message;//Y:买家留言	string
        let cityCode;//Y:收货市code	number
        //let orderProductList = JSON.stringify(this.state.orderProductList);//N:{[price_id:12,num:12],[...]}	string
        let provinceCode;//N:收货省code	number
        let receiver;//	Y:收货人	string
        let recevicePhone;//Y:收货人手机号	number
        let tokenCoin = this.state.tokenCoin;//N：使用积分	string
        let couponId = this.state.couponId;

        address = this.state.viewData.express.receiverAddress;
        areaCode = this.state.viewData.express.areaCode;
        cityCode = this.state.viewData.express.cityCode;
        provinceCode = this.state.viewData.express.provinceCode;
        receiver = this.state.viewData.express.receiverName;
        recevicePhone = this.state.viewData.express.receiverNum;
        if (StringUtils.isEmpty(areaCode)) {
            NativeModules.commModule.toast('请先添加地址');
            return;
        }
        this.$loadingShow();
        let params;
        if (this.state.orderParam && this.state.orderParam.orderType === 1 || this.state.orderParam.orderType === 2 || this.state.orderParam.orderType === 98 || this.state.orderParam.orderType === 3) {
            params = {
                address: address,
                areaCode: areaCode,
                buyerRemark: buyerRemark,
                cityCode: cityCode,
                num: this.state.orderParam.orderProducts[0].num,
                code: this.state.orderParam.orderProducts[0].code,
                orderType: this.state.orderParam.orderType,
                provinceCode: provinceCode,
                receiver: receiver,
                recevicePhone: recevicePhone,
                tokenCoin: tokenCoin,
                couponId: couponId
            };
            console.log(params);
            if (this.state.orderParam && this.state.orderParam.orderType === 1) {//如果是秒杀的下单
                OrderApi.SeckillSubmitOrder(params).then((response) => {
                    this.$loadingDismiss();
                    let data = response.data;
                    MineApi.getUser().then(res => {
                        this.$loadingDismiss();
                        let data = res.data;
                        user.saveUserInfo(data);
                    }).catch(err => {
                        if (err.code === 10009) {
                            this.props.navigation.navigate("login/login/LoginPage", { callback: this.loadPageData });
                        }
                    })
                    this.$navigate('payment/PaymentMethodPage', {
                        orderNum: data.orderNum,
                        amounts: this.state.viewData.totalAmounts,
                        pageType: 0,
                        availableBalance: data.user.availableBalance
                    });
                }).catch(e => {
                    this.$loadingDismiss();
                    console.log(e);
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
                    let data = response.data;
                    MineApi.getUser().then(res => {
                        this.$loadingDismiss();
                        let data = res.data;
                        user.saveUserInfo(data);
                    }).catch(err => {
                        if (err.code === 10009) {
                            this.props.navigation.navigate("login/login/LoginPage", { callback: this.loadPageData });
                        }
                    })
                    this.$navigate('payment/PaymentMethodPage', {
                        orderNum: data.orderNum,
                        amounts: this.state.viewData.totalAmounts,
                        pageType: 0,
                        availableBalance: data.user.availableBalance
                    });
                }).catch(e => {
                    this.$loadingDismiss();
                    console.log(e);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });
            }
            else if (this.state.orderParam && this.state.orderParam.orderType === 3) {
                let params1 = {
                    address: address,
                    areaCode: areaCode,
                    buyerRemark: buyerRemark,
                    cityCode: cityCode,
                    orderType: 5,
                    provinceCode: provinceCode,
                    receiver: receiver,
                    recevicePhone: recevicePhone,
                    orderProducts: this.state.orderParam.orderProducts,
                    packageCode: this.state.orderParam.packageCode,
                    tokenCoin: tokenCoin,
                    couponId: couponId
                };
                OrderApi.PackageSubmitOrder(params1).then((response) => {
                    this.$loadingDismiss();
                    let data = response.data;
                    MineApi.getUser().then(res => {
                        this.$loadingDismiss();
                        let data = res.data;
                        user.saveUserInfo(data);
                    }).catch(err => {
                        if (err.code === 10009) {
                            this.props.navigation.navigate("login/login/LoginPage", { callback: this.loadPageData });
                        }
                    })
                    this.$navigate('payment/PaymentMethodPage', {
                        orderNum: data.orderNum,
                        amounts: this.state.viewData.totalAmounts,
                        pageType: 0,
                        availableBalance: data.user.availableBalance
                    });
                }).catch(e => {
                    this.$loadingDismiss();
                    console.log(e);
                    if (e.code === 10009) {
                        this.$navigate('login/login/LoginPage', {
                            callback: () => {
                                this.loadPageData();
                            }
                        });
                    }
                });

            }
        } else {
            params = {
                address: address,
                areaCode: areaCode,
                buyerRemark: buyerRemark,
                cityCode: cityCode,
                orderProducts: this.state.orderParam.orderProducts,
                orderType: this.state.orderParam.orderType,
                provinceCode: provinceCode,
                receiver: receiver,
                recevicePhone: recevicePhone,
                tokenCoin: tokenCoin,
                couponId: couponId
            };
            OrderApi.submitOrder(params).then((response) => {
                this.$loadingDismiss();
                let data = response.data;
                MineApi.getUser().then(res => {
                    this.$loadingDismiss();
                    let data = res.data;
                    user.saveUserInfo(data);
                }).catch(err => {
                    if (err.code === 10009) {
                        this.props.navigation.navigate("login/login/LoginPage", { callback: this.loadPageData });
                    }
                })
                this.$navigate('payment/PaymentMethodPage', {
                    orderNum: data.orderNum,
                    amounts: this.state.viewData.totalAmounts,
                    pageType: 0,
                    availableBalance: data.user.availableBalance

                });

            }).catch(e => {
                this.$loadingDismiss();
                console.log(e);
                if (e.code === 10009) {
                    this.$navigate('login/login/LoginPage', {
                        callback: () => {
                            this.loadPageData();
                        }
                    });
                }
            });

        }
    };
    //选择优惠券
    jumpToCouponsPage = (params) => {
        if (params == 'justOne') {
            this.$navigate('mine/coupons/CouponsPage', {
                justOne: this.state.viewData.totalAmounts?this.state.viewData.totalAmounts:1, callBack: (data) => {
                    console.log(typeof data);
                    if (parseInt(data) >=0) {
                        let params = { tokenCoin: parseInt(data), couponId: this.state.couponId };
                        this.setState({ tokenCoin: data, tokenCoinText:parseInt(data)>0?'-¥' + parseInt(data) :'选择使用1元券'});
                        this.loadPageData(params);
                    }
                }
            });
        } else {
            this.$navigate('mine/coupons/CouponsPage', {
                fromOrder: 1, productIds: this.state.viewData.list[0].productId,
                orderParam: this.state.orderParam, callBack: (data) => {
                    if (data && data.id) {
                        let params = { couponId: data.id, tokenCoin: 0 };
                        this.setState({ couponId: data.id, couponName: data.name,tokenCoin: 0,tokenCoinText:'选择使用1元券' });
                        this.loadPageData(params);
                    } else if (data == 'giveUp') {
                        this.setState({ couponId: null, couponName: null });
                        this.loadPageData();
                    }
                }
            });
        }
    };

    componentWillUnmount() {
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#f7f7f7', justifyContent: 'flex-end'
    }, selectText: {
        fontFamily: 'PingFang-SC-Medium', fontSize: 16, color: '#ffffff'
    }, blackText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        lineHeight: 18,
        color: '#000000'
    }, grayText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        lineHeight: 18,
        color: '#999999'
    }, inputTextStyle: {
        marginLeft: 20, height: 40, flex: 1, backgroundColor: 'white', fontSize: 14
    }, selectView: {
        flex: 1,
        borderRadius: 3,
        backgroundColor: '#61686c',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#61686c',
        justifyContent: 'center',
        alignItems: 'center'
    }, unSelectView: {
        flex: 1,
        borderRadius: 3,
        backgroundColor: color.white,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#61686c',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

