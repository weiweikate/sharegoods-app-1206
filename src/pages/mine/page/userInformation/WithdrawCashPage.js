/**
 * Created by zhanglei on 2018/6/19.
 */
import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    TextInput as RNTextInput,
    Text,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import {
    UIText, UIImage, UIButton
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import arrow_right from '../../../order/res/arrow_right.png';
import ScreenUtils from '../../../../utils/ScreenUtils';
import bank from '../../res/userInfoImg/commonBankCardIcon.png';
// import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge';
import user from '../../../../model/user';
import { observer } from 'mobx-react/native';
import DesignRule from 'DesignRule';

@observer
class WithdrawCashPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pwd: '',
            money: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            settlementTotal: 0,
            serviceCharge: 0.01,
            card_no: '',
            bank_name: '',
            id: 0,
            card_type: 1,
            blockedBalances: 0,
            availableBalance: 0,
            totalFee: 0
        };
    }

    //*********************************ViewPart******************************************
    $navigationBarOptions = {
        title: '提现',
        show: true // false则隐藏导航
    };

    _render() {
        return (
            <View style={styles.container}>
                {StringUtils.isNoEmpty(this.state.card_no) ? this.renderBankView() : this.renderEmptyBankView()}
                {this.renderWithdrawMoney()}
                {this.renderButtom()}
            </View>
        );
    }

    renderLine = () => {
        return (
            <View style={{
                height: 0.5,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginLeft: 48,
                marginRight: 48
            }}/>
        );
    };
    renderButtom = () => {
        return (
            <UIButton
                value={'审核提现'}
                style={{
                    marginTop: 16,
                    width: ScreenUtils.width - 96,
                    height: 48,
                    marginLeft: 48,
                    marginRight: 48,
                    backgroundColor: StringUtils.isNoEmpty(this.state.card_no) ? DesignRule.mainColor : DesignRule.textColor_placeholder,
                    borderRadius: 25
                }}
                onPress={() => this.commit()}/>
        );
    };
    renderWithdrawMoney = () => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <UIText value={'提现金额'}
                        style={{
                            color: DesignRule.textColor_secondTitle,
                            fontSize: 15,
                            marginLeft: 15,
                            marginTop: 20
                        }}/>
                <View style={{
                    height: 56,
                    width: ScreenUtils.width,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white'
                }}>
                    <Text style={{ marginLeft: 15, color: DesignRule.textColor_mainTitle, fontSize: 30 }}>{'¥'}</Text>
                    <RNTextInput
                        style={{ marginLeft: 20, height: 40, flex: 1, backgroundColor: 'white', fontSize: 14 }}
                        onChangeText={(text) => this.onChangeText(text)}
                        placeholder={''}
                        underlineColorAndroid={'transparent'}
                        value={this.state.money}
                        keyboardType='numeric'
                    />
                </View>
                <View style={{ height: 1, backgroundColor: 'white' }}>
                    <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg, marginLeft: 15 }}/>
                </View>
                <UIText
                    value={'可用余额' + StringUtils.formatMoneyString(user.availableBalance, false) + '元，不可提现金额' + StringUtils.formatMoneyString(user.blockedBalance, false) + '元'}
                    style={{
                        color: DesignRule.textColor_secondTitle,
                        fontSize: 15,
                        marginLeft: 15,
                        marginTop: 1,
                        height: 30
                    }}/>
                <View style={{ backgroundColor: DesignRule.bgColor }}>
                    <UIText value={'额外扣除￥' + this.state.totalFee + '手续费（费率' + this.state.serviceCharge + '%）'}
                            style={{ color: DesignRule.mainColor, fontSize: 12, marginLeft: 15, marginTop: 10 }}/>
                </View>
            </View>
        );
    };
    renderBankView = () => {
        return (
            <TouchableOpacity
                style={{
                    height: 70,
                    backgroundColor: 'white',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 10,
                    marginBottom: 10
                }}
                onPress={() => this.selectBankCard()}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <UIImage source={bank} style={{ width: 49, height: 49, marginLeft: 16 }}/>
                    <View style={{ marginLeft: 10, alignItems: 'center' }}>
                        <UIText value={this.state.bank_name}
                                style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}/>
                        <UIText value={'尾号' + this.state.card_no + '  ' + this.state.card_type == 1 ? '储蓄卡' : '信用卡'}
                                style={{ fontSize: 13, color: DesignRule.textColor_instruction }}/>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', marginRight: 15 }}>
                    <UIImage source={arrow_right} style={{ height: 10, width: 7 }}/>
                </View>
            </TouchableOpacity>
        );
    };
    renderEmptyBankView = () => {
        return (
            <TouchableOpacity
                style={{
                    height: 70,
                    backgroundColor: 'white',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    marginTop: 10,
                    marginBottom: 10
                }}
                onPress={() => this.selectBankCard()}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ marginLeft: 10, alignItems: 'center' }}>
                        <UIText value={'请添加提现银行卡'} style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}/>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', marginRight: 15 }}>
                    <UIImage source={arrow_right} style={{ height: 10, width: 7 }}/>
                </View>
            </TouchableOpacity>
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
        Toast.showLoading();
        // MineApi.findSettlementTotalByToken({}).then((response) => {
        //     Toast.hiddenLoading();
        //     if (response.ok) {
        //         let data = response.data;
        //         this.setState({ settlementTotal: data });
        //     } else {
        //         NativeModules.commModule.toast(response.msg);
        //     }
        // }).catch(e => {
        //     Toast.hiddenLoading();
        // });
        // MineApi.findBankCardAndBalance({}).then((response) => {
        //     if (response.ok) {
        //         this.setState({
        //             serviceCharge: StringUtils.isNoEmpty(response.data.serviceCharge) ? response.data.serviceCharge : 0,
        //             card_no: response.data.card_no,
        //             bank_name: response.data.bank_name,
        //             id: response.data.id,
        //             card_type: response.data.card_type,
        //             blockedBalances: StringUtils.isNoEmpty(response.data.blockedBalances) ? response.data.blockedBalances : 0,
        //             availableBalance: StringUtils.isNoEmpty(response.data.availableBalance) ? response.data.availableBalance : 0
        //         });
        //     } else {
        //
        //     }
        // });
    }

    onChangeText = (text) => {
        let money = this.state.money;
        if (parseFloat(text) < parseFloat(user.availableBalance)) {
            this.setState({
                money: text,
                totalFee: parseFloat(this.state.serviceCharge) * parseFloat(text)
            });
        } else {
            this.setState({ money: money });
        }
    };
    commit = () => {
        NativeModules.commModule.toast('功能暂未开放！');
        // if (StringUtils.isEmpty(this.state.id)) {
        //     NativeModules.commModule.toast('请先选择银行卡');
        //     return;
        // }
        // if ((this.state.availableBalance + '') == '0') {
        //     NativeModules.commModule.toast('可提现金额不够');
        //     return;
        // }
        // if ((this.state.money + '') == '0') {
        //     NativeModules.commModule.toast('请输入金额');
        //     return;
        // }
        // MineApi.addWithdrawMoney({ bankId: this.state.id, withdrawBlance: this.state.money }).then((response) => {
        //     if (response.ok) {
        //         this.loadPageData();
        //         NativeModules.commModule.toast('提现成功');
        //     } else {
        //         NativeModules.commModule.toast(response.msg);
        //     }
        // });
    };
    selectBankCard = () => {
        NativeModules.commModule.toast('功能暂未开放');
    //     this.$navigate('mine/bankCard/BankCardListPage', {
    //         callBack: (params) => {
    //             this.setState({
    //                 card_no: params.card_no,
    //                 bank_name: params.bank_name,
    //                 id: params.id,
    //                 card_type: params.card_type
    //             });
    //         }
    //     });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    }
});

export default WithdrawCashPage;
