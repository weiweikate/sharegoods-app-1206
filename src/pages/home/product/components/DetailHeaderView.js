import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';

/**
 * 商品详情头部view
 */

export default class DetailHeaderView extends Component {


    static propTypes = {
        data: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    _clickItem = ()=>{

    }

    _renderImageItem = (item, index) => {
        const { originalImg } = item;
        return (
            <TouchableWithoutFeedback key={index} onPress={() => this._clickItem(item)}>
                <View style={{ flex: 1, backgroundColor: '#eeeeee' }}>
                    {
                        originalImg ? <Image
                            style={{ flex: 1, width: ScreenUtils.width, height: ScreenUtils.autoSizeWidth(237) }}
                            resizeMode="stretch"
                            source={{ uri: originalImg }}/> : null
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    };

    render() {
        const { productImgList, freight, monthSaleTotal, price, originalPrice, product } = this.props.data;
        const { supplierName, brandName, name, firstCategoryName, secCategoryName, thirdCategoryName } = product || {};
        return (
            <View>
                <Swiper
                    autoplay
                    horizontal
                    autoplayTimeout={3000}
                    height={ScreenUtils.autoSizeWidth(377)}
                    loop={productImgList && productImgList.length > 1}
                    dot={<View style={styles.dot}/>}
                    activeDot={<View style={styles.activeDot}/>}>
                    {productImgList? productImgList.map(this._renderImageItem):<View/>}
                </Swiper>

                < View style={{ backgroundColor: 'white' }}>
                    <View style={{ marginLeft: 16, width: ScreenUtils.width - 32 }}>
                        <Text style={{
                            marginTop: 14,
                            color: '#222222',
                            fontSize: 15
                        }}>{`${supplierName} ${brandName} ${name} ${firstCategoryName} ${secCategoryName} ${thirdCategoryName}`}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 21, alignItems: 'center' }}>
                            <Text style={{ color: '#D51243', fontSize: 18 }}>{`￥${price}起`}</Text>
                            <Text style={{ marginLeft: 5, color: '#BBBBBB', fontSize: 10 }}>{`￥${originalPrice}`}</Text>
                            <Text style={{
                                marginLeft: 5,
                                backgroundColor: 'red',
                                color: '#FFFFFF',
                                fontSize: 10
                            }}>拼店价</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 18, marginBottom: 14, alignItems: 'center' }}>
                            <Text
                                style={{ color: '#BBBBBB', fontSize: 11 }}>{freight === 0 ? '包邮' : `${freight}元`}</Text>
                            <Text style={{
                                color: '#666666',
                                fontSize: 13,
                                marginLeft: ScreenUtils.autoSizeWidth(108)
                            }}>{`月销售${monthSaleTotal}笔`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', marginTop: 10, marginBottom: 12 }}>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: 16,
                        width: ScreenUtils.width - 32,
                        marginVertical: 13,
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#D51243', fontSize: 13 }}>服务</Text>
                        <Text style={{ marginLeft: 11, color: '#666666', fontSize: 13 }}>正品保证·急速发货 7天无理由退换</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    activeDot: {
        backgroundColor: 'white',
        width: 12,
        height: 2,
        marginLeft: 3,
        marginRight: 3
    },
    dot: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        width: 12,
        height: 2,
        marginLeft: 3,
        marginRight: 3
    }
});
