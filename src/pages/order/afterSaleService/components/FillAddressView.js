/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/5/10.
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
  MRText
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';

export default class FillAddressView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
  }


  render() {
    return (
      <View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    bottomContainer: {

    },
    borderButton: {
        borderWidth: 0.5,
        borderColor: DesignRule.mainColor,
        borderRadius: 14,
        height: 28,
        width: 105,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: DesignRule.mainColor,
        fontSize: 12,
    }
});
