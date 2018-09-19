import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import { color } from '../../../constants/Theme';
import arrow_right from '../../order/res/arrow_right.png';
import {
    UIText, UIImage,NoMoreClick
} from '../../../components/ui';
// status,//账单状态：0出账中，1待支付，2已支付，3逾期
const CashAccountItem = props => {
    const {
        type,
        time,
        serialNumber,
        capital,
        iconImage,
        clickItem,
        capitalRed
    } = props;

    return (
        <View>
            <NoMoreClick style={styles.container} onPress={clickItem}>
                <View style={{ height: 90, justifyContent: 'center' }}>
                    <UIImage source={iconImage}
                             style={{ height: 50, width: 50, marginLeft: 16 }}/>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <UIText value={type}/>
                    <UIText value={time} style={{ color: color.black_999, fontSize: 13 }}/>
                    <UIText value={serialNumber} style={{ color: color.black_999, fontSize: 13 }}/>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <View
                        style={{ marginRight: 15, height: 60, justifyContent: 'space-between' }}>
                        <UIText value={capital}  style={{ color: capitalRed ? color.red : color.blue_222, fontSize: 16 }}/>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <UIImage source={arrow_right} style={{ height: 10, width: 7 }}/>
                        </View>
                        <UIText value={''}/>
                    </View>
                </View>
            </NoMoreClick>
            <View style={{ flex: 1, height: 1, backgroundColor: color.white }}>
                <View
                    style={{ flex: 1, height: 1, backgroundColor: color.line, marginLeft: 15 }}/>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        flexDirection: 'row',
        height: 90,
        alignItems: 'center'

    }
});
export default CashAccountItem;
