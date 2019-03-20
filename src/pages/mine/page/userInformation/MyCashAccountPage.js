import React from 'react';
import {
    StyleSheet,
    View,
    // ImageBackground,
    // TouchableOpacity,
    Alert,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
// import AccountItem from '../../components/CashAccountItem';
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
// import NoMoreClick from '../../../../components/ui/NoMoreClick';

    const renwu=res.cashAccount.renwu;
    const daoshi=res.cashAccount.daoshi;
    const  fenhong =res.cashAccount.fenhong;
    const hongbao =res.cashAccount.hongbao;
    const tuiguang= res.cashAccount.tuiguang;
    const tixiang = res.cashAccount.tixiang;
    const tixiantk= res.cashAccount.tixiantk;
    const xiaofei= res.cashAccount.xiaofei;
    const xiaofeitk= res.cashAccount.xiaofeitk;

@observer
export default class MyCashAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.getUserBankInfoing = false;
        this.state = {
            id: user.code,
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [],
            restMoney: this.params.availableBalance,

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
                <View style={{borderTopLeftRadius:15,borderTopRightRadius:15,marginTop:-15,flex:1,backgroundColor:'white'}}>
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
                </View>
            </View>
        );
    }


    renderHeader = () => {
        return (
            <View style={styles.container}>
                <View style={styles.headerWrapper}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={res.button.white_back}/>
                    </TouchableWithoutFeedback>
                    {/*<TouchableWithoutFeedback onPress={() => {*/}
                        {/*this.$navigate('mine/bankCard/BankCardListPage');*/}
                    {/*}}>*/}
                        {/*<Text style={styles.settingStyle}>账户设置</Text>*/}
                    {/*</TouchableWithoutFeedback>*/}
                </View>
                <View style={styles.withdrawWrapper}>
                    <Text style={styles.countTextStyle}>
                        账户余额（元）
                    </Text>
                    {/*<NoMoreClick style={styles.withdrawButtonWrapper} onPress={() => this.jumpToWithdrawCashPage()}>*/}
                        {/*<Text style={{ fontSize: 13, color: DesignRule.textColor_secondTitle }}>提现</Text>*/}
                    {/*</NoMoreClick>*/}
                </View>
                <Text style={{color:DesignRule.white,fontSize:48,marginLeft:DesignRule.margin_page,marginTop:15,marginBottom:30}}>{user.availableBalance ? user.availableBalance : `0.00`}</Text>
            </View>
        );
    };

    renderReHeader=()=>{
        if(this.state.viewData&&this.state.viewData.length>0){
            return(
                <View style={{marginLeft:18,marginTop:17,marginBottom:24}}>
                    <Text style={{fontSize:13,color:DesignRule.textColor_mainTitle}}>账户明细</Text>
                </View>
            )
        }else{
            return null;
        }

    }
    renderItem = ({ item, index }) => {
        return (
            <View style={{height:47,flexDirection:'row',alignItems:'center',width:ScreenUtils.width,marginBottom:12}}>
              <Image source={item.iconImage} style={{marginLeft:15,width:30,height:28}} />
                <View style={{justifyContent:'center',marginLeft:17,marginRight:18,flex:1}}>
                   <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                       <Text style={{fontSize:13,color:DesignRule.textColor_secondTitle}}>{item.type}</Text>
                       <Text style={{fontSize:13,color:DesignRule.textColor_instruction}}>{item.time}</Text>
                   </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontSize:17,color:DesignRule.textColor_mainTitle}}>{StringUtils.formatMoneyString(item.capital, false)}</Text>
                        <Text style={{fontSize:12,color:DesignRule.textColor_instruction}}>{item.serialNumber}</Text>
                    </View>
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
        if (this.getUserBankInfoing) {
            return;
        }
        this.getUserBankInfoing = true;

        MineApi.getUserBankInfo().then((data) => {
            this.getUserBankInfoing = false;
            if (data.data && data.data.length > 0) {

                MineApi.isFirstTimeWithdraw().then((data) => {
                    if (data.data) {
                        this.$navigate('mine/bankCard/WithdrawalAgreementPage');
                    } else {
                        this.$navigate('mine/userInformation/WithdrawCashPage');
                    }
                }).catch((error) => {
                    this.$toastShow(error.msg);
                });

                // this.$navigate("mine/userInformation/WithdrawCashPage");

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
            this.getUserBankInfoing = false;
            this.$toastShow(err.msg);
        });
    };
    clickItem = (index) => {
        // alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ['', '用户收益', '提现支出', '消费支出', '服务顾问管理费', '品牌分红奖励', '品牌推广奖励', '现金红包', '任务奖励', '消费退款', '提现退回'];
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
                            serialNumber: '编号：' + item.serialNo,
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
        flex: 1, backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    },
    container: {
        backgroundColor: DesignRule.mainColor
    }, imageBackgroundStyle: {
        position: 'absolute',
        height: 95,
        backgroundColor: '#FF4F6E',
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15
    }, rectangleStyle: {
        width: 120,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3
    }, viewStyle: {
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
        marginTop: ScreenUtils.statusBarHeight,
        marginTop: 28
    },
    settingStyle: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_threeTitle
    },
    countTextStyle: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_mainTitle
    },
    withdrawButtonWrapper: {
        width: 80,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.white
    }
});


