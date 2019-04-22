import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    ImageBackground,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
// import AccountItem from '../../components/AccountItem';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge' ;
import { observer } from 'mobx-react/native';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import StringUtils from '../../../../utils/StringUtils';

const { px2dp } = ScreenUtils;

const singInImg = res.cashAccount.qiandao_icon;
const taskImg = res.cashAccount.renwu_icon;
const yiyuanImg = res.cashAccount.quan_icon;
const zensong = res.cashAccount.zengsong_icon;
const xiugou_reword = res.cashAccount.renwuShuoMing_icon;
const account_bg = res.bankCard.account_bg;
const account_bg_white = res.bankCard.account_bg_white;
const red_up = res.cashAccount.zhanghu_red;
const lv_down = res.cashAccount.zhanghu_lv;
@observer
export default class MyIntegralAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            currentPage: 1,
            isEmpty: false
        };
        this.currentPage = 1;
    }

    $navigationBarOptions = {
        title: '我的秀豆',
        show: false // false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                {this.state.viewData && this.state.viewData.length > 0 ? null : this.renderReHeader()}
                <RefreshList
                    ListHeaderComponent={this.renderReHeader}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    progressViewOffset={30}
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
                        秀豆账户（枚）
                    </Text>
                    <NoMoreClick style={styles.withdrawButtonWrapper}
                                 onPress={() => this.$navigate('home/signIn/SignInPage')}>
                        <Text style={{
                            fontSize: DesignRule.fontSize_threeTitle,
                            color: DesignRule.mainColor
                        }}>兑换1元现金劵</Text>
                    </NoMoreClick>
                </View>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 48,
                    marginLeft: DesignRule.margin_page,
                    marginTop: px2dp(15),
                    marginBottom: px2dp(30)
                }}>{user.userScore ? user.userScore : 0}</Text>
            </ImageBackground>
        );
    }

    renderHeader = () => {
        return (
            <ImageBackground resizeMode={'stretch'} source={account_bg} style={styles.container}>
                <View style={styles.headerWrapper}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <View style={{ width: 60 }}>
                            <Image source={res.button.white_back}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    };

    renderItem = ({ item, index }) => {
        return (
            <View style={{
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                width: ScreenUtils.width,
                paddingBottom: 20,
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
    renderReHeader = () => {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    paddingLeft: 15,
                    paddingTop: 52,
                    paddingBottom: 20,
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
                <Text style={{ fontSize: 13, color: DesignRule.textColor_mainTitle }}>账户明细</Text>
            </View>
        );
    };

    //**********************************BusinessPart******************************************
    componentDidMount() {
        this.onRefresh();
    }

    getDataFromNetwork = () => {
        let use_type = ['', '注册赠送', '活动赠送', '其他', '兑换1元现金券', '签到奖励', '任务奖励', '秀购奖励', '抽奖奖励', '秀购奖励'];

        let use_type_symbol = ['', '+', '-'];
        let use_let_img = ['', singInImg, taskImg, taskImg, yiyuanImg, singInImg, taskImg, zensong, xiugou_reword, zensong];
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        if (this.currentPage > 1) {
            Toast.showLoading();
        }
        MineApi.userScoreQuery({
            page: this.currentPage,
            size: 10

        }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;
                data.data.map((item, index) => {
                    arrData.push({
                        type: use_type[item.useType],
                        time: DataUtils.getFormatDate(item.createTime / 1000),
                        serialNumber: item.serialNo || '',
                        capital: use_type_symbol[item.usType] + (item.userScore ? item.userScore : 0),
                        iconImage: use_let_img[item.useType],
                        capitalRed: use_type_symbol[item.usType] === '+'


                    });
                });
                this.setState({ viewData: arrData, isEmpty: data.data && data.data.length !== 0 ? false : true });
            } else {
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
            this.setState({ viewData: arrData, isEmpty: true });

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


