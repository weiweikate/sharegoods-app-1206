/**
 * huchao
 * 填写退货物流
 */
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    ScrollView
} from 'react-native';
import BasePage from '../../../BasePage';
import GoodsItem from '../components/GoodsGrayItem';
import {
    UIText,
    UIImage,
    MRTextInput as TextInput
} from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import EmptyUtils from '../../../utils/EmptyUtils';
import bridge from '../../../utils/bridge';
import OrderApi from '../api/orderApi';
import DesignRule from 'DesignRule';
import res from '../res';

const {
    afterSaleService: {
        sao_yi_sao
    },
    arrow_right
} = res;

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
            code: 0,
        };
        this._bindFunc();
    }

    _bindFunc() {
        this.selectLogisticsCompany = this.selectLogisticsCompany.bind(this);
        this.callBack = this.callBack.bind(this);
        this.submit = this.submit.bind(this);
    }

    $navigationBarOptions = {
        title: '填写退货物流',
        show: true// false则隐藏导航
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <GoodsItem
                        uri={this.state.pageData.specImg}
                        goodsName={this.state.pageData.productName}
                        salePrice={StringUtils.formatMoneyString(this.state.pageData.unitPrice)}
                        category={'规格：' + this.state.pageData.specValues}
                        goodsNum={this.state.pageData.quantity}
                        // onPress={() => this.jumpToProductDetailPage(this.state.pageData.list[this.state.index].productId)}
                    />
                    <TouchableWithoutFeedback onPress={this.selectLogisticsCompany}>
                        <View style={styles.item_container}>
                            <UIText style={styles.item_title}
                                    value={'物流公司'}/>
                            <UIText
                                style={this.state.logisticsCompanyName ? styles.item_detail : styles.item_placeholder}
                                value={this.state.logisticsCompanyName || '请选择物流公司'}/>
                            <UIImage source={arrow_right} style={{ height: 9, width: 9, marginRight: 20 }}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.item_container}>
                        <UIText style={styles.item_title}
                                value={'物流单号'}/>
                        <TextInput placeholder={'请填写物流单号'}
                                   style={styles.item_detail}
                                   onChangeText={(text) => {
                                       let reg = /^[0-9a-zA-Z]*$/;
                                       if(reg.test(text)) {
                                           this.setState({ logisticsNum: text });
                                       }
                                   }}
                                   value={this.state.logisticsNum}
                                   keyboardType={'number-pad'}
                        />
                        <TouchableWithoutFeedback onPress={this.scanQRCode.bind(this)}>
                            <UIImage source={sao_yi_sao} style={{ height: 22, width: 22, marginRight: 20 }}/>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
                <TouchableWithoutFeedback onPress={this.submit}>
                    <View style={{
                        backgroundColor: DesignRule.bgColor_btn,
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <UIText value={'提交'} style={{ color: 'white', fontSize: 16 }}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    /**
     * 选择物流公司
     */
    selectLogisticsCompany() {
        this.$navigate('order/afterSaleService/SelectLogisticsCompanyPage', { callBack: this.callBack });
    }

    scanQRCode() {
        let that = this;
        bridge.scanQRCode((logisticsNum) => {
            that.setState({ logisticsNum: logisticsNum });
        });
    }

    callBack(logisticsCompanyName, code) {
        this.setState({ logisticsCompanyName ,code});
    }

    submit() {
        if (EmptyUtils.isEmpty(this.state.logisticsCompanyName)) {
            this.$toastShow('请选择物流公司');
            return;
        }
        if (EmptyUtils.isEmpty(this.state.logisticsNum)) {
            this.$toastShow('请填写物流单号');
            return;
        }
        let parmas = {
            expressNo: this.state.logisticsNum,
            expressName: this.state.logisticsCompanyName,
            serviceNo: this.params.pageData.serviceNo,
            expressCode: this.state.code
        };
        this.$loadingShow();
        OrderApi.afterSaleFillExpress(parmas).then(result => {
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
            paddingBottom: ScreenUtils.safeBottom
        },
        item_container: {
            backgroundColor: 'white',
            flexDirection: 'row',
            height: 44,
            marginBottom: 10,
            alignItems: 'center'
        },
        item_title: {
            color: DesignRule.textColor_mainTitle,
            fontSize: 13,
            marginLeft: 17
        },
        item_detail: {
            color: DesignRule.textColor_mainTitle,
            fontSize: 13,
            marginRight: 9,
            textAlign: 'right',
            flex: 1
        },
        item_placeholder: {
            color: DesignRule.textColor_hint,
            fontSize: 13,
            marginRight: 9,
            textAlign: 'right',
            flex: 1
        }
    }
);
