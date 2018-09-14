import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Image,
    TextInput as RNTextInput,
    Text,
    TouchableOpacity, Switch
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
// import OrderApi from 'OrderApi'
// import HomeApi from './../../../utils/net/HomeApi'
import BasePage from '../../../BasePage';

let oldViewData, oldPriceList;
export default class ConfirOrderPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            selectExpress: true,//快递
            message: '',
            pickedUp: StringUtils.isNoEmpty(user.pickedUp),
            oldViewData: {},
            oldPriceList: {},
            viewData: {
                express: {
                    receiverName: '赵信',
                    receiverNum: '18254569878',
                    receiverAddress: '收货地址：浙江省杭州市萧山区宁围镇鸿宁路望京商务C2-502',
                    areaCode: 0,
                    cityCode: 0,
                    provinceCode: 0,
                    provinceString: '浙江省',
                    cityString: '金华市',
                    areaString: '义乌市'
                },
                pickSelf: {
                    id: 1,
                    name: '提货点A',
                    address: '浙江省杭州市萧山区宁围镇鸿宁路区宁围镇鸿宁路区宁围镇鸿宁路望京商务C2-502',
                    areaCode: 0,
                    cityCode: 0,
                    provinceCode: 0,
                    receiverNum: 0,
                    provinceString: '浙江省',
                    cityString: '金华市',
                    areaString: '义乌市'
                },
                list: [
                    {
                        productId: 1,
                        uri: 'https://ws2.sinaimg.cn/large/006tNc79gy1fsvlm591zyj30om056dl8.jpg',
                        goodsName: 'CHEERIOBAN 慵懒随意春装2018新款女毛呢格纹编制流苏小香风外套',
                        salePrice: '150',
                        category: '通勤通勤: 复古衣长: 中长款袖长: 长袖',
                        goodsNum: '1'
                    }
                ],
                priceList: [
                    {
                        'productId': 6,
                        'priceId': 39,
                        'num': 1,
                        'sourceId': 4,
                        'spec': '仙踪绿-6+128GB',
                        'specImg': 'https://juretest.oss-cn-hangzhou.aliyuncs.com/jure/jure_crm/test/0989d6f0-4273-4441-a7e7-afa55fd7bf63_1534744994907.png',
                        'productName': 'Meitu/美图 T9美图T9手机新款 双卡双待美颜拍照手机 美图手机正品 F4明星同款手机'
                    }
                ],
                score: 0,
                userScore: 0,
                reducePrice: 0,
                canUseScore: true,
                useScore: false,
                totalFreightFee: 0,
                totalAmounts: 0
            },
            orderParam: this.params.orderParam ? this.params.orderParam : []

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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <UIText value={'收货人：' + this.state.viewData.express.receiverName}
                                    style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 15, color: '#222222' }}/>
                            <UIText value={this.state.viewData.express.receiverNum}
                                    style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 15, color: '#222222' }}/>
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
    renderAddressRight = () => {
        return (StringUtils.isNoEmpty(this.state.viewData.pickSelf.name) ?
                <TouchableOpacity
                    style={{ height: 87, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    onPress={() => this.selectPickAddress()}>
                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 20, alignItems: 'center' }}>
                        <Image style={{ height: 20 }} source={position}/>
                        <View style={{ marginLeft: 15 }}>
                            <UIText value={this.state.viewData.pickSelf.name}
                                    style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 15, color: '#222222' }}/>
                            <UIText
                                value={
                                    this.state.viewData.pickSelf.provinceString
                                    + this.state.viewData.pickSelf.cityString
                                    + this.state.viewData.pickSelf.areaString
                                    + this.state.viewData.pickSelf.address
                                }
                                style={{
                                    fontFamily: 'PingFang-SC-Medium',
                                    fontSize: 13,
                                    color: '#222222',
                                    marginTop: 5,
                                    paddingRight: 40
                                }}/>
                        </View>
                    </View>
                    <Image source={arrow_right} style={{ height: 14, marginRight: 15 }}/>
                </TouchableOpacity> :
                <TouchableOpacity
                    style={{ height: 87, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    onPress={() => this.selectPickAddress()}>
                    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 20, alignItems: 'center' }}>
                        <Image style={{ height: 20 }} source={position}/>
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
    renderSelectImage2 = () => {
        return (this.state.pickedUp ?
                //快递与自提
                <View style={{
                    height: 25,
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15
                }}>
                    <TouchableOpacity style={this.state.selectExpress ? styles.selectView : styles.unSelectView}
                                      onPress={() => this.setState({ selectExpress: true })}>
                        <UIText value={'快递'} style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 13,
                            color: !this.state.selectExpress ? '#61686c' : '#ffffff'
                        }}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={!this.state.selectExpress ? styles.selectView : styles.unSelectView}
                                      onPress={() => this.setState({ selectExpress: false })}>
                        <UIText value={'自提'} style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 13,
                            color: this.state.selectExpress ? '#61686c' : '#ffffff'
                        }}/>
                    </TouchableOpacity>
                </View>
                :
                //只有快递
                <View style={{
                    height: 25,
                    backgroundColor: '#61686c',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingLeft: 15,
                    paddingRight: 15
                }}>
                    <UIText value={'快递'} style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, color: '#ffffff' }}/>
                </View>


        );
    };
    renderSelectImage = () => {
        return (
            <View>
                <View style={{ position: 'absolute' }}>
                    <Image source={colorLine} style={{ height: 3, width: ScreenUtils.width, marginTop: 5 }}/>
                </View>
                {this.params.orderParam && this.params.orderParam.orderType === 3 ?

                    <View style={{
                        marginTop: 20,
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20
                    }}>
                        <View style={{
                            borderWidth: 1,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: '#e60012'
                        }}>
                            <Text style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 11,
                                color: '#e60012',
                                padding: 3
                            }}>套餐</Text>
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
    renderScore = () => {//渲染使用积分那一行
        return (!this.state.viewData.canUseScore ? null :
                <View>
                    {this.renderLine()}
                    <TouchableOpacity style={{
                        height: 44,
                        flexDirection: 'row',
                        paddingLeft: 15,
                        paddingRight: 15,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <UIText
                                value={'共' + this.state.viewData.userScore + '秀豆，可用' + this.state.viewData.score + '秀豆，抵'}
                                style={styles.blackText}/>
                            <UIText value={'￥' + this.state.viewData.reducePrice}
                                    style={[styles.blackText, { color: color.red }]}/>
                        </View>
                        <Switch value={this.state.isCheck} onTintColor={color.red}
                                thumbTintColor={color.red}
                                onValueChange={(isCheck) => {
                                    let viewData = this.state.viewData;
                                    if (isCheck) {
                                        viewData.useScore = true;
                                    } else {
                                        viewData.useScore = false;
                                    }
                                    this.setState({ isCheck: isCheck, viewData: viewData });
                                }}
                        />
                    </TouchableOpacity>
                </View>
        );
    };
    renderDetail = () => {
        return (
            <View>
                <TouchableOpacity style={{
                    height: 44,
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                                  disabled={this.params.orderParam && this.params.orderParam.orderType == 1 || this.params.orderParam.orderType == 2}
                                  onPress={() => this.jumpToCouponsPage()}>
                    <UIText value={'优惠卷'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={this.params.orderParam && this.params.orderParam.orderType == 1 || this.params.orderParam.orderType == 2 ? '不可使用优惠券' : '选择优惠卷'}
                            style={[styles.grayText, { marginRight: 15 }]}/>
                        <Image source={arrow_right}/>
                    </View>
                </TouchableOpacity>
                {this.renderScore()}
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
                {this.renderSelectImage2()}
                {this.state.selectExpress ? this.renderAddress() : this.renderAddressRight()}
                {this.renderSelectImage()}
            </View>
        );
    };
    renderFootder = () => {
        return (
            <View>
                {this.renderLine()}
                {this.renderDetail()}
            </View>
        );
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
                            value={StringUtils.formatMoneyString(this.state.viewData.useScore ? this.state.viewData.totalAmounts - this.state.viewData.reducePrice : this.state.viewData.totalAmounts)}
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
            //                    data={this.params.orderParam && this.params.orderParam.orderType === 3 || this.params.orderParam.orderType === 98 ? this.state.priceList : this.state.viewData.list}
            <View style={styles.container}>
                <RefreshList
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFootder}
                    data={this.state.viewData.list}
                    renderItem={this.renderItem}
                    extraData={this.state}
                />
                {this.renderCommitOrder()}
            </View>
        );
    };

    renderItem = ({ item, index }) => {
        if (this.params.orderParam && this.params.orderParam.orderType === 3 || this.params.orderParam.orderType === 98) {
            return (

                <GoodsItem
                    uri={item.specImg}
                    goodsName={item.productName}
                    salePrice={StringUtils.formatMoneyString(item.originalPrice)}
                    category={item.spec}
                    goodsNum={'X' + item.num}
                    onPress={() => this.clickItem(index, item)}
                />
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
            <View style={{ height: 1, backgroundColor: color.line }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, height: 10 }}/>
        );
    };

    //**********************************BusinessPart******************************************
    // loadPageData() {
    //     Toast.showLoading();
    //     OrderApi.makeSureOrder({ orderParam: JSON.stringify(this.state.orderParam) }).then((response) => {
    //         Toast.hiddenLoading();
    //         if (response.ok) {
    //             console.log(response.data);
    //             let data = response.data;
    //             let arrData = [];
    //             data.orderProductList.map((item, index) => {
    //                 arrData.push({
    //                     productId: item.productId,
    //                     uri: item.specImg,
    //                     goodsName: item.name,
    //                     salePrice: item.salePrice,
    //                     category: item.spec,
    //                     goodsNum: item.num,
    //                     activityId: item.activityId
    //                 });
    //
    //             });
    //
    //             // 积分抵扣计算
    //             let score = data.dealer.userScore > data.totalScore ? data.totalScore : data.dealer.userScore;
    //             let viewData = this.state.viewData;
    //             viewData.score = score;
    //             viewData.list = arrData;
    //             viewData.userScore = data.dealer.userScore;
    //             viewData.reducePrice = data.userScoreToBalance * score;
    //             // 当商品可以使用积分 用户积分大于0的时候 显示可以使用积分
    //             viewData.canUseScore = (data.totalScore > 0 && data.dealer.userScore) ? true : false;
    //             viewData.totalFreightFee = StringUtils.isNoEmpty(data.totalFreightFee) ? data.totalFreightFee : 0;
    //             viewData.totalAmounts = data.totalAmounts;
    //             this.setState({ viewData: viewData, priceList: data.orderProductList[0].priceList });
    //             oldViewData = Object.assign({}, viewData);
    //             oldPriceList = [...data.orderProductList[0].priceList];
    //             console.log(oldViewData);
    //         } else {
    //             NativeModules.commModule.toast(response.msg);
    //         }
    //     }).catch(e => {
    //         Toast.hiddenLoading();
    //     });
    //     //查询默认地址
    //     Toast.showLoading();
    //     OrderApi.queryUserAddressList({}).then((response) => {
    //         Toast.hiddenLoading();
    //         if (response.ok) {
    //             let data = response.data;
    //             data.map((item, index) => {
    //                 if (item.defaultStatus == 1) {
    //                     let viewData = this.state.viewData;
    //                     viewData.express.receiverName = item.receiver;
    //                     viewData.express.receiverNum = item.recevicePhone;
    //                     viewData.express.receiverAddress = item.address;
    //                     viewData.express.areaCode = item.areaCode;
    //                     viewData.express.cityCode = item.cityCode;
    //                     viewData.express.provinceCode = item.provinceCode;
    //                     viewData.express.provinceString = item.province;
    //                     viewData.express.cityString = item.province;
    //                     viewData.express.areaString = item.province;
    //                     this.setState({ viewData: viewData });
    //                 }
    //             });
    //         } else {
    //             NativeModules.commModule.toast(response.msg);
    //         }
    //     }).catch(e => {
    //         Toast.hiddenLoading();
    //     });
    //
    //
    // }

    clickItem = (index, item) => {
        if (this.params.orderParam && this.params.orderParam.orderType === 3) {//优惠套餐
            this.navigate('home/CouponsComboDetailPage', { id: this.state.viewData.list[0].productId });
        } else if (this.params.orderParam && this.params.orderParam.orderType === 1) {//秒杀
            this.navigate('product/ProductDetailPage', {
                productId: item.productId,
                activityCode: item.productId,
                ids: item.activityId
            });

        }
        else if (this.params.orderParam && this.params.orderParam.orderType === 2) {//降价拍
            this.navigate('product/ProductDetailPage', {
                productId: item.productId,
                id: item.productId,
                ids: item.activityId
            });
        } else if (this.params.orderParam && this.params.orderParam.orderType === 98) {
            this.navigate('home/GiftProductDetailPage', { id: this.state.viewData.list[0].productId });
        }
        else {
            this.navigate('product/ProductDetailPage', { productId: item.productId });//正常商品
        }

    };
    selectPickAddress = () => {
        this.navigate('addressSelect/SelectAddressPage', {
            callBack: (jsonData) => {
                let json = JSON.parse(jsonData);
                let viewData = this.state.viewData;
                viewData.pickSelf = {
                    id: json.id,
                    name: json.name,
                    address: json.addressDetail,
                    areaCode: json.area,
                    cityCode: json.city,
                    provinceCode: json.province,
                    receiverNum: json.phone,
                    provinceString: json.provinceString,
                    cityString: json.cityString,
                    areaString: json.areaString
                };
                this.setState({ viewData: viewData });

            }
        });
    };
    selectAddress = () => {
        this.navigate('setting/AddressManagePage', {
            callBack: (jsonData) => {
                let json = JSON.parse(jsonData);
                let orderParams = this.params.orderParam;
                let viewData = this.state.viewData;
                viewData.express = {
                    id: json.id,
                    receiverName: json.name,
                    receiverNum: json.phone,
                    receiverAddress: json.addressDetail,
                    areaCode: json.area,
                    cityCode: json.city,
                    provinceCode: json.province,
                    provinceString: json.provinceString,
                    cityString: json.cityString,
                    areaString: json.areaString
                };
                orderParams.cityCode = json.city;
                console.log(orderParams);
                // OrderApi.calcFreight({ orderParam: JSON.stringify(orderParams) }).then((res) => {
                //     if (res.ok) {
                //         if (StringUtils.isNoEmpty(res.data.totalFreightFee)) {
                //             viewData.totalFreightFee = res.data.totalFreightFee;
                //             viewData.totalAmounts = this.state.viewData.totalAmounts - res.data.totalFreightFee;
                //         } else {
                //             viewData.totalFreightFee = 0;
                //
                //         }
                //     } else {
                //         Toast.toast(res.msg);
                //     }
                // }).catch(e => {
                //     console.log('' + e);
                // });

                this.setState({ viewData: viewData });
            }
        });
    };
    commitOrder = () => {
        let address;//Y:收货地址	string
        let areaCode;//	Y:收货区code	number
        let buyerRemark = this.state.message;//Y:买家留言	string
        let cityCode;//Y:收货市code	number
        //let orderProductList = JSON.stringify(this.state.orderProductList);//N:{[price_id:12,num:12],[...]}	string
        ////1 快递 2自提
        let pickedUp = this.state.selectExpress ? 1 : 2;//N:是否自提	number
        let provinceCode;//N:收货省code	number
        let receiver;//	Y:收货人	string
        let recevicePhone;//Y:收货人手机号	number
        let storehouseId = this.state.selectExpress ? '' : this.state.viewData.pickSelf.id;//Y:提货模板id	number
        let useScore = this.state.viewData.score;//N：使用积分	string

        if (this.state.selectExpress) {
            //快递
            address = this.state.viewData.express.receiverAddress;
            areaCode = this.state.viewData.express.areaCode;
            cityCode = this.state.viewData.express.cityCode;
            provinceCode = this.state.viewData.express.provinceCode;
            receiver = this.state.viewData.express.receiverName;
            recevicePhone = this.state.viewData.express.receiverNum;
        } else {
            //自提
            address = this.state.viewData.pickSelf.address;
            areaCode = this.state.viewData.pickSelf.areaCode;
            cityCode = this.state.viewData.pickSelf.cityCode;
            provinceCode = this.state.viewData.pickSelf.provinceCode;
            receiver = this.state.viewData.pickSelf.name;
            recevicePhone = this.state.viewData.pickSelf.receiverNum;
        }
        if (StringUtils.isEmpty(areaCode)) {
            NativeModules.commModule.toast('请先添加地址');
            return;
        }
        Toast.showLoading();
        let params;
        if (this.params.orderParam && this.params.orderParam.orderType === 1 || this.params.orderParam.orderType === 2 || this.params.orderParam.orderType === 98) {
            params = {
                address: address,
                areaCode: areaCode,
                buyerRemark: buyerRemark,
                cityCode: cityCode,
                orderProducts: this.params.orderParam.orderProducts,
                orderType: this.params.orderParam.orderType,
                pickedUp: pickedUp,
                provinceCode: provinceCode,
                receiver: receiver,
                recevicePhone: recevicePhone,
                storehouseId: storehouseId
            };
        } else {
            params = {
                address: address,
                areaCode: areaCode,
                buyerRemark: buyerRemark,
                cityCode: cityCode,
                orderProducts: this.params.orderParam.orderProducts,
                orderType: this.params.orderParam.orderType,
                pickedUp: pickedUp,
                provinceCode: provinceCode,
                receiver: receiver,
                recevicePhone: recevicePhone,
                storehouseId: storehouseId,
                useScore: useScore
            };
        }
        console.log(params);
        if (this.params.orderParam && this.params.orderParam.orderType === 1) {//如果是秒杀的下单
            // HomeApi.submitOrder({ orderParam: JSON.stringify(params) }).then((response) => {
            //     if (response.ok) {
            //         let data = response.data;
            //         // let amounts=this.state.useScore?this.state.viewData.totalAmounts+this.state.reducePrice:this.state.viewData.totalAmounts
            //         this.navigate('payment/PaymentMethodPage', {
            //             orderNum: data.orderNum,
            //             amounts: this.state.viewData.totalAmounts,//todo 新加的
            //             orderType: this.state.selectExpress ? 0 : 1,
            //             pageType: 0,
            //             tokenCoinToBalance: data.tokenCoinToBalance
            //         });
            //     } else {
            //         Toast.toast(response.msg);
            //     }
            // }).catch(e => {
            //     Toast.toast('' + e);
            // });
        } else {
            // OrderApi.submitOrder({ orderParam: JSON.stringify(params) }).then((response) => {
            //     if (response.ok) {
            //         let data = response.data;
            //         // let amounts=this.state.useScore?this.state.viewData.totalAmounts+this.state.reducePrice:this.state.viewData.totalAmounts
            //         this.navigate('payment/PaymentMethodPage', {
            //             orderNum: data.orderNum,
            //             amounts: this.state.viewData.useScore ? this.state.viewData.totalAmounts - this.state.viewData.reducePrice : this.state.viewData.totalAmounts,
            //             orderType: this.state.selectExpress ? 0 : 1,
            //             pageType: 0,
            //             tokenCoinToBalance: data.tokenCoinToBalance
            //         });
            //     } else {
            //         NativeModules.commModule.toast(response.msg);
            //     }
            // }).catch(e => {
            //     NativeModules.commModule.toast('' + e);
            // });
        }

    };
    jumpToCouponsPage = () => {
        this.navigate('coupons/CouponsPage', {
            fromOrder: 1, productIds: this.state.viewData.list[0].productId,
            orderParam: JSON.stringify(this.params.orderParam), callBack: (data) => {
                let orderParams = this.params.orderParam;
                if (data && data.id) {
                    orderParams.couponId = data.id;
                    // HomeApi.orderCalcDiscountCouponAndUseScore({ orderParam: JSON.stringify(orderParams) }).then(res => {
                    //     if (res.ok) {
                    //         let data = res.data;
                    //         // 积分抵扣计算
                    //         let score = data.dealer.userScore > data.totalScore ? data.totalScore : data.dealer.userScore;
                    //         let viewData = this.state.viewData;
                    //         viewData.score = score;
                    //         //let userScore = data.dealer.userScore;
                    //         viewData.reducePrice = data.userScoreToBalance * score;
                    //         // 当商品可以使用积分 用户积分大于0的时候 显示可以使用积分
                    //         viewData.canUseScore = (data.totalScore > 0 && data.dealer.userScore) ? true : false;
                    //         viewData.totalFreightFee = StringUtils.isNoEmpty(data.totalFreightFee) ? data.totalFreightFee : 0;
                    //         viewData.totalAmounts = data.totalAmounts;
                    //         this.setState({
                    //             viewData: viewData
                    //         });
                    //     } else {
                    //         Toast.toast(res.msg);
                    //     }
                    // });
                } else {
                    console.log(oldViewData);
                    this.setState({ viewData: oldViewData, priceList: oldPriceList });

                }


            }
        });
    };

    componentWillUnmount() {
        // 移除
        if (this.usedCouponsListener) {
            this.usedCouponsListener.remove();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white', justifyContent: 'flex-end'
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

