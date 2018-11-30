import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    TouchableOpacity,
    Alert
} from "react-native";
import BasePage from "../../../../BasePage";
import { RefreshList } from "../../../../components/ui";
import AccountItem from "../../components/CashAccountItem";
import StringUtils from "../../../../utils/StringUtils";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DataUtils from "../../../../utils/DateUtils";
import user from "../../../../model/user";
import MineApi from "../../api/MineApi";
import Toast from "./../../../../utils/bridge";
import { observer } from "mobx-react/native";
import DesignRule from "DesignRule";
import res from "../../res";

const withdrawMoney = res.userInfoImg.xiangjzhanghu_icon03_14;
const storeShare = res.userInfoImg.xiangjzhanghu_icon03;
const storeShareBonus = res.userInfoImg.xiangjzhanghu_icon03_06;
const shouyi = res.userInfoImg.xiangjzhanghu_icon03_10;
const xiaofei = res.userInfoImg.xiangjzhanghu_icon03_12;
const salesCommissions = res.userInfoImg.xiangjzhanghu_icon03_08;
const renwu = res.userInfoImg.xiangjzhanghu_icon03_16;

@observer
export default class MyCashAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            id: user.id,
            phone: "",
            pwd: "",
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [],
            restMoney: this.params.availableBalance,

            currentPage: 1,
            isEmpty: false
        };
        this.currentPage = 0;
    }

    $navigationBarOptions = {
        title: "现金账户",
        show: true // false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <RefreshList
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={"暂无数据"}
                />
            </View>
        );
    }

    renderHeader = () => {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.imageBackgroundStyle}/>
                <View style={styles.viewStyle}>
                    <Text style={{ marginLeft: 15, marginTop: 16, fontSize: 13, color: "white" }}>账户余额(元)</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ height: 44, justifyContent: "space-between", marginTop: 10 }}>
                            <Text style={{
                                marginLeft: 25,
                                fontSize: 24,
                                color: "white"
                            }}>{user.availableBalance ? user.availableBalance : `0.00`}</Text>
                        </View>
                        <TouchableOpacity style={styles.rectangleStyle} onPress={() => this.jumpToWithdrawCashPage()}>
                            <Text style={{ fontSize: 15, color: "white" }}>提现</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );
    };
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity>
                <AccountItem
                    type={item.type}
                    time={item.time}
                    serialNumber={item.serialNumber}
                    capital={StringUtils.formatMoneyString(item.capital, false)}
                    iconImage={item.iconImage}
                    clickItem={() => {
                        this.clickItem(index);
                    }}
                    capitalRed={item.capitalRed}
                />
            </TouchableOpacity>
        );
    };
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

    //**********************************BusinessPart******************************************
    componentDidMount() {
        this.onRefresh();
    }

    jumpToWithdrawCashPage = () => {
        MineApi.getUserBankInfo().then((data) => {
            if (data.data && data.data.length > 0) {

                // MineApi.isFirstTimeWithdraw().then((data)=>{
                //     if(data.data){
                //
                //     }else {
                //         this.$navigate("mine/userInformation/WithdrawCashPage");
                //     }
                // }).catch((error)=>{
                //
                // })

                this.$navigate("mine/userInformation/WithdrawCashPage");

            } else {
                Alert.alert("未绑定银行卡", "你还没有绑定银行卡", [{
                    text: "稍后设置", onPress: () => {
                    }
                }, {
                    text: "马上就去", onPress: () => {
                        this.$navigate("mine/bankCard/BankCardListPage", {
                            callBack: (params) => {
                            }
                        });
                    }
                }]);
            }
        }).catch((err) => {
            this.$toastShow(err.msg);
        });
    };
    clickItem = (index) => {
        // alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ["", "用户收益", "提现支出", "消费支出", "店主分红", "店员分红", "销售提成", "现金红包", "任务奖励"];
        let use_type_symbol = ["", "+", "-"];
        let useLeftImg = ["", shouyi, withdrawMoney, xiaofei, storeShare, storeShareBonus, salesCommissions, salesCommissions, renwu];
        Toast.showLoading();
        let arrData = this.currentPage == 1 ? [] : this.state.viewData;
        MineApi.userBalanceQuery({ page: this.currentPage, size: 10, type: 1 }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code == 10000) {
                let data = response.data;
                if (data.data instanceof Array) {
                    data.data.map((item, index) => {
                        arrData.push({
                            type: item.useType === 3 && item.biType == 1 ? "消费退款" : use_type[item.useType],
                            time: DataUtils.getFormatDate(item.createTime / 1000),
                            serialNumber: "编号：" + item.serialNo,
                            capital: use_type_symbol[item.biType] + (item.balance ? item.balance : 0.00),
                            iconImage: useLeftImg[item.useType],
                            capitalRed: use_type_symbol[item.biType] === "-"
                        });
                    });
                }
                this.setState({
                    viewData: arrData,
                    isEmpty: data.data && data.data.length !== 0 ? false : true
                });
            } else {
                this.$toastShow(response.msg);

            }
        }).catch(e => {
            Toast.hiddenLoading();
            this.setState({
                viewData: arrData,
                isEmpty: true
            });
        });
    };
    onRefresh = () => {
        this.currentPage = 1;
        MineApi.getUser().then(res => {
            let data = res.data;
            user.saveUserInfo(data);
        }).catch(err => {
            if (err.code === 10009) {
                this.props.navigation.navigate("login/login/LoginPage");
            }
        });
        this.getDataFromNetwork();
    };
    onLoadMore = () => {
        if (!this.state.isEmpty) {
            this.currentPage++;
            this.getDataFromNetwork();
        }

    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    },
    container: {}, imageBackgroundStyle: {
        position: "absolute",
        height: 95,
        backgroundColor: "#FF4F6E",
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15
    }, rectangleStyle: {
        width: 120,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "white",
        marginLeft: 15,
        marginRight: 15,
        justifyContent: "center",
        alignItems: "center",
        padding: 3
    }, viewStyle: {
        height: 95,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15
    }
});


