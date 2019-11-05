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

import { View } from 'react-native';

import ScreenUtils from '../../../../utils/ScreenUtils';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { asyncHandleTopicData, homeType } from '../../HomeTypes';
import { TopicImageAdView } from '../TopicImageAdView';
import GoodsCustomView from '../GoodsCustomView';
import HomeAPI from '../../api/HomeAPI';
import TextCustomView from '../TextCustomView';
import LoadMoreDataUtil from '../../../../utils/LoadMoreDataUtil';
import { DefaultLoadMoreComponent } from '../../../../comm/components/RefreshFlatList';
import { observer } from 'mobx-react';
import { tabModel } from '../../model/HomeTabModel';
import HeaderLoading from '../../../../comm/components/lottieheader/ListHeaderLoading';
import DesignRule from '../../../../constants/DesignRule';

@observer
export default class DIYTopicList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.loadMoreDataUtil = new LoadMoreDataUtil();
        this.loadMoreDataUtil.API = HomeAPI.getCustomTopic;
        this.code = (this.props.data || {}).linkCode;
        this.loadMoreDataUtil.paramsFunc = () => {
            return { topicCode: this.code };
        };
        this.loadMoreDataUtil.asyncHandleData = asyncHandleTopicData;
        this.loadMoreDataUtil.isMoreFunc = (data) => {
            return data.data.widgets.isMore;
        };
    }

    componentDidMount() {
        this.loadMoreDataUtil.onRefresh();
    }

    render() {
        if (Math.abs(tabModel.tabIndex - this.props.index) > 1) {
            return null;
        }
        this.dataProvider = this.dataProvider.cloneWithRows(this.loadMoreDataUtil.data);
        return (
            <View style={[DesignRule.style_container, { marginTop: ScreenUtils.autoSizeWidth(40) }]}>
                <RecyclerListView
                    style={{
                        minHeight: ScreenUtils.headerHeight,
                        minWidth: 1,
                        flex: 1,
                        backgroundColor: DesignRule.bgColor
                    }}
                    refreshControl={<HeaderLoading
                        isRefreshing={this.loadMoreDataUtil.refreshing}
                        onRefresh={this.loadMoreDataUtil.onRefresh}
                    />}
                    onEndReached={this.loadMoreDataUtil.getMoreData.bind(this)}
                    onEndReachedThreshold={ScreenUtils.height / 3}
                    dataProvider={this.dataProvider}
                    rowRenderer={this._renderItem.bind(this)}
                    layoutProvider={this.layoutProvider}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    canChangeSize={false}
                    renderFooter={() => <DefaultLoadMoreComponent status={this.loadMoreDataUtil.footerStatus}/>
                    }
                />
            </View>
        );
    }

    _keyExtractor = (item, index) => index + item.type;

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
            case homeType.custom_text:
                dim.height = type.itemHeight;
                break;
            default:
                dim.height = 0;
        }
    });

    _renderItem = (type, item, index) => {
        type = type.type;
        if (type === homeType.custom_text) {
            return <TextCustomView data={item} />;
        } else if (type === homeType.custom_imgAD) {
            return <TopicImageAdView data={item} />;
        } else if (type === homeType.custom_goods) {
            return <GoodsCustomView data={item} />;
        }
        return <View/>;
    };

}

