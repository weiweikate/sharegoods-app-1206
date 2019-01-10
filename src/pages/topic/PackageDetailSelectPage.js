import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity, Image
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import StringUtils from '../../utils/StringUtils';
import bridge from '../../utils/bridge';
import Modal from '../../comm/components/CommModal';
import DesignRule from '../../constants/DesignRule';
import res from './res';
import UIImage from '@mr/image-placeholder';
import {
    MRText as Text
} from '../../components/ui';

const icon_close = res.button.close_gray_circle;

export default class TopicDetailSelectPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            data: {},
            selectionViewConfirm: undefined,

            selectStrList: [],
            selectData: []
        };
    }

    show = (data, selectionViewConfirm) => {
        //单规格的默认选择
        const { specPriceList = {} } = data || {};
        let indexOfTop = 0;
        for (let key in specPriceList) {
            let tempArr = specPriceList[key];
            tempArr.forEach((item) => {
                if (item.surplusNumber > 0 && tempArr.length === 1) {
                    this.state.selectStrList[indexOfTop] = item.specValues;
                    this.state.selectData[indexOfTop] = item;
                }
            });
            indexOfTop++;
        }

        this.setState({
            isShow: true,
            data: JSON.parse(JSON.stringify(data)) || {},
            selectionViewConfirm: selectionViewConfirm
        });
    };

    componentDidMount() {

    }

    _selectionViewConfirm = () => {
        const { specPriceList = {} } = this.state.data || {};
        let isAll = true;
        this.state.selectData.forEach((item, index) => {
            if (!item) {
                isAll = false;
            }
        });
        if (this.state.selectData.length === Object.keys(specPriceList).length && isAll) {
            this.state.selectionViewConfirm(1, this.state.selectData);
            this._close();
        } else {
            bridge.$toast('请选择规格');
        }
    };

    _clickItemAction = (item, indexOfTop) => {
        if (!item.canSelected) {
            return;
        }
        if (item.isSelected) {
            this.state.selectStrList[indexOfTop] = undefined;
            this.state.selectData[indexOfTop] = undefined;
        } else {
            this.state.selectStrList[indexOfTop] = item.specValues;
            this.state.selectData[indexOfTop] = item;
        }
        this.forceUpdate();
    };

    rendTag = (data, indexOfTop) => {
        let tagList = [];
        for (let index = 0; index < data.length; index++) {
            let obj = data[index] || {};
            let selectItem = this.state.selectData[indexOfTop] || {};
            //单规格默认选中状态不让选
            obj.canSelected = obj.surplusNumber > 0 && data.length !== 1;
            obj.isSelected = obj.skuCode === selectItem.skuCode;

            tagList.push(
                <View key={index}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: obj.isSelected ? DesignRule.mainColor : DesignRule.lineColor_inColorBg }]}
                        onPress={() => {
                            this._clickItemAction(obj, indexOfTop);
                        }}>
                        <Text
                            style={[styles.btnText, { color: obj.isSelected ? 'white' : obj.canSelected ? DesignRule.textColor_secondTitle : DesignRule.color_ddd }]}
                            allowFontScaling={false} numberOfLines={1}>{data[index].specValues}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return tagList;
    };

    _addSelectionSectionView = () => {
        const { specPriceList = {} } = this.state.data || {};
        let tagList = [];
        let indexOfTop = 0;
        for (let key in specPriceList) {
            let tempArr = specPriceList[key];
            let obj = tempArr[0] || {};
            tagList.push(
                <TouchableWithoutFeedback>
                    <View>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText} allowFontScaling={false}>{obj.productName || ''}</Text>
                        </View>
                        <View style={styles.containerView}>
                            {this.rendTag(specPriceList[key], indexOfTop)}
                        </View>
                        <View style={{
                            height: 1,
                            marginTop: 15,
                            marginLeft: 16,
                            backgroundColor: DesignRule.lineColor_inColorBg
                        }}/>
                    </View>
                </TouchableWithoutFeedback>
            );
            indexOfTop++;
        }
        return tagList;
    };

    _close = () => {
        this.setState({
                isShow: false
            }
        );
    };

    render() {
        let surplusNumber, tagList = [];
        this.state.selectData.forEach((item) => {
            if (item) {
                tagList.push(item.surplusNumber);
            }
        });

        //有选项取最小  没选项取列数字最大
        if (tagList.length === 0) {
            const { specPriceList = {} } = this.state.data || {};
            for (let key in specPriceList) {
                let tempArr = specPriceList[key];
                let tempNum = 0;
                tempArr.forEach((item) => {
                    tempNum = tempNum + item.surplusNumber;
                });
                tagList.push(tempNum);
            }
            surplusNumber = Math.max.apply(Math, tagList);
        } else {
            surplusNumber = Math.min.apply(Math, tagList);
        }

        const { imgUrl = '', levelPrice = '' } = this.state.data || {};

        let specs = this.state.selectStrList.filter((item) => {
            return !StringUtils.isEmpty(item);
        });
        return (
            <Modal animationType="none" transparent={true} visible={this.state.isShow}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={this._close}>
                        <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                    </TouchableWithoutFeedback>

                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <UIImage style={styles.headerImg} source={{ uri: imgUrl }} borderRadius={5}/>

                            <View style={{ backgroundColor: 'white', marginTop: 20, height: 95 }}>
                                <View style={{ marginLeft: 132 }}>
                                    <Text style={{
                                        color: DesignRule.mainColor,
                                        fontSize: 16,
                                        marginTop: 14
                                    }} allowFontScaling={false}>{`￥${levelPrice}`}</Text>
                                    <Text
                                        style={{
                                            color: DesignRule.textColor_mainTitle,
                                            fontSize: 13,
                                            marginTop: 6
                                        }} allowFontScaling={false}>{`库存${surplusNumber}件`}</Text>
                                    <Text style={{
                                        color: DesignRule.textColor_mainTitle,
                                        fontSize: 13,
                                        marginTop: 6
                                    }} numberOfLines={2} allowFontScaling={false}>{specs.join(',')}</Text>
                                </View>
                                <TouchableOpacity style={{ position: 'absolute', top: 16, right: 16 }}
                                                  onPress={this._close}>
                                    <Image source={icon_close}/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <ScrollView>
                                {this._addSelectionSectionView()}
                                <View style={[{
                                    flexDirection: 'row',
                                    height: 60,
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }]}>
                                    <Text style={{
                                        color: DesignRule.textColor_secondTitle,
                                        marginLeft: 16,
                                        fontSize: 13
                                    }} allowFontScaling={false}>购买数量</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        borderColor: DesignRule.lineColor_inGrayBg,
                                        borderWidth: 1,
                                        borderRadius: 2,
                                        marginRight: 16
                                    }}>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{
                                                color: DesignRule.lineColor_inGrayBg,
                                                fontSize: 15,
                                                paddingHorizontal: 11
                                            }} allowFontScaling={false}>-</Text>
                                        </TouchableOpacity>
                                        <View style={{
                                            height: 21,
                                            width: 1,
                                            backgroundColor: DesignRule.lineColor_inGrayBg
                                        }}/>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{
                                                paddingHorizontal: 15,
                                                color: DesignRule.textColor_mainTitle
                                            }} allowFontScaling={false}>{1}</Text>
                                        </View>
                                        <View style={{
                                            height: 21,
                                            width: 1,
                                            backgroundColor: DesignRule.lineColor_inGrayBg
                                        }}/>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{
                                                color: DesignRule.lineColor_inGrayBg,
                                                fontSize: 15,
                                                paddingHorizontal: 11
                                            }} allowFontScaling={false}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
        width: ScreenUtils.width,
        backgroundColor: 'rgba(59, 59, 59, 0.7)',
        flex: 1
    },
    headerImg: {
        height: 107,
        width: 107,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 15,
        zIndex: 1
    },
    headerContainer: {
        marginTop: 18,
        marginHorizontal: 16,
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 13,
        color: DesignRule.textColor_secondTitle
    },

    containerView: {
        marginTop: 6,
        flexDirection: 'row',   // 水平排布
        flexWrap: 'wrap',
        alignItems: 'center',
        marginHorizontal: 16
    },
    btn: {
        justifyContent: 'center',
        marginTop: 10,
        marginRight: 10,
        height: 30,
        borderRadius: 3
    },
    btnText: {
        paddingHorizontal: 12,
        fontSize: 13
    }
});

