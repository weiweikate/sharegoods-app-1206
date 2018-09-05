import React, {Component} from 'react'
import LoginTopView    from '../components/LoginTopView'
import {
    View,
    Text,
    Alert,
    StyleSheet
} from 'react-native'


export default class LoginPage extends Component{
    // 页面配置
    static $PageOptions = {
        navigationBarOptions: {
            title: null,
            // show: false // 是否显示导航条 默认显示
        },
        // 是否启动页面状态管理
        renderByPageState: true,
    };
/*render右上角*/
    $NavBarRenderRightItem=()=>{
        return(
            <Text style={Styles.rightTopTitleStyle} onPress={this.registBtnClick}>
                注册
            </Text>
        )
    }

    registBtnClick=()=>{
        Alert.alert(
            'Alert Title',
            'My Alert Msg',
            [
                {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        )
    }
    render(){
        return(
            <View style={Styles.contentStyle}>
                <LoginTopView/>
            </View>
        )
    }
}

const Styles = StyleSheet.create(
    {
        contentStyle:{
            flex:1,
            backgroundColor:'#fff',

        },

        rightTopTitleStyle:{
            fontSize:15,
            color:'#666'
        }
    }
)

