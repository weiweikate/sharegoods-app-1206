/**
 * huchao
 * 填写退货物流
 */
import React from 'react'
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    TextInput,
    DeviceEventEmitter,
    ScrollView
} from 'react-native';
import BasePage from '../../../BasePage';
import GoodsItem from '../components/GoodsGrayItem';
import arrow_right from '../res/arrow_right.png';
import wuxiu_btn_saoma_nor from '../res/wuxiu_btn_saoma_nor.png';
import {
    UIText, UIImage
} from '../../../components/ui';
import StringUtils from "../../../utils/StringUtils";
import EmptyUtils from '../../../utils/EmptyUtils';
import bridge from '../../../utils/bridge';
import OrderApi from '../api/orderApi'
import DesignRule from 'DesignRule';

export default class FillReturnLogisticsPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            //商品、订单等信息
            pageData: this.params.pageData || {},
            //物流公司名称
            logisticsCompanyName: null,
            //物流单号
            logisticsNum: '',
        }
        this._bindFunc();
    }

    _bindFunc(){
        this.selectLogisticsCompany = this.selectLogisticsCompany.bind(this);
        this.callBack = this.callBack.bind(this);
        this.submit = this.submit.bind(this);
    }

    $navigationBarOptions = {
        title: '填写退货物流',
        show: true// false则隐藏导航
    };

    _render() {
        return(
            <View style = {styles.container}>
                <ScrollView>
                    <GoodsItem
                        uri={this.state.pageData.specImg}
                        goodsName={this.state.pageData.productName}
                        salePrice={StringUtils.formatMoneyString(this.state.pageData.price)}
                        category={this.state.pageData.spec}
                        goodsNum={this.state.pageData.num}
                        // onPress={() => this.jumpToProductDetailPage(this.state.pageData.list[this.state.index].productId)}
                    />
                    <TouchableWithoutFeedback onPress = {this.selectLogisticsCompany}>
                        <View style = {styles.item_container}>
                            <UIText style = {styles.item_title}
                                    value = {'物流公司'}/>
                            <UIText style = {this.state.logisticsCompanyName ? styles.item_detail : styles.item_placeholder}
                                    value = {this.state.logisticsCompanyName || '请选择物流公司'}/>
                            <UIImage source={arrow_right} style = {{height: 9, width: 9, marginRight: 20}}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style = {styles.item_container}>
                        <UIText style = {styles.item_title}
                                value = {'物流单号'}/>
                        <TextInput underlineColorAndroid = {'transparent'}
                                   placeholder = {'请填写物流单号'}
                                   style = {styles.item_detail}
                                   onChangeText = {(text) => {this.setState({logisticsNum: text})}}
                                   value = {this.state.logisticsNum}
                                   keyboardType = {'number-pad'}
                        />
                        <TouchableWithoutFeedback onPress = {this.scanQRCode.bind(this)}>
                        <UIImage source={wuxiu_btn_saoma_nor} style = {{height: 22, width: 22, marginRight: 20}}/>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
                <TouchableWithoutFeedback onPress = {this.submit}>
                    <View style = {{backgroundColor: '#D51243', height: 50, alignItems: 'center', justifyContent: 'center'}}>
                        <UIText value = {'提交'} style = {{color: 'white', fontSize: 16}}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    /**
     * 选择物流公司
     */
    selectLogisticsCompany(){
        this.$navigate('order/afterSaleService/SelectLogisticsCompanyPage',{callBack: this.callBack});
    }

    scanQRCode(){
        let that = this;
       bridge.scanQRCode((logisticsNum) => {
           that.setState({logisticsNum: logisticsNum});
       })
    }

    callBack(logisticsCompanyName, logisticsNum){
        this.setState({logisticsCompanyName, logisticsNum})
    }

    submit(){
        if (EmptyUtils.isEmpty(this.state.logisticsCompanyName)){
            this.$toastShow('请选择物流公司')
            return;
        }
        if (EmptyUtils.isEmpty(this.state.logisticsNum)){
            this.$toastShow('请填写物流单号')
            return;
        }
        let returnAddress = this.params.pageData.returnAddress || {}
        let {receiver, recevicePhone, provinceName, cityName, areaName, address} = returnAddress;
        let parmas = {
            expressNo: this.state.logisticsNum,
            expressName: this.state.logisticsCompanyName,
            id: this.params.pageData.id,
            backAddress: provinceName + cityName + areaName + address,
            backPhone: recevicePhone,
            backReceiver: receiver,
        };
        this.$loadingShow();
        OrderApi.fillSendInfo(parmas).then(result => {
            this.$loadingDismiss();
            DeviceEventEmitter.emit('OrderNeedRefresh');
            this.params.callBack && this.params.callBack();//刷新售后详情页面
            this.$navigateBack();
        }).catch(error => {
            this.$loadingDismiss();
            this.$toastShow(error.msg || '操作失败，请重试');
        });
    }




}



const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: DesignRule.bgColor,
        },
        item_container: {
            backgroundColor: 'white',
            flexDirection: 'row',
            height: 44,
            marginBottom: 10,
            alignItems: 'center',
        },
        item_title:{
            color: DesignRule.textColor_mainTitle,
            fontSize: 13,
            marginLeft: 17,
        },
        item_detail:{
            color: DesignRule.textColor_mainTitle,
            fontSize: 13,
            marginRight: 9,
            textAlign: 'right',
            flex: 1,
        },
        item_placeholder:{
            color: '#C8C8C8',
            fontSize: 13,
            marginRight: 9,
            textAlign: 'right',
            flex: 1,
        }
    }
);
