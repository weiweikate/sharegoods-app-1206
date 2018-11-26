import React from 'react';
import {
    StyleSheet,
    View,
    TextInput as RNTextInput,
    Text,
    TouchableOpacity, Alert
} from "react-native";
import BasePage from '../../../../BasePage';
import {
    UIText, UIImage, UIButton
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
// import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge';
import user from '../../../../model/user';
import { observer } from 'mobx-react/native';
import DesignRule from 'DesignRule';
import res from '../../res';
import MineAPI from "../../api/MineApi";
import BankTradingModal from "./../../components/BankTradingModal";
import EmptyUtils from "../../../../utils/EmptyUtils";
const arrow_right = res.button.arrow_right_black;
const bank = res.userInfoImg.commonBankCardIcon;

@observer
export default class WithdrawCashPage extends BasePage {
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
            bankId: null,
            card_type: 1,
            isShowModal:false
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
                <BankTradingModal
                    ref={(ref) => {
                        this.passwordView = ref;
                    }}
                    forgetAction={() => {}}
                    closeAction={() => {
                        this.setState({
                            isShowModal: false
                        });
                    }}
                    finishedAction={(password) => this.passwordFinish(password)}
                    visible={this.state.isShowModal}

                    title={"输入平台密码"}
                    message={""}
                />
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
                    backgroundColor: (StringUtils.isNoEmpty(this.state.card_no) && parseFloat(this.state.money))? DesignRule.mainColor : DesignRule.textColor_placeholder,
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
                    <View style={{height:20,width:1,backgroundColor:'#eeeeee',marginLeft:16}}/>
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
                    <View style={{ marginLeft: 12 }}>
                        <UIText value={this.state.bank_name}
                                style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}/>
                        <UIText value={'尾号' + (this.state.card_no ? this.state.card_no.substring(this.state.card_no.length-4,this.state.card_no.length):'') + '  ' + this.state.card_type}
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
        this.setState({ money: text });
    };
    commit = () => {
        if (EmptyUtils.isEmpty(user.realname)) {
            Alert.alert("未实名认证", "你还没有实名认证", [{
                text: "稍后认证", onPress: () => {
                }
            }, {
                text: "马上就去", onPress: () => {
                    this.props.navigation.navigate("mine/userInformation/IDVertify2Page");
                }
            }]);
            return;
        }

        if (!user.hadSalePassword) {
            Alert.alert("未设置密码", "你还没有设置初始密码", [{
                text: "稍后设置", onPress: () => {
                }
            }, {
                text: "马上就去", onPress: () => {
                    this.$navigate("mine/account/JudgePhonePage", { title: "设置交易密码" });
                }
            }]);
            return;
        }
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
        // {
        //     "bankId": 0,
        //     "bankName": "string",
        //     "cardNo": "string",
        //     "payPassword": "string",
        //     "withdrawBalance": 0
        // }
       this.setState({
           isShowModal:true
       });
       this.passwordView.open();
    };
    selectBankCard = () => {
            this.$navigate('mine/bankCard/BankCardListPage', {
                callBack: (params) => {
                    this.setState({
                        card_no: params.cardNo,
                        bank_name: params.bankName,
                        bankId: params.id,
                        card_type: params.cardType
                    });
                }
            });
    };

    passwordFinish = ()=>{
        let params = {
            "bankId": this.state.bankId,
            "bankName": this.state.bank_name,
            "cardNo": this.state.card_no,
            "payPassword": "123456",
            "withdrawBalance": parseFloat(this.state.money)
        }
        MineAPI.userWithdrawApply(params).then((data)=>{
            this.$toastShow('提交申请成功\n' +
                '预计2个工作日内到款')
        }).catch((err)=>{
            this.$toastShow(err.msg);
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    }
});

