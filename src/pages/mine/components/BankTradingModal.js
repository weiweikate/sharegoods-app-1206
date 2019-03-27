import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image ,Keyboard} from "react-native";
// import { UIText, UIImage } from '../../components/ui'
import PasswordInput from "./PasswordInput";
import ScreenUtils from "../../../utils/ScreenUtils";

const { px2dp } = ScreenUtils;
import PropTypes from "prop-types";
import res from "./../../payment/res";
import Modal from '../../../comm/components/CommModal';
import DesignRule from "../../../constants/DesignRule";
import {MRText as Text} from '../../../components/ui'
const closeImg = res.close;

export default class BankTradingModal extends Component {
    static propTypes = {
        finishedAction: PropTypes.func,
        forgetAction: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
        closeAction: PropTypes.func.isRequired,
        errMsg: PropTypes.string
    };

    state = {
        keyboardHeight: 0
    };

    constructor(props){
        super(props);
        this.state = {
            value : ''
        }
    }

    onRequestClose() {

    }

    inputText=(value)=> {
        if (value.length === 6) {
            Keyboard.dismiss();
            this.props.finishedAction(value);
            this.passwordInput && this.passwordInput.clear();
        }
    }

    forgetAction=()=> {
        this.props.forgetAction && this.props.forgetAction();
    }

    close = () => {
        this.modal && this.modal.close();
    }

    open = ()=>{
        this.modal && this.modal.open();
    }

    render() {
        return <Modal
            animationType='fade'
            onRequestClose={() => this.onRequestClose()}
            visible={this.props.visible}
            ref={(ref) => {
                this.modal = ref;
            }}
        >
            <View style={styles.container}>
                <View style={{ flex: 1 }}/>
                <View style={styles.passwordForm}>
                    <View style={styles.form}>
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => {
                                this.props.closeAction();
                            }}>
                                <Image source={closeImg} style={{ width: 12, height: 12 }}/>
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <Text style={styles.title}>{this.props.title}</Text>
                            </View>
                            <View style={styles.closeButton}/>
                        </View>
                        <View style={styles.line}/>
                        <Text style={styles.typeStyle}>提现</Text>
                        <Text style={styles.input}>{this.props.message}</Text>
                        <PasswordInput
                            ref={(ref)=>{this.passwordInput = ref;}}
                            style={styles.password}
                            maxLength={6}
                            onChange={value => this.inputText(value)}
                        />
                        {/*<Text style={styles.msgStyle}>*/}
                            {/*{this.props.errMsg || ''}*/}
                        {/*</Text>*/}
                        <TouchableOpacity style={styles.forget} onPress={()=>{this.props.forgetAction()}}>
                            <Text style={styles.forgetText}>{this.props.instructions}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:ScreenUtils.width
    },
    password: {
        width: ScreenUtils.width-px2dp(24),
        height: px2dp(57),
        marginTop:px2dp(19)
    },
    keyboard: {
        height: 0,
        backgroundColor: "#f00"
    },
    form: {
        height: px2dp(492),
        width: ScreenUtils.width,
        backgroundColor: "#fff",
        alignItems: "center"
    },
    passwordForm: {
        justifyContent: "center",
        alignItems: "center",
        height: px2dp(492)
    },
    header: {
        height: px2dp(45),
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        color: "#222",
        fontSize: px2dp(18)
    },
    closeButton: {
        height: px2dp(47),
        width: px2dp(47),
        alignItems: "center",
        justifyContent: "center"
    },
    titleView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    line: {
        backgroundColor: "#ddd",
        height: ScreenUtils.onePixel,
        width: ScreenUtils.width-2*px2dp(15)
    },
    input: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(18),
        marginTop: px2dp(5)
    },
    forget: {
        alignSelf:'flex-end',
        marginTop:px2dp(10),
        marginRight:px2dp(18)
    },
    forgetText: {
        color: "#4A90E2",
        fontSize: px2dp(16)
    },
    msgStyle:{
        color:DesignRule.mainColor,
        fontSize:DesignRule.fontSize_threeTitle,
        alignSelf:'center',
    },
    typeStyle:{
        color:DesignRule.textColor_mainTitle,
        fontSize:DesignRule.fontSize_secondTitle,
        marginTop:px2dp(10)
    }
});
