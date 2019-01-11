import React, { Component } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import {
    UIText, NoMoreClick
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import { confirmOrderModel } from '../../model/ConfirmOrderModel';
import bridge from '../../../../utils/bridge';

export default class ConfirmBottomView extends Component {

    render() {
        return (
            <View>
                {this.renderLine()}
                <View style={styles.commitOutStyle}>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                        <UIText value={'应付款：'} style={{
                            fontSize: ScreenUtils.px2dp(15),
                            color: DesignRule.textColor_mainTitle
                        }}/>
                        <UIText
                            value={StringUtils.formatMoneyString(confirmOrderModel.payAmount)}
                            style={styles.commitAmountStyle}/>
                    </View>
                    <NoMoreClick
                        style={styles.commitTouStyle}
                        onPress={() => {
                            bridge.showLoading();
                            setTimeout(() => {
                                this.props.commitOrder();
                            }, 200);
                        }}>
                        <UIText value={'提交订单'}
                                style={{
                                    fontSize: ScreenUtils.px2dp(16),
                                    color: 'white',
                                    paddingLeft: 15,
                                    paddingRight: 15
                                }}/>
                    </NoMoreClick>
                </View>
                {this.renderLine()}
            </View>
        );
    }

    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
}
const styles = StyleSheet.create({
    commitOutStyle: {
        height: ScreenUtils.autoSizeHeight(49),
        flexDirection: 'row',
        backgroundColor: DesignRule.white,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    commitAmountStyle: {
        fontSize: ScreenUtils.px2dp(15),
        color: DesignRule.mainColor,
        marginRight: ScreenUtils.autoSizeWidth(15)
    },
    commitTouStyle: {
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        height: ScreenUtils.autoSizeHeight(49)
    }
});
