import React from 'react';
import {
    NativeModules,
    StyleSheet,
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
import applyRefundMessage from '../res/applyRefundMessage.png';
import applyRefundPhone from '../res/applyRefundPhone.png';
import rechargeSucceed from '../../../comm/res/tongyon_icon_check_green.png';
import DateUtils from '../../../utils/DateUtils';
import BusinessUtils from '../../../pages/mine/components/BusinessUtils';
import Toast from '../../../utils/bridge';
import DesignRule from 'DesignRule';

export default class ApplyRefundNextPage extends BasePage {
    constructor(props) {
        super(props);
        console.warn(this.props);
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            imageArr: [],
            /*
            * 0:ApplyRefundNextPage 申请退款
            * 1:RefuseAfterSaleServicdPage 售后服务
            * 2:AcceptAfterSaleServicdPage 售后服务
            * */
            pageType: this.params.pageType ? this.params.pageType : 0,
            viewData: {
                // return_reason:'不想要了',
                // remark:'比较有钱，不要了...',
                // return_amounts:'724',
                // apply_time:1532568808000,
                // outRefundNo:'7802201807260933275286636',
            },
            sellerPhone: '',
            index: this.params.index ? this.params.index : 0,
            pageData: this.params.pageData ? this.params.pageData : {},
            returnProductId: this.params.returnProductId ? this.params.returnProductId : this.params.pageData.list[this.params.index].returnProductId,
            returnProductStatus: this.params.returnProductStatus
        };
    }

    $navigationBarOptions = {
        title: this.params.pageType == 0 ? '申请退款' : '售后服务',
        show: true// false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderHeader()}
                    {this.renderOrder()}
                    <GoodsItem
                        uri={this.state.pageData.list[this.state.index].uri}
                        goodsName={this.state.pageData.list[this.state.index].goodsName}
                        salePrice={StringUtils.formatMoneyString(this.state.pageData.list[this.state.index].salePrice)}
                        category={this.state.pageData.list[this.state.index].category}
                        goodsNum={this.state.pageData.list[this.state.index].goodsNum}
                        onPress={() => this.jumpToProductDetailPage(this.state.pageData.list[this.state.index].productId)}
                    />
                    {this.renderReason()}
                </ScrollView>
                {this.renderContact()}
            </View>
        );
    }

    renderContact = () => {
        return (
            <View style={{ height: 61, backgroundColor: 'white' }}>
                {this.renderLine()}
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        flex: 1,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                    }} onPress={() => this.contactSeller()}>
                        <UIImage source={applyRefundMessage} style={{ width: 25, height: 23, marginBottom: 10 }}/>
                        <View style={{ marginLeft: 10 }}>
                            <UIText value={'联系卖家'} style={{ fontSize: 16, color: DesignRule.textColor_mainTitle }}/>
                            <UIText value={'9:00-17:00'}
                                    style={{ fontSize: 12, color: DesignRule.textColor_instruction }}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: 1, justifyContent: 'center' }}>
                        <View style={{ width: 1, height: 30, backgroundColor: DesignRule.lineColor_inColorBg }}/>
                    </View>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        flex: 1,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                    }} onPress={() => this.callPhone()}>
                        <UIImage source={applyRefundPhone} style={{ width: 25, height: 23, marginBottom: 10 }}/>
                        <View style={{ marginLeft: 10 }}>
                            <UIText value={'拨打电话'} style={{ fontSize: 16, color: DesignRule.textColor_mainTitle }}/>
                            <UIText value={'9:00-17:00'}
                                    style={{ fontSize: 12, color: DesignRule.textColor_instruction }}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    renderReason = () => {
        return (
            <View>
                <View style={{ backgroundColor: 'white', height: 40, justifyContent: 'center', paddingLeft: 15 }}>
                    <UIText value={'下单时间：' + DateUtils.getFormatDate(this.state.pageData.createTime / 1000)}
                            style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
                </View>
                {this.renderLine()}
                <UIText value={'退款原因：' + this.state.viewData.return_reason} style={styles.refundReason}/>
                <UIText value={'退款金额：' + StringUtils.formatMoneyString(this.state.viewData.return_amounts)}
                        style={styles.refundReason}/>
                <UIText value={'退款说明：' + this.state.viewData.remark} style={styles.refundReason}/>
                <UIText value={'凭证图片：'} style={styles.refundReason}/>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingRight: 15 }}>
                    {this.renderCertificateImage()}
                </View>
                <UIText value={'申请时间：' + DateUtils.getFormatDate(this.state.viewData.apply_time / 1000)}
                        style={styles.refundReason}/>
                <UIText value={'售后编号：' + this.state.viewData.outRefundNo} style={styles.refundReason}/>
            </View>
        );
    };
    renderCertificateImage = () => {
        let arr = [];
        for (let i = 0; i < this.state.imageArr.length; i++) {
            arr.push(
                <UIImage source={{ uri: this.state.imageArr[i] }}
                         style={{ height: 83, width: 83, marginLeft: 15, marginTop: 10 }}/>
            );
        }
        return arr;
    };
    renderOrder = () => {
        return (
            <View>
                <View
                    style={{
                        backgroundColor: DesignRule.bgColor,
                        height: 40,
                        justifyContent: 'center',
                        paddingLeft: 15
                    }}>
                    <UIText value={'退款订单'} style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
                </View>
                {this.renderLine()}
                <View style={{ backgroundColor: 'white', height: 40, justifyContent: 'center', paddingLeft: 15 }}>
                    <UIText value={'订单编号：' + this.state.pageData.orderNum}
                            style={{ color: DesignRule.textColor_mainTitle, fontSize: 13 }}/>
                </View>
            </View>
        );
    };

    renderHeader = () => {
        let image;
        let context1;
        let context2;

        // switch (this.state.returnProduct.status){
        //     case 0:
        //         image=applyRefundSucceed
        //         context1='提交成功!'
        //         context2='已转交相关客服处理，请耐心等待!'
        //         break
        //     case 1:
        //         image=refuseAfterSale
        //         context1='商家拒绝你的请求!'
        //         context2='商品已经发货，无法进行退款！'
        //         break
        //     case 2:
        //         image=rechargeSucceed
        //         context1='商家审核中...'
        //         context2='已转交相关客服处理，请耐心等待！'
        //         break
        //     default:
        //         NativeModules.commModule.toast('这里有一个错误，需要上个页面传递纯数字过来')
        //         break
        // }
        if (this.state.returnProductStatus === 4) {
            image = rechargeSucceed;
            context1 = '退款成功';
            context2 = '已转交相关客服处理，请耐心等待！';
        } else {
            image = rechargeSucceed;
            context1 = '退款中';
            context2 = '已转交相关客服处理，请耐心等待！';
        }
        return (
            <View style={{ height: 115, flexDirection: 'row' }}>
                <View style={{ height: 115, width: 89, justifyContent: 'center' }}>
                    <View style={{
                        backgroundColor: DesignRule.color_green,
                        borderRadius: 10,
                        width: 2,
                        marginLeft: 51,
                        height: 12
                    }}/>
                    <UIImage source={image}
                             style={{ width: 41, height: 41, marginLeft: 32, marginTop: 10, marginBottom: 10 }}/>
                    <View style={{
                        backgroundColor: DesignRule.color_green,
                        borderRadius: 10,
                        width: 2,
                        marginLeft: 51,
                        height: 12
                    }}/>
                </View>
                <View style={{ marginLeft: 18, justifyContent: 'center' }}>
                    <UIText value={context1} style={{ fontSize: 17, color: DesignRule.color_green }}/>
                    <UIText value={context2} style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
                    <UIText value={DateUtils.getFormatDate(this.state.viewData.apply_time / 1000)}
                            style={{ color: DesignRule.textColor_instruction, fontSize: 13 }}/>
                </View>
            </View>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: DesignRule.lineColor_inColorBg }}/>
        );
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
        Toast.hiddenLoading();
        // OrderApi.findReturnProductById({returnProductId:this.state.returnProductId}).then((response)=>{
        //     Toast.hiddenLoading()
        //     if(response.ok ){
        //         let imageArr=[]
        //         response.data.imgList.map((item, index)=>{
        //             imageArr.push(item.originalImg)
        //         })
        //         this.setState({
        //             imageArr:imageArr,
        //             viewData:{
        //                 return_reason:response.data.returnProduct.return_reason,
        //                 remark:response.data.returnProduct.remark,
        //                 return_amounts:response.data.returnProduct.return_amounts,
        //                 apply_time:response.data.returnProduct.apply_time,
        //                 outRefundNo:response.data.returnAmountsRecord&&response.data.returnAmountsRecord.outRefundNo+'',
        //             },
        //             sellerPhone:response.data.returnAddress.recevicePhone,
        //         })
        //     } else {
        //         NativeModules.commModule.toast(response.msg)
        //     }
        // }).catch(e=>{
        //     Toast.hiddenLoading()
        // });
    }

    callPhone = () => {
        if (this.state.sellerPhone === -1) {
            NativeModules.commModule.toast('电话号码不存在');
        } else {
            BusinessUtils.callPhone(this.state.sellerPhone);
        }
    };
    contactSeller = () => {
        // QYChatUtil.qiYUChat()
    };
    jumpToProductDetailPage = (productId) => {
        this.navigate('product/ProductDetailPage', { productId: productId });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white',
        justifyContent: 'flex-end'
    }, refundReason: {
        color: DesignRule.textColor_instruction, fontSize: 13, marginLeft: 17, marginTop: 10
    }
});

