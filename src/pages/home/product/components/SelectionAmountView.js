import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';

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
            amount: 1
        };
    }

    _leftAction = () => {
        if (this.state.amount === 1) {
            return;
        }
        this.setState({
            amount: this.state.amount - 1
        },()=>{this.props.amountClickAction(this.state.amount)});

    };

    _rightAction = () => {
        this.setState({
            amount: this.state.amount + 1
        },()=>{this.props.amountClickAction(this.state.amount)});
    };

    render() {
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
                    height:30
                }}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                      onPress={this._leftAction}>
                        <Text style={{ color: '#dddddd', fontSize: 15,paddingHorizontal: 11}}>-</Text>
                    </TouchableOpacity>
                    <View style = {{height:30,width:1,backgroundColor:'#dddddd'}}/>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ paddingHorizontal: 15 }}>{this.state.amount}</Text>
                    </View>
                    <View style = {{height:30,width:1,backgroundColor:'#dddddd'}}/>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                      onPress={this._rightAction}>
                        <Text style={{ color: '#222222', fontSize: 15,paddingHorizontal: 11 }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
