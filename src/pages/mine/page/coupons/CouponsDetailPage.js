/**
 * Created by xiangchen on 2018/7/23.
 */
/**
 * Created by xiangchen on 2018/7/23.
 */
import React from 'react'
import { StyleSheet, View, Text,  TouchableOpacity,DeviceEventEmitter,
    ImageBackground, } from 'react-native'

import BasePage from '../../../../BasePage'

import ScreenUtils from '../../../../utils/ScreenUtils'
// import StringUtils from "../../utils/StringUtils";
import {color} from "../../../../constants/Theme";
import detailbg from "./../../res/couponsImg/icon_03.png"
// import Toast from '../../../../utils/bridge';
export default class CouponsDetailPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            viewData: {
                value:12,
                useConditions:500,
                productNames:'葫芦小精钢',
                startTime:1537324480000,
                outTime:1537327480000,
            },
            explain:"去使用"
        }
    }

    $navigationBarOptions = {
        show: true,
        title: '优惠券详情'
    };
    fmtDate(obj) {
        var date = new Date(obj);
        var y = 1900 + date.getYear();
        var m = "0" + (date.getMonth() + 1);
        var d = "0" + date.getDate();
        return y + "." + m.substring(m.length - 2, m.length) + "." + d.substring(d.length - 2, d.length);
    }

    loadPageData() {
        // CouponsApi.getDiscountCouponById({id: this.params.id}).then(res =>{
        //     if(res.ok&&StringUtils.isNoEmpty(res.data)){
        //         let explaines="";
        //         switch(data.status){
        //             case 0:
        //                 explaines="立即使用";
        //                 break;
        //             case 1:
        //                 explaines="已使用";
        //                 break;
        //             case 2:
        //                 explaines="已失效";
        //                 break;
        //             case 3:
        //                 explaines="去激活";
        //                 break;
        //         }
        //         this.setState({viewData: data,explain:explaines})
        //     }else{
        //         Toast.toast(res.msg)
        //     }
        //     }
        // );
    }

    _render(){
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
            </View>
        )
    }
    go2OrderPage(){
        DeviceEventEmitter.emit("usedCoupons",this.state.viewData);
    }

    renderBodyView = () => {
        return (
            <View style={{backgroundColor: '#f7f7f7'}}>
                <ImageBackground style={{
                    width: ScreenUtils.width - 30,
                    height: 100,
                    margin: 15,
                    flexDirection: 'row',
                    alignItems: 'center'
                }} source={detailbg} resizeMode='stretch'>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{alignSelf: 'flex-end', marginBottom: 2}}>
                                <Text style={{fontSize: 5, color: "#e60012"}}>￥</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 20, color: "#e60012"}}>{this.state.viewData.value}</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontSize: 11, color: "#999999"}}>满{this.state.viewData.useConditions}可用</Text>
                        </View>
                    </View>
                    <View style={{flex: 4, alignItems: 'center'}}>
                        <Text style={{fontSize: 15, color: "#222222"}}>会员专享券</Text>
                        <Text style={{fontSize: 11, color: "#999999"}}>{this.state.viewData.productNames}</Text>
                        <Text style={{
                            fontSize: 11,
                            color: "#999999"
                        }}>有效期：{this.fmtDate(this.state.viewData.startTime)}-{this.fmtDate(this.state.viewData.outTime)}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                    </View>
                </ImageBackground>
                <View style={{marginTop:20,alignItems:'flex-start',marginLeft:15,flex:1}}>
                    <Text style={{marginTop:5}}>使用说明:</Text>
                    <Text style={{marginTop:5}}>1.礼包优惠券在激活有效期内可以购买指定商品</Text>
                    <Text tyle={{marginTop:5}}>2.不可与其他优惠券叠加使用</Text>
                </View>
                <View style={{ width:ScreenUtils.width,height:180,alignItems:'center',justifyContent:'flex-end'}}>
                    <TouchableOpacity  activeOpacity={0.9} style={{width:290,height:48,borderRadius:5,backgroundColor:this.state.viewData.status==!0?"#dddddd":color.red,
                        alignItems:"center",justifyContent:"center"}} onPress={()=>this.go2OrderPage()}>
                        <Text style={{fontSize:16,color:"#fff"}}>{this.state.explain}</Text>
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
    }
});
