import React from 'react';
import { StyleSheet, TouchableOpacity, View,Image,ScrollView} from 'react-native';
import BasePage from '../../../BasePage';
import { MRText as Text} from '../../../components/ui';
// import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
// import OrderApi from '../api/orderApi';
import DesignRule from 'DesignRule';
import res from '../res';
import GoodsGrayItem from '../components/GoodsGrayItem'

export default class CheckLogisticsPage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        title: '查看物流',
        show: true// false则隐藏导航
    };

    show(expressNo){
        this.$navigate("order/logistics/LogisticsDetailsPage", {
            expressNo: expressNo
        });
    }

    _render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{height:20,width:ScreenUtils.width,backgroundColor:DesignRule.mainColor,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:13,color:DesignRule.white}}>{`${this.params.expressList.length}个包裹已发出`}</Text>
                </View>
                <View style={{alignItems:'center',marginTop:8,marginBottom:8,height:17,justifyContent:'center'}}>
                    <Text style={{fontSize:12,color:DesignRule.textColor_instruction}}>{`——— 以下商品被拆分成${this.params.expressList.length+this.params.unSendProductInfoList.length}个包裹 ————`}</Text>
                </View>
                {this.params.expressList.map((item)=>{
               return (
                    <View>
                        <TouchableOpacity style={{ height: 40, backgroundColor: DesignRule.white, justifyContent: 'center' }}
                                          onPress={() => {this.show(item.expNO)}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:15,paddingRight:15}}>
                                <Text style={{ fontSize: 12,color:DesignRule.textColor_mainTitle }}>{`${item.expName}: ${item.expNO}`}</Text>
                                <Image source={res.button.arrow_right_black}/>
                            </View>
                        </TouchableOpacity>
                        <View style={{backgroundColor:'#E4E4E4',height:0.5,width:ScreenUtils.width}}/>
                        {item.list&&item.list.map((data)=>{
                        return     <GoodsGrayItem
                                uri={data.specImg}
                                goodsName={data.productName}
                                salePrice={data.unitPrice}
                                category={data.specValues}
                                goodsNum={data.quantity}
                                style={{backgroundColor:'white'}}
                            />
                        })}

                        <View style={{backgroundColor:DesignRule.bgColor,height:10,width:ScreenUtils.width}}/>
                    </View>
               )
                })}
                {this.params.unSendProductInfoList.map((item)=>{
                    return (
                        <View>
                            <TouchableOpacity style={{ height: 40, backgroundColor: DesignRule.white, justifyContent: 'center' }}>
                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:15,paddingRight:15}}>
                                    <Text style={{ fontSize: 12,color:DesignRule.textColor_mainTitle }}>订单正在处理中。。。</Text>
                                    <View style={{width:10,height:10}}/>
                                </View>
                            </TouchableOpacity>
                            <View style={{backgroundColor:'#E4E4E4',height:0.5,width:ScreenUtils.width}}/>
                            <GoodsGrayItem
                                uri={item.specImg}
                                goodsName={item.productName}
                                salePrice={10}
                                category={item.specValues}
                                goodsNum={item.quantity}
                                style={{backgroundColor:'white'}}
                            />
                            <View style={{backgroundColor:DesignRule.bgColor,height:10,width:ScreenUtils.width}}/>
                        </View>
                    )
                })}
            </ScrollView>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    }
});
