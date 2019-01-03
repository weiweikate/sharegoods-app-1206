import React,{Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {  orderDetailModel } from '../../model/OrderDetailModel';
import DesignRule from 'DesignRule';
import { observer } from 'mobx-react/native';
import ScreenUtil from '../../../../utils/ScreenUtils';
const {px2dp} = ScreenUtil;
import {MRText as Text} from '../../../../components/ui';

@observer
export default class GiftHeaderView extends Component{

    render(){
        return (
            <View style={{marginTop:  px2dp(10)}}>
                {orderDetailModel.orderSubType >= 3 ?
                    <View style={styles.containerStyles}>
                        <View style={styles.leftStyles}>
                            <Text style={styles.giftTextStyles} allowFontScaling={false}>礼包</Text>
                        </View>
                        {/*<Text style={styles.giftNameStyles}>{this.props.giftPackageName}</Text>*/}
                    </View>
                    :
                    null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyles:{
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(40)
    },
    leftStyles:{
        borderWidth: 1,
        borderRadius:  px2dp(5),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: DesignRule.mainColor,
        marginLeft:  px2dp(20),
    },
    giftTextStyles:{
        fontSize:  px2dp(11),
        color: DesignRule.mainColor,
        padding:  px2dp(3)
    },
    giftNameStyles:{
        marginLeft:  px2dp(10),
        fontSize:  px2dp(12),
        color: DesignRule.textColor_instruction
    }

})
