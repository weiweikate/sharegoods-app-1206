import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    TextInput,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import bridge from '../../../../utils/bridge';
import StringUtils from '../../../../utils/StringUtils';

/**
 * 选择数量view
 */

export default class RecentSearchView extends Component {
    static propTypes = {
        maxCount: PropTypes.any,
        amountClickAction: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            amount: props.type === 'after' ? this.props.afterAmount : 1
        };
    }

    _leftAction = () => {
        if (this.state.amount === 1) {
            return;
        }
        this.setState({
            amount: this.state.amount - 1
        }, () => {
            this.props.amountClickAction(this.state.amount);
        });

    };

    _rightAction = () => {
        if (this.props.maxCount === this.state.amount) {
            bridge.$toast('超出最大库存~');
            return;
        }
        this.setState({
            amount: this.state.amount + 1
        }, () => {
            this.props.amountClickAction(this.state.amount);
        });
    };

    _onChangeText = (amount) => {
        if (StringUtils.isEmpty(amount)) {
            amount = 0;
        }
        this.setState({ amount: parseInt(amount) }, () => {
            this.props.amountClickAction(this.state.amount);
        });
    };

    _onEndEditing = () => {
        //空0或者最大库存
        if (this.state.amount > this.props.maxCount || StringUtils.isEmpty(this.state.amount) || this.state.amount === 0) {
            this.setState({ amount: 1 }, () => {
                this.props.amountClickAction(this.state.amount);
            });
            if (this.state.amount > this.props.maxCount) {
                bridge.$toast('超出最大库存~');
            }
        }
    };

    render() {
        const { type } = this.props;
        return (
            <View style={[{
                flexDirection: 'row',
                height: 30,
                justifyContent: 'space-between',
                alignItems: 'center'
            }, this.props.style]}>
                <Text style={{ color: '#666666', marginLeft: 16, fontSize: 13 }}>购买数量</Text>
                <View style={{
                    flexDirection: 'row',
                    borderColor: '#dddddd',
                    borderWidth: 1,
                    borderRadius: 2,
                    marginRight: 16,
                    height: 30
                }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                      onPress={this._leftAction} disabled={type === 'after'}>
                        <Text style={{ color: '#dddddd', fontSize: 15, paddingHorizontal: 11 }}>-</Text>
                    </TouchableOpacity>
                    <View style={{ height: 30, width: 1, backgroundColor: '#dddddd' }}/>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={{ width: 92 / 2.0, padding: 0 }}
                            textAlign={'center'}
                            underlineColorAndroid='transparent'
                            onChangeText={this._onChangeText}
                            value={`${this.state.amount}`}
                            onEndEditing={this._onEndEditing}
                            keyboardType='numeric'
                            editable = {type !== 'after'}//false不可编辑
                        />
                    </View>
                    <View style={{ height: 30, width: 1, backgroundColor: '#dddddd' }}/>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                      onPress={this._rightAction} disabled={type === 'after'}>
                        <Text style={{ color: '#222222', fontSize: 15, paddingHorizontal: 11 }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
