import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../../utils/ScreenUtils';

@observer
export default class SuitProductBottomView extends Component {
    render() {
        const { totalSubMoney } = this.props.suitProductModel;
        return (
            <View style={styles.bgView}>
                <View style={styles.container}>
                    <View style={styles.leftView}>
                        <MRText style={styles.leftTopText1}>合计：<MRText style={styles.leftTopText2}>1</MRText></MRText>
                        <MRText style={styles.leftBottomText1}>活动已减<MRText
                            style={styles.leftBottomText2}>{totalSubMoney}元</MRText></MRText>
                    </View>
                    <NoMoreClick>
                        <MRText>
                            立即购买
                        </MRText>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        paddingBottom: ScreenUtils.safeBottom, backgroundColor: 'white'
    },
    container: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 48
    },
    leftView: {
        marginLeft: 15, justifyContent: 'center'
    },
    leftTopText1: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    leftTopText2: {
        fontSize: 17, color: DesignRule.textColor_redWarn
    },
    leftBottomText1: {
        fontSize: 12, color: DesignRule.textColor_instruction
    },
    leftBottomText2: {
        fontSize: 12, color: DesignRule.textColor_redWarn
    },
    rightBtn: {
        alignItems: 'center', justifyContent: 'space-between',
        height: 34, width: ScreenUtils.px2dp(100), borderRadius: 17, backgroundColor: DesignRule.bgColor_redCard
    },
    rightText: {
        fontSize: 14, color: DesignRule.white, fontWeight: 'bold'
    }
});
