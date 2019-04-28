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
        const { totalSubMoney, totalPayMoney } = this.props.suitProductModel;
        return (
            <View style={styles.bgView}>
                <View style={styles.container}>
                    <View style={styles.leftView}>
                        <MRText style={styles.leftTopText1}>合计：<MRText
                            style={styles.leftTopText2}>￥{totalPayMoney}</MRText></MRText>
                        <MRText style={styles.leftBottomText1}>活动已减<MRText
                            style={styles.leftBottomText2}>￥{totalSubMoney}</MRText></MRText>
                    </View>

                    <NoMoreClick onPress={() => {
                        this.props.bottomAction();
                    }}>
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
        alignItems: 'center', justifyContent: 'center', marginRight: 15,
        height: 34, width: ScreenUtils.px2dp(100), borderRadius: 17
    },
    rightText: {
        fontSize: 14, color: DesignRule.white, fontWeight: 'bold'
    }
});
