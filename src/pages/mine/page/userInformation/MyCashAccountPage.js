import React from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    RefreshControl,
    SectionList,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DataUtils from '../../../../utils/DateUtils';
import EmptyUtils from '../../../../utils/EmptyUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from './../../../../utils/bridge';
import { observer } from 'mobx-react';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import EmptyView from '../../../../components/pageDecorator/BaseView/EmptyView';
import RouterMap, { routeNavigate } from '../../../../navigation/RouterMap';
import LinearGradient from 'react-native-linear-gradient';

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
const account_bg_white = res.bankCard.account_bg_white;
const red_up = res.cashAccount.zhanghu_red;
const lv_down = res.cashAccount.zhanghu_lv;
const writer = res.cashAccount.writer_icon;
const cash_noData = res.cashAccount.cash_noData;
const qita = res.cashAccount.qita_icon;
const chengFa = res.cashAccount.chengFa_icon;
const shouru = res.cashAccount.shouru_icon;
const shouyi = res.cashAccount.shouyi_icon;
// const renwuShuoMing = res.cashAccount.renwuShuoMing_icon;

const allType = {
    1: {
        title: '其他',
        icon: renwu
    },
    2: {
        title: '提现支出',
        icon: tixiang
    },
    3: {
        title: '消费支出',
        icon: xiaofei
    },
    4: {
        title: '导师管理',
        icon: daoshi
    },
    5: {
        title: '额外品牌分红奖励',
        icon: fenhong
    },
    6: {
        title: '品牌推广奖励',
        icon: tuiguang
    },
    7: {
        title: '其他',
        icon: hongbao
    },
    8: {
        title: '任务奖励',
        icon: renwu
    },
    9: {
        title: '消费退款',
        icon: xiaofeitk
    },
    10: {
        title: '提现退款',
        icon: tixiantk
    },
    11: {
        title: '自返奖励',
        icon: hongbao
    },
    12: {
        title: '写手奖励',
        icon: writer
    },
    13: {
        title: '系统升级',
        icon: hongbao
    },
    17: {
        title: '抽奖奖励',
        icon: renwu
    }

};

const newTypeIcons = {
    1: {title: '消费', icon: xiaofei},
    2: {title: '退款', icon: chengFa},
    3: {title: '余额发放', icon: shouru},
    4: {title: '提现', icon: tixiang},
    5: {title: '待入账结算', icon: shouyi},
    6: {title: '系统调账', icon: renwu}
};

