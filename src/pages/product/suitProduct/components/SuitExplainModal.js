import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import res from '../../res/product';
import CommModal from '../../../../comm/components/CommModal';
import { MRText } from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';

const { suitWhyRed } = res.suitProduct;

export default class SuitExplainModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            title: '',
            tip: ''
        };
    }

    open = (title, tip) => {
        this.setState({
            modalVisible: true,
            title, tip
        });
    };

    close = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        const { title, tip } = this.state;
        return (
            <CommModal onRequestClose={this.close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.topCloseBtn} onPress={this.close}/>
                    <View style={styles.bottomView}>
                        <View style={styles.contentView}>
                            <Image source={suitWhyRed} style={styles.img}/>
                            <MRText style={styles.titleText}>{title}</MRText>
                        </View>
                        <MRText style={styles.tipText}>{tip}</MRText>
                        <TouchableOpacity activeOpacity={0.7} style={styles.sureBtn} onPress={this.close}>
                            <MRText style={styles.sureText}>确定</MRText>
                        </TouchableOpacity>
                    </View>
                </View>
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    topCloseBtn: {
        flex: 1
    },

    bottomView: {
        borderTopLeftRadius: 15, borderTopRightRadius: 15,
        backgroundColor: DesignRule.white
    },

    contentView: {
        flexDirection: 'row', alignItems: 'center', marginTop: 25, marginLeft: 20
    },
    img: {
        width: 16, height: 16
    },
    titleText: {
        paddingLeft: 10,
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    tipText: {
        paddingHorizontal: 46, paddingBottom: 10,
        fontSize: 11, color: DesignRule.textColor_instruction
    },

    sureBtn: {
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center',
        height: 40, width: ScreenUtils.width - 30, marginBottom: ScreenUtils.safeBottom + 8,
        backgroundColor: DesignRule.bgColor_btn, borderRadius: 20
    },
    sureText: {
        color: DesignRule.white, fontSize: 17
    }
});

