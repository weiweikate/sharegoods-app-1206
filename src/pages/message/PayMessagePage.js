//支付消息结果页面
import React, {Component}from 'react';
import { StyleSheet, View, Text} from 'react-native'
import {
  UIImage
} from '../../components/ui'
import { color} from "../../constants/Theme";
import ScreenUtils from '../../utils/ScreenUtils'
import StringUtils from "../../utils/StringUtils";
import BasePage from '../../BasePage';
import HomeApi from '../home/api/HomeAPI';
import Toast from '../../utils/bridge';
import arrow_right from '../order/res/arrow_right.png'
import DateUtils from '../../utils/DateUtils';
export default class PayMessagePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            type:null,
             data:null,
             paymt:''
        }
    }
    $navigationBarOptions = {
        title:"消息详情",
        show: true // false则隐藏导航
    };
    loadPageData(){
        let paymeth='';
        console.log(this.params.id+`${this.params.type}`)
        HomeApi.findMessageDetail({id:this.params.id,type:this.params.type}).then(res => {
            console.log(res);
            if(res.ok){
                if(typeof res.data ==='object'){
                    switch(res.data.pay_type){
                        case 1:
                           paymeth='纯平台';
                            break;
                        case 2:
                            paymeth='微信(小程序)';
                            break;
                        case 4:
                            paymeth='微信(APP)';
                            break;
                        case 8:
                            paymeth='支付宝';
                            break;
                        case 16:
                            paymeth='银联';
                            break;
                    }
                }
                this.setState({
                    data:res.data,
                    paymt:paymeth,
                    type:this.params.type
                });
            }else{
                Toast.toast(res.msg);
            }
        })
    }
    renderBodyView(){

        switch(this.state.type){
            case 1:
               return this.renderSuccess();
                break;
            case 7:
               return  this.renderFail();
                break;
            case 8:
              return <View style={styles.bohuicontainerStyle}>
                  <View style={styles.typetitleStyle}>
                      <Text style={styles.tilteposition}>提现申请驳回</Text>
                  </View>
                  <View style={{backgroundColor:'#f7f7f7',height:1,width:'100%'}}/>
                  <View style={{justifyContent:'center',flex:1}}>
                  <Text style={{fontFamily: "PingFang-SC-Medium", fontSize: 14, color: "#666666",marginLeft:14}}>{this.state.data}</Text>
                      </View>
                  </View>;
                break;

        }
    }

    renderSuccess() {
            return (
                <View style={styles.container}>
                    <View style={{
                        height: 131,
                        backgroundColor: "#ffffff",
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{fontFamily: "PingFang-SC-Medium", fontSize: 15, color: "#222222"}}>支付订单</Text>
                        <Text style={{fontFamily: "PingFang-SC-Medium", fontSize: 24, color: "#222222", marginTop: 20}}>{StringUtils.formatMoneyString(this.state.data.amounts)}</Text>
                        <View style={{backgroundColor: color.blue_4a9, borderRadius: 3, marginTop: 20}}>
                            <Text style={{color: "white", margin: 1, fontSize: 11}}>交易成功</Text>
                        </View>
                    </View>
                    <View style={{height: 10}}/>
                    <NewsDetailItem titles={"付款方式"} rightmg={this.state.paymt} isshow={false}/>
                    <NewsDetailItem titles={"支付时间"} rightmg={DateUtils.getFormatDate(this.state.data.pay_time / 1000)}
                                    isshow={false}/>
                    <NewsDetailItem titles={"订单号"} rightmg={this.state.data.order_num} isshow={false}/>
                    <View style={{height: 10}}/>
                    <NewsDetailItem titles={"订单疑问"} isshow={true} onPresses={()=>this.showTitle()}/>
                    <NewsDetailItem titles={"投诉"} isshow={true} onPresses={()=>this.showTitle()}/>
                </View>
            )

    }
    renderFail(){
        return(
            <View style={styles.container}>
                <View style={{height: 131, backgroundColor: "#ffffff", alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontFamily: "PingFang-SC-Medium", fontSize: 15, color: "#222222"}}>订单退款</Text>
                    <Text style={{fontFamily: "PingFang-SC-Medium", fontSize: 24, color: "#222222",marginTop:20}}>{StringUtils.formatMoneyString(this.state.data.amounts)}</Text>
                    <View style={{backgroundColor: color.blue_4a9, borderRadius: 3,marginTop:20}}>
                        <Text style={{color: "white", margin: 1,fontSize:11}}>退款成功</Text>
                    </View>
                </View>
                <View style={{height:10}}/>
                <NewsDetailItem titles={"退款账户"} rightmg={this.state.paymt} isshow={false}/>
                {this.state.data.token_coin?
                    <NewsDetailItem titles={"代币金额"} rightmg={StringUtils.formatMoneyString(this.state.data.token_coin)} isshow={false}/>:null}
                {this.state.data.balance?
                <NewsDetailItem titles={"余额账户"} rightmg={StringUtils.formatMoneyString(this.state.data.balance)} isshow={false}/>:null}
                <View style={{height:10}}/>
                <NewsDetailItem titles={"退款时间"} rightmg={DateUtils.getFormatDate(this.state.data.create_time/1000)} isshow={false}/>
                <NewsDetailItem titles={"订单号"} rightmg={this.state.data.order_num} isshow={false}/>
                <View style={{height:10}}/>
                <NewsDetailItem titles={"订单疑问"} isshow={true} onPresses={()=>this.showTitle()}/>
                <NewsDetailItem titles={"投诉"} isshow={true} onPresses={()=>this.showTitle()}/>
            </View>
        )}

    _render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
            </View>
        )
    }
    showTitle(){
        this.$navigate('mine/MyHelperPage')
    }
}
class NewsDetailItem extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <View>
            <View style={[styles.textitems, {flexDirection: 'row', justifyContent: 'space-between',alignItems:"center"}]}>
                <Text style={styles.textsingle}>{this.props.titles}</Text>
                <Text style={styles.textsingle}>{this.props.rightmg}</Text>
                {this.props.isshow? <UIImage onPress={()=>this.props.onPresses()} source={arrow_right} style={{width:7,height:10,marginRight:13}}/>:null}
            </View>
                <View style={{height:1,backgroundColor:"#f7f7f7",width:ScreenUtils.width}}/>
                </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    textitems: {
        width: ScreenUtils.width,
        height: 44,
        backgroundColor: "#ffffff",
        borderStyle: "solid",
    },
    textsingle: {
        fontFamily: "PingFang-SC-Regular",
        fontSize: 13,
        color: "#999999",
        marginLeft:16,
        marginRight:13
    },
    bohuicontainerStyle:{
        margin:15,
        width: ScreenUtils.width-30,
        height: 111,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(153, 153, 153, 0.1)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1
    },
    tilteposition:{
        // fontFamily: "PingFang-SC-Bold",
        fontSize: 15,
        color: "#e60012",
        marginLeft:14,
    },
    typetitleStyle:{
        height: 49,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white"
    },

});
