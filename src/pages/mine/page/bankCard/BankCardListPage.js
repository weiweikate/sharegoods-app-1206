import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TouchableWithoutFeedback,
    ScrollView, ListView
} from 'react-native';
import BasePage from '../../../../BasePage';
import {
    UIText
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { SwipeListView, SwipeRow } from './../../../../components/ui/react-native-swipe-list-view';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge';
import SettingTransactionModal from '../../components/SettingTransactionModal';
import DesignRule from 'DesignRule';
import res from '../../res';

const {
    bankCard1,
    bankCard2,
    bankCard3,
    bankCard4,
    bankCard5
} = res.bankCard;

const bankCardList = [bankCard1, bankCard2, bankCard3, bankCard4, bankCard5];

class BankCardListPage extends BasePage {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            viewData: [
                // {
                //     bankCardType: 0,
                //     unbind_time: 1533813688000,
                //     card_no: '6212261202044786235',
                //     create_time: 1533813688000,
                //     bank_name: '工商银行',
                //     id: 10,
                //     card_type: 1,
                //     bind_time: 1533813688000,
                //     dealer_id: 10,
                //     status: 1
                // },
            ],
            isShowUnbindCardModal: false,
            selectBankCard: -1
        };
    }

    // 导航配置
    $navigationBarOptions = {
        title: '银行卡',
        show: true,
        headerStyle: {
            backgroundColor: DesignRule.textColor_mainTitle
        },
        leftNavImage: res.button.white_back_img,
        leftImageStyle: {
            width: 9, height: 15
        },
        titleStyle: {
            color: 'white'
        }


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
                                style={{ fontSize: 16, color: 'white' }}/>
                    </TouchableOpacity>
                </View>
                {this.renderModal()}
            </ScrollView>

        );
    }

    renderSwipeList = () => {
        return (
            <SwipeListView
                disableRightSwipe={true} leftOpenValue={75} rightOpenValue={-75}
                dataSource={this.ds.cloneWithRows(this.state.viewData)}

                renderRow={(rowData, secId, rowId, rowMap) => (
                    <TouchableWithoutFeedback style={{ height: 110, flexDirection: 'row', marginTop: 10 }}
                                              onPress={(rowId) => this.callBack(rowId)}>
                        <ImageBackground style={styles.bankCardView}
                                         source={bankCardList[rowData.bankCardType]}
                                         resizeMode={'stretch'}>
                            <UIText value={rowData.bank_name}
                                    style={{ fontSize: 18, color: 'white' }}/>
                            <UIText value={'储蓄卡'}
                                    style={{ fontSize: 13, color: 'white' }}/>
                            <UIText value={StringUtils.formatBankCardNum(rowData.card_no)} style={{
                                fontSize: 18,
                                color: 'white',
                                marginTop: 15
                            }}/>

                        </ImageBackground>
                    </TouchableWithoutFeedback>
                )}
                renderHiddenRow={(data, secId, rowId, rowMap) => (
                    <TouchableOpacity
                        style={styles.standaloneRowBack}
                        onPress={() => {
                            rowMap[`${secId}${rowId}`].closeRow();
                            this.deleteBankCard(rowId);
                        }}>
                        <UIText style={styles.backUITextWhite} value='删除'/>
                    </TouchableOpacity>
                )}
            />
        );
    };

    renderList = () => {
        let arr = [];
        for (let i = 0; i < this.state.viewData.length; i++) {
            arr.push(
                <SwipeRow disableRightSwipe={true} leftOpenValue={75} rightOpenValue={-75}
                          style={{ height: 110, flexDirection: 'row', marginTop: 10 }} key={i}>
                    <View style={styles.standaloneRowBack}>
                        <TouchableOpacity style={styles.deleteStyle} onPress={() => this.deleteBankCard(i)}>
                            <Text style={{ color: 'white' }}>删除</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this.callBack(this.state.viewData[i])}>
                        <ImageBackground style={styles.bankCardView}
                                         source={bankCardList[this.state.viewData[i].bankCardType]}
                                         resizeMode={'stretch'}>
                            <UIText value={this.state.viewData[i].bank_name}
                                    style={{ fontSize: 18, color: 'white' }}/>
                            <UIText value={'储蓄卡'}
                                    style={{ fontSize: 13, color: 'white' }}/>
                            <UIText value={StringUtils.formatBankCardNum(this.state.viewData[i].card_no)} style={{
                                fontSize: 18,
                                color: 'white',
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
            <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10 }}/>
        );
    };
    renderModal = () => {
        return (
            <SettingTransactionModal
                isShow={this.state.isShowUnbindCardModal}
                ref={(ref) => {
                    this.modal = ref;
                }}
                detail={{ title: '请输入交易密码', context: '删除银行卡' }}
                closeWindow={() => {
                    this.setState({ isShowUnbindCardModal: false });
                }}
                // passwordInputError={this.state.isShowUnbindCardModal}
                //bottomText={'输入的密码有误'}
                inputText={(text) => {
                    if (text.length == 6) {
                        setTimeout(() => {
                            this.setState({ isShowUnbindCardModal: false });
                            this.finishPasswordInput(text);
                        }, 500);
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
        this.modal && this.modal.open();
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
        flex: 1, backgroundColor: DesignRule.textColor_mainTitle, marginTop: -1
    }, bankCardView: {
        height: 110,
        width: ScreenUtils.width - 30,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 15,
        paddingTop: 17,
        paddingLeft: 68
    }, backTextWhite: {
        color: 'white',
        marginRight: 20,
        borderRadius: 10,
        width: 60
    }, standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        height: 130,
        width: ScreenUtils.width,
        flexDirection: 'row',
        marginRight: 16
    }, standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: DesignRule.textColor_mainTitle,
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
        backgroundColor: DesignRule.mainColor,
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
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default BankCardListPage;
