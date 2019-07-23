import React from 'react';
import BasePage from '../../BasePage';
import EmptyView from '../../components/pageDecorator/BaseView/EmptyView';
import res from './res/product';
import ScreenUtils from '../../utils/ScreenUtils';

export default class ProductDeletePage extends BasePage {
    $navigationBarOptions = {
        title: '商品详情'
    };

    _render() {
        return <EmptyView source={res.productDelete} description={'商品已删除'}
                          imageStyle={{ width: ScreenUtils.px2dp(244), height: ScreenUtils.px2dp(140) }}/>;
    }
}
