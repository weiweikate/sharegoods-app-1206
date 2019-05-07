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
        let {cancelPress} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <UIText value={'您的售后申请正在等待审核'}
                            style={{
                                color: DesignRule.textColor_mainTitle,
                                fontSize: 15,
                                marginLeft: 15
                            }}/>
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={cancelPress}
                                      style={styles.borderButton}>
                        <UIText value={'撤销申请'}
                                style={{
                                    fontSize: 12,
                                    color: DesignRule.mainColor
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
        height: 95,
        marginBottom: 10
    },
    title: {
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: DesignRule.lineColor_inWhiteBg,
        justifyContent: 'center'
    },
    borderButton: {
        borderWidth: 0.5,
        borderColor: DesignRule.mainColor,
        borderRadius: 12.5,
        height: 25,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
