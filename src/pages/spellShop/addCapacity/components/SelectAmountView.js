import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    TouchableOpacity,
    StyleSheet
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
            //ios modal
            amount: props.amount || 0
        };
    }

    componentWillReceiveProps(nextProps) {
        const { amount } = nextProps;
        //安卓modal
        this.setState({
            amount
        });
    }

    _leftAction = () => {
        const { amount } = this.state;
        const { amountChangeAction } = this.props;
        if (amount <= 0) {
            return;
        }
        this.setState({
            amount: amount - 1
        }, () => {
            amountChangeAction(this.state.amount);
        });

    };

    _rightAction = () => {
        const { amount } = this.state;
        const { amountChangeAction, maxCount } = this.props;
        if (maxCount <= amount) {
            return;
        }
        this.setState({
            amount: amount + 1
        }, () => {
            amountChangeAction(this.state.amount);
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
        if (StringUtils.isEmpty(this.state.amount)) {
            this.setState({ amount: 0 }, () => {
                this.props.amountChangeAction(this.state.amount);
            });
            return;
        }
        if (this.state.amount > this.props.maxCount) {
            bridge.$toast('超出最大券数~');
            this.setState({ amount: this.props.maxCount }, () => {
                this.props.amountChangeAction(this.state.amount);
            });
        }
    };

    render() {
        const { maxCount } = this.props;

        const leftColor = this.state.amount > 0 ? DesignRule.textColor_mainTitle : DesignRule.lineColor_inGrayBg;
        const rightColor = this.state.amount !== maxCount ? DesignRule.textColor_mainTitle : DesignRule.lineColor_inGrayBg;

        return (
            <View style={[styles.containerView, this.props.style]}>
                <Text style={{ color: DesignRule.textColor_secondTitle, fontSize: 13 }}>请选择券数</Text>
                <View style={styles.amountView}>
                    <TouchableOpacity style={styles.btn} onPress={this._leftAction}>
                        <Text style={[styles.btnText, { color: leftColor }]}>-</Text>
                    </TouchableOpacity>
                    <View style={{ height: 28, width: 1, backgroundColor: DesignRule.lineColor_inGrayBg }}/>
                    <View style={{ justifyContent: 'center' }}>
                        <TextInput style={{ width: 92 / 2.0, padding: 0, color: DesignRule.textColor_mainTitle }}
                                   textAlign={'center'}
                                   value={this.state.amount + ''}
                                   onChangeText={this._onChangeText}
                                   onEndEditing={this._onEndEditing}
                                   keyboardType='numeric'/>
                    </View>
                    <View style={{ height: 28, width: 1, backgroundColor: DesignRule.lineColor_inGrayBg }}/>
                    <TouchableOpacity style={styles.btn} onPress={this._rightAction}>
                        <Text style={[styles.btnText, { color: rightColor }]}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        height: 30
    },
    amountView: {
        flexDirection: 'row',
        borderColor: DesignRule.lineColor_inGrayBg, borderWidth: 1, borderRadius: 2
    },
    btnText: {
        fontSize: 15, paddingHorizontal: 11
    },
    btn: {
        justifyContent: 'center', alignItems: 'center'
    }
});
