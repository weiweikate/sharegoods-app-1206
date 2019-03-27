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
    DeviceEventEmitter,
    Image
} from 'react-native';
import BasePage from '../../../../BasePage';
import {
    MRText,
    UIText
} from '../../../../components/ui';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { observer } from 'mobx-react/native';
import EmptyUtils from '../../../../utils/EmptyUtils';
import SwipeListView from '../../../../components/ui/react-native-swipe-list-view/components/SwipeListView';
import RouterMap from '../../../../navigation/RouterMap';

const {
    bankCard1,
    bankCard2,
    bankCard3,
    bankCard4,
    bankCard5,
    bankcard_empty
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
        };

        this.selectBankCard = null;
    }

    // 导航配置
    $navigationBarOptions = {
        title: '提现银行卡管理',
        show: true
    };

    $NavBarRenderRightItem = () => {
        return (
            <TouchableWithoutFeedback onPress={this.addBankCard}>
                <MRText style={styles.rightStyle}>添加银行卡</MRText>
            </TouchableWithoutFeedback>
        );
    };

    $isMonitorNetworkStatus() {
        return true;
    }


    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('unbindBank', (bankId) => {
            this._getBankInfo();
        });
        this.bindListener = DeviceEventEmitter.addListener('bindBank', (bankId) => {
            this._getBankInfo();
        });
        this.$loadingShow();
        this._getBankInfo();
    }

    componentWillUnmount() {
        this.bindListener && this.bindListener.remove();
        this.listener && this.listener.remove();
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
            <View style={{ flex: 1 }}>
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
                    </View>
                </ScrollView>
                <MRText style={styles.tipStyle}>注：请绑定本人有效储蓄卡，信用卡将无法提现</MRText>
            </View>

        );
    };

    _renderValidItem = (rowData, rowId, rowMap) => {
        return (
            <View style={{ height: 110, flexDirection: 'row', marginTop: 10, width: ScreenUtils.width }}>
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
        if (this.state.viewData.length) {
            const tempArr = this.ds.cloneWithRows(this.state.viewData);
            return (<SwipeListView
                style={{ backgroundColor: DesignRule.white }}
                dataSource={tempArr}
                disableRightSwipe={true}
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
                            borderRadius: 10
                        }}>
                            <UIText style={{ color: DesignRule.white, fontSize: DesignRule.fontSize_mediumBtnText }}
                                    value='删除'/>
                        </View>
                    </TouchableOpacity>
                )}
                listViewRef={(listView) => this.contentList = listView}
                rightOpenValue={-68}
            />);
        } else {
            return <View style={{ marginTop: 200, alignSelf: 'center', alignItems: 'center' }}>
                <Image source={bankcard_empty} style={{ width: 120, height: 120 }}/>
                <UIText style={{
                    color: DesignRule.textColor_instruction,
                    fontSize: DesignRule.fontSize_threeTitle,
                    marginTop: 15
                }}
                        value={'您还没有添加银行卡'}/>
            </View>;
        }
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

    //**********************************BusinessPart******************************************
    loadPageData() {
        this.$loadingShow();
        this._getBankInfo();
    }


    deleteBankCard = (data) => {
        this.$navigate(RouterMap.BankCardPasswordPage, { title: '删除银行卡', selectBankCard: data, type: 'delete' });
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

        if (this.state.viewData.length >= 5) {
            Alert.alert('提示', '最多添加5张银行卡\n如需另外绑定，请解绑其他银行卡',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    }
                ]
            );
        } else {
            this.$navigate(RouterMap.BankCardPasswordPage, { title: '绑定银行卡', type: 'bind' });
        }
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
        flex: 1, backgroundColor: DesignRule.bgColor, marginTop: -1
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
    },
    rightStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    tipStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_threeTitle,
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 30
    }
});

