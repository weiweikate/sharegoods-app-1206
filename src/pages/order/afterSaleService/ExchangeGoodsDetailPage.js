import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import BasePage from '../../../BasePage';
import AddressItem from '../components/AddressItem';
import addressLine from '../res/addressLine.png';
import UserSingleItem from '../components/UserSingleItem';
import { UIText, UIImage } from '../../../components/ui';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
//import GoodsItem from '../components/GoodsItem';
import applyRefundMessage from '../res/applyRefundMessage.png';
import applyRefundPhone from '../res/applyRefundPhone.png';
import right_arrow from '../res/arrow_right.png';
import exchangeGoodsDetailBg from '../res/exchangeGoodsDetailBg.png';
import DateUtils from '../../../utils/DateUtils';
import BusinessUtils from '../../mine/components/BusinessUtils';
import Toast from '../../../utils/bridge';

import OrderApi from '../api/orderApi'

class ExchangeGoodsDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            imageArr: [
                'https://ws4.sinaimg.cn/large/006tNc79gy1fsnh4ez029j3058056myq.jpg',
                // 'https://ws4.sinaimg.cn/large/006tNc79gy1fsnh4ez029j3058056myq.jpg',
                // 'https://ws4.sinaimg.cn/large/006tNc79gy1fsnh4ez029j3058056myq.jpg',
                // 'https://ws4.sinaimg.cn/large/006tNc79gy1fsnh4ez029j3058056myq.jpg',
                // 'https://ws4.sinaimg.cn/large/006tNc79gy1fsnh4ez029j3058056myq.jpg',
            ],
            /*
            * 0:订单异常
            * 1:换货完成
            * 2:待买家收货确认
            * 3:换货中
            * 4:商家已通过
            * */
            viewData: {
                // return_reason:'不想要了',
                // remark:'比较有钱，不要了...',
                // return_amounts:'724',    //(另外暂时作为银行卡)
                // apply_time:1532568808000,
                // outRefundNo:'7802201807260933275286636',
                // return_balance:0,   //余额
                // return_token_coin:0,//代币
                // return_user_score:0,//积分
            },
            pageType: this.params.pageType ? this.params.pageType : 0,
            title: ['订单异常', '换货完成', '待买家收货确认', '换货中', '商家已通过', '退款成功', '售后完成', '售后失败'],
            description1: ['请联系客服', '', '4天12小时32分', '等待商家确认中', '7天退换，请退货给商家', '2018-07-27 11:55:49', '2018-07-27 11:55:49', '2018-07-27 11:55:49'],
            description2: ['', '', '', '', '4天12小时32分', '', '', ''],
            sellerPhone: -1,
            index: this.params.index ? this.params.index : 0,
            pageData: this.params.pageData ? this.params.pageData : {},
            returnProduct: {
                out_time: 1533993685000,
                had_gift_bag: 2,
                return_reason: '不喜欢/不想要了',
                order_product_id: 351,
                return_balance: 0,
                spec_img: 'http://juretest.oss-cn-hangzhou.aliyuncs.com/jure/jure_crm/test/c8425d24-13cd-41fe-9f5c-09f6278f53d4_1533195145027.jpg',
                refund_no: '2179201808102121253455770',
                num: 1,
                apply_time: 1533907285000,
                remark: '是否大额方法',
                type: 3,
                return_token_coin: 0,
                product_name: '旺旺小小酥',
                spec: '44',
                price: 8000,
                return_amounts: 0,
                id: 104,
                return_user_score: 0,
                status: 1
            },
            returnAddres: {
                id: 1,
                receiver: '王小明1',
                recevicePhone: '15257114444',
                provinceCode: 320000,
                cityCode: 320500,
                areaCode: 320504,
                address: '江苏省苏州市金阊区地铁口A口望京C2座5楼',
                createTime: 1531346973000,
                status: 1
            }
        };

        this._bindFunc();

    }

    $navigationBarOptions = {
        title: '换货详情界面',
        show: true// false则隐藏导航
    };

    _bindFunc(){
        this.renderOperationApplyView = this.renderOperationApplyView.bind(this);
    }

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderNotice()}
                    {this.renderHeader()}
                    {this.renderOperationApplyView()}
                    {this.renderSucceedDetail()}
                    {this.renderAddress()}
                    {this.renderLogistics()}
                    {this.renderOrder()}
                    {/*<GoodsItem*/}
                        {/*uri={this.state.pageData.list[this.state.index].uri}*/}
                        {/*goodsName={this.state.pageData.list[this.state.index].goodsName}*/}
                        {/*salePrice={StringUtils.formatMoneyString(this.state.pageData.list[this.state.index].salePrice)}*/}
                        {/*category={this.state.pageData.list[this.state.index].category}*/}
                        {/*goodsNum={this.state.pageData.list[this.state.index].goodsNum}*/}
                        {/*onPress={() => this.jumpToProductDetailPage(this.state.pageData.list[this.state.index].productId)}*/}
                    {/*/>*/}
                    {this.renderReason()}
                </ScrollView>
                {this.renderContact()}
            </View>
        );
    }

    renderSucceedDetail = () => {
        return (
            <View>
                <TouchableOpacity style={{
                    height: 44,
                    backgroundColor: color.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: 15,
                    paddingRight: 15
                }}>
                    <View style={{
                        height: 44,
                        flexDirection: 'row',
                        backgroundColor: color.white,
                        alignItems: 'center'
                    }}>
                        <UIText value={'退款金额:'} style={{ color: color.black_222, fontSize: 13 }}/>
                        <UIText value={StringUtils.formatMoneyString(this.params.pageData.goodsPrice)}
                                style={{ color: color.red, fontSize: 13, marginLeft: 5 }}/>
                    </View>
                    {/*<UIText value={'已退款'} style={{color:color.black_222,fontSize:13}}/>*/}
                </TouchableOpacity>
                <View
                    style={{ backgroundColor: color.gray_f7f7, height: 40, justifyContent: 'center', paddingLeft: 15 }}>
                    <UIText value={'退款明细'} style={{ color: color.black_999, fontSize: 13 }}/>
                </View>
                <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回银行卡'}
                                leftTextStyle={{ color: color.black_222, fontSize: 13 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.return_amounts)}
                                rightTextStyle={{ color: color.black_222, fontSize: 13, marginRight: 5 }}
                                isArrow={false} isLine={false}/>
                {this.renderLine()}
                <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回余额账户'}
                                leftTextStyle={{ color: color.black_222, fontSize: 13 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.return_balance)}
                                rightTextStyle={{ color: color.black_222, fontSize: 13, marginRight: 5 }}
                                isArrow={false} isLine={false}/>
                {this.renderLine()}
                <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回代币账户'}
                                leftTextStyle={{ color: color.black_222, fontSize: 13 }}
                                rightText={this.state.viewData.return_token_coin + '枚'}
                                rightTextStyle={{ color: color.black_222, fontSize: 13, marginRight: 5 }}
                                isArrow={false} isLine={false}/>
                {this.renderLine()}
                <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回积分账户'}
                                leftTextStyle={{ color: color.black_222, fontSize: 13 }}
                                rightText={this.state.viewData.return_user_score + '积分'}
                                rightTextStyle={{ color: color.black_222, fontSize: 13, marginRight: 5 }}
                                isArrow={false} isLine={false}/>
                {this.renderWideLine()}
            </View>
        );
    };

    renderLogistics = () => {
        return (
            <View>
                <TouchableOpacity style={{
                    height: 44,
                    backgroundColor: color.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: 15,
                    paddingRight: 15
                }} onPress={() => this.returnLogists()}>
                    <UIText value={'退货物流'} style={{ color: color.black_222, fontSize: 13 }}/>
                    <View style={{
                        height: 44,
                        flexDirection: 'row',
                        backgroundColor: color.white,
                        alignItems: 'center'
                    }}>
                        <UIText
                            value={StringUtils.isNoEmpty(this.state.returnProduct.express_no) ? this.state.returnProduct.express_no : '请填写寄回物流信息'}
                            style={{
                                color: StringUtils.isEmpty(this.state.returnProduct.express_no) ? color.black_222 : color.gray_c8c,
                                fontSize: 12,
                                marginRight: 15
                            }}/>
                        <UIImage source={right_arrow} style={{ height: 10, width: 7 }}/>
                    </View>
                </TouchableOpacity>
                {/*{this.renderLine()}*/}
                {/*<TouchableOpacity style={{height:44,backgroundColor:color.white,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:15,paddingRight:15}} onPress={()=>this.shopLogists()}>*/}
                {/*<UIText value={'商家物流'} style={{color:color.black_222,fontSize:13}}/>*/}
                {/*<View style={{height:44,flexDirection:'row',backgroundColor:color.white,alignItems:'center'}}>*/}
                {/*<UIText value={'请填写寄回物流信息'} style={{color:color.gray_c8c,fontSize:12,marginRight:15}}/>*/}
                {/*<UIImage source={right_arrow} style={{height:10,width:7}}/>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
            </View>
        );
    };
    renderAddress = () => {
        return (
            <View>
                <AddressItem
                    name={this.state.pageData.receiverName}
                    phone={this.state.pageData.receiverNum}
                    address={this.state.pageData.receiverAddress}
                />
                <UIImage source={addressLine} style={{ width: ScreenUtils.width, height: 3 }}/>
                {this.renderWideLine()}
                <View style={{ flexDirection: 'row', height: 82, alignItems: 'center' }}>
                    <View style={{
                        width: 43,
                        height: 36,
                        backgroundColor: color.red,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 16
                    }}>
                        <UIText value={'寄回\n地址'} style={{ fontSize: 12, color: color.white }}/>
                    </View>
                    <View style={{ backgroundColor: color.gray_EEE, width: 1, height: 40 }}/>
                    <AddressItem height={82}
                                 style={{
                                     flex: 1,
                                     flexDirection: 'row',
                                     justifyContent: 'space-between',
                                     alignItems: 'center',
                                     backgroundColor: color.white
                                 }}
                                 name={this.state.returnAddres.receiver}
                                 phone={this.state.returnAddres.recevicePhone}
                                 address={this.state.returnAddres.address}
                    />
                </View>
                {this.renderWideLine()}
            </View>

        );
    };
    renderNotice = () => {
        return (this.state.pageType !== 4 ? null :
                <View
                    style={{ height: 20, backgroundColor: color.red, justifyContent: 'center', alignItems: 'center' }}>
                    <UIText value={'商家已同意换货申请，请尽快发货'} style={{ fontSize: 13, color: color.white }}/>
                </View>
        );
    };
    renderContact = () => {
        return (
            <View style={{ height: 61, backgroundColor: color.white }}>
                {this.renderLine()}
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        flex: 1,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                    }} onPress={() => this.contactSeller()}>
                        <UIImage source={applyRefundMessage} style={{ width: 25, height: 23, marginBottom: 10 }}/>
                        <View style={{ marginLeft: 10 }}>
                            <UIText value={'联系客服'} style={{ fontSize: 16, color: color.black_222 }}/>
                            <UIText value={'9:00-17:00'} style={{ fontSize: 12, color: color.black_999 }}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: 1, justifyContent: 'center' }}>
                        <View style={{ width: 1, height: 30, backgroundColor: color.gray_EEE }}/>
                    </View>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        flex: 1,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                    }} onPress={() => this.callPhone()}>
                        <UIImage source={applyRefundPhone} style={{ width: 25, height: 23, marginBottom: 10 }}/>
                        <View style={{ marginLeft: 10 }}>
                            <UIText value={'拨打电话'} style={{ fontSize: 16, color: color.black_222 }}/>
                            <UIText value={'9:00-17:00'} style={{ fontSize: 12, color: color.black_999 }}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    renderReason = () => {
        return (
            <View>
                {this.renderLine()}
                <UIText value={'退款原因：' + this.state.viewData.return_reason} style={styles.refundReason}/>
                <UIText value={'退款金额：' + StringUtils.formatMoneyString(this.state.viewData.return_amounts)}
                        style={styles.refundReason}/>
                <UIText value={'退款说明：' + this.state.viewData.remark} style={styles.refundReason}/>
                <UIText value={'凭证图片：'} style={styles.refundReason}/>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingRight: 15 }}>
                    {this.renderCertificateImage()}
                </View>
                <UIText value={'申请时间：' + DateUtils.getFormatDate(this.state.viewData.apply_time / 1000)}
                        style={styles.refundReason}/>
                {/*<UIText value={'更换型号：32G    黑色   全网通'} style={styles.refundReason}/>*/}
                <UIText value={'数量：x' + this.params.pageData.list[this.params.index].goodsNum}
                        style={[styles.refundReason, { marginBottom: 20 }]}/>
            </View>
        );
    };

    renderCertificateImage = () => {
        let arr = [];
        for (let i = 0; i < this.state.imageArr.length; i++) {
            arr.push(
                <UIImage source={{ uri: this.state.imageArr[i] }}
                         style={{ height: 83, width: 83, marginLeft: 15, marginTop: 10 }}/>
            );
        }
        return arr;
    };
    renderOrder = () => {
        return (
            <View>
                <View
                    style={{ backgroundColor: color.gray_f7f7, height: 40, justifyContent: 'center', paddingLeft: 15 }}>
                    <UIText value={'换货订单'} style={{ color: color.black_999, fontSize: 13 }}/>
                </View>
                {this.renderLine()}
            </View>
        );
    };

    renderHeader = () => {
        return (
            <View>
                <View style={{ position: 'absolute', height: 100, width: ScreenUtils.width }}>
                    <UIImage source={exchangeGoodsDetailBg} style={{ height: 100, width: ScreenUtils.width }}/>
                </View>
                <View style={{ height: 100, justifyContent: 'center', marginLeft: 42 }}>
                    <UIText value={this.state.title[this.state.pageType]} style={{ fontSize: 18, color: color.white }}/>
                    <UIText value={this.state.description1[this.state.pageType]}
                            style={{ fontSize: 13, color: color.white }}/>
                    <UIText value={this.state.description2[this.state.pageType]}
                            style={{ fontSize: 12, color: color.white }}/>
                </View>
            </View>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: color.page_background }}/>
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
        Toast.hiddenLoading();
        // OrderApi.findReturnProductById({returnProductId:this.params.pageData.list[this.params.index].returnProductId}).then((response)=>{
        //     Toast.hiddenLoading()
        //     if(response.ok ){
        //         let imageArr=[]
        //         response.data.imgList.map((item, index)=>{
        //             imageArr.push(item.originalImg)
        //         })
        //         this.setState({
        //             imageArr:imageArr,
        //             viewData:{
        //                 return_reason:response.data.returnProduct.return_reason,
        //                 remark:response.data.returnProduct.remark,
        //                 return_amounts:response.data.returnProduct.return_amounts,
        //                 apply_time:response.data.returnProduct.apply_time,
        //                 outRefundNo:response.data.returnAmountsRecord&&response.data.returnAmountsRecord.outRefundNo+'',
        //                 return_balance:response.data.returnProduct.return_balance,   //余额
        //                 return_token_coin:response.data.returnProduct.return_token_coin,//代币
        //                 return_user_score:response.data.returnProduct.return_user_score,//积分
        //             },
        //             sellerPhone:response.data.returnAddress.recevicePhone,
        //             returnProduct:response.data.returnProduct,
        //             returnAddres:response.data.returnAddress,
        //         })
        //     } else {
        //         NativeModules.commModule.toast(response.msg)
        //     }
        // }).catch(e=>{
        //     Toast.hiddenLoading()
        // });
    }

    callPhone = () => {
        if (this.state.sellerPhone === -1) {
            NativeModules.commModule.toast('电话号码不存在');
        } else {
            BusinessUtils.callPhone(this.state.sellerPhone);
        }
    };
    contactSeller = () => {
        //QYChatUtil.qiYUChat()
    };
    jumpToProductDetailPage = (productId) => {
        this.navigate('product/ProductDetailPage', { productId: productId });
    };
    returnLogists = () => {
        if (StringUtils.isEmpty(this.state.returnProduct.express_no)) {
            this.navigate('order/logistics/LogisticsInformationPage', {
                pageData: this.state.pageData,
                index: this.state.index,
                returnProduct: this.state.returnProduct,
                returnAddres: this.state.returnAddres,
                callBack: this.loadPageData()
            });
        } else {
            this.navigate('order/logistics/LogisticsDetailsPage', {
                orderId: this.state.pageData.orderId,
                expressNo: this.state.pageData.expressNo
            });
        }
    };

    /*** huchao */

    renderOperationApplyView() {
        return(
            <View style = {styles.operationApplyView_container}>
                <View style = {styles.operationApplyView_title}>
                <UIText value = {'您已成功发起退款申请，请耐心等待商家处理'} style = {{ color: '#222222', fontSize: 15, marginLeft: 15}}/>
                </View>
                <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <TouchableOpacity onPress = {() => {this.onPressOperationApply(true)}} style ={[styles.borderButton, {borderColor: '#666666'}]}>
                        <UIText value = {'撤销申请'} style = {{fontSize: 16, color: '#666666'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {this.onPressOperationApply(false)}} style ={styles.borderButton}>
                        <UIText value = {'编辑申请'} style = {{fontSize: 16, color: '#D51243'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    /**
     * 撤销、编辑申请
     * @param cancel true -》撤销 、false -》编辑申请
     */
    onPressOperationApply(cancel){
        if (cancel){
            this.$loadingShow();
            OrderApi.revokeApply({}).then(result => {
                this.$loadingDismiss();
                this.$navigateBack('/order/order/MyOrdersDetailPage');
            }).catch(error => {
                this.$loadingDismiss();
                this.$toastShow(error.msg || '操作失败，请重试');
            });
        }else {

        }
    }
    /**
     * 获取剩余时间的字符串
     * @param out_time 失效时间 number
     * return 如果当前时间大于 out_time 返回 null
     */
    getRemainingTime(out_time){
        let timestamp = Date.parse(new Date()) / 1000;
        out_time = out_time / 1000;

        if (timestamp >= out_time){
            return null;
        }

        let remainingTime = timestamp - out_time;
        let s = remainingTime % 60;
        remainingTime = (remainingTime - s) / 60;
        let m = remainingTime % 60;
        remainingTime = (remainingTime - m) / 60;
        let H = remainingTime % 24;
        remainingTime = (remainingTime - H) / 24;
        let d = remainingTime;

        return '剩余' + d + '天' + H + '小时' + m + '分'
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: color.white,
        justifyContent: 'flex-end'
    },
    refundReason: {
        color: color.black_999, fontSize: 13, marginLeft: 17, marginTop: 10
    },
    addressStyle: {},
    operationApplyView_container: {
        backgroundColor: 'white',
        height: 110,
    },
    operationApplyView_title: {
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        justifyContent: 'center',
    },
    borderButton: {
        borderWidth: 1,
        borderColor: '#D51243',
        borderRadius: 5,
        height: 30,
        width: 83,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ExchangeGoodsDetailPage;
