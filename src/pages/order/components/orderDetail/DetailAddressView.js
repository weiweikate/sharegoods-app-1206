import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {
    UIText, UIImage
} from '../../../../components/ui';
import DesignRule from 'DesignRule';
import ScreenUtil from '../../../../utils/ScreenUtils';
const {px2dp} =ScreenUtil;
import res from '../../res';
const position = res.dizhi_icon;

export default class DetailAddressView extends Component{

    render(){
        return (
            <View style={styles.viewContainer}>
                <UIImage source={position} style={{ height: px2dp(20), width:  px2dp(20), marginLeft:  px2dp(20) }} resizeMode={'contain'}/>
                <View style={{ flex: 1, marginLeft:  px2dp(15), marginRight:  px2dp(20) }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={[styles.innerTextStyle,{flex:1}]}>收货人:{this.props.receiver}</Text>
                        <Text style={[styles.innerTextStyle,{marginLeft: px2dp(5)}]}>{this.props.recevicePhone}</Text>
                    </View>
                    <UIText value={
                        '收货地址:' + this.props.province
                        + this.props.city
                        + this.props.area
                        + this.props.address
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
