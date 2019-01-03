import React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity, Alert,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
    Image
} from "react-native";
import BasePage from "../../../../BasePage";
import {
    UIText, UIImage, UIButton
} from "../../../../components/ui";
import {MRText as Text, MRTextInput as RNTextInput} from '../../../../components/ui';



import StringUtils from "../../../../utils/StringUtils";
import ScreenUtils from "../../../../utils/ScreenUtils";
// import MineApi from '../../api/MineApi';
import user from "../../../../model/user";
import { observer } from "mobx-react/native";
import DesignRule from '../../../../constants/DesignRule';
import res from "../../res";
import MineAPI from "../../api/MineApi";
import BankTradingModal from "./../../components/BankTradingModal";
import EmptyUtils from "../../../../utils/EmptyUtils";
import { PageLoadingState } from "../../../../components/pageDecorator/PageState";

const arrow_right = res.button.arrow_right_black;
const bank = res.userInfoImg.bank_card_icon;
const delete_icon = res.bankCard.delete_icon;

function accMul(num1, num2) {
    let m = 0, s1 = num1.toString(), s2 = num2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) {
    }

    try {
        m += s2.split(".")[1].length;
    } catch (e) {
    }

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


@observer
export default class WithdrawCashPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            pwd: "",
            money: "",
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            card_no: "",
            bank_name: "",
            bankId: null,
            card_type: 1,
            isShowModal: false,
            rate: null,  //费率
            minCount: null,  //起始提现金额
            fixedFee: null,  //低于金额收取手续费
            whenLessAmount: null, //低于金额
            loadingState: PageLoadingState.loading
        };
        this.rate = null;
        this.minCount = null;
        this.fixedFee = null;
        this.whenLessAmount = null;
        this.getLastBankInfoSuccess = false;
        this.getRateSuccess = false;

    }

    //*********************************ViewPart******************************************
    $navigationBarOptions = {
        title: "提现",
        show: true // false则隐藏导航
    };

    $isMonitorNetworkStatus(){
        return true;
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this.loadPageData
            }
        };
    };

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener("unbindBank", (bankId) => {
            if (this.state.bankId === bankId) {
                this.setState({
                    card_no: null,
                    bank_name: null,
                    bankId: null,
                    card_type: null
                });
            }
        });
        this.loadPageData();
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    loadPageData = () => {
        this._getRate();
        this._getLastBankInfo();
    };

    _getLastBankInfo() {
        MineAPI.getLastBankInfo().then((data) => {

            if (data && data.data) {
                this.setState({
                    card_no: data.data.cardNo,
                    bank_name: data.data.bankName,
                    bankId: data.data.id,
                    card_type: data.data.cardType
                });
            }

            this.getLastBankInfoSuccess = true;
            if (this.getLastBankInfoSuccess && this.getRateSuccess) {
                this.setState({
                    loadingState: PageLoadingState.success
                });
            }
        }).catch((error) => {
            this.getLastBankInfoSuccess = true;
            this.setState({
                loadingState: PageLoadingState.success
            });
        });
    }

    _getRate() {
        MineAPI.queryRate().then((data) => {
            this.rate = null;
            this.minCount = null;
            this.fixedFee = null;
            this.whenLessAmount = null;
            this.getRateSuccess = true;

            if (data) {
                let arr = data.data;
                for (let i = 0; i < arr.length; i++) {
                    let item = arr[i];
                    switch (item.code) {
                        //提现手续费比列
                        case "service_charge": {
                            this.rate = item.value;
                        }
                            break;
                        //起始提现金额
                        case "min_balance": {
                            this.minCount = item.value;
                        }
                            break;
                        //提现金额低于
                        case "when_less_than_balance": {
                            this.whenLessAmount = item.value;
                        }
                            break;
                        //收取手续费
                        case "case_service_charge": {
                            this.fixedFee = item.value;
                        }
                            break;
                    }
                }
            }
            this.setState({
                rate: this.rate,
                minCount: this.minCount,
                fixedFee: this.fixedFee,
                whenLessAmount: this.whenLessAmount
            });

            if (this.getLastBankInfoSuccess && this.getRateSuccess) {
                this.setState({
                    loadingState: PageLoadingState.success
                });
            }

        }).catch((err) => {
            this.$toastShow(err.msg);
            this.getRateSuccess = false;
            this.setState({
                loadingState: PageLoadingState.fail
            });
        });
    }

    forgetTransactionPassword = () => {
        this.setState({
            isShowModal: false
        });
        this.$navigate("mine/account/JudgePhonePage", { title: "设置交易密码" });
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
                    forgetAction={() => {
                        this.forgetTransactionPassword();
                    }}
                    closeAction={() => {
                        this.setState({
                            isShowModal: false
                        });
                    }}
                    finishedAction={(password) => this.passwordFinish(password)}
                    visible={this.state.isShowModal}
                    instructions={"忘记支付密码"}
                    title={"请输入支付密码"}
                    message={"请输入6位支付密码"}
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
                value={"审核提现"}
                style={{
                    marginTop: 24,
                    width: ScreenUtils.width - 96,
                    fontSize: 17,
                    height: 48,
                    marginLeft: 48,
                    marginRight: 48,
                    backgroundColor: (StringUtils.isNoEmpty(this.state.card_no) && parseFloat(this.state.money)) ? DesignRule.mainColor : DesignRule.textColor_placeholder,
                    borderRadius: 25
                }}
                disabled={!(StringUtils.isNoEmpty(this.state.card_no) && parseFloat(this.state.money))}
                onPress={() => this.commit()}/>
        );
    };
    renderWithdrawMoney = () => {
        let tip = "";
        if (!EmptyUtils.isEmpty(this.state.rate)) {
            if (this.state.money && !isNaN(parseFloat(this.state.money))) {
                tip = tip + `额外扣除￥${Math.ceil(accMul(this.state.rate / 100, parseFloat(this.state.money)) * 100) / 100}手续费(费率${this.state.rate}%)`;
            }
        }
        if (!EmptyUtils.isEmpty(this.state.whenLessAmount) && !EmptyUtils.isEmpty(this.state.fixedFee)) {
            tip = tip + `提现金额不满${this.state.whenLessAmount}元，则扣除${this.state.fixedFee}元手续费`;
        }
        // if (!EmptyUtils.isEmpty(this.state.minCount)) {
        //     tip = tip + `最低提现金额为${this.state.minCount}元`;
        // }

        let tip2 = (parseFloat(this.state.money) > parseFloat(user.availableBalance)) ? (<Text>
            金额已超出可提现金额
        </Text>) : (<Text style={{fontSize:13}}>
            {`可用余额${user.availableBalance}元`}
            {!EmptyUtils.isEmpty(this.state.minCount) ? (<Text style={{fontSize:11}}>
                （最低提现金额为<Text style={{ color: DesignRule.mainColor }}>{this.state.minCount}元</Text>）
            </Text>) : null}
        </Text>);

        return (
            <View style={{ backgroundColor: "white" }}>
                <UIText value={"提现金额"}
                        style={{
                            color: DesignRule.textColor_secondTitle,
                            fontSize: 15,
                            marginLeft: 15,
                            marginTop: 20
                        }}/>
                <View style={{
                    height: 56,
                    width: ScreenUtils.width,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white"
                }}>
                    <Text style={{ marginLeft: 15, color: DesignRule.textColor_mainTitle, fontSize: 30 }}>{"¥"}</Text>
                    {/*<View style={{height:20,width:1,backgroundColor:'#eeeeee',marginLeft:16}}/>*/}
                    <RNTextInput
                        style={{ marginLeft: 20, height: 40, flex: 1, fontSize: 14 }}
                        onChangeText={(text) => this.onChangeText(text)}
                        placeholder={""}
                        value={this.state.money}
                        keyboardType='numeric'
                    />
                    {(this.state.money && this.state.money.length > 0) ? (<TouchableWithoutFeedback onPress={() => {
                        this.setState({ money: "" });
                    }}>
                        <Image source={delete_icon}
                               style={{ width: 16, height: 16, marginRight: DesignRule.margin_page, borderRadius: 8 }}/>
                    </TouchableWithoutFeedback>) : null}

                </View>
                <View style={{
                    height: ScreenUtils.onePixel,
                    backgroundColor: DesignRule.lineColor_inColorBg,
                    marginHorizontal: DesignRule.margin_page
                }}/>
                <View style={{
                    flexDirection: "row",
                    width: ScreenUtils.width,
                    alignItems: "center",
                    height: 33,
                    justifyContent: "space-between",
                    paddingHorizontal: DesignRule.margin_page
                }}>
                    {/*<Text*/}
                    {/*style={{*/}
                    {/*color: (parseFloat(this.state.money) > parseFloat(user.availableBalance)) ? DesignRule.mainColor : DesignRule.textColor_instruction,*/}
                    {/*fontSize: 13,*/}
                    {/*marginTop: 10,*/}
                    {/*height: 30*/}
                    {/*}}>*/}
                    {/*{(parseFloat(this.state.money) > parseFloat(user.availableBalance)) ? "金额已超出可提现金额" : "可用余额" + StringUtils.formatMoneyString(user.availableBalance, false) + "元"}*/}
                    {/*</Text>*/}
                    {tip2}
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({ money: user.availableBalance });
                    }}>
                        <Text style={{
                            color: "#007AFF",
                            fontSize: DesignRule.fontSize_threeTitle,
                            includeFontPadding: false
                        }}>
                            全部提现
                        </Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ backgroundColor: DesignRule.bgColor }}>
                    <UIText value={tip}
                            style={{
                                color: (!EmptyUtils.isEmpty(this.state.whenLessAmount) && !EmptyUtils.isEmpty(this.state.fixedFee) && (parseFloat(this.state.money) >= parseFloat(this.state.whenLessAmount))) ? DesignRule.textColor_instruction : DesignRule.mainColor,
                                fontSize: 11,
                                marginLeft: 15,
                                marginTop: 10
                            }}/>
                </View>
            </View>
        );
    };
    renderBankView = () => {
        return (
            <TouchableOpacity
                style={{
                    height: 70,
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: 10
                }}
                onPress={() => this.selectBankCard()}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <UIImage source={bank} style={{ width: 49, height: 49, marginLeft: 16 }}/>
                    <View style={{ marginLeft: 12 }}>
                        <UIText value={this.state.bank_name}
                                style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}/>
                        <UIText
                            value={"尾号" + (this.state.card_no ? this.state.card_no.substring(this.state.card_no.length - 4, this.state.card_no.length) : "") + "  " + this.state.card_type}
                            style={{ fontSize: 13, color: DesignRule.textColor_instruction }}/>
                    </View>
                </View>
                <View style={{ justifyContent: "center", marginRight: 15 }}>
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
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    marginTop: 10,
                    marginBottom: 10
                }}
                onPress={() => this.selectBankCard()}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ marginLeft: 10, alignItems: "center" }}>
                        <UIText value={"请选择提现银行卡"} style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}/>
                    </View>
                </View>
                <View style={{ justifyContent: "center", marginRight: 15 }}>
                    <UIImage source={arrow_right} style={{ height: 10, width: 7 }}/>
                </View>
            </TouchableOpacity>
        );
    };

    //**********************************BusinessPart******************************************

    onChangeText = (text) => {
        this.setState({ money: text });
    };
    commit = () => {
        if (parseFloat(this.state.money) > parseFloat(user.availableBalance)) {
            this.$toastShow("超出金额限制");
            return;
        }

        if(this.state.minCount && (parseFloat(this.state.money) < parseFloat(this.state.minCount))){
            this.$toastShow("超出金额设置");
            return;
        }

        if (EmptyUtils.isEmpty(user.realname)) {
            Alert.alert("未实名认证", "你还没有实名认证", [{
                text: "稍后认证", onPress: () => {
                }
            }, {
                text: "马上就去", onPress: () => {
                    this.$navigate("mine/userInformation/IDVertify2Page");
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
            isShowModal: true
        });
        this.passwordView.open();
    };
    selectBankCard = () => {
        this.$navigate("mine/bankCard/BankCardListPage", {
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

    passwordFinish = (pwd) => {
        this.setState({ isShowModal: false });
        this.passwordView.close();

        let params = {
            "bankId": this.state.bankId,
            "bankName": this.state.bank_name,
            "cardNo": this.state.card_no,
            "payPassword": pwd,
            "totalBalance": parseFloat(this.state.money)
        };
        MineAPI.userWithdrawApply(params).then((data) => {
            this.$toastShow("提交申请成功\n" +
                "预计1-3个工作日内到款");
            this.$navigateBack("mine/userInformation/MyCashAccountPage");
        }).catch((err) => {
            this.$toastShow(err.msg);
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    }
});

