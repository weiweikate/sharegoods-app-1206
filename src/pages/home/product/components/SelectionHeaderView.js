import React, { Component } from 'react';

import {
    Text,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';

/**
 * 规格选择头部view
 */

export default class SelectionHeaderView extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{
                    marginLeft: 10,
                    marginTop: -20,
                    height: 110,
                    width: 110,
                    borderColor: '#EEEEEE',
                    borderWidth: 1,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image style={{ width: 108, height: 108, borderRadius: 5, backgroundColor: 'red' }}/>
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={{
                        color: '#D51243',
                        fontSize: 16,
                        fontFamily: 'PingFang-SC-Medium',
                        marginTop: 16
                    }}>￥455.50</Text>
                    <Text style={{ color: '#222222', fontSize: 13, marginTop: 8 }}>库存454654件</Text>
                    <Text style={{ color: '#222222', fontSize: 13, marginTop: 8 }}>银色</Text>
                </View>
                <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
                    <Image style={{
                        marginRight: 16,
                        marginTop: 19,
                        width: 23,
                        height: 23
                    }}/>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

