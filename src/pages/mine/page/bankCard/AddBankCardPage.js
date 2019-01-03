import React from "react";
import {
    NativeModules,
    StyleSheet,
    View,

} from "react-native";
import BasePage from "../../../../BasePage";
import {
    UIText, UIButton
} from "../../../../components/ui";
import {MRText as Text, MRTextInput as RNTextInput} from '../../../../components/ui';

import StringUtils from "../../../../utils/StringUtils";
import ScreenUtils from "../../../../utils/ScreenUtils";
import MineApi from "../../api/MineApi";
import Toast from "../../../../utils/bridge";
import user from "../../../../model/user";
import DesignRule from "DesignRule";
import { observer } from "mobx-react/native";
let lastcommit = null;
@observer
class AddBankCardPage extends BasePage {
    constructor(props) {
        super(props);
        // this.initHeader({
        //     title: '添加银行卡'
        // });
        this.state = {
            phone: "",
            pwd: "",
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            refundsDescription: "",
            hasInputNum: 0,
            account: user.realname,
            bankName: '',
            cardNo: "",
            cardType: '',
        };
    }

    // 导航配置
    $navigationBarOptions = {
        title: "绑定银行卡"

    };

    $isMonitorNetworkStatus(){
        return true;
    }

    _formatPhone(text){
        if(text){
            let phone =  text.replace(/ /g,'');
            if(phone && phone.length < 4){
                return phone
            }

            if(phone && phone.length < 8){
                return `${phone.substring(0,3)} ${phone.substring(3,phone.length)}`;
            }

            if(phone && phone.length > 7){
                return `${phone.substring(0,3)} ${phone.substring(3,7)} ${phone.substring(7,phone.length)}`;
            }
        }else {
            return text;
        }

    }

    _formatCard(text){

        if(text){
            let phone =  text.replace(/ /g,'');
            if(phone && phone.length < 5){
                return phone
            }

            if(phone && phone.length < 9){
                return `${phone.substring(0,4)} ${phone.substring(4,phone.length)}`;
            }

            if(phone && phone.length < 13){
                return `${phone.substring(0,4)} ${phone.substring(4,8)} ${phone.substring(8,phone.length)}`;
            }

            if(phone && phone.length < 17){
                return `${phone.substring(0,4)} ${phone.substring(4,8)} ${phone.substring(8,12)} ${phone.substring(12,phone.length)}`;
            }

            if(phone && phone.length > 16){
                return `${phone.substring(0,4)} ${phone.substring(4,8)} ${phone.substring(8,12)} ${phone.substring(12,16)} ${phone.substring(16,phone.length)}`;
            }
        }else {
            return text;
        }



    }

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={DesignRule.style_container}>
                <View style={styles.itemTitleView}>
                    <UIText value={"请绑定持卡人本人银行卡"} style={styles.itemTitleText}/>
                </View>
                <View style={{
                    height: 45,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white"
                }}>
                    <Text style={styles.accountStyle}>{"持卡人姓名"}</Text>
                    <UIText
                        style={styles.inputTextStyle}
                        value={user.realname}
                    />
                </View>
                {this.renderLine()}
                <View style={{
                    height: 45,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white"
                }}>
                    <Text style={styles.accountStyle}>{"预留手机号"}</Text>
                    <RNTextInput
                        style={styles.inputTextStyle}
                        onChangeText={text => this.setState({ phone: this._formatPhone(text) })}
                        value={this.state.phone}
                        placeholder={"请输入手机号"}
                        keyboardType='numeric'
                    />
                </View>

                <View style={{
                    height: 45,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white",
                    marginTop:10
                }}>
                    <Text style={styles.accountStyle}>{"卡号"}</Text>
                    <RNTextInput
                        style={styles.inputTextStyle}
                        onChangeText={(text) => this.inputCardNum(text)}
                        value={this.state.cardNo}
                        placeholder={"请输入卡号"}
                    />
                </View>
                {this.renderLine()}
                <View style={{
                    height: 45,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white",
                }}>
                    <Text style={styles.accountStyle}>{"卡类型"}</Text>
                    <Text style={styles.accountStyle2}>{`${this.state.bankName}  ${this.state.cardType}`}</Text>