@observer
export default class MyCashAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.getUserBankInfoing = false;
        this.state = {
            viewData: [],
            currentPage: 1,
            isEmpty: false,
            changeHeader: false,
            refreshing: false

        };
        this.currentPage = 0;
        this.type = null;
        this.biType = null;
    }

    $NavBarRightPressed = () => {
        this.$navigate(RouterMap.BankCardListPage);
    };
    $navigationBarOptions = {
        title: '现金账户',
        show: false
    };

    $isMonitorNetworkStatus() {
        return true;
    }


    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y <= 175) {
            if (this.state.changeHeader) {
                this.setState({
                    changeHeader: false
                });
            }
        } else {
            if (!this.state.changeHeader) {
                this.setState({
                    changeHeader: true
                });
            }
        }
    };

    sectionComp = (info) => {
        let txt = info.section.key;
        return txt === 'B' ? this.renderReHeader() : null;
    };

    extraUniqueKey = (item, index) => {
        return index + item;
    };

    //**********************************ViewPart******************************************
    _render() {
        const { viewData } = this.state;
        let sections = [
            { key: 'A', data: [{ title: 'head' }] },
            { key: 'B', data: !EmptyUtils.isEmpty(viewData) ? viewData : [{ title: 'empty' }] }
        ];
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <SectionList
                    renderSectionHeader={this.sectionComp}
                    renderItem={this.renderItem}
                    sections={sections}
                    keyExtractor={this.extraUniqueKey}// 生成一个不重复的key
                    ItemSeparatorComponent={() => <View/>}
                    onEndReached={this.onLoadMore}
                    onEndReachedThreshold={0.1}
                    stickySectionHeadersEnabled={true}
                    onScroll={(e) => {
                        this._onScroll(e);
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onLoad}
                            colors={[DesignRule.mainColor]}
                        />
                    }
                />
            </View>
        );
    }

    _accountInfoRender() {
        return (
            <ImageBackground source={account_bg_white} resizeMode={'stretch'} style={{
                position: 'absolute',
                top: 0,
                height: px2dp(184),
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
                            style={{
                                fontSize: DesignRule.fontSize_threeTitle,
                                color: DesignRule.mainColor
                            }}>提现</Text>
                    </NoMoreClick>

                </View>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 48,
                    marginLeft: DesignRule.margin_page,
                    height: 58,
                    lineHeight: 58
                }}>{user.availableBalance ? user.availableBalance : '0.00'}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 15 }}>
                    <View style={{ flex: 1, marginLeft: 15, justifyContent: 'center' }}>
                        <Text style={styles.numTextStyle}>{user.blockedBalance ? user.blockedBalance : '0.00'}</Text>
                        <Text style={styles.numRemarkStyle}>待入账(元)</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 15, justifyContent: 'center' }}>
                        <Text
                            style={styles.numTextStyle}>{user.historicalBalance ? user.historicalBalance : '0.00'}</Text>
                        <Text style={styles.numRemarkStyle}>累计收益(元)</Text>
                    </View>
                </View>
            </ImageBackground>
        );
    }

    renderHeader = () => {
        return (
            <LinearGradient start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#FF0050', '#FC5D39']}
            >
                <View style={styles.headerWrapper}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <View style={{
                            paddingLeft: px2dp(5),
                            height: 40,
                            justifyContent: 'center',
                            flex: 1
                        }}>
                            <Image source={res.button.back_white}
                                   style={{ width: 30, height: 30 }}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{
                        color: DesignRule.white,
                        fontSize: px2dp(17),
                        includeFontPadding: false
                    }}>
                        {this.state.changeHeader ? '账户余额' : ''}
                    </Text>

                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigate(RouterMap.BankCardListPage);
                    }}>
                        <Text style={[styles.settingStyle, { flex: 1 }]}>银行卡管理</Text>
                    </TouchableWithoutFeedback>

                </View>
            </LinearGradient>
        );
    };

    renderReHeader = () => {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', height: 40 }}>
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        if (obj.i === 1) {
                            this.type = 1;
                            this.biType = 1;
                        } else if (obj.i === 2) {
                            this.type = 1;
                            this.biType = 2;
                        } else if (obj.i === 3) {
                            this.type = 2;
                            this.biType = 1;
                        } else {
                            this.type = null;
                            this.biType = null;
                        }
                        this.onRefresh();
                    }}
                    style={{ flex: 1, width: ScreenUtils.width * 2 / 3, marginBottom: ScreenUtils.safeBottom }}
                    scrollWithoutAnimation={true}
                    renderTabBar={this._renderTabBar}
                    //进界面的时候打算进第几个
                    initialPage={0}
                >
                    <View tabLabel={'全部'}/>
                    <View tabLabel={'收入'}/>
                    <View tabLabel={'支出'}/>
                    <View tabLabel={'待入账'}/>
                </ScrollableTabView>
            </View>
        );
    };

    _renderTabBar = () => {
        return (
            <DefaultTabBar
                backgroundColor={'white'}
                activeTextColor={DesignRule.mainColor}
                inactiveTextColor={DesignRule.textColor_instruction}
                textStyle={styles.tabBarText}
                underlineStyle={styles.tabBarUnderline}
                style={styles.tabBar}
                tabStyle={styles.tab}
            />
        );
    };

    renderItem = (info) => {
        let item = info.item;
        console.log('item', item);
        let key = info.section.key;
        if (key === 'A') {
            return (
                <View>
                    <LinearGradient style={{
                        marginBottom: 10,
                        height: px2dp(164),
                        width: ScreenUtils.width,
                        backgroundColor: 'white'
                    }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FF0050', '#FC5D39']}
                    />
                    <View style={{ height: 10, width: ScreenUtils.width, backgroundColor: 'white' }}/>
                    {this._accountInfoRender()}
                </View>
            );
        }
        if (item.title && item.title === 'empty') {
            return <EmptyView style={{ flex: 1 }} imageStyle={{ width: 267, height: 192 }} description={''}
                              subDescription={'暂无明细数据～'} source={cash_noData}/>;
        }
        return (
            <View style={{
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                width: ScreenUtils.width,
                backgroundColor: 'white',
                paddingBottom: 10,
                paddingTop: 10
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
                    {Number(item.status) === 2 || (this.type === 2 && this.biType === 1) ?
                        <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    fontSize: 17,
                                    color: DesignRule.textColor_mainTitle
                                }}>{item.capital ? item.capital : 0}</Text>
                            </View>
                            <Text style={{
                                fontSize: 12, color: DesignRule.textColor_instruction
                            }}>{item.realBalance == 0 || (!EmptyUtils.isEmpty(item.realBalance) && item.realBalance >= 0) ? `已入账：${item.realBalance}` : '待入账：？'}</Text>
                        </View>
                        :
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
                        </View>}

                </View>
            </View>
        );
    };


    //**********************************BusinessPart******************************************
    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    componentDidMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.onRefresh();
            }
        );

    }

    jumpToWithdrawCashPage = () => {
        MineApi.getUserBankInfo().then((data) => {
            if (data.data && data.data.length > 0) {
                MineApi.gongmallResult().then((data) => {
                    if (!data.data) {
                        this.$navigate(RouterMap.WithdrawalAgreementPage);
                    } else {
                        this.$navigate(RouterMap.WithdrawCashPage);
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
                        this.$navigate(RouterMap.BankCardListPage, {
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
        let use_type_symbol = ['', '+', '-'];
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        MineApi.userBalanceQuery({
            page: this.currentPage,
            size: 10,
            type: this.type,
            biType: this.biType
        }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;
                if (data.data instanceof Array) {
                    data.data.map((item, index) => {
                        let remark = '';
                        let  icon = '';
                        if(item.useType){
                            remark = allType[item.useType] ?  allType[item.useType].title : '其他';
                            icon = allType[item.useType] ? allType[item.useType].icon : qita;
                        }else {
                            remark = item.remark ? item.remark : '其他';
                            icon = newTypeIcons[item.tradeType] ? newTypeIcons[item.tradeType].icon : renwu
                        }
                        arrData.push({
                            type: remark,
                            time: DataUtils.getFormatDate(item.createTime / 1000),
                            serialNumber: item.serialNo,
                            capital: use_type_symbol[item.biType] + (item.balance ? item.balance : 0.00),
                            iconImage: icon,
                            capitalRed: use_type_symbol[item.biType] === '-',
                            realBalance: item.realBalance,
                            status: item.status
                        });
                    });
                }
                this.setState({
                    refreshing: false,
                    viewData: arrData,
                    isEmpty: data.data && data.data.length !== 0 ? false : true
                });
            } else {
                this.setState({ refreshing: false });
                this.$toastShow(response.msg);

            }
        }).catch(e => {
            Toast.hiddenLoading();
            this.setState({
                refreshing: false,
                viewData: arrData,
                isEmpty: true
            });
        });
    };
    onLoad = () => {
        if (user.isLogin) {
            MineApi.getUser().then(resp => {
                let data = resp.data;
                user.saveUserInfo(data);
            }).catch(err => {
                if (err.code === 10009) {
                    routeNavigate(RouterMap.LoginPage);
                }
            });
        }
        this.currentPage = 1;
        this.setState({ refreshing: this.currentPage === 1 });
        this.getDataFromNetwork();
    };

    onRefresh = () => {
        this.currentPage = 1;
        if (user.isLogin) {
            MineApi.getUser().then(resp => {
                let data = resp.data;
                user.saveUserInfo(data);
            }).catch(err => {
                if (err.code === 10009) {
                    routeNavigate(RouterMap.LoginPage);
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
        backgroundColor: DesignRule.white
    },
    container: {
        height: px2dp(188),
        width: ScreenUtils.width
    },
    tabBar: {
        width: ScreenUtils.width * 2 / 3,
        height: 40,
        borderWidth: 0,
        borderColor: DesignRule.lineColor_inWhiteBg
    },
    tab: {
        paddingBottom: 0
    },
    tabBarText: {
        fontSize: 15
    },
    tabBarUnderline: {
        width: 10,
        height: 2,
        marginHorizontal: (ScreenUtils.width * 2 / 3 - 10 * 4) / 8,
        backgroundColor: DesignRule.mainColor,
        borderRadius: 1
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: DesignRule.margin_page,
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
        fontSize: DesignRule.fontSize_threeTitle,
        textAlign: 'right'
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
        borderWidth: 1,
        position: 'absolute',
        right: 6,
        top: 0
    },
    numTextStyle: {
        color: '#333333',
        fontSize: 19
    },
    numRemarkStyle: {
        color: '#999999',
        fontSize: 12
    }
});


