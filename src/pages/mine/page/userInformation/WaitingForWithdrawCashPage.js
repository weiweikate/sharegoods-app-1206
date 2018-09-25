import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList, UIText, UIImage } from '../../../../components/ui';
import AccountItem from '../../components/AccountItem';
import { color } from '../../../../constants/Theme';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import withdrawMoney from '../../res/userInfoImg/withdrawMoney.png';
import tuiguang from '../../res/userInfoImg/list_icon_touguang.png';
import salesCommissions from '../../res/userInfoImg/list_icon_xiaoshouticheng.png';
import questionImage_white from '../../res/userInfoImg/questionImage_white.png';
import waitWithdrawCashBg from '../../res/userInfoImg/waitWithdrawCashBg2.png';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge';


export default class WaitingForWithdrawCashPage extends BasePage {
    constructor(props) {
        super(props);
        // this.initHeader({
        //     title: '待提现账户',
        // })
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [
                {
                    type: '推广提成',
                    time: '2018-05-25 12:15:45',
                    capital: '200.00',
                    iconImage: withdrawMoney,
                    capitalRed: false
                },
                {
                    type: '折扣支出',
                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200.00',
                    iconImage: withdrawMoney,
                    capitalRed: true,
                    needQuestionImage: true
                }
            ],
            restMoney: 1600.00,
            isEmpty: false,
            waitingForWithdrawMoney: 0,
            currentPage: 1,
            blockedBalance: this.params.blockedBalance
        };
    }

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        title: '待提现账户'
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
                    emptyTip={'暂无数据！'}
                />
            </View>
        );
    };

    renderHeader = () => {
        return (
            <View style={styles.container}>
                <Image style={styles.imageBackgroundStyle} source={waitWithdrawCashBg}/>
                <View style={styles.viewStyle}>
                    <Text style={{ marginLeft: 15, marginTop: 16, fontSize: 15, color: color.white }}>待提现余额(元)</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ height: 44, justifyContent: 'space-between', marginTop: 15 }}>
                            <Text style={{
                                marginLeft: 25,
                                fontSize: 25,
                                color: color.white
                            }}>{StringUtils.formatMoneyString(this.state.blockedBalance, false)}</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.rectangleStyle}
                                              onPress={() => this.jumpToWithdrawCashPage()}>
                                <Text style={{ fontSize: 15, color: color.white }}>兑换秀豆</Text>
                            </TouchableOpacity>
                            <View
                                style={{ flexDirection: 'row', marginTop: 10, paddingLeft: 22, alignItems: 'center' }}>
                                <UIImage source={questionImage_white}
                                         style={{ width: 13, height: 13, marginRight: 3 }}/>
                                <UIText value={'提现说明'}
                                        style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 11, color: '#ffffff' }}/>
                            </View>
                        </View>

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
                    needQuestionImage={item.needQuestionImage}
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
        if (!user.isLogin) {
            this.$navigate('login/login/LoginPage');
        }
        this.getDataFromNetwork();
    }

    jumpToWithdrawCashPage = () => {
        this.$navigate('mine/userInformation/TokenExchangePage');
    };
    clickItem = (index) => {
        // alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ['', '销售提成', '推广提成'];
        let use_type_symbol = ['', '+', '+'];
        let useLeftImg = ['', salesCommissions, tuiguang];
        Toast.showLoading();
        MineApi.userBalanceQuery({ page: 1, size: 20, type: 1 }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;
                let arrData = this.state.currentPage === 1 ? [] : this.state.viewData;
                if (data.data instanceof Array) {
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
            if (e.code === 10009) {
                this.$navigate('login/login/LoginPage');
            }
        });
    };
    onRefresh = () => {
        this.setState({currentPage:1},this.getDataFromNetwork());
    };
    onLoadMore = (page) => {
        this.setState({currentPage:this.state.currentPage+1},this.getDataFromNetwork());
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

