import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Image, RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import ScreenUtils from '../../utils/ScreenUtils';
import res from '../../comm/res';
import DesignRule from '../../constants/DesignRule';
import { MRText as Text } from './UIText';
import EmptyView from '../pageDecorator/BaseView/EmptyView';

const empty_list_message = res.placeholder.no_data;

const defaultPageSize = 10;

export default class RefreshList extends Component {
    static defaultProps = {
        data: [],
        isHideFooter: true,
        topBtn:false,
    };

    static propTypes = {
        emptyIcon: PropTypes.any,
        topBtn: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isEmpty: false,
            refreshing: false,
            emptyTip: this.props.emptyTip ? this.props.emptyTip : '',//空态文案
            emptyIcon: this.props.emptyIcon ? this.props.emptyIcon : empty_list_message//空态图标,
        };

    }

    componentDidMount() {
    }

    errorReLoadPress = () => {
        this.setState({ isError: false });
        this.onEndReached();
    };
    isEnd = () => {
        return this.props.data.length % defaultPageSize !== 0;
    };

    isNoraml = () => {
        return !this.isEnd();
    };

    renderFooter = () => {
        if (this.props.isHideFooter || this.props.firstLoading === 1) {
            return <View/>;
        } else {
            if (this.state.isError) {
                return (
                    <TouchableOpacity onPress={() => this.errorReLoadPress()}>
                        <View style={styles.footer_container}>
                            <Text style={styles.footer_text}>加载失败，点击重新加载</Text>
                        </View>
                    </TouchableOpacity>

                );
            } else {
                if (this.isEnd()) {
                    return (
                        <View style={styles.footer_container}>
                            <Text style={styles.footer_text}>我也是有底线的</Text>
                        </View>
                    );
                } else {
                    return (
                        <View style={styles.footer_container}>
                            <ActivityIndicator size="small" color="#888888"/>
                            <Text style={styles.footer_text}>拼命加载中…</Text>
                        </View>);
                }
            }
        }

    };

    onEndReached = () => {
        if ((!this.state.isError) && this.isNoraml()) {
            let dataLength = this.props.data.length;
            let curPage = dataLength % defaultPageSize >= 0 ? (parseInt(dataLength / defaultPageSize + 1)) : parseInt((dataLength / defaultPageSize + 2));
            if (curPage > 1) {
                this.props.onLoadMore(curPage);
            }
        }
    };

    renderEmpty = () => {
        return <EmptyView description={''} subDescription={this.state.emptyTip} source={this.state.emptyIcon}/>
    };

    refresh = () => {
        this.setState({ refreshing: true });
        this.refreshing = true;
        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 1000);
        this.props.onRefresh();
    };

    scrollToIndex(params) {
        this.refs.flatlist.scrollToIndex(params);
    }


    render() {
        const { data, headerData, firstLoading, renderItem, onRefresh, keyExtractor, onListViewScroll, isEmpty, extraData, progressViewOffset, topBtn, ...attributes} = this.props;
        let refreshingState = this.state.refreshing;
        if(firstLoading){
            refreshingState = firstLoading === 1 ? true : this.state.refreshing
        }
        if (data.length > 0 || headerData) {
            return (
                <View style={{flex:1}}>
                <FlatList
                    style={[{ width: ScreenUtils.width, flex: 1 }, this.props.style && this.props.style]}
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    onEndReached={this.props.onLoadMore ? this.onEndReached : null}
                    extraData={extraData}
                    onEndReachedThreshold={0.1}
                    onScroll={(e)=>{onListViewScroll && onListViewScroll(e)}}
                    ListFooterComponent={this.renderFooter}
                    ListHeaderComponent={this.props.ListHeaderComponent}
                    keyExtractor={keyExtractor ? keyExtractor : (item, index) => index.toString()}
                    refreshControl={<RefreshControl refreshing={refreshingState}
                                                    onRefresh={onRefresh ? this.refresh : null}
                                                    colors={[DesignRule.mainColor]}
                                                    progressViewOffset={progressViewOffset}/>}
                    ref={'flatlist'}
                    {...attributes}
                />
                    {topBtn ?
                        <View style={styles.topbtnStyle}>
                            <TouchableOpacity onPress={()=>this.scrollToIndex({viewPosition: 0, index: 0 })}>
                                <Image source={res.other.top_Icon}
                                       style={{width: ScreenUtils.px2dp(45),
                                           height: ScreenUtils.px2dp(45),
                                       }} />
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                </View>
            );

        } else {
            if (isEmpty) {
                return (
                    <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center' }}>
                        {this.renderEmpty()}
                    </View>);
            }
            return null;
        }

    }
}

const styles = StyleSheet.create({
    footer_text: {
        fontSize: 11,
        color: '#a5adb3',
        marginLeft: 10
    },
    footer_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        height: 44
    },
    topbtnStyle:{
        position: 'absolute',
        right: 14,
        bottom: 50,
    }
});



