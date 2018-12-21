import React, { Component } from 'react';
import {
    View
} from 'react-native';

import HttpUtils from '../../../api/network/HttpUtils';
import {MRText as Text} from '../../../components/ui'

export default class testNav extends Component {

    /*页面配置*/
    static $PageOptions = {
        navigationBarOptions: {
            title: null
            // show: false // 是否显示导航条 默认显示
        },
        renderByPageState: false
    };

    constructor(props) {
        super(props);
        this.state = {
            test: '200'
        };
    }

    render() {
        return (
            <View>
                    <Text style={{marginTop:200,width:100,height:200}} onPress={this.postRequest}>
                        {this.state.test}
                    </Text>
            </View>
        );
    }
    postRequest=()=>{
        HttpUtils.post('https://www.baidu.com',{'xiaoming':'小明'}).then((data)=>{
            console.log(data);
        })
    }
}

