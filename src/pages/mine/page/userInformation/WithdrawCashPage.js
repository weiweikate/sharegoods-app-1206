import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity, Alert,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import BasePage from '../../../../BasePage';
import * as math from 'mathjs';
import {
    UIText, UIImage, UIButton, MRText
} from '../../../../components/ui';
import { MRText as Text, MRTextInput as RNTextInput } from '../../../../components/ui';
import StringUtils, { isNoEmpty } from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import user from '../../../../model/user';
import { observer } from 'mobx-react/native';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import MineAPI from '../../api/MineApi';
import BankTradingModal from './../../components/BankTradingModal';
import EmptyUtils from '../../../../utils/EmptyUtils';
import { PageLoadingState } from '../../../../components/pageDecorator/PageState';
import WithdrawFinishModal from './Modal/WithdrawFinishModal';

const arrow_right = res.button.arrow_right_black;
const bank = res.bankCard.bankcard_icon;
const delete_icon = res.bankCard.delete_icon;
const singleCommit = 10000;

function number_format(number, decimals, dec_point, thousands_sep,roundtag) {
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
    * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || 'ceil'; //"ceil","floor","round"
    let n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {

            let k = Math.pow(10, prec);
            console.log();

            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    let re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2');
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
function formatMoneyString(num, needSymbol = true) {
    let temp = (isNoEmpty(num) ? num : 0) + '';
    if (temp.indexOf('.') === -1) {
        temp += '.00';
    }
    if ((temp.indexOf('.') + 3) < temp.length) {
        temp = temp.substr(0, temp.indexOf('.') + 3);
    }
    if ((temp.indexOf('.') + 2 === temp.length)) {
        temp += '0';
    }
    if (needSymbol && temp.indexOf('¥') === -1) {
        temp = '¥' + temp;
    }
    return temp;
}


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
            card_no: '',
            bank_name: '',
            bankId: null,
            card_type: 1,
            isShowModal: false,
            rate: null,  //费率
            minCount: null,  //起始提现金额
            fixedFee: null,  //低于金额收取手续费
            whenLessAmount: null, //低于金额
            loadingState: PageLoadingState.loading,
            showFinishModal: false,
            startDay: null,
            endDay: null,
            balance: null,
            multiple: null,
            errorTip: null
        };
        this.rate = null;
        this.minCount = null;
        this.fixedFee = null;
        this.whenLessAmount = null;
        this.getLastBankInfoSuccess = false;
        this.getRateSuccess = false;
        this.purMoney = '';
    }

    $navigationBarOptions = {
        title: '提现',
        show: true // false则隐藏导航
    };

    $isMonitorNetworkStatus() {
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
        this.listener = DeviceEventEmitter.addListener('unbindBank', (bankId) => {
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
                let arr = data.data.list;
                for (let i = 0; i < arr.length; i++) {
                    let item = arr[i];
                    switch (item.code) {
                        //提现手续费比列
                        case 'service_charge': {
                            this.rate = item.value;
                        }
                            break;
                        //起始提现金额
                        case 'min_balance': {
                            this.minCount = item.value;
                        }
                            break;
                        //提现金额低于
                        case 'when_less_than_balance': {
                            this.whenLessAmount = item.value;
                        }
                            break;
                        //收取手续费
                        case 'case_service_charge': {
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
                whenLessAmount: this.whenLessAmount,
                startDay: data.data.startDay,
                endDay: data.data.endDay,
                balance: data.data.balance,
                multiple: data.data.multiple
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
        this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
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
                    instructions={'忘记密码'}
                    title={'请输入交易密码'}
                    message={`${formatMoneyString(this.state.money)}`}
                />
                <WithdrawFinishModal visible={this.state.showFinishModal} onRequestClose={() => {
                    this.setState({ showFinishModal: false });
                    this.$navigateBack('mine/userInformation/MyCashAccountPage');
                }}/>
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
                    marginTop: 24,
                    width: ScreenUtils.width - 96,
                    fontSize: 17,
                    height: 48,
                    marginLeft: 48,
                    marginRight: 48,
                    backgroundColor: (StringUtils.isNoEmpty(this.state.card_no) && parseFloat(this.state.money) && this.state.errorTip === null) ? DesignRule.mainColor : DesignRule.textColor_placeholder,
                    borderRadius: 25
                }}
                disabled={!(StringUtils.isNoEmpty(this.state.card_no) && parseFloat(this.state.money) && this.state.errorTip === null)}
                onPress={() => this.commit()}/>
        );
    };

    renderTip = () => {

        let tip3Index = 1;
        if (this.state.balance !== null) {
            tip3Index++;
        }
        if (this.state.startDay !== null && this.state.endDay !== null) {
            tip3Index++;
        }
        let multipleTip = this.state.multiple ? `以及￥${this.state.minCount}的倍数` : '';

        return (
            <View style={{ flexDirection: 'row', marginLeft: DesignRule.margin_page, marginTop: 5 }}>

                {
                    (this.state.balance === null && this.state.startDay === null && this.state.endDay === null) ? null :
                        <MRText style={styles.tipTextStyle}>
                            {'提示: '}
                        </MRText>
                }

                <View>
                    {this.state.balance !== null ? <MRText style={styles.tipTextStyle}>
                        {`1.本月剩余提现额度￥${this.state.balance}`}
                    </MRText> : null}
                    {(this.state.startDay !== null && this.state.endDay !== null) ? <MRText style={styles.tipTextStyle}>
                        {`${this.state.balance === null ? 1 : 2}.每月${this.state.endDay}号重置提现额度`}
                    </MRText> : null}
                    {this.state.minCount ? <MRText style={styles.tipTextStyle}>
                        {`${tip3Index}.提现为￥${this.state.minCount}起${multipleTip}`}
                    </MRText> : null}
                </View>
            </View>
        );
    };

    commitAll = () => {
        if (this.state.balance !== null) {
            if (user.availableBalance <= this.state.balance && user.availableBalance <= singleCommit) {
                this.setState({ money: `${user.availableBalance}` });
            } else if (this.state.balance <= user.availableBalance && this.state.balance <= singleCommit) {
                this.setState({ money: `${this.state.balance}` });
            } else {
                this.setState({ money: `${singleCommit}` });
            }

        } else {
            if (user.availableBalance < singleCommit) {
                this.setState({ money: `${user.availableBalance}` });
            } else {
                this.setState({ money: `${singleCommit}` });
            }
        }
    };

    checkError = (money) => {
        if(money === null){
            this.setState({ errorTip: null });
            return;
        }

        if(money.length === 0){
            this.setState({ errorTip: null });
            return;
        }

        if (!StringUtils.isNumber(money)) {
            this.setState({ errorTip: '输入金额不可提现' });
            return;
        }

        if ((parseFloat(money) > parseFloat(user.availableBalance))) {
            this.setState({ errorTip: '输入金额超过可提现余额' });
            return;
        }

        if (parseFloat(money) === 0) {
            this.setState({ errorTip: '输入金额不可提现' });
            return;
        }

        if (this.state.multiple) {
            if (this.state.minCount !== null && !StringUtils.isEmpty(money)) {
                if (parseFloat(money) % parseFloat(this.state.minCount) !== 0) {
                    this.setState({ errorTip: '输入金额不可提现' });
                    return;
                }
            }
        } else {
            if (parseFloat(money) < parseFloat(this.state.minCount)) {
                this.setState({ errorTip: '输入金额不可提现' });
                return;
            }
        }

        if (parseFloat(money) > singleCommit) {
            this.setState({ errorTip: `单笔提现不可超过￥${singleCommit}.00` });
            return;
        }

        if (this.state.balance !== null) {
            if (parseFloat(money) > parseFloat(this.state.balance)) {
                this.setState({ errorTip: '提现金额已超出本月剩余提现额度' });
                return;
            }
        }
        this.setState({ errorTip: null });
        return;
    };

    renderWithdrawMoney = () => {

        let tip2;
        if (this.state.errorTip !== null) {
            tip2 = this.state.errorTip;
        } else if (!parseFloat(this.state.money)) {
            tip2 = `可用余额${user.availableBalance}`;
        } else {
            if (!EmptyUtils.isEmpty(this.state.rate)) {
                // tip2 = `可提现，额外扣除￥${Math.ceil(accMul(this.state.rate / 100, parseFloat(this.state.money)) * 100) / 100}手续费(费率${this.state.rate}%)`;
                let num = math.eval(`${this.state.rate} * ${this.state.money} / 100 `);
                tip2 = `可提现，额外扣除￥${number_format(num,2,'.','','ceil')}服务费(费率${this.state.rate}%)`;
            } else {
                tip2 = '可提现，无服务费';
            }

            if (!EmptyUtils.isEmpty(this.state.whenLessAmount) && !EmptyUtils.isEmpty(this.state.fixedFee) && parseFloat(this.state.money) < this.state.whenLessAmount) {
                tip2 = `可提现，额外扣除${this.state.fixedFee}元服务费`;
            }

        }

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
                        style={{ marginLeft: 20, height: 40, flex: 1, fontSize: 14 }}
                        onChangeText={(text) => this.onChangeText(text)}
                        placeholder={''}
                        value={this.state.money}
                        keyboardType='numeric'
                    />
                    {(this.state.money && this.state.money.length > 0) ? (<TouchableWithoutFeedback onPress={() => {
                        this.setState({ money: '' });
                        this.checkError('');
                    }}>
                        <Image source={delete_icon}
                               style={{ width: 16, height: 16, marginRight: DesignRule.margin_page, borderRadius: 8 }}/>
                    </TouchableWithoutFeedback>) : null}
                    <TouchableWithoutFeedback onPress={() => {
                        this.commitAll();
                    }}>
                        <Text style={{
                            color: '#007AFF',
                            fontSize: DesignRule.fontSize_threeTitle,
                            includeFontPadding: false,
                            marginRight: DesignRule.margin_page
                        }}>
                            全部提现
                        </Text>
                    </TouchableWithoutFeedback>

                </View>
                <View style={{
                    height: ScreenUtils.onePixel,
                    backgroundColor: DesignRule.lineColor_inColorBg,
                    marginHorizontal: DesignRule.margin_page
                }}/>
                <View style={{
                    flexDirection: 'row',
                    width: ScreenUtils.width,
                    alignItems: 'center',
                    height: 33,
                    justifyContent: 'space-between',
                    paddingHorizontal: DesignRule.margin_page
                }}>
                    <UIText value={tip2} style={{
                        color: this.state.errorTip ? DesignRule.mainColor : DesignRule.textColor_secondTitle,
                        fontSize: DesignRule.fontSize_threeTitle
                    }}/>
                </View>
                <View style={{ backgroundColor: DesignRule.bgColor }}>
                    {this.renderTip()}
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
                    <Image source={bank} style={{ width: 49, height: 49, marginLeft: 16 }}/>
                    <View style={{ marginLeft: 12 }}>
                        <UIText value={this.state.bank_name}
                                style={{ fontSize: 15, color: DesignRule.textColor_mainTitle }}/>
                        <UIText
                            value={'尾号' + (this.state.card_no ? this.state.card_no.substring(this.state.card_no.length - 4, this.state.card_no.length) : '') + '  ' + this.state.card_type}
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


    authNum=(text)=>{
        if(text === null){
            return true
        }
        if(text.length === 0){
            return true;
        }
        if(/^-?\d+\.?\d{0,2}$/.test(text)){
            return true
        }else {
            return false
        }
    }

    onChangeText = (text) => {
        if(this.authNum(text)){
            this.checkError(text);
            this.setState({ money: text });
        }
    };
    commit = () => {
        if (parseFloat(this.state.money) > parseFloat(user.availableBalance)) {
            this.$toastShow('提现金额不能超出可提现金额');
            return;
        }

        if (this.state.minCount && (parseFloat(this.state.money) < parseFloat(this.state.minCount))) {
            this.$toastShow(`提现金额不能低于${parseFloat(this.state.minCount)}`);
            return;
        }

        if (EmptyUtils.isEmpty(user.realname)) {
            Alert.alert('未实名认证', '你还没有实名认证', [{
                text: '稍后认证', onPress: () => {
                }
            }, {
                text: '马上就去', onPress: () => {
                    this.$navigate('mine/userInformation/IDVertify2Page');
                }
            }]);
            return;
        }

        if (!user.hadSalePassword) {
            Alert.alert('未设置密码', '你还没有设置初始密码', [{
                text: '稍后设置', onPress: () => {
                }
            }, {
                text: '马上就去', onPress: () => {
                    this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
                }
            }]);
            return;
        }

        this.setState({
            isShowModal: true
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

    passwordFinish = (pwd) => {
        this.setState({ isShowModal: false });
        this.passwordView.close();

        let params = {
            'bankId': this.state.bankId,
            'bankName': this.state.bank_name,
            'cardNo': this.state.card_no,
            'payPassword': pwd,
            'totalBalance': parseFloat(this.state.money)
        };
        MineAPI.userWithdrawApply(params).then((data) => {
            this.setState({
                showFinishModal: true
            });
        }).catch((err) => {
            this.$toastShow(err.msg);
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    },
    tipTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_22
    }
});

