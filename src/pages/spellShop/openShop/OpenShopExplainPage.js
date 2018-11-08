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
import DesignRule from 'DesignRule';

export default class OpenShopExplainPage extends BasePage {


    $navigationBarOptions = {
        title: '开店'
    };

    _onPress = ()=>{
        this.$navigate('HtmlPage',{
            title:'用户协议内容',
            uri:'https://reg.163.com/agreement_mobile_ysbh_wap.shtml?v=20171127'
        })
    }

    _clickOpen = () => {
        this.$navigate('spellShop/openShop/CashExplainPage');
    };

    _renderRow = (title, index, maxIndex) => {
        return (
            <View style={{ width: ScreenUtils.width }} key={index}>

                <View style={{ marginHorizontal: 15 }}>

                    {index !== 0 ?
                        <View style={{ marginLeft: 8, width: 2, backgroundColor: DesignRule.mainColor, height: 33 }}/> : null}

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <View style={styles.circle}>
                                <Text style={styles.circleText}>{index + 1}</Text>
                            </View>
                            {index !== maxIndex - 1 ?
                                <View style={{ marginLeft: 8, width: 2, backgroundColor: DesignRule.mainColor, flex: 1 }}/> : null}
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
                    fontSize: 17,
                    color: '#000000'
                }}>拼店规则说明</Text>
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
                            fontSize: 17,
                            color: 'white'
                        }}>我要开店</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.descText}>点击我要开店则默认同意</Text>
                        <TouchableOpacity onPress = {this._onPress}>
                            <Text style={[styles.descText, { color: DesignRule.mainColor }]}>《拼店管理条例》</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    circle: {
        width: 18,
        height: 18,
        backgroundColor: DesignRule.mainColor,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9
    },
    circleText: {
        fontSize: 12,
        color: 'white'
    },
    desc: {
        marginLeft: 8,
        marginRight: 0,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    btnStyle: {
        width: 170,
        height: 50,
        borderRadius: 25,
        backgroundColor: DesignRule.mainColor,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    descText: {
        paddingVertical: 10,
        fontSize: 11,
        color: DesignRule.textColor_instruction,
        textAlign: 'center'
    }
});
