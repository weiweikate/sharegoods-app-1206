'use strict';
import React from 'react';
import RefreshAnimateHeader from './RefreshAnimateHeader';

function ListHeaderLoading(props) {
  const { isRefreshing, onRefresh,source,headerHeight, ...others } = props;

  return (
    <RefreshAnimateHeader
      refreshing={isRefreshing}
      headerHeight={headerHeight || 60}
      source={source || require('./pull2.json')}
      onRefresh={onRefresh}
      {...others}
    />
  );
}

ListHeaderLoading.defaultProps = {
  isRefreshing: false,
};

export default React.memo(ListHeaderLoading);
