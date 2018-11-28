import React from "react";
import {
    NativeModules,
    StyleSheet,
    View,
    TextInput as RNTextInput,
    Text
} from "react-native";
import BasePage from "../../../../BasePage";
import {
    UIText, UIButton
} from "../../../../components/ui";
import StringUtils from "../../../../utils/StringUtils";
import ScreenUtils from "../../../../utils/ScreenUtils";
import MineApi from "../../api/MineApi";
import Toast from "../../../../utils/bridge";
import user from "../../../../model/user";
import DesignRule from "DesignRule";
import { observer } from "mobx-react/native";
var lastcommit = null;
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
            bankName: null,
            cardNo: "",
            cardType: null,
        };
    }

    // 导航配置
    $navigationBarOptions = {
        title: "绑定银行卡"

    };

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
                    <Text style={styles.accountStyle}>{"卡号"}</Text>
                    <RNTextInput
                        style={styles.inputTextStyle}
                        onChangeText={(text) => this.inputCardNum(text)}
                        placeholder={"请输入卡号"}
                        underlineColorAndroid={"transparent"}
                        //onBlur={()=>this.getBankType()}
                    />
                </View>
                {this.renderLine()}
                <View style={{
                    height: 45,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white"
                }}>
                    <Text style={styles.accountStyle}>{"手机号"}</Text>
                    <RNTextInput
                        style={styles.inputTextStyle}
                        onChangeText={text => this.setState({ phone: text })}
                        placeholder={"请输入手机号"}
                        underlineColorAndroid={"transparent"}
                        keyboardType='numeric'
                    />
                </View>
                <View style={{
                    height: 45,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white",
                    justifyContent: "space-between",
                    marginTop:10
                }}>
                    <Text style={styles.accountStyle}>{"银行"}</Text>
                    <Text style={styles.accountStyle2}>{this.state.bankName}</Text>

                </View>
                {this.renderLine()}
                <View style={{
                    height: 45,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "white",
                    justifyContent: "space-between"
                }}>
                    <Text style={styles.accountStyle}>{"卡类型"}</Text>
                    <Text style={styles.accountStyle2}>{this.state.cardType}</Text>

                </View>
                <UIButton
                    value={"确认"}
                    style={{
                        marginTop: 58,
                        backgroundColor: this.state.bankName ? DesignRule.mainColor : DesignRule.textColor_placeholder,
                        width: ScreenUtils.width - 86,
                        height: 48,
                        borderRadius: 25,
                        marginLeft: 43,
                        marginRight: 43
                    }}
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
        this.setState({ cardNo: cardNo });
        this.getBankType(cardNo);
    };
    getBankType = (bankCard) => {
        if(StringUtils.isEmpty(bankCard)){
            return;
        }
        if (bankCard.length < 6) {
            return;
        }
        MineApi.findByBankCard({ cardnumber: bankCard }).then((response) => {
            if(response.data){
                this.setState({
                    bankName:response.data[0],
                    cardType:response.data[1]
                })
            }
        }).catch(e => {
            Toast.hiddenLoading();
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
        if(lastcommit != null && now-lastcommit<500){
            lastcommit = now;
            return;
        }

        let params = {
            bankName: this.state.bankName,
            cardNo: this.state.cardNo,
            cardType: this.state.cardType,
            phone: this.state.phone
        };

        lastcommit = now;




        // if (!StringUtils.checkBankCard(params.account)) {
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
        marginLeft: 21, flex: 1, backgroundColor: "white", fontSize: 14
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
