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
    View
} from 'react-native';

import {
    UIText,
} from '../../../../components/ui';
import DesignRule from 'DesignRule';
import AddressItem from '../../components/AddressItem';

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
        return (
            <View style={styles.container}>
                <View style={styles.borderContainer}>
                    <UIText value={'寄回\n地址'} style={{ fontSize: 12, color: DesignRule.mainColor }}/>
                </View>
                <View style={{ backgroundColor: DesignRule.lineColor_inColorBg, width: 1, height: 40, marginLeft: 10}}/>
                <AddressItem height={82}
                             style={{
                                 flex: 1,
                                 flexDirection: 'row',
                                 justifyContent: 'space-between',
                                 alignItems: 'center',
                                 backgroundColor: 'white'
                             }}
                             name={'收货人：' + '1111'}
                             phone={'phone'}
                             address={'address'}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 82,
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 10
    },
    borderContainer: {
        width: 43,
        height: 36,
        borderColor: DesignRule.mainColor,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16
    }
});
