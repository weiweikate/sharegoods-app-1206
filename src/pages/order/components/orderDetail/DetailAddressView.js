import React,{Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    UIText, UIImage
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import ScreenUtil from '../../../../utils/ScreenUtils';
import { observer } from 'mobx-react/native';
import { orderDetailModel } from "../../model/OrderDetailModel";
import {MRText as Text} from '../../../../components/ui';
const {px2dp} = ScreenUtil;
import res from '../../res';
const position = res.dizhi_icon;

@observer
export default class DetailAddressView extends Component{

    render(){
        return (
            <View style={styles.viewContainer}>
                <UIImage source={position} style={{ height: px2dp(20), width:  px2dp(20), marginLeft:  px2dp(20) }} resizeMode={'contain'}/>
                <View style={{ flex: 1, marginLeft:  px2dp(15), marginRight:  px2dp(20) }}>
                    <View style={{flexDirection: 'row' }}>
                        <Text style={[styles.innerTextStyle,{flex:1}]} allowFontScaling={false}>收货人:{orderDetailModel.receiver}</Text>
                        <Text style={[styles.innerTextStyle,{marginLeft: px2dp(5)}]} allowFontScaling={false}>{orderDetailModel.receiverPhone}</Text>
                    </View>
                    <UIText value={
                        '收货地址:' + orderDetailModel.province
                        + orderDetailModel.city
                        + orderDetailModel.area
                        + orderDetailModel.address
                    }
                            style={[styles.innerTextStyle,{marginTop: px2dp(5)}]}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
     viewContainer:{
         minHeight: px2dp(83),
         backgroundColor: 'white',
         flexDirection: 'row',
         paddingTop:  px2dp(10),
         paddingBottom:  px2dp(10),
         alignItems: 'center'
     },
    innerTextStyle:{
        fontSize: 15,
        color: DesignRule.textColor_instruction
    }
});
