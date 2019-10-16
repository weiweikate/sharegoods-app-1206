/**
 * @author zhoujianxin
 * @date on 2019/9/18
 * @desc 自返金账户列表
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React from 'react';
import {
    Image,
    RefreshControl,
    SectionList,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    ImageBackground
} from 'react-native';
import {observer} from 'mobx-react';
import ScrollableTabView, {DefaultTabBar} from '@mr/react-native-scrollable-tab-view';
import LinearGradient from 'react-native-linear-gradient';

import BasePage from '../../../../BasePage';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DataUtils from '../../../../utils/DateUtils';
import EmptyUtils from '../../../../utils/EmptyUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from './../../../../utils/bridge';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import {MRText as Text} from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import EmptyView from '../../../../components/pageDecorator/BaseView/EmptyView';
import RouterMap, {routeNavigate} from '../../../../navigation/RouterMap';
import ReturnCashModel from '../../model/ReturnCashModel';

const {px2dp} = ScreenUtils;
const renwu = res.cashAccount.renwu_icon;
const tixiang = res.cashAccount.tixian_icon;
const xiaofei = res.cashAccount.xiaofei_icon;
const red_up = res.cashAccount.zhanghu_red;
const lv_down = res.cashAccount.zhanghu_lv;
const cash_noData = res.cashAccount.cash_noData;
const chengFa = res.cashAccount.chengFa_icon;
const shouru = res.cashAccount.shouru_icon;
const shouyi = res.cashAccount.shouyi_icon;

const bg_black_img = res.userInfoImg.cash_bg_icon;
const bg_top_img = res.userInfoImg.cash_top_icon;

const newTypeIcons = {
    1: {title: '消费', icon: xiaofei},
    2: {title: '退款', icon: chengFa},
    3: {title: '余额发放', icon: shouru},
    6: {title: '提现', icon: tixiang},
    9: {title: '待入账结算', icon: shouyi},
    99: {title: '系统调账', icon: renwu}
};

@observer
export default class CashRewardAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            currentPage: 1,
            isEmpty: false,
            changeHeader: false,
            refreshing: false

        };
        this.currentPage = 0;
        this.params = null;
    }

    $NavBarRightPressed = () => {
        this.$navigate(RouterMap.BankCardListPage);
    };
    $navigationBarOptions = {
        title: '我的自返金',
        show: false
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    sectionComp = (info) => {
        let txt = info.section.key;
        return txt === 'B' ? this.renderReHeader() : null;
    };

    extraUniqueKey = (item, index) => {
        return index + item;
    };

    //**********************************ViewPart******************************************
    _render() {
        const {viewData} = this.state;
        //section header组件区分，key=A 不显示header组件 ，key=B 线上tab切换组件
        let sections = [
            {key: 'A', data: [{title: 'head'}]},
            {key: 'B', data: !EmptyUtils.isEmpty(viewData) ? viewData : [{title: 'empty'}]}
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

    /**
    * 页面顶部用户自返金信息
    */
    _accountInfoRender() {
        const {returnCashInfo}  = ReturnCashModel;

        return (
            <View style={styles.headerViewShadow}>
                <View style={styles.headerViewStyle}>
                    <View style={styles.withdrawWrapper}>
                        <Text style={styles.countTextStyle}>
                            累计自返
                        </Text>
                        {returnCashInfo.convertSwitchStatus === 2 ?
                            <NoMoreClick
                                onPress={() => {
                                    this.$navigate(RouterMap.HtmlPage, {uri: 'https://h5.sharegoodsmall.com/custom/ZDYZT201909251743341'});
                                }}>
                                <ImageBackground
                                    style={styles.beSubVipBgStyle}
                                    source={bg_black_img}>

                                    <Text
                                        style={{
                                            fontSize: DesignRule.fontSize_threeTitle,
                                            color: '#E9CD8D'
                                        }}>开启超级会员</Text>
                                    <ImageBackground
                                        style={styles.beSubVipTopStyle}
                                        source={bg_top_img}>
                                        <Text
                                            style={{
                                                fontSize: DesignRule.fontSize_20,
                                                color: '#333333'
                                            }}>自动转出余额</Text>
                                    </ImageBackground>
                                </ImageBackground>
                            </NoMoreClick> :
                            null
                        }
                        {returnCashInfo.convertSwitchStatus === 1 ?
                            <View style={styles.subVipBgStyle}>
                                <Text style={{color: '#FF0050', fontSize: 13}}>自动转到余额</Text>
                            </View> :
                            null
                        }

                    </View>
                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: 48,
                        marginLeft: DesignRule.margin_page,
                        height: 58,
                        lineHeight: 58
                    }}>{returnCashInfo.historySelfReturnAmount ? returnCashInfo.historySelfReturnAmount : '0.00'}</Text>
                    <View style={{display: 'flex', flex: 1, flexDirection: 'row', marginTop: 15}}>
                        <View style={{flex: 1, marginLeft: 15, justifyContent: 'center'}}>
                            <Text
                                style={styles.numTextStyle}>{returnCashInfo.preSettleSelfReturn ? returnCashInfo.preSettleSelfReturn : '0.00'}</Text>
                            <Text style={styles.numRemarkStyle}>待入账</Text>
                        </View>
                        <View style={{flex: 1, marginLeft: 15, justifyContent: 'center'}}>
                            <Text
                                style={styles.numTextStyle}>
                                {returnCashInfo.availableSelfReturnAmount ? returnCashInfo.availableSelfReturnAmount : '0.00'}
                                </Text>
                            <Text style={styles.numRemarkStyle}>可转金额</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    /**
     * 标题导航组件
     */
    renderHeader = () => {
        return (
            <LinearGradient start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
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
                                   style={{width: 30, height: 30}}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{
                        color: DesignRule.white,
                        fontSize: px2dp(17),
                        includeFontPadding: false
                    }}>
                        我的自返金
                    </Text>

                    <TouchableWithoutFeedback onPress={() => {this.$navigate(RouterMap.ReturnCashRulePage)}}>
                        <Text style={[styles.settingStyle, {flex: 1}]}>自返规则</Text>
                    </TouchableWithoutFeedback>

                </View>
            </LinearGradient>
        );
    };

    /**
     * tab切换组件
     */
    renderReHeader = () => {
        return (
            <View style={{flex: 1, backgroundColor: 'white', height: 40}}>
                <ScrollableTabView
                    onChangeTab={(obj) => {
                        //tab请求切换数据源
                        // fundsType:收入支出类型(1:收入 2:支出)
                        // flag:查询类型(1: 全部/收入/支出 2:待入账)

                        if (obj.i === 1) {
                            this.params = {fundsType: 1,  flag: 1};
                        } else if (obj.i === 2) {
                            this.params = {fundsType: 2,  flag: 1};
                        } else if (obj.i === 3) {
                            this.params = {fundsType: '', flag: 2};
                        } else {
                            this.params = {fundsType: '', flag: 1};  //

                        }
                        this.onRefresh();
                    }}
                    style={{flex: 1, width: ScreenUtils.width * 2 / 3, marginBottom: ScreenUtils.safeBottom}}
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

    /**
     * tab按钮
     */
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

    /**
     * 列表item组件，进行不同section 区分不同item
     */
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
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                    colors={['#FF0050', '#FC5D39']}
                    />
                    <View style={{height: 14, width: ScreenUtils.width, backgroundColor: 'white'}}/>
                    {this._accountInfoRender()}
                </View>
            );
        }

        if (item.title && item.title === 'empty') {
            return <EmptyView style={{flex: 1}} imageStyle={{width: 267, height: 192}} description={''}
                              subDescription={'暂无明细数据～'} source={cash_noData}/>;
        }

        let remark = item.remark ? item.remark : '其他';
        let icon = item.tradeType && newTypeIcons[item.tradeType] ? newTypeIcons[item.tradeType].icon : renwu;
        let time = DataUtils.getFormatDate(item.updateTime / 1000);
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
                <Image source={icon} style={{marginLeft: 15, width: 40, height: 40}}/>
                <View style={{
                    marginLeft: 17,
                    marginRight: 18,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row'
                }}>
                    <View style={{justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 14, color: DesignRule.textColor_secondTitle}}>{remark}</Text>
                        <Text style={{
                            fontSize: 12, color: DesignRule.textColor_instruction
                        }}>{time}</Text>
                    </View>
                    {item.status === 0 || (this.params && this.params.flag === 2) ?
                        <View style={{justifyContent: 'space-between', alignItems: 'flex-end'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontSize: 17,
                                    color: DesignRule.textColor_mainTitle
                                }}>{item.preSettleAmount ? item.preSettleAmount : 0}</Text>
                            </View>
                            <Text style={{
                                fontSize: 12, color: DesignRule.textColor_instruction
                            }}>{item.actSettleAmount === 0 || (!EmptyUtils.isEmpty(item.actSettleAmount) && item.actSettleAmount >= 0) ?
                                `已入账：${item.actSettleAmount}` : '入账等待'}</Text>
                        </View>
                        :
                        <View style={{justifyContent: 'space-between', alignItems: 'flex-end'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontSize: 17,
                                    color: DesignRule.textColor_mainTitle
                                }}>{StringUtils.formatMoneyString(item.balance, false)}</Text>
                                <Image style={{marginLeft: 5, width: 8, height: 5}}
                                       source={item.fundsType === 2 ? lv_down : item.fundsType === 1 ? red_up : ''}/>
                            </View>
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
                ReturnCashModel.getReturnCashInfo();
                this.onRefresh();
            }
        );

    }

    /**
     * 数据请求接口
     */
    getDataFromNetwork = () => {
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        MineApi.getReturnCashList({
            page: this.currentPage,
            pageSize: 20,
            ...this.params
        }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;
                if (data.data instanceof Array) {
                    data.data.map((item, index) => {
                        arrData.push(item);
                    });
                }
                this.setState({
                    refreshing: false,
                    viewData: arrData,
                    isEmpty: data.data && data.data.length > 0 ? false : true
                });
            } else {
                this.setState({refreshing: false});
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

    /**
     * 数据请求接口
     */
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
        this.setState({refreshing: this.currentPage === 1});
        this.getDataFromNetwork();
    };

    /**
     * 数据请求刷新
     */
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

    /**
     * 数据请求加载更多
     */
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
        marginTop: px2dp(10)
    },
    settingStyle: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_threeTitle,
        textAlign: 'right'
    },
    countTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle,
    },
    beSubVipTopStyle: {
        width: px2dp(74),
        height: px2dp(14),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: -4,
        top:  px2dp(-10),
    },
    beSubVipBgStyle: {
        width: px2dp(115),
        height: px2dp(28),
        justifyContent: 'center',
        alignItems: 'center',
    },
    subVipBgStyle: {
        width: px2dp(98),
        height: px2dp(32),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        top: -px2dp(10),
        backgroundColor: 'rgba(255, 0, 80, 0.1)',
        borderBottomLeftRadius: 15
    },
    numTextStyle: {
        color: '#333333',
        fontSize: 19
    },
    numRemarkStyle: {
        color: '#999999',
        fontSize: 12
    },
    headerViewShadow:{
        position: 'absolute',
        top: 10,
        left: DesignRule.margin_page,
        shadowColor: 'rgba(104, 0, 0, 0.1)',
        shadowOffset: {w: 0, h: 4},
        shadowOpacity: 1,
        shadowRadius: 8,
    },
    headerViewStyle:{
        backgroundColor: 'white',
        height: px2dp(174),
        width: ScreenUtils.width - 2 * DesignRule.margin_page,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 2,
    }
});


