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
import LinearGradient from 'react-native-linear-gradient';

@observer
export default class ConfirmBottomView extends Component {

    render() {
        let available = StringUtils.isEmpty(confirmOrderModel.err)&&confirmOrderModel.productOrderList.length;
        let colors = available?['#FF0050','#FC5D39']:["#999999","#aaaaaa"]
        return (
            <View>
                {this.renderLine()}
                <View style={styles.commitOutStyle}>
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
                        <UIText value={'应付款：'} style={{
                            fontSize: ScreenUtils.px2dp(12),
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
                        onPress={() => {
                                this.props.commitOrder();
                        }}>
                        <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                                        colors={colors}
                                        style={{ alignItems: "center",
                                            justifyContent: 'center',
                                            width: ScreenUtils.autoSizeWidth(100),
                                            borderRadius: ScreenUtils.autoSizeWidth(17),
                                            overflow: 'hidden',
                                            height: ScreenUtils.autoSizeWidth(34),
                                            marginRight: ScreenUtils.autoSizeWidth(15)
                                        }}
                        >
                        <UIText value={'提交订单'}
                                style={{
                                    fontSize: ScreenUtils.px2dp(16),
                                    color: 'white',
                                }}/>
                        </LinearGradient>
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
        fontSize: ScreenUtils.px2dp(12),
        color: DesignRule.mainColor,
    },
    commitTouStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: ScreenUtils.autoSizeHeight(49),
    }
});
