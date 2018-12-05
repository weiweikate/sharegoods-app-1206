import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {  orderDetailModel } from '../../model/OrderDetailModel';
import DesignRule from 'DesignRule';
import { observer } from 'mobx-react/native';

@observer
export default class GiftHeaderView extends Component{

    render(){
        return (
            <View style={{marginTop: 10}}>
                {orderDetailModel.orderType == 5 || orderDetailModel.orderType === 98 ?
                    <View style={styles.containerStyles}>
                        <View style={styles.leftStyles}>
                            <Text style={styles.giftTextStyles}>礼包</Text>
                        </View>
                        <Text style={styles.giftNameStyles}>{this.props.giftPackageName}</Text>
                    </View>
                    :
                    null}
            </View>
        );
    }
}

const styles=StyleSheet.create({
    containerStyles:{
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        height:40
    },
    leftStyles:{
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: DesignRule.mainColor,
        marginLeft: 20,
    },
    giftTextStyles:{
        fontSize: 11,
        color: DesignRule.mainColor,
        padding: 3
    },
    giftNameStyles:{
        marginLeft: 10,
        fontSize: 12,
        color: DesignRule.textColor_instruction
    }

})
