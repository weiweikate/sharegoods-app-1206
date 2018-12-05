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
import ScreenUtil from '../../../../utils/ScreenUtils';
const {px2dp} =ScreenUtil;


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
                    <UIImage source={logisticCar} style={{ height: px2dp(19), width: px2dp(19), marginLeft: px2dp(21) }}/>
                    <View style={{justifyContent:'center',flex:1}}>
                        {typeof orderDetailAfterServiceModel.totalAsList.buyState === 'string' ?
                            <View style={{ marginLeft: px2dp(10)}}>
                                <UIText value={orderDetailAfterServiceModel.totalAsList.sellerState} style={{
                                    color: DesignRule.textColor_mainTitle,
                                    fontSize: px2dp(15),
                                    marginRight: px2dp(46)
                                }}/>
                                {StringUtils.isNoEmpty(orderDetailAfterServiceModel.totalAsList.logisticsTime)?
                                    <UIText style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize:px2dp(15),
                                        marginTop:px2dp(3)
                                    }} value={DateUtils.getFormatDate(orderDetailAfterServiceModel.totalAsList.logisticsTime / 1000)}/>:null}
                            </View>
                            :
                            <View style={{flexDirection:'row',marginLeft:px2dp(10),justifyContent:'flex-end',marginRight:px2dp(15)}}>
                                    <Text style={{flex:1,fontSize:px2dp(15)}}>{orderDetailAfterServiceModel.totalAsList.sellerState[0]}</Text>
                                    <Text style={{fontSize:px2dp(15),marginRight:px2dp(30)}}>{orderDetailAfterServiceModel.totalAsList.sellerState[1]}</Text>
                            </View>
                        }
                        <View>
                        {StringUtils.isNoEmpty(orderDetailAfterServiceModel.totalAsList.sellerTime) ?
                            <UIText value={orderDetailAfterServiceModel.totalAsList.sellerTime}
                                    style={styles.DetailAddressStyle}/>
                            : null}
                        </View>

                    </View>
                    <UIImage source={arrow_right} style={{ height: px2dp(14), width: px2dp(10), marginRight: px2dp(11) }}
                             resizeMode={'contain'}/>
                </View>

            </TouchableOpacity>
        )
    }
}
const styles=StyleSheet.create({
    topOrderDetail:{
        minHeight:px2dp(81),
        marginTop: px2dp(69),
        backgroundColor: 'white',
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingTop:px2dp(5),
        paddingBottom:px2dp(5),
        borderRadius: px2dp(10),
        justifyContent:'center'
    },
    leftTextStyle:{
        flex:1,
        fontSize: px2dp(15),
        color: DesignRule.textColor_instruction
    },
    phoneStyle:{
        fontSize: px2dp(15),
        marginLeft:px2dp(25),
        color: DesignRule.textColor_instruction
    },
    DetailAddressStyle:{
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13),
        marginLeft: px2dp(10),
        marginRight: px2dp(55),
        marginTop:px2dp(5),
    }
})
