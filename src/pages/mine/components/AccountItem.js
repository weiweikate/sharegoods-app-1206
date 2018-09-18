import React from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';
import MoreClickComponet from '../../../components/ui/NoMoreClick';
import { color } from '../../../constants/Theme';
import questionImage_gray from '../res/userInfoImg/questionImage_gray.png';
import {
    UIText, UIImage
} from '../../../components/ui';
// status,//账单状态：0出账中，1待支付，2已支付，3逾期
const AccountItem = props => {
    const {
        type,
        time,
        serialNumber,
        capital,
        iconImage,
        clickItem,
        capitalRed,
        needQuestionImage = false
    } = props;


    this.renderDetail = () => {
        if (needQuestionImage) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={questionImage_gray} style={{ width: 13, height: 13 }}/>
                    <UIText value={serialNumber} style={{ color: color.black_999, fontSize: 13 }}/>
                </View>
            );
        } else {
            return (
                <UIText value={serialNumber} style={{ color: color.black_999, fontSize: 13 }}/>
            );
        }
    };
    return (
        <View>
            <MoreClickComponet style={styles.container} onPress={clickItem}>
                <View style={{ height: 90, justifyContent: 'center' }}>
                    <UIImage source={iconImage} style={{ height: 50, width: 50, marginLeft: 16 }}/>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <UIText value={type}/>
                    <UIText value={time}
                            style={{ color: color.black_999, fontSize: 13, marginTop: serialNumber == '' ? 10 : 0 }}/>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <View style={{ marginRight: 15, height: 60, justifyContent: 'space-between' }}>
                        <UIText value={capital}
                                style={{ color: capitalRed ? color.red : color.blue_222, fontSize: 16 }}/>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        </View>
                        <UIText value={''}/>
                    </View>
                </View>
            </MoreClickComponet>
            <View style={{ flex: 1, height: 1, backgroundColor: color.white }}>
                <View style={{ flex: 1, height: 1, backgroundColor: color.line, marginLeft: 15 }}/>
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
export default AccountItem;
