/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/29.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

import {
    UIText,

} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import {AfterStatus, SubStatus, PageType} from '../AfterType'
const {
    IN_REVIEW, //待审核
    SEND_BACK, //待寄回
    WAREHOUSE_CONFIRMED, //待仓库确认
    PLATFORM_PROCESSING, //待平台处理
    FINISH,//售后完成
    FAIL
} = AfterStatus;
const {
    REVOKED,
    OVERTIME,
    REFUSE_APPLY,//拒绝售后申请
    REFUSE_AFTER
} = SubStatus;


const {
    AREFUND,
    SALES_RETURN,
    EXCHANGE
} = PageType;

export default class StatusInfoView extends React.Component {

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

        let { status, pageType, remarks, subStatus} = this.props;
        let titleStr = null;
        let detialStr = null;
        let remarkStr = null;
        
        if (pageType === AREFUND) {
            if (status === ) 
            
        }else if (pageType === SALES_RETURN) {
            
        }else if (pageType === EXCHANGE) {

        }

        return (
            <View style={styles.container}>
                    <UIText value={titleStr}
                            style={styles.title}/>
                {
                    detialStr?<UIText value={detialStr}
                                      style={styles.detail}/>: null
                }
                {
                    remarkStr?<UIText value={remarkStr}
                                      style={styles.detail}/>: null
                }
                    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 44,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 10
    },
    title:{
        color: DesignRule.textColor_mainTitle,
        fontSize: 13
    },
    detail:{
        color: DesignRule.textColor_mainTitle,
        fontSize: 13, marginLeft: 5
    }

    });
