'use strict';
import React from 'react';
import RefreshAnimateHeader from './RefreshAnimateHeader';
import { Platform } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';

function ListHeaderLoading(props) {
    const { isRefreshing, onRefresh, ...others } = props;
    const headerHeight = ScreenUtils.autoSizeWidth(90);
    const source = Platform.OS !== 'ios' ? require('./pull3.json') : require('./pullnoline.json');
    return (
        <RefreshAnimateHeader
            refreshing={isRefreshing}
            headerHeight={headerHeight}
            source={source}
            onRefresh={onRefresh}
            {...others}
        />
    );
}

ListHeaderLoading.defaultProps = {
    isRefreshing: false
};

export default React.memo(ListHeaderLoading);
