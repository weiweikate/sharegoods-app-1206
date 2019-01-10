/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/12/18.
 *
 */

'use strict';

import React from 'react';

import {
    View
} from 'react-native';

import {
    UIText,
} from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';

export default class ShopCartNavHeaderView extends React.Component {

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
            <View
                style={{
                    backgroundColor: DesignRule.mainColor,
                    height: 100,
                    width: ScreenUtils.width,
                    justifyContent:'center',
                    alignItems:'center'
                }}
            >
                <UIText
                    value={'购物车'}
                    style={{
                        fontSize: 25,
                        color: '#fff',
                        marginTop:20
                    }}
                />

            </View>
        );
    }
}

// const styles = StyleSheet.create({});
