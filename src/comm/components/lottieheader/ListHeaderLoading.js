'use strict';
import React from 'react';
import RefreshAnimateHeader from './RefreshAnimateHeader';
import { Platform } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';

function ListHeaderLoading(props) {
    const { isRefreshing, onRefresh , ...others } = props;
    const headerHeight = ScreenUtils.autoSizeWidth(100);
    return (
        <RefreshAnimateHeader
            refreshing={isRefreshing}
            headerHeight={headerHeight}
            onRefresh={onRefresh}
            {...others}
        />
    );
}

ListHeaderLoading.defaultProps = {
    isRefreshing: false,
    source: Platform.OS !== 'ios' ? require('./pull3.json') : require('./pullnoline.json')
};

export default React.memo(ListHeaderLoading);
