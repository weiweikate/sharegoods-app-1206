import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import StringUtils from '../../utils/StringUtils';
import bridge from '../../utils/bridge';
import icon_close from '../home/product/res/icon_close.png';
import Modal from 'CommModal';

export default class TopicDetailSelectPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            data: {},
            selectionViewConfirm: undefined,

            selectList: [],
            selectStrList: [],
            selectData: []
        };
    }

    show = (data, selectionViewConfirm) => {
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
        this.state.selectList.forEach((item, index) => {
            if (StringUtils.isEmpty(item)) {
                isAll = false;
            }
        });
        if (this.state.selectList.length === Object.keys(specPriceList).length && isAll) {
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
            this.state.selectList[indexOfTop] = undefined;
            this.state.selectStrList[indexOfTop] = undefined;
            this.state.selectData[indexOfTop] = undefined;
        } else {
            this.state.selectList[indexOfTop] = item.id;
            this.state.selectStrList[indexOfTop] = item.specValues;
            this.state.selectData[indexOfTop] = item;
        }
        this.forceUpdate();
    };

    rendTag = (data, indexOfTop) => {
        let tagList = [];
        for (let index = 0; index < data.length; index++) {
            let obj = data[index];
            obj.canSelected = obj.surplusNumber > 0;
            if (obj.canSelected && data.length === 1) {
                this.state.selectList[indexOfTop] = obj.id;
                this.state.selectStrList[indexOfTop] = obj.specValues;
                this.state.selectData[indexOfTop] = obj;
            }
            obj.isSelected = obj.id === this.state.selectList[indexOfTop];

            tagList.push(
                <View key={index}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: obj.isSelected ? '#D51243' : '#EEEEEE' }]}
                        onPress={() => {
                            this._clickItemAction(obj, indexOfTop);
                        }}>
                        <Text
                            style={[styles.btnText, { color: obj.isSelected ? 'white' : obj.canSelected ? '#666666' : 'white' }]}>{data[index].specValues}</Text>
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
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{obj.productName || ''}</Text>
                    </View>
                    <View style={styles.containerView}>
                        {this.rendTag(specPriceList[key], indexOfTop)}
                    </View>
                    <View style={{ height: 1, marginTop: 15, marginLeft: 16, backgroundColor: '#eeeeee' }}/>
                </View>
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
        let tagList = [];
        const { specPriceList = {} } = this.state.data || {};
        for (let key in specPriceList) {
            let tempArr = specPriceList[key];
            tempArr.forEach((item) => {
                tagList.push(item.surplusNumber);
            });
        }
        let surplusNumber = Math.min.apply(Math, tagList);

        const { imgUrl = '', levelPrice = '' } = this.state.data || {};
        let specs = this.state.selectStrList.join(',');
        return (
            <Modal animationType="none" transparent={true} visible={this.state.isShow}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={this._close}>
                        <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                    </TouchableWithoutFeedback>

                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <Image style={{
                                height: 107,
                                width: 107,
                                borderColor: '#EEEEEE',
                                backgroundColor: '#eee',
                                borderWidth: 1,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                top: 0,
                                left: 15,
                                zIndex: 1
                            }} source={{ uri: imgUrl }}/>

                            <View style={{ backgroundColor: 'white', marginTop: 20, height: 87 }}>
                                <View style={{ marginLeft: 132 }}>
                                    <Text style={{
                                        color: '#D51243',
                                        fontSize: 16,
                                        fontFamily: 'PingFang-SC-Medium',
                                        marginTop: 16
                                    }}>{`￥${levelPrice}`}</Text>
                                    <Text
                                        style={{
                                            color: '#222222',
                                            fontSize: 13,
                                            marginTop: 8
                                        }}>{`库存${surplusNumber}件`}</Text>
                                    <Text style={{
                                        color: '#222222',
                                        fontSize: 13,
                                        marginTop: 8
                                    }}>{specs}</Text>
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
                                    <Text style={{ color: '#666666', marginLeft: 16, fontSize: 13 }}>购买数量</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        borderColor: '#dddddd',
                                        borderWidth: 1,
                                        borderRadius: 2,
                                        marginRight: 16
                                    }}>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{
                                                color: '#dddddd',
                                                fontSize: 15,
                                                paddingHorizontal: 11
                                            }}>-</Text>
                                        </TouchableOpacity>
                                        <View style={{ height: 21, width: 1, backgroundColor: '#dddddd' }}/>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ paddingHorizontal: 15 }}>{1}</Text>
                                        </View>
                                        <View style={{ height: 21, width: 1, backgroundColor: '#dddddd' }}/>
                                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{
                                                color: '#222222',
                                                fontSize: 15,
                                                paddingHorizontal: 11
                                            }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
        width: ScreenUtils.width,
        backgroundColor: 'rgba(59, 59, 59, 0.7)',
        flex: 1
    },
    headerContainer: {
        marginTop: 18,
        marginHorizontal: 16,
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 13,
        color: '#666666'
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

