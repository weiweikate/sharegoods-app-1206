// /**
//  *
//  * Copyright 2018 杭州飓热科技有限公司   版权所有
//  * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
//  *
//  *
//  * @providesModule RefreshLargeList
//  * @flow
//  * Created by huchao on 2018/10/22.
//  * largelist文档地址
//  * https://github.com/bolan9999/react-native-largelist/blob/V1/README-cn.md
//  */
// 'use strict';
//
// import React from 'react';
// import {
//     View,
//     Text,
//     ActivityIndicator,
//     StyleSheet,
//     Image,
//     NativeModules
// } from 'react-native';
// import PropTypes from 'prop-types';
// import { LargeList } from '@mr/largelist';
// import res from '../res';
// import DesignRule from '../../constants/DesignRule';
//
// export default class RefreshLargeList extends React.Component {
//     static propTypes = {
//         sectionKey: PropTypes.string, //如果sectionKey = '' 等价于 sectionKey = 'data'
//         isSupportLoadingMore: PropTypes.bool, //是否支持上拉加载更多。为true的时候增加一个底部加载view，为false，请求参数不会给你加page和size
//         renderItem: PropTypes.func, // ({section:number,row:number, item:object, data: array}) => React.Element
//         renderSection: PropTypes.func,// ({section:number, sectionItem:object, data: array}) => React.Element
//         heightForCell: PropTypes.func,// ({section:number,row:number, item:object, data: array}) => number
//         heightForSection: PropTypes.func,// ({section:number, sectionItem:object, data: array}) => number
//         renderHeader: PropTypes.func,
//         renderFooter: PropTypes.func,
//         scrollEnabled: PropTypes.bool,
//         bounces: PropTypes.bool,
//         onScroll: PropTypes.func,
//         showsVerticalScrollIndicator: PropTypes.bool,
//         //showLoadingHub: PropTypes.bool,//是否显示loadingHub，默认false
//
//         /** 自定义 加载更多的框(status) => <BaseLoadMoreComponent status={status}/> 返回的组件必须继承BaseLoadMoreComponent */
//         renderLoadMoreComponent: PropTypes.func,
//
//         /** 空白页的自定义， 默认一张图片，一段文字*/
//         renderEmpty: PropTypes.func,//自定义空白页面
//         defaultEmptyImage: PropTypes.any,// 默认空白页里面的图片
//         defaultEmptyText: PropTypes.any,// 默认空白页的里面的文字
//
//         /** 网络请求需要props */
//         url: PropTypes.func, // API.subURL 请求的方法
//         params: PropTypes.func, //请求参数
//         pageKey: PropTypes.string,
//         sizeKey: PropTypes.string,
//         pageSize: PropTypes.number,//每页的数据数
//         defaultPage: PropTypes.number,// 默认page是从1开始的
//         handleRequestResult: PropTypes.func,// (result, isRefresh) => data 处理请求成功的结果 默认取result.data.data
//         /** 加载的时机*/
//         onStartRefresh: PropTypes.func,
//         onEndRefresh: PropTypes.func,
//         onStartLoadMore: PropTypes.func,
//         onEndLoadMore: PropTypes.func,
//         defaultData: PropTypes.array
//     };
//
//     static defaultProps = {
//         showsVerticalScrollIndicator: false,
//         isSupportLoadingMore: true,
//         showLoadingHub: false,
//         pageKey: 'page',
//         sizeKey: 'size',
//         pageSize: 10,
//         defaultPage: 1,
//         params: {},
//         defaultEmptyImage: res.placeholder.no_data,
//         defaultEmptyText: '我也是有底线的~',
//         defaultData: []
//     };
//
//     constructor(props) {
//         super(props);
//
//         this._bind();
//
//         this.state = {
//             refreshing: false,
//             loadingMore: false,
//             footerStatus: 'idle',
//             height: 0
//         };
//         this.data = props.defaultData;
//         this.page = props.defaultPage;
//         this.allLoadCompleted = false;
//     }
//
//     _bind() {
//         this._numberOfSections = this._numberOfSections.bind(this);
//         this._numberOfRowsInSection = this._numberOfRowsInSection.bind(this);
//         this._renderItem = this._renderItem.bind(this);
//         this._renderSection = this._renderSection.bind(this);
//         this._heightForCell = this._heightForCell.bind(this);
//         this._heightForSection = this._heightForSection.bind(this);
//         this._renderFooter = this._renderFooter.bind(this);
//         this._renderEmpty = this._renderEmpty.bind(this);
//
//         this._getItem = this._getItem.bind(this);
//         this._getsectionItem = this._getsectionItem.bind(this);
//         this._onRefresh = this._onRefresh.bind(this);
//         this._onLoadMore = this._onLoadMore.bind(this);
//         this._getData = this._getData.bind(this);
//     }
//
//     componentDidMount() {
//
//         // InteractionManager.runAfterInteractions(()=>{
//         this._onRefresh();
//         // });
//     }
//
//     _renderEmpty() {
//         if (this.props.renderEmpty) {
//             return this.props.renderEmpty();
//         } else {
//             return (
//                 <View style={{ height: this.state.height - 40, alignItems: 'center', justifyContent: 'center' }}>
//                     <Image source={this.props.defaultEmptyImage}
//                            style={{ width: 110, height: 110 }}
//                            resizeMode={'contain'}/>
//                     <Text style={{
//                         fontSize: DesignRule.fontSize_224,
//                         marginTop: 10,
//                         color: DesignRule.textColor_secondTitle
//                     }}>{this.props.defaultEmptyText}</Text>
//                 </View>
//             );
//         }
//     }
//
//     onLayout(e) {
//         let { height } = e.nativeEvent.layout;
//         this.setState({ height: height });
//     }
//
//     _getItem(section, row) {
//         let { sectionKey } = this.props;
//         let data = this.data;
//         if (sectionKey !== undefined) {
//             if (sectionKey) {
//                 return data[section][sectionKey][row];
//             } else {
//                 return data[section].data[row];
//             }
//         } else {
//             return data[row];
//         }
//     }
//
//     _getsectionItem(section) {
//         let { sectionKey } = this.props;
//         let data = this.data;
//         if (sectionKey !== undefined) {
//             if (sectionKey) {
//                 return data[section][sectionKey];
//             } else {
//                 return data[section].data;
//             }
//         } else {
//             return data;
//         }
//     }
//
//     _numberOfSections() {
//         let { sectionKey } = this.props;
//         if (sectionKey !== undefined) {
//             return this.data.length;
//         } else {
//             return 1;
//         }
//     }
//
//     _numberOfRowsInSection(section) {
//         let sectionItem = this._getsectionItem(section);
//         return sectionItem.length;
//     }
//
//     _renderItem(section: number, row: number) {
//         let { renderItem } = this.props;
//         let data = this.data;
//         let item = this._getItem(section, row);
//         if (renderItem) {
//             return renderItem({ section, row, item, data });
//         } else {
//             return null;
//         }
//
//     }
//
//     _renderSection(section: number) {
//         let { renderSection } = this.props;
//         let data = this.data;
//         let sectionItem = this._getsectionItem(section);
//         if (renderSection) {
//             return renderSection({ section, sectionItem, data });
//         } else {
//             return null;
//         }
//     }
//
//     _heightForCell(section: number, row: number) {
//         let data = this.data;
//         let item = this._getItem(section, row);
//         return this.props.heightForCell({ section, row, item, data });
//     }
//
//     _heightForSection(section: number) {
//         let { heightForSection } = this.props;
//         let data = this.data;
//         let sectionItem = this._getsectionItem(section);
//         if (heightForSection) {
//             return heightForSection({ section, sectionItem, data });
//         }
//         return 0;
//     }
//
//     _renderFooter() {
//         let { renderFooter, isSupportLoadingMore, renderLoadMoreComponent } = this.props;
//         let loadMoreComponent = null;
//         let footer = null;
//         if (isSupportLoadingMore && this.state.refreshing === false && this.data.length > 0) {
//             if (renderLoadMoreComponent) {
//                 footer = renderLoadMoreComponent(this.state.footerStatus);
//             } else {
//                 loadMoreComponent = <DefaultLoadMoreComponent status={this.state.footerStatus}  defaultEmptyText={this.props.defaultEmptyText}/>;
//             }
//         }
//
//         if (renderFooter) {
//             footer = renderFooter();
//         }
//
//         return (
//             <View>
//                 {loadMoreComponent}
//                 {footer}
//             </View>
//         );
//
//     }
//
//     _onRefresh() {
//         if (this.state.refreshing === true) {
//             return;
//         }
//         this.setState({ refreshing: true, footerStatus: 'idle' });
//         this.allLoadCompleted = false;
//         let { onStartRefresh, url, params, defaultPage, onEndRefresh } = this.props;
//         this.page = defaultPage;
//         onStartRefresh && onStartRefresh();
//
//         if (url) {
//             this._getData(url, params, true);
//         } else {
//             onEndRefresh && onEndRefresh();
//         }
//     }
//
//     onRefresh() {
//         this.setState({ footerStatus: 'idle' });
//         this.allLoadCompleted = false;
//         let { onStartRefresh, url, params, defaultPage, onEndRefresh } = this.props;
//         this.page = defaultPage;
//         onStartRefresh && onStartRefresh();
//
//         if (url) {
//             this._getData(url, params, true);
//         } else {
//             onEndRefresh && onEndRefresh();
//         }
//     }
//
//
//     _onLoadMore() {
//         let { onStartLoadMore, url, params, isSupportLoadingMore } = this.props;
//         if (isSupportLoadingMore === false) {
//             return;
//         }
//         this.page++;
//         this.setState({ footerStatus: 'loading', loadingMore: true });
//         onStartLoadMore && onStartLoadMore();
//         if (url) {
//             this._getData(url, params, false);
//         } else {
//             onStartLoadMore && onStartLoadMore();
//         }
//     }
//
//     _getData(url, params, isRefresh) {
//         let { pageKey, sizeKey, pageSize, handleRequestResult, isSupportLoadingMore, onEndRefresh, onEndLoadMore } = this.props;
//         let that = this;
//         if (isSupportLoadingMore) {
//             params[pageKey] = this.page;
//             params[sizeKey] = pageSize;
//         }
//         url(params).then((result => {
//             let netData = [];
//             let allLoadCompleted = false;
//             let footerStatus = 'idle';
//             if (handleRequestResult) {
//                 netData = handleRequestResult(result, isRefresh) || [];
//             } else {
//                 netData = result.data.data || [];
//             }
//             let length = netData.length;
//             if (this.props.totalPageNum) {
//                 length = this.props.totalPageNum(result)
//             }
//             if (length < pageSize) {
//                 allLoadCompleted = true;
//                 footerStatus = 'noMoreData';
//             }
//             let dalay = 0;
//             if (isRefresh === false) {
//                 that.data.push(...netData);
//                 dalay = 500;
//                 onEndLoadMore && onEndLoadMore();
//             } else {
//                 that.data = netData;
//                 onEndRefresh && onEndRefresh();
//
//             }
//             setTimeout(() => {
//                 that.forceUpdate();
//                 that.list && that.list.reloadData();
//                 that.allLoadCompleted = allLoadCompleted;
//                 that.setState({
//                     refreshing: false,
//                     loadingMore: false,
//                     footerStatus
//                 });
//             }, dalay);
//         })).catch((error) => {
//             if (isRefresh === false) {
//                 onEndLoadMore && onEndLoadMore();
//             } else {
//                 onEndRefresh && onEndRefresh();
//
//             }
//             NativeModules.commModule.toast(error.msg || '请求失败');
//             that.setState({
//                 refreshing: false,
//                 loadingMore: false,
//                 footerStatus: 'idle'
//             });
//         })
//         ;
//     }
//
//     reloadData = () => {
//         this.list.reloadData();
//     };
//
//     reloadAll = () => {
//         this.list.reloadAll();
//     };
//
//     render() {
//         let {
//             style, renderHeader, scrollEnabled,
//             bounces, onScroll, showsVerticalScrollIndicator,
//             renderItemSeparator
//         } = this.props;
//         return (
//             <LargeList style={style}
//                        ref={(ref) => {
//                            this.list = ref;
//                        }}
//                        numberOfSections={this._numberOfSections}
//                        numberOfRowsInSection={this._numberOfRowsInSection}
//                        renderCell={this._renderItem}
//                        renderSection={this._renderSection}
//                        heightForCell={this._heightForCell}
//                        heightForSection={this._heightForSection}
//                        renderHeader={renderHeader}
//                        renderFooter={this._renderFooter}
//                        scrollEnabled={scrollEnabled}
//                        bounces={bounces}
//                        onScroll={onScroll}
//                        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
//                        refreshing={this.state.refreshing}
//                        onRefresh={this._onRefresh}
//                        allLoadCompleted={this.allLoadCompleted}
//                        onLoadMore={this._onLoadMore}
//                        loadingMore={this.state.loadingMore}
//                        heightForLoadMore={() => 0}
//                        renderLoadingMore={() => <View/>}
//                        renderLoadCompleted={() => <View/>}
//                        renderEmpty={this._renderEmpty}
//                        onLayout={this.onLayout.bind(this)}
//                        renderItemSeparator={renderItemSeparator}
//                        color={DesignRule.mainColor}
//             />
//         );
//     }
// }
//
// export class BaseLoadMoreComponent extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     renderIdleMore() {
//         return <View/>;
//     }
//
//     renderLoadingMore() {
//         return <View/>;
//     }
//
//     renderLoadCompleted() {
//         return <View/>;
//     }
//
//     render() {
//         switch (this.props.status) {
//             case 'idle':
//                 return this.renderIdleMore();
//             case 'loading':
//                 return this.renderLoadingMore();
//             case 'noMoreData':
//                 return this.renderLoadCompleted();
//         }
//     }
// }
//
// class DefaultLoadMoreComponent extends BaseLoadMoreComponent {
//
//     renderIdleMore() {
//         return (
//             <View style={styles.footer}>
//                 <Text style={styles.footerText}>上拉加载更多数据</Text>
//             </View>
//         );
//
//     }
//
//     renderLoadingMore() {
//         return (
//             <View style={styles.footer}>
//                 <Text style={styles.footerText}>正在加载中...</Text>
//                 <ActivityIndicator style={{ marginLeft: 20 }} size='small'/>
//             </View>
//         );
//     }
//
//     renderLoadCompleted() {
//         return (
//             <View style={styles.footer}>
//                 <Text style={styles.footerText}>{this.props.defaultEmptyText}</Text>
//             </View>
//         );
//     }
//
// }
//
// const styles = StyleSheet.create({
//     footer: {
//         height: 70,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'row'
//     },
//     footerText: {
//         fontSize: DesignRule.fontSize_24,
//         color: DesignRule.textColor_secondTitle
//     }
// });
