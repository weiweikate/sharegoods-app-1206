import React from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText, UIImage
} from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import GoodsItem from '../components/GoodsGrayItem';
import DateUtils from '../../../utils/DateUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import RouterMap from '../../../navigation/RouterMap';
const {
    refund,
    return_goods,
    exchange
} = res.afterSaleService;

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
        };
        this.params.pageData = this.params.pageData ||
            {
                specImg: '',
                productName: 'productName',
                restrictions: 0,
                quantity: 1,
                specValues: 'specValues',
                unitPrice: 'unitPrice',
                warehouseOrderNo: 'warehouseOrderNo',
                createTime: '111111',
                orderProductNo: 'O1166141'
            };
        this.jumpToProductDetailPage = this.jumpToProductDetailPage.bind(this);
    }

    $navigationBarOptions = {
        title: '售后服务',
        show: true// false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {

        let productData = this.params.pageData;
        return (
            <ScrollView style={DesignRule.style_container}>
                {this.renderWideLine()}
                {this.renderServiceType()}
                {this.renderLine()}
                {this.renderSelect()}
                {this.renderOrderNum()}
                <GoodsItem
                    uri={productData.specImg}
                    goodsName={productData.productName}
                    salePrice={StringUtils.formatMoneyString(productData.unitPrice)}
                    category={productData.spec}
                    goodsNum={productData.quantity}
                   onPress={() => this.jumpToProductDetailPage()}
                />
                {this.renderOrderTime()}
            </ScrollView>
        );
    }

    renderOrderNum = () => {
        return (
            <View style={{ height: 40, backgroundColor: 'white', justifyContent: 'center' }}>
                <UIText value={'订单编号：' + this.params.pageData.warehouseOrderNo}
                        style={{ color: DesignRule.textColor_mainTitle, fontSize: 13, marginLeft: 16 }}/>
            </View>
        );
    };
    renderOrderTime = () => {
        return (
            <View style={{ height: 40, backgroundColor: 'white', justifyContent: 'center' }}>
                <UIText value={'下单时间：' + DateUtils.getFormatDate(this.params.pageData.createTime / 1000)}
                        style={{ color: DesignRule.textColor_mainTitle, fontSize: 13, marginLeft: 16 }}/>
            </View>
        );
    };
    renderSelect = () => {
        let orderSubType = this.params.pageData.orderSubType;
        console.log('renderSelect',this.params.pageData);
        let image = [refund, return_goods, exchange];
        let title = ['退款', '退货退款', '换货'];
        let content = ['未收到货', '已收到货，需要退换已收到的货物', '需要更换货'];
        // 1 2 4 8 16 分别代表不支持优惠券、一元、换货、退货
        // let status = [4, 16, 8];
        // let productData = this.params.pageData || {}
        let arr = [];
        for (let i = 0; i < image.length; i++) {
            if ((orderSubType === 3 || orderSubType === 5) && i < 2) {
                continue;//升级礼包     //经验值专区的商品
            }
            // if ((productData.restrictions & status[i]) !== status[i]) {
                arr.push(
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        height: 79,
                        alignItems: 'center',
                        alignContent: 'center',
                        marginBottom: 10,
                        backgroundColor: 'white'
                    }} onPress={() => this.pageSelect(i)} key={i}>
                        <UIImage source={image[i]} style={{ width: 50, height: 50, marginBottom: 10, marginLeft: 21 }}/>
                        <View style={{ marginLeft: 10 }}>
                            <UIText value={title[i]} style={{ fontSize: 16, color: DesignRule.textColor_mainTitle }}/>
                            <UIText value={content[i]}
                                    style={{ fontSize: 15, color: DesignRule.textColor_secondTitle }}/>
                        </View>
                    </TouchableOpacity>
                );
            // }
        }
        return arr;
    };
    pageSelect = (index) => {
        let orderProductNo = this.params.pageData.orderProductNo;
        switch (index) {
            case 0:
                this.$navigate(RouterMap.AfterSaleServicePage, {
                    pageType: 0,
                    orderProductNo
                });
                break;
            case 1:
                this.$navigate(RouterMap.AfterSaleServicePage, {
                    pageType: 1,
                    orderProductNo
                });
                break;
            case 2:
                this.$navigate(RouterMap.AfterSaleServicePage, {
                    pageType: 2,
                    orderProductNo
                });
                break;
        }
    };
    renderServiceType = () => {
        return (
            <View style={{ backgroundColor: 'white', height: 40, justifyContent: 'center', paddingLeft: 15 }}>
                <UIText value={'服务类型'} style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
            </View>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
    }

    jumpToProductDetailPage = () => {
        let productData = this.params.pageData;
        switch (productData.orderType) {
            case 1://秒杀
            case 2://降价拍
                this.$navigate(RouterMap.ProductDetailPage, {
                    activityType: productData.orderSubType,
                    activityCode: productData.activityCode
                });
                break;
            case 3://
            case 4:
                this.$navigate(RouterMap.TopicDetailPage, {
                    activityType: productData.orderSubType,
                    activityCode:productData.activityCode
                });
                break;
            default://普通商品
                this.$navigate(RouterMap.ProductDetailPage, { productCode: productData.prodCode });
                break;
        }
    };
}

export default AfterSaleServiceHomePage;
