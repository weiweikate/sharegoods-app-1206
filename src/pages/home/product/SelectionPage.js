import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    ScrollView
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import SelectionHeaderView from './components/SelectionHeaderView';
import SelectionSectionView from './components/SelectionSectionView';
import SelectionAmountView from './components/SelectionAmountView';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import Modal from 'CommModal';


export default class SelectionPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: {},
            callBack: undefined,
            propData: {},
            specMap: {},
            priceList: [],
            tittleList: [],

            selectList: [],//选择的id数组
            selectStrList: [],//选择的名称值
            selectSpecList: [],//选择规格所对应的库存,
            maxStock: 0,//最大库存

            amount: 1
        };
    }

    show = (data, callBack, propData = {}) => {
        //type
        //需要重置旧数据
        if (propData.needUpdate) {
            this.state.selectList = [];
            this.state.selectStrList = [];
            this.state.selectSpecList = [];
            this.state.maxStock = 0;
        }
        const { specMap = {}, priceList = [] } = data;
        let specMapTemp = JSON.parse(JSON.stringify(specMap));
        let priceListTemp = JSON.parse(JSON.stringify(priceList));
        //修改specMapTemp每个元素首尾增加'，'
        for (let key in specMapTemp) {
            specMapTemp[key].forEach((item) => {
                if (String(item.id).indexOf(',') === -1) {
                    item.id = `,${item.id},`;
                }
            });
        }
        //修改priceListTemp中的specIds首尾增加','
        priceListTemp.forEach((item) => {
            item.specIds = `,${item.specIds},`;
        });

        //提取规格处理id
        let tittleList = [];
        for (let key in specMapTemp) {
            tittleList.push(key);
        }

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
    };

    _clickItemAction = (item, indexOfProp) => {
        if (item.isSelected) {
            this.state.selectList[indexOfProp] = undefined;
            this.state.selectStrList[indexOfProp] = undefined;
        } else {
            this.state.selectList[indexOfProp] = item.id;
            this.state.selectStrList[indexOfProp] = item.specValue;
        }
        this._indexCanSelectedItems();
    };

    //获取各个列表数据 刷新页面状态
    _indexCanSelectedItems = () => {
        //afterPrice
        //type
        const { afterPrice, type } = this.state.propData;
        let tempArr = [];
        this.state.tittleList.forEach((item, index) => {
            tempArr[index] = this._indexCanSelectedItem(index);
        });
        const { specMap = {} } = this.state;
        let index = 0, isFirst = true, needUpdate = false;
        //总
        for (let key in specMap) {
            //每行
            specMap[key].forEach((item) => {
                //item 每个
                item.isSelected = this.state.selectList.indexOf(item.id) !== -1;
                item.canSelected = false;
                //tempArr[index] 每行符合的数据
                tempArr[index].forEach((item1) => {
                    //库存中有&&剩余数量不为0
                    if (item1.specIds.indexOf(item.id) !== -1 && item1.stock !== 0) {
                        //如果是退换货多一次判断
                        if (type === 'after') {
                            if (afterPrice === item1.price) {
                                item.canSelected = true;
                            }
                        } else {
                            item.canSelected = true;
                        }
                        //单规格默认选中
                        //可以被选择 && 单规格 && 目前没被选择 && 当前总循环第一次
                        if (item.canSelected && specMap[key].length === 1 && !item.isSelected && isFirst) {
                            isFirst = false;
                            needUpdate = true;
                            this.state.selectList[index] = item.id;
                            this.state.selectStrList[index] = item.specValue;
                        }

                    }
                });
            });
            index++;
        }
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
            stock = stock + item.stock;
        });
        this.state.maxStock = stock;
    };

    //index?获取当前列外符合条件的数据:全部数据
    _indexCanSelectedItem = (index) => {
        let [...tempList] = this.state.selectList;
        if (index !== undefined) {
            tempList[index] = undefined;
        }

        let priceArr = [];
        tempList.forEach((item) => {
            if (StringUtils.isNoEmpty(item)) {
                priceArr.push(item.replace(/,/g, ''));
            }
        });
        //冒泡specId从小到大
        for (let i = 0; i < priceArr.length - 1; i++) {
            for (let j = 0; j < priceArr.length - 1 - i; j++) {
                if (priceArr[j] > priceArr[j + 1]) {
                    let tmp = priceArr[j + 1];
                    priceArr[j + 1] = priceArr[j];
                    priceArr[j] = tmp;
                }
            }
        }

        let tempArr = [];
        const { priceList = [] } = this.state;
        if (priceArr.length === 0) {
            tempArr = priceList;
        } else {
            tempArr = priceList.filter((item) => {
                let contain = true;
                priceArr.forEach((priceItem) => {
                    //item.specIds不包含priceArr中的任意元素
                    if (item.specIds.indexOf(`,${priceItem},`) == -1) {
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

        let priceArr = [];
        let isAll = true;

        const { specMap = {} } = this.state;

        this.state.selectList.forEach((item) => {
            if (StringUtils.isEmpty(item)) {
                isAll = false;
            } else {
                priceArr.push(item.replace(/,/g, ''));
            }
        });

        if (!isAll || this.state.selectList.length !== Object.keys(specMap).length) {
            bridge.$toast('请选择规格');
            return;
        }

        //冒泡specId从小到大
        for (let i = 0; i < priceArr.length - 1; i++) {
            for (let j = 0; j < priceArr.length - 1 - i; j++) {
                if (priceArr[j] > priceArr[j + 1]) {
                    let tmp = priceArr[j + 1];
                    priceArr[j + 1] = priceArr[j];
                    priceArr[j] = tmp;
                }
            }
        }

        let priceId = priceArr.join(',');
        priceId = `,${priceId},`;
        let itemData = undefined;
        const { priceList = [] } = this.state;
        priceList.forEach((item) => {
            if (item.specIds === priceId) {
                itemData = item;
                return;
            }
        });
        if (!itemData) {
            return;
        }
        this.setState({ modalVisible: false }, () => {
            this.state.callBack(this.state.amount, itemData.id, itemData.spec, itemData.specImg);
        });
    };

    _addSelectionSectionView = () => {
        const { specMap = {} } = this.state;
        let tagList = [];
        let index = 0;
        for (let key in specMap) {
            tagList.push(<SelectionSectionView key={key}
                                               indexOfProp={index}
                                               tittle={key}
                                               listData={specMap[key]}
                                               clickItemAction={this._clickItemAction}/>);
            index++;
        }
        return tagList;
    };

    render() {
        const { product = {}, price = '' } = this.state.data;
        const { afterAmount, type } = this.state.propData;
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({ modalVisible: false })}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })}>
                        <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1 }}>
                        <SelectionHeaderView product={product}
                                             price={price}
                                             selectList={this.state.selectList}
                                             selectStrList={this.state.selectStrList}
                                             selectSpecList={this.state.selectSpecList}
                                             closeSelectionPage={() => this.setState({ modalVisible: false })}/>
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <ScrollView>
                                {this._addSelectionSectionView()}
                                <SelectionAmountView style={{ marginTop: 30 }}
                                                     amountClickAction={this._amountClickAction}
                                                     maxCount={this.state.maxStock} afterAmount={afterAmount}
                                                     type={type}/>
                            </ScrollView>
                            <TouchableWithoutFeedback onPress={this._selectionViewConfirm}>
                                <View style={{
                                    height: 49,
                                    backgroundColor: '#D51243',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 16, color: '#FFFFFF' }}>确认</Text>
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

