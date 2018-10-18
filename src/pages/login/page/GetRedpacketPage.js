import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import ColorUtil from '../../../utils/ColorUtil';
import BasePage from '../../../BasePage';

export default class GetRedpacketPage extends BasePage {
    constructor(props) {
        super(props);
    }
    // 导航配置
    $navigationBarOptions = {
        title: '领取红包',
        gesturesEnabled: false
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.jump}>
                跳过
            </Text>
        );
    };


    _render() {
        return (
            <View style={Styles.contentStyle}>

            </View>
        );
    }


    /*跳过*/
    jump = () => {
        this.$navigate('login/login/RegistPage');
    };

}

const Styles = StyleSheet.create(
    {
        contentStyle: {
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: '#fff'
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: '#666'
        },
        otherLoginBgStyle: {
            left: 30,
            position: 'absolute',
            bottom: 10,
            height: 170

        },
        lineBgStyle: {
            marginLeft: 30,
            marginRight: 30,
            flexDirection: 'row',
            height: 30,
            backgroundColor: '#fff',
            justifyContent: 'center'
        },
        otherLoginTextStyle: {
            color: ColorUtil.Color_666666
        }
    }
);

