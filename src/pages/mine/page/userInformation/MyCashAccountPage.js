import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Alert,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from './../../../../utils/bridge';
import { observer } from 'mobx-react/native';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';

const { px2dp } = ScreenUtils;
const renwu = res.cashAccount.renwu_icon;
const daoshi = res.cashAccount.daoshi_icon;
const fenhong = res.cashAccount.fenhong_icon;
const hongbao = res.cashAccount.hongbao_icon;
const tuiguang = res.cashAccount.tuiguang_icon;
const tixiang = res.cashAccount.tixian_icon;
const tixiantk = res.cashAccount.tixian_icon;
const xiaofei = res.cashAccount.xiaofei_icon;
const xiaofeitk = res.cashAccount.xiaofei_icon;
const account_bg = res.bankCard.account_bg;
const account_bg_white = res.bankCard.account_bg_white;
const red_up = res.cashAccount.zhanghu_red;
const lv_down = res.cashAccount.zhanghu_lv;

@observer
export default class MyCashAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.getUserBankInfoing = false;
        this.state = {
            viewData: [],
            currentPage: 1,
            isEmpty: false

        };
        this.currentPage = 0;
    }

    $NavBarRightPressed = () => {
        this.$navigate('mine/bankCard/BankCardListPage');
    };
    $navigationBarOptions = {
        title: '现金账户',
        show: false
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                {this.state.viewData && this.state.viewData.length > 0 ? null : this.renderReHeader()}
                <RefreshList
                    data={this.state.viewData}
                    ListHeaderComponent={this.renderReHeader}
                    progressViewOffset={30}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无明细数据～'}
                />
                {this._accountInfoRender()}
            </View>
        );
    }

    _accountInfoRender() {
        return (
            <ImageBackground source={account_bg_white} resizeMode={'stretch'} style={{
                position: 'absolute',
                top: px2dp(80),
                height: px2dp(140),
                width: ScreenUtils.width,
                left: 0,
                paddingHorizontal: DesignRule.margin_page
            }}>

                <View style={styles.withdrawWrapper}>
                    <Text style={styles.countTextStyle}>
                        账户余额（元）
                    </Text>
                    <NoMoreClick style={styles.withdrawButtonWrapper} onPress={() => this.jumpToWithdrawCashPage()}>
                        <Text
                            style={{ fontSize: DesignRule.fontSize_threeTitle, color: DesignRule.mainColor }}>提现</Text>
                    </NoMoreClick>
                </View>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 48,
                    marginLeft: DesignRule.margin_page,
                    marginTop: px2dp(15),
                    marginBottom: px2dp(30)
                }}>{user.availableBalance ? user.availableBalance : `0.00`}</Text>
            </ImageBackground>
        );
    }

    renderFooter = () => {
        return (
            <View style={{ height: 20, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
        );
    };
    renderHeader = () => {
        return (
            <ImageBackground resizeMode={'stretch'} source={account_bg} style={styles.container}>
                <View style={styles.headerWrapper}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={res.button.white_back}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigate('mine/bankCard/BankCardListPage');
                    }}>
                        <Text style={styles.settingStyle}>账户设置</Text>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    };

    renderReHeader = () => {
        return (
            <View style={{
                paddingLeft: 15,
                paddingTop: 52,
                paddingBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white'
            }}>
                <View style={{
                    backgroundColor: DesignRule.mainColor,
                    width: 2,
                    height: 8,
                    borderRadius: 1,
                    marginRight: 5
                }}/>
                <Text style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}>账户明细</Text>
            </View>
        );
    };
    renderItem = ({ item, index }) => {
        return (
            <View style={{
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                width: ScreenUtils.width,
                backgroundColor: 'white',
                paddingBottom: 20
            }}>
                <Image source={item.iconImage} style={{ marginLeft: 15, width: 40, height: 40 }}/>
                <View style={{
                    marginLeft: 17,
                    marginRight: 18,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                    <View style={{ justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 14, color: DesignRule.textColor_secondTitle }}>{item.type}</Text>
                        <Text style={{
                            fontSize: 12, color: DesignRule.textColor_instruction
                        }}>{item.time}</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: 17,
                                color: DesignRule.textColor_mainTitle
                            }}>{StringUtils.formatMoneyString(item.capital, false)}</Text>
                            <Image style={{ marginLeft: 5, width: 8, height: 5 }}
                                   source={item.capitalRed ? lv_down : red_up}/>
                        </View>
                        <Text style={{
                            fontSize: 12, color: DesignRule.textColor_instruction
                        }}>{item.serialNumber}</Text>
                    </View>
                </View>
            </View>
        );
    };


    //**********************************BusinessPart******************************************
    componentWillMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.onRefresh();
            }
        );
    }

    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    jumpToWithdrawCashPage = () => {
        MineApi.getUserBankInfo().then((data) => {
            if (data.data && data.data.length > 0) {
                MineApi.gongmallResult().then((data) => {
                    if (!data.data) {
                        this.$navigate('mine/bankCard/WithdrawalAgreementPage');
                    } else {
                        this.$navigate('mine/userInformation/WithdrawCashPage');
                    }
                }).catch(error => {
                    this.$toastShow(error.msg);
                });
            } else {
                Alert.alert('未绑定银行卡', '你还没有绑定银行卡', [{
                    text: '稍后设置', onPress: () => {
                    }
                }, {
                    text: '马上就去', onPress: () => {
                        this.$navigate('mine/bankCard/BankCardListPage', {
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

    getDataFromNetwork = () => {
        let use_type = ['', '其他', '提现支出', '消费支出', '导师管理费', '额外品牌分红奖励', '品牌推广奖励金', '其他', '任务奖励', '消费退款', '提现退款'];
        let use_type_symbol = ['', '+', '-'];
        let useLeftImg = ['', renwu, tixiang, xiaofei, daoshi, fenhong, tuiguang, hongbao, renwu, xiaofeitk, tixiantk];
        if (this.currentPage > 1) {
            Toast.showLoading();
        }

        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        MineApi.userBalanceQuery({ page: this.currentPage, size: 10, type: 1 }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;
                if (data.data instanceof Array) {
                    data.data.map((item, index) => {
                        arrData.push({
                            type: use_type[item.useType],
                            time: DataUtils.getFormatDate(item.createTime / 1000),
                            serialNumber: item.serialNo,
                            capital: use_type_symbol[item.biType] + (item.balance ? item.balance : 0.00),
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
        if (user.isLogin) {
            MineApi.getUser().then(resp => {
                let data = resp.data;
                user.saveUserInfo(data);
            }).catch(err => {
                if (err.code === 10009) {
                    this.gotoLoginPage();
                }
            });
        }
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
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    container: {
        height: px2dp(188),
        width: ScreenUtils.width
    },

    viewStyle: {
        height: 95,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: DesignRule.margin_page,
        marginTop: ScreenUtils.statusBarHeight,
        height: 44
    },
    withdrawWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: DesignRule.margin_page,
        marginTop: px2dp(22)
    },
    settingStyle: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_threeTitle
    },
    countTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    withdrawButtonWrapper: {
        width: px2dp(80),
        height: px2dp(28),
        borderRadius: px2dp(14),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.white,
        borderColor: DesignRule.mainColor,
        borderWidth: 1
    }
});


