import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Modal,
    ImageBackground,
} from 'react-native'
import {color} from "../../constants/Theme";
import BonusExchangeSucceedBackground from '../mine/res/userInfoImg/BonusExchangeSucceedBackground.png'
import bonusClose from '../mine/res/userInfoImg/bonusClose.png'
import { UIText, UIImage } from '../../components/ui'
import PasswordInput from '../mine/components/PasswordInput'
import {observer} from 'mobx-react/native'

@observer
class  InputTransactionPasswordModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            passwordInputError:this.props.passwordInputError,
            bottomText:this.props.bottomText ? this.props.bottomText : '',
        }
        this.updateView()
    }
    onRequestClose=()=>{

    }
    updateView=()=>{
        this.setState({passwordInputError:this.props.passwordInputError,})
        setTimeout(()=> {
            this.updateView()
        }, 100);

    }
    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={()=>this.onRequestClose()}
                visible={this.props.isShow}>
                <View style={styles.modalStyle}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }
    renderPasswordInput=()=>{
        return(
            <View style={{paddingLeft:34,paddingRight:34,paddingBottom:30,alignItems:'center'}}>
                <PasswordInput
                    style={{width:220,height:38,}}
                    maxLength={6}
                    onChange={value => this.props.inputText(value)}/>
                <UIText value={this.state.passwordInputError ? this.state.bottomText : ''} style={{fontSize: 15, color: "#14b6eb",marginTop:9}} onPress={()=>this.props.forgetPassword()}/>
            </View>
        )
    }
    renderContext=()=>{
        return(this.props.isContextRed ?
        <View style={{justifyContent:'center'}}>
            <UIText value={this.props.detail.context} style={[styles.redTextStyle,{marginTop:10}]}/>
        </View> :
            <Text style={this.props.useSmallTextStyle ? styles.smallTextStyle : styles.contentTextStyle}>{this.props.detail.context}</Text>
        )
    }
    renderContent(){
        return(
            <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
                <View style={{justifyContent:'center',flexDirection:'row'}}>
                    <ImageBackground source={this.props.backgroundImg ? this.props.backgroundImg : BonusExchangeSucceedBackground} style={{height:272,width:295,alignItems:'flex-end'}}>
                            <UIImage source={bonusClose} style={{width:32,height:32,marginTop:43}} onPress={()=>this.props.closeWindow()}/>
                        <View style={{height:212,width:295,justifyContent:'space-between'}}>
                            <View style={{flex:1,alignContent:'center',alignItems:'center',marginTop:30,paddingLeft:26,paddingRight:26}}>
                                <Text style={this.props.useSmallTextStyle ? styles.smallTextStyle : styles.titleTextStyle}>{this.props.detail.title}</Text>
                                {this.renderContext()}
                            </View>
                            {this.renderPasswordInput()}
                        </View>
                    </ImageBackground>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent:'flex-end',
        flex: 1,
    },smallTextStyle:{
        fontFamily: "PingFang-SC-Medium",
        fontSize: 15,
        color: "#666666"
    },titleTextStyle:{
        fontSize:24,color:color.blue_222,
    },contentTextStyle:{
        fontSize:15,color:color.blue_222,marginTop:10
    },redTextStyle:{
        fontFamily: "PingFang-SC-Medium",
        fontSize: 15,
        color: "#e60012"
    }
});

export default InputTransactionPasswordModal
