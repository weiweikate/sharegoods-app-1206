'use strict';
import React from 'react';
import RefreshAnimateHeader from './RefreshAnimateHeader';
import DesignRule from '../../../constants/DesignRule';
import {Platform} from 'react-native';

function ListHeaderLoading(props) {
  const { isRefreshing, onRefresh,styled, ...others } = props;
  const headerHeight = DesignRule.width/750*120;
  const source = Platform.OS !== 'ios' ?  require('./pull3.json') :  require('./pullnoline.json')
  return (
    <RefreshAnimateHeader
      refreshing={isRefreshing}
      headerHeight={headerHeight || 70}
      source={source}
      onRefresh={onRefresh}
      styled={styled}
      {...others}
    />
  );
}

ListHeaderLoading.defaultProps = {
  isRefreshing: false,
};

export default React.memo(ListHeaderLoading);
