import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import Modal from '../../comm/components/CommModal';
import DesignRule from '../../constants/DesignRule';
import res from './res';
import ImageLoad from '@mr/image-placeholder';
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
            activityType: undefined,
            selectionViewConfirm: undefined
        };

    }

    show = (data, activityType, selectionViewConfirm) => {
        this.setState({
            isShow: true,
            data: JSON.parse(JSON.stringify(data)) || {},
            activityType: activityType,
            selectionViewConfirm: selectionViewConfirm
        });
    };

    componentDidMount() {
    }

    _selectionViewConfirm = () => {
        const { skuCode } = this.state.data || {};
        this.state.selectionViewConfirm(1, skuCode);
        this._close();
    };

    _addSelectionSectionView = () => {
        const { productSpecValue = [] } = this.state.data || {};
        let tagList = [];
        productSpecValue.forEach((obj) => {
            tagList.push(
                <TouchableWithoutFeedback>
                    <View>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerText} allowFontScaling={false}>{obj.paramName}</Text>
                        </View>
                        <View style={styles.containerView}>
                            <View>
                                <TouchableOpacity
                                    style={[styles.btn, { backgroundColor: DesignRule.mainColor }]}>
                                    <Text
                                        style={[styles.btnText, { color: 'white' }]} allowFontScaling={false}
                                        numberOfLines={1}>{obj.paramValue}</Text>
                                </TouchableOpacity>
                            </View>
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
        });
        return tagList;
    };

    _close = () => {
        this.setState({
                isShow: false
            }
        );
    };

    render() {
        const { markdownPrice = '', seckillPrice = '', specImg, surplusNumber = 0, productSpecValue } = this.state.data || {};
        let price = this.state.activityType === 1 ? seckillPrice : markdownPrice;
        let specs = productSpecValue || [];
        specs = specs.map((item) => {
            return item.paramValue;
        });

        return (
            <Modal animationType="none" visible={this.state.isShow}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={this._close}>
                        <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                    </TouchableWithoutFeedback>

                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <ImageLoad style={styles.headerImg} source={{ uri: specImg || '' }} borderRadius={5}/>

                            <View style={{ backgroundColor: 'white', marginTop: 20, height: 95 }}>
                                <View style={{ marginLeft: 132 }}>
                                    <Text style={{
                                        color: DesignRule.mainColor,
                                        fontSize: 16,
                                        marginTop: 14
                                    }} allowFontScaling={false}>{`￥${price}`}</Text>
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
                                    }} numberOfLines={2} allowFontScaling={false}>{(specs || []).join(',')}</Text>
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

