import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import SelectionHeaderView from './components/SelectionHeaderView';
import SelectionSectionView from './components/SelectionSectionView';
import SelectionAmountView from './components/SelectionAmountView';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import Modal from '../../../comm/components/CommModal';
import DesignRule from '../../../constants/DesignRule';
import {MRText as Text} from '../../../components/ui';

export default class SelectionPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: {},
            callBack: undefined,
            propData: {},
            specMap: [],//规格
            priceList: [],//库存
            tittleList: [],

            selectStrList: [],//选择的名称值
            selectSpecList: [],//选择规格所对应的所有库存,
            maxStock: 0,//最大库存

            amount: 1
        };
    }

    show = (data, callBack, propData = {}) => {
        //type afterSpecIds
        //需要重置旧数据
        if (propData.needUpdate) {
            this.state.selectStrList = [];
            this.state.selectSpecList = [];
            this.state.maxStock = 0;
        }
        const { specifyList, skuList } = data;
        let specMapTemp = JSON.parse(JSON.stringify(specifyList || []));
        let priceListTemp = JSON.parse(JSON.stringify(skuList || []));

        let tittleList = [];
        //提取规格处理id
        //修改specMapTemp每个元素首尾增加'，'
        specMapTemp.forEach((specifyListItem) => {
            tittleList.push(specifyListItem.specName || '');
        });
        //修改priceListTemp中的propertyValues首尾增加','
        priceListTemp.forEach((item) => {
            item.propertyValues = `@${item.propertyValues}@`;
        });

        this.setState({
            modalVisible: true,
            data: data,
            callBack: callBack,
            propData: propData,
            specMap: specMapTemp,
            priceList: priceListTemp,
            tittleList: tittleList
        }, () => {
            this._indexCanSelectedItems();

        });
        this.modal && this.modal.open();
    };

    _clickItemAction = (item, indexOfProp) => {
        if (item.isSelected) {
            this.state.selectStrList[indexOfProp] = undefined;
        } else {
            this.state.selectStrList[indexOfProp] = `@${item.specValue}@`;
        }
        this._indexCanSelectedItems();
    };

    //获取各个列表数据 刷新页面状态
    _indexCanSelectedItems = () => {
        //afterPrice
        //type after退换货
        const { afterPrice, type, productPriceId } = this.state.propData;
        let tempArr = [];
        this.state.tittleList.forEach((item, index) => {
            tempArr[index] = this._indexCanSelectedItem(index);
        });
        const { specMap } = this.state;
        let isFirst = true, needUpdate = false;
        //总规格
        specMap.forEach((specifyListItem, index) => {
            //每行规格
            let specValues = specifyListItem.specValues || [];
            specValues.forEach((item) => {
                //item每个规格
                item.isSelected = this.state.selectStrList.indexOf(`@${item.specValue}@`) !== -1;
                item.canSelected = false;
                //tempArr[index] 每行符合的数据
                tempArr[index].forEach((item1) => {
                    //库存中有&&剩余数量不为0
                    if (item1.propertyValues.indexOf(`@${item.specValue}@`) !== -1 && item1.sellStock !== 0) {
                        //如果是退换货多一次判断
                        if (type === 'after') {
                            if (afterPrice >= item1.price || productPriceId === item1.id) {
                                item.canSelected = true;
                            }
                        } else {
                            item.canSelected = true;
                        }
                        //单规格默认选中
                        //可以被选择 && 单规格 && 目前没被选择 && 当前总循环第一次
                        if (item.canSelected && specValues.length === 1 && !item.isSelected && isFirst) {
                            isFirst = false;
                            needUpdate = true;
                            this.state.selectStrList[index] = `@${item.specValue}@`;
                        }

                    }
                });
            });
        });
        if (needUpdate) {
            this._indexCanSelectedItems();
        } else {
            this._selelctSpe();
            this.forceUpdate();
        }
    };
    //获取总库存
    _selelctSpe = () => {
        this.state.selectSpecList = this._indexCanSelectedItem();
        let stock = 0;
        this.state.selectSpecList.forEach((item) => {
            //总库存库存遍历相加
            stock = stock + item.sellStock;
        });
        this.state.maxStock = stock;
    };

    //index?获取当前列外符合条件的数据:全部数据
    _indexCanSelectedItem = (index) => {
        let [...tempList] = this.state.selectStrList;
        if (index !== undefined) {
            tempList[index] = undefined;
        }

        let tempArr = [];
        const { priceList } = this.state;
        if (tempList.length === 0) {
            tempArr = priceList;
        } else {
            tempArr = priceList.filter((item) => {
                let contain = true;
                let propertyValues = item.propertyValues || '';
                tempList.forEach((priceItem) => {
                    //item.specIds不包含priceArr中的任意元素就为无
                    if (priceItem && propertyValues.indexOf(priceItem) === -1) {
                        contain = false;
                    }
                });
                return contain;
            });
        }
        return tempArr;
    };

    //购买数量
    _amountClickAction = (amount) => {
        this.state.amount = amount;
    };

    //确认订单
    _selectionViewConfirm = () => {
        const { afterAmount, type } = this.state.propData;
        if (this.state.amount > 200) {
            bridge.$toast('最多只能购买200件~');
            return;
        }
        if (this.state.amount === 0) {
            bridge.$toast('请选择数量');
            return;
        }
        if ((type === 'after' && afterAmount > this.state.maxStock) || this.state.amount > this.state.maxStock) {
            bridge.$toast('超出最大库存~');
            return;
        }

        let isAll = true;

        const { specMap } = this.state;

        this.state.selectStrList.forEach((item) => {
            if (StringUtils.isEmpty(item)) {
                isAll = false;
            }
        });

        if (!isAll || this.state.selectStrList.length !== specMap.length) {
            bridge.$toast('请选择规格');
            return;
        }
        let itemValues = this.state.selectStrList.map((item) => {
            return item.replace(/@/g, '');
        });
        itemValues = itemValues.join('@');
        itemValues = `@${itemValues}@`;
        let itemData;
        const { priceList = [] } = this.state;
        priceList.forEach((item) => {
            if (item.propertyValues === itemValues) {
                itemData = item;
                return;
            }
        });
        if (!itemData) {
            return;
        }
        this.setState({ modalVisible: false }, () => {
            this.state.callBack(this.state.amount, itemData.skuCode, itemData.propertyValues, itemData.specImg);
        });
    };

    _addSelectionSectionView = () => {
        const { specMap } = this.state;
        let tagList = [];
        specMap.forEach((item, index) => {
            tagList.push(<SelectionSectionView key={item.specName}
                                               indexOfProp={index}
                                               tittle={item.specName}
                                               listData={item.specValues}
                                               clickItemAction={this._clickItemAction}/>);
        });
        return tagList;
    };

    render() {
        const { afterAmount, type } = this.state.propData;
        return (
            <Modal
                ref={(ref) => this.modal = ref}
                animationType="none"
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({ modalVisible: false })}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })}>
                        <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1 }}>
                        <SelectionHeaderView product={this.state.data}
                                             selectStrList={this.state.selectStrList}
                                             selectSpecList={this.state.selectSpecList}
                                             closeSelectionPage={() => this.setState({ modalVisible: false })}/>
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <ScrollView>
                                {this._addSelectionSectionView()}
                                <SelectionAmountView style={{ paddingVertical: 30}}
                                                     amountClickAction={this._amountClickAction}
                                                     maxCount={this.state.maxStock} afterAmount={afterAmount}
                                                     type={type}/>
                            </ScrollView>
                            <TouchableWithoutFeedback onPress={this._selectionViewConfirm}>
                                <View style={{
                                    height: 49,
                                    backgroundColor: DesignRule.mainColor,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 16, color: 'white' }} allowFontScaling={false}>确认</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    }

});

