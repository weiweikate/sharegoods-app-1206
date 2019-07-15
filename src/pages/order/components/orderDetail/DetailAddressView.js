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
import { observer } from 'mobx-react';
import { orderDetailModel } from '../../model/OrderDetailModel';
import {MRText as Text} from '../../../../components/ui';
const {px2dp} = ScreenUtil;
import res from '../../res';
const position = res.dizhi_icon;

@observer
export default class DetailAddressView extends Component{

    render(){
        let receiveInfo = orderDetailModel.receiveInfo
        let {
            province = '',
            city = '',
            area = '',
            address = '',
            receiver = '',
            receiverPhone = '',
        } = receiveInfo;
        province = province || '';
        city = city || '';
        area = area || '';
        address = address || '';
        return (
            <View style={styles.viewContainer}>
                <UIImage source={position} style={{ height: px2dp(20), width:  px2dp(20), marginLeft:  px2dp(20) }} resizeMode={'contain'}/>
                <View style={{ flex: 1, marginLeft:  px2dp(15), marginRight:  px2dp(20) }}>
                    <View style={{flexDirection: 'row' }}>
                        <Text style={[styles.innerTextStyle,{flex:1}]} allowFontScaling={false}>收货人:{receiver}</Text>
                        <Text style={[styles.innerTextStyle,{marginLeft: px2dp(5)}]} allowFontScaling={false}>{receiverPhone}</Text>
                    </View>
                    <UIText value={
                        '收货地址:' + province
                        + city
                        + area
                        + address
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
         paddingBottom:  px2dp(20),
         alignItems: 'center',
     },
    innerTextStyle:{
        fontSize: 15,
        color: DesignRule.textColor_instruction
    }
});
