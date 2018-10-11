import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText, UIImage
} from '../../../components/ui';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';
import changeGoods from '../res/shouhou_icon_huanhuo_nor.png';
import refuseGoodsAndMoney from '../res/shouhou_icon_tuihuo_nor.png';
import refuseMoney from '../res/shouhou_icon_tuikuan_nor.png';
import GoodsItem from '../components/GoodsItem';
import DateUtils from '../../../utils/DateUtils';

class AfterSaleServiceHomePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            /** pageData.orderProductList 如果是产品订单里面就是一个一个商品，如果是礼包、优惠券订单，该数组就只有一个。
             * orderProductList.orderProductPriceList 就是礼包里面的子商品
             * index 表示当前退的哪一个商品，如果没有index，说明退的是礼包，那么默认取orderProductList第一个来显示就行
             */
            index: this.params.index ? this.params.index : 0,
            pageData: this.params.pageData ? this.params.pageData : {} // pageData.orderType 3：优惠套餐、5：礼包 其余的统一处理
        };
        this.jumpToProductDetailPage = this.jumpToProductDetailPage.bind(this);
    }

    $navigationBarOptions = {
        title: '售后服务',
        show: true// false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        let productData = this.params.pageData.orderProductList[this.state.index];
        return (
            <View style={styles.container}>
                {this.renderWideLine()}
                {this.renderServiceType()}
                {this.renderLine()}
                {this.renderSelect()}
                {this.renderOrderNum()}
                <GoodsItem
                    uri={productData.specImg}
                    goodsName={productData.productName}
                    salePrice={StringUtils.formatMoneyString(productData.price)}
                    category={productData.spec}
                    goodsNum={productData.num}
                    onPress={() => this.jumpToProductDetailPage()}
                />
                {this.renderOrderTime()}
            </View>
        );
    }

    renderOrderNum = () => {
        return (
            <View style={{ height: 40, backgroundColor: color.white, justifyContent: 'center' }}>
                <UIText value={'订单编号：' + this.state.pageData.orderNum}
                        style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
            </View>
        );
    };
    renderOrderTime = () => {
        return (
            <View style={{ height: 40, backgroundColor: color.white, justifyContent: 'center' }}>
                <UIText value={'下单时间：' + DateUtils.getFormatDate(this.state.pageData.createTime / 1000)}
                        style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
            </View>
        );
    };
    renderSelect = () => {
        let image = [refuseMoney, refuseGoodsAndMoney, changeGoods];
        let title = ['退款', '退货退款', '换货'];
        let content = ['未收到货（包含未签收）', '已收到货，需要退换已收到的货物', '需要更换货'];
        // 1 2 4 8 16 分别代表不支持优惠券、一元、换货、退货
        let status = [4, 16, 8];
        let productData = this.params.pageData.orderProductList[this.state.index];
        let arr = [];
        for (let i = 0; i < image.length; i++) {
           if ((productData.restrictions & status[i]) !== productData.restrictions) {
               arr.push(
                   <TouchableOpacity style={{
                       flexDirection: 'row',
                       height: 79,
                       alignItems: 'center',
                       alignContent: 'center',
                       marginBottom: 10,
                       backgroundColor: color.white
                   }} onPress={() => this.pageSelect(i)} key={i}>
                       <UIImage source={image[i]} style={{ width: 50, height: 50, marginBottom: 10, marginLeft: 21 }}/>
                       <View style={{ marginLeft: 10 }}>
                           <UIText value={title[i]} style={{ fontSize: 16, color: color.black }}/>
                           <UIText value={content[i]} style={{ fontSize: 15, color: color.gray_666 }}/>
                       </View>
                   </TouchableOpacity>
               );
           }
        }
        return arr;
    };
    pageSelect = (index) => {
        let orderProductId = this.params.pageData.orderProductList[this.state.index].id;
        switch (index) {
            case 0:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 0,
                    orderProductId: orderProductId,
                });
                break;
            case 1:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 1,
                    orderProductId: orderProductId,
                });
                break;
            case 2:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 2,
                    orderProductId: orderProductId,
                });
                break;
        }
    };
    renderServiceType = () => {
        return (
            <View style={{ backgroundColor: color.white, height: 40, justifyContent: 'center', paddingLeft: 15 }}>
                <UIText value={'服务类型'} style={{ color: color.black_222, fontSize: 13 }}/>
            </View>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: color.page_background }}/>
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
    }

    jumpToProductDetailPage = (productId) => {
        //this.$navigate('home/product/ProductDetailPage', { productId: productId });
        let productData = this.params.pageData.orderProductList[this.state.index];
        switch (this.state.pageData.orderType) {
            case 1://秒杀
                this.$navigate('product/ProductDetailPage', {
                    productId: productData.productId,
                    activityCode: productData.id,
                    ids: productData.activityCode
                });

                break;
            case 2://降价拍
                this.$navigate('product/ProductDetailPage', {
                    productId: productData.productId,
                    id: productData.id,
                    ids: productData.activityCode
                });

                break;

            case 3://优惠套餐
                this.$navigate('home/CouponsComboDetailPage', { id: productData.productId });
                break;
            case 4:

                break;

            case 5://礼包
                this.$navigate('home/GiftProductDetailPage', { giftBagId: productData.productId });
                break;

            case 99://普通商品
                this.$navigate('home/product/ProductDetailPage', { productId: productData.productId });
                break;
            default:
                 break;
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: color.page_background
    }
});

export default AfterSaleServiceHomePage;
