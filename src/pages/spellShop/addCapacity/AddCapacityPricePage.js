import React from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import BasePage from '../../../BasePage';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import PickTicketModal from './components/PickTicketModal';
import res from '../res';
import SpellShopApi from '../api/SpellShopApi';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';

const ArrowImg = res.shopSetting.xjt_03;

export class AddCapacityPricePage extends BasePage {
    $navigationBarOptions = {
        title: '我的扩容'
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            dataList: [],
            amount: 0,
            selectedItem: {}
        };
    }

    componentDidMount() {
        SpellShopApi.store_expend({ storeCode: this.params.storeData.storeNumber }).then((data) => {
            const dataTemp = data.data || {};
            this.setState({
                dataList: dataTemp || []
            });
        });
    }

    _addBtnAction = () => {
        SpellShopApi.store_save({ storeCode: this.params.storeData.storeNumber }).then(() => {
            this.$toastShow('去支付啦');
        });
    };

    _itemBtnAction = (selectedIndex) => {
        let selectedItem = {};
        let tempArr = [...this.state.dataList];
        tempArr.forEach((item, index) => {
            if (selectedIndex === index) {
                item.isSelected = true;
                selectedItem = item;
            } else {
                item.isSelected = false;
            }
        });
        this.setState({
            selectedItem,
            dataList: tempArr
        });
    };

    _oneMoneyAction = () => {
        this.PickTicketModal.show({
            callBack: (amount) => {
                this.setState({
                    amount
                });
            }
        });
    };

    _listHeaderComponent = () => {
        return (
            <View>
                <Text style={styles.headerText}>请选择扩容人数</Text>
            </View>
        );
    };

    _renderItem = ({ item, index }) => {
        const { isSelected, personNum, discountPrice, price, invalid } = item;
        const itemColor = isSelected ? DesignRule.white : DesignRule.textColor_mainTitle;
        return (
            <View>
                <NoMoreClick style={[styles.itemBtn, isSelected ? { backgroundColor: DesignRule.bgColor_btn } : {
                    borderWidth: 1,
                    borderColor: DesignRule.lineColor_inWhiteBg
                }]} onPress={() => this._itemBtnAction(index)} disabled={invalid}>
                    <Text style={[styles.itemLeftText, { color: itemColor }]}>{`${personNum}人`}</Text>
                    <View style={styles.itemRightView}>
                        {discountPrice ?
                            <Text style={[styles.itemOriginText, itemColor]}>{`¥${discountPrice}`}</Text> : null}
                        <Text style={{ fontSize: discountPrice ? 12 : 17, color: itemColor }}>{`¥${price}`}</Text>
                    </View>
                </NoMoreClick>
            </View>
        );
    };

    _keyExtractor = (item, index) => {
        return index + item.id + '';
    };

    _listFooterComponent = () => {
        const { discountPrice } = this.state.selectedItem;
        let money = (discountPrice || 0) - (this.state.amount || 0);
        return (
            <View style={styles.footerView}>
                <NoMoreClick style={styles.footerItemView} onPress={this._oneMoneyAction}>
                    <Text style={styles.footerItemLeftText}>1元现金券</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.footerOneMoneyText}>-¥{this.state.amount}</Text>
                        <Image source={ArrowImg}/>
                    </View>
                </NoMoreClick>
                <View style={styles.footerItemView}>
                    <Text style={styles.footerItemLeftText}>实际付款</Text>
                    <Text style={styles.footerPayMoneyText}>¥{money}</Text>
                </View>
            </View>
        );
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList data={this.state.dataList}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          ListHeaderComponent={this._listHeaderComponent}
                          ListFooterComponent={this._listFooterComponent}/>
                <NoMoreClick style={styles.payBtn} onPress={this._addBtnAction}>
                    <Text style={styles.payText}>去支付</Text>
                </NoMoreClick>
                <PickTicketModal ref={(ref) => {
                    this.PickTicketModal = ref;
                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        paddingHorizontal: 15, paddingTop: 15,
        fontSize: 13, color: DesignRule.textColor_instruction
    },
    itemBtn: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginHorizontal: 15, marginTop: 10,
        borderRadius: 5,
        height: 40
    },
    itemLeftText: {
        fontSize: 13, marginLeft: 15
    },
    itemRightView: {
        flexDirection: 'row', marginRight: 15, alignItems: 'center'
    },
    itemOriginText: {
        fontSize: 17, marginRight: 5
    },
    footerView: {
        marginTop: 15,
        backgroundColor: DesignRule.white
    },
    footerItemView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 15,
        height: 40
    },
    footerItemLeftText: {
        color: DesignRule.textColor_mainTitle, fontSize: 13
    },
    footerOneMoneyText: {
        marginRight: 8,
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    footerPayMoneyText: {
        color: DesignRule.textColor_redWarn, fontSize: 17
    },
    payBtn: {
        justifyContent: 'center', alignItems: 'center',
        marginBottom: ScreenUtils.safeBottom + 10, marginHorizontal: 15,
        borderRadius: 20, height: 40, backgroundColor: DesignRule.bgColor_btn
    },
    payText: {
        color: DesignRule.textColor_white, fontSize: 15
    }
});

export default AddCapacityPricePage;
