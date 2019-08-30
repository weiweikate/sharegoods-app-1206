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

import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { homeType } from '../../HomeTypes';
import { ImageAdViewGetHeight, TopicImageAdView } from '../TopicImageAdView';
import GoodsCustomView, { GoodsCustomViewGetHeight } from '../GoodsCustomView';
import HomeAPI from '../../api/HomeAPI';
import TextCustomView from '../TextCustomView';
import LoadMoreDataUtil from '../../../../utils/LoadMoreDataUtil';
import { DefaultLoadMoreComponent } from '../../../../comm/components/RefreshFlatList';
import { observer } from 'mobx-react';
import bridge from '../../../../utils/bridge';
const autoSizeWidth = ScreenUtils.autoSizeWidth;
@observer
export default class DIYTopicList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.loadMoreDataUtil = new LoadMoreDataUtil()
        this.loadMoreDataUtil.API = HomeAPI.getCustomTopic;
        this.loadMoreDataUtil.paramsFunc = () => {return{topicCode: (this.props.data || {}).linkCode}};
        this.loadMoreDataUtil.asyncHandleData = (data) => {
            data = data.data.widgets.data || []

            data = [...data];
            let p = []
            let count = data.length;
            for (let index = 0; index < count; index ++){
                let item = data[index];
                if (item.type === homeType.custom_goods) {
                    item.itemHeight = GoodsCustomViewGetHeight(item);
                    item.marginBottom = ScreenUtils.autoSizeWidth(0);
                    if (count-1 > index) {
                        let type = data[index+1].type;
                        if (type  === homeType.custom_imgAD || type === homeType.custom_text) {
                            item.marginBottom = ScreenUtils.autoSizeWidth(15);
                        }
                    }
                    item.itemHeight += item.marginBottom;
                }

                if (item.type === homeType.custom_imgAD) {
                    item.itemHeight = ImageAdViewGetHeight(item);
                }

                if (item.type === homeType.custom_text) {

                    item.detailHeight = 0;
                    item.textHeight = 0;
                    if (item.text) {
                        p.push(bridge.getTextHeightWithWidth(item.text, autoSizeWidth(14), ScreenUtils.width - autoSizeWidth(30)).then((r) => {
                            item.textHeight = r.height;
                            item.itemHeight = r.height + item.detailHeight+ autoSizeWidth(20)
                        }));
                    }
                    if (item.subText) {
                        p.push(bridge.getTextHeightWithWidth(item.subText, autoSizeWidth(12), ScreenUtils.width - autoSizeWidth(30)).then((r) => {
                            item.detailHeight = r.height;
                            item.itemHeight = r.height + item.textHeight + autoSizeWidth(20)
                        }));
                    }
                }
            }
           return Promise.all(p).then(()=> {
               return data
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
                case homeType.custom_text:
               dim.height = type.itemHeight;
                break;
            default:
                dim.height = 0;
        }
    });

    _keyExtractor = (item, index) => index + item.type;

    _renderItem = (type, item, index) => {
        type = type.type
        let p = {specialTopicId:  this.props.data.linkCode}
        if (type === homeType.custom_text) {
            p.specialTopicArea = 6;
            return <TextCustomView data={item} p={p}/>;
        } else if (type === homeType.custom_imgAD) {
            p.specialTopicArea = 1;
            return <TopicImageAdView data={item}  p={p}/>;
        } else if (type === homeType.custom_goods) {
            p.specialTopicArea = 3;
            return <GoodsCustomView data={item} p={p}/>;
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
                style={{ minHeight: ScreenUtils.headerHeight, minWidth: 1, flex: 1, marginTop: 0}}
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
                // forceNonDeterministicRendering={true}
                renderFooter={() => <DefaultLoadMoreComponent status={this.loadMoreDataUtil.footerStatus}/>
                }
            />
        );
    }
}

