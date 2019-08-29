/**
 * Created by chenweiwei on 2019/8/29.
 */
import React from 'react';
import {View} from 'react-native';
import { DefaultLoadMoreComponent } from '../../../comm/components/RefreshFlatList';
export default class HelperLoadMoreComponent extends DefaultLoadMoreComponent {
    renderLoadCompleted() {
        return (
            <View/>
        );
    }
}
