/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2019/3/14.
 *
 */

'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';
import res from './res'
import { NavigationActions } from 'react-navigation';
import ScreenUtils from '../../utils/ScreenUtils';
import { MRText as Text } from '../../components/ui';

const {autoSizeWidth} = ScreenUtils;
const {
    pay_result_loading,
    pay_result_success,
    pay_result_fail,
    pay_result_timeout
} = res

export const PaymentResult = {
    loading: 0,
    success: 1,
    fail: 2,
    timeout: 3,
};
export default class PaymentResultPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            payResult: this.params.payResult,
            payMsg: this.params.payMsg
        };
    }

    $navigationBarOptions = {
        title: '订单支付',
        show: true// false则隐藏导航
    };

    /** 去订单列表*/
    goToOrder = () => {
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            routeName: 'order/order/MyOrdersListPage',
            params: { index: 2 }
        });
        this.props.navigation.dispatch(replace);
    }

    /** 重新支付*/
    payAgain = () => {
        this.props.navigation.goBack()
    }

    renderContent=() =>{
        const { payResult } = this.state;
        switch (payResult) {
            /** 请求中*/
            case PaymentResult.loading:{
                return(
                    <View style={styles.content}>
                        <Image source={pay_result_loading} style={{
                            height: autoSizeWidth(50),
                            width: autoSizeWidth(50),
                            marginTop: autoSizeWidth(100),}}/>
                        <Text style={[styles.detail_99, {marginTop: autoSizeWidth(20)}]}>支付返回结果等待中...</Text>
                        <View style={{flex: 1}}/>
                        <Text style={{marginBottom: autoSizeWidth(10), color: DesignRule.mainColor, fontSize: DesignRule.fontSize_threeTitle}}>温馨提示</Text>
                        <Text style={[styles.detail_99, {marginBottom: autoSizeWidth(160)}]}>返回结果前，请不要重新支付</Text>
                    </View>
                )
            }
            /** 成功*/
            case PaymentResult.success:{
                this.$NavigationBarResetTitle('订单完成')
                return(
                    <View style={styles.content}>
                        <Image source={pay_result_success} style={styles.image}/>
                        <Text style={styles.title}>支付成功</Text>
                        <View style={{marginTop: autoSizeWidth(50), flexDirection: 'row'}}>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity style={styles.gary_border} onPress={()=> {this.$navigateBackToHome()}}>
                                <Text style={styles.gary_btn_text}>返回首页</Text>
                            </TouchableOpacity>
                            <View style={{width: 20}}/>
                            <TouchableOpacity style={styles.red_border} onPress={()=> {this.goToOrder()}}>
                                <Text style={styles.red_btn_text}>查看订单</Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                )
            }
            /** 失败*/
            case PaymentResult.fail:{
                return(
                    <View style={styles.content}>
                        <Image source={pay_result_fail} style={styles.image}/>
                        <Text style={styles.title}>支付失败</Text>
                        <Text style={[styles.detail_66,{marginTop:autoSizeWidth(10)}]}>{`原因: ${this.state.payMsg}`}</Text>
                        <View style={{marginTop: autoSizeWidth(50), flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.red_border} onPress={()=> {this.payAgain()}}>
                                <Text style={styles.red_btn_text}>重新支付</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
            /** 超时*/
            case PaymentResult.timeout:{
                return(
                    <View style={styles.content}>
                        <Image source={pay_result_timeout} style={styles.image}/>
                        <Text style={styles.detail_33}>订单支付超时，下单金额已原路返回</Text>
                        <View style={{marginTop: autoSizeWidth(50), flexDirection: 'row'}}>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity style={styles.gary_border} onPress={()=> {this.$navigateBackToHome()}}>
                                <Text style={styles.gary_btn_text}>返回首页</Text>
                            </TouchableOpacity>
                            <View style={{width: 20}}/>
                            <TouchableOpacity style={styles.red_border} onPress={()=> {this.goToOrder()}}>
                                <Text style={styles.red_btn_text}>查看订单</Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                )
            }

            default:
                return <View />

        }

    }

    _render() {
        return (
            <View style={DesignRule.style_container}>
                {this.renderContent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center'
    },
    image: {
        height: autoSizeWidth(100),
        width: autoSizeWidth(100),
        marginTop: autoSizeWidth(67),
    },
    title: {
        marginTop: autoSizeWidth(10),
        fontSize: DesignRule.fontSize_48,
        color: DesignRule.textColor_mainTitle
    },
    detail_33:{
        marginTop: autoSizeWidth(10),
        fontSize: DesignRule.fontSize_threeTitle,
        color: DesignRule.textColor_mainTitle,
    },
    detail_66:{
        fontSize: DesignRule.fontSize_threeTitle,
        color: DesignRule.textColor_instruction,
    },
    detail_99:{
        fontSize: DesignRule.fontSize_threeTitle,
        color: DesignRule.textColor_placeholder,
    },
    gary_btn_text: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.fontSize_secondTitle,
    },
    gary_border: {
        borderWidth: DesignRule.lineHeight,
        borderRadius: autoSizeWidth(17),
        borderColor: '#CCCCCC',
        height: autoSizeWidth(34),
        width: autoSizeWidth(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    red_btn_text: {
        color: DesignRule.mainColor,
        fontSize: DesignRule.fontSize_secondTitle,
    },
    red_border: {
        borderWidth: DesignRule.lineHeight,
        borderRadius: autoSizeWidth(17),
        borderColor: DesignRule.mainColor,
        height: autoSizeWidth(34),
        width: autoSizeWidth(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
});
