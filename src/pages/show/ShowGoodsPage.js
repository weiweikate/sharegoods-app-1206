/**
 * 可购买产品
 */
import React from 'react'
import {View, StyleSheet, FlatList} from 'react-native'
import ResultHorizontalRow from '../home/search/components/ResultHorizontalRow'
import BasePage from '../../BasePage'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils

export default class ShowGoodsPage extends BasePage {
    $navigationBarOptions = {
        title: '可购买商品',
        show: true
    };
    _storeProduct(value) {
        console.log('_storeProduct', value)
    }
    _onPressAtIndex(value) {
        console.log('_onPressAtIndex', value)
    }
    _renderItem(data) {
        let item = data.item
        console.log('_renderItem', item, item[0], item[1])
        return <View style={styles.row}>
            <View style={styles.good}>
            <ResultHorizontalRow
                itemData={item[0]}
                storeProduct={()=>this._storeProduct(data[0])}
                onPressAtIndex={()=>{this._onPressAtIndex(data[0])}}
            />
            </View>
            {
                item[1]
                ?
                <View style={styles.good}>
                <ResultHorizontalRow
                    itemData={item[1]}
                    storeProduct={()=>this._storeProduct(data[1])}
                    onPressAtIndex={()=>{this._onPressAtIndex(data[1])}}
                />
                </View>
                :
                <View style={styles.good}/>
            }

        </View>
    }
    _keyExtractor = (data) => data[0] ? data[0].id : 0 + '' + data[1] ? data[1].id : 0
    _render() {
        return <View style={styles.container}>
            <FlatList
                style={styles.scroll}
                data={items}
                renderItem={this._renderItem.bind(this)}
                keyExtractor={this._keyExtractor.bind(this)}
                onEndReachedThreshold={0.1}
            />
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
        marginBottom: ScreenUtils.safeBottom
    },
    row: {
        flexDirection: 'row',
        height: px2dp(265),
        marginRight: px2dp(15),
        marginLeft: px2dp(15)
    },
    good: {
        flex: 1,
        borderRadius: px2dp(5),
        overflow: 'hidden',
        height: px2dp(260)
    }
})



const items = [
    [{
        id: 1,
        freight: null,
        monthSaleTotal: null,
        originalPrice: 25,
        paramList: null,
        price: 21,
        priceList: null,
        product: {
            afterSaleServiceDays: 15,
            beginTime: null,
            brandId: 33,
            brandName: null,
            buyLimit: 0,
            content: null,
            endTime: null,
            firstCategoryId: 106,
            firstCategoryName: null,
            id: 55,
            imgUrl: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/58537d88Nc15f021d.jpg',
            name: '海天 生抽酱油 1.9L',
            secCategoryId: 109,
            secCategoryName: null,
            sendMode: 2,
            supplierId: 45,
            supplierName: null,
            thirdCategoryId: 110,
            thirdCategoryName: null,
            videoUrl: ''
        }
    },
    {
        id: 2,
        freight: null,
        monthSaleTotal: null,
        originalPrice: 25,
        paramList: null,
        price: 21,
        priceList: null,
        product: {
            afterSaleServiceDays: 15,
            beginTime: null,
            brandId: 33,
            brandName: null,
            buyLimit: 0,
            content: null,
            endTime: null,
            firstCategoryId: 106,
            firstCategoryName: null,
            id: 55,
            imgUrl: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/58537d88Nc15f021d.jpg',
            name: '海天 生抽酱油 1.9L',
            secCategoryId: 109,
            secCategoryName: null,
            sendMode: 2,
            supplierId: 45,
            supplierName: null,
            thirdCategoryId: 110,
            thirdCategoryName: null,
            videoUrl: ''
        }
    }],
    [{
        id: 3,
        freight: null,
        monthSaleTotal: null,
        originalPrice: 25,
        paramList: null,
        price: 21,
        priceList: null,
        product: {
            afterSaleServiceDays: 15,
            beginTime: null,
            brandId: 33,
            brandName: null,
            buyLimit: 0,
            content: null,
            endTime: null,
            firstCategoryId: 106,
            firstCategoryName: null,
            id: 55,
            imgUrl: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/58537d88Nc15f021d.jpg',
            name: '海天 生抽酱油 1.9L',
            secCategoryId: 109,
            secCategoryName: null,
            sendMode: 2,
            supplierId: 45,
            supplierName: null,
            thirdCategoryId: 110,
            thirdCategoryName: null,
            videoUrl: ''
        }
    },
    {
        id: 4,
        freight: null,
        monthSaleTotal: null,
        originalPrice: 25,
        paramList: null,
        price: 21,
        priceList: null,
        product: {
            afterSaleServiceDays: 15,
            beginTime: null,
            brandId: 33,
            brandName: null,
            buyLimit: 0,
            content: null,
            endTime: null,
            firstCategoryId: 106,
            firstCategoryName: null,
            id: 55,
            imgUrl: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/58537d88Nc15f021d.jpg',
            name: '海天 生抽酱油 1.9L',
            secCategoryId: 109,
            secCategoryName: null,
            sendMode: 2,
            supplierId: 45,
            supplierName: null,
            thirdCategoryId: 110,
            thirdCategoryName: null,
            videoUrl: ''
        }
    }],
    [{
        id: 5,
        freight: null,
        monthSaleTotal: null,
        originalPrice: 25,
        paramList: null,
        price: 21,
        priceList: null,
        product: {
            afterSaleServiceDays: 15,
            beginTime: null,
            brandId: 33,
            brandName: null,
            buyLimit: 0,
            content: null,
            endTime: null,
            firstCategoryId: 106,
            firstCategoryName: null,
            id: 55,
            imgUrl: 'https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/58537d88Nc15f021d.jpg',
            name: '海天 生抽酱油 1.9L',
            secCategoryId: 109,
            secCategoryName: null,
            sendMode: 2,
            supplierId: 45,
            supplierName: null,
            thirdCategoryId: 110,
            thirdCategoryName: null,
            videoUrl: ''
        }
    }]
]
