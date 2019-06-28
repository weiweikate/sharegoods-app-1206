import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableWithoutFeedback,
    Image,
    SectionList,
    RefreshControl
} from 'react-native';
import { PageLoadingState, renderViewByLoadingState } from '../../../../components/pageDecorator/PageState';
import MineApi from '../../api/MineApi';
// 图片资源
import EmptyView from '../../../../components/pageDecorator/BaseView/EmptyView';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
// import AccountItem from '../../components/AccountItem';
import res from '../../res';
import user from '../../../../model/user';
import StringUtils from '../../../../utils/StringUtils';
import LinearGradient from 'react-native-linear-gradient'
import EmptyUtils from "../../../../utils/EmptyUtils";

const account_bg_white = res.bankCard.account_bg_white;
const red_up = res.cashAccount.zhanghu_red;
const lv_down = res.cashAccount.zhanghu_lv;
const { px2dp } = ScreenUtils;
const cash_noData = res.cashAccount.cash_noData;

// const headerBgSize = { width: ScreenUtils.width, height: 188 };

const detailData = {
    1: { title: '邀请注册奖励', icon: res.cashAccount.fenxiang_icon },
    2: { title: '邀请注册奖励', icon: res.cashAccount.fenxiang_icon },
    3: { title: '交易奖励', icon: res.cashAccount.zengsong_icon },
    4: { title: '交易奖励', icon: res.cashAccount.zengsong_icon },
    5: { title: '交易奖励', icon: res.cashAccount.zengsong_icon },
    6: { title: '交易奖励', icon: res.cashAccount.zengsong_icon },
    7: { title: '交易奖励', icon: res.cashAccount.zengsong_icon },
    8: { title: '交易奖励', icon: res.cashAccount.zengsong_icon },
    9: { title: '签到奖励', icon: res.cashAccount.qiandao_icon },
    10: { title: '分享奖励', icon: res.cashAccount.fenxiang_icon },
    11: { title: '分享奖励', icon: res.cashAccount.fenxiang_icon },
    12: { title: '会员奖励', icon: res.cashAccount.renwu_icon },
    13: { title: '交易奖励', icon: res.cashAccount.zengsong_icon },
    14: { title: '交易奖励', icon: res.cashAccount.zengsong_icon },
    15: { title: '其他', icon: res.cashAccount.other_icon },
    16: { title: '其他', icon: res.cashAccount.other_icon },
    17: { title: '秀购奖励', icon: res.cashAccount.zengsong_icon },
    18: { title: '秀购惩罚', icon: res.cashAccount.chengFa_icon },
    19: { title: '抽奖奖励', icon: res.cashAccount.zengsong_icon },
    20: { title: '秀购奖励', icon: res.cashAccount.zengsong_icon },
    30: { title: '30天未登录扣除', icon: res.cashAccount.jinggao_icon },
    31: { title: '周交易额未达标扣除', icon: res.cashAccount.jinggao_icon },
    32: { title: '邀请有礼奖励', icon: res.myData.icon_invite }
};
export default class ExpDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            id: user.code,
            viewData: [],
            experience: this.params.experience || 0,
            levelExperience: this.params.levelExperience || 0,
            isEmpty: false,
            loadingState: PageLoadingState.loading,
            changeHeader: false,
            refreshing: false,


        };
        this.currentPage = 0;
        this.st = 0;

    }

    $navigationBarOptions = {
        show: false, // false则隐藏导航
        title: 'Exp明细'
    };
    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this.getDataFromNetwork
            }
        };
    };

    componentDidMount() {
        this.onLoad();
    }


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

    _render() {
        return (
            <View style={styles.container}>
                {renderViewByLoadingState(this.$getPageStateOptions(), this._renderContent)}
            </View>
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
                            width: 60,
                            paddingLeft: DesignRule.margin_page,
                            height: 40,
                            justifyContent: 'center',
                            alignItems:'flex-start',
                            flex:1
                        }}>
                            <Image source={res.button.white_back}/>
                        </View>
                    </TouchableWithoutFeedback>
                        <Text style={{
                            color: DesignRule.white,
                            fontSize: px2dp(17),
                            includeFontPadding: false
                        }}>
                            {this.state.changeHeader ? '我的经验' : ''}
                        </Text>
                    <View style={{flex:1}}/>
                </View>
            </LinearGradient>
        );
    };

    _accountInfoRender() {
        const progress = this.state.experience / this.state.levelExperience;
        const marginLeft = progress ? ScreenUtils.px2dp(315) * progress : 0;
        return (
            <ImageBackground source={account_bg_white} resizeMode={'stretch'} style={{
                position: 'absolute',
                top: 0,
                height: px2dp(184),
                width: DesignRule.width,
                left: 0,
                paddingHorizontal: DesignRule.margin_page,
            }}>

                <View style={styles.withdrawWrapper}>
                    <Text style={styles.countTextStyle}>
                        经验值（Exp）
                    </Text>
                </View>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 48,
                    marginLeft: DesignRule.margin_page,
                    marginTop: px2dp(5)
                }}>
                    {this.state.experience || 0}
                    <Text style={{
                        color: DesignRule.textColor_secondTitle,
                        fontSize: 25
                    }}>
                        /
                    </Text>
                    <Text style={{
                        color: DesignRule.textColor_secondTitle,
                        fontSize: 16
                    }}>
                        {this.state.levelExperience}
                    </Text>
                </Text>
                <View style={{
                    overflow: 'hidden',
                    marginTop: px2dp(10),
                    height: px2dp(8),
                    width: ScreenUtils.px2dp(315),
                    alignSelf: 'center',
                    backgroundColor: 'rgba(104,0,0,0.1)',
                    borderRadius: px2dp(4)
                }}>
                    <Image source={res.myData.jdt_05} style={{
                        width: marginLeft,
                        height: px2dp(8),
                        borderRadius: px2dp(4)
                    }} resizeMode={'stretch'}/>
                </View>

                <Text style={{
                    marginTop: px2dp(10),
                    color: DesignRule.textColor_instruction,
                    fontSize: 12,
                    marginLeft: DesignRule.margin_page
                }} allowFontScaling={false}>距离晋升还差
                    <Text style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: 13
                    }}>
                        {(parseFloat(this.state.levelExperience) - parseFloat(this.state.experience)) > 0 ? `${StringUtils.formatDecimal(this.state.levelExperience - this.state.experience)}Exp` : '0Exp'}
                    </Text>
                    {(this.state.levelExperience - this.state.experience) > 0 ? null :
                        <Text style={{ color: DesignRule.mainColor, fontSize: 11 }}
                              allowFontScaling={false}>(Exp已满)</Text>
                    }
                </Text>
            </ImageBackground>
        );
    }

    sectionComp = (info) => {
        return null
    };

    extraUniqueKey=(item,index)=>{
        return index + item;
    };


    _renderContent = () => {
        const {viewData} = this.state;
        let sections = [
            { key: 'A', data: [{title:'head'}] },
            { key: 'B', data:  !EmptyUtils.isEmpty(viewData) ? viewData : [{title:'empty'}] },
        ];

        return (
            <View style={styles.contentStyle}>
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
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                width: ScreenUtils.width,
                marginBottom: 10,
                marginTop:10
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 17,
                            color: DesignRule.textColor_mainTitle
                        }}>{StringUtils.formatMoneyString(item.capital, false)}</Text>
                        <Image style={{ marginLeft: 5, width: 8, height: 5 }}
                               source={item.capitalRed ? red_up : lv_down}/>
                    </View>
                </View>
            </View>
        );
    };

    getDataFromNetwork = () => {
        console.log('getDataFromNetwork', this.params.experience);
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        MineApi.expDetail({
            page: this.currentPage,
            size: 10
        }).then((response) => {
            console.log(response);
            let data = response.data;
            data.data.map((item, index) => {
                arrData.push({
                    type: detailData[item.sourceCode] ? detailData[item.sourceCode].title : '其他',
                    time: item.createTime,
                    capital: `${parseInt(item.sourceType) === 1 ? '+' : '-'}${item.experience}`,
                    iconImage: detailData[item.sourceCode] ? detailData[item.sourceCode].icon : res.cashAccount.other_icon,
                    capitalRed: parseInt(item.sourceType) === 1

                });
            });
            this.setState({
                refreshing: false,
                loadingState: PageLoadingState.success,
                viewData: arrData,
                isEmpty: data.data && data.data.length !== 0 ? false : true
            });
        }).catch(e => {
            this.setState({refreshing: false, loadingState: PageLoadingState.fail, netFailedInfo: e, viewData: arrData, isEmpty: true });

        });
    };
    onLoad = ()=>{
        this.currentPage = 1;
        this.setState({ refreshing: this.currentPage === 1 });
        this.getDataFromNetwork();
    }

    onRefresh = () => {
        this.currentPage = 1;
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
    container: {
        flex: 1,
        marginBottom: ScreenUtils.safeBottom
    },
    contentStyle: {
        backgroundColor: DesignRule.bgColor,
        flex: 1
    },
    headerBg: {
        height: 95,
        backgroundColor: '#FFFFFF',
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15
    },
    headerContainer: {
        height: px2dp(188),
        width: ScreenUtils.width,
        marginBottom:20,
    },
    withdrawButtonWrapper: {
        height: px2dp(28),
        borderRadius: px2dp(14),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.white,
        borderColor: DesignRule.mainColor,
        borderWidth: 1,
        paddingHorizontal: px2dp(7)
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
        height: 44
    }

});
