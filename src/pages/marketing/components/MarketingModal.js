/**
 * @author xzm
 * @date 2019/10/16
 */
import React, {PureComponent} from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import {marketingUtils} from '../MarketingUtils';

export default class MarketingModal extends PureComponent {
    render() {
        return (
            <TouchableWithoutFeedback onPress={()=>{
                marketingUtils.closeModal();
            }}>
                <View style={styles.contain}/>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    contain: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ScreenUtils.width,
        height: ScreenUtils.height,
        backgroundColor:'rgba(0,0,0,0.2)',
        zIndex:1000
    }
});
