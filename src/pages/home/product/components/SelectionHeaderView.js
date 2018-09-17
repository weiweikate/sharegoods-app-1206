import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';

/**
 * 规格选择头部view
 */

export default class SelectionHeaderView extends Component {

    static propTypes = {
        product: PropTypes.object.isRequired,
        price: PropTypes.any.isRequired,

        priceList: PropTypes.array.isRequired,
        selectList: PropTypes.array.isRequired,
        selectStrList: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { imgUrl } = this.props.product;
        const price = this.props.price;
        let stock = 0;
        let stockUnit;
        this.props.priceList.forEach((item) => {
            stock = stock + item.stock;
            stockUnit = item.stockUnit;
        });

        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{
                    marginLeft: 10,
                    marginTop: -20,
                    height: 110,
                    width: 110,
                    borderColor: '#EEEEEE',
                    borderWidth: 1,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image style={{ width: 108, height: 108, borderRadius: 5, backgroundColor: '#eeeeee' }}
                           source={{ uri: imgUrl }}/>
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={{
                        color: '#D51243',
                        fontSize: 16,
                        fontFamily: 'PingFang-SC-Medium',
                        marginTop: 16
                    }}>{`￥${price}`}</Text>
                    <Text style={{ color: '#222222', fontSize: 13, marginTop: 8 }}>{`库存${stock}${stockUnit}`}</Text>
                    <Text style={{
                        color: '#222222',
                        fontSize: 13,
                        marginTop: 8
                    }}>{this.props.selectStrList.join(',')}</Text>
                </View>
                <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
                    <Image style={{
                        marginRight: 16,
                        marginTop: 19,
                        width: 23,
                        height: 23
                    }}/>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

