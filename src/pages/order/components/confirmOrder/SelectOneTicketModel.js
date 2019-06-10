/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/4/17.
 *
 */


'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';

import {
    MRText as Text,
} from '../../../../components/ui';
import CommModal from '../../../../comm/components/CommModal'
import orderApi from '../../api/orderApi'
import bridge from '../../../../utils/bridge';
import user from '../../../../model/user';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../../mine/res'
import res1 from '../../res'
const unUsedBgex = res.couponsImg.youhuiquan_bg_unUsedBg;
const emptyIcon = res1.empty_icon;
let {autoSizeWidth, safeBottom} = ScreenUtils
export default class SelectOneTicketModel extends React.Component {

    constructor(props) {
        super(props);
        this.orderAmount = 0;
        this.state = {
            modalVisible: false,
            num: 0,
            max:0,
            tokenCoin: user.tokenCoin  //优惠券数量
        };
    }

    close = ()=>{
        this.setState({modalVisible: false});
    }

    open = (orderAmount, callBack) => {
        this.callBack = callBack;
        this.setState({modalVisible: true});
        this.orderAmount = orderAmount;
        this._getnum(this.state.tokenCoin, orderAmount);
        orderApi.getUser({}).then((data)=> {
            if (data && data.tokenCoin) {
                this.tokenCoin = parseInt(data.tokenCoin);
                this._getnum(data.tokenCoin, this.orderAmount);
            }
        }).catch((err)=> {
            bridge.$toast(err.msg);
        })
    }

    _select= ()=> {
        this.close();
        let {tokenCoin, num} = this.state;
        if (tokenCoin > 0) {
            this.callBack && this.callBack(num)
        }
    }

    _getnum = (tokenCoin, orderAmount) => {
        if (orderAmount > tokenCoin) {
            this.setState({num: parseInt(tokenCoin), max: parseInt(tokenCoin), tokenCoin});
        }else {
            this.setState({num: parseInt(orderAmount), max: parseInt(orderAmount), tokenCoin});
        }
    }

    componentDidMount() {
    }

    _renderItem = () => {
        if (this.state.tokenCoin > 0){
            return(
                <View style={{flex: 1, alignItems: 'center'}}>
                    <ImageBackground source={unUsedBgex}
                                     style={{width: autoSizeWidth(345),
                                         height: autoSizeWidth(94),
                                         top: autoSizeWidth(10),
                                     alignItems: 'center',
                                     flexDirection: 'row'}}>
                        <Text style={{
                            color: DesignRule.mainColor,
                            fontSize: autoSizeWidth(14),
                            marginLeft: autoSizeWidth(26)
                        }}>
                            ¥
                            <Text style={{fontWeight: '600',
                                color: DesignRule.mainColor,
                            fontSize: DesignRule.autoSizeWidth(20)}}>
                                1
                            </Text>
                        </Text>
                        <View style={{flex: 1, marginLeft: autoSizeWidth(30)}}>
                            <Text style={{color: '#222222', fontSize: autoSizeWidth(13)}}>
                                1元现金券
                                <Text style={styles.detail}>
                                    （可叠加使用）
                                </Text>
                            </Text>
                            <Text style={styles.detail}>
                                无时间限制
                            </Text>
                            <Text style={styles.detail}>
                                全品类：无金额门槛
                            </Text>
                        </View>
                        <Text style={{
                            marginRight: autoSizeWidth(15),
                            fontSize: autoSizeWidth(13),
                            color: '#333333'}}>
                            {'x' + this.state.tokenCoin}
                        </Text>
                    </ImageBackground>
                    <View style={{marginTop: autoSizeWidth(20), alignItems: 'center', flexDirection: 'row' , width: autoSizeWidth(345)}}>
                        <Text style={{fontSize: autoSizeWidth(13), color: '#666666'}}>请选择券数</Text>
                        <View style={{flex: 1}}/>
                        <View style={{borderRadius: 5, borderColor: '#E4E4E4', borderWidth: 1, width: autoSizeWidth(105), height: autoSizeWidth(30),flexDirection: 'row'}}>
                            <TouchableOpacity style={{flex: 3, alignItems: 'center', justifyContent: 'center',borderRightColor: '#E4E4E4', borderRightWidth: 1}}
                                              disabled={this.state.num <= 0 }
                                              onPress={()=>{this.setState({num: this.state.num - 1})}}
                            >
                                <Text style={{
                                    fontSize: autoSizeWidth(15),
                                    color: this.state.num <= 0 ? '#CCCCCC' : '#666666'}}>
                                   -
                                </Text>
                            </TouchableOpacity>
                            <View style={{flex: 4, alignItems: 'center', justifyContent: 'center'}} >
                                <Text style={{
                                    fontSize: autoSizeWidth(15),
                                    color: '#666666'}}>
                                    {this.state.num}
                                </Text>
                            </View>
                            <TouchableOpacity style={{flex: 3, alignItems: 'center', justifyContent: 'center',borderLeftColor: '#E4E4E4', borderLeftWidth: 1}}
                                              disabled={this.state.num >= this.state.max}
                                              onPress={()=>{this.setState({num: this.state.num + 1})}}
                            >
                                <Text style={{
                                    fontSize: autoSizeWidth(15),
                                    color: this.state.num >= this.state.max ? '#CCCCCC' : '#666666'}}>
                                    +
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )

        } else {
            return(
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={emptyIcon} style={{height: autoSizeWidth(140), width: autoSizeWidth(244)}}/>
                    <Text style={{color: '#666666', fontSize: autoSizeWidth(13)}}>无可用券</Text>
                </View>
            )

        }
    }
    // name: '1元现金券',
    // timeStr: '无时间限制',
    // value: 1,
    // limit: '全品类：无金额门槛',
    // remarks: '1.全场均可使用此优惠券\n2.礼包优惠券在激活有效期内可以购买指定商品',

    render() {
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
                                选择一元现金券
                            </Text>
                        </View>
                        <View style={{flex: 1, backgroundColor: DesignRule.bgColor}}>
                            {this._renderItem()}
                        </View>
                        <View style={{height: autoSizeWidth(50) + safeBottom}}>
                            <TouchableOpacity style={[DesignRule.style_bigRedRadiusBtn,{height: autoSizeWidth(40)}]}
                                              onPress={()=>this._select()}
                            >
                                <Text style={DesignRule.style_btnWhiteText}>确认</Text>
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
        height: autoSizeWidth(350) + safeBottom,
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
