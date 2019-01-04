/**
 * @author xzm
 * @date 2018/10/23
 */
import RouterMap from '../../../navigation/RouterMap';

const MessageUtils = {

    goDetailPage(navigation, type, params, time) {
        let pagParams = params;
        switch (type) {
            case 100://支付成功
                pagParams = JSON.parse(params);
                pagParams.type = "pay_success";
                pagParams.time = time;
                navigation("message/PayMessagePage", pagParams);
                break;
            case 101://支付失败
                pagParams = JSON.parse(params);
                pagParams.type = "pay_refund";
                pagParams.time = time;
                navigation("message/PayMessagePage", pagParams);
                break;
            case 105://优惠劵
                navigation(RouterMap.CouponsPage);

                break;
            case 107://秒杀
                navigation("topic/TopicDetailPage", {
                    activityCode: params,
                    activityType: 1,preseat:'消息'
                });
                break;
            case 108://降价拍
                navigation("topic/TopicDetailPage", {
                    activityCode: params,
                    activityType: 2,preseat:'消息'
                });
                break;
            case 104://订单超时
            case 110://订单发货
                pagParams = JSON.parse(params);
                navigation('order/order/MyOrdersDetailPage', {
                    orderNo: pagParams.orderNo,
                });
                break;
            case 120://售后服务(退款申请)
                pagParams = JSON.parse(params);
                navigation('order/afterSaleService/ExchangeGoodsDetailPage', {
                    returnProductId: pagParams.returnProductId,
                    pageType: 0,
                });
                break
            case 121://售后服务(退货申请)
                pagParams = JSON.parse(params);
                navigation('order/afterSaleService/ExchangeGoodsDetailPage', {
                    returnProductId: pagParams.returnProductId,
                    pageType: 1,
                });
                break
            case 122://售后服务(换货申请)
                pagParams = JSON.parse(params);
                navigation('order/afterSaleService/ExchangeGoodsDetailPage', {
                    returnProductId: pagParams.returnProductId,
                    pageType: 2,
                });
                break
            case 123://推广消息
                pagParams = JSON.parse(params);
                navigation('mine/promotion/PromotionDetailPage',pagParams)
                break
            case 202://请出消息
            case 203://招募消息
            case 204://拼店成功
            case 206://申请的店铺已同意
            case 207://申请的店铺拒绝了您
            case 212://招募
                pagParams = {storeCode:params};
                navigation("spellShop/MyShop_RecruitPage", pagParams);
                break;
            default:
                break;

        }

    }
};
export default MessageUtils;
