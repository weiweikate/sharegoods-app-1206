/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/11/27.
 *
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import {UIText} from  '../../../../components/ui'
import DesignRule from '../../../../constants/DesignRule';

export default class TipView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let tip = null;
        let { pageType, status } = this.props;
        if (pageType === 0) {//退款详情

        } else if (pageType === 1) {//退货详情

            if (status === 2) {//同意申请
                tip = '商家已同意换货申请，请尽早发货';
            } else if (status === 8) {//超时关闭
                tip = '已撤销退货退款申请，申请已关闭，交易将正常进行，请关注交易';
            }

        } else if (pageType === 2) {//换货详情
            if (status === 2) {//同意申请
                tip = '商家已同意换货申请，请尽早发货';
            }
        }
        if (tip) {
            return (
                <View
                    style={styles.container}>
                    <UIText value={tip} style={styles.tip}/>
                </View>
            );
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: 20,
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tip: {
        fontSize: 13,
        color: 'white'
    }
});
