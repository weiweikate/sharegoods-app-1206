//支付消息结果页面
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import {
    UIImage
} from '../../components/ui';
import { color } from '../../constants/Theme';
import ScreenUtils from '../../utils/ScreenUtils';
import StringUtils from '../../utils/StringUtils';
import BasePage from '../../BasePage';
import arrow_right from '../order/res/arrow_right.png';
import DateUtils from '../../utils/DateUtils';

const payTypes = [1, 2, 4, 8, 16];
const payTexts = ['纯平台', '微信(小程序)', '微信(APP)', '支付宝', '银联'];

export default class PayMessagePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            data: null,
            paymt: ''
        };
    }

    $navigationBarOptions = {
        title: '支付详情',
        show: true // false则隐藏导航
    };

    getPayType(type) {
        let way = '';
        for (let i = 0; i < payTypes.length; i++) {
            if (type & payTypes[i]) {
                way = way + payTexts[i] + ',';
            }
        }
        way = way.substring(0, way.length - 1);
        return way;
    }


    renderTypeView() {
        if (this.params.type === 'pay_success') {
            return this.renderSuccess();
        }

        if (this.params.type === 'pay_refund') {
            return this.renderFail();
        }
    }

    toHelperPage = () => {
        this.$navigate('mine/helper/HelperFeedbackPage');
    };

    commitQuestion = () => {
        this.$navigate('mine/helper/MyHelperPage');
    };

    renderSuccess() {
        return (
            <View style={{ backgroundColor: color.blue_4a9, borderRadius: 3 }}>
                <Text style={{ color: 'white', margin: 1, fontSize: 11 }}>交易成功</Text>
            </View>
        );

    }

    renderFail() {
        return (
            <View style={{ backgroundColor: '#FF7E00', borderRadius: 3 }}>
                <Text style={{ color: 'white', margin: 1, fontSize: 11 }}>退款成功</Text>
            </View>
        );
    }

    _render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={{
                        height: 131,
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 20
                    }}>
                        <Text style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 15, color: '#222222' }}>支付订单</Text>
                        <Text style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 24,
                            color: '#222222'
                        }}>-{StringUtils.formatMoneyString(this.params.tradeAmount, false)}</Text>
                        {this.renderTypeView()}
                    </View>
                    <View style={{ height: 10 }}/>
                    <NewsDetailItem titles={'付款方式'} rightmg={this.getPayType(this.params.payType)} isshow={false}/>
                    <NewsDetailItem titles={'创建时间'}
                                    rightmg={DateUtils.getFormatDate(this.params.time / 1000)}
                                    isshow={false}/>
                    <NewsDetailItem titles={'订单号'} rightmg={this.params.orderNum} isshow={false}/>
                    <View style={{ height: 10 }}/>
                    <NewsDetailItem titles={'订单疑问'} isshow={true} onPresses={() => this.toHelperPage()}/>
                    <NewsDetailItem titles={'投诉'} isshow={true} onPresses={() => this.commitQuestion()}/>
                </View>
            </View>
        );
    }

    showTitle() {
        this.$navigate('mine/MyHelperPage');
    }
}

class NewsDetailItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this.props.onPresses && this.props.onPresses()}>
                <View>
                    <View style={[styles.textitems, {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }]}>
                        <Text style={styles.textsingle}>{this.props.titles}</Text>
                        <Text style={styles.textsingle}>{this.props.rightmg}</Text>
                        {this.props.isshow ?
                            <UIImage source={arrow_right} style={{ width: 7, height: 10, marginRight: 13 }}/> : null}
                    </View>
                    <View style={{ height: 1, backgroundColor: '#f7f7f7', width: ScreenUtils.width }}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    textitems: {
        width: ScreenUtils.width,
        height: 44,
        backgroundColor: '#ffffff',
        borderStyle: 'solid'
    },
    textsingle: {
        fontFamily: 'PingFang-SC-Regular',
        fontSize: 13,
        color: '#999999',
        marginLeft: 16,
        marginRight: 13
    },
    bohuicontainerStyle: {
        margin: 15,
        width: ScreenUtils.width - 30,
        height: 111,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(153, 153, 153, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1
    },
    tilteposition: {
        // fontFamily: "PingFang-SC-Bold",
        fontSize: 15,
        color: '#e60012',
        marginLeft: 14
    },
    typetitleStyle: {
        height: 49,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    }

});
