import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList, UIImage, UIText } from '../../../../components/ui';
// import AccountItem from '../../components/AccountItem';
import { color } from '../../../../constants/Theme';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
// import withdrawMoney from '../../res/userInfoImg/withdrawMoney.png';
import tuiguang from '../../res/userInfoImg/xiangjzhanghu_icon03_16.png';
import salesCommissions from '../../res/userInfoImg/xiangjzhanghu_icon03_08.png';
import questionImage_white from '../../res/userInfoImg/questionImage_white.png';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge';
import topicShow from '../../../topic/res/topicShow.png';
import topicShowClose from '../../../topic/res/topicShowClose.png';
import CommModal from 'CommModal';
import DesignRule from 'DesignRule';

export default class WaitingForWithdrawCashPage extends BasePage {
    constructor(props) {
        super(props);
        // this.initHeader({
        //     title: '待提现账户',
        // })
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [],
            restMoney: 1600.00,
            isEmpty: false,
            waitingForWithdrawMoney: 0,
            currentPage: 1,
            blockedBalance: this.params.blockedBalance,
            modalVisible: false
        };
        this.currentPage = 0;
    }

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        title: '待提现账户'
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
            </View>
        );
    }

    renderHeader = () => {
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.imageBackgroundStyle} />
                <View style={styles.viewStyle}>
                    <Text style={{ marginLeft: 15, marginTop: 16, fontSize: 15, color: color.white }}>待提现余额(元)</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ height: 44, justifyContent: 'space-between', marginTop: 15 }}>
                            <Text style={{
                                marginLeft: 25,
                                fontSize: 25,
                                color: color.white
                            }}>{StringUtils.formatMoneyString(this.state.blockedBalance, false)}</Text>
                        </View>
                        <View style={{ marginRight: 20 }}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', marginTop: 10, paddingLeft: 22, alignItems: 'center' }}
                                onPress={() => this.show()}>
                                <UIImage source={questionImage_white}
                                         style={{ width: 13, height: 13, marginRight: 3 }}/>
                                <UIText value={'提现说明'} style={{ fontSize: 11, color: '#ffffff' }}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {this.renderShowCommand()}
            </View>

        );
    };
    show = () => {
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
                       transparent={true}>
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.5)', top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        top: ScreenUtils.px2dp(105),
                        width: ScreenUtils.px2dp(290),
                        height: ScreenUtils.px2dp(360),
                        alignSelf: 'center',
                        position: 'absolute'
                    }}>
                        <ImageBackground source={topicShow} style={{
                            width: ScreenUtils.px2dp(290),
                            height: ScreenUtils.px2dp(71),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{ color: 'white', fontSize: ScreenUtils.px2dp(18) }}>待提现账户说明</Text>
                        </ImageBackground>
                        <View style={{ marginLeft: ScreenUtils.px2dp(22) }}>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(25),
                                color: '#000000',
                                fontSize: ScreenUtils.px2dp(15)
                            }}>什么是待提现账户？</Text>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(10),
                                color: '#666666',
                                fontSize: ScreenUtils.px2dp(13)
                            }}>{`待提现账户为用户收益明细账户，可通过待提现账户查看收益情况`}</Text>
                        </View>
                        <View style={{ marginLeft: ScreenUtils.px2dp(22) }}>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(25),
                                color: '#000000',
                                fontSize: ScreenUtils.px2dp(15)
                            }}>为何不能马上提现？</Text>
                            <Text style={{
                                marginTop: ScreenUtils.px2dp(10),
                                color: '#666666',
                                fontSize: ScreenUtils.px2dp(13)
                            }}>{`因为您下级或下下级的交易并未完全完成，所以账户中的余额暂时不可马上提现，当交易完成之后，系统回自动提现到您的余额账户`}</Text>
                        </View>
                        <TouchableOpacity style={{
                            top: 0,
                            right: 0,
                            position: 'absolute'
                        }} onPress={this._onPress}>
                            <Image source={topicShowClose}/>
                        </TouchableOpacity>
                    </View>
                </View>

            </CommModal>
        );
    }

    renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity style={styles.container} o>
                    <View style={{ height: 90, justifyContent: 'center' }}>
                        <UIImage source={item.iconImage} style={{ height: 50, width: 50, marginLeft: 16 }}/>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <UIText value={item.type}/>
                        <UIText value={item.time}
                                style={{
                                    color: DesignRule.textColor_instruction,
                                    fontSize: 13,
                                    marginTop: item.serialNumber == '' ? 10 : 0
                                }}/>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <View style={{ marginRight: 15, height: 60, justifyContent: 'space-between' }}>
                            <UIText value={item.capital}
                                    style={{
                                        color: item.capitalRed ? DesignRule.mainColor : DesignRule.textColor_mainTitle,
                                        fontSize: 16
                                    }}/>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}/>
                            <UIText value={''}/>
                        </View>
                    </View>
                </TouchableOpacity>

                </View>

        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line, marginLeft: 48, marginRight: 48 }}/>
        );
    };

    //**********************************BusinessPart******************************************
    componentDidMount() {
        if (!user.isLogin) {
            this.$navigate('login/login/LoginPage');
        }
        this.getDataFromNetwork();
    }

    jumpToWithdrawCashPage = () => {
        this.$navigate('mine/userInformation/TokenExchangePage');
    };
    clickItem = (index) => {
        // alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ['', '销售提成', '推广提成'];
        let use_type_symbol = ['', '+', '+'];
        let useLeftImg = ['', salesCommissions, tuiguang];
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        Toast.showLoading();
        MineApi.userBalanceQuery({ page: this.currentPage, size: 20, type: 1 }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code === 10000) {
                let data = response.data;

                if (data.data instanceof Array) {
                    data.data.map((item, index) => {
                        arrData.push({
                            type: use_type[item.useType],
                            time: DataUtils.getFormatDate(item.createTime / 1000),
                            serialNumber: '流水号：' + item.serialNo,
                            capital: use_type_symbol[item.useType] + item.balance,
                            iconImage: useLeftImg[item.useType],
                            capitalRed: use_type_symbol[item.useType] === '-'

                        });
                    });
                }

                this.setState({
                    viewData: arrData,
                    isEmpty: data.data && data.data.length !== 0 ? false : true
                });
            } else {
                this.$toastShow(response.msg);
                this.setState({
                    viewData: arrData,
                    isEmpty: true
                });

            }
        }).catch(e => {
            Toast.hiddenLoading();
            if (e.code === 10009) {
                this.$navigate('login/login/LoginPage');
            }
        });
    };
    onRefresh = () => {
        this.currentPage = 1;
        this.getDataFromNetwork();
    };
    onLoadMore = (page) => {
        this.currentPage++;
        this.getDataFromNetwork();
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: color.page_background
    },
    container: {}, imageBackgroundStyle: {
        position: 'absolute',
        height: 95,
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15,
        backgroundColor:'#8EC7FF'
    }, rectangleStyle: {
        width: 100,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: color.white,
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
    }
});

