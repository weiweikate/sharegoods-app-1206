/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/27.
 *
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

export default class OperationApplyView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        let { pageType, cancelPress, changePress } = this.props;
        let typeStr = ['退款', '退货', '换货'][pageType];
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <UIText value={'您已成功发起' + typeStr + '申请，请耐心等待商家处理'}
                            style={{
                                color: DesignRule.textColor_mainTitle,
                                fontSize: 15,
                                marginLeft: 15
                            }}/>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={cancelPress}
                                      style={[
                                          styles.borderButton,
                                          { borderColor: DesignRule.textColor_secondTitle }]}>
                        <UIText value={'撤销申请'}
                                style={{
                                    fontSize: 16,
                                    color: DesignRule.textColor_secondTitle
                                }}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={changePress}
                                      style={styles.borderButton}>
                        <UIText value={'修改申请'}
                                style={{
                                    fontSize: 16,
                                    color: DesignRule.bgColor_btn
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
        height: 110,
        marginBottom: 10,
    },
    title: {
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: DesignRule.lineColor_inGrayBg,
        justifyContent: 'center'
    },
    borderButton: {
        borderWidth: 1,
        borderColor: DesignRule.mainColor,
        borderRadius: 5,
        height: 30,
        width: 83,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
