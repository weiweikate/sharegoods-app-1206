import React from 'react';
import { Text, View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import BasePage from '../../../BasePage';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import RouterMap from '../../../navigation/RouterMap';
import SpellShopApi from '../api/SpellShopApi';
import StringUtils from '../../../utils/StringUtils';
import DateUtils from '../../../utils/DateUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import EmptyView from '../../../components/pageDecorator/BaseView/EmptyView';
import spellStatusModel from '../model/SpellStatusModel';
import ListFooter from '../../../components/pageDecorator/BaseView/ListFooter';
import { payment, payStatus, payStatusMsg } from '../../payment/Payment';
import Toast from '../../../utils/bridge';

export class AddCapacityHistoryPage extends BasePage {
    $navigationBarOptions = {
        title: '我的扩容'
    };

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            noMore: false,//是否能加载更多
            loadingMore: false,//是否显示加载更多的菊花
            loadingMoreError: null,//加载更多是否报错
            page: 1,

            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            dataList: [],
            showExpand: false
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: () => {
                    this.loadPageData();
                }
            }
        };
    };

    componentDidMount() {
        this.loadPageData();
    }

    _refreshing = () => {
        this.setState({
            page: 1,
            refreshing: true
        }, () => {
            this.loadPageData();
        });
    };

    loadPageData = () => {
        SpellShopApi.store_record({
            storeCode: spellStatusModel.storeCode,
            page: this.state.page,
            size: 10
        }).then((data) => {
            this.state.page++;
            //isMore
            const dataTemp = data.data || {};
            //
            const dataArrTemp = dataTemp.data || [];
            this.setState({
                refreshing: false,
                dataList: dataArrTemp,
                loadingState: PageLoadingState.success,
                noMore: dataTemp.isMore === 0
            });
        }).catch((e) => {
            this.setState({
                refreshing: false,
                loadingState: PageLoadingState.fail,
                netFailedInfo: e
            });
        });

        SpellShopApi.store_person({ storeCode: spellStatusModel.storeCode }).then((data) => {
            const dataTemp = data.data || {};
            const { showExpand } = dataTemp;
            this.setState({
                showExpand
            });
        });
    };

    _loadPageDataMore = () => {
        this.setState({
            loadingMore: true
        }, () => {
            SpellShopApi.store_record({
                storeCode: spellStatusModel.storeCode,
                page: this.state.page,
                size: 10
            }).then((data) => {
                this.state.page++;
                //isMore
                const dataTemp = data.data || {};
                //
                const dataArrTemp = dataTemp.data || [];
                this.setState({
                    dataList: this.state.dataList.concat(dataArrTemp),
                    noMore: dataTemp.isMore === 0,
                    loadingMore: false,
                    loadingMoreError: null
                });
            }).catch((e) => {
                this.setState({
                    loadingMore: false,
                    loadingMoreError: e.msg
                });
            });
        });
    };

    _ListFooterComponent = () => {
        if (this.state.loadingState !== PageLoadingState.success) {
            return null;
        }
        return <ListFooter loadingMore={this.state.loadingMore}
                           errorDesc={this.state.loadingMoreError}
                           onPressLoadError={this._onEndReached}/>;
    };
    _onEndReached = () => {
        if (this.state.loadingState !== PageLoadingState.success || this.state.noMore || this.state.loadingMore) {
            return;
        }
        this._loadPageDataMore();
    };

    _addBtnAction = () => {
        this.$navigate(RouterMap.AddCapacityPage);
    };

    _renderItem = ({ item }) => {
        const { payTime, personNum, price, status, expandId, orderNo, tokenCoinAmount } = item;
        let explainText = '';
        let textColor = status === 2 ? DesignRule.textColor_redWarn : (status === 3 ? DesignRule.color_green : DesignRule.textColor_instruction);
        switch (status) {
            case 2:
                explainText = '去支付 >>';
                break;
            case 3:
                if (expandId) {
                    explainText = '交易成功';
                } else {
                    explainText = '管理员赠送';
                }
                break;
            case 4:
                explainText = '交易失败';
                break;
            case 5:
                explainText = '交易关闭';
                break;
        }
        return (
            <View style={styles.itemView}>
                <NoMoreClick style={styles.itemContentView} onPress={() => {
                    this._check(status, orderNo, price, tokenCoinAmount);
                }}>
                    <View style={styles.itemVerticalView}>
                        <Text style={styles.contentText}>{`店铺扩容${personNum || ''}人`}</Text>
                        <Text
                            style={styles.dateText}>{`${StringUtils.isNoEmpty(payTime) && DateUtils.formatDate(payTime) || ''}`}</Text>
                    </View>
                    <View style={[styles.itemVerticalView, { alignItems: 'flex-end' }]}>
                        <Text style={styles.moneyText}>{`¥${price.toFixed(2)}`}</Text>
                        <Text style={[styles.explainText, { color: textColor }]}>{explainText}</Text>
                    </View>
                </NoMoreClick>
            </View>
        );
    };
    /**
     * 检测此订单是否支付过
     * @param status
     * @param orderNo
     * @param price
     * @param tokenCoinAmount
     * @private
     */
    _check = (status, orderNo, price, tokenCoinAmount) => {
        if (status !== 2) {
            return;
        }
        payment.checkOrderStatus(orderNo, 1, 1, price).then(result => {
            if (result.code === payStatus.payNo) {
                this._toPay(orderNo, price, tokenCoinAmount, payStatus.payNo);
            } else if (result.code === payStatus.payNeedThrid) {
                this._toPay(orderNo, Math.floor(result.unpaidAmount * 100) / 100, 0, payStatus.payNeedThrid);
            } else if (result.code === payStatus.payOut) {
                Toast.$toast(payStatusMsg[result.code]);
            } else {
                Toast.$toast(payStatusMsg[result.code]);
            }
        }).catch(err => {
            Toast.$toast(err.msg);
        });

    };
    _toPay = (orderNo, price, tokenCoinAmount, payType) => {
        if (payType === payStatus.payNo) {
            this.$navigate(RouterMap.PaymentPage, {
                platformOrderNo: orderNo,
                amounts: price,
                orderProductList: [{ productName: '拼店扩容' }],
                bizType: 1,
                modeType: 1,
                oneCoupon: tokenCoinAmount
            });
        } else {
            this.$navigate(RouterMap.ChannelPage, {
                platformOrderNo: orderNo,
                amounts: price,
                orderProductList: [{ productName: '拼店扩容' }],
                bizType: 1,
                modeType: 1,
                oneCoupon: tokenCoinAmount
            });
        }
    };
    _ListEmptyComponent = () => {
        return <EmptyView style={{ marginTop: 70 }} description='暂无扩容记录'/>;
    };
    _keyExtractor = (item, index) => {
        return index + item.orderNo + '';
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={this.state.dataList}
                          refreshControl={
                              <RefreshControl
                                  refreshing={this.state.refreshing}
                                  onRefresh={this._refreshing.bind(this)}
                                  title="下拉刷新"
                                  tintColor={DesignRule.textColor_instruction}
                                  titleColor={DesignRule.textColor_instruction}
                                  colors={[DesignRule.mainColor]}/>}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          onEndReached={this._onEndReached}
                          onEndReachedThreshold={0.3}
                          ListFooterComponent={this._ListFooterComponent}
                          ListEmptyComponent={this._ListEmptyComponent}/>
                {this.state.showExpand ? <NoMoreClick style={styles.addBtn} onPress={this._addBtnAction}>
                    <Text style={styles.addText}>继续扩容</Text>
                </NoMoreClick> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemView: {
        marginTop: 20, marginHorizontal: 15,
        height: 76, borderRadius: 5, backgroundColor: DesignRule.white
    },
    itemContentView: {
        flex: 1, flexDirection: 'row', justifyContent: 'space-between',
        margin: 15
    },
    itemVerticalView: {
        justifyContent: 'space-between'
    },
    contentText: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    dateText: {
        fontSize: 11, color: DesignRule.textColor_instruction
    },
    moneyText: {
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    explainText: {
        fontSize: 13
    },
    addBtn: {
        justifyContent: 'center', alignItems: 'center',
        marginBottom: ScreenUtils.safeBottom + 10, marginHorizontal: 15,
        borderRadius: 20, height: 40, backgroundColor: DesignRule.bgColor_btn
    },
    addText: {
        color: DesignRule.textColor_white, fontSize: 15
    }
});


export default AddCapacityHistoryPage;
