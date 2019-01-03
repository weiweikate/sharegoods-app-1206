import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image ,Keyboard} from "react-native";
// import { UIText, UIImage } from '../../components/ui'
import PasswordInput from "./PasswordInput";
import ScreenUtils from "../../../utils/ScreenUtils";

const { px2dp } = ScreenUtils;
import PropTypes from "prop-types";
import res from "./../../payment/res";
import Modal from 'CommModal';
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
                <View style={{ flex: 135 / (ScreenUtils.headerHeight) }}/>
                <View style={styles.passwordForm}>
                    <View style={styles.form}>
                        <View style={styles.header}>
                            <View style={styles.closeButton}/>
                            <View style={styles.titleView}>
                                <Text style={styles.title}>{this.props.title}</Text>
                            </View>
                            <TouchableOpacity style={styles.closeButton} onPress={() => {
                                this.props.closeAction();
                            }}>
                                <Image source={closeImg} style={{ width: 12, height: 12 }}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line}/>
                        <Text style={styles.input}>{this.props.message}</Text>
                        <View style={{ flex: 1 }}/>
                        <PasswordInput
                            ref={(ref)=>{this.passwordInput = ref;}}
                            style={styles.password}
                            maxLength={6}
                            onChange={value => this.inputText(value)}
                        />
                        <Text style={styles.msgStyle}>
                            {this.props.errMsg || ''}
                        </Text>
                        <TouchableOpacity style={styles.forget} onPress={()=>{this.props.forgetAction()}}>
                            <Text style={styles.forgetText}>{this.props.instructions}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 309 / (ScreenUtils.headerHeight) }}/>
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
        width: 220,
        height: 38
    },
    keyboard: {
        height: 0,
        backgroundColor: "#f00"
    },
    form: {
        height: px2dp(224),
        width: px2dp(295),
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center"
    },
    passwordForm: {
        justifyContent: "center",
        alignItems: "center",
        height: px2dp(224)
    },
    header: {
        height: px2dp(47),
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
        width: px2dp(295)
    },
    input: {
        color: "#222",
        fontSize: px2dp(15),
        marginTop: px2dp(38)
    },
    forget: {
        height: px2dp(46),
        alignItems: "center",
        justifyContent: "center"
    },
    forgetText: {
        color: "#00A7F5",
        fontSize: px2dp(12)
    },
    msgStyle:{
        color:DesignRule.mainColor,
        fontSize:DesignRule.fontSize_threeTitle,
        alignSelf:'center',

    }
});
