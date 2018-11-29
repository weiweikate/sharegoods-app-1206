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
import res from '../../res';
const position = res.dizhi_icon;

export default class DetailAddressView extends Component{

    render(){
        return (
            <View style={styles.viewContainer}>
                <UIImage source={position} style={{ height: 20, width: 20, marginLeft: 20 }} resizeMode={'contain'}/>
                <View style={{ flex: 1, marginLeft: 15, marginRight: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={[styles.innerTextStyle,{flex:1}]}>收货人:{this.props.receiver}</Text>
                        <Text style={[styles.innerTextStyle,{marginLeft:5}]}>{this.props.recevicePhone}</Text>
                    </View>
                    <UIText value={
                        '收货地址:' + this.props.province
                        + this.props.city
                        + this.props.area
                        + this.props.address
                    }
                            style={[styles.innerTextStyle,{marginTop:5}]}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
     viewContainer:{
         minHeight:83,
         backgroundColor: 'white',
         flexDirection: 'row',
         paddingTop: 10,
         paddingBottom: 10,
         alignItems: 'center'
     },
    innerTextStyle:{
        fontSize: 15,
        color: DesignRule.textColor_instruction
    }
});
