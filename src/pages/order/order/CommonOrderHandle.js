import OrderApi from '../api/orderApi';
import bridge from '../../../utils/bridge';
import RouterMap, { routePush } from '../../../navigation/RouterMap';
import { Alert } from 'react-native';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';

//点击订单物流
function clickOrderLogistics(merchantOrderNo){
    bridge.showLoading();
    OrderApi.getExpressPackageDetail({merchantOrderNo: merchantOrderNo}).then((data)=> {
        data = data.data || {}
        let deliveryPackage = data.deliveryPackage || [];
        let unDeliveryProductList = data.unDeliveryProductList || [];
        let length =  deliveryPackage.length + unDeliveryProductList.length;
        if (length === 0){
            bridge.$toast('无物流信息')
        } else if (length === 1){
            let express = [...deliveryPackage, ...unDeliveryProductList][0] || {}
            routePush(RouterMap.LogisticsDetailsPage,{expressNo: express.expressNo, expressCode: express.expressCode})
        } else {
            routePush(RouterMap.CheckLogisticsPage, {
                expressList: deliveryPackage,
                unSendProductInfoList: unDeliveryProductList
            });
        }
        bridge.hiddenLoading();
    }).catch((err) => {
        bridge.hiddenLoading();
        bridge.$toast(err.msg)
    })
}

function clickOrderConfirmReceipt(merchantOrderNo, subStatus, callBack){
    let content = `确定收到货了吗?`;
    if (subStatus === 3){
        content = '您还有商品未发货，确认收货吗？';
    }
    Alert.alert('', `${content}`, [
        {
            text: `取消`, onPress: () => {
            }
        },
        {
            text: `确定`, onPress: () => {
                if (subStatus === 3) {
                    return;
                }
                bridge.showLoading();
                OrderApi.confirmReceipt({ merchantOrderNo: merchantOrderNo}).then((response) => {
                    bridge.hiddenLoading();
                    routePush('order/order/ConfirmReceiveGoodsPage', {
                        merchantOrderNo: merchantOrderNo,
                        callBack: callBack
                    });
                    bridge.$toast('确认收货成功');
                }).catch(e => {
                    bridge.hiddenLoading();
                    bridge.$toast(e.msg);
                });
            }
        }

    ], { cancelable: true });

}

function clickOrderAgain(merchantOrderNo, products){
    // let cartData = products.map((item, index) => {
    //     return{
    //         productCode: item.prodCode,
    //         skuCode: item.skuCode,
    //         amount: item.quantity,
    //         spuCode: item.prodCode
    //     };
    // });
    track(trackEvent.OrderAgain,{ orderId: merchantOrderNo})
    shopCartCacheTool.addGoodItem(products);
    routePush('shopCart/ShopCart', { hiddeLeft: false });
}


export {clickOrderLogistics, clickOrderConfirmReceipt, clickOrderAgain};
