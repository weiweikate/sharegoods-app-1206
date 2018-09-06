import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';

export default class CouponsPage extends Component {

    constructor(props) {
        super(props);
    }

    static $PageOptions = {
        navigationBarOptions: {
            title:'优惠券'
        },
        renderByPageState: true
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
                <Text>Coupons</Text>
            </View>
        );
    }
}
