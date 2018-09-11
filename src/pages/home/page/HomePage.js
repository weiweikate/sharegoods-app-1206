import React, { Component } from 'react';
import {
    Text
} from 'react-native';

export default class HomePage extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <Text style={{ flex: 1, justifyContent: 'center', paddingTop: 100 }} onPress={this.gotoLogin}>
                home
            </Text>
        );
    }

    gotoLogin = () => {
        this.props.navigation.navigate('login/login/LoginPage');
    };
}
