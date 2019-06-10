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
import { RefreshList, UIText } from '../../../../components/ui';
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

const salesCommissions = res.cashAccount.shouru_icon;
const account_bg = res.bankCard.account_bg;
const account_bg_white = res.bankCard.account_bg_white;
/** 先放在，不改*/
import topicShowClose from '../../../topic/res/topicShowClose.png';
import StringUtils from '../../../../utils/StringUtils';

@observer
export default class WaitingForWithdrawCashPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            isEmpty: false,
            currentPage: 1,
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
                {this.state.viewData && this.state.viewData.length > 0 ? null : this.renderReHeader()}
                <RefreshList
                    data={this.state.viewData}
                    ListHeaderComponent={this.renderReHeader}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无明细数据～'}
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
                }}>{user.blockedBalance ? user.blockedBalance : '0.00'}</Text>
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
                        <View style={{
                            width: 60,
                            paddingLeft: DesignRule.margin_page,
                            height: 40,
                            justifyContent: 'center'
                        }}>
                            <Image source={res.button.white_back}/>
                        </View>
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
                    marginTop: 105
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        width: ScreenUtils.px2dp(290),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5
                    }}>

                        <Image source={res.cashAccount.title_card}
                               style={{ width: 55, height: 55, marginTop: 15, marginBottom: 15 }}/>
                        <Text style={{ color: '#000000', fontSize: ScreenUtils.px2dp(14) }}
                              allowFontScaling={false}>待提现账户说明</Text>

                        <ImageBackground style={{
                            marginTop: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: ScreenUtils.px2dp(160),
                            height: 45
                        }}
                                         source={res.cashAccount.shuoming_icon} resizeMode={'contain'}>
                            <Text style={{ color: DesignRule.textColor_instruction, fontSize: ScreenUtils.px2dp(11) }}>
                                要认真看哦
                            </Text>
                        </ImageBackground>
                        <View style={{ marginLeft: ScreenUtils.px2dp(22), marginRight: ScreenUtils.px2dp(22) }}>
                            <Text style={{
                                color: DesignRule.textColor_mainTitle,
                                fontSize: ScreenUtils.px2dp(15)
                            }} allowFontScaling={false}>什么是待提现说明</Text>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(10),
                                color: DesignRule.textColor_secondTitle,
                                fontSize: ScreenUtils.px2dp(13)
                            }} allowFontScaling={false}>{'待提现账户为用户推广预期的奖励明细，可通过查看待提现账户查询收益情况。'}</Text>
                        </View>
                        <View style={{
                            marginLeft: ScreenUtils.px2dp(22),
                            marginRight: ScreenUtils.px2dp(22),
                            marginBottom: 20
                        }}>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(25),
                                color: DesignRule.textColor_mainTitle,
                                fontSize: ScreenUtils.px2dp(15)
                            }} allowFontScaling={false}>为何不能马上提现</Text>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(10),
                                color: DesignRule.textColor_secondTitle,
                                fontSize: ScreenUtils.px2dp(13)
                            }}
                                  allowFontScaling={false}>{'你的推广成功后会获得平台的预计收益，而预计收益会因最后推广结果被调整，最终推广成功后，待提现账户金额会自动提现至您的余额账户。'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{
                        marginTop: 15
                    }} onPress={this._onPress}>
                        <Image style={{ width: 40, height: 40 }} source={topicShowClose}/>
                    </TouchableOpacity>
                </View>

            </CommModal>
        );
    }

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
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14, color: DesignRule.textColor_secondTitle }}>{item.type}</Text>
                        <Text style={{
                            fontSize: 12, color: DesignRule.textColor_instruction
                        }}>{item.time}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Text style={{
                            fontSize: 17,
                            color: DesignRule.textColor_mainTitle
                        }}>{StringUtils.formatMoneyString(item.capital, false)}</Text>
                        <UIText value={item.realBalance === null ? '待入账：?' : '已入账：' + item.realBalance}
                                style={{ color: DesignRule.textColor_secondTitle, fontSize: 12 }}/>
                    </View>
                </View>
            </View>
        );
    };

    //**********************************BusinessPart******************************************
    componentDidMount() {
        this.onRefresh();
    }

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

