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
import changeGoods from '../res/changeGoods.png';
import refuseGoodsAndMoney from '../res/refuseGoodsAndMoney.png';
import refuseMoney from '../res/refuseMoney.png';
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
            index: this.params.index ? this.params.index : 0,
            pageData: this.params.pageData ? this.params.pageData : {}
        };
    }

    $navigationBarOptions = {
        title: '售后服务',
        show: true// false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                {this.renderWideLine()}
                {this.renderServiceType()}
                {this.renderLine()}
                {this.renderSelect()}
                {this.renderOrderNum()}
                <GoodsItem
                    uri={this.params.pageData.list[this.params.index].uri}
                    goodsName={this.params.pageData.list[this.params.index].goodsName}
                    salePrice={StringUtils.formatMoneyString(this.params.pageData.list[this.params.index].salePrice)}
                    category={this.params.pageData.list[this.params.index].category}
                    goodsNum={this.params.pageData.list[this.params.index].goodsNum}
                    onPress={() => this.jumpToProductDetailPage(this.params.pageData.list[this.params.index].productId)}
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
        let arr = [];
        for (let i = 0; i < image.length; i++) {
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
        return arr;
    };
    pageSelect = (index) => {
        switch (index) {
            case 0:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 0,
                    index: this.params.index ? this.params.index : 0,
                    pageData: this.params.pageData ? this.params.pageData : {}
                });
                break;
            case 1:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 1,
                    index: this.params.index ? this.params.index : 0,
                    pageData: this.params.pageData ? this.params.pageData : {}
                });
                break;
            case 2:
                this.$navigate('order/afterSaleService/AfterSaleServicePage', {
                    pageType: 2,
                    index: this.params.index ? this.params.index : 0,
                    pageData: this.params.pageData ? this.params.pageData : {}
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
        this.$navigate('product/ProductDetailPage', { productId: productId });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: color.page_background
    }
});

export default AfterSaleServiceHomePage;
