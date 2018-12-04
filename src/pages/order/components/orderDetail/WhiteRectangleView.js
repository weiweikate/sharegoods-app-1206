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
const arrow_right = res.arrow_right;
const logisticCar = res.car;


export default class WhiteRectangleView extends Component{


    render(){
        return(
            <TouchableOpacity style={styles.topOrderDetail} onPress={() => {
                this.props.nav('order/logistics/LogisticsDetailsPage', {
                    orderNum: this.props.orderNum,
                    orderId: this.props.orderId,
                    expressNo: this.props.expressNo
                })
            }} disabled={!this.props.expressNo}>
                <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between'}} >
                    <UIImage source={logisticCar} style={{ height: 19, width: 19, marginLeft: 21 }}/>
                    <View style={{justifyContent:'center',flex:1}}>
                        {typeof this.props.sellerState === 'string' ?
                            <View style={{ marginLeft: 10}}>
                                <UIText value={this.props.sellerState} style={{
                                    color: DesignRule.textColor_mainTitle,
                                    fontSize: 15,
                                    marginRight: 46
                                }}/>
                                {StringUtils.isNoEmpty(this.props.logisticsTime)?
                                    <UIText style={{
                                        color: DesignRule.textColor_instruction,
                                        fontSize:15,
                                        marginTop:3
                                    }} value={DateUtils.getFormatDate(this.props.logisticsTime / 1000)}/>:null}
                            </View>
                            :
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.leftTextStyle}>{this.props.sellerState[0]}</Text>
                                <Text style={styles.phoneStyle}>{this.props.sellerState[1]}</Text>
                            </View>
                        }
                        {StringUtils.isNoEmpty(this.props.sellerTime) ?
                            <UIText value={this.props.sellerTime}
                                    style={styles.DetailAddressStyle}/>
                            : null}

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
        marginLeft:10,
        marginRight:3,
        color: DesignRule.textColor_instruction
    },
    phoneStyle:{
        fontSize: 15,
        marginRight:16,
        color: DesignRule.textColor_instruction
    },
    DetailAddressStyle:{
        color: DesignRule.textColor_instruction,
        fontSize: 13,
        marginLeft: 10,
        marginRight: 16,
        marginTop:5
    }
})
