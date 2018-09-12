import React, { Component } from 'react';
import {
    Text,View
} from "react-native";


export default class HomePage extends Component {

    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <Text style={{ justifyContent: 'center', paddingTop: 100 }} onPress={this.gotoLogin}>
                    home
                </Text>
                <Text style={{ alignItems: 'center', paddingTop: 150 }} onPress={this.gotoProduct}>
                    gotoMyOrder
                </Text>
            </View>

        )
    }
    // gotoLogin=()=>{
    //     this.props.navigation.navigate('home/search/SearchPage')

    gotoLogin = () => {
        this.props.navigation.navigate('login/login/LoginPage')
    }
    gotoProduct = () => {
        this.props.navigation.navigate('order/order/MyOrdersListPage',{index:0})

    }
}
