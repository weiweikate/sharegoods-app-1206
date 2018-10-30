import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import StringUtils from '../../../../utils/StringUtils';
import icon_close from '../res/icon_close.png';

/**
 * 规格选择头部view
 */

export default class SelectionHeaderView extends Component {

    static propTypes = {
        product: PropTypes.object.isRequired,
        price: PropTypes.any.isRequired,

        selectSpecList: PropTypes.array.isRequired,
        selectList: PropTypes.array.isRequired,
        selectStrList: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { imgUrl } = this.props.product || {};
        let price = this.props.price || 0;
        let stock = 0;
        let stockUnit = '';
        let specImg;
        this.props.selectSpecList.forEach((item) => {
            //总库存库存遍历相加
            stock = stock + item.stock;
            //件
            stockUnit = item.stockUnit;
            specImg = item.specImg;
            price = item.price;
        });

        let selectStrListTemp = this.props.selectStrList.filter((item) => {
            return !StringUtils.isEmpty(item);
        });

        return (
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
                }} source={{ uri: specImg || imgUrl || '' }}/>

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
                            }}>{`库存${stock}${stockUnit || ''}`}</Text>
                        <Text style={{
                            color: '#222222',
                            fontSize: 13,
                            marginTop: 8
                        }}>{selectStrListTemp.join(',')}</Text>
                    </View>
                    <TouchableOpacity style={{ position: 'absolute', top: 16, right: 16 }} onPress = {this.props.closeSelectionPage}>
                        <Image source={icon_close}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

