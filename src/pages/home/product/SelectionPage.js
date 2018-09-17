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

export default class SelectionPage extends Component {

    static propTypes = {
        selectionViewConfirm: PropTypes.func.isRequired,
        selectionViewClose: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        const { specMap, product, price, priceList } = this.props.data;

        //提取规格处理id
        let tittleList = [];
        for (let key in specMap) {
            tittleList.push(key);
            specMap[key].forEach((item) => {
                if (String(item.id).indexOf(',') === -1) {
                    item.id = `,${item.id},`;
                }
            });
        }

        //修改priceList中的specIds首尾增加','
        priceList.forEach((item) => {
            item.specIds = `,${item.specIds},`;
        });

        this.state = {
            product: product || {},
            price: price,
            tittleList: tittleList,

            priceList: [],
            priceSeletedList: [],
            specMap: [],


            selectList: [],
            selectStrList: []
        };

    }

    componentDidMount() {
        this._priceListAll();
        this._specMap();
    }

    _priceListAll = (indexOfProp) => {

        const { priceList } = this.props.data;
        //this.state.selectList元数据不能被修改  只能在_clickItemAction中修改
        let [...selectList] = this.state.selectList;

        //根据最新选择下标获取别的row的数据
        this.state.priceList = priceList.filter((item) => {
            let isContainer = true;
            if (selectList[indexOfProp] !== undefined && item.specIds.indexOf(selectList[indexOfProp]) === -1) {
                isContainer = false;
            }
            return isContainer;
        });

        //根据别的row的状态获取当前选择row的数据
        if (indexOfProp !== undefined) {
            selectList[indexOfProp] = undefined;
        }
        this.state.priceSeletedList = priceList.filter((item) => {
            let isContainer = true;
            selectList.forEach((selectSpecId) => {
                if (selectSpecId !== undefined && item.specIds.indexOf(selectSpecId) === -1) {
                    isContainer = false;
                }
            });
            return isContainer;
        });
    };


    //根据priceList库存修改specMap中是否可点击
    _specMap = (indexOfProp, tittle) => {
        const { specMap } = this.props.data;

        let needUpdate = false;
        for (let key in specMap) {
            if (tittle !== key) {//非选中列（根据最新选择的下标得到的）

                //把非选中列的数据
                let tempIndex = this.state.tittleList.indexOf(key);

                specMap[key].forEach((item) => {
                    item.isSelected = this.state.selectList.indexOf(item.id) !== -1;
                    //查看priceList库存是否包含item的id
                    item.canSelected = false;
                    this.state.priceList.forEach((priceListItem) => {
                        if (priceListItem.specIds !== undefined && priceListItem.specIds.indexOf(item.id) !== -1) {
                            item.canSelected = true;
                        }
                    });

                    //（新）不能被选中并且（旧）选中状态 需要都重置 然后更新
                    if (!item.canSelected && item.isSelected && tempIndex !== -1) {
                        item.isSelected = false;

                        this.state.selectList[tempIndex] = undefined;
                        this.state.selectStrList[tempIndex] = undefined;

                        needUpdate = true;
                    }
                });
            }

            if (tittle === key && !needUpdate) {//选中列查找使用的值
                specMap[key].forEach((item) => {
                    item.isSelected = this.state.selectList.indexOf(item.id) !== -1;
                    //查看priceSeletedList库存是否包含item的id
                    item.canSelected = false;
                    this.state.priceSeletedList.forEach((priceListItem) => {
                        if (priceListItem.specIds !== undefined && priceListItem.specIds.indexOf(item.id) !== -1) {
                            item.canSelected = true;
                        }
                    });
                });
            }
        }

        if (needUpdate) {
            this._priceListAll(indexOfProp);
            this._specMap(indexOfProp);
        } else {
            this.state.specMap = specMap;
            this.forceUpdate();
        }

    };

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

    _addSelectionSectionView = () => {

        let tagList = [];
        let index = 0;
        for (let key in this.state.specMap) {
            tagList.push(
                <SelectionSectionView clickItemAction={this._clickItemAction} listData={this.state.specMap[key]}
                                      indexOfProp={index} tittle={key} key = {key}/>
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
                    </ScrollView>

                    <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
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

