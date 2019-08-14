/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/8/13.
 *
 */


'use strict';

import React from 'react';

import {
    View,
    RefreshControl
} from 'react-native';

import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { homeType } from '../HomeTypes';
import { ImageAdViewGetHeight, TopicImageAdView } from './ImageAdView';
import GoodsCustomView, { GoodsCustomViewGetHeight } from './GoodsCustomView';
import HomeAPI from '../api/HomeAPI';
import TextCustomView from './TextCustomView';
import LoadMoreDataUtil from '../../../utils/LoadMoreDataUtil';
import { DefaultLoadMoreComponent } from '../../../comm/components/RefreshFlatList';
import { observer } from 'mobx-react';
@observer
export default class DIYTopicList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.loadMoreDataUtil = new LoadMoreDataUtil()
        this.loadMoreDataUtil.API = HomeAPI.getCustomTopic;
        this.loadMoreDataUtil.paramsFunc = () => {return{topicCode: 'ZDYZT201908131856401'}};
        this.loadMoreDataUtil.handleData = (data) => {
            data = data.data.widgets.data || []

            return    data.map((item, index) => {
                // item.buyButtonType = 1;
                // item.buyButtonVisible = false
                // item.titleVisible = false;
                // item.commissionVisible = false
                // item.subtitleVisible = false;
                // item.priceVisible = false;
                // item.priceNameVisible = false;
                // item.priceHasInvalidVisible = false;
                if (item.type === homeType.custom_goods){
                    item.itemHeight = GoodsCustomViewGetHeight(item)
                }

                if (item.type === homeType.custom_imgAD){
                    item.itemHeight = ImageAdViewGetHeight(item)
                }

                return item
            })
        } ;
        this.loadMoreDataUtil.isMoreFunc = (data) => {return data.data.widgets.isMore}
    }
    dataProvider = new DataProvider((r1, r2) => {
        return r1 !== r2;
    });

    layoutProvider = new LayoutProvider((i) => {
        return this.dataProvider.getDataForIndex(i) || {};
    }, (type, dim) => {
        dim.width = ScreenUtils.width;
        switch (type.type) {
           case homeType.custom_goods:
            case homeType.custom_imgAD:
               dim.height = type.itemHeight;
                break;
            case homeType.custom_text:
                dim.height = 1;
                break;
            default:
                dim.height = 0;
        }
    });

    _keyExtractor = (item, index) => index + item.type;

    _renderItem = (type, item, index) => {
        type = type.type
        if (type === homeType.custom_text) {
            return <TextCustomView data={item}/>;
        } else if (type === homeType.custom_imgAD) {
            return <TopicImageAdView data={item}/>;
        } else if (type === homeType.custom_goods) {
            return <GoodsCustomView data={item}/>;
        }
        return <View/>;
    };


    componentDidMount() {
        this.loadMoreDataUtil.onRefresh();
    }

    render() {
        this.dataProvider = this.dataProvider.cloneWithRows(this.loadMoreDataUtil.data);
        return (
            <RecyclerListView
                ref={(ref) => {
                    this.recyclerListView = ref;
                }}
                style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1, marginTop: 40}}
                refreshControl={<RefreshControl refreshing={this.loadMoreDataUtil.refreshing}
                                                onRefresh={this.loadMoreDataUtil.onRefresh}
                                                colors={[DesignRule.mainColor]}/>}
                onEndReached={this.loadMoreDataUtil.getMoreData.bind(this)}
                onEndReachedThreshold={ScreenUtils.height / 3}
                dataProvider={this.dataProvider}
                rowRenderer={this._renderItem.bind(this)}
                layoutProvider={this.layoutProvider}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                canChangeSize={false}
                forceNonDeterministicRendering={true}
                renderFooter={() => <DefaultLoadMoreComponent status={this.loadMoreDataUtil.footerStatus}/>
                }
            />
        );
    }
}