                </View>
                <UIButton
                    value={"确认"}
                    style={{
                        marginTop: 58,
                        backgroundColor: (this.state.bankName && this.state.phone) ? DesignRule.mainColor : DesignRule.textColor_placeholder,
                        width: ScreenUtils.width - 86,
                        height: 48,
                        borderRadius: 25,
                        marginLeft: 43,
                        marginRight: 43
                    }}
                    disabled={!(this.state.bankName && this.state.phone)}
                    onPress={() => this.confirm()}/>
            </View>
        );
    }

    renderLine = () => {
        return (
            <View style={{
                height: 1,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginLeft: 48,
                marginRight: 48
            }}/>
        );
    };
    inputCardNum = (cardNo) => {
        this.setState({ cardNo: this._formatCard(cardNo) });
        let card =  cardNo.replace(/ /g,'');
        this.getBankType(card);
    };
    getBankType = (bankCard) => {
        if(StringUtils.isEmpty(bankCard)){
            this.setState({
                bankName:'',
                cardType:''
            })
            return;
        }
        if (bankCard.length < 6) {
            this.setState({
                bankName:'',
                cardType:''
            })
            return;
        }
        MineApi.findByBankCard({ cardnumber: bankCard }).then((response) => {
            if(response.data){
                this.setState({
                    bankName:response.data[0],
                    cardType:response.data[1]
                })
            }else {
                this.setState({
                    bankName:'',
                    cardType:''
                })
            }
        }).catch(e => {
            this.setState({
                bankName:'',
                cardType:''
            })
        });
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };
    renderLine = () => {
        return (
            <View style={{
                height: 1,
                backgroundColor: DesignRule.lineColor_inColorBg,
                paddingLeft: 21,
                paddingRight: 23
            }}/>
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData() {

    }

    confirm = () => {
        let now = new Date().getTime();
        if(lastcommit != null && now - lastcommit < 500){
            lastcommit = now;
            return;
        }

        let params = {
            bankName: this.state.bankName,
            cardNo: this.state.cardNo.replace(/ /g,''),
            cardType: this.state.cardType,
            phone: this.state.phone.replace(/ /g,'')
        };

        lastcommit = now;

        // if (!StringUtils.checkBankCard(params.cardNo)) {
        //     alert();
        //     this.$toastShow('请输入正确的银行卡号');
        //     return;
        // }
        // alert(1);
        //
        // if (!StringUtils.checkPhone(params.phone)) {
        //     this.$toastShow('请输入正确的手机号');
        //     return;
        // }
        // alert(2);

        // if (StringUtils.isEmpty(this.state.result.iscreditcard)) {
        //     NativeModules.commModule.toast('正在重新请求数据');
        //     this.getBankType(params.cardNo);
        //     return;
        // }
        Toast.showLoading();
        MineApi.addUserBank(params).then((response) => {
            Toast.hiddenLoading();
                NativeModules.commModule.toast("绑定银行卡成功");
                this.params.callBack();
                this.$navigateBack();
        }).catch(e => {
            Toast.hiddenLoading();
            this.$toastShow(e.msg);
        });
    };
}

const styles = StyleSheet.create({
    rectangleStyle: {
        marginTop: 20,
        height: 44,
        backgroundColor: DesignRule.bgColor,
        borderWidth: 1,
        borderColor: DesignRule.textColor_hint,
        marginLeft: 40,
        marginRight: 40,
        borderRadius: 3,
        padding: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }, accountStyle: {
        marginLeft: 21, color: DesignRule.textColor_mainTitle, width: 80
    }, accountStyle2: {
        marginLeft: 21, color: DesignRule.textColor_mainTitle, marginRight: 21
    }, inputTextStyle: {
        marginLeft: 21, flex: 1, fontSize: 14
    }, detailAddress: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "white",
        fontSize: 14
    }, itemTitleView: {
        height: 48,
        backgroundColor: DesignRule.bgColor,
        paddingLeft: 14,
        justifyContent: "center"
    }, itemTitleText: {
        fontSize: 13,
        color: DesignRule.textColor_instruction
    }, grayText: {
        fontSize: 13, color: DesignRule.textColor_instruction, marginRight: 5
    }
});

export default AddBankCardPage;
