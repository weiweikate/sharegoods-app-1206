import React from 'react';
import {
    View, Text, Platform, NativeModules, StyleSheet, TouchableOpacity, Image, Modal, Alert
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText
} from '../../../components/ui';
// import SpellShopApi from 'SpellShopApi';
import StringUtils from '../../../utils/StringUtils';
// import ScreenUtils from '../../../utils/ScreenUtils';
import { color } from '../../../constants/Theme';
import selected from './res/selected.png';
import noselect from './res/icon13_03.png';
import yinunit from './res/icon_03-05.png';
import zfbicon from './res/icon_03-09.png';
import wxicon from './res/icon_03-08.png';
import moneIon from './res/icon_03-02.png';
import Toast from '../../../utils/bridge';
import OrderApi from '../api/orderApi';
import PayUtil from './PayUtil';
import InputTransactionPasswordModal from '../components/InputTransactionPasswordModal';
import user from '../../../model/user';
import { observer } from 'mobx-react/native';
import { NavigationActions } from 'react-navigation';

@observer
export default class PaymentMethodPage extends BasePage {

    $navigationBarOptions = {
        title: '支付方式',
        show: true // false则隐藏导航
    };

    constructor(props) {
        super(props);
        this.state = {
            payMethodList: [false, false, false, false, false, false],
            isShowPaymentModal: false,
            password: '',
            //余额
            available_balance: user.availableBalance,
            /*
            * 用于支付页面的相关数据展示与页面控制,这里展示最大子集(可拓展)，并不需要全部传完
            * */
            paymentPageParams: {
                //0:订单 1:拼店 and etc (页面来源,默认值为1拼店)
                pageType: this.params.openShopPay ? 1 : 0,
                //需要支付的金额
                shouldPayMoney: this.params.amounts ? this.params.amounts : 0,
                //example:2表示两个代币兑换1个余额
                //-1表示该参数未初始化,不能完成支付 todo 做支付拦截
                tokenCoinToBalance: this.params.tokenCoinToBalance ? this.params.tokenCoinToBalance : -1,
                //订单支付的参数
                orderPayParams: {
                    //订单编号
                    orderNum: this.params.orderNum ? this.params.orderNum : 0
                    // //订单 0:快递订单 1:自提订单
                    // orderType:this.params.orderType?this.params.orderType:0,
                }
            },
            isShow:false
        };
    }

    //支付方式选择
    orderMenuJump(i) {
        /*
        * 0-1为代币支付 余额支付
        * 2为UI空白行
        * 3-5为银行卡支付 微信支付 支付宝支付
        *
        * */
        let payMethodList = this.state.payMethodList;
        switch (i) {
            case 0:
                payMethodList[0] = !payMethodList[0];
                // payMethodList[1]=payMethodList[1];
                break;
            // case 1:
            //     payMethodList[0]=payMethodList[0];
            //     payMethodList[1]=!payMethodList[1];
            //     break
            case 2:
                payMethodList[2] = !payMethodList[2];
                payMethodList[3] = false;
                payMethodList[4] = false;
                break;
            case 3:
                payMethodList[2] = false;
                payMethodList[3] = !payMethodList[3];
                payMethodList[4] = false;
                break;
            case 4:
                payMethodList[2] = false;
                payMethodList[3] = false;
                payMethodList[4] = !payMethodList[4];
                break;
        }
        this.setState({ payMethodList: payMethodList });
    }

