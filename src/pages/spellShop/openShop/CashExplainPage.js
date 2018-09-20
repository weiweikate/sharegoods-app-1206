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

export default class CashExplainPage extends BasePage {


    $navigationBarOptions = {
        title: '开店'
    };


    _clickOpen = () => {
        this.$navigate('spellShop/shopSetting/SetShopNamePage');
    };

    _renderRow = (title, index, maxIndex) => {
        return (
            <View style={{ width: ScreenUtils.width }} key={index}>

                <View style={{ marginHorizontal: 15 }}>

                    {index !== 0 ?
                        <View style={{ marginLeft: 8, width: 2, backgroundColor: '#d51243', height: 33 }}/> : null}

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <View style={styles.circle}>
                                <Text style={styles.circleText}>{index + 1}</Text>
                            </View>
                            {index !== maxIndex - 1 ?
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
            '保证金为可退还金额，店主申请解散或者店铺转让平 台都会在7个工作日内将保证金退还余额账户；',
            '保证金的缴纳是为了给参与者提供一个更好的交易合 作环境，发起招募者作为店铺今后的管理者，有义务 为拼店参与者建立保障基础',
            '保证金的缴纳，只有在发起店铺时仅一次，如有其他 自称平台的运营与您沟通保证金为问题，请注意做出 判断，切勿上当受骗；',
            '保证金的缴纳可使用余额，代币，等第三方支付平台 账户进行支付，不可使用其他方式抵扣；'
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
