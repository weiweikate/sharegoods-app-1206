import React, {Component} from 'react'
import { StyleSheet, View, TouchableOpacity, Image, Platform, Keyboard} from 'react-native'
import PasswordInput from '../../components/ui/PasswordInput'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import PropTypes from 'prop-types';
import res from './res';
import {MRText as Text} from '../../components/ui'
import Modal from '../../comm/components/CommModal'
import DesignRule from '../../constants/DesignRule'

export default class PasswordView extends Component {
    static propTypes = {
        finishedAction: PropTypes.func,
        forgetAction: PropTypes.func.isRequired,
        closeAction: PropTypes.func,
        showPwdMsg: PropTypes.string
    };

    state = {
        keyboardHeight: px2dp(448) + ScreenUtils.safeBottom,
        pwdMsg: ''
    }

    componentWillReceiveProps(nextProps) {
        console.log('PasswordView componentWillReceiveProps', nextProps)
        const { showPwdMsg } = nextProps
        if (showPwdMsg) {
            this.passwordInput && this.passwordInput.changeRedBorderColor()
            this.state.pwdMsg = showPwdMsg
        }
    }

    componentWillMount() {
        const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        this.keyboardShowEventListener = Keyboard.addListener(keyboardShowEvent, this.handleKeyboardShow);
        this.keyboardHideEventListener = Keyboard.addListener(keyboardHideEvent, this.handleKeyboardHide);
    }

    componentWillUnmount() {
        this.keyboardShowEventListener && this.keyboardShowEventListener.remove()
        this.keyboardHideEventListener && this.keyboardHideEventListener.remove()
    }

    handleKeyboardShow = (keyboardEvent) => {
        this.setState({keyboardHeight : keyboardEvent.endCoordinates.height + px2dp(233)})
    }

    handleKeyboardHide = (keyboardEvent) => {

    }

    onRequestClose() {
        this.passwordInput && this.passwordInput.clear()
    }

    inputText(value) {
        this.props.finishedAction(value)
    }

    forgetAction() {
        this.props.forgetAction()
    }

    _dismiss() {
        this.props.dismiss()
    }

    _onChange() {
        this.setState({
            pwdMsg: ''
        })
    }

    render() {
        const { keyboardHeight, pwdMsg } = this.state
        return  <Modal
        animation='fade'
        visible={true}
        >
        <View style={styles.container}>
            <View style={{flex: 1}}/>
            <View style={[styles.content, {height: keyboardHeight}]}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.left} onPress={()=> {this._dismiss()}}>
                <Image style={styles.backImg} source={res.back}/>
                </TouchableOpacity>
                <View style={styles.titleView}>
                <Text style={styles.input} allowFontScaling={false}>请输入平台的支付密码</Text>
                </View>
                <View style={styles.right}/>
            </View>
            <View style={styles.msgView}>
            {
                pwdMsg
                ?
                <Text style={styles.showPwdMsg}>{pwdMsg}</Text>
                :
                null
            }
            </View>
            <PasswordInput maxLength={6} style={styles.password}
                      onEnd={(pwd) => this.inputText(pwd)} ref={(ref)=> {this.passwordInput = ref}}
                      onChange={(pwd) => this._onChange(pwd)}
                      />
            {/* <PasswordInput
                ref={(ref)=>{this.passwordInput = ref}}
                style={styles.password}
                maxLength={6}
                onChange={value => this.inputText(value)}
                autoFocus = {true}
            /> */}
            <TouchableOpacity style={styles.forget} onPress={()=>this.forgetAction()}>
                <Text style={styles.forgetText} allowFontScaling={false}>忘记密码</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    }
}

const bgColor = 'rgba(4, 4, 4, 0.4)'
const contentBgColor = '#fff'
const fontColor = '#333'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: bgColor,
        width:ScreenUtils.width
    },
    content: {
        height: ScreenUtils.safeBottom,
        width : ScreenUtils.width,
        backgroundColor: contentBgColor
    },
    row: {
        height: px2dp(45),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderBottomWidth: ScreenUtils.onePixel,
        borderBottomColor: '#e4e4e4'
    },
    left: {
        width: px2dp(45),
        height: px2dp(45),
        justifyContent: 'center'
    },
    right: {
        width: px2dp(45),
        height: px2dp(45)
    },
    password: {
        width:ScreenUtils.width - px2dp(30),
        height: px2dp(57),
        marginRight: px2dp(15),
        marginLeft: px2dp(15)
    },
    titleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#222',
        fontSize: px2dp(18)
    },
    closeButton: {
        height: px2dp(47),
        width: px2dp(47),
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        color: fontColor,
        fontSize: px2dp(18)
    },
    forget: {
        height: px2dp(46),
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: px2dp(15)
    },
    forgetText: {
        color: '#00A7F5',
        fontSize: px2dp(12)
    },
    msgView: {
        height: px2dp(49),
        alignItems: 'center',
        paddingTop: px2dp(18)
    },
    showPwdMsg: {
        color: DesignRule.mainColor,
        fontSize: px2dp(15)
    }
})
