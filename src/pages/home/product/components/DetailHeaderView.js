import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ViewPager from '../../../../components/ui/ViewPager';
import UIImage from '../../../../components/ui/UIImage';

/**
 * 商品详情头部view
 */

export default class DetailHeaderView extends Component {


    static propTypes = {
        data: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            swiperShow: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0);
    }

    _clickItem = () => {

    };
    renderViewPageItem = (item) => {
        const { originalImg } = item;
        return (
            <UIImage
                source={{ uri: originalImg || '' }}
                style={{ height: ScreenUtils.autoSizeWidth(377), width: ScreenUtils.width }}
                onPress={this._clickItem}
                resizeMode="cover"
            />);
    };

    render() {
        let { productImgList, freight, monthSaleTotal, price, originalPrice, product } = this.props.data;
        productImgList = productImgList || [];
        freight = freight || 0;
        monthSaleTotal = monthSaleTotal || 0;
        price = price || 0;
        originalPrice = originalPrice || 0;

        let { supplierName, brandName, name, firstCategoryName, secCategoryName, thirdCategoryName } = product || {};
        supplierName = supplierName || '';
        brandName = brandName || '';
        name = name || '';
        firstCategoryName = firstCategoryName || '';
        secCategoryName = secCategoryName || '';
        thirdCategoryName = thirdCategoryName || '';

        return (
            <View>
                <ViewPager style={styles.ViewPager}
                           arrayData={productImgList}
                           renderItem={(item) => this.renderViewPageItem(item)}
                           dotStyle={{
                               height: 5,
                               width: 5,
                               borderRadius: 5,
                               backgroundColor: '#eeeeee',
                               opacity: 0.4
                           }}
                           swiperShow={this.state.swiperShow}
                           activeDotStyle={{
                               height: 5,
                               width: 30,
                               borderRadius: 5,
                               backgroundColor: '#eeeeee'
                           }}
                           height={ScreenUtils.autoSizeWidth(377)}
                           autoplay={true}/>

                <View style={{ backgroundColor: 'white' }}>
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
    ViewPager: {
        // height: ScreenUtils.autoSizeWidth(377),
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        width: ScreenUtils.width
    }
});
