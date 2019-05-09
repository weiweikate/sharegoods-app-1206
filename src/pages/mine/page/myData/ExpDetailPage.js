import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import { PageLoadingState, renderViewByLoadingState } from '../../../../components/pageDecorator/PageState';
import MineApi from '../../api/MineApi';
// 图片资源
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
// import AccountItem from '../../components/AccountItem';
import res from '../../res';
import user from '../../../../model/user';
import StringUtils from '../../../../utils/StringUtils';

const account_bg = res.bankCard.account_bg;
const account_bg_white = res.bankCard.account_bg_white;
const red_up = res.cashAccount.zhanghu_red;
const lv_down = res.cashAccount.zhanghu_lv;
const { px2dp } = ScreenUtils;

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
    32: { title: '邀请有礼奖励', icon: res.myData.icon_invite },
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
            loadingState: PageLoadingState.loading
        };
        this.currentPage = 0;
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
        this.getDataFromNetwork();
    }

    _render() {
        return (
            <View style={styles.container}>
                {renderViewByLoadingState(this.$getPageStateOptions(), this._renderContent)}
            </View>
        );
    }

    renderHeader = () => {
        return (
            <ImageBackground resizeMode={'stretch'} source={account_bg} style={styles.headerContainer}>
                <View style={styles.headerWrapper}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={res.button.white_back}/>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    };

    _accountInfoRender() {
        const progress = this.state.experience / this.state.levelExperience;
        const marginLeft = ScreenUtils.px2dp(315) * progress;
        return (
            <ImageBackground source={account_bg_white} resizeMode={'stretch'} style={{
                position: 'absolute',
                top: px2dp(80),
                height: px2dp(205),
                width: DesignRule.width,
                left: 0,
                paddingHorizontal: DesignRule.margin_page
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
                    marginTop: px2dp(15)
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
                    marginTop: px2dp(26),
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

    _renderContent = () => {
        return (
            <View style={styles.contentStyle}>
                {this.renderHeader()}
                <RefreshList
                    data={this.state.viewData}
                    ListHeaderComponent={this.renderReHeader}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据'}
                />
                {this._accountInfoRender()}
            </View>
        );
    };
    renderReHeader = () => {
        if (this.state.viewData && this.state.viewData.length > 0) {
            return (
                <View style={{
                    marginLeft: 15,
                    marginTop: 115,
                    marginBottom: 20,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: DesignRule.mainColor,
                        width: 2,
                        height: 8,
                        borderRadius: 1,
                        marginRight: 5
                    }}/>
                    <Text style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}>经验明细</Text>
                </View>
            );
        } else {
            return null;
        }

    };
    renderItem = ({ item, index }) => {
        return (
            <View style={{
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
                width: ScreenUtils.width,
                marginBottom: 20
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
                    type: detailData[item.sourceCode] && detailData[item.sourceCode].title,
                    time: item.createTime,
                    capital: `${parseInt(item.sourceType) === 1 ? '+' : '-'}${item.experience}`,
                    iconImage: detailData[item.sourceCode].icon,
                    capitalRed: parseInt(item.sourceType) === 1

                });
            });
            this.setState({
                loadingState: PageLoadingState.success,
                viewData: arrData,
                isEmpty: data.data && data.data.length !== 0 ? false : true
            });
        }).catch(e => {
            alert(e.message);
            this.setState({ loadingState: PageLoadingState.fail, netFailedInfo: e, viewData: arrData, isEmpty: true });

        });
    };
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
        paddingHorizontal: DesignRule.margin_page,
        marginTop: ScreenUtils.statusBarHeight,
        height: 44
    }

});
