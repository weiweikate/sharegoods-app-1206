import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    ImageBackground,
    TouchableWithoutFeedback,
    Image,
    SectionList,
    RefreshControl
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge' ;
import { observer } from 'mobx-react';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import RouterMap from '../../../../navigation/RouterMap';
import EmptyView from '../../../../components/pageDecorator/BaseView/EmptyView';
import EmptyUtils from '../../../../utils/EmptyUtils';
import LinearGradient from 'react-native-linear-gradient'

const { px2dp } = ScreenUtils;

const singInImg = res.cashAccount.qiandao_icon;
const fenxiang_icon = res.cashAccount.fenxiang_icon;
const tuiguang_icon = res.cashAccount.tuiguang_icon;
const zengsong_icon = res.cashAccount.zengsong_icon;
const taskImg = res.cashAccount.renwu_icon;
const yiyuanImg = res.cashAccount.quan_icon;
const zensong = res.cashAccount.zengsong_icon;
const xiugou_reword = res.cashAccount.renwuShuoMing_icon;
const account_bg_white = res.bankCard.account_bg_white;
const red_up = res.cashAccount.zhanghu_red;
const lv_down = res.cashAccount.zhanghu_lv;
const icon_invite = res.myData.icon_invite;
const cash_noData = res.cashAccount.cash_noData;

const allKinds = {
    1: { title: '注册赠送', img: singInImg },
    2: { title: '活动赠送', img: taskImg },
    3: { title: '其他', img: taskImg },
    4: { title: '兑换1元现金券', img: yiyuanImg },
    5: { title: '签到奖励', img: singInImg },
    6: { title: '任务奖励', img: taskImg },
    7: { title: '秀购奖励', img: zensong },
    8: { title: '抽奖奖励', img: xiugou_reword },
    9: { title: '秀购奖励', img: zensong },
    10: { title: '邀请有礼奖励', img: icon_invite },
    11: { title: '分享奖励', img: fenxiang_icon },
    12: { title: '参与活动', img: tuiguang_icon },
    13: { title: '活动奖励', img: zengsong_icon }
};


