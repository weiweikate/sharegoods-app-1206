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

const empty_list_message = res.placeholder.no_data;

const defaultPageSize = 10;

export default class RefreshList extends Component {
    static defaultProps = {
        data: [],
        isHideFooter: true
    };

    static propTypes = {
        emptyIcon: PropTypes.any
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
        if (this.props.isHideFooter) {
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
                            <Text style={styles.footer_text}>No More</Text>
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
        return (
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                              onPress={() => !this.props.emptyNoRefresh && this.props.onRefresh()}>
                <Image style={{ height: 110, width: 110 }} source={this.state.emptyIcon} resizeMode={'contain'}/>
                <Text
                    style={{
                        marginTop: 20,
                        fontSize: 14,
                        color: DesignRule.textColor_instruction
                    }}>{this.state.emptyTip}</Text>
            </TouchableOpacity>);
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
        const { data, headerData, renderItem, onRefresh, keyExtractor, isEmpty, extraData, progressViewOffset, ...attributes } = this.props;
        if (data.length > 0 || headerData) {
            return (
                <FlatList
                    style={[{ width: ScreenUtils.width, flex: 1 }, this.props.style && this.props.style]}
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    onEndReached={this.props.onLoadMore ? this.onEndReached : null}
                    extraData={extraData}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this.renderFooter}
                    ListHeaderComponent={this.props.ListHeaderComponent}
                    keyExtractor={keyExtractor ? keyExtractor : (item, index) => index.toString()}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                    onRefresh={onRefresh ? this.refresh : null}
                                                    colors={[DesignRule.mainColor]}
                                                    progressViewOffset={progressViewOffset}/>}
                    ref={'flatlist'}
                    {...attributes}
                />
            );

        } else {
            if (isEmpty) {
                return (
                    <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center', marginTop: 80 }}>
                        {this.renderEmpty()}
                    </View>);
            }
            return null;
        }

    }
}

const styles = StyleSheet.create({
    footer_text: {
        fontSize: 14,
        color: '#555555',
        marginLeft: 10
    },
    footer_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        height: 44
    }
});



