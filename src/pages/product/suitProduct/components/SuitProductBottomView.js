import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';

@observer
export default class SuitProductBottomView extends Component {
    render() {
        const {
            isSuitFixed, totalSubMoney, totalPayMoney,
            selectedAmount, addAmount, subAmount, canAddAmount,
            packageItem
        } = this.props.suitProductModel;
        const { singlePurchaseNumber } = packageItem;
        return (
            <View style={styles.bgView}>
                {
                    isSuitFixed && <View style={styles.amountView}>
                        <View style={styles.amountLeft}>
                            <MRText style={{ color: DesignRule.textColor_mainTitle, fontSize: 14, marginRight: 10 }}>
                                购买数量
                            </MRText>
                            {singlePurchaseNumber ?
                                <MRText style={{ color: DesignRule.textColor_instruction, fontSize: 10 }}>
                                    最多可购买{singlePurchaseNumber}个
                                </MRText> : null}
                        </View>
                        <View style={styles.amountRight}>
                            <NoMoreClick style={styles.amountCount} onPress={subAmount}>
                                <MRText style={{ color: DesignRule.textColor_mainTitle, fontSize: 12 }}>-</MRText>
                            </NoMoreClick>
                            <View style={styles.amountCountView}>
                                <MRText style={{
                                    color: selectedAmount === 1 ? DesignRule.textColor_placeholder : DesignRule.textColor_mainTitle,
                                    fontSize: 10
                                }}>{selectedAmount}</MRText>
                            </View>
                            <NoMoreClick style={styles.amountCount} onPress={addAmount}>
                                <MRText style={{
                                    color: canAddAmount ? DesignRule.textColor_mainTitle : DesignRule.textColor_placeholder,
                                    fontSize: 12
                                }}>+</MRText>
                            </NoMoreClick>
                        </View>
                    </View>
                }
                <View style={styles.container}>
                    <View style={styles.leftView}>
                        <MRText style={styles.leftTopText1}>套餐价：<MRText
                            style={styles.leftTopText2}>￥{totalPayMoney}</MRText></MRText>
                        <MRText style={styles.leftBottomText1}>为你节省￥{totalSubMoney}</MRText>
                    </View>
                    <NoMoreClick onPress={this.props.bottomAction}>
                        <LinearGradient style={styles.rightBtn}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FC5D39', '#FF0050']}>
                            <MRText style={styles.rightText}>立即购买</MRText>
                        </LinearGradient>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        paddingBottom: ScreenUtils.safeBottom, backgroundColor: 'white',
        borderTopLeftRadius: 15, borderTopRightRadius: 15
    },

    amountView: {
        height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    amountLeft: {
        marginLeft: 15, flexDirection: 'row', alignItems: 'center'
    },
    amountRight: {
        marginRight: 15, flexDirection: 'row', alignItems: 'center'
    },
    amountCountView: {
        width: 34, justifyContent: 'center', alignItems: 'center'
    },
    amountCount: {
        backgroundColor: DesignRule.bgColor,
        borderRadius: 3, width: 20, height: 20, justifyContent: 'center', alignItems: 'center'
    },

    container: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 48
    },
    leftView: {
        marginLeft: 15, justifyContent: 'center'
    },
    leftTopText1: {
        fontSize: 12, color: DesignRule.textColor_mainTitle
    },
    leftTopText2: {
        fontSize: 17, color: DesignRule.textColor_redWarn, fontWeight: '400'
    },
    leftBottomText1: {
        fontSize: 10, color: DesignRule.textColor_redWarn
    },
    rightBtn: {
        alignItems: 'center', justifyContent: 'center', marginRight: 15,
        height: 40, width: ScreenUtils.px2dp(100), borderRadius: 20
    },
    rightText: {
        fontSize: 14, color: DesignRule.white, fontWeight: '400'
    }
});
