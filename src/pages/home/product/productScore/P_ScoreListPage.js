import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import BasePage from '../../../../BasePage';
import P_ScoreListItemView from './components/P_ScoreListItemView';
import DetailBottomView from '../components/DetailBottomView';
import HomeAPI from '../../api/HomeAPI';
import { PageLoadingState, renderViewByLoadingState } from '../../../../components/pageDecorator/PageState';
import res from '../../res';
import DesignRule from '../../../../constants/DesignRule';
import NoMoreClick from '../../../../components/ui/NoMoreClick';

const { p_score_smile } = res.product.productScore;
const { detail_car_down, detail_more_down } = res.product.detailNavView;


export default class P_ScoreListPage extends BasePage {

    state = {
        loadingState: PageLoadingState.loading,

        noMore: false,//是否能加载更多
        loadingMore: false,//是否显示加载更多的菊花
        loadingMoreError: null,//加载更多是否报错

        page: 1,


        dataArray: []
    };

    componentDidMount() {
        this._loadPageData();
    }

    $NavBarRenderRightItem = () => {
        return <View style={styles.rightBarItemContainer}>
            <NoMoreClick style={styles.rightItemBtn} onPress={this._clickOpenShopItem}>
                <Image source={detail_car_down}/>
            </NoMoreClick>
            <NoMoreClick style={styles.rightItemBtn} onPress={this._clickOpenShopItem}>
                <Image source={detail_more_down}/>
            </NoMoreClick>
        </View>;
    };

    _getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._loadPageData
            },
            emptyProps: {
                // source: res.recommendSearch.shop_notHave,
                description: '暂无数据'
            }
        };
    };

    _loadPageData = () => {
        // const { pData } = this.params;
        // const { prodCode, overtimeComment } = pData;
        let promises = [];
        promises.push(HomeAPI.appraise_queryByProdCode({ prodCode: 'SPU00000088' }).then((data) => {
            return Promise.resolve((data || {}).data || []);
        }));
        promises.push(HomeAPI.appraise_list({ page: 1, pageSize: 1, prodCode: 'SPU00000088' }).then((data) => {
            //isMore层
            let dataTemp = (data || {}).data;
            return Promise.resolve((dataTemp || {}).data || []);
        }));
        Promise.all(promises).then((data) => {
            this.state.page++;

            let tempArr = [];
            data.forEach((item) => {
                tempArr.push(...item);
            });
            this.setState({
                loadingState: (tempArr || []).length > 0 ? PageLoadingState.success : PageLoadingState.empty,
                dataArray: tempArr || []
            });
        }).catch((error) => {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: error,
                dataArray: []
            });
        });
    };

    _loadPageDataMore = () => {

        this.setState({
            loadingMore: true
        }, () => {
            HomeAPI.appraise_list({
                page: this.state.page, pageSize: 1, prodCode: 'SPU00000088'
            }).then((data) => {
                this.state.page++;
                //isMore层
                let dataTemp = (data || {}).data;
                this.setState({
                    loadingMore: false,
                    loadingMoreError: null,
                    noMore: dataTemp.isMore === 0,
                    dataArray: this.state.dataArray.concat((dataTemp || {}).data)
                });
            }).catch((error) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: error.msg
                });
            });
        });
    };

    _onEndReached = () => {
        const { loadingMore, noMore, loadingState } = this.state;
        if (loadingMore || loadingState !== PageLoadingState.success || noMore) {
            return;
        }
        this._loadPageDataMore();
    };

    _ListFooterComponent = () => {
        const { pData } = this.params;
        const { overtimeComment } = pData || {};
        // if (this.state.loadingState !== PageLoadingState.success) {
        //     return null;
        // }
        // return <ListFooter loadingMore={this.state.loadingMore}
        //                    errorDesc={this.state.loadingMoreError}
        //                    onPressLoadError={this._onEndReached}/>;
        // if (this.state.loadingMore || this.state.loadingMoreError) {
        //     return <ListFooter loadingMore={this.state.loadingMore}
        //                        errorDesc={this.state.loadingMoreError}
        //                        onPressLoadError={this._onEndReached}/>;
        //
        // } else {
        return (
            <View>
                <View style={styles.footView}>
                    <Image source={p_score_smile} style={styles.footerImg}/>
                    <Text style={styles.footerText}>{`${overtimeComment || 0}位用户默认给了优秀晒单`}</Text>
                </View>
                {this.state.noMore ? <Text style={styles.footerNoMoreText}>我也是有底线的~</Text> : null}
            </View>
        );
        // }

    };

    _renderItem = ({ item }) => {
        return <P_ScoreListItemView itemData={item}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.id}${index}`;
    };

    _renderFlatList = () => {
        return <FlatList data={this.state.dataArray}
                         renderItem={this._renderItem}
                         keyExtractor={this._keyExtractor}
                         onEndReached={this._onEndReached}
                         onEndReachedThreshold={0.3}
                         ListFooterComponent={this._ListFooterComponent}/>;
    };

    _render() {
        const { pData } = this.params;
        return (
            <View style={styles.container}>
                {renderViewByLoadingState(this._getPageStateOptions(), this._renderFlatList)}
                <DetailBottomView bottomViewAction={this._bottomViewAction}
                                  pData={pData}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 88
    },
    rightItemBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footView: {
        justifyContent: 'center', alignItems: 'center',
        height: 68, backgroundColor: DesignRule.white
    },
    footerImg: {
        marginBottom: 10,
        width: 20, height: 20
    },
    footerText: {
        fontSize: 13, color: DesignRule.textColor_secondTitle
    },
    footerNoMoreText: {
        marginTop: 20, marginBottom: 10, alignSelf: 'center',
        fontSize: 11, color: DesignRule.textColor_instruction
    }
});
