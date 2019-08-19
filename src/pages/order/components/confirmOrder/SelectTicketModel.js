/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/4/19.
 *
 */


'use strict';

import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

import {
    MRText as Text,
} from '../../../../components/ui';
import CommModal from '../../../../comm/components/CommModal'
import user from '../../../../model/user';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res1 from '../../res'
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import CouponNormalItem from '../../../mine/components/CouponNormalItem';
import API from '../../../../api';
import bridge from '../../../../utils/bridge';
const emptyIcon = res1.empty_icon;
let {autoSizeWidth, safeBottom} = ScreenUtils

export default class SelectTicketModel extends React.Component {

    constructor(props) {
        super(props);
        this.parmas = {}
        this.state = {
            modalVisible: false,
        };
    }

    close = ()=>{
        this.setState({modalVisible: false});
    }

    open = (orderProducts = [], callBack) => {
        let arr = orderProducts.map((item, index) => {
            return {
                priceCode: item.skuCode,
                productCode: item.productCode,
                amount: item.quantity,
                activityCode: item.activityCode,
                batchNo: item.batchNo
            };
        });
        let  params = { productPriceIds: arr };
        this.parmas = { sgAppVersion: 310, ...params}
        this.callBack = callBack;
        this.setState({modalVisible: true});
    }

    renderItem = ({item, index}) => {
        item = {
            code: item.code,
            id: item.id,
            status: item.status,
            name: item.name,
            timeStr: item.couponTime,
            value: item.type === 3 ? '折' : ( item.type === 4 ? '抵' : (item.type === 5 ? '兑' : item.value)),
            limit: this.parseCoupon(item),
            couponConfigId: item.couponConfigId,
            remarks: item.remarks,
            type: item.type,
            levelimit: item.levels ? (item.levels.indexOf(user.levelId) !== -1 ? false : true) : false,
            count: item.count,
            canInvoke: item.canInvoke,
        }
        return (
            <View style={{alignItems: 'center'}}>
                <CouponNormalItem item={item} index={index} ticketClickItem={()=> {
                    if (item.canInvoke === true){
                        return;//未激活的优惠券
                    }
                    this.clickItem(item)
                }}
                                  onActivity = {() => {
                                      bridge.showLoading('');
                                      API.invokeCoupons({userCouponCode: item.code}).then((data) => {
                                          if (data.data){
                                              this.clickItem(data.data)
                                              bridge.$toast('激活成功')
                                          }else {
                                              bridge.$toast('激活失败')
                                          }
                                          bridge.hiddenLoading();
                                      }).catch((err) => {
                                          bridge.hiddenLoading();
                                      })
                                  }}
                />
            </View>)
    }

    clickItem = (item) => {
        this.close();
        this.callBack &&  this.callBack(item);
    }

    parseCoupon = (item) => {
        let products = item.products || [], cat1 = item.cat1 || [], cat2 = item.cat2 || [], cat3 = item.cat3 || [];
        let result = null;
        if(item.type === 5){
            return '限商品：限指定商品可用';
        }
        if (products.length) {
            if ((cat1.length || cat2.length || cat3.length)) {
                return '限商品：限指定商品可用';
            }
            if (products.length > 1) {
                return '限商品：限指定商品可用';
            }
            if (products.length === 1) {
                let productStr = products[0];
                if (productStr.length > 15) {
                    productStr = productStr.substring(0, 15) + '...';
                }
                return `限商品：限${productStr}商品可用`;
            }
        }
        else if ((cat1.length + cat2.length + cat3.length) === 1) {
            result = [...cat1, ...cat2, ...cat3];
            return `限品类：限${result[0]}品类可用`;
        }
        else if ((cat1.length + cat2.length + cat3.length) > 1) {
            return '限品类：限指定品类商品可用';
        } else {
            return '全品类：全场通用券（特殊商品除外）';
        }
    };

    render() {
        // if (this.state.modalVisible === false){
        //     return <View />
        // }
        return (
            <CommModal onRequestClose={this.close}
                       visible={this.state.modalVisible}
                       ref={(ref) => {
                           this.modal = ref;
                       }}
            >
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute'
                }}
                >
                    <TouchableOpacity style={{flex: 1}} onPress={()=>{this.close()}}/>
                    <View style={styles.bg}>
                        <View style={styles.header}>
                            <Text style={{
                                fontSize: DesignRule.fontSize_secondTitle,
                                color: DesignRule.textColor_secondTitle}}>
                                请选择优惠券
                            </Text>
                        </View>
                        <RefreshFlatList url={API.listAvailable}
                                         key={'RefreshFlatList+111'}
                                         style={{backgroundColor: DesignRule.bgColor}}
                                         paramsFunc={()=>{return this.parmas}}
                                         renderItem={this.renderItem}
                                         renderHeader={()=> <View style={{height: 20}}/>}
                                         renderEmpty={()=> {
                                             return(
                                                 <View style={{height: autoSizeWidth(480 - 95), alignItems: 'center', justifyContent: 'center'}}>
                                                     <Image source={emptyIcon} style={{height: autoSizeWidth(140), width: autoSizeWidth(244)}}/>
                                                     <Text style={{color: '#666666', fontSize: autoSizeWidth(13)}}>无可用券</Text>
                                                 </View>
                                             )
                                         }}
                        />
                        <View style={{height: autoSizeWidth(50) + safeBottom}}>
                            <TouchableOpacity style={[DesignRule.style_bigRedBorderBtn,{height: autoSizeWidth(40), borderColor: DesignRule.textColor_instruction,  borderRadius: autoSizeWidth(20),}]}
                                              onPress={()=>{this.close(); this.callBack && this.callBack('giveUp')}}
                            >
                                <Text style={[DesignRule.style_btnWhiteText, {color: DesignRule.textColor_instruction}]}>不使用优惠券</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </CommModal>
        );
    }
}
const styles = StyleSheet.create({
    bg: {
        height: autoSizeWidth(480) + safeBottom,
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    header: {
        alignItems: 'center',
        height: autoSizeWidth(45),
        justifyContent: 'center'
    },
    detail: {
        marginTop: autoSizeWidth(5),
        fontSize: autoSizeWidth(11),
        color: DesignRule.textColor_instruction
    }
});
