import React, { Component } from 'react';
import { Alert, StyleSheet, View, Image } from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import { assistDetailModel, orderDetailModel } from '../../model/OrderDetailModel';
import OrderApi from '../../api/orderApi';
import Toast from '../../../../utils/bridge';
import { observer } from 'mobx-react';
import RouterMap, { routePop, routePush } from '../../../../navigation/RouterMap';
import { payment } from '../../../payment/Payment';
import { MRText as Text, NoMoreClick, UIText } from '../../../../components/ui';
import { clickOrderAgain, clickOrderConfirmReceipt, clickOrderLogistics } from '../../order/CommonOrderHandle';
import res from '../../res';
import { beginChatType, QYChatTool } from '../../../../utils/QYModule/QYChatTool';
import ShareUtil from '../../../../utils/ShareUtil';
import apiEnvironment from '../../../../api/ApiEnvironment';

const kefu_icon = res.kefu_icon;

const { px2dp } = ScreenUtils;

@observer
export default class OrderDetailBottomButtonView extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        showDele: false
    };

    render() {
        let nameArr = [...orderDetailModel.menu];
        if (nameArr.length >= 3) {
            return (
                <View style={styles.containerStyle}>
                    {this.renderKeBtn()}
                    <View style={{ flex: 1 }}/>

                    <View style={{
                        height: px2dp(30),
                        borderRadius: px2dp(15),
                        marginRight: px2dp(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <UIText value={'更多>'} style={{ color: DesignRule.textColor_secondTitle, fontSize: 12 }}
                                onPress={
                                    () => this.props.switchButton(nameArr.filter((item, i) => {
                                        return i <= (nameArr.length - 1 - 2);
                                    }))
                                }/>
                    </View>
                    {nameArr.filter((item, i) => {
                        return i > (nameArr.length - 1 - 2);
                    })
                        .map((item, i) => {
                            return <NoMoreClick key={i}
                                                style={[styles.touchableStyle, { borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd }]}
                                                onPress={() => {
                                                    this.operationMenuClick(item);
                                                }}>
                                <Text
                                    style={{ color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle, fontSize: px2dp(12)}}
                                    allowFontScaling={false}>{item.operation}</Text>
                            </NoMoreClick>;
                        })}
                </View>
            );
        } else {
            let datas = nameArr;
            return (
                <View style={styles.containerStyle}>
                    {this.renderKeBtn()}
                    <View style={{ flex: 1 }}/>
                    {datas.map((item, i) => {
                        return <NoMoreClick key={i}
                                            style={[styles.touchableStyle, { borderColor: item.isRed ? DesignRule.mainColor : DesignRule.color_ddd }]}
                                            onPress={() => {
                                                this.operationMenuClick(item);
                                            }}>
                            <Text
                                style={{ color: item.isRed ? DesignRule.mainColor : DesignRule.textColor_secondTitle }}
                                allowFontScaling={false}>{item.operation}</Text>
                        </NoMoreClick>;
                    })}
                </View>
            );
        }
    }

    renderKeBtn = () => {
        return <NoMoreClick style={{ flexDirection: 'row', marginLeft: px2dp(15) }}
                            onPress={() => {
                                this.concactKeFu();
                            }}
        >
            <Image source={kefu_icon} style={{ height: px2dp(20), width: px2dp(20) }}/>
            <Text style={{ color: DesignRule.mainColor, fontSize: px2dp(13), marginLeft: 5 }}> 联系商家</Text>
        </NoMoreClick>;
    };

    operationMenuClick = (menu) => {
        /*
         * 取消订单                 ->  1
         * 去支付                   ->  2
         * 继续支付                 ->  3
         * 订单退款                 ->  4
         * 查看物流                 ->  5
         * 确认收货                 ->  6
         * 删除订单(已完成)          ->  7
         * 再次购买                 ->  8
         * 删除订单(已关闭(取消))    ->  9
         * */
        switch (menu.id) {
            case 1:
                if (assistDetailModel.cancelArr.length > 0) {
                    this.props.openCancelModal && this.props.openCancelModal();
                } else {
                    Toast.$toast('无取消类型！');
                }

                break;
            case 2:
                this.props.openCancelModal && this.props.openCancelModal(() => {
                    this._goToPay();
                });
                break;
            case 3:
                this.props.openCancelModal && this.props.openCancelModal(() => {
                    this._goToPay();
                });
                break;
            case 4:
                break;
            case 5:
                clickOrderLogistics(orderDetailModel.merchantOrderNo);
                break;
            case 6:
                clickOrderConfirmReceipt(orderDetailModel.merchantOrderNo, orderDetailModel.merchantOrder.subStatus, () => {
                    this.props.dataHandleConfirmOrder && this.props.dataHandleConfirmOrder();//本地修改列表数据状态到交易完成
                    orderDetailModel.dataHandleConfirmOrder();//本地修改详情状态到交易完成
                });
                break;
            case 8:
                clickOrderAgain(orderDetailModel.merchantOrderNo, orderDetailModel.productsList());
                break;
            case 7:
            case 9:
                this.deleteOrder();
                break;
            case 10:
                OrderApi.checkInfo({ warehouseOrderNo: orderDetailModel.merchantOrderNo }).then(res => {
                    if (res.data === true) {
                        routePush(RouterMap.P_ScorePublishPage, {
                            orderNo: orderDetailModel.merchantOrderNo
                        });
                    } else {
                        Toast.$toast('该商品已晒过单！');
                        this.props.loadPageData();
                    }

                }).catch(e => {
                    Toast.$toast(e.msg);
                });
                break;
            case 19:
                if (orderDetailModel.orderExt && orderDetailModel.orderExt.orderGroupExt) {
                    routePush('HtmlPage', { uri: '/activity/groupBuyDetails/' + orderDetailModel.orderExt.orderGroupExt.id });
                }
                break;
            case 20:
                // shareType : 0图片分享 1 图文链接分享 2小程序
                // platformType: 1 朋友圈 0 会话
                // title:分享标题(当为图文分享时候使用)
                // dec:内容(当为图文分享时候使用)
                // linkUrl:(图文分享下的链接)
                // thumImage:(分享图标小图(http链接)图文分享使用)
                if (orderDetailModel.orderExt && orderDetailModel.orderExt.orderGroupExt) {
                    let  orderGroupExt = orderDetailModel.orderExt.orderGroupExt;
                    if (orderDetailModel.productsList().length === 0){
                        return;
                    }
                    let goodsName = orderDetailModel.productsList()[0].productName;
                    let activityAmount = orderDetailModel.productsList()[0].unitPrice;
                    ShareUtil.onShare({shareType: 1,
                        platformType:0,
                        title: `[仅剩${orderGroupExt.surplusPerson}个名额] 我${activityAmount || ''}元带走了${goodsName || ''}`,
                        dec:  `我买了${goodsName || ''}，该商品已拼${orderGroupExt.groupNum -  orderGroupExt.surplusPerson}件了，快来参团吧!`,
                        linkUrl:  `${apiEnvironment.getCurrentH5Url()}/activity/groupBuyDetails/${orderGroupExt.id ? orderGroupExt.id : ''}`,
                        thumImage: 'logo.png' });
                }
                break;
        }
    };

    deleteOrder() {
        Alert.alert('', '确定删除此订单吗?', [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确定', onPress: () => {
                    Toast.showLoading();
                    OrderApi.deleteOrder({ merchantOrderNo: orderDetailModel.merchantOrderNo }).then((response) => {
                        Toast.hiddenLoading();
                        Toast.$toast('订单已删除');
                        this.props.dataHandleDeleteOrder && this.props.dataHandleDeleteOrder();
                        routePop();
                    }).catch(e => {
                        Toast.hiddenLoading();
                        Toast.$toast(e.msg);
                    });
                }
            }

        ], { cancelable: true });
    }

    _goToPay() {
        let orderProductList = orderDetailModel.productsList();
        let platformOrderNo = orderDetailModel.platformOrderNo;
        if (orderProductList && orderProductList.length > 0) {
            payment.checkOrderToPage(platformOrderNo, orderProductList[0].productName);
        }
    }

    concactKeFu() {
        let supplierCode = orderDetailModel.merchantOrder.merchantCode || '';
        let desc = '';
        let pictureUrlString = '';
        let num = '';
        if (orderDetailModel.productsList().length > 0) {
            let item = orderDetailModel.productsList()[0];
            desc = item.productName || '';
            pictureUrlString = item.specImg || '';
            num = '共' + item.quantity + '件商品';

        }
        if (this.data) {
            QYChatTool.beginQYChat({
                    routePath: '',
                    urlString: '',
                    title: this.data.title || '',
                    shopId: this.data.shopId || '',
                    chatType: beginChatType.BEGIN_FROM_ORDER,
                    data: {
                        title: '订单号:' + orderDetailModel.merchantOrderNo,
                        desc,
                        pictureUrlString,
                        urlString: '/' + orderDetailModel.merchantOrderNo,
                        note: num,
                        tags: [{
                            focusIframe: '订单信息',
                            url: 'https://qiyu.sharegoodsmall.com/#/orderList',
                            label: '查看订单',
                            data: orderDetailModel.merchantOrderNo
                        }]
                    }
                }
            );
        } else {
            OrderApi.getProductShopInfoBySupplierCode({ supplierCode }).then((data) => {
                this.data = data.data;
                QYChatTool.beginQYChat({
                        routePath: '',
                        urlString: '',
                        title: this.data.title || '',
                        shopId: this.data.shopId || '',
                        chatType: beginChatType.BEGIN_FROM_ORDER,
                        data: {
                            title: orderDetailModel.merchantOrderNo,
                            desc,
                            pictureUrlString,
                            urlString: '/' + orderDetailModel.merchantOrderNo,
                            note: num,
                            tags: [{
                                focusIframe: '订单信息',
                                url: 'https://qiyu.sharegoodsmall.com/#/orderList',
                                label: '查看订单',
                                data: orderDetailModel.merchantOrderNo
                            }]
                        }
                    }
                );
            }).catch((e) => {
                Toast.$toast(e.msg);
            });
        }

    }
}
const styles = StyleSheet.create({
    containerStyle: {
        height: px2dp(48), flexDirection: 'row', alignItems: 'center',
        justifyContent: 'flex-end', backgroundColor: 'white', marginTop: 1
    },
    touchableStyle: {
        borderWidth: 1,
        height: px2dp(24),
        borderRadius: px2dp(12),
        marginRight: px2dp(10),
        justifyContent: 'center',
        alignItems: 'center',
        width: px2dp(70),
        borderColor: DesignRule.lineColor_inWhiteBg
    }
});
