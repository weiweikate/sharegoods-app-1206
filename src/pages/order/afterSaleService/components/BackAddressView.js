/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/29.
 * 寄回地址组件
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import {
    UIText
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';

export default class BackAddressView extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
    }

    _bind() {

    }

    componentDidMount() {
    }


    render() {
        let {title,onPress, data} = this.props;
        let {receiverPhone, receiver, receiverAddress, express, expressNo, expressCode, expressName} = data || {}
        let detailAddress =   receiverAddress
            '；收件人：' + receiver + '联系方式：' + receiverPhone;
        let manyLogistics = express && express.length > 1;
        if (express && express.length > 0) {
            expressNo = express[0].expressNo;
            expressCode = express[0].expressCode;
            expressName = express[0].expressName;
        }
        let detail_num = null;
        let detail_company = '';
        if (manyLogistics){
            detail_num = '该订单被拆成'+ express.length +'个包裹发出，点击“查看物流信息”查看详情'
        } else {
                detail_num = '物流单号：'+expressNo
                detail_company = '物流公司：'+expressName
        }
        return (
            <View style={styles.container}>
                <View style = {styles.titleContainer}>
                <UIText value={title} style={styles.title}/>
                </View>
                <View style={styles.detailContainer}>
                  <UIText value={detail_num} style={styles.detail}/>
                    {detail_company? <UIText value={detail_company} style={styles.detail}/> : null}
                    <View style={{marginTop: 5, flexDirection: 'row'}}>
                        <UIText value={'寄回信息：'} style={styles.title}/>
                        <View style={{flex: 1, marginRight: 15}}>
                            <UIText value={detailAddress} style={[styles.title,{marginLeft: 0}]}/>
                        </View>
                    </View>
                </View>
                <View style={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={()=> {onPress(expressNo, expressCode, manyLogistics)}}
                                      style={styles.borderButton}>
                        <UIText value={'查看物流信息'}
                                style={{
                                    fontSize: 12,
                                    color: DesignRule.textColor_instruction
                                }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: 10
    },
    title: {
        marginLeft: 15,
        color: DesignRule.textColor_mainTitle,
        fontSize: 13
    },
    titleContainer: {
        height: 40,
        justifyContent: 'center'
    },
    detailContainer: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: DesignRule.bgColor
    },
    detail: {
        marginLeft: 15,
        color: DesignRule.textColor_mainTitle,
        fontSize: 13,
        marginTop: 5,
    },
    borderButton: {
        borderWidth: 0.5,
        borderColor: '#CCCCCC',
        borderRadius: 14,
        height: 28,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }

});
