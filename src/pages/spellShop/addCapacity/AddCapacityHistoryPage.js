import React from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
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

export class AddCapacityHistoryPage extends BasePage {
    $navigationBarOptions = {
        title: '我的扩容'
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            dataList: [],
            showExpand: false
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState
        };
    };

    componentDidMount() {
        SpellShopApi.store_record({
            storeCode: spellStatusModel.storeCode,
            page: 1,
            pageSize: 100
        }).then((data) => {
            //isMore
            const dataTemp = data.data || {};
            //
            const dataArrTemp = dataTemp.data || [];
            this.setState({
                dataList: dataArrTemp,
                loadingState: PageLoadingState.success
            });
        }).catch(() => {
            this.setState({
                loadingState: PageLoadingState.fail
            });
        });

        SpellShopApi.store_person({ storeCode: spellStatusModel.storeCode }).then((data) => {
            const dataTemp = data.data || {};
            const { showExpand } = dataTemp;
            this.setState({
                showExpand
            });
        });
    }

    _addBtnAction = () => {
        this.$navigate(RouterMap.AddCapacityPage, { storeData: this.params.storeData });
    };

    _renderItem = ({ item }) => {
        const { payTime, personNum, price, status } = item;
        let explainText = '';
        let textColor = status === 1 ? DesignRule.textColor_redWarn : (status === 3 ? DesignRule.color_green : DesignRule.textColor_instruction);
        switch (status) {
            case 2:
                explainText = '去支付 >>';
                break;
            case 3:
                explainText = '交易成功';
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
    _ListEmptyComponent = () => {
        return <EmptyView style={{ marginTop: 70 }} description='暂无扩容记录'/>;
    };
    _keyExtractor = (item, index) => {
        return index + item.id + '';
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={this.state.dataList}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
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
