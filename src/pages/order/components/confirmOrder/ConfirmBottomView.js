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
import { observer } from 'mobx-react';

@observer
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
                            value={'¥'}
                            style={styles.commitAmountStyle}/>
                        <UIText
                            value={(confirmOrderModel.payInfo.payAmount || '0')}
                            style={[styles.commitAmountStyle,{fontSize: ScreenUtils.px2dp(18),  marginRight: ScreenUtils.autoSizeWidth(15)}]}/>

                    </View>
                    <NoMoreClick
                        style={[styles.commitTouStyle,{backgroundColor: StringUtils.isEmpty(confirmOrderModel.err)&&confirmOrderModel.productOrderList.length ? DesignRule.mainColor : DesignRule.textColor_placeholder}]}
                        onPress={() => {
                                this.props.commitOrder();
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
    },
    commitTouStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: ScreenUtils.autoSizeHeight(49)
    }
});
