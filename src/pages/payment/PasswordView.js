import React, {Component} from 'react'
import { StyleSheet, View, TouchableOpacity, Image} from 'react-native'
// import { UIText, UIImage } from '../../components/ui'
import PasswordInput from '../mine/components/PasswordInput'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import PropTypes from 'prop-types';
import res from './res';
const closeImg = res.close;
import Modal from 'CommModal';
import {MRText as Text} from '../../components/ui'
export default class PasswordView extends Component {
    static propTypes = {
        finishedAction: PropTypes.func,
        forgetAction: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
        closeAction: PropTypes.func.isRequired
    };

    state = {
        keyboardHeight:0
    }

    onRequestClose() {
        this.passwordInput && this.passwordInput.clear()
    }

    inputText(value) {
        if (value.length === 6) {
            this.props.finishedAction(value)
        }
    }

    forgetAction() {
        this.props.forgetAction()
    }

    render() {
        return <Modal
            transparent={true}
            animationType='fade'
            onRequestClose={()=>this.onRequestClose()}
            visible={this.props.visible}
        >
        <View style={styles.container}>
            <View style={{flex: 135 / (ScreenUtils.headerHeight)}}/>
            <View style={styles.passwordForm}>
                <View style={styles.form}>
                    <View style={styles.header}>
                        <View style={styles.closeButton}/>
                        <View style={styles.titleView}>
                            <Text allowFontScaling={false} style={styles.title}>平台支付密码</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={()=>{this.props.closeAction()}}>
                            <Image source={closeImg}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line}/>
                    <Text style={styles.input} allowFontScaling={false}>请输入平台的支付密码</Text>
                    <View style={{flex: 1}}/>
                    <PasswordInput
                        ref={(ref)=>{this.passwordInput = ref}}
                        style={styles.password}
                        maxLength={6}
                        onChange={value => this.inputText(value)}
                    />
                    <TouchableOpacity style={styles.forget} onPress={()=>this.forgetAction()}>
                        <Text style={styles.forgetText} allowFontScaling={false}>忘记支付密码</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex: 309 / (ScreenUtils.headerHeight)}}/>
        </View>
    </Modal>
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        width:ScreenUtils.width
    },
    password: {
        width:220,
        height:38
    },
    keyboard: {
        height: 0,
        backgroundColor: '#f00'
    },
    form: {
        height: px2dp(224),
        width: px2dp(295),
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center'
    },
    passwordForm: {
        justifyContent: 'center',
        alignItems: 'center',
        height: px2dp(224)
    },
    header: {
        height: px2dp(47),
        flexDirection: 'row',
        alignItems: 'center'
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
    titleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    line: {
        backgroundColor: '#ddd',
        height: ScreenUtils.onePixel,
        width: px2dp(295)
    },
    input: {
        color: '#222',
        fontSize: px2dp(15),
        marginTop: px2dp(38)
    },
    forget: {
        height: px2dp(46),
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgetText: {
        color: '#00A7F5',
        fontSize: px2dp(12)
    }
})
