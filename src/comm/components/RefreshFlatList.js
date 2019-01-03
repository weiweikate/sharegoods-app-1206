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
    RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils'
import res from '../res';

export default class RefreshFlatList extends React.Component {
    static propTypes = {
        isSupportLoadingMore: PropTypes.bool, //是否支持上拉加载更多。为true的时候增加一个底部加载view，为false，请求参数不会给你加page和size
        renderItem: PropTypes.func, // ({index:number, item:object}) => React.Element
        renderHeader: PropTypes.func,
        renderFooter: PropTypes.func,
        onScroll: PropTypes.func,
        showsVerticalScrollIndicator: PropTypes.bool,
        //showLoadingHub: PropTypes.bool,//是否显示loadingHub，默认false

        /** 自定义 加载更多的框(status) => <BaseLoadMoreComponent status={status}/> 返回的组件必须继承BaseLoadMoreComponent */
        renderLoadMoreComponent: PropTypes.func,

        /** 空白页的自定义， 默认一张图片，一段文字*/
        renderEmpty: PropTypes.func,//自定义空白页面
        defaultEmptyImage: PropTypes.any,// 默认空白页里面的图片
        defaultEmptyText: PropTypes.any,// 默认空白页的里面的文字

        /** 网络请求需要props */
        url: PropTypes.func, // API.subURL 请求的方法
        params: PropTypes.func, //请求参数
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
        defaultData: []
    };

  constructor(props) {
    super(props);

    this._bind();

      this.state = {
          refreshing: false,
          loadingMore: false,
          footerStatus: 'idle',
          data: [],
          height: ScreenUtils.height - ScreenUtils.headerHeight
      };
      this.page = props.defaultPage;
      this.allLoadCompleted = false;
  }

  _bind() {

  }

  componentDidMount() {
      this._onRefresh();
  }

  _renderEmpty() {
        if (this.props.renderEmpty) {
            return this.props.renderEmpty();
        } else {
            return (
                <View style={{ height: this.state.height - 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={this.props.defaultEmptyImage}
                           style={{ width: 110, height: 110 }}
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
                loadMoreComponent = <DefaultLoadMoreComponent status={this.state.footerStatus}  defaultEmptyText={this.props.defaultEmptyText}/>;
            }
        }

        if (renderFooter) {
            footer = renderFooter();
        }

        return (
            <View style={{height: 70}}>
                {loadMoreComponent}
                {footer}
            </View>
        );

    }

    _onRefresh() {
        if (this.state.refreshing === true) {
            return;
        }
        this.setState({ refreshing: true, footerStatus: 'idle' });
        this.allLoadCompleted = false;
        let { onStartRefresh, url, params, defaultPage, onEndRefresh } = this.props;
        this.page = defaultPage;
        onStartRefresh && onStartRefresh();

        if (url) {
            this._getData(url, params, true);
        } else {
            onEndRefresh && onEndRefresh();
        }
    }

    // onRefresh() {
    //     this.setState({ footerStatus: 'idle' });
    //     this.allLoadCompleted = false;
    //     let { onStartRefresh, url, params, defaultPage, onEndRefresh } = this.props;
    //     this.page = defaultPage;
    //     onStartRefresh && onStartRefresh();
    //
    //     if (url) {
    //         this._getData(url, params, true);
    //     } else {
    //         onEndRefresh && onEndRefresh();
    //     }
    // }


    _onLoadMore() {
        let { onStartLoadMore, url, params, isSupportLoadingMore } = this.props;
        if (isSupportLoadingMore === false || this.allLoadCompleted === true) {
            return;
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
        let { pageKey, sizeKey, pageSize, handleRequestResult, isSupportLoadingMore, onEndRefresh, onEndLoadMore } = this.props;
        let that = this;
        if (isSupportLoadingMore) {
            params[pageKey] = this.page;
            params[sizeKey] = pageSize;
        }
        url(params).then((result => {
            let netData = [];
            let allLoadCompleted = false;
            let footerStatus = 'idle';
            if (handleRequestResult) {
                netData = handleRequestResult(result, isRefresh) || [];
            } else {
                netData = result.data.data || [];
            }
            let length = netData.length;
            if (this.props.totalPageNum) {
                length = this.props.totalPageNum(result)
            }
            if (length < pageSize) {
                allLoadCompleted = true;
                footerStatus = 'noMoreData';
            }
            let data = this.state.data;
            if (isRefresh === false) {
                data = data.concat(netData)
                onEndLoadMore && onEndLoadMore();
            } else {
                data = netData;
                onEndRefresh && onEndRefresh();

            }

                that.allLoadCompleted = allLoadCompleted;
                that.setState({
                    refreshing: false,
                    loadingMore: false,
                    footerStatus,
                    data
                });
        })).catch((error) => {
            if (isRefresh === false) {
                onEndLoadMore && onEndLoadMore();
            } else {
                onEndRefresh && onEndRefresh();

            }
            // NativeModules.commModule.toast(error.msg || '请求失败');
            that.setState({
                refreshing: false,
                loadingMore: false,
                footerStatus: 'idle'
            });
        })
        ;
    }


    render() {
    return (
      <FlatList
          data={this.state.data}
          ListEmptyComponent={this._renderEmpty.bind(this)}
          ListFooterComponent={this._renderFooter.bind(this)}
          renderItem={this.props.renderItem}
          onEndReached={this._onLoadMore.bind(this)}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={this.props.renderHeader}
          // onRefresh={this._onRefresh.bind(this)}
          // refreshing={this.state.refreshing}
          //onLayout={this.onLayout.bind(this)}
          refreshControl={
              <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                  colors={[DesignRule.mainColor]}
                  tintColor={DesignRule.mainColor}
              />
          }
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
        }
    }
}

class DefaultLoadMoreComponent extends BaseLoadMoreComponent {

    renderIdleMore() {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText} allowFontScaling={false}>上拉加载更多数据</Text>
            </View>
        );

    }

    renderLoadingMore() {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText} allowFontScaling={false}>正在加载中...</Text>
                <ActivityIndicator style={{ marginLeft: 20 }} size='small'/>
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
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    footerText: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle
    }
});
