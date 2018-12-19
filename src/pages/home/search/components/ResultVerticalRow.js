/*
* 垂直展示的row
* */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Text
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import res from '../../res';

import UIImage from '@mr/image-placeholder';

const gwc = res.search.gwc;


export default class ResultVerticalRow extends Component {

    static propTypes = {
        onPressAtIndex: PropTypes.func.isRequired,
        storeProduct: PropTypes.func.isRequired,
        itemData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        let { minPrice, imgUrl, name, prodCode } = this.props.itemData || {};
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.onPressAtIndex(prodCode);
            }}>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={[styles.container]}>
                        <UIImage style={styles.img} source={{ uri: imgUrl || '' }}/>
                        <View style={styles.textContentView}>
                            <Text style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}
                                  numberOfLines={2} allowFontScaling={false}>{`${name || ''}`}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{
                                    color: DesignRule.mainColor,
                                    fontSize: 17
                                }} allowFontScaling={false}>{`￥${minPrice || ' '}`}<Text
                                    style={{ fontSize: 12 }} allowFontScaling={false}>起</Text>
                                </Text>
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={() => {
                            this.props.storeProduct(this.props.itemData);
                        }}>
                            <View style={{
                                width: 35,
                                height: 35,
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image source={gwc}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 16,
        marginRight: 22,
        flexDirection: 'row'
    },
    img: {
        backgroundColor: DesignRule.lineColor_inColorBg,
        height: 120,
        width: 120
    },
    textContentView: {
        width: ScreenUtils.width - 150 - 22,
        marginLeft: 14,
        marginTop: 6,
        marginBottom: 9,
        justifyContent: 'space-between'
    }
});