    _render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {this.renderPaymentModal()}
                    {this.renderMenu()}
                </View>
                {this.renderBottomOrder()}
                {this.renderCenterModal()}
            </View>
        );
    }

    onRequestClose(){
        this.setState({
            isShow:true
        })
    }
    renderCenterModal(){
        return (
            <Modal
                animationType='fade'
                transparent={true}
                onRequestClose={() => this.onRequestClose()}
                visible={this.state.isShow}>
                <View style={styles.modalStyle}>
                    {this.renderContent()}
                </View>
            </Modal>
        );
    }
    renderContent(){
        return null;
    }
    //支付方式弹窗
    renderPaymentModal = () => {
        return (
            <InputTransactionPasswordModal
                isShow={this.state.isShowPaymentModal}
                detail={{ title: '平台支付密码', context: '请输入平台的支付密码' }}
                closeWindow={() => {
                    this.setState({ isShowPaymentModal: false });
                }}
                passwordInputError={this.state.isShowPaymentModal}
                bottomText={'忘记支付密码'}
                inputText={(text) => {
                    if (text.length == 6) {
                        setTimeout(() => {
                            this.setState({ password: text, isShowPaymentModal: false });
                            this.commitOrder();
                        }, 100);
                    }
                }}
                forgetPassword={() => this.forgetTransactionPassword()}
            />
        );
    };

    renderMenu = () => {
        let leftImage = [moneIon, '', yinunit, wxicon, zfbicon];
        let leftText = ['余额支付', '', '银行卡支付', '微信支付', '支付宝支付'];
        let rightText = ['可用金额: ' + this.state.available_balance, '', '', ''];
        let isBottomLineWide = [false, false, false, false, false];
        let arr = [];
        for (let i = 0; i < leftImage.length; i++) {
            if (i === 1) {
                arr.push(
                    <View key={i} style={{
                        backgroundColor: color.page_background,
                        height: 39,
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontFamily: 'PingFang-SC-Medium', fontSize: 13
                            , color: '#999999', marginLeft: 15
                        }}>其他支付</Text>
                    </View>
                );
            } else {
                (
                    arr.push(
                        <View key={i} style={{ height: 60, justifyContent: 'center' }}>
                            <TouchableOpacity style={{
                                flex: 1,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: 44,
                                paddingLeft: 21,
                                paddingRight: 28,
                                backgroundColor: color.white,
                                flexDirection: 'row'
                            }} onPress={() => this.orderMenuJump(i)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={leftImage[i]} style={{ height: 33 }} resizeMode={'contain'}/>
                                    <UIText value={leftText[i]} style={[styles.blackText, { marginLeft: 5 }]}/>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <UIText value={rightText[i]} style={{
                                        marginLeft: 5,
                                        marginRight: 7,
                                        color: '#999999',
                                        fontSize: 13
                                    }}/>
                                    <Image source={this.state.payMethodList[i] ? selected : noselect}
                                           style={{ height: 22, width: 22 }} resizeMode={'stretch'}/>
                                </View>
                            </TouchableOpacity>
                            {isBottomLineWide[i] ? null :
                                <View style={{ backgroundColor: '#f7f7f7', height: 11 }}/>}
                        </View>
                    )
                );
            }
        }
        return arr;
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line }}/>
        );
    };

    renderBottomOrder = () => {
        return (
            <View>
                {this.renderLine()}
                <View style={{ height: 49, flexDirection: 'row' }}>
                    <View style={styles.bottomStyleContainer}>
                        <UIText value={'合计：'} style={styles.bottomUiText}/>
                        <UIText value={`${this.state.paymentPageParams.shouldPayMoney || 0}元`}
                                style={styles.bottomUitext1}/>
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: color.red, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.commitOrder()}>
                        <UIText value={'去支付'}
                                style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 16, color: '#ffffff' }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    loadPageData() {
        //初始化用户可用代币
        // Toast.showLoading();
        // OrderApi.findDealerAccountByIdAPP({ id: this.state.id }).then((response) => {
        //     Toast.hiddenLoading();
        //     if (response.ok) {
        //         let data = response.data;
        //         this.setState({
        //             token_coin: data.token_coin ? data.token_coin : 0,
        //             available_balance: data.available_balance ? data.available_balance : 0
        //         });
        //     } else {
        //         NativeModules.commModule.toast(response.msg);
        //     }
        // }).catch(e => {
        //     Toast.hiddenLoading();
        // });
        //初始化店铺保证金金额
        if (this.params.openShopPay) {
            // SpellShopApi.findConfig().then((response)=>{
            //     if(response.ok){
            //         let paymentPageParams=this.state.paymentPageParams
            //         paymentPageParams.shouldPayMoney=response.data.storeDeposit
            //         paymentPageParams.tokenCoinToBalance=response.data.tokenCoinToBalance
            //         this.setState({
            //             paymentPageParams:paymentPageParams,
            //         })
            //     } else {
            //         Toast.toast(response.msg);
            //     }
            // });
        }
    }

    forgetTransactionPassword = () => {
        this.setState({ isShowPaymentModal: false });
        this.navigate('mine/transactionPassword/SettingTransactionPasswordStep2Page');
    };
    payIntercept = (type) => {
        console.log(type);
        console.log(this.state.payMethodList);
        let payMethodList = this.state.payMethodList;
        if (type == 0) {
            Toast.$toast('暂不支持！');
            return false;
        }
        //纯平台支付金额不足拦截
        if (payMethodList[2] == false && payMethodList[3] == false && payMethodList[4] == false) {
            let hasSelectPay = 0;
            if (payMethodList[0]) {
                hasSelectPay += parseFloat(this.state.available_balance);
            }
            if (hasSelectPay < parseFloat(this.state.paymentPageParams.shouldPayMoney)) {
                Toast.$toast('您平台余额不足，请选择其他支付方式');
                return false;
            }
        }
        //暂不支持的支付拦截
        if (payMethodList[2]) {
            Toast.$toast('暂不支持银行卡支付');
            return false;
        }
        if (payMethodList[3]) {
            Toast.$toast('暂不支持微信支付');
            return false;
        }
        // //使用代币但是未找到代币与余额的兑换比例参数tokenCoinToBalance拦截
        // if (payMethodList[0]&&this.state.paymentPageParams.tokenCoinToBalance==-1){
        //     Toast.toast('查询服务器代币兑换比例异常');
        //     return false
        // }
        return true;
    };
    commitOrder = () => {
        const { params, type } = this.getApiRequestParams();
        if (!this.payIntercept(type)) {
            return;
        }
        //判断是否有初始化交易密码
        if (user.hadSalePassword) {
            //仅三方支付不需要输入交易密码
            if (type != 8 && StringUtils.isEmpty(this.state.password)) {
                this.setState({ isShowPaymentModal: true });
                return;
            }
            //纯
            switch (this.state.paymentPageParams.pageType) {
                //0:订单 1:拼店 and etc (页面来源,默认值为1拼店)
                case 0:
                    this.orderPay(params);
                    break;
                case 1:
                    // this.spellShopPay(params)
                    break;
            }
            //password错误之后需要置空，重新输入密码
            this.setState({ password: '' });

        } else {
            this.$navigate('mine/account/JudgePhonePage', { hasOriginalPsw: false });
        }

    };
    //需要在当前选择的支付方式能完成支付的情况下，才保证调用该方法返回的数据有效性
    getApiRequestParams = () => {
        let payMethodList = this.state.payMethodList;
        let type = 0;
        if (payMethodList[0]) {
            type += 1;
        }
        if (payMethodList[4]) {
            type += 8;
        }
        /*
        * 先扣除代币 -> 余额 -> 三方
        * */
        let balance = 0;
        let leftShouldPayMoney = this.state.paymentPageParams.shouldPayMoney;
        if (payMethodList[0] && leftShouldPayMoney != 0) {
            if (parseFloat(this.state.available_balance) >= parseFloat(leftShouldPayMoney)) {
                balance = parseFloat(leftShouldPayMoney);
                leftShouldPayMoney = 0;
            } else {
                balance = this.state.available_balance;
                leftShouldPayMoney = parseFloat(this.state.paymentPageParams.shouldPayMoney) - parseFloat(this.state.available_balance);
            }
        }
        //对应的leftShouldPayMoney后端也会计算
        let params = {
            balance: balance,//N:余额	number
            amounts: this.state.paymentPageParams.shouldPayMoney,//N:第三方金额	number
            orderNum: this.state.paymentPageParams.orderPayParams.orderNum,//N:订单号	string
            salePsw: this.state.password,//Y:交易密码	string
            type: type//N:支付方式	number 1:纯平台2：微信小程序4：微信app8：支付宝16：银联卡
        };
        return { params, type };
    };
    orderPay = (params) => {
        let payMethodList = this.state.payMethodList;
        Toast.showLoading();
        OrderApi.prePay(params).then((response) => {
            Toast.hiddenLoading();
                if (payMethodList[4]) {
                    let payString = response.data.prePayStr;
                    PayUtil.appAliPay(payString).then(resultStr => {
                        console.log('appAliPay:' + JSON.stringify(resultStr));
                        if (resultStr.code == 0) {
                            this.continueToPay(response.data.outTradeNo);
                        } else {
                            this.navigate('payment/PayResultPage', { pageType: this.state.paymentPageParams.orderPayParams.orderType + 1 });
                            // NativeModules.commModule.toast('支付失败')
                        }
                    }).catch(e => {
                        NativeModules.commModule.toast('调用失败' + e);
                    });
                } else {
                    this.continueToPay(response.data.outTradeNo);
                }
        }).catch(e => {
            NativeModules.commModule.toast(e.msg + '');
            Toast.hiddenLoading();
        });
    };
    //拼店的支付
    // spellShopPay = (params) => {
    //     let payMethodList = this.state.payMethodList;
    //     const { openShopPay } = this.params || {};
    //     if (openShopPay) {
    //         SpellShopApi.storeDeposit(params).then((response) => {
    //             if (response.ok) {
    //                 if (payMethodList[5]) {
    //                     //针对服务器脏数据处理
    //                     if (StringUtils.isEmpty(response.data)) {
    //                         NativeModules.commModule.toast('服务器数据异常');
    //                         return;
    //                     }
    //                     let payString = response.data.data;
    //                     PayUtil.appAliPay(payString).then(resultStr => {
    //                         console.log('appAliPay:' + JSON.stringify(resultStr));
    //                         if (resultStr.code == 0) {
    //                             this.props.navigation.navigate('spellShop/shopSetting/SetShopNamePage', {
    //                                 gesturesEnabled: false
    //                             });
    //                         }
    //                     }).catch(e => {
    //                         NativeModules.commModule.toast('调用失败' + e.msg);
    //                     });
    //                 } else {
    //                     this.props.navigation.navigate('spellShop/shopSetting/SetShopNamePage', {
    //                         gesturesEnabled: false
    //                     });
    //                 }
    //             } else {
    //                 Toast.toast(response.msg);
    //             }
    //         });
    //         return;
    //     }
    // };
    //继续去支付
    continueToPay = (outTradeNo) => {
        OrderApi.continueToPay({ outTradeNo: outTradeNo }).then((response) => {
                // NativeModules.commModule.toast('支付成功');
            Alert.alert('支付提示','支付成功', [
                {
                    text: '返回首页', onPress: () => {
                        let resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
                            ]
                        });
                        this.props.navigation.dispatch(resetAction);
                    }
                },
                {
                    text: '回到订单', onPress: () => {
                      this.$navigate('order/order/MyOrdersListPage')
                    }
                }
            ], { cancelable: true });
                // this.loadPageData();
                // this.$navigate('payment/PayResultPage', { pageType: this.state.paymentPageParams.orderPayParams.orderType });
                // //继续支付
                // OrderApi.continuePay({outTradeNo:response.data.outTradeNo,type:1}).then((response)=>{
                //     if(response.ok ){
                //
                //     } else {
                //         NativeModules.commModule.toast(response.msg)
                //     }
                // }).catch(e=>{
                //     NativeModules.commModule.toast(e)
                // });
        }).catch(e => {
            NativeModules.commModule.toast(e);
        });
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#f7f7f7', justifyContent: 'flex-end'
    },
    selectText: {
        fontFamily: 'PingFang-SC-Medium', fontSize: 16, color: '#ffffff'
    }, blackText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        lineHeight: 18,
        color: '#000000'
    }, grayText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        lineHeight: 18,
        color: '#999999'
    },
    modalStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        flex: 1
    },
    pcontainer: {
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        marginLeft: Platform.OS == 'ios' ? 22 : 40,
        marginRight: Platform.OS == 'ios' ? 22 : 40,
        marginBottom: 22
    },
    inputItem: {
        height: 35,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 1,
        borderColor: '#ccc'
    },
    iconStyle: {
        width: 16,
        height: 16,
        backgroundColor: '#222',
        borderRadius: 8
    },
    bottomStyleContainer: {
        width: 264,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    bottomUiText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#222222',
        marginRight: 12,
        marginLeft: 12
    },
    bottomUitext1: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: color.red,
        marginRight: 12
    },
});

