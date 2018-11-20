/*
* 横向展示的row
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

const gwc = res.search.gwc;


export default class ResultHorizontalRow extends Component {

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
        let { product = {}, price } = this.props.itemData || {};
        const { name = '' } = product;
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.onPressAtIndex(product.id);
            }}>
                <View style={[styles.container]}>
                    <Image style={styles.img} source={{ uri: product.imgUrl }}/>
                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: 13,
                        paddingHorizontal: 10,
                        marginTop: 9
                    }}
                          numberOfLines={2}>{`${name}`}</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        marginBottom: 11,
                        marginTop: 21
                    }}>
                        <Text
                            style={{ color: DesignRule.mainColor, fontSize: 17 }}>{`￥${price}起`}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                        this.props.storeProduct(product.id);
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
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginLeft: 5,
        backgroundColor: 'white',
        width: (ScreenUtils.width - 30 - 5) / 2
    },
    img: {
        backgroundColor: DesignRule.lineColor_inColorBg,
        height: (ScreenUtils.width - 30 - 5) / 2,
        width: (ScreenUtils.width - 30 - 5) / 2
    }
});

