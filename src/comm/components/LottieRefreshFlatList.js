/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/12/18.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Text,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import res from '../res';
import bridge from '../../utils/bridge';
import store from '@mr/rn-store';
import HeaderLoading from './lottieheader/ListHeaderLoading';

const cache = '@mr/cache';

export default class RefreshFlatList extends React.Component {
    static propTypes = {
        isSupportLoadingMore: PropTypes.bool, //是否支持上拉加载更多。为true的时候增加一个底部加载view，为false，请求参数不会给你加page和size
        renderItem: PropTypes.func, // ({index:number, item:object}) => React.Element
        renderHeader: PropTypes.func,
        renderFooter: PropTypes.func,
        renderError: PropTypes.func,
        onScroll: PropTypes.func,
        showsVerticalScrollIndicator: PropTypes.bool,
        componentDidMountRefresh: PropTypes.bool,
        //showLoadingHub: PropTypes.bool,//是否显示loadingHub，默认false

        /** 自定义 加载更多的框(status) => <BaseLoadMoreComponent status={status}/> 返回的组件必须继承BaseLoadMoreComponent */
        renderLoadMoreComponent: PropTypes.func,

        /** 空白页的自定义， 默认一张图片，一段文字*/
        renderEmpty: PropTypes.func,//自定义空白页面
        defaultEmptyImage: PropTypes.any,// 默认空白页里面的图片
        defaultEmptyText: PropTypes.any,// 默认空白页的里面的文字

        /** 网络请求需要props */
        url: PropTypes.func, // API.subURL 请求的方法
        params: PropTypes.object, //请求参数
        paramsFunc: PropTypes.func, //请求参数
        pageKey: PropTypes.string,
        sizeKey: PropTypes.string,
        pageSize: PropTypes.number,//每页的数据数
        defaultPage: PropTypes.number,// 默认page是从1开始的
        handleRequestResult: PropTypes.func,// (result, isRefresh) => data 处理请求成功的结果 默认取result.data.data
        /** 加载的时机*/
        onStartRefresh: PropTypes.func,
        onEndRefresh: PropTypes.func,
        onStartLoadMore: PropTypes.func,
        onEndLoadMore: PropTypes.func,
        emptyHeight: PropTypes.number
    };

    static defaultProps = {
        showsVerticalScrollIndicator: false,
        isSupportLoadingMore: true,
        showLoadingHub: false,
        pageKey: 'page',
        sizeKey: 'size',
        pageSize: 10,
        defaultPage: 1,
        params: {},
        defaultEmptyImage: res.placeholder.no_data,
        defaultEmptyText: '暂无数据~',
        defaultData: [],
        renderHeader: () => {
            return null;
        },
        componentDidMountRefresh: true,
        emptyHeight: ScreenUtils.height - ScreenUtils.headerHeight
    };

    constructor(props) {
        super(props);

        this._bind();

        this.state = {
            refreshing: false,
            loadingMore: false,
            footerStatus: 'idle',
            data: [],
            error: null
        };
        this.page = props.defaultPage;
        this.allLoadCompleted = false;
        this.isNetLoading = false;
    }

    _bind() {

    }

    componentDidMount() {
        if (this.props.componentDidMountRefresh) {
            this._onRefresh(false);
        }
        if (this.props.cache) {
            store.get(cache).then(data => {
                if (data) {
                    this.setState({ data: data });
                }

            });
        }
    }

    scrollToTop = (animated = true) => {
        this.list && this.list.scrollToOffset({ y: 0, animated: animated });
    };

    changeData = (data) => {
        this.setState({
            data: data
        });
    };

    getSourceData = () => {
        return this.state.data;
    };

