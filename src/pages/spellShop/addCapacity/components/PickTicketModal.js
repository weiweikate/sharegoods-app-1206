import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { MRText as Text } from '../../../../components/ui/index';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import CommModal from '../../../../comm/components/CommModal';
import SelectAmountView from './SelectAmountView';
import res from '../../res';
import user from '../../../../model/user';

const { youhuiquan_bg } = res.addCapacity;
const { px2dp, width } = ScreenUtils;

export default class PickTicketModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    show = ({ callBack }) => {
        this.setState({
            modalVisible: true,
            callBack
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        }, () => {
            this.state.callBack && this.state.callBack(this.amount);
        });
    };

    _amountChangeAction = (amount) => {
        this.amount = amount;
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
                            <ImageBackground style={styles.ticketImg} source={youhuiquan_bg}>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text style={styles.ticketMoneyText}>¥</Text>
                                    <Text style={styles.ticketMoney1Text}>1</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.ticketTittle1Text}>1元现金券<Text
                                        style={styles.ticketTittle2Text}>（可叠加使用）</Text></Text>
                                    <Text style={[styles.ticketContentText, { paddingVertical: 5 }]}>使用有效期：无时间限制</Text>
                                    <Text style={styles.ticketContentText}>限商品：会员专属券</Text>
                                </View>
                                <Text style={styles.ticketAmountText}>{`×${user.tokenCoin || 0}`}</Text>
                            </ImageBackground>
                            <SelectAmountView style={styles.numberView} maxCount={user.tokenCoin || 0}
                                              amountChangeAction={this._amountChangeAction}/>
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
        backgroundColor: 'rgba(0,0,0,0.5)', width: ScreenUtils.width
    },
    topCloseBtn: {
        height: px2dp(271)
    },
    bottomView: {
        flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.bgColor
    },
    ticketImg: {
        flexDirection: 'row', alignItems: 'center',
        marginLeft: 15, marginTop: 10,
        width: width - 30, height: 94, backgroundColor: 'white'
    },
    ticketMoneyText: {
        marginLeft: px2dp(26),
        fontSize: 14, color: DesignRule.textColor_redWarn
    },
    ticketMoney1Text: {
        marginRight: px2dp(30),
        fontSize: 34, color: DesignRule.textColor_redWarn
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
    numberView: {
        marginTop: 20, marginHorizontal: 15
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



