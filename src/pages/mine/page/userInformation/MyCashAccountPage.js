import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
import AccountItem from '../../components/CashAccountItem';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import withdrawMoney from '../../res/userInfoImg/xiangjzhanghu_icon03_14.png';
import storeShare from '../../res/userInfoImg/xiangjzhanghu_icon03.png';
import storeShareBonus from '../../res/userInfoImg/xiangjzhanghu_icon03_06.png';
import shouyi from '../../res/userInfoImg/xiangjzhanghu_icon03_10.png';
import xiaofei from '../../res/userInfoImg/xiangjzhanghu_icon03_12.png';
import salesCommissions from '../../res/userInfoImg/xiangjzhanghu_icon03_08.png';
import renwu from '../../res/userInfoImg/xiangjzhanghu_icon03_16.png'

import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from './../../../../utils/bridge';
import DesignRule from 'DesignRule';

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
            viewData: [],
            restMoney: this.params.availableBalance,

            currentPage: 1,
            isEmpty: false
        };
        this.currentPage = 0;
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
    }

    renderHeader = () => {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.imageBackgroundStyle} />
                <View style={styles.viewStyle}>
                    <Text style={{ marginLeft: 15, marginTop: 16, fontSize: 15, color: 'white' }}>账户余额(元)</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ height: 44, justifyContent: 'space-between', marginTop: 15 }}>
                            <Text style={{
                                marginLeft: 25,
                                fontSize: 25,
                                color: 'white'
                            }}>{StringUtils.formatMoneyString(this.state.restMoney, false)}</Text>
                        </View>
                        <TouchableOpacity style={styles.rectangleStyle} onPress={() => this.jumpToWithdrawCashPage()}>
                            <Text style={{ fontSize: 15, color: 'white' }}>提现</Text>
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
                    capital={StringUtils.formatMoneyString(item.capital,false)}
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
            <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg, marginLeft: 48, marginRight: 48 }}/>
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
        // alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ['', '用户收益', '提现支出', '消费支出', '店主分红', '店员分红', '销售提成', '推广提成','任务奖励'];
        let use_type_symbol = ['', '+', '-',];
        let useLeftImg = ['', shouyi, withdrawMoney, xiaofei, storeShare, storeShareBonus, salesCommissions, salesCommissions,renwu];
        Toast.showLoading();
        let arrData = this.currentPage == 1 ? [] : this.state.viewData;
        MineApi.userBalanceQuery({ page: this.currentPage, size: 20, type: 1 }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code == 10000) {
                let data = response.data;
                if (data.data instanceof Array) {
                    data.data.map((item, index) => {
                        arrData.push({
                            type: use_type[item.useType],
                            time: DataUtils.getFormatDate(item.createTime / 1000),
                            serialNumber: '编号：' + item.serialNo,
                            capital: use_type_symbol[item.biType] + item.balance,
                            iconImage: useLeftImg[item.useType],
                            capitalRed: use_type_symbol[item.biType] === '-'
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
        this.getDataFromNetwork();
    };
    onLoadMore = () => {
        this.currentPage++;
        this.getDataFromNetwork();
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    },
    container: {}, imageBackgroundStyle: {
        position: 'absolute',
        height: 140,
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15,
        backgroundColor:'#FF4F6E'
    }, rectangleStyle: {
        width: 100,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
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