    _renderEmpty() {
        if (this.props.renderEmpty) {
            return this.props.renderEmpty();
        } else {
            return (
                <View style={{ height: this.props.emptyHeight - 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={this.props.defaultEmptyImage}
                           resizeMode={'contain'}/>
                    <Text style={{
                        marginTop: 10,
                        color: DesignRule.textColor_secondTitle
                    }} allowFontScaling={false}>{this.props.defaultEmptyText}</Text>
                </View>
            );
        }
    }


    onLayout(e) {
        let { height } = e.nativeEvent.layout;
        this.setState({ height: height });
    }

    _renderFooter() {
        let { renderFooter, isSupportLoadingMore, renderLoadMoreComponent } = this.props;
        let loadMoreComponent = null;
        let footer = null;
        if (isSupportLoadingMore && this.state.refreshing === false && this.state.data.length > 0) {
            if (renderLoadMoreComponent) {
                footer = renderLoadMoreComponent(this.state.footerStatus);
            } else {
                loadMoreComponent = <DefaultLoadMoreComponent status={this.state.footerStatus}
                                                              defaultEmptyText={this.props.defaultEmptyText}/>;
            }
        }

        if (renderFooter) {
            footer = renderFooter();
        }

        return (
            <View>
                {loadMoreComponent}
                {footer}
            </View>
        );

    }

    _onRefresh(refreshing = true) {
        if (this.state.refreshing === true || this.isNetLoading === true) {
            return;
        }
        setTimeout(()=> {//为了播放完刷新动画
            this.setState({
                refreshing: false
            });
        }, 1000);
        if(refreshing){
            this.setState({ refreshing: refreshing, footerStatus: 'idle' });
        }else {
            this.setState({  footerStatus: 'idle' });
        }
        this.allLoadCompleted = false;
        let { onStartRefresh, url, params, defaultPage, onEndRefresh, paramsFunc } = this.props;
        if (paramsFunc) {
            params = paramsFunc();
        }
        this.page = defaultPage;
        onStartRefresh && onStartRefresh();
        if (!refreshing) {
            bridge.showLoading();
        }
        delete params.cursor;
        if (url) {
            this._getData(url, params, true);
        } else {
            onEndRefresh && onEndRefresh();
        }
    }

    onRefresh() {
        if (this.state.refreshing === true || this.isNetLoading === true) {
            return;
        }
        this.setState({ footerStatus: 'idle' });
        this.list && this.list.scrollToOffset({ y: 0, animated: false });
        this.allLoadCompleted = false;
        let { onStartRefresh, url, params, defaultPage, onEndRefresh, paramsFunc } = this.props;
        if (paramsFunc) {
            params = paramsFunc();
        }
        this.page = defaultPage;
        onStartRefresh && onStartRefresh();
        delete params.cursor;
        if (url) {
            this._getData(url, params, true);
        } else {
            onEndRefresh && onEndRefresh();
        }
    }


    _onLoadMore() {
        let { onStartLoadMore, url, params, isSupportLoadingMore ,paramsFunc} = this.props;

        if (!isSupportLoadingMore || this.allLoadCompleted || this.isNetLoading) {
            return;
        }

        if(paramsFunc){
            params = paramsFunc();
        }
        this.page++;
        this.setState({ footerStatus: 'loading', loadingMore: true });
        onStartLoadMore && onStartLoadMore();
        if (url) {
            this._getData(url, params, false);
        } else {
            onStartLoadMore && onStartLoadMore();
        }
    }

    _getData(url, params, isRefresh) {
        this.isNetLoading = true;
        let { pageKey, sizeKey, pageSize, handleRequestResult, isSupportLoadingMore, onEndRefresh, onEndLoadMore } = this.props;
        let that = this;
        if (isSupportLoadingMore) {
            params[pageKey] = this.page;
            params[sizeKey] = pageSize;
        }
        url(params).then((result => {
            bridge.hiddenLoading();
            let netData = [];
            let allLoadCompleted = false;
            this.isNetLoading = false;
            let footerStatus = 'idle';
            if (handleRequestResult) {
                netData = handleRequestResult(result, isRefresh) || [];
            } else {
                netData = result.data.data || [];
            }
            let length = netData.length;
            if (this.props.totalPageNum) {
                length = this.props.totalPageNum(result);
            }
            if (length < pageSize) {
                allLoadCompleted = true;
                footerStatus = 'noMoreData';
            }
            let data = this.state.data;
            if (isRefresh === false) {
                data = data.concat(netData);
                onEndLoadMore && onEndLoadMore();
            } else {
                data = netData;
                if(this.props.cache) {
                    store.save(cache, netData);
                }
                onEndRefresh && onEndRefresh();

            }

            that.allLoadCompleted = allLoadCompleted;
            this.props.dataChangeListener && this.props.dataChangeListener(data);
            that.setState({
                loadingMore: false,
                footerStatus,
                data,
                error: null
            });
        })).catch((error) => {
            bridge.hiddenLoading();
            if (isRefresh === false) {
                onEndLoadMore && onEndLoadMore();
            } else {
                onEndRefresh && onEndRefresh();

            }
            // NativeModules.commModule.toast(error.msg || '请求失败');
            this.isNetLoading = false;
            that.setState({
                loadingMore: false,
                footerStatus: 'noMoreData',
                error: error
            });
        })
        ;
    }


    render() {
        if (this.state.data.length === 0 && this.state.error && this.props.renderError) {
            return this.props.renderError(this.state.error || {});
        }
        return (
            <FlatList
                {...this.props}
                ref={(ref) => {
                    this.list = ref;
                }}
                data={this.state.data}
                ListEmptyComponent={this._renderEmpty.bind(this)}
                ListFooterComponent={this._renderFooter.bind(this)}
                renderItem={this.props.renderItem}
                onEndReached={this._onLoadMore.bind(this)}
                onEndReachedThreshold={0.1}
                ListHeaderComponent={() => {
                    return this.props.renderHeader(this.state.data);
                }}
                // onRefresh={this._onRefresh.bind(this)}
                // refreshing={this.state.refreshing}
                //onLayout={this.onLayout.bind(this)}
                refreshControl={<HeaderLoading
                    isRefreshing={this.state.refreshing}
                    onRefresh={()=> this._onRefresh()}
                />}
            />
        );
    }
}

export class BaseLoadMoreComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    renderIdleMore() {
        return <View/>;
    }

    renderLoadingMore() {
        return <View/>;
    }

    renderLoadCompleted() {
        return <View/>;
    }

    render() {
        switch (this.props.status) {
            case 'idle':
                return this.renderIdleMore();
            case 'loading':
                return this.renderLoadingMore();
            case 'noMoreData':
                return this.renderLoadCompleted();
            default:
                return <View/>;
        }
    }
}

export class DefaultLoadMoreComponent extends BaseLoadMoreComponent {

    renderIdleMore() {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText} allowFontScaling={false}>上拉加载更多</Text>
            </View>
        );

    }

    renderLoadingMore() {
        return (
            <View style={styles.footer}>
                <ActivityIndicator style={{ marginRight: 6 }} color={DesignRule.mainColor} size='small'/>
                <Text style={styles.footerText} allowFontScaling={false}>正在加载中...</Text>
            </View>

        );
    }

    renderLoadCompleted() {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText} allowFontScaling={false}>我也是有底线的~</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    footer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    footerText: {
        fontSize: DesignRule.fontSize_24,
        color: DesignRule.textColor_secondTitle
    }
});
