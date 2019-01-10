import React from 'react';
import user from '../../../../model/user';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    TouchableWithoutFeedback,
    ScrollView, ListView,
    RefreshControl,
    Alert,
    DeviceEventEmitter
} from 'react-native';
import BasePage from '../../../../BasePage';
import {
    UIText
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import BankTradingModal from './../../components/BankTradingModal';
import { observer } from 'mobx-react/native';
import EmptyUtils from '../../../../utils/EmptyUtils';
import SwipeListView from '../../../../components/ui/react-native-swipe-list-view/components/SwipeListView';

const {
    bankCard1,
    bankCard2,
    bankCard3,
    bankCard4,
    bankCard5,
    add_bank_button,
    add_bank_disable
} = res.bankCard;

const bankCardList = [bankCard1, bankCard2, bankCard3, bankCard4, bankCard5];
@observer
export default class BankCardListPage extends BasePage {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            viewData: [],
            isShowUnbindCardModal: false,
            isShowBindModal: false,
            isRefreshing: false
            // bindErr:'',
            // unBindErr:''
        };

        this.selectBankCard = null;
    }

    // 导航配置
    $navigationBarOptions = {
        title: '银行卡',
        show: true,
        headerStyle: {
            backgroundColor: DesignRule.textColor_mainTitle
        },
        leftNavImage: res.button.white_back,
        leftImageStyle: {
            width: 9, height: 15
        },
        titleStyle: {
            color: 'white'
        }


    };

    $isMonitorNetworkStatus() {
        return true;
    }

    componentDidMount() {
        this.$loadingShow();
        this._getBankInfo();
    }

    _getBankInfo = () => {
        MineApi.getUserBankInfo().then((data) => {
            this.setState({
                viewData: data.data,
                isRefreshing: false
            });
            this.$loadingDismiss();
        }).catch((error) => {
            this.setState({
                isRefreshing: false
            });
            this.$loadingDismiss();
        });
    };

    //**********************************ViewPart******************************************
    _render = () => {
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._getBankInfo}
                                progressViewOffset={ScreenUtils.statusBarHeight + 44}
                                colors={[DesignRule.mainColor]}
                                title="下拉刷新"
                                tintColor={DesignRule.textColor_instruction}
                                titleColor={DesignRule.textColor_instruction}
                            />}>
                <View style={{ alignItems: 'center' }}>
                    {this.renderList()}
                    <TouchableOpacity
                        disabled={(this.state.viewData && this.state.viewData.length === 5)}
                        style={[styles.addBankCardView, { marginTop: this.state.viewData.length === 0 ? 76 : 47 }]}
                        onPress={() => this.addBankCard()}>
                        <ImageBackground
                            source={(this.state.viewData && this.state.viewData.length === 5) ? add_bank_disable : add_bank_button}
                            style={{
                                height: 48, width: 290, justifyContent: 'center',
                                alignItems: 'center'
                            }} resizeMode={'stretch'}>
                            <UIText
                                value={(this.state.viewData && this.state.viewData.length === 5) ? '+  最多添加5张银行卡' : '+  点击添加银行卡'}
                                style={{
                                    fontSize: 16,
                                    color: (this.state.viewData && this.state.viewData.length === 5) ? '#8f8f8f' : 'white'
                                }}/>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
                {this.renderBankModal()}
                <BankTradingModal
                    ref={(ref) => {
                        this.bindCardModal = ref;
                    }}
                    forgetAction={() => {
                        this.forgetTransactionPassword();
                    }}
                    closeAction={() => {
                        this.setState({
                            isShowBindModal: false
                        });
                    }}
                    finishedAction={(password) => this.bindCardFinish(password)}
                    visible={this.state.isShowBindModal}
                    instructions={'忘记支付密码'}
                    title={'输入平台密码'}
                    message={'绑定银行卡'}
                />
            </ScrollView>

        );
    };

    _renderValidItem = (rowData, rowId, rowMap) => {
        return (
            <View style={{ height: 110, flexDirection: 'row', marginTop: 10, width: ScreenUtils.width }}>
                {/*<View style={styles.standaloneRowBack}>*/}
                {/*<TouchableOpacity style={styles.deleteStyle} onPress={() => this.deleteBankCard(rowId)}>*/}
                {/*<Text style={{ color: "white" }}>删除</Text>*/}
                {/*</TouchableOpacity>*/}
                {/*</View>*/}
                <TouchableWithoutFeedback onPress={() => this.callBack(this.state.viewData[rowId])}>
                    <ImageBackground style={styles.bankCardView}
                                     source={bankCardList[rowId]}
                                     resizeMode={'stretch'}>
                        <UIText value={rowData.bankName}
                                style={{ fontSize: 18, color: 'white' }}/>
                        <UIText value={rowData.cardType}
                                style={{ fontSize: 13, color: 'white' }}/>
                        <UIText value={StringUtils.formatBankCardNum(rowData.cardNo)} style={{
                            fontSize: 18,
                            color: 'white',
                            marginTop: 15
                        }}/>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </View>
        );
    };

    renderList = () => {
        // let arr = [];
        // for (let i = 0; i < this.state.viewData.length; i++) {
        //     arr.push(
        //         <SwipeRow disableRightSwipe={true} leftOpenValue={75} rightOpenValue={-75}
        //                   style={{ height: 110, flexDirection: "row", marginTop: 10 }} key={i}>
        //             <View style={styles.standaloneRowBack}>
        //                 <TouchableOpacity style={styles.deleteStyle} onPress={() => this.deleteBankCard(i)}>
        //                     <Text style={{ color: "white" }}>删除</Text>
        //                 </TouchableOpacity>
        //             </View>
        //             <TouchableWithoutFeedback onPress={() => this.callBack(this.state.viewData[i])}>
        //                 <ImageBackground style={styles.bankCardView}
        //                                  source={bankCardList[i]}
        //                                  resizeMode={"stretch"}>
        //                     <UIText value={this.state.viewData[i].bankName}
        //                             style={{ fontSize: 18, color: "white" }}/>
        //                     <UIText value={this.state.viewData[i].cardType}
        //                             style={{ fontSize: 13, color: "white" }}/>
        //                     <UIText value={StringUtils.formatBankCardNum(this.state.viewData[i].cardNo)} style={{
        //                         fontSize: 18,
        //                         color: "white",
        //                         marginTop: 15
        //                     }}/>
        //                 </ImageBackground>
        //             </TouchableWithoutFeedback>
        //         </SwipeRow>
        //     );
        // }
        // return arr;
        const tempArr = this.ds.cloneWithRows(this.state.viewData);

        return (<SwipeListView
            style={{ backgroundColor: DesignRule.textColor_mainTitle }}
            dataSource={tempArr}
            disableRightSwipe={true}
            // renderRow={ data => (
            //     data.status==validCode? this._renderValidItem(data): this._renderInvalidItem(data)
            // )}
            renderRow={(rowData, secId, rowId, rowMap) => (
                this._renderValidItem(rowData, rowId, rowMap)
            )}
            renderHiddenRow={(data, secId, rowId, rowMap) => (
                <TouchableOpacity
                    style={styles.standaloneRowBack}
                    onPress={() => {
                        rowMap[`${secId}${rowId}`].closeRow();
                        this.deleteBankCard(data);
                    }}>
                    <View style={{
                        backgroundColor: DesignRule.mainColor,
                        width: 60,
                        height: 109,
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 11
                    }}>
                        <UIText style={{ color: DesignRule.white, fontSize: DesignRule.fontSize_mediumBtnText }}
                                value='删除'/>
                    </View>
                </TouchableOpacity>
            )}
            listViewRef={(listView) => this.contentList = listView}
            rightOpenValue={-75}
        />);

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
    renderBankModal = () => {
        return (
            <BankTradingModal
                ref={(ref) => {
                    this.unbindModal = ref;
                }}
                forgetAction={() => this.forgetTransactionPassword()}
                closeAction={() => this.setState({ isShowUnbindCardModal: false })}
                visible={this.state.isShowUnbindCardModal}
                finishedAction={(password) => this.deleteFinishedPwd(password)}
                title={'请输入交易密码'}
                message={'删除银行卡'}
                // errMsg={this.state.unBindErr}
                instructions={'忘记支付密码'}
            />
        );
    };

    deleteFinishedPwd = (password) => {
        this.setState({
            isShowUnbindCardModal: false
        });
        let id = this.selectBankCard.id;
        MineApi.deleteUserBank({ id: id, password: password }).then((data) => {
            this.$loadingShow();
            this._getBankInfo();
            DeviceEventEmitter.emit('unbindBank', id);
        }).catch((error) => {
            // this.setState({unBindErr:error.msg});
            this.$toastShow(error.msg);
        });
        // this.setState({ isShowUnbindCardModal: false });
        // this.$navigate("mine/bankCard/AddBankCardPage", { callBack: () => this.loadPageData() });
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
        this.$loadingShow();
        this._getBankInfo();
    }

    bindCardFinish = (password) => {
        this.setState({
            isShowBindModal: false
        });

        MineApi.judgeSalesPassword({ newPassword: password, type: 6 }).then((data) => {
            this.$navigate('mine/bankCard/AddBankCardPage', { callBack: () => this.loadPageData() });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };
    //
    // finishPasswordInput = (text) => {
    //     Toast.showLoading();
    //     let params = {
    //         password: text,
    //         id: this.state.viewData[this.state.selectBankCard].id
    //     };
    //     MineApi.updateBindBankInfoDeleteById(params).then((response) => {
    //         Toast.hiddenLoading();
    //         NativeModules.commModule.toast("删除成功");
    //         this.loadPageData();
    //     }).catch(e => {
    //         Toast.hiddenLoading();
    //         this.$toastShow(e.msg);
    //     });
    // };


    forgetTransactionPassword = () => {
        this.setState({
            isShowBindModal: false,
            isShowUnbindCardModal: false

        });
        this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
    };

    deleteBankCard = (data) => {
        this.selectBankCard = data;
        this.setState({
            isShowUnbindCardModal: true
            // unBindErr:'',
            // bindErr:''
        });
        this.unbindModal && this.unbindModal.open();
    };
    addBankCard = () => {

        if (EmptyUtils.isEmpty(user.realname)) {
            Alert.alert('未实名认证', '你还没有实名认证', [{
                text: '稍后认证', onPress: () => {
                }
            }, {
                text: '马上就去', onPress: () => {
                    this.$navigate('mine/userInformation/IDVertify2Page');
                }
            }]);
            return;
        }

        if (!user.hadSalePassword) {
            Alert.alert('未设置密码', '你还没有设置初始密码', [{
                text: '稍后设置', onPress: () => {
                }
            }, {
                text: '马上就去', onPress: () => {
                    this.$navigate('mine/account/JudgePhonePage', { title: '设置交易密码' });
                }
            }]);
            return;
        }
        this.setState({
            isShowBindModal: true
        });
        this.bindCardModal && this.bindCardModal.open();

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
        flex: 1,
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

        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

