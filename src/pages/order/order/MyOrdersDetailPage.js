import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText, UIImage
} from '../../../components/ui';
import { RefreshList } from '../../../components/ui';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import buyerHasPay from '../res/buyerHasPay.png';
import car from '../res/car.png';
import arrow_right from '../res/arrow_right.png';
import position from '../res/position.png';
import GoodsDetailItem from '../components/GoodsDetailItem';
import UserSingleItem from '../components/UserSingleItem';
import CommonTwoChoiceModal from '../components/CommonTwoChoiceModal';
import SingleSelectionModal from '../components/BottomSingleSelectModal';
import ShowMessageModal from '../components/ShowMessageModal';
import productDetailHome from '../res/productDetailHome.png';
import productDetailMessage from '../res/productDetailMessage.png';
import constants from '../../../constants/constants';
import DateUtils from '../../../utils/DateUtils';
import Toast from '../../../utils/bridge';
import productDetailImg from '../res/productDetailImg.png';
import GoodsItem from '../components/GoodsItem';

class MyOrdersDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isShowReceiveGoodsModal: false,
            isShowDeleteOrderModal: false,
            isShowSingleSelctionModal: false,
            isShowShowMessageModal: false,
            orderId: this.props.navigation.state.params.orderId,
            expressNo: '',
            viewData: {
                expressNo:'',
                orderId:1235,
                list:[
                    {
                        id:1,
                        productId:1,
                        orderId:1,
                        uri:'https://ws2.sinaimg.cn/large/006tNc79gy1fsvlm591zyj30om056dl8.jpg',
                        goodsName:'CHEERIOBAN 慵懒随意春装2018新款女毛呢格纹编制流苏小香风外套',
                        salePrice:'150',
                        category:'通勤通勤: 复古衣长: 中长款袖长: 长袖',
                        goodsNum:'1',
                        returnProductId:1,
                        afterSaleService:[
                            {
                                id:0,
                                operation:'退款',
                                isRed:false,
                            },{
                                id:1,
                                operation:'退换',
                                isRed:false,
                            },{
                                id:2,
                                operation:'退款中',
                                isRed:false,
                            },{
                                id:3,
                                operation:'退换中',
                                isRed:false,
                            },
                            // {
                            //     id:4,
                            //     operation:'售后完成',
                            //     isRed:true,
                            // },{
                            //     id:5,
                            //     operation:'售后失败',
                            //     isRed:true,
                            // },
                        ],
                    },
                ],
                receiverName:'赵信',
                receiverNum:'18254569878',
                receiverAddress:'浙江省杭州市萧山区宁围镇鸿宁路望京商务C2-502',
                provinceString:'浙江省',
                cityString:'金华市',
                areaString:'义乌市',
                goodsPrice:5292,//商品价格(detail.totalPrice-detail.freightPrice)
                freightPrice:5092,//运费（快递）
                userScore:0,//积分抵扣
                totalPrice:5292,//订单总价
                orderTotalPrice:5292,//需付款
                orderNum:2018070250371039050793800,//订单编号
                createTime:1530499145000,//创建时间
                sysPayTime:1530499145000,//平台付款时间
                payTime:1530499145000,//三方付款时间
                outTradeNo:2018070250371039050793800,//三方交易号
                sendTime:1530499145000,//发货时间
                finishTime:1530499145000,//成交时间
                autoConfirmTime:1533669382000,//自动确认时间
                pickedUp:2,
            },
            //todo 这里的初始化仅仅为了减少判空处理的代码，后面会删除
            pageState: 1,
            pageStateString: constants.pageStateString[1],
            menu: {}
        };
    }

    $navigationBarOptions = {
        title:'订单详情',
        show: true// false则隐藏导航
    };
    $getPageStateOptions = () => {
        return {
            loadingState: 'success',
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };
    //**********************************ViewPart******************************************
    renderState = () => {
        return (
            <View>
                <ImageBackground style={styles.redRectangle} source={productDetailImg}>
                    <UIImage source={buyerHasPay} style={{ height: 25, width: 25, marginTop: 22 }}/>
                    <View style={{ marginTop: 22 }}>
                        <UIText value={this.state.pageStateString.buyState} style={{
                            color: color.white,
                            fontSize: 18,
                            marginLeft: 10,
                            marginTop: this.state.pageStateString.moreDetail === '' ? 7 : 0
                        }}/>
                        <UIText value={this.state.pageStateString.moreDetail}
                                style={{ color: color.white, fontSize: 13, marginLeft: 10 }}/>
                    </View>
                </ImageBackground>
                <View style={styles.whiteRectangle}>
                    <View style={{ flexDirection: 'row' }}>
                        <UIImage source={car} style={{ height: 19, width: 19, marginLeft: 21, marginTop: 7 }}/>
                        <View>
                            <UIText value={this.state.pageStateString.sellerState} style={{
                                color: color.black_222,
                                fontSize: 18,
                                marginLeft: 10,
                                marginTop: this.state.pageStateString.sellerTime === '' ? 2 : -7,
                                marginRight: 46
                            }}/>
                            <UIText value={this.state.pageStateString.sellerTime}
                                    style={{ color: color.black_999, fontSize: 13, marginLeft: 10, marginRight: 46 }}/>
                        </View>
                    </View>
                    <UIImage source={arrow_right} style={{ height: 19, width: 19, marginRight: 11 }}
                             resizeMode={'contain'}/>
                </View>
            </View>

        );
    };
    _render = () => {
        return (
            <View style={styles.container}>
                <RefreshList
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFootder}
                    data={this.state.orderType === 3 || this.state.orderType === 98 ? this.state.orderProductPrices : this.state.viewData.list}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据！'}
                />
            </View>
        );
    };
    renderItem = ({ item, index }) => {
        if (this.state.orderType === 3 || this.state.orderType === 98) {
            return (
                <GoodsItem
                    uri={item.specImg}
                    goodsName={item.productName}
                    salePrice={StringUtils.formatMoneyString(item.originalPrice)}
                    category={item.spec}
                    goodsNum={'X' + 1}
                    onPress={() => this.clickItem(index, item)}
                />
            );
        } else {
            return (
                <TouchableOpacity>
                    <GoodsDetailItem
                        uri={item.uri}
                        goodsName={item.goodsName}
                        salePrice={'￥' + StringUtils.formatMoneyString(item.salePrice, false)}
                        category={item.category}
                        goodsNum={'X' + item.goodsNum}
                        clickItem={() => {
                            this.clickItem(index, item);
                        }}
                        afterSaleService={item.afterSaleService}
                        afterSaleServiceClick={(menu) => this.afterSaleServiceClick(menu, index)}
                    />
                </TouchableOpacity>
            );
        }

    };
    renderHeader = () => {
        return (
            <View>
                {this.renderState()}
                {this.state.pageStateString.disNextView ? this.renderAddress() : null}
            </View>
        );
    };
    renderFootder = () => {
        return (
            <View style={{ backgroundColor: color.white }}>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'商品总价'}
                                leftTextStyle={{ color: color.black_999 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.goodsPrice)}
                                rightTextStyle={{ color: color.black_999 }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'运费（快递）'}
                                leftTextStyle={{ color: color.black_999 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.freightPrice)}
                                rightTextStyle={{ color: color.black_999 }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 25 }} leftText={'积分抵扣'}
                                leftTextStyle={{ color: color.black_999 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.userScore)}
                                rightTextStyle={{ color: color.black_999 }} isArrow={false}
                                isLine={false}/>
                <UserSingleItem itemHeightStyle={{ height: 35 }} leftText={'订单总价'}
                                leftTextStyle={{ color: color.black_222, fontSize: 15 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.totalPrice)}
                                rightTextStyle={{ color: color.black_222, fontSize: 15 }} isArrow={false}
                                isLine={false}/>
                {this.renderLine()}
                <UserSingleItem itemHeightStyle={{ height: 55 }} leftText={'实付款'}
                                leftTextStyle={{ color: color.black_222, fontSize: 15 }}
                                rightText={StringUtils.formatMoneyString(this.state.viewData.orderTotalPrice)}
                                rightTextStyle={{ color: color.red, fontSize: 15 }} isArrow={false}
                                isLine={false}/>
                {this.renderWideLine()}
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <UIText value={'订单编号：' + this.state.viewData.orderNum}
                            style={{ color: color.black_999, fontSize: 13, marginLeft: 16, marginTop: 10 }}/>
                    <TouchableOpacity style={{
                        borderWidth: 1,
                        borderColor: color.gray_DDD,
                        marginRight: 10,
                        justifyContent: 'center',
                        height: 22,
                        width: 55,
                        marginTop: 10
                    }} onPress={() => this.copyOrderNumToClipboard()}>
                        <Text style={{ paddingLeft: 10, paddingRight: 10 }}>复制</Text>
                    </TouchableOpacity>
                </View>
                <UIText value={'创建时间：' + DateUtils.getFormatDate(this.state.viewData.createTime / 1000)}
                        style={{ color: color.black_999, fontSize: 13, marginLeft: 16, marginTop: 10 }}/>
                {StringUtils.isEmpty(this.state.viewData.finishTime) ? null :
                    <UIText value={'平台付款时间：' + DateUtils.getFormatDate(this.state.viewData.sysPayTime / 1000)}
                            style={{ color: color.black_999, fontSize: 13, marginLeft: 16, marginTop: 10 }}/>}
                {StringUtils.isEmpty(this.state.viewData.finishTime) ? null :
                    <UIText value={'三方付款时间：' + DateUtils.getFormatDate(this.state.viewData.payTime / 1000)}
                            style={{ color: color.black_999, fontSize: 13, marginLeft: 16, marginTop: 10 }}/>}
                {StringUtils.isEmpty(this.state.viewData.finishTime) ? null :
                    <UIText value={'支付宝交易号：' + this.state.viewData.outTradeNo} style={{
                        color: color.black_999,
                        fontSize: 13,
                        marginLeft: 16,
                        marginTop: 10,
                        marginBottom: 10
                    }}/>}
                {StringUtils.isEmpty(this.state.viewData.finishTime) ? null :
                    <UIText value={'发货时间：' + DateUtils.getFormatDate(this.state.viewData.sendTime / 1000)} style={{
                        color: color.black_999,
                        fontSize: 13,
                        marginLeft: 16,
                        marginTop: 10,
                        marginBottom: 10
                    }}/>}
                {StringUtils.isEmpty(this.state.viewData.finishTime) ? null :
                    <UIText value={'成交时间：' + DateUtils.getFormatDate(this.state.viewData.finishTime / 1000)} style={{
                        color: color.black_999,
                        fontSize: 13,
                        marginLeft: 16,
                        marginTop: 10,
                        marginBottom: 10
                    }}/>}
                {this.renderWideLine()}
                <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {this.renderMenu()}
                </View>
            </View>
        );
    };
    renderMenu = () => {
        let nameArr = this.state.pageStateString.menu;
        let itemArr = [];
        for (let i = 0; i < nameArr.length; i++) {
            itemArr.push(
                <TouchableOpacity key={i} style={{
                    borderWidth: 1,
                    borderColor: nameArr[i].isRed ? color.red : color.gray_DDD,
                    height: 30,
                    borderRadius: 10,
                    marginRight: 15,
                    justifyContent: 'center',
                    paddingLeft: 20,
                    paddingRight: 20
                }} onPress={() => {
                    this.operationMenuClick(nameArr[i]);
                }}>
                    <Text style={{ color: nameArr[i].isRed ? color.red : color.gray_666 }}>{nameArr[i].operation}</Text>
                </TouchableOpacity>
            );
        }
        return itemArr;
    };
    renderModal = () => {
        return (
            <View>
                <ShowMessageModal
                    isShow={this.state.isShowShowMessageModal}
                    detail={[
                        { icon: productDetailMessage, title: '消息' },
                        { icon: productDetailHome, title: '首页' }
                    ]}
                    clickSelect={(index) => {
                        switch (index) {
                            case 0:
                                this.navigate('message/MessageCenterPage');
                                break;
                            case 1:
                                // this.reset(RouterPaths.Tab,{pageType:'MinePage'})
                                break;
                        }
                        this.setState({ isShowShowMessageModal: false });
                    }}
                    closeWindow={() => this.setState({ isShowShowMessageModal: false })}
                />

                <CommonTwoChoiceModal
                    isShow={this.state.isShowDeleteOrderModal}
                    detail={{ title: '删除订单', context: '确定删除此订单吗', no: '取消', yes: '确认' }}
                    closeWindow={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                        if (this.state.menu.id === 7) {
                            Toast.hiddenLoading();
                            // OrderApi.deleteOrder({orderId:this.state.orderId}).then((response)=>{
                            //     Toast.hiddenLoading()
                            //     if(response.ok ){
                            //         NativeModules.commModule.toast('订单已删除')
                            //         this.getDataFromNetwork()
                            //     } else {
                            //         NativeModules.commModule.toast(response.msg)
                            //     }
                            // }).catch(e=>{
                            //     Toast.hiddenLoading()
                            // });

                        } else if (this.state.menu.id === 9) {
                            // Toast.showLoading()
                            // OrderApi.deleteClosedOrder({orderId:this.state.orderId}).then((response)=>{
                            //     Toast.hiddenLoading()
                            //     if(response.ok && typeof response.data ==== 'object'){
                            //         NativeModules.commModule.toast('订单已删除')
                            //         this.getDataFromNetwork()
                            //     } else {
                            //         NativeModules.commModule.toast(response.msg)
                            //     }
                            // }).catch(e=>{
                            //     Toast.hiddenLoading()
                            // });
                        } else {
                            NativeModules.commModule.toast('状态值异常，暂停操作');
                        }
                    }}
                    no={() => {
                        this.setState({ isShowDeleteOrderModal: false });
                    }}
                />
                <CommonTwoChoiceModal
                    isShow={this.state.isShowReceiveGoodsModal}
                    detail={{ title: '确认收货', context: '是否确认收货?', no: '取消', yes: '确认' }}
                    close={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                    }}
                    yes={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                        // Toast.showLoading()
                        // OrderApi.confirmReceipt({orderId:this.state.orderId}).then((response)=>{
                        //     Toast.hiddenLoading()
                        //     if(response.ok ){
                        //         NativeModules.commModule.toast('确认收货成功')
                        //         this.getDataFromNetwork()
                        //     } else {
                        //         NativeModules.commModule.toast(response.msg)
                        //     }
                        // }).catch(e=>{
                        //     Toast.hiddenLoading()
                        // });
                    }}
                    no={() => {
                        this.setState({ isShowReceiveGoodsModal: false });
                    }}
                />
                <SingleSelectionModal
                    isShow={this.state.isShowSingleSelctionModal}
                    detail={['我不想买了', '信息填写错误，重新拍', '其他原因']}
                    closeWindow={() => {
                        this.setState({ isShowSingleSelctionModal: false });
                    }}
                    commit={(index) => {
                        this.setState({ isShowSingleSelctionModal: false });
                        // Toast.showLoading()
                        // OrderApi.cancelOrder({buyerRemark:['我不想买了','信息填写错误，重新拍','其他原因'][index],orderNum:this.state.viewData.orderNum}).then((response)=>{
                        //     Toast.hiddenLoading()
                        //     if(response.ok ){
                        //         NativeModules.commModule.toast('订单已取消')
                        //         this.getDataFromNetwork()
                        //     } else {
                        //         NativeModules.commModule.toast(response.msg)
                        //     }
                        // }).catch(e=>{
                        //     Toast.hiddenLoading()
                        // });
                    }}
                />
            </View>

        );
    };

    renderAddress = () => {
        return (
            <View style={{
                height: 83,
                backgroundColor: color.white,
                flexDirection: 'row',
                marginTop: 20,
                marginBottom: 10,
                alignItems: 'center'
            }}>
                <UIImage source={position} style={{ height: 20, width: 20, marginLeft: 20 }}/>
                <View style={{ flex: 1, marginLeft: 15, marginRight: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <UIText value={'收货人：' + this.state.viewData.receiverName}
                                style={{ color: color.black_999, fontSize: 15 }}/>
                        <UIText value={this.state.viewData.receiverNum}
                                style={{ color: color.black_999, fontSize: 15 }}/>
                    </View>
                    <UIText value={
                        '收货地址：' + this.state.viewData.provinceString
                        + this.state.viewData.cityString
                        + this.state.viewData.areaString
                        + this.state.viewData.receiverAddress
                    }
                            style={{ color: color.black_999, fontSize: 15 }}/>
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
    //28:45:45后自动取消订单
    startCutDownTime = (overtimeClosedTime) => {
        let autoConfirmTime = Math.round((overtimeClosedTime - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            return;
        }
        this.CountdownUtil.settimer(time => {
            let pageStateString = this.state.pageStateString;
            pageStateString.moreDetail = time.hours + ':' + time.min + ':' + time.sec + '后自动取消订单';
            this.setState({ pageStateString: pageStateString });
            if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
                this.setState({
                    pageStateString: constants.pageStateString[10]
                });
                if (this.params.callBack) {
                    this.params.callBack();
                }
                this.loadPageData();
            }
        }, autoConfirmTime);
    };
    //06天18:24:45后自动确认收货
    startCutDownTime2 = (autoConfirmTime2) => {
        let autoConfirmTime = Math.round((autoConfirmTime2 - new Date().valueOf()) / 1000);
        if (autoConfirmTime < 0) {
            return;
        }
        this.CountdownUtil.settimer(time => {
            let pageStateString = this.state.pageStateString;
            pageStateString.moreDetail = time.days + '天' + time.hours + ':' + time.min + ':' + time.sec + '后自动确认收货';
            this.setState({ pageStateString: pageStateString });
            if (time.hours === undefined && time.min === undefined && time.sec === undefined) {
                this.setState({
                    pageStateString: constants.pageStateString[5]
                });
                if (this.params.callBack) {
                    this.params.callBack();
                }
                this.loadPageData();
            }
        }, autoConfirmTime);
    };
    //**********************************BusinessPart******************************************
    getAfterSaleService = (data, index) => {
        //售后状态
        let afterSaleService = [];
        if (StringUtils.isEmpty(data.list[index].returnProductStatus)) {
            if (data.status === 2 || data.status === 4) {
                afterSaleService.push({
                    id: 0,
                    operation: '退款',
                    isRed: false
                });
            }
            if (data.status === 3) {
                afterSaleService.push({
                    id: 1,
                    operation: '退换',
                    isRed: false
                });
            }
            if (data.status === 5) {
                // 确认收货的状态的订单售后截止时间和当前时间比
                let now = new Date().getTime();
                if (data.list[index].finishTime - now > 0) {
                    afterSaleService.push({
                        id: 1,
                        operation: '退换',
                        isRed: false
                    });
                }
            }
        } else {
            if (data.list[index].status === 4) {
                afterSaleService.push({
                    id: 2,
                    operation: '退款中',
                    isRed: false
                });
            }
            if (data.list[index].status === 5 || data.list[index].status === 6) {
                afterSaleService.push({
                    id: 3,
                    operation: '退换中',
                    isRed: false
                });
            }
            if (data.list[index].status === 8 && data.list[index].returnType) {
                afterSaleService.push({
                    id: 4,
                    operation: '售后完成',
                    isRed: true
                });
            }
        }
        return afterSaleService;
    };
    // loadPageData(){
    //     Toast.showLoading();
    //     OrderApi.getOrderDetail({orderId:this.state.orderId}).then((response)=>{
    //         Toast.hiddenLoading()
    //         if(response.ok ){
    //             let data=response.data
    //             let arr=[],lowerarr=[];
    //             data.list.map((item,index)=>{
    //                 arr.push({
    //                     id:item.id,
    //                     orderId:item.orderId,
    //                     productId:item.productId,
    //                     uri:item.imgUrl,
    //                     goodsName:item.productName,
    //                     salePrice:StringUtils.isNoEmpty(item.price)?item.price:0,
    //                     category:item.spec,
    //                     goodsNum:item.num,
    //                     returnProductId:item.returnProductId,
    //                     afterSaleService:this.getAfterSaleService(data,index),
    //                 })
    //             })
    //              if(data.orderType===3||data.orderType===98){
    //                  lowerarr=data.list[0].orderProductPrices
    //              }
    //             let pageStateString=constants.pageStateString[parseInt(data.status)]
    //             /*
    //              * operationMenuCheckList
    //              * 取消订单                 ->  1
    //              * 去支付                   ->  2
    //              * 继续支付                 ->  3
    //              * 订单退款                 ->  4
    //              * 查看物流                 ->  5
    //              * 确认收货                 ->  6
    //              * 删除订单(已完成)          ->  7
    //              * 再次购买                 ->  8
    //              * 删除订单(已关闭(取消))    ->  9
    //              * */
    //             switch (parseInt(data.status)){
    //                 // case 0:
    //                 //     break
    //                 //等待买家付款
    //                 case 1:
    //                     this.startCutDownTime(response.data.overtimeClosedTime)
    //                     pageStateString.sellerState='收货人：'+data.receiver+'                   '+data.recevicePhone
    //                     pageStateString.sellerTime='收货地址：'+data.province+data.city+data.area+data.address
    //                     if (StringUtils.isEmpty(data.outTradeNo)){
    //                         pageStateString.menu=[
    //                             {
    //                                 id:1,
    //                                 operation:'取消订单',
    //                                 isRed:false,
    //                             },{
    //                                 id:2,
    //                                 operation:'去支付',
    //                                 isRed:true,
    //                             },
    //                         ]
    //                     }else{
    //                         pageStateString.menu=[
    //                             {
    //                                 id:1,
    //                                 operation:'取消订单',
    //                                 isRed:false,
    //                             },{
    //                                 id:3,
    //                                 operation:'继续支付',
    //                                 isRed:true,
    //                             },
    //                         ]
    //                     }
    //                     break
    //                 //买家已付款
    //                 case 2:
    //                     //nothing need update Extraly
    //                     break
    //                 //卖家已发货
    //                 case 3:
    //                     this.startCutDownTime2(response.data.autoConfirmTime)
    //                     pageStateString.sellerTime='收货地址：'+data.province+data.city+data.area+data.address
    //                     break
    //                 //等待买家自提
    //                 case 4:
    //                     pageStateString.sellerState='自提点：浙江省杭州市萧山区宁围镇鸿宁路望京商务C2-502'
    //                     break
    //                 //订单已完成
    //                 case 5:
    //                     pageStateString.sellerTime='收货地址：'+data.province+data.city+data.area+data.address
    //                     break
    //                 case 6:
    //                     //no UI(can't enter this page)
    //                     break
    //                 case 7:
    //                     //no UI(can't enter this page)
    //                     break
    //                 case 8:
    //                     pageStateString.sellerState='收货人：'+data.receiver+'                   '+data.recevicePhone
    //                     pageStateString.sellerTime='收货地址：'+data.province+data.city+data.area+data.address
    //                     pageStateString.moreDetail=data.buyerRemark
    //                     //no UI(can't enter this page)
    //                     break
    //                 case 9:
    //                     //no UI(can't enter this page)
    //                     break
    //                 case 10:
    //                     //no UI(can't enter this page)
    //                     break
    //             }
    //             this.setState({
    //                 viewData:{
    //                     expressNo:data.expressNo,
    //                     orderId:this.params.orderId,
    //                     list:arr,
    //                     receiverName:data.receiver,
    //                     receiverNum:data.recevicePhone,
    //                     receiverAddress:data.address,
    //                     provinceString:data.province,
    //                     cityString:data.city,
    //                     areaString:data.area,
    //                     goodsPrice:data.totalPrice-data.freightPrice,//商品价格(detail.totalPrice-detail.freightPrice)
    //                     freightPrice:data.freightPrice,//运费（快递）
    //                     userScore:data.userScore,//积分抵扣
    //                     totalPrice:data.totalPrice,//订单总价
    //                     orderTotalPrice:data.orderTotalPrice,//需付款
    //                     orderNum:data.orderNum,//订单编号
    //                     createTime:data.createTime,//创建时间
    //                     sysPayTime:data.sysPayTime,//平台付款时间
    //                     payTime:data.payTime,//三方付款时间
    //                     outTradeNo:data.outTradeNo,//三方交易号
    //                     sendTime:data.sendTime,//发货时间
    //                     finishTime:'',//成交时间
    //                     autoConfirmTime:data.autoConfirmTime,//自动确认时间
    //                     pickedUp:data.pickedUp,//
    //                 },
    //                 pageStateString:pageStateString,
    //                 expressNo:data.expressNo,
    //                 pageState:data.pageState,
    //                 activityId:data.activityId,
    //                 orderType:data.orderType,
    //                 orderProductPrices:data.list[0].orderProductPrices
    //             })
    //         } else {
    //             NativeModules.commModule.toast(response.msg)
    //         }
    //     }).catch(e=>{
    //         Toast.hiddenLoading()
    //     });
    // }
    clickItem = (index, item) => {
        switch (this.state.orderType) {
            case 1://秒杀
                this.navigate('product/ProductDetailPage', {
                    productId: this.state.viewData.list[index].productId,
                    activityCode: item.id,
                    ids: this.state.activityId
                });

                break;
            case 2://降价拍
                this.navigate('product/ProductDetailPage', {
                    productId: this.state.viewData.list[index].productId,
                    id: item.id,
                    ids: this.state.activityId
                });

                break;

            case 3://优惠套餐
                this.navigate('home/CouponsComboDetailPage', { id: this.state.viewData.list[index].productId });
                break;
            case 4:

                break;

            case 98://礼包
                this.navigate('home/GiftProductDetailPage', { giftBagId: this.state.viewData.list[index].productId });
                break;

            case 99://普通商品
                this.navigate('product/ProductDetailPage', { productId: this.state.viewData.list[index].productId });
                break;
        }
    };
    operationMenuClick = (menu) => {
        /*
         * 取消订单                 ->  1
         * 去支付                   ->  2
         * 继续支付                 ->  3
         * 订单退款                 ->  4
         * 查看物流                 ->  5
         * 确认收货                 ->  6
         * 删除订单(已完成)          ->  7
         * 再次购买                 ->  8
         * 删除订单(已关闭(取消))    ->  9
         * */
        this.setState({ menu: menu });
        switch (menu.id) {
            case 1:
                this.setState({ isShowSingleSelctionModal: true });
                break;
            case 2:
                this.$navigate('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData.orderNum,
                    amounts: this.state.viewData.totalPrice + this.state.viewData.freightPrice,
                    orderType: this.state.viewData.pickedUp - 1
                });
                break;
            case 3:
                this.$navigate('payment/PaymentMethodPage', {
                    orderNum: this.state.viewData.orderNum,
                    amounts: this.state.viewData.goodsPrice
                });
                break;
            case 4:
                // this.navigate(RouterPaths.AfterSaleServicePage,{
                //     pageType:0,
                //     pageData:this.state.viewData,
                //     index:0,
                // })
                NativeModules.commModule.toast('目前仅支持单个商品退款');
                break;
            case 5:
                this.$navigate('order/logistics/LogisticsDetailsPage', {
                    orderNum: this.state.viewData.orderNum,
                    orderId: this.state.orderId,
                    expressNo: this.state.expressNo
                });
                break;
            case 6:
                this.setState({ isShowReceiveGoodsModal: true });
                break;
            case 7:
                this.setState({ isShowDeleteOrderModal: true });
                break;
            case 8:
                // Toast.showLoading()
                // OrderApi.orderOneMore({orderId:this.state.viewData.list[0].orderId}).then((response)=>{
                //     if(response.ok ){
                //         let cartData=[]
                //         response.data.map((item, index)=>{
                //             cartData.push({sareSpecId:item.id,productNumber:item.num})
                //         })
                //         OrderApi.shoppingCartFormCookieToSession({jsonString: JSON.stringify(cartData)}).then((response)=>{
                //             Toast.hiddenLoading()
                //             if(response.ok){
                //                 this.navigate('shopCart/CartPage',{isInnerPage:true})
                //             } else {
                //                 NativeModules.commModule.toast(response.msg)
                //             }
                //         }).catch(e=>{
                //             NativeModules.commModule.toast(e)
                //         });
                //     } else {
                //         NativeModules.commModule.toast(response.msg)
                //     }
                // }).catch(e=>{
                //     NativeModules.commModule.toast(e)
                // });
                break;
        }
    };
    copyOrderNumToClipboard = () => {
        StringUtils.clipboardSetString(this.state.viewData.orderNum);
        NativeModules.commModule.toast('订单号已经复制到剪切板');
    };
    afterSaleServiceClick = (menu, index) => {
        console.warn(menu);
        // afterSaleService:[
        //             {
        //                 id:0,
        //                 operation:'退款',
        //                 isRed:false,
        //             },{
        //                 id:1,
        //                 operation:'退换',
        //                 isRed:false,
        //             },{
        //                 id:2,
        //                 operation:'退款中',
        //                 isRed:false,
        //             },{
        //                 id:3,
        //                 operation:'退换中',
        //                 isRed:false,
        //             },{
        //                 id:4,
        //                 operation:'售后完成',
        //                 isRed:true,
        //             },{
        //                 id:5,
        //                 operation:'售后失败',
        //                 isRed:true,
        //             },
        //         ],
        switch (menu.id) {
            case 0:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 0,
                    pageData: this.state.viewData,
                    index: index,
                    refleshOrderDetail: () => this.loadPageData()
                });
                break;
            case 1:
                this.$navigate('order/afterSaleService/AfterSaleServiceHomePage', {
                    pageData: this.state.viewData,
                    index: index
                });
                break;
            case 2:
                this.$navigate('order/afterSaleService/ApplyRefundNextPage', {
                    pageType: 0,
                    pageData: this.state.viewData,
                    index: index
                });
                break;
            case 3:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 3,
                    pageData: this.state.viewData,
                    index: index
                });
                break;
            case 4:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 6,
                    pageData: this.state.viewData,
                    index: index
                });
                break;
            case 5:
                this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                    pageType: 7,
                    pageData: this.state.viewData,
                    index: index
                });
                break;
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.page_background
    }, redRectangle: {
        width: ScreenUtils.width,
        height: 100,
        backgroundColor: color.red,
        flexDirection: 'row',
        paddingLeft: 22,
        position: 'absolute',
    }, whiteRectangle: {
        height: 81,
        marginTop: 69,
        backgroundColor: color.white,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'space-between',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default MyOrdersDetailPage;
