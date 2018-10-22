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
import gwc from '../res/gwc.png';

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
        let { product={}, originalPrice } = this.props.itemData || {};
        const { name = '' } = product;
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.onPressAtIndex(product.id);
            }}>
                <View style={[styles.container]}>
                    <Image style={styles.img} source={{ uri: product.imgUrl }}/>
                    <Text style={{ color: '#222222', fontSize: 13, paddingHorizontal: 10, marginTop: 9 }}
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
                            style={{ color: '#D51243', fontSize: 17 }}>{`￥${originalPrice}起`}</Text>
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
        flex: 1
    },
    img: {
        backgroundColor: '#eeeeee',
        height: 170,
        width: 170
    }
});

