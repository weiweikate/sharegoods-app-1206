import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MRText as Text } from '../../../../components/ui/index';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import CommModal from '../../../../comm/components/CommModal';

const { px2dp } = ScreenUtils;

export default class PickTicketModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    show = () => {
        this.setState({
            modalVisible: true
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                    <View style={styles.bottomView}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.ticketView}>
                                <Text style={styles.ticketMoneyText}>¥<Text style={{ fontSize: 34 }}>1</Text></Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.ticketTittle1Text}>1元现金券<Text
                                        style={styles.ticketTittle2Text}>（可叠加使用）</Text></Text>
                                    <Text style={[styles.ticketContentText, { paddingVertical: 5 }]}>使用有效期：无时间限制</Text>
                                    <Text style={styles.ticketContentText}>限商品：会员专属券</Text>
                                </View>
                                <Text style={styles.ticketAmountText}>×23</Text>
                            </View>

                            <View style = {}>

                            </View>
                        </View>
                        <TouchableOpacity style={styles.sureBtn} onPress={this._close}>
                            <Text style={styles.sureText}>确认</Text>
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
        height: px2dp(271)
    },
    bottomView: {
        flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.white
    },

    ticketView: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: 15, marginTop: 10,
        height: 94, backgroundColor: 'white'
    },
    ticketMoneyText: {
        marginLeft: px2dp(26), marginRight: px2dp(30),
        fontSize: 14, color: DesignRule.textColor_redWarn
    },
    ticketTittle1Text: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    ticketTittle2Text: {
        fontSize: 10, color: DesignRule.textColor_instruction
    },
    ticketContentText: {
        fontSize: 11, color: DesignRule.textColor_secondTitle
    },
    ticketAmountText: {
        paddingRight: 15,
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },

    numberView:{
        flexDirection:'row',
    },

    sureBtn: {
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center',
        height: 40, width: ScreenUtils.width - 30, marginBottom: ScreenUtils.safeBottom + 15,
        backgroundColor: DesignRule.bgColor_btn, borderRadius: 20
    },
    sureText: {
        color: DesignRule.white, fontSize: 17
    }
});



