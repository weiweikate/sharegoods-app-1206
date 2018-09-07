//开店页面
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
//source
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';

export default class OpenShopExplainPage extends BasePage {


    $navigationBarOptions = {
        title: '开店'
    };


    _clickOpen = () => {
        this.$navigate('spellShop/openShop/CashExplainPage');
    };

    _renderRow = (title, index, maxIndex) => {
        return (
            <View style={{ width: ScreenUtils.width }} key={index}>

                <View style={{ marginHorizontal: 15 }}>

                    {index != 0 ?
                        <View style={{ marginLeft: 8, width: 2, backgroundColor: '#d51243', height: 33 }}/> : null}

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <View style={styles.circle}>
                                <Text style={styles.circleText}>{index + 1}</Text>
                            </View>
                            {index != maxIndex - 1 ?
                                <View style={{ marginLeft: 8, width: 2, backgroundColor: '#d51243', flex: 1 }}/> : null}
                        </View>

                        <Text style={styles.desc}>{title}</Text>

                    </View>
                </View>

            </View>

        );
    };

    _render() {

        const arr = [
            'V4级别用户才可开设店铺',
            '开设店铺需缴纳保证金',
            '开设店铺需要达到30人才可开设成功',
            '店铺开设成功后，店主可邀请好友加入店铺',
            '开设店铺需缴纳店租',
            '店铺等级划分为3级，每个级别的店铺人数和开启分红金额不等，等于越高，店长分红就越高'
        ];

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{
                    alignSelf: 'center',
                    marginTop: 41,
                    fontFamily: 'PingFang-SC-Medium',
                    fontSize: 17,
                    color: '#000000'
                }}>保证金缴纳说明</Text>
                <View style={{ marginTop: 32 }}>
                    {
                        arr.map((item, index) => {
                            return this._renderRow(item, index, arr.length);
                        })
                    }
                </View>
                <View style={{
                    alignItems: 'center',
                    marginTop: ScreenUtils.autoSizeHeight(70)
                }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={this._clickOpen} style={styles.btnStyle}>
                        <Text style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 15,
                            color: '#ffffff'
                        }}>缴纳保证金</Text>
                    </TouchableOpacity>
                    <Text style={styles.descText}>点击缴纳则默认已阅读并同意缴纳保证金</Text>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    circle: {
        width: 18,
        height: 18,
        backgroundColor: '#d51243',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9
    },
    circleText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 12,
        color: 'white'
    },
    desc: {
        marginLeft: 8,
        marginRight: 0,
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#222222'
    },
    btnStyle: {
        width: 170,
        height: 43,
        borderRadius: 5,
        backgroundColor: '#d51243',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    descText: {
        marginTop: 10,
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 11,
        color: '#999999',
        textAlign: 'center'
    }
});
