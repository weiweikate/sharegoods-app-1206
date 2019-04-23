import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';

@observer
export default class SuitProductBottomView extends Component {
    render() {
        return (
            <View>
                <View>
                    <MRText style={styles.leftTopText1}>合计：<MRText style={styles.leftTopText2}></MRText></MRText>
                    <MRText style={styles.leftBottomText1}>活动已减<MRText style={styles.leftBottomText2}></MRText></MRText>
                </View>
                <NoMoreClick>
                    <MRText>
                        立即购买
                    </MRText>
                </NoMoreClick>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'white'
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
    }
});
