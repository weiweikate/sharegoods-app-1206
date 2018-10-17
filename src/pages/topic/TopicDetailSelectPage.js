import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

export default class TopicDetailSelectPage extends Component {

    static propTypes = {
        selectionViewConfirm: PropTypes.func.isRequired,
        selectionViewClose: PropTypes.func.isRequired,
        data: PropTypes.object.isRequired,
        activityType: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
    }

    _selectionViewConfirm = () => {
        const { productPriceId } = this.props.data || {};
        this.props.selectionViewConfirm(1, productPriceId);
        this.props.selectionViewClose();
    };

    _addSelectionSectionView = () => {
        const { productSpecValue = [] } = this.props.data || {};
        let tagList = [];
        productSpecValue.forEach((obj) => {
            tagList.push(
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{obj.specName}</Text>
                    </View>
                    <View style={styles.containerView}>
                        <View>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: '#D51243' }]}>
                                <Text
                                    style={[styles.btnText, { color: 'white' }]}>{obj.specValue}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: 1, marginTop: 15, marginLeft: 16, backgroundColor: '#eeeeee' }}/>
                </View>
            );
        });
        return tagList;
    };

    render() {
        const { markdownPrice = '', seckillPrice = '', specImg, surplusNumber = 0, spec = '', productSpec = '' } = this.props.data || {};
        let price = this.props.activityType === 1 ? seckillPrice : markdownPrice;
        let specs = this.props.activityType === 1 ? productSpec : spec;

        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
                    <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                </TouchableWithoutFeedback>

                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'transparent' }}>
                        <Image style={{
                            height: 107,
                            width: 107,
                            borderColor: '#EEEEEE',
                            borderWidth: 1,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: 0,
                            left: 15,
                            zIndex: 1
                        }} source={{ uri: specImg || '' }}/>

                        <View style={{ backgroundColor: 'white', marginTop: 20, height: 87 }}>
                            <View style={{ marginLeft: 132 }}>
                                <Text style={{
                                    color: '#D51243',
                                    fontSize: 16,
                                    fontFamily: 'PingFang-SC-Medium',
                                    marginTop: 16
                                }}>{`￥${price}`}</Text>
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
                        </View>
                    </View>

                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        < ScrollView>
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
                                        <Text style={{ color: '#dddddd', fontSize: 15, paddingHorizontal: 11 }}>-</Text>
                                    </TouchableOpacity>
                                    <View style={{ height: 21, width: 1, backgroundColor: '#dddddd' }}/>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ paddingHorizontal: 15 }}>{1}</Text>
                                    </View>
                                    <View style={{ height: 21, width: 1, backgroundColor: '#dddddd' }}/>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#222222', fontSize: 15, paddingHorizontal: 11 }}>+</Text>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
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

