/**
 * pageType 0 退款详情  1 退货详情   2 换货详情
 * returnProductId
 */
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
import GoodsItem from '../components/GoodsItem';
import applyRefundMessage from '../res/applyRefundMessage.png';
import applyRefundPhone from '../res/applyRefundPhone.png';
import right_arrow from '../res/arrow_right.png';
import exchangeGoodsDetailBg from '../res/exchangeGoodsDetailBg.png';
import DateUtils from '../../../utils/DateUtils';
import BusinessUtils from '../../mine/components/BusinessUtils';
import refusa_icon from '../res/tuikuan_icon_jujue_nor.png';

import OrderApi from '../api/orderApi'

class ExchangeGoodsDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            timeStr: '',
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
        title: ['退款详情', '退货详情', '换货详情'][this.params.pageType],
        show: true// false则隐藏导航
    };

    _bindFunc(){
        this.renderOperationApplyView = this.renderOperationApplyView.bind(this);
        this.renderReturnGoodsView = this.renderReturnGoodsView.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }

    componentDidMount(){
        this.loadPageData();
    }

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderNotice()}
                    {this.renderHeader()}
                    {this.renderOperationApplyView()}
                    {this.renderArefundView()}
                    {this.renderReturnGoodsView()}
                    {this.renderAddress()}
                    {/*{this.renderLogistics()}*/}
                    {this.renderOrder()}
                    {this.state.pageData ?
                        <GoodsItem
                    uri={this.state.pageData.specImg}
                    goodsName={this.state.pageData.productName}
                    salePrice={StringUtils.formatMoneyString(this.state.pageData.price)}
                    category={this.state.pageData.spec}
                    goodsNum={this.state.pageData.num}
                   // onPress={() => this.jumpToProductDetailPage(this.state.pageData.list[this.state.index].productId)}
                    /> : null}
                    {this.renderReason()}
                </ScrollView>
                {/*{this.renderContact()}*/}
            </View>
        );
    }

    /**  退款详情专用  中间一段View */
    renderArefundView = () => {
        if (this.state.pageData === null || this.state.pageData.undefined || this.params.pageType !== 0) {
            return null;// 数据没有请求下来，或不是退款详情页面
        }
        //退款成功的时候页面是和其他状态不一样的
        let isSuccess = this.state.pageData.status === 6 ? true : false;
        return this.renderItems(isSuccess);
    };
    /**  退货详情专用  中间一段View */
    renderReturnGoodsView() {
        if (this.state.pageData === null || this.state.pageData.undefined || this.params.pageType !== 1) {
            return null;// 数据没有请求下来，或不是退款详情页面
        }
        if (this.state.pageData.status === 6){
            return this.renderItems(true);
        } else if (this.state.pageData.status === 3){
           return(
               <View style={{
                   height: 44,
                   flexDirection: 'row',
                   backgroundColor: color.white,
                   alignItems: 'center'
               }}>
                   <UIText value={'拒绝原因:' + this.state.pageData.refusalReason} style={{ color: color.black_222, fontSize: 13 }}/>
               </View>
           )
        }
    }

    renderItems(isSuccess){
        let orderReturnAmounts = this.state.pageData.orderReturnAmounts || {}
        return (
            <View>
                <View style={{
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
                        <UIText value={StringUtils.formatMoneyString(this.state.pageData.totalRefundPrice)}
                        style={{ color: color.red, fontSize: 13, marginLeft: 5 }}/>
                    </View>
                    {
                        isSuccess ? <UIText value={'已退款'} style={{color:color.black_222,fontSize:13}}/> : null
                    }
                </View>
                {
                    isSuccess ? (
                        <View>
                            <View
                                style={{ backgroundColor: color.gray_f7f7, height: 40, justifyContent: 'center', paddingLeft: 15 }}>
                                <UIText value={'退款明细'} style={{ color: color.black_999, fontSize: 13 }}/>
                            </View>
                            <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回银行卡'}
                                            leftTextStyle={{ color: color.black_222, fontSize: 13 }}
                                            rightText={StringUtils.formatMoneyString(orderReturnAmounts.actualAmounts)}
                                            rightTextStyle={{ color: color.black_222, fontSize: 13, marginRight: 5 }}
                                            isArrow={false} isLine={false}/>
                            {this.renderLine()}
                            <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'退回余额账户'}
                                            leftTextStyle={{ color: color.black_222, fontSize: 13 }}
                                            rightText={StringUtils.formatMoneyString(orderReturnAmounts.actualBalance)}
                                            rightTextStyle={{ color: color.black_222, fontSize: 13, marginRight: 5 }}
                                            isArrow={false} isLine={false}/>
                            {this.renderLine()}
                            <UserSingleItem itemHeightStyle={{ height: 44 }} leftText={'1元现金券'}
                                            leftTextStyle={{ color: color.black_222, fontSize: 13 }}
                                            rightText={orderReturnAmounts.actualTokenCoin + '张'}
                                            rightTextStyle={{ color: color.black_222, fontSize: 13, marginRight: 5 }}
                                            isArrow={false} isLine={false}/>
                            {this.renderWideLine()}
                        </View>
                    ) : null
                }
            </View>
        );
    }
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
        let pageData = this.state.pageData;
        if (pageData === null || pageData === undefined){
            return;
        }
        let status = pageData.status;
        if (this.params.payType === 0){
            return;
        } else if (this.params.payType === 1){
            if (status === 1 || status === 3){
                //退货 状态为申请中、申请已拒绝，不显示寄回地址
                return;
            }
        } else if (this.params.payType === 2){

        }
        return (
            <View>
                {
                    this.params.payType === 2 ?
                    <View>
                        <AddressItem
                            name={pageData.receiver}
                            phone={pageData.recevicePhone}
                            address={pageData.receiveAddress}
                        />
                        < UIImage source = { addressLine } style={{width: ScreenUtils.width, height: 3}}/>
                        {this.renderWideLine()}
                    </View> : null
                }
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
                                 name={pageData.returnAddress.receiver}
                                 phone={pageData.returnAddress.recevicePhone}
                                 address={pageData.returnAddress.provinceName +
                                 pageData.returnAddress.cityName +
                                 pageData.returnAddress.areaName +
                                 pageData.returnAddress.address
                                 }
                    />
                </View>
                {this.renderWideLine()}
            </View>

        );
    };
    renderNotice = () => {
        let tip = null;
        let pageData = this.state.pageData;
        if (pageData === undefined || pageData === null){
            return;
        }
        if (this.params.pageType === 0){//退款详情

        } else if (this.params.pageType === 1) {//退货详情

             if (pageData.status === 2){//同意申请
                tip = '商家已同意换货申请，请尽早发货';
            } else if(pageData.status === 8){//超时关闭
                tip = '已撤销退货退款申请，申请已关闭，交易将正常进行，请关注交易';
            }

        } else if (this.params.pageType === 2) {//换货详情

        }
        if (tip) {
            return (
                <View
                    style={{ height: 20, backgroundColor: color.red, justifyContent: 'center', alignItems: 'center' }}>
                    <UIText value={tip} style={{ fontSize: 13, color: color.white }}/>
                </View>
            )
        }else {
            return null;
        }
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
        let pageData = this.state.pageData;
        if (pageData === undefined || pageData === null){
            return null;
        }
        let typeStr = ['退款', '退货', '换货'][this.params.pageType];
        return (
            <View>
                {this.renderLine()}
                <UIText value={typeStr + '原因：' + pageData.returnReason} style={styles.refundReason}/>
                <UIText value={typeStr + '金额：' + StringUtils.formatMoneyString(pageData.totalRefundPrice)}
                        style={styles.refundReason}/>
                <UIText value={typeStr + '说明：' + pageData.remark} style={styles.refundReason}/>
                <UIText value={'凭证图片：'} style={styles.refundReason}/>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingRight: 15 }}>
                    {this.renderCertificateImage()}
                </View>
                <UIText value={'申请时间：' + DateUtils.getFormatDate(pageData.applyTime / 1000)}
                        style={styles.refundReason}/>
                <UIText value={'订单编号：' + pageData.orderNum}
                        style={styles.refundReason}/>
                <UIText value={typeStr + '编号：' + pageData.refundNo}
                        style={styles.refundReason}/>
            </View>
        );
    };

    renderCertificateImage = () => {
        let arr = [];
        let imgList = this.state.pageData.imgList || [];
        for (let i = 0; i < imgList.length; i++) {
            arr.push(
                <UIImage source={{ uri: imgList[i].smallImg }}
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
                    <UIText value={['退款订单', '退货订单', '换货订单'][this.params.pageType]} style={{ color: color.black_999, fontSize: 13 }}/>
                </View>
                {this.renderLine()}
            </View>
        );
    };

    renderHeader = () => {
        let {pageData} = this.state;
        if (pageData === null || pageData === undefined){
            return null;
        }

        let imageCommpent = () => {};
        let titleCommpent = () => {};
        let detialCommpent = () => {};
        let timerCommpent = () => {};
        let textContaner_marginLeft = 15;
        if (this.params.pageType === 0){//退款详情

            let titles = ['商家退款审核中', '*-商家同意退款', '商家拒绝退款', '*-发货中', '*-云仓库发货中', '退款完成', '已关闭', '超时关闭', '商家拒绝退款'];
            titleCommpent = () => {return <UIText value = {titles[pageData.status-1]} style = {styles.header_title}/>};
            if (pageData.status === 3){//拒绝
                textContaner_marginLeft = 10;
                imageCommpent = () => {return <UIImage soucre = {refusa_icon} style = {styles.header_image}/>};
                detialCommpent = () => {return <UIText value = {pageData.refusalReason} style = {styles.header_detail}/>};
            } else if (pageData.status === 6){//已完成
                detialCommpent = () => {return <UIText value = { DateUtils.getFormatDate(pageData.orderReturnAmounts.refundTime / 1000,'yyyy年MM月dd日  hh:mm')} style = {styles.header_detail}/>};
            } else if(pageData.status === 1){//申请中 applyTime	Long	1539250433000
                detialCommpent = () => {return <UIText value = { DateUtils.getFormatDate(pageData.orderReturnAmounts.applyTime / 1000,'yyyy年MM月dd日  hh:mm')} style = {styles.header_detail}/>};
            }
        } else if (this.params.pageType === 1) {//退货详情
            let titles = ['等待商家处理', '请退货给商家', '商家拒绝退货申请', '等待商家确认', '等待商家确认', '退货退款成功', '已关闭', '退货退款超时关闭', , '商家拒绝退货'];
            titleCommpent = () => {return <UIText value = {titles[pageData.status-1]} style = {styles.header_title}/>};
            if (pageData.status === 3 || pageData.status === 9){//拒绝
                textContaner_marginLeft = 10;
                imageCommpent = () => {return <UIImage soucre = {refusa_icon} style = {styles.header_image}/>};
                detialCommpent = () => {return <UIText value = {DateUtils.getFormatDate(pageData.orderReturnAmounts.refuseTime / 1000,'yyyy年MM月dd日  hh:mm')	} style = {styles.header_detail}/>};
            } else if (pageData.status === 6){//已完成
                detialCommpent = () => {return <UIText value = { DateUtils.getFormatDate(pageData.orderReturnAmounts.refundTime / 1000,'yyyy年MM月dd日  hh:mm')} style = {styles.header_detail}/>};
            } else if(pageData.status === 1){//申请中
                detialCommpent = () => {return <UIText value = { DateUtils.getFormatDate(pageData.orderReturnAmounts.applyTime / 1000,'yyyy年MM月dd日  hh:mm')} style = {styles.header_detail}/>};
            }
        } else if (this.params.pageType === 2) {//换货详情

        }

        return (
            <View>
                <View style={{ position: 'absolute', height: 100, width: ScreenUtils.width }}>
                    <UIImage source={exchangeGoodsDetailBg} style={{ height: 100, width: ScreenUtils.width }}/>
                </View>
                <View style={{ height: 100, alignItems: 'center', flexDirection:'row', width: ScreenUtils.width}}>
                    {imageCommpent()}
                    <View style = {{marginLeft: textContaner_marginLeft}}>
                        {titleCommpent()}
                        {detialCommpent()}
                        {timerCommpent()}
                    </View>
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
        this.$loadingShow();
        OrderApi.returnProductLookDetail({returnProductId:this.params.returnProductId}).then((response)=>{
            this.$loadingDismiss()
            let pageData = response.data;
            if (pageData.status === 3 && pageData.expressName && pageData.expressNo) {
                //状态为已拒绝，且有寄出物流的信息，新增加状态 9 -》 表示寄出商品后商家拒绝退款
                pageData.status = 9;
            }
            this.setState({pageData: pageData});
            if (response.data.status === 2 && (this.params.pageType === 1 || this.params.pageType === 2)){//为退货，或换货的详情，状态为同意申请,开始定时器倒计时
                //this.startTimer();
            } else {
                this.stopTimer();
            }
        }).catch(e=>{
            this.stopTimer();
            this.$loadingDismiss()
        });
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
        let typeStr = ['退款', '退货', '换货'][this.params.pageType];
        if (this.state.pageData === undefined || this.state.pageData === null || this.state.pageData.status !== 1){
            return null; //数据未请求下来、不是申请状态
        }
        return(
            <View style = {styles.operationApplyView_container}>
                <View style = {styles.operationApplyView_title}>
                    <UIText value = {'您已成功发起' + typeStr + '申请，请耐心等待商家处理'} style = {{ color: '#222222', fontSize: 15, marginLeft: 15}}/>
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
            OrderApi.revokeApply({returnProductId: this.state.pageData.id}).then(result => {
                this.$loadingDismiss();
                this.$navigateBack('/order/order/MyOrdersDetailPage');
            }).catch(error => {
                this.$loadingDismiss();
                this.$toastShow(error.msg || '操作失败，请重试');
            });
        }else {
            let {orderProductId, returnReason, remark, imgList, exchangePriceId, exchangeSpec, exchangeSpecImg} = this.state.pageData;
            for (let i = 0; i < imgList.length; i++){
                imgList[i].imageThumbUrl = imgList[i].smallImg;
                imgList[i].imageUrl =  imgList[i].originalImg
            }
            this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                pageType: this.params.pageType,
                returnProductId: this.state.pageData.id,
                isEdit: true,
                orderProductId,
                returnReason,
                remark,
                imgList,
                exchangePriceId,
                exchangeSpec,
                exchangeSpecImg
            });

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
            return '';
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

    startTimer(){
        if (this.state.pageData === null){
            return;
        }
        this.stopTimer();
        this.timer = setInterval(() => {
            let timeStr = this.getRemainingTime(this.state.pageData.outTime);
            this.setState({timeStr: timeStr});
            if (timeStr === ''){
                this.loadPageData();
            } else {
                this.stopTimer();
            }
        }, 1000);
    }
    stopTimer(){
        this.timer && clearInterval(this.timer);
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
    },
    header_title: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    header_detail: {
        fontSize: 12,
        color: '#FFFFFF',
        marginTop: 3,
    },
    header_image: {
        height: 35,
        width: 35,
        marginRight: 15,
    }
});

export default ExchangeGoodsDetailPage;
