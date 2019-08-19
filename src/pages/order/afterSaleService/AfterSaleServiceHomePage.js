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
import { routePush } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';
const {
    refund,
    return_goods,
    exchange
} = res.afterSaleService;

class AfterSaleServiceHomePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: '售后服务',
        show: true// false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        let productData = this.params.pageData
        return (
            <ScrollView style={DesignRule.style_container}>
                <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
                <View style={{ backgroundColor: 'white', height: 40, justifyContent: 'center', paddingLeft: 15 }}>
                    <UIText value={'服务类型'} style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
                </View>
                {this.renderSelect()}
                <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                <View style={{ height: 40, backgroundColor: 'white', justifyContent: 'center' }}>
                    <UIText value={'订单编号：' + this.params.merchantOrderNo}
                            style={{ color: DesignRule.textColor_mainTitle, fontSize: 13, marginLeft: 16 }}/>
                </View>
                <GoodsItem
                    uri={productData.specImg}
                    goodsName={productData.productName}
                    salePrice={StringUtils.formatMoneyString(productData.unitPrice)}
                    category={productData.spec}
                    goodsNum={productData.quantity}
                />
                <View style={{ height: 40, backgroundColor: 'white', justifyContent: 'center' }}>
                    <UIText value={'下单时间：' + DateUtils.getFormatDate(this.params.pageData.createTime / 1000)}
                            style={{ color: DesignRule.textColor_mainTitle, fontSize: 13, marginLeft: 16 }}/>
                </View>
            </ScrollView>
        );
    }

    renderSelect = () => {
        let restrictions = this.params.pageData.restrictions;
        let image = [refund, return_goods, exchange];
        let title = ['退款', '退货退款', '换货'];
        let status = [4, 2, 1];
        let content = ['未收到货', '已收到货，需要退换已收到的货物', '需要更换货'];
        let arr = [];
        for (let i = 0; i < image.length; i++) {
            if ((restrictions & status[i]) !== status[i]) {
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
            }
        }
        return arr;
    };

    pageSelect = (index) => {
        let orderProductNo = this.params.pageData.productOrderNo;
        routePush(RouterMap.AfterSaleServicePage, { pageType: index, orderProductNo})
    };

}

export default AfterSaleServiceHomePage;
