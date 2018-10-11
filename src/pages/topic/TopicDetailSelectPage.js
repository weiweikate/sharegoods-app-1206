import React, { Component } from 'react';
import PropTypes from 'prop-types';
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


export default class TopicDetailSelectPage extends Component {

    static propTypes = {
        selectionViewConfirm: PropTypes.func.isRequired,
        selectionViewClose: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        const { specMap, product, price } = this.props.data;

        //提取规格处理id
        let tittleList = [];
        for (let key in specMap) {
            tittleList.push(key);
        }
        this.state = {
            product: product || {},
            price: price,
            tittleList: tittleList,

            priceList: [],//根据最新选择下标获取别的row的数据
            priceSeletedList: [],//根据别的row的状态获取当前选择row的数据
            specMap: [],//所有规格  额外增加了isSelected  canSelected


            selectList: [],//选择的规格id数组
            selectStrList: [],//选择的规格名称值
            amount: 1
        };

    }

    componentDidMount() {
    }

    _clickItemAction = (item, indexOfProp, tittle) => {
        if (item.isSelected) {
            this.state.selectList[indexOfProp] = undefined;
            this.state.selectStrList[indexOfProp] = undefined;
            item.isSelected = false;
        } else {
            this.state.selectList[indexOfProp] = item.id;
            this.state.selectStrList[indexOfProp] = item.specValue;
        }

        this._priceListAll(indexOfProp);
        this._specMap(indexOfProp, tittle);
    };

    _amountClickAction = (amount) => {
        this.state.amount = amount;
    };

    _selectionViewConfirm = () => {
        this.props.selectionViewConfirm(this.state.amount, 1);
        this.props.selectionViewClose();
    };

    _addSelectionSectionView = () => {

        let tagList = [];
        let index = 0;
        for (let key in this.state.specMap) {
            tagList.push(
                <SelectionSectionView clickItemAction={this._clickItemAction} listData={this.state.specMap[key]}
                                      indexOfProp={index} tittle={key} key={key}/>
            );
            index++;
        }
        return tagList;
    };

    render() {
        return (
            <View style={styles.container}>

                <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
                    <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                </TouchableWithoutFeedback>

                <View style={{ backgroundColor: 'white', flex: 1 }}>

                    <SelectionHeaderView product={this.state.product}
                                         price={this.state.price}
                                         selectList={this.state.selectList}
                                         selectStrList={this.state.selectStrList}
                                         priceList={this.state.priceList}/>

                    < ScrollView>
                        {this._addSelectionSectionView()}
                        <SelectionAmountView style={{ marginTop: 30 }} amountClickAction={this._amountClickAction}/>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(59, 59, 59, 0.7)',
        flex: 1
    }

});

