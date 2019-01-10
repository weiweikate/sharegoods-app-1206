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
import StringUtils from '../../../../utils/StringUtils'

export default class RefuseReasonView extends React.Component {

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
        //type 0 显示退款金额  1 拒绝原因
        let { type, refundPrice, reject} = this.props;
        // StringUtils.formatMoneyString(this.state.pageData.totalRefundPrice)
        let text = reject;
        if (type === 0){
            text = StringUtils.formatMoneyString(refundPrice);
        }
        return (
            <View style={styles.container}>
                    <UIText value={['退款金额:', ''][type]}
                            style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
                    <UIText value={text}
                            style={{ color: type === 0 ? DesignRule.mainColor : DesignRule.textColor_mainTitle, fontSize: 13, marginLeft: 5 }}/>
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
    }
    });
