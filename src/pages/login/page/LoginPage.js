import React, { Component } from 'react';
import LoginTopView from '../components/LoginTopView';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import CommSpaceLine from '../../../comm/components/CommSpaceLine';
import loginAndRegistRes from '../res/LoginAndRegistRes';
import ScreenUtils from '../../../utils/ScreenUtils';

export default class LoginPage extends Component {
    constructor() {
        super();
        this.state = {
            a: 0
        };
    }

    /*页面配置*/
    static $PageOptions = {
        navigationBarOptions: {
            title: null
            // show: false // 是否显示导航条 默认显示
        },
        renderByPageState: true
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.registBtnClick}>
                注册
            </Text>
        );
    };
    registBtnClick = () => {
        this.props.navigation.navigate('login/login/RegistPage');
    };

    render() {
        return (
            <View style={Styles.contentStyle}>
                <LoginTopView
                    oldUserLoginClick={this.oldUserLoginClick.bind(this)}
                />
                <View style={Styles.otherLoginBgStyle}>
                    <View style={Styles.lineBgStyle}>
                        <CommSpaceLine style={{ marginTop: 7, width: 80, marginLeft: 5 }}/>
                        <Text>
                            其他登陆方式
                        </Text>
                        <CommSpaceLine style={{ marginTop: 7, width: 80, marginLeft: 5 }}/>
                    </View>
                    <View style={{
                        marginLeft: 0,
                        marginRight: 0,
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={this.weChatLoginClick}>
                            <Image style={{ width: 50, height: 50 }} source={loginAndRegistRes.weixinImage}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <Image style={{
                    width: ScreenUtils.width,
                    position: 'absolute',
                    bottom: 0,
                    height: 80,
                    backgroundColor: 'red'
                }} source={loginAndRegistRes.loginBottomImage}/>
            </View>
        );
    }

    weChatLoginClick = () => {

    };
    oldUserLoginClick = () => {
        this.props.navigation.navigate('login/login/OldUserLoginPage');
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
        }
    }
);

