'use strict';
import React from 'react';
import RefreshAnimateHeader from './RefreshAnimateHeader';
import DesignRule from '../../../constants/DesignRule';

function ListHeaderLoading(props) {
  const { isRefreshing, onRefresh,source, ...others } = props;
  const headerHeight = DesignRule.width/750*120;

  return (
    <RefreshAnimateHeader
      refreshing={isRefreshing}
      headerHeight={headerHeight || 70}
      source={source || require('./pull3.json')}
      onRefresh={onRefresh}
      {...others}
    />
  );
}

ListHeaderLoading.defaultProps = {
  isRefreshing: false,
};

export default React.memo(ListHeaderLoading);
