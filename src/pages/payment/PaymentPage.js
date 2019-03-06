import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import res from './res'
import BasePage from '../../BasePage';
import { observer } from 'mobx-react/native';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import { MRText as Text } from '../../components/ui';

const { px2dp } = ScreenUtils;

@observer
export default class PaymentPage extends BasePage {

    $navigationBarOptions = {
        title: '订单支付',
        show: true // false则隐藏导航
    };

    handleBackPress = () => {
        return this.payment.isShowResult;
    };

    constructor(props) {
        super(props);
    }

    $NavBarLeftPressed = () => {
        this.$navigateBack();
    }

    goToPay() {

    }

    _render() {
        return <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name}>订单名称： 华格仕304不锈钢炒锅无油烟不</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.row}>
                    <Text style={styles.text}>需支付金额：</Text>
                    <Text style={styles.money}>$1999</Text>
                </View>
            </View>
            <View style={styles.balanceContent}>
                <Image style={styles.iconBalance} source={res.balance}/>
                <Text style={styles.text}>现金账户</Text>
                <View style={{flex: 1}}/>
                <Text style={styles.name}>可用金额: 0.00元</Text>
                <Image style={styles.iconCheck} source={res.uncheck}/>
            </View>
            <View style={styles.needView}>
            <Text style={styles.need}>需付金额</Text>
            <Text style={styles.amount}>$1999</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => {this.goToPay()}}>
            <View style={styles.payBtn}>
                <Text style={styles.payText}>去支付</Text>
            </View>
            </TouchableWithoutFeedback>
        </View>;
    }
}

const bgColor = '#f2f2f2'
const whiteBg = '#fff'
const buttonBg = '#FF0050'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColor
    },
    content: {
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        height: px2dp(100),
        backgroundColor: whiteBg,
        borderRadius: 5
    },
    balanceContent: {
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10),
        height: px2dp(50),
        backgroundColor: whiteBg,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    row: {
        height: px2dp(50),
        flexDirection: 'row',
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10),
        alignItems: 'center'
    },
    name: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13)
    },
    line: {
        height: ScreenUtils.onePixel,
        backgroundColor: DesignRule.lineColor_inWhiteBg
    },
    text: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(13)
    },
    money: {
        color: DesignRule.mainColor,
        fontSize: px2dp(13)
    },
    iconBalance: {
        width: px2dp(24),
        height: px2dp(24),
        marginRight: px2dp(10)
    },
    iconCheck: {
        marginLeft: px2dp(10),
        width: px2dp(20),
        height: px2dp(20)
    },
    need: {
        marginTop: px2dp(30),
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(13)
    },
    amount: {
        marginTop: px2dp(10),
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(30),
        fontWeight: '600'
    },
    needView: {
        flex: 1,
        alignItems: 'center'
    },
    payBtn: {
        backgroundColor: buttonBg,
        marginBottom: ScreenUtils.safeBottom + 20,
        height: px2dp(44),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(22),
        alignItems: 'center',
        justifyContent: 'center'
    },
    payText: {
        color: whiteBg,
        fontSize: px2dp(17)
    }
});