@observer
export default class MyIntegralAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            currentPage: 1,
            isEmpty: false,
            changeHeader: false,
            refreshing: false,

        };
        this.currentPage = 1;
        this.type = null;
        this.biType = null;
        this.st = 0;
    }

    $navigationBarOptions = {
        title: '我的秀豆',
        show: false // false则隐藏导航
    };

    sectionComp = (info) => {
        let txt = info.section.key;
        return txt === 'B' ? this.renderReHeader() : null
    };

    extraUniqueKey=(item,index)=>{
        return index + item;
    };

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y <= 175) {
            this.st = 0;
            if(this.state.changeHeader) {
                this.setState({
                    changeHeader: false
                });
            }
        } else {
            this.st = 1;
            if(!this.state.changeHeader) {
                this.setState({
                    changeHeader: true
                });
            }
        }
    };

    //**********************************ViewPart******************************************
    _render() {
        const {viewData} = this.state;
        let sections = [
            { key: 'A', data: [{title:'head'}] },
            { key: 'B', data:  !EmptyUtils.isEmpty(viewData) ? viewData : [{title:'empty'}] },
        ];

        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <SectionList
                    renderSectionHeader={this.sectionComp}
                    renderItem={this.renderItem}
                    sections={sections}
                    keyExtractor = {this.extraUniqueKey}// 生成一个不重复的key
                    ItemSeparatorComponent={() => <View/>}
                    onEndReached={this.onLoadMore}
                    onEndReachedThreshold={0.1}
                    stickySectionHeadersEnabled={true}
                    onScroll={(e)=>{this._onScroll(e)}}
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
                paddingHorizontal: DesignRule.margin_page,
            }}>

                <View style={styles.withdrawWrapper}>
                    <Text style={styles.countTextStyle}>
                        秀豆账户（枚）
                    </Text>
                    <NoMoreClick style={styles.withdrawButtonWrapper}
                                 onPress={() => {
                                     if (!user.isLogin) {
                                         this.gotoLoginPage();
                                         return;
                                     }
                                     this.$navigate(RouterMap.SignInPage);
                                 }}>
                        <Text style={{
                            fontSize: DesignRule.fontSize_threeTitle,
                            color: DesignRule.mainColor,
                            paddingHorizontal: 10
                        }}>兑换1元现金劵</Text>
                    </NoMoreClick>
                </View>

                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 48,
                    marginLeft: DesignRule.margin_page,
                    height: 58,
                    lineHeight: 58
                }}>{user.userScore ? user.userScore : 0}</Text>

                <View style={{display:'flex', flexDirection:'row',marginTop: 15}} >
                    <View style={{flex:1,marginLeft: 15, justifyContent:'center'}}>
                        <Text style={styles.numTextStyle}>{user.blockedUserScore ? user.blockedUserScore : '0.00'}</Text>
                        <Text style={styles.numRemarkStyle}>待入账秀豆（枚）</Text>
                    </View>
                    <View style={{flex:1,marginLeft: 15, justifyContent:'center'}}>
                        <Text style={styles.numTextStyle}>{user.historicalScore ? user.historicalScore : '0.00'}</Text>
                        <Text style={styles.numRemarkStyle}>累计秀豆（枚）</Text>
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
                            width: 40,
                            paddingLeft: DesignRule.margin_page,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex:1
                        }}>
                            <Image source={res.button.back_white}  style={{width: 30, height: 30}}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={{
                        color: DesignRule.white,
                        fontSize: px2dp(17),
                        includeFontPadding: false
                    }}>
                        {this.state.changeHeader ? '秀豆' : ''}
                    </Text>
                    <View style={{flex:1}}/>
                </View>
            </LinearGradient>
        );
    };

    renderItem = (info) => {
        let item = info.item;
        let key = info.section.key;
        if (key === 'A') {
            return (
                <View>
                    <LinearGradient style={{marginBottom: 10, height: px2dp(164), width: ScreenUtils.width, backgroundColor: 'white'}}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                    colors={['#FF0050', '#FC5D39']}
                    />
                    <View style={{height:10, width:ScreenUtils.width, backgroundColor:'white'}}/>
                    {this._accountInfoRender()}
                </View>
            )
        }
        if(item.title && item.title === 'empty'){
            return(
                <EmptyView style={{flex:1}} imageStyle={{width:267, height:192}} description={''} subDescription={'暂无明细数据～'} source={cash_noData}/>
            )}

        return (
            <View style={{
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                width: ScreenUtils.width,
                paddingBottom: 10,
                paddingTop: 10,
                backgroundColor: 'white'
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
                    {item.status === 2 || (this.type === 2 && this.biType === 1) ?
                        <View style={{justifyContent: 'space-between', alignItems: 'flex-end'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontSize: 17,
                                    color: DesignRule.textColor_mainTitle
                                }}>{item.capital ? item.capital : 0}</Text>

                            </View>
                            <Text style={{
                                fontSize: 12, color: DesignRule.textColor_instruction
                            }}>{item.realUserScore == 0 || (  item.realUserScore && item.realUserScore >= 0) ? `已入账：${item.realUserScore}` : '待入账：？'}</Text>
                        </View>
                        :
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{
                                fontSize: 17,
                                color: DesignRule.textColor_mainTitle
                            }}>{item.capital ? item.capital : 0}</Text>
                            <Image style={{marginLeft: 5, width: 8, height: 5}}
                                   source={item.capitalRed ? red_up : lv_down}/>
                        </View>}
                </View>
            </View>
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
                        this.onRefresh()
                    }}
                    style={{flex: 1, width: ScreenUtils.width * 2 / 3, marginBottom: ScreenUtils.safeBottom}}
                    scrollWithoutAnimation={true}
                    renderTabBar={this._renderTabBar}
                    //进界面的时候打算进第几个
                    initialPage={0}
                >
                    <View tabLabel={'全部'} style={{width:1,height:1}}/>
                    <View tabLabel={'收入'} style={{width:1,height:1}}/>
                    <View tabLabel={'支出'} style={{width:1,height:1}}/>
                    <View tabLabel={'待入账'} style={{width:1,height:1}}/>
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
        )
    };
    //**********************************BusinessPart******************************************
    componentDidMount() {
        this.onRefresh();
    }

    getDataFromNetwork = () => {
        let use_type_symbol = ['', '+', '-'];
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        MineApi.userScoreQuery({
            page: this.currentPage,
            size: 10,
            usType: this.biType,
            status: this.type

        }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;
                data.data.map((item, index) => {
                    arrData.push({
                        type: allKinds[item.useType] ? allKinds[item.useType].title : '其他',
                        time: DataUtils.getFormatDate(item.createTime / 1000),
                        serialNumber: item.serialNo || '',
                        capital: use_type_symbol[item.usType] + (item.userScore ? item.userScore : 0),
                        iconImage: allKinds[item.useType] ? allKinds[item.useType].img : taskImg,
                        capitalRed: use_type_symbol[item.usType] === '+',
                        realUserScore: item.realUserScore,
                        status: item.status
                    });
                });
                this.setState({refreshing: false, viewData: arrData, isEmpty: data.data && data.data.length !== 0 ? false : true });
            } else {
                this.setState({ refreshing: false});
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
            this.setState({ refreshing: false, viewData: arrData, isEmpty: true });

        });
    };

    onLoad = ()=>{
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
        this.currentPage = 1;
        this.setState({ refreshing: this.currentPage === 1 });
        this.getDataFromNetwork();
    }

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
        backgroundColor: DesignRule.white
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
    container: {
        height: px2dp(188),
        width: ScreenUtils.width
    },
    withdrawButtonWrapper: {
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
    withdrawWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: DesignRule.margin_page,
        marginTop: px2dp(22)
    },
    countTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: DesignRule.margin_page,
        marginTop: ScreenUtils.statusBarHeight,
        height: 44,
        width: ScreenUtils.width
    },
    numTextStyle:{
        color:'#333333',
        fontSize:19,
    },
    numRemarkStyle:{
        color:'#999999',
        fontSize:12,
    }
});


