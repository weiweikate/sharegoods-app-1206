import React, {Component} from 'react'
import  {observer} from 'mobx-react'
import  {observable} from 'mobx'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native'
import ColorUtil from "../../../utils/ColorUtil";
import CommSpaceLine from "../../../comm/components/CommSpaceLine";

class  LoginTopViewModel {
    @observable
    selectIndex:0
    @observable
    phoneNumber
    @observable
    isSecuret:true

}


@observer
export default class LoginTopView extends Component{
   LoginModel = new LoginTopViewModel();
    constructor(props){
        super(props)

    }
    render(){
        return(
            <View style={Styles.containViewStyle}>
                <View style={Styles.switchBgStyle}>
                    <TouchableOpacity onPress={()=>{this.switchBtnClick(0)}}>
                    <Text style={Styles.switchBtnStyle}>
                        验证码登陆
                    </Text>
                    <View style={this.LoginModel.selectIndex?Styles.btnBottomLineNonStyle:Styles.btnBottomLineStyle}/>
                </TouchableOpacity >
                    <TouchableOpacity onPress={()=>{this.switchBtnClick(1)}} >
                        <Text style={Styles.switchBtnStyle}>
                           密码登陆
                        </Text>
                        <View style={this.LoginModel.selectIndex?Styles.btnBottomLineStyle:Styles.btnBottomLineNonStyle}/>
                    </TouchableOpacity>
                </View>
                <View>
                    <TextInput
                        style={Styles.inputTextStyle}
                        value={this.LoginModel.phoneNumber}
                        onChangeText={text => this.setState({phone: text})}
                        placeholder='请输入手机号'
                        underlineColorAndroid={'transparent'}
                        keyboardType='default'
                    />
                    <CommSpaceLine style={Styles.lineStyle}/>
                </View>
                <View>
                    <TextInput
                        style={Styles.inputTextStyle}
                        value={this.LoginModel.phoneNumber}
                        onChangeText={text => this.setState({phone: text})}
                        placeholder='请输入密码'
                        underlineColorAndroid={'transparent'}
                        keyboardType='default'
                        secureTextEntry = {this.LoginModel.isSecuret}
                    />
                    <CommSpaceLine style={Styles.lineStyle}/>
                </View>
            </View>
        )
    }
    switchBtnClick=(index)=>{
       this.LoginModel.selectIndex = index;
    }
}

const Styles = StyleSheet.create(
    {
        containViewStyle: {
            margin: 50,
            marginRight: 20,
            marginLeft: 20,
            height: 300,
            backgroundColor: '#fff',
        },
        switchBgStyle: {
            flexDirection: 'row',
            justifyContent:'space-between'
        },
        switchBtnStyle: {
            fontSize:18,
            color:ColorUtil.mainRedColor,
            paddingLeft:40,
            paddingRight:20,
            fontWeight:'600',
        },
        btnBottomLineStyle:{
            height:2,
            backgroundColor:ColorUtil.mainRedColor,
            margin:10,
        },
        btnBottomLineNonStyle:{
            height:0
        },
        inputTextStyle:{
            marginTop:30,
            marginLeft:20,
            marginRight:20,
            height: 40,
            backgroundColor:'white',
            fontSize:14,
            fontWeight:'600'
        },
        lineStyle:{
            marginLeft:20,
            marginRight:20,
        }

    }

)

