/**
 * Created by xiangchen on 2018/7/24.
 */
import React from 'react';
import {
     StyleSheet, View, Text, Image,  DeviceEventEmitter,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'
import {color} from "../../constants/Theme";
import ScreenUtils from '../../utils/ScreenUtils'
import StringUtils from "../../utils/StringUtils";
import DateUtils from '../../utils/DateUtils';
import BasePage from '../../BasePage';
import {RefreshList} from "../../components/ui";
import arrorw_rightIcon from "../order/res/arrow_right.png";
import MessageAPI from '../message/api/MessageApi';
import Toast from '../../utils/bridge';
import EmptyUtils from "../../utils/EmptyUtils";
const { px2dp } = ScreenUtils;
import CommonUtils from 'CommonUtils'


export default class MessageGatherPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            isEmpty: false,
            // currentPage: 1,
        }
        this.createdTime = null;
        this.currentPage = 1;
    }
    $navigationBarOptions = {
        title:'消息',
        show: true // false则隐藏导航
    };
    go2DetailPage(id,type,ids) {
        if(type == 1 || type == 7 || type == 8){
            this.$navigate("message/PayMessagePage", {id:id,type:type})
        }else if(type == 16){
            this.$navigate('product/ProductDetailPage',{productId:id,ids:ids,activityCode:5})
        }else if(type == 17){
            this.$navigate('product/ProductDetailPage',{productId:id,ids:ids,id:5})
        }else if(type == 2 || type == 3 || type == 2 || type == 3){
            this.$navigate('order/order/MyOrdersDetailPage',{orderId:ids})
        }
    }

    go2FeedDetailPage() {
        this.$navigate("message/PayMessagePage", {key: "fail"})
    }

    componentDidMount() {
        this.loadPageData();
        DeviceEventEmitter.emit("contentViewed");
    }

    //100普通，200拼店
    /*加载数据*/
    // loadPageData =()=> {
    //     Toast.showLoading()
    //     MessageAPI.queryMessage({page: 1, pageSize: 30, type:this.props.navigation.state.params.type}).then(res => {
    //         Toast.hiddenLoading()
    //         if(res.ok&&typeof res.data==='object'&&StringUtils.isNoEmpty(res.data.data)){
    //
    //             let arrData = [];
    //             res.data.data.map((item, index) => {
    //                 let obj = {
    //                     title:'',
    //                     creatTime: item.creatTime,
    //                     id: item.id,
    //                     type: item.type,
    //                     tdId: item.tdId,
    //                     content: item.content,
    //                     pushTime:item.pushTime
    //                 };
    //                 switch (item.type) {
    //                     case 1://支付成功
    //                         obj.payType = item.payType;
    //                         obj.title = "支付成功";
    //                         obj.totalPrice = item.totalPrice;
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 2://订单发货
    //                         obj.title = "订单发货";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 3://订单超时
    //                         obj.title = "订单超时";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 4://退款申请
    //                         obj.title = "退款申请";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 5:    //退货申请
    //                         obj.title = "退货申请";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 6://换货申请
    //                         obj.title = "换货申请";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 7://退款成功
    //                         obj.title = "退款成功";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 8://提现申请驳回
    //                         obj.title = "提现申请驳回";
    //                         obj.totalPrice = item.totalPrice;
    //                         break;
    //                     case 9://提现申请成功
    //                         obj.title = "提现申请成功";
    //                         obj.totalPrice = item.totalPrice;
    //                         break;
    //                     case 10://提交提现申请
    //                         obj.title = "提交提现申请";
    //                         obj.totalPrice = item.totalPrice;
    //                         break;
    //                     case 11://余额提现到账
    //                         obj.title = "余额提现到账";
    //                         obj.totalPrice = item.totalPrice;
    //                         break;
    //                     case 12://代币提现到账
    //                         obj.title = "代币提现到账";
    //                         break;
    //                     case 13://身份认证成功
    //                         obj.title = "身份认证成功";
    //                         break;
    //                     case 14://身份认证失败
    //                         obj.title = "身份认证失败";
    //                         break;
    //                     case 15://优惠券
    //                         obj.title = "优惠券";
    //                         break;
    //                     case 16://秒杀
    //                         obj.title="秒杀";
    //                         obj.productId = item.orderNum;
    //                         obj.tdId=item.tdId;
    //                         break;
    //                     case 17://降价拍
    //                         obj.title="降价拍";
    //                         obj.productId = item.orderNum;
    //                         obj.tdId=item.tdId;
    //                         break;
    //                 }
    //                 arrData.push(obj);
    //             });
    //             this.setState({viewData: arrData})
    //         }else{
    //             Toast.toast(res.msg);
    //             this.setState({isEmpty:true})
    //         }
    //     });
    // }


    loadPageData =()=> {
        Toast.showLoading()
        MessageAPI.queryMessage({page: 1, pageSize: 30, type:100}).then(res => {
            Toast.hiddenLoading()
            if(StringUtils.isNoEmpty(res.data.data)){
                let arrData = [];
                res.data.data.map((item, index) => {
                    arrData.push(item);
                });
                if(!EmptyUtils.isEmptyArr(arrData)){
                    this.createdTime = arrData[arrData.length - 1].createdTime;
                }
                this.setState({viewData: arrData})
            }else{
                Toast.toast(res.msg);
                this.setState({isEmpty:true})
            }
        }).catch(error=>{
            this.$toastShow(error.msg);
            this.setState({isEmpty:true})
            Toast.hiddenLoading()

        });
    }
    renderPaySuccessItem = ({item, index})=> {

        return (
            <View style={{height: 290, width: ScreenUtils.width}}>
                <View style={{height: 37, justifyContent: "center", alignItems: 'center'}}>
                    <Text>{DateUtils.getFormatDate(item.pushTime / 1000)}</Text>
                </View>
                <View style={styles.typetitleStyle}>
                    <Text style={styles.tilteposition}>{item.title}</Text>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 160, backgroundColor: 'white'}}>
                    <View style={styles.typeContentstyle}>
                        <Text style={{marginLeft: 5, fontSize: 13, color: "#999999"}}>支付金额：</Text>
                        <Text style={{marginLeft: 1, fontSize: 19, color: color.red}}>{StringUtils.formatMoneyString(item.totalPrice)}</Text>
                    </View>
                    <View style={styles.typecommentstyle}>
                        <Text style={styles.commonttext}>产生时间：{DateUtils.getFormatDate(item.creatTime / 1000)}</Text>
                        <Text style={styles.commonttext}>交易订单：{item.orderNum}</Text>
                        <Text style={styles.commonttext}>补充信息：{item.content}</Text>
                    </View>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 41, backgroundColor: 'white'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>this.go2DetailPage(item.id,item.type)}
                                      style={styles.bottomlookstyle}>
                        <Text style={{fontSize: 13, color: "#999999"}}>查看详情</Text>
                        <Image source={arrorw_rightIcon} style={{width: 11, height: 10, marginLeft: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    renderForProductItem=({item,index})=>{
        return (
            <View style={{height: 290, width: ScreenUtils.width}}>
                <View style={{height: 37, justifyContent: "center", alignItems: 'center'}}>
                    <Text>{DateUtils.getFormatDate(item.pushTime / 1000)}</Text>
                </View>
                <View
                    style={styles.typetitleStyle}>
                    <Text style={styles.tilteposition}>{item.title}</Text>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 160, backgroundColor: 'white'}}>
                    <View style={styles.typeContentstyle}>
                        <Text style={{marginLeft: 20, fontSize: 19, color: color.red,marginRight:20}}>{item.content}</Text>
                    </View>
                    <View style={styles.typecommentstyle}>
                        <Text style={styles.commonttext}>通知时间：{DateUtils.getFormatDate(item.creatTime / 1000)}</Text>
                        <Text style={styles.commonttext}>交易订单：{item.orderNum}</Text>
                    </View>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 41, backgroundColor: 'white'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>this.go2DetailPage(item.id,item.type,item.tdId)}
                                      style={styles.bottomlookstyle}>
                        <Text style={{fontSize: 13, color: "#999999"}}>查看详情</Text>
                        <Image source={arrorw_rightIcon} style={{width: 11, height: 10, marginLeft: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    renderCashItem=({item,index})=>{
        return (
            <View style={{height: 290, width: ScreenUtils.width}}>
                <View style={{height: 37, justifyContent: "center", alignItems: 'center'}}>
                    <Text>{DateUtils.getFormatDate(item.pushTime / 1000)}</Text>
                </View>
                <View
                    style={styles.typetitleStyle}>
                    <Text style={styles.tilteposition}>{item.title}</Text>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 160, backgroundColor: 'white'}}>
                    <View style={styles.typeContentstyle}>
                        <Text style={{marginLeft: 5, fontSize: 13, color: "#999999"}}>提现金额：</Text>
                        <Text style={{marginLeft: 1, fontSize: 19, color: color.red}}>{StringUtils.formatMoneyString(item.totalPrice)}</Text>
                    </View>
                    <View style={styles.typecommentstyle}>
                        <Text style={styles.commonttext}>通知时间：{DateUtils.getFormatDate(item.creatTime / 1000)}</Text>
                        <Text style={styles.commonttext}>补充说明：{item.content}</Text>
                    </View>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 41, backgroundColor: 'white'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>this.go2DetailPage(item.id,item.type)}
                                      style={styles.bottomlookstyle}>
                        <Text style={{fontSize: 13, color: "#999999"}}>查看详情</Text>
                        <Image source={arrorw_rightIcon} style={{width: 11, height: 10, marginLeft: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    render2AccontItem=({item,index})=>{
        return (
            <View style={{height: 260, width: ScreenUtils.width}}>
                <View style={{height: 37, justifyContent: "center", alignItems: 'center'}}>
                    <Text>{DateUtils.getFormatDate(item.pushTime / 1000)}</Text>
                </View>
                <View
                    style={styles.typetitleStyle}>
                    <Text style={styles.tilteposition}>{item.title}</Text>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 120, backgroundColor: 'white'}}>
                    <View style={styles.typecontent2}>
                        {undefined == item.totalPrice ? null : <View style={{flexDirection:"row",alignItems:'center'}}>
                            <Text style={{marginLeft: 1, fontSize: 11}}>退款金额</Text>
                            <Text style={{marginLeft: 5, fontSize: 19, color: color.red}}>{StringUtils.formatMoneyString(item.totalPrice)}</Text></View>}
                    </View>
                    <View style={{
                        height: 60,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        marginLeft: 15
                    }}>
                        <Text style={styles.commonttext}>通知时间：{DateUtils.getFormatDate(item.creatTime / 1000)}</Text>
                        <Text style={styles.commonttext}>补充信息：{item.content}</Text>
                    </View>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 41, backgroundColor: 'white'}}>
                    <TouchableOpacity activeOpacity={1.5} onPress={()=>{}}
                                      style={styles.bottomlookstyle}>
                        <Text style={{fontSize: 13, color: "#999999"}}>查看详情</Text>
                        <Image source={arrorw_rightIcon} style={{width: 11, height: 10, marginLeft: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    rendSingleItem=({item,index})=>{
        return (
            <View style={{height: 170, width: ScreenUtils.width}}>
                <View style={{height: 37, justifyContent: "center", alignItems: 'center'}}>
                    <Text>{DateUtils.getFormatDate(item.pushTime / 1000)}</Text>
                </View>
                <View
                    style={styles.typetitleStyle}>
                    <Text style={styles.tilteposition}>{item.title}</Text>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 160, backgroundColor: 'white'}}>
                    <View style={styles.typecontent2}>
                        <Text style={{marginLeft: 1, fontSize: 19, color: color.red}}>{item.content}</Text>
                    </View>
                    <View style={{
                        height: 20,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: 15
                    }}>
                        <Text style={styles.commonttext}>通知时间：{DateUtils.getFormatDate(item.creatTime / 1000)}</Text>
                    </View>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
            </View>
        )
    }
    rendActivityItem=({item,index})=>{
        return (
            <View style={{height: 210, width: ScreenUtils.width}}>
                <View style={{height: 37, justifyContent: "center", alignItems: 'center'}}>
                    <Text>{DateUtils.getFormatDate(item.pushTime / 1000)}</Text>
                </View>
                <View
                    style={styles.typetitleStyle}>
                    <Text style={styles.tilteposition}>{item.title}</Text>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 80, backgroundColor: 'white'}}>
                    <View style={styles.typecontent2}>
                        <Text style={{marginLeft: 1, fontSize: 19, color: color.red}}>{item.content}</Text>
                    </View>
                    <View style={{
                        height: 20,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: 15
                    }}>
                        <Text style={styles.commonttext}>通知时间：{DateUtils.getFormatDate(item.creatTime / 1000)}</Text>
                    </View>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 41, backgroundColor: '#ffffff'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>this.go2DetailPage(item.productId,item.type,item.tdId)}
                                      style={styles.bottomlookstyle}>
                        <Text style={{fontSize: 13, color: "#999999"}}>查看详情</Text>
                        <Image source={arrorw_rightIcon} style={{width: 11, height: 10, marginLeft: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    renderItem = ({item, index})=> {
        // switch (item.type) {
        //     case 1://支付成功
        //         return this.renderPaySuccessItem({item, index});
        //         break;
        //     case 2://订单发货
        //     case 3://订单超时
        //     case 4://退款申请
        //     case 5://退货申请
        //     case 6://换货申请
        //     case 7://退款成功
        //         return this.renderForProductItem({item, index});
        //         break;
        //     case 8://提现申请驳回
        //     case 9://提现申请成功
        //     case 10://提交提现申请
        //         return this.renderCashItem({item, index});
        //         break;
        //     case 11://余额提现到账
        //     case 12://代币提现到账
        //         return this.render2AccontItem({item, index});
        //         break;
        //     case 13://身份认证成功
        //     case 14://身份认证失败
        //     case 15://优惠券
        //         return this.rendSingleItem({item, index});
        //         break;
        //     case 16://秒杀
        //     case 17://降价拍
        //         return this.rendActivityItem({item, index});
        //         break;
        //
        // }
        // return (
        //     this.renderNoticeItem({item, index})
        // )

        let btn = (
            <TouchableWithoutFeedback onPress={()=>{alert(item.param)}}>
                <View style={{height:33,width:ScreenUtils.width, alignItems: 'center',justifyContent:'center',backgroundColor:'white'}}>
                    <Text style={{color:'#666666',fontSize:px2dp(13)}}>
                        {item.buttonName + ">>"}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );

        return (
            <View style={{ width: ScreenUtils.width,backgroundColor:'white' }}>
                <View style={styles.itemContents}>
                    <Text>{DateUtils.getFormatDate(item.createdTime / 1000,'MM/dd hh:mm')}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop:px2dp(15)}}>
                    <Text style={{ marginLeft: 15, fontSize: 15, color: '#222222' }}>{item.title}</Text>
                </View>
                <View style={{ backgroundColor: 'white',marginVertical:px2dp(15) }}>
                    <Text style={{ marginLeft: 15, fontSize: 13,color:'#666666' }}>{item.content}</Text>
                </View>
                <View style={{ height:!EmptyUtils.isEmpty(item.param) ? 1 : 0, width: ScreenUtils.width, backgroundColor: '#DDDDDD' }}/>
                {item.messageType === 200 ? btn : null}
            </View>
        );
    };

    onLoadMore = () => {
        // this.setState({
        //     currentPage: this.state.currentPage + 1
        // });
        this.currentPage++;
        this.getDataFromNetwork();
    }
    onRefresh = () => {
        // this.setState({
        //     currentPage: 1,
        // })
        this.currentPage = 1;
        this.createdTime = null;
        this.getDataFromNetwork()
    }

    getDataFromNetwork = ()=> {
        MessageAPI.queryMessage({page: this.currentPage, pageSize: 15,type:100,createdTime:this.createdTime}).then(res => {
            if(!EmptyUtils.isEmpty(res)){
                let arrData = CommonUtils.deepClone(this.state.viewData);
                res.data.data.map((item, index) => {
                    arrData.push(item);
                });

                if(!EmptyUtils.isEmptyArr(arrData)){
                    this.createdTime = arrData[arrData.length - 1].createdTime;
                }
                this.setState({viewData: arrData})
            }
        }).catch((error)=>{
            this.$toastShow(error.msg)
        })
    }

    // getDataFromNetwork() {
    //
    //     MessageAPI.queryMessage({page: this.state.currentPage, pageSize: 15,type:100}).then(res => {
    //         if(res.ok&&typeof res.data==='object'&&res.data.data.length>0){
    //             let arrData = [];
    //             res.data.data.map((item, index) => {
    //                 let obj = {
    //                     creatTime: item.creatTime,
    //                     id: item.id,
    //                     type: item.type,
    //                     tdId: item.tdId,
    //                     content: item.content,
    //                     pushTime:item.pushTime
    //                 };
    //                 switch (item.type) {
    //                     case 1://支付成功
    //                         obj.payType = item.payType;
    //                         obj.title = "支付成功";
    //                         obj.totalPrice = item.totalPrice;
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 2://订单发货
    //                         obj.title = "订单发货";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 3://订单超时
    //                         obj.title = "订单超时";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 4://退款申请
    //                         obj.title = "退款申请";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 5:    //退货申请
    //                         obj.title = "退货申请";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 6://换货申请
    //                         obj.title = "换货申请";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 7://退款成功
    //                         obj.title = "退款成功";
    //                         obj.orderNum = item.orderNum;
    //                         break;
    //                     case 8://提现申请驳回
    //                         obj.title = "提现申请驳回";
    //                         obj.totalPrice = item.totalPrice;
    //                         break;
    //                     case 9://提现申请成功
    //                         obj.title = "提现申请成功";
    //                         obj.totalPrice = item.totalPrice;
    //                         break;
    //                     case 10://提交提现申请
    //                         obj.title = "提交提现申请";
    //                         obj.totalPrice = item.totalPrice;
    //                         break;
    //                     case 11://余额提现到账
    //                         obj.title = "余额提现到账";
    //                         obj.totalPrice = item.totalPrice;
    //                         obj.tokenCoin = item.tokenCoin;
    //                         break;
    //                     case 12://代币提现到账
    //                         obj.title = "代币提现到账";
    //                         obj.tokenCoin = item.tokenCoin;
    //                         break;
    //                     case 13://身份认证成功
    //                         obj.title = "身份认证成功";
    //                         break;
    //                     case 14://身份认证失败
    //                         obj.title = "身份认证失败";
    //                         break;
    //                     case 15://优惠券
    //                         obj.title = "优惠券";
    //                         break;
    //                     case 16://秒杀
    //                         obj.title="秒杀";
    //                         obj.productId = item.orderNum;
    //                         obj.tdId=item.tdId;
    //                         break;
    //                     case 17://降价拍
    //                         obj.title="降价拍";
    //                         obj.productId = item.orderNum;
    //                         obj.tdId=item.tdId;
    //                         break;
    //                 }
    //                 arrData.push(obj);
    //             });
    //             this.setState({viewData: arrData})
    //         }else{
    //             Toast.toast(res.msg);
    //         }
    //     })
    // }

    _render() {
        return (
            <View style={styles.container}>
                <RefreshList
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                />
            </View>
        )
    }

    renderNoticeItem = ({item, index})=> {
        return (
            <View style={{height: 290, width: ScreenUtils.width}}>
                <View style={{height: 37, justifyContent: "center", alignItems: 'center'}}>
                    <Text>{DateUtils.getFormatDate(item.pushTime / 1000)}</Text>
                </View>
                <View
                    style={{height: 49, flexDirection: 'row', alignItems: 'center', backgroundColor: "white"}}>
                    <Text style={{marginLeft: 15, fontSize: 15}}>{item.title}</Text>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 160, backgroundColor: 'white'}}>
                    <View style={{
                        height: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}>
                        <Text style={{marginLeft: 1, fontSize: 19, color: color.red}}>{item.content}</Text>
                    </View>
                    <View style={{
                        height: 100,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: 15
                    }}>
                        <Text style={{
                            marginLeft: 5,
                            fontSize: 15
                        }}>产生时间： {DateUtils.getFormatDate(item.creatTime / 1000)}</Text>
                        <Text style={{marginLeft: 5, fontSize: 15}}>订单号：{item.orderNum}</Text>
                    </View>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 41, backgroundColor: 'white'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>this.go2DetailPage()}
                                      style={{
                                          height: 41,
                                          flexDirection: "row",
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                      }}>
                        <Text style={{fontSize: 13, color: "#999999"}}>查看详情</Text>
                        <Image source={arrorw_rightIcon} style={{width: 11, height: 10, marginLeft: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderPaybackItem = () => {
        return (
            <View style={{height: 290, width: ScreenUtils.width}}>
                <View style={{height: 37, justifyContent: "center", alignItems: 'center'}}>
                    <Text>上午 12:23</Text>
                </View>
                <View
                    style={{height: 49, flexDirection: 'row', alignItems: 'center', backgroundColor: "white"}}>
                    <Text style={{marginLeft: 15, fontSize: 15}}>退款到账通知</Text>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 160, backgroundColor: 'white'}}>
                    <View style={{
                        height: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}>
                        <Text style={{marginLeft: 5, fontSize: 13, color: "#999999"}}>退款金额：</Text>
                        <Text style={{marginLeft: 5, fontSize: 11, color: color.red}}>¥</Text>
                        <Text style={{marginLeft: 1, fontSize: 19, color: color.red}}>50</Text>
                        <Text style={{marginLeft: 5, fontSize: 13, color: color.red}}>.50</Text>
                    </View>
                    <View style={{
                        height: 100,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: 15
                    }}>
                        <Text style={{marginLeft: 5, fontSize: 15}}>退款去向：支付宝账户</Text>
                        <Text style={{marginLeft: 5, fontSize: 15}}>支付时间： 2018.3.23 12:03:12</Text>
                        <Text style={{marginLeft: 5, fontSize: 15}}>交易订单：3453446477567</Text>
                        <Text style={{marginLeft: 5, fontSize: 15}}>退款说明：一件短袖</Text>
                    </View>
                </View>
                <View style={{height: 1.5, width: ScreenUtils.width, backgroundColor: "#f7f7f7"}}/>
                <View style={{height: 41, backgroundColor: 'white'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>this.go2FeedDetailPage()}
                                      style={{
                                          height: 41,
                                          flexDirection: "row",
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                      }}>
                        <Text style={{fontSize: 13, color: "#999999"}}>查看详情</Text>
                        <Image source={arrorw_rightIcon} style={{width: 11, height: 10, marginLeft: 5}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    typetitleStyle:{
        height: 49,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white"
    },
    typeContentstyle:{
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    typecommentstyle:{
        height: 80,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 15
    },
    bottomlookstyle:{
        height: 41,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    commonttext:{
        marginLeft: 5,
        fontSize: 15
    },
    tilteposition:{
        marginLeft: 15,
        fontSize: 15
    },
    typecontent2:{
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    itemContents: {
        height: 37,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#F7F7F7'
    }
});
