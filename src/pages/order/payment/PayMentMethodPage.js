import React from 'react';
import {
    View,Text
}from 'react-native';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';

export default class PayMentMethodPage extends BasePage{
    constructor(props){
        super(props);
        this.state={

        }
    }
    $navigationBarOptions = {
        title: '支付方式',
        show: true // false则隐藏导航
    };
    _render(){
        return(
            <View style={{marginTop:ScreenUtils.isIOSX?44:(ScreenUtils.isIOS?24:20)}}>
                <Text>支持各种币种结款</Text>
            </View>
        )
    }
}
