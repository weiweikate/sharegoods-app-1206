/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/12/17.
 *
 */
'use strict';

import React, { Component } from 'react';

import {
    requireNativeComponent
} from 'react-native';

const Cell = requireNativeComponent('ShopCartCell');


export default class MRShopCartCell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isBeginAnimation:false
        }
    }
    componentDidMount() {
        this.setState({
            isBeginAnimation:true
        })
    }
    render() {
        return (
          <Cell
              {...this.props}
              isBeginAnimation={this.state.isBeginAnimation}
          />
        );
    }
}

// const styles = StyleSheet.create({});
