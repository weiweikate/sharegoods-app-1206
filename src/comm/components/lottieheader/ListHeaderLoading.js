'use strict';
import React from 'react';
import RefreshAnimateHeader from './RefreshAnimateHeader';

function ListHeaderLoading(props) {
  const { isRefreshing, onRefresh,source, ...others } = props;

  return (
    <RefreshAnimateHeader
      refreshing={isRefreshing}
      headerHeight={30}
      source={source || require('./lottie1.json')}
      onRefresh={onRefresh}
      {...others}
    />
  );
}

// ListHeaderLoading.propTypes = {
//   isRefreshing: PropTypes.bool,
//   onRefresh: PropTypes.func,
//   colors: PropTypes.array,
//   progressBackgroundColor: PropTypes.string,
//   size: PropTypes.any,
//   tintColor: PropTypes.string,
//   title: PropTypes.string,
//   progressViewOffset: PropTypes.number,
// };

ListHeaderLoading.defaultProps = {
  isRefreshing: false,
};

export default React.memo(ListHeaderLoading);
