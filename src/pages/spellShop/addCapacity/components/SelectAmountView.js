import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    TouchableOpacity
} from 'react-native';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from '../../../../constants/DesignRule';
import { MRText as Text, MRTextInput as TextInput } from '../../../../components/ui/index';

export default class SelectAmountView extends Component {
    static propTypes = {
        maxCount: PropTypes.any,
        amountChangeAction: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            amount: 1
        };
    }

    _leftAction = () => {
        const { amount } = this.state;
        const { amountChangeAction } = this.props;
        if (amount <= 1) {
            return;
        }
        this.setState({
            amount: amount - 1
        }, () => {
            amountChangeAction(amount);
        });

    };

    _rightAction = () => {
        const { amount } = this.state;
        const { amountChangeAction, maxCount } = this.props;
        if (maxCount <= amount) {
            bridge.$toast('超出最大库存~');
            return;
        }
        if (amount === 200) {
            bridge.$toast('最多只能购买200件~');
            return;
        }
        this.setState({
            amount: amount + 1
        }, () => {
            amountChangeAction(amount);
        });
    };

    _onChangeText = (amount) => {
        if (StringUtils.isEmpty(amount)) {
            amount = 0;
        }
        this.setState({ amount: parseInt(amount) }, () => {
            this.props.amountChangeAction(this.state.amount);
        });
    };

    _onEndEditing = () => {
        //空0
        if (StringUtils.isEmpty(this.state.amount) || this.state.amount === 0) {
            this.setState({ amount: 1 }, () => {
                this.props.amountChangeAction(this.state.amount);
            });
            return true;
        }
        //小于最大值&&>200
        if (this.state.amount > 200 && this.props.maxCount > 200) {
            bridge.$toast('最多只能购买200件~');
            this.setState({ amount: 200 }, () => {
                this.props.amountChangeAction(this.state.amount);
            });
            return true;
        } else if (this.state.amount > this.props.maxCount) {//超出库存
            bridge.$toast('超出最大库存~');
            this.setState({ amount: this.props.maxCount }, () => {
                this.props.amountChangeAction(this.state.amount);
            });
            return true;
        }
    };

    componentWillReceiveProps(nextProps) {
        const { maxCount } = nextProps;
        if (this.state.amount > maxCount && maxCount > 0) {
            this.setState({
                amount: maxCount
            }, () => {
                if (this.state.amount > 0) {
                    bridge.$toast('超出最大库存~');
                }

                this.props.amountClickAction(maxCount);
            });
        }
    }


    render() {
        const { maxCount } = this.props;

        let leftEnable = this.state.amount > 1;
        let rightEnable = this.state.amount !== maxCount;

        return (
            <View style={[{
                flexDirection: 'row',
                height: 30,
                justifyContent: 'space-between',
                alignItems: 'center'
            }, this.props.style]}>
                <Text style={{ color: DesignRule.textColor_secondTitle, marginLeft: 16, fontSize: 13 }}
                      allowFontScaling={false}>购买数量</Text>
                <View style={{
                    flexDirection: 'row',
                    borderColor: DesignRule.lineColor_inGrayBg,
                    borderWidth: 1,
                    borderRadius: 2,
                    marginRight: 16
                }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                      onPress={this._leftAction}>
                        <Text style={{
                            color: leftEnable ? DesignRule.textColor_mainTitle : DesignRule.lineColor_inGrayBg,
                            fontSize: 15,
                            paddingHorizontal: 11
                        }} allowFontScaling={false}>-</Text>
                    </TouchableOpacity>
                    <View style={{ height: 28, width: 1, backgroundColor: DesignRule.lineColor_inGrayBg }}/>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={{ width: 92 / 2.0, padding: 0, color: DesignRule.textColor_mainTitle }}
                            textAlign={'center'}
                            onChangeText={this._onChangeText}
                            value={`${this.state.amount}`}
                            onEndEditing={this._onEndEditing}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={{ height: 28, width: 1, backgroundColor: DesignRule.lineColor_inGrayBg }}/>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                      onPress={this._rightAction}>
                        <Text style={{
                            color: rightEnable ? DesignRule.textColor_mainTitle : DesignRule.lineColor_inGrayBg,
                            fontSize: 15,
                            paddingHorizontal: 11
                        }} allowFontScaling={false}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
