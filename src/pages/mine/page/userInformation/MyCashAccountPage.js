import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
import AccountItem from '../../components/CashAccountItem';
import { color } from '../../../../constants/Theme';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import withdrawMoney from '../../res/userInfoImg/list_icon_tixiang.png';
import storeShare from '../../res/userInfoImg/list_icon_dianzhufehong.png';
import storeShareBonus from '../../res/userInfoImg/list_icon_dianpufewhong.png';
import tuiguang from '../../res/userInfoImg/list_icon_touguang.png';
import xiaofei from '../../res/userInfoImg/list_icon_xiaofe.png';
import salesCommissions from '../../res/userInfoImg/list_icon_xiaoshouticheng.png';
import cashAccount from '../../res/userInfoImg/cashAccount.png';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from './../../../../utils/bridge';

export default class MyCashAccountPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            id: user.id,
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [
                {
                    useType: '提现支出',
                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200.00',
                    iconImage: withdrawMoney,
                    capitalRed: true
                },
                {
                    type: '提现',
                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200.00',
                    iconImage: withdrawMoney,
                    capitalRed: true
                },
                {
                    type: '店主分红',
                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200.00',
                    iconImage: withdrawMoney,
                    capitalRed: true
                },
                {
                    type: '销售提成',
                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200.00',
                    iconImage: withdrawMoney,
                    capitalRed: true
                }
            ],
            restMoney: this.params.availableBalance,
            currentPage: 1,
            isEmpty: false
        };
    }

    $navigationBarOptions = {
        title: '现金账户',
        show: true // false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <RefreshList
                    ListFooterComponent={this.renderFootder}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据'}
                />
            </View>
        );
    };

    renderHeader = () => {
        return (
            <View style={styles.container}>
                <Image style={styles.imageBackgroundStyle} source={cashAccount}/>
                <View style={styles.viewStyle}>
                    <Text style={{ marginLeft: 15, marginTop: 16, fontSize: 15, color: color.white }}>账户余额(元)</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ height: 44, justifyContent: 'space-between', marginTop: 15 }}>
                            <Text style={{
                                marginLeft: 25,
                                fontSize: 25,
                                color: color.white
                            }}>{StringUtils.formatMoneyString(this.state.restMoney, false)}</Text>
                        </View>
                        <TouchableOpacity style={styles.rectangleStyle} onPress={() => this.jumpToWithdrawCashPage()}>
                            <Text style={{ fontSize: 15, color: color.white }}>提现</Text>
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
                    capital={item.capital}
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
            <View style={{ height: 1, backgroundColor: color.line, marginLeft: 48, marginRight: 48 }}/>
        );
    };

    //**********************************BusinessPart******************************************
    componentDidMount() {
        this.getDataFromNetwork();
    }

    jumpToWithdrawCashPage = () => {
        this.$navigate('mine/userInformation/WithdrawCashPage');
    };
    clickItem = (index) => {
        alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ['', '用户收益', '提现支出', '消费支出', '店主分红', '店员分红', '销售提成', '推广提成'];
        let use_type_symbol = ['', '+', '-', '-', '+', '+', '+', '+'];
        let useLeftImg = ['', storeShare, withdrawMoney, xiaofei, storeShare, storeShareBonus, salesCommissions, tuiguang];

        Toast.showLoading();
        MineApi.userBalanceQuery({ page: 1, size: 20, type: 2 }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code == 10000) {
                let data = response.data;
                let arrData = this.state.currentPage == 1 ? [] : this.state.viewData;
                data.data.map((item, index) => {
                    arrData.push({
                        type: use_type[item.useType],
                        time: DataUtils.getFormatDate(item.createTime / 1000),
                        serialNumber: '流水号：' + item.serialNo,
                        capital: use_type_symbol[item.useType] + item.balance,
                        iconImage: useLeftImg[item.useType],
                        capitalRed: use_type_symbol[item.useType] === '-'
                    });
                });
                this.setState({
                    viewData: arrData,
                    isEmpty: data.data && data.data.length !== 0 ? false : true
                });
            } else {
                this.$toastShow(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
        });
        // MineApi.findDealerAccountByIdAPP({ id: this.state.id }).then((response) => {
        //     if (response.ok) {
        //         let data = response.data;
        //         this.setState({
        //             restMoney: data.available_balance,
        //             blockMoney: data.blocked_balances
        //         });
        //     } else {
        //         NativeModules.commModule.toast(response.msg);
        //     }
        // }).catch(e => {
        //     Toast.hiddenLoading();
        // });
    };
    onRefresh = () => {
        this.setState({
            currentPage: 1
        });
        this.getDataFromNetwork();
    };
    onLoadMore = () => {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
        this.getDataFromNetwork();
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: color.page_background
    },
    container: {}, imageBackgroundStyle: {
        position: 'absolute',
        height: 140,
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15
    }, rectangleStyle: {
        width: 100,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: color.white,
        marginRight: 15,
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center'
    }, viewStyle: {
        height: 140,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15
    }
});

