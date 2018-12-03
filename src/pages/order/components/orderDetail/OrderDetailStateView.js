import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {
    UIText, UIImage
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import DateUtils from '../../../../utils/DateUtils';
import DesignRule from 'DesignRule';
import res from '../../res';
import { assistDetailModel, orderDetailAfterServiceModel, orderDetailModel } from '../../model/OrderDetailModel';
const arrow_right = res.arrow_right;
const logisticCar = res.car;


export default class OrderDetailStateView extends Component{
constructor(props){
    super(props);
}

    render(){
        return(
            <TouchableOpacity style={styles.topOrderDetail} onPress={() => {
                this.props.nav('order/logistics/LogisticsDetailsPage', {
                    orderNum: orderDetailModel.orderNum,
                    orderId: assistDetailModel.orderId,
                    expressNo: orderDetailModel.expressNo
                })
            }} disabled={!orderDetailModel.expressNo}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}} >
                    <UIImage source={logisticCar} style={{ height: 19, width: 19, marginLeft: 21 }}/>
                    <View style={{justifyContent:'center',flex:1}}>
                        {typeof orderDetailAfterServiceModel.totalAsList.buyState === 'string' ?
                            <View style={{ marginLeft: 10}}>
                                <UIText value={orderDetailAfterServiceModel.totalAsList.sellerState} style={{
                                    color: DesignRule.textColor_mainTitle,
                                    fontSize: 15,
                                    marginRight: 46
                                }}/>
                                {StringUtils.isNoEmpty(orderDetailAfterServiceModel.totalAsList.logisticsTime)?
                                    <UIText style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize:15,
                                        marginTop:3
                                    }} value={DateUtils.getFormatDate(orderDetailAfterServiceModel.totalAsList.logisticsTime / 1000)}/>:null}
                            </View>
                            :
                            <View style={{flexDirection:'row',marginLeft:10,justifyContent:'flex-end',marginRight:15}}>
                                    <Text style={{flex:1,fontSize:15}}>{orderDetailAfterServiceModel.totalAsList.sellerState[0]}</Text>
                                    <Text style={{fontSize:15,marginRight:30}}>{orderDetailAfterServiceModel.totalAsList.sellerState[1]}</Text>
                            </View>
                        }
                        <View>
                        {StringUtils.isNoEmpty(orderDetailAfterServiceModel.totalAsList.sellerTime) ?
                            <UIText value={orderDetailAfterServiceModel.totalAsList.sellerTime}
                                    style={styles.DetailAddressStyle}/>
                            : null}
                        </View>

                    </View>
                    <UIImage source={arrow_right} style={{ height: 14, width: 10, marginRight: 11 }}
                             resizeMode={'contain'}/>
                </View>

            </TouchableOpacity>
        )
    }
}
const styles=StyleSheet.create({
    topOrderDetail:{
        minHeight:81,
        marginTop: 69,
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        paddingTop:5,
        paddingBottom:5,
        borderRadius: 10,
        justifyContent:'center'
    },
    leftTextStyle:{
        flex:1,
        fontSize: 15,
        color: DesignRule.textColor_instruction
    },
    phoneStyle:{
        fontSize: 15,
        marginLeft:25,
        color: DesignRule.textColor_instruction
    },
    DetailAddressStyle:{
        color: DesignRule.textColor_instruction,
        fontSize: 13,
        marginLeft: 10,
        marginRight: 55,
        marginTop:5,
    }
})
