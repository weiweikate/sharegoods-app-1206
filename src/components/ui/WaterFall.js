import React from 'react';
import {
    FlatList,
    ScrollView,
    View,
    ViewPropTypes,
    RefreshControl
} from 'react-native';

import PropTypes from 'prop-types';
import DesignRule from '../../constants/DesignRule';
import { MRText as Text } from './UIText';

class Item extends React.PureComponent {
    render() {
        return <View style={{ flex: 1 }} onLayout={this.props.onLayout}>
            {this.props.renderItem(this.props.item)}
        </View>;
    }
}

export class Column extends React.Component {
    static propTypes = {
        keyExtractor: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            data: []
        };
    }

    clear() {
        this.setState({
            data: [],
            height: 0
        });
    }

    render() {
        return (
            <View style={{ flex: 1, overflow: 'hidden', paddingLeft: this.props.space }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.data}
                    keyExtractor={this.props.keyExtractor}
                    renderItem={this.renderItem.bind(this)}
                    initialNumToRender={6}
                />
            </View>
        );
    }

    getHeight() {
        return this.state.height;
    }

    addItems(items) {
        this.setState({ data: [...this.state.data, ...items] });
    }

    renderItem({ item }) {
        return <Item renderItem={this.props.renderItem} item={item} onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            this.state.height = this.state.height + height;
            this.setState({ height: this.state.height });
            item.onLayout && item.onLayout();
        }}/>;
    }
}

class LoadMore extends React.Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired
    };

    render() {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', height: 50 }}>
                <Text>{this.props.loading ? '加载中...' : '加载更多'}</Text>
            </View>
        );
    }
}

export default class Masonry extends React.Component {
    static propTypes = {
        columns: PropTypes.number,
        containerStyle: ViewPropTypes.style,
        style: ViewPropTypes.style,
        renderItem: PropTypes.func,
        keyExtractor: PropTypes.func,
        space: PropTypes.number,
        refresh: PropTypes.bool,
        infinite: PropTypes.bool,
        refreshing: PropTypes.func,
        infiniting: PropTypes.func,
        hasMore: PropTypes.bool,
        refreshConf: PropTypes.object,
        renderInfinite: PropTypes.func,
        renderHeader: PropTypes.func
    };

    static defaultProps = {
        columns: 2,
        space: 10,
        refresh: true,
        infinite: true,
        refreshing: () => {
        },
        infiniting: () => {
        },
        hasMore: true,
        refreshConf: {
            title: '下拉加载',
            colors: [DesignRule.mainColor]
        }
    };

    constructor(props) {
        super(props);
        const columns = [];
        for (let i = 0; i < props.columns; i++) {
            columns.push(null);
        }
        this.state = {
            columns,
            refreshing: false,
            infiniting: false
        };
        this.itemQueue = [];
        this.index = 1;
    }

    /**
     * 清除瀑布流内容
     */
    clear() {
        this.state.columns.forEach(col => col.clear());
    }

    /**
     * 添加瀑布流内容
     * @param items
     */
    addItems(items) {
        if (items) {
            if (this.itemQueue.length > 0) {
                this.itemQueue = this.itemQueue.concat(items);
            } else {
                this.itemQueue = this.itemQueue.concat(items);
                this.addItems();
            }
        } else {
            if (this.itemQueue.length > 0) {
                const item = this.itemQueue.shift();
                this.index = this.index === 1 ? 0 : 1;
                this.addItem(item, () => this.addItems(), this.index);
            }
        }
    }

    addItemsWithHeight(items) {
        // 生成临时 Column 映射
        const columns = this.sortColumns().map(col => {
            return {
                column: col,
                height: col.getHeight(),
                data: []
            };
        });

        // 逐个分配 Item 到最小的 Column 中
        items.forEach((item) => {
            const col = columns.sort((a, b) => a.height - b.height)[0];
            col.data.push(item);
            col.height += item.height;
        });

        // 批量添加 Column 的 Items
        columns.forEach(col => {
            col.column.addItems(col.data);
        });
    }

    /**
     * 对所有列按高度进行排序
     * @returns {Array}
     */
    sortColumns() {
        return this.state.columns.sort((a, b) => a.getHeight() - b.getHeight());
    }

    addItem(item, callback, index) {
        const minCol = this.state.columns[index];
        item.onLayout = callback;
        minCol.addItems([item]);
    }

    /**
     * 下拉刷新
     * @private
     */
    _onRefresh() {
        this.index = 1;
        this.setState({ refreshing: true });
        this.props.refreshing(this.refreshDone.bind(this));
    }

    /**
     * 滚动加载
     * @param event
     * @private
     */
    _onInfinite(event) {
        // console.log('_onInfinite', this.props.hasMore, this.state.infiniting)
        // if (this.props.hasMore && this.state.infiniting) {return}
        let y = event.nativeEvent.contentOffset.y;
        let height = event.nativeEvent.layoutMeasurement.height;
        let contentHeight = event.nativeEvent.contentSize.height;
        if (y + height >= contentHeight - 100) {
            // this.setState({
            //   infiniting: true
            // })
            this.props.infiniting(this.infiniteDone.bind(this));
        }
    }

    refreshDone() {
        this.setState({
            refreshing: false
        });
    }

    infiniteDone() {
        this.setState({
            infiniting: false
        });
    }

    scrollToTop() {
        this.scrollRef && this.scrollRef.scrollTo({ x: 0, y: 0, animated: false });
    }

    render() {
        let loadMore = this.props.infinite ?
            (this.props.renderInfinite ? this.props.renderInfinite(this.state.infiniting) :
                <LoadMore loading={this.state.infiniting}/>)
            : null;

        return (
            <ScrollView
                ref={(ref) => {
                    this.scrollRef = ref;
                }}
                refreshControl={
                    this.props.refresh ?
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            {...this.props.refreshConf}
                        /> : null
                }
                onScroll={
                    this.props.infinite ? this._onInfinite.bind(this) : null
                }
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={100}>
                {this.props.renderHeader ? this.props.renderHeader() : null}
                <View style={[{ flexDirection: 'row' }, this.props.containerStyle]}>
                    {this.state.columns.map((col, index) => {
                        return <Column
                            key={index}
                            space={index === 0 ? 0 : this.props.space}
                            ref={ref => this.state.columns[index] = ref}
                            keyExtractor={this.props.keyExtractor}
                            renderItem={this.props.renderItem.bind(this)}/>;
                    })}
                </View>
                {this.props.hasMore ? loadMore : null}
            </ScrollView>
        );
    }
}
