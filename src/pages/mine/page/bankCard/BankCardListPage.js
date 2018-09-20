import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import {
    UIText
} from '../../../../components/ui';
import { color } from '../../../../constants/Theme';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import bankCard1 from './res/bankCard1.png';
import bankCard2 from './res/bankCard2.png';
import bankCard3 from './res/bankCard3.png';
import bankCard4 from './res/bankCard4.png';
import bankCard5 from './res/bankCard5.png';
import { SwipeRow } from 'react-native-swipe-list-view';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge';
import SettingTransactionModal from '../../components/SettingTransactionModal';

const bankCardList = [bankCard1, bankCard2, bankCard3, bankCard4, bankCard5];

class BankCardListPage extends BasePage {
    constructor(props) {
        super(props);
        // this.initHeader({
        //     title: '银行卡',
        //     textColor:color.white,
        //     backgroundColor:"#282d33",
        //     leftIcon:left_arrow_white,
        //     isShowLine:false,
        // })
        this.state = {
            viewData: [
                {
                    bankCardType:0,
                    unbind_time: 1533813688000,
                    card_no: "6212261202044786235",
                    create_time: 1533813688000,
                    bank_name: "工商银行",
                    id: 10,
                    card_type: 1,
                    bind_time: 1533813688000,
                    dealer_id: 10,
                    status: 1
                },{
                    bankCardType:1,
                    unbind_time: 1533813688000,
                    card_no: "6212261202044786235",
                    create_time: 1533813688000,
                    bank_name: "工商银行",
                    id: 10,
                    card_type: 1,
                    bind_time: 1533813688000,
                    dealer_id: 10,
                    status: 1
                },
            ],
            isShowUnbindCardModal: false,
            selectBankCard: -1
        };
    }
    // 导航配置
    $navigationBarOptions = {
        title: "银行卡",

    };
    //**********************************ViewPart******************************************
    _render() {
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center' }}>
                    {this.renderList()}
                    <TouchableOpacity
                        style={[styles.addBankCardView, { marginTop: this.state.viewData.length == 0 ? 76 : 47 }]}
                        onPress={() => this.addBankCard()}>
                        <UIText value={'+ 点击添加银行卡'}
                                style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 16, color: '#ffffff' }}/>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    renderList = () => {
        let arr = [];
        for (let i = 0; i < this.state.viewData.length; i++) {
            arr.push(
                <SwipeRow disableRightSwipe={true} leftOpenValue={75} rightOpenValue={-75}
                          style={{ height: 110, flexDirection: 'row', marginTop: 10 }} key={i}>
                    <View style={styles.standaloneRowBack}>
                        <TouchableOpacity style={styles.deleteStyle} onPress={() => this.deleteBankCard(i)}>
                            <Text style={{ color: color.white }}>删除</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this.callBack(this.state.viewData[i])}>
                        <ImageBackground style={styles.bankCardView}
                                         source={bankCardList[this.state.viewData[i].bankCardType]}
                                         resizeMode={'stretch'}>
                            <UIText value={this.state.bank_name}
                                    style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 18, color: '#ffffff' }}/>
                            <UIText value={'储蓄卡'}
                                    style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, color: '#ffffff' }}/>
                            <UIText value={StringUtils.formatBankCardNum(this.state.viewData[i].card_no)} style={{
                                fontFamily: 'PingFang-SC-Medium',
                                fontSize: 18,
                                color: '#ffffff',
                                marginTop: 15
                            }}/>
                        </ImageBackground>
                    </TouchableWithoutFeedback>
                </SwipeRow>
            );
        }
        return arr;
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, height: 10 }}/>
        );
    };
    renderModal = () => {
        return (
            <SettingTransactionModal
                isShow={this.state.isShowUnbindCardModal}
                detail={{ title: '请输入交易密码', context: '删除银行卡' }}
                closeWindow={() => {
                    this.setState({ isShowUnbindCardModal: false });
                }}
                passwordInputError={this.state.isShowUnbindCardModal}
                //bottomText={'输入的密码有误'}
                inputText={(text) => {
                    if (text.length == 6) {
                        this.setState({ isShowUnbindCardModal: false });
                        this.finishPasswordInput(text);
                    }
                }}
            />
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
        Toast.showLoading();
        MineApi.findBindBankInfoByDealerId().then((response) => {
            Toast.hiddenLoading();
            let arrData = [];
            if (response.ok) {
                response.data.map((item, index) => {
                    arrData.push({
                        bankCardType: index % 5,
                        unbind_time: item.unbind_time,
                        card_no: item.card_no,
                        create_time: item.create_time,
                        bank_name: item.bank_name,
                        id: item.id,
                        card_type: item.card_type,
                        bind_time: item.bind_time,
                        dealer_id: item.dealer_id,
                        status: item.status
                    });
                });
                this.setState({ viewData: arrData });
            } else {
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
        });
    }

    finishPasswordInput = (text) => {
        Toast.showLoading();
        let params = {
            password: text,
            id: this.state.viewData[this.state.selectBankCard].id
        };
        MineApi.updateBindBankInfoDeleteById(params).then((response) => {
            Toast.hiddenLoading();
            if (response.ok) {
                NativeModules.commModule.toast('删除成功');
                this.loadPageData();
            } else {
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
        });
    };
    deleteBankCard = (index) => {
        this.setState({
            isShowUnbindCardModal: true,
            selectBankCard: index
        });
    };
    addBankCard = () => {
        this.$navigate('mine/bankCard/AddBankCardPage', { callBack: () => this.loadPageData() });
    };
    callBack = (item) => {
        if (this.params.callBack) {
            this.params.callBack(item);
            this.$navigateBack();
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#383c45', paddingTop: 5
    }, bankCardView: {
        height: 110,
        width: ScreenUtils.width - 30,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 17,
        paddingLeft: 68
    }, backTextWhite: {
        color: color.white,
        marginRight: 20,
        borderRadius: 10,
        width: 60
    }, standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: color.white,
        justifyContent: 'center',
        height: 130,
        width: ScreenUtils.width,
        flexDirection: 'row',
        marginRight: 16
    }, standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#383c45',
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 15,
        marginRight: 15
    }, deleteStyle: {
        width: 60,
        height: 110,
        borderRadius: 10,
        backgroundColor: '#e60012',
        justifyContent: 'center',
        alignItems: 'center'
    }, addBankCardView: {
        width: 290,
        height: 48,
        flex: 1,
        marginBottom: 40,
        borderRadius: 5,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default BankCardListPage;
