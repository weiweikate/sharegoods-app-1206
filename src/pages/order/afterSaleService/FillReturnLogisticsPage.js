/**
 * huchao
 * 填写退货物流
 */
import React from 'react'
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    TextInput,
} from 'react-native';
import BasePage from '../../../BasePage';
import GoodsItem from '../components/GoodsItem';
import arrow_right from '../res/arrow_right.png';
import {
    UIText, UIImage
} from '../../../components/ui';

export default class FillReturnLogisticsPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            //商品、订单等信息
            pageData: this.params.pageData || {},
            //物流公司信息
            logisticsCompany: {},
            //物流单号
            logisticsNum: '',
        }
        this._bindFunc();
    }

    _bindFunc(){
        this.selectLogisticsCompany = this.selectLogisticsCompany.bind(this);
    }

    $navigationBarOptions = {
        title: '填写退货物流',
        show: true// false则隐藏导航
    };

    _render() {
        return(
            <View style = {styles.container}>
                <GoodsItem
                    // uri={this.state.pageData.list[this.state.index].uri}
                    // goodsName={this.state.pageData.list[this.state.index].goodsName}
                    // salePrice={StringUtils.formatMoneyString(this.state.pageData.list[this.state.index].salePrice)}
                    // category={this.state.pageData.list[this.state.index].category}
                    // goodsNum={this.state.pageData.list[this.state.index].goodsNum}
                    // onPress={() => this.jumpToProductDetailPage(this.state.pageData.list[this.state.index].productId)}
                />
                <TouchableWithoutFeedback onPress = {this.selectLogisticsCompany}>
                    <View style = {styles.item_container}>
                        <UIText style = {styles.item_title}
                                value = {'物流公司'}/>
                        <TextInput underlineColorAndroid = {'transparent'}
                                   placeholder = {'请选择物流公司'}
                                   style = {styles.item_detail}
                                   editable = {false}
                        />
                        <UIImage source={arrow_right} style = {{height: 9, width: 9, marginRight: 20}}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style = {styles.item_container}>
                    <UIText style = {styles.item_title}
                            value = {'物流单号'}/>
                    <TextInput underlineColorAndroid = {'transparent'}
                               placeholder = {'请填写物流单号'}
                               style = {styles.item_detail}
                               keyboardType = {'number-pad'}
                    />
                    <UIImage source={arrow_right} style = {{height: 22, width: 22, marginRight: 20}}/>
                </View>
            </View>
        )
    }

    /**
     * 选择物流公司
     */
    selectLogisticsCompany(){
        this.$navigate('order/afterSaleService/SelectLogisticsCompanyPage');
    }
}



const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f7f7f7',
        },
        item_container: {
            backgroundColor: 'white',
            flexDirection: 'row',
            height: 44,
            marginBottom: 10,
            alignItems: 'center',
        },
        item_title:{
            color: '#222222',
            fontSize: 13,
            marginLeft: 17,
        },
        item_detail:{
            color: '#222222',
            fontSize: 13,
            marginRight: 9,
            textAlign: 'right',
            flex: 1,
            padding: 0, //安卓文字有内边距
        }
    }
);
