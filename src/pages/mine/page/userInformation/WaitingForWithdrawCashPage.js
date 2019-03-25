import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList, UIImage, UIText } from '../../../../components/ui';
// import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge';
import CommModal from '../../../../comm/components/CommModal';
import { observer } from 'mobx-react/native';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';

const { px2dp } = ScreenUtils;
import NoMoreClick from '../../../../components/ui/NoMoreClick';

// const withdrawMoney = res.userInfoImg.xiangjzhanghu_icon03_14;
// const storeShare = res.userInfoImg.xiangjzhanghu_icon03;
// const storeShareBonus = res.userInfoImg.xiangjzhanghu_icon03_06;
// const shouyi = res.userInfoImg.xiangjzhanghu_icon03_10;
// const xiaofei = res.userInfoImg.xiangjzhanghu_icon03_12;
const salesCommissions = res.userInfoImg.xiangjzhanghu_icon03_08;
// const renwu = res.userInfoImg.xiangjzhanghu_icon03_16;
const account_bg = res.bankCard.account_bg;
const account_bg_white = res.bankCard.account_bg_white;
/** 先放在，不改*/
import topicShow from '../../../topic/res/topicShow.png';
import topicShowClose from '../../../topic/res/topicShowClose.png';

@observer
export default class WaitingForWithdrawCashPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [],
            isEmpty: false,
            waitingForWithdrawMoney: 0,
            currentPage: 1,
            blockedBalance: this.params.blockedBalance,
            modalVisible: false
        };
        this.currentPage = 0;
    }

    $navigationBarOptions = {
        show: false, // false则隐藏导航
        title: '待入账'
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
                {this._accountInfoRender()}
                {this.renderShowCommand()}
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
                        待入账（元）
                    </Text>
                    <NoMoreClick style={styles.withdrawButtonWrapper}
                                 onPress={() => this.show()}>
                        <Text style={{
                            fontSize: DesignRule.fontSize_threeTitle,
                            color: DesignRule.mainColor
                        }}>提现说明</Text>
                    </NoMoreClick>
                </View>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 48,
                    marginLeft: DesignRule.margin_page,
                    marginTop: px2dp(15),
                    marginBottom: px2dp(30)
                }}>{user.blockedBalance ? user.blockedBalance : `0.00`}</Text>
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
                        <Image source={res.button.white_back}/>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    };

    show = () => {
        this.modal && this.modal.open();
        this.setState({
            modalVisible: true
        });
    };
    _onPress = () => {
        this.setState({
            modalVisible: false
        });
    };
    close = () => {
        this.setState({
            modalVisible: false
        });
    };

    renderShowCommand() {
        return (
            <CommModal onRequestClose={this.close}
                       visible={this.state.modalVisible}
                       ref={(ref) => {
                           this.modal = ref;
                       }}
            >
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    width: ScreenUtils.width,
                    marginTop: 60
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        top: ScreenUtils.px2dp(105),
                        width: ScreenUtils.px2dp(290),
                        height: ScreenUtils.px2dp(360),
                        alignSelf: 'center',
                        position: 'absolute',
                        borderRadius: 5
                    }}>
                        <ImageBackground source={topicShow} style={{
                            width: ScreenUtils.px2dp(290),
                            height: ScreenUtils.px2dp(71),
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5
                        }}>
                            <Text style={{ color: 'white', fontSize: ScreenUtils.px2dp(18) }}
                                  allowFontScaling={false}>待提现账户说明</Text>
                        </ImageBackground>
                        <View style={{ marginLeft: ScreenUtils.px2dp(22), marginRight: ScreenUtils.px2dp(22) }}>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(25),
                                color: DesignRule.textColor_mainTitle,
                                fontSize: ScreenUtils.px2dp(15)
                            }} allowFontScaling={false}>什么是待提现账户？</Text>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(10),
                                color: DesignRule.textColor_secondTitle,
                                fontSize: ScreenUtils.px2dp(13)
                            }} allowFontScaling={false}>{`待提现账户为用户实时收益明细账户。`}</Text>
                        </View>
                        <View style={{ marginLeft: ScreenUtils.px2dp(22), marginRight: ScreenUtils.px2dp(22) }}>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(25),
                                color: DesignRule.textColor_mainTitle,
                                fontSize: ScreenUtils.px2dp(15)
                            }} allowFontScaling={false}>待提现账户金额是否可提现？</Text>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(10),
                                color: DesignRule.textColor_secondTitle,
                                fontSize: ScreenUtils.px2dp(13)
                            }} allowFontScaling={false}>{`不可提现，需等到订单无售后问题，转到现金账户之后才可提现。`}</Text>
                        </View>
                        <View style={{ marginLeft: ScreenUtils.px2dp(22), marginRight: ScreenUtils.px2dp(22) }}>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(25),
                                color: DesignRule.textColor_mainTitle,
                                fontSize: ScreenUtils.px2dp(15)
                            }} allowFontScaling={false}>对提现有疑问怎么办？</Text>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(10),
                                color: DesignRule.textColor_secondTitle,
                                fontSize: ScreenUtils.px2dp(13)
                            }} allowFontScaling={false}>{`提现过程中遇到问题，请在【我的】－【帮助与客服】中联系秀购官方客服。`}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{
                        top: 65,
                        right: 30,
                        position: 'absolute'
                    }} onPress={this._onPress}>
                        <Image style={{ width: 20, height: 20 }} source={topicShowClose}/>
                    </TouchableOpacity>
                </View>
            </CommModal>
        );
    }

    renderItem = ({ item, index }) => {
        return (
            <View>
                <View style={styles.Itemcontainer}>
                    <View style={{ height: 90, justifyContent: 'center' }}>
                        <UIImage source={item.iconImage}
                                 style={{ height: 50, width: 50, marginLeft: 16 }}/>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <UIText value={item.type}/>
                        <UIText value={item.time} style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
                        <UIText value={item.realBalance === null ? '待入账：?' : `已入账：` + item.realBalance}
                                style={{ color: DesignRule.textColor_secondTitle, fontSize: 12 }}/>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <View
                            style={{ marginRight: 15, height: 60, justifyContent: 'space-between' }}>
                            <UIText value={item.capital}
                                    style={{
                                        color: !item.capitalRed ? DesignRule.mainColor : DesignRule.textColor_mainTitle,
                                        fontSize: 16
                                    }}/>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <View style={{ height: 10, width: 7 }}/>
                            </View>
                            <UIText value={''}/>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: 'white' }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: DesignRule.lineColor_inColorBg,
                            marginLeft: 15
                        }}/>
                </View>
            </View>

        );
    };
    renderLine = () => {
        return (
            <View style={{
                height: 1,
                backgroundColor: DesignRule.lineColor_inColorBg,
                marginLeft: 48,
                marginRight: 48
            }}/>
        );
    };

    //**********************************BusinessPart******************************************
    componentDidMount() {
        this.onRefresh();
    }

    jumpToWithdrawCashPage = () => {
        this.$navigate('mine/userInformation/TokenExchangePage');
    };
    clickItem = (index) => {
        // alert(index);
    };
    getDataFromNetwork = () => {
        // let use_type = ['', '用户收益', '提现支出', '消费支出', '服务顾问管理费', '品牌分红奖励', '品牌推广奖励', '现金红包', '任务奖励'];
        let use_type_symbol = ['', '+', '-'];
        // let useLeftImg = ['', shouyi, withdrawMoney, xiaofei, storeShare, storeShareBonus, salesCommissions, salesCommissions, renwu];
        if (this.currentPage > 1) {
            Toast.showLoading();
        }
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        MineApi.userBalanceQuery({ page: this.currentPage, size: 20, type: 2 }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;
                if (data.data instanceof Array) {
                    data.data.map((item, index) => {
                        arrData.push({
                            type: '品牌推广奖励金',
                            time: DataUtils.getFormatDate(item.createTime / 1000),
                            capital: use_type_symbol[item.biType] + item.balance,
                            iconImage: salesCommissions,
                            realBalance: item.realBalance
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
        flex: 1, backgroundColor: DesignRule.bgColor
    },
    container: {
        height: px2dp(188),
        width: ScreenUtils.width
    }, imageBackgroundStyle: {
        position: 'absolute',
        height: 95,
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15,
        backgroundColor: DesignRule.bgColor_blueCard
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
        height: 95,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15
    }, Itemcontainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 90,
        alignItems: 'center'
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

