import { AfterStatus, PageType } from '../afterSaleService/AfterType';
import bridge from '../../../utils/bridge';

const OrderType = {
    DELETED:     0, // "已删除"
    WAIT_PAY:    1, //"待付款"
    WAIT_DELIVER:2, //"待发货"
    DELIVERED:   3, //"已发货")
    COMPLETED:   4, //"交易完成"
    CLOSED:      5, // "交易关闭"
    PAID:        6, //"已付款"
}

// const ActivityTypes = {
//     SECKILL:         1,  //"秒杀"
//     DEPRECIATE:      2,  //"降价拍"
//     LEVELUP_PACKAGE: 3,  //"升级礼包"
//     ORDINARY_PACKAGE:4,  // "普通礼包"
//     EXPRIENCE:       5,  //"经验专区"
//     MIAO_SHA:        10, //"秒杀"
//     TAO_CAN:         20, //"套餐"
//     ZHI_JIANG:       30, //"直降"
//     MAN_JIAN:        40, //"满减")
// }

const ViewOrderStatus = {
    0:  {
        status: '已删除',
        menuData:[],
    },
    1:  {
        status: '待付款',
        menuData:[{ id:1, operation:'取消订单', isRed:false},
                  { id:2, operation:'去支付'  , isRed:true, }],
        menu_orderDetail: [{ id:1, operation:'取消订单', isRed:false, },
                           { id:2, operation:'去支付', isRed:true, }]
    },
    2:  {
        status: '待发货',
        menuData:[],
        menu_orderDetail: []
    },
    3:  {
        status: '已发货',
        menuData:[{ id:5, operation:'查看物流', isRed:false, },
                  { id:6, operation:'确认收货', isRed:true, }],
        menu_orderDetail: [{ id: 5, operation: '查看物流', isRed: false },
                           { id: 6, operation: '确认收货', isRed: true }]
    },
    4:  {
        status: '交易完成',
        menuData:[{ id:7, operation:'删除订单', isRed:false,},
                  { id:5, operation:'查看物流', isRed:false,},
                  { id:8, operation:'再次购买', isRed:false, }],
        menu_orderDetail: [{ id:7, operation:'删除订单', isRed:false, },
                           { id:5, operation: '查看物流', isRed: false },
                           { id:8, operation:'再次购买', isRed:false, }],
    },
    5:  {
        status: '交易关闭',
        menuData:[{ id:7, operation:'删除订单', isRed:false, },
                  { id:8, operation:'再次购买', isRed:false, }],
        menu_orderDetail: [{ id:7, operation:'删除订单', isRed:false, },
                           { id:8, operation:'再次购买', isRed:false, }],
    },
    6:  {
        status: '已付款',
        menuData:[{ id:1, operation:'取消订单', isRed:false}],
        menu_orderDetail: []
    },
}

// 返回订单详情售后按钮list
function GetAfterBtns(product) {
    if (product.status === OrderType.WAIT_PAY ||
        product.status === OrderType.DELETED
    ) {
        return [];
    }

    if (product.orderType == 1){
        return [];
    }
    let { restrictions} = product
    if (restrictions) {
        if ((restrictions & 8) === 8) {
            return [];
        }
    }

    let afterSale = product.afterSale || {}
    let {type, status} = afterSale;
    if (product.status === OrderType.CLOSED){
        if(status === AfterStatus.STATUS_SUCCESS){
            return [{ id:3, operation:'售后完成', isRed:false}]
        }else {
            return [];
        }}
    if (!type){//这个type为空，说明没有申请过售后
        if (product.status === OrderType.WAIT_DELIVER) {
           return [{ id:1, operation:'退款', isRed:false}]
        }else {
            return [{ id:2, operation:'退换', isRed:false}]
        }
    }
    if(status === AfterStatus.STATUS_SUCCESS){
        return [{ id:3, operation:'售后完成', isRed:false}]
    }
    if (type === 11 || type === 12){
        type = PageType.PAGE_AREFUND;
    }
    switch (type) {
        case  PageType.PAGE_AREFUND:
            return [{ id:3, operation:'退款中', isRed:false}]
        case  PageType.PAGE_SALES_RETURN:
            return [{ id:3, operation:'退货中', isRed:false}]
        case  PageType.PAGE_EXCHANGE:
            return [{ id:3, operation:'换货中', isRed:false}]
    }
}

function GetViewOrderStatus(status, subStatus) {
    if (status){
        let data = {...ViewOrderStatus[status]} || {menuData:[], menu_orderDetail:[]}
        if (status === OrderType.DELIVERED && subStatus === 3){
            data.status = '部分发货'
        }
        return data;
    }
    return {menuData:[], menu_orderDetail:[]}
}

//判断商品List是否支持售后
function checkOrderAfterSaleService(products = [], status, nowTime, isShowToast) {
    if (status === OrderType.WAIT_PAY ||
        status === OrderType.DELETED ||
        status === OrderType.CLOSED
    ) {//待付款、无售后
        return false;
    }
    let hasAfterSaleService = false;

    products.forEach((product) => {
        let { restrictions, afterSaleEndTime ,afterSale, orderType} = product
        afterSale = afterSale || {};
        let afterStaus = afterSale.afterStaus;
        if (orderType == 1){
            if (isShowToast){
                bridge.$toast('该商品属于虚拟商品，不能售后');
            }
            return;
        }
        //SUPPORT_EXCHANGE(1, "售后仅支持换货"),
        // SUPPORT_RETURN_REFUND(2, "售后仅支持退货退款"),
        // SUPPORT_REFUND(4, "售后仅支持退款"),
        // NO_SUPPORT_AFTER_SALES(8, "不支持售后"),

        if (restrictions){
            if ((restrictions & 8) === 8) {
                if (isShowToast) {
                    bridge.$toast('该商品不支持售后');
                }
                return;
            }

            if (status === OrderType.WAIT_DELIVER || status === OrderType.PAID)
                {if ((restrictions & 4) !== 4) {
                    if (isShowToast) {
                        bridge.$toast('该商品不能退款');
                    }
                    return;
                }}
        }
        if (status === OrderType.COMPLETED && nowTime && afterSaleEndTime && afterSaleEndTime < nowTime && !(afterStaus < 7 && afterStaus >= 1)) {
            if (isShowToast){
                bridge.$toast('该商品售后已过期');
            }
            return;
        }

        hasAfterSaleService = true;
    })
    return hasAfterSaleService

}
//判断商品是否包含某些活动,并返回对应活动的数据
function judgeProduceIsContainActivityTypes(product, containActivitys = []) {
    let activityList = product.activityList || [];
    let activityTypes = activityList.map((item) => {
        return item.activityType;
    });
    //判断是否有2数组是否有交集
    for (let i = 0; i < activityTypes.length; i++){
        for (let j = 0; j < containActivitys.length; j++){
            if (activityTypes[i] === containActivitys[j]) {
                return activityList[i];
            }
        }
    }
    return null;
}


export {OrderType, GetViewOrderStatus, checkOrderAfterSaleService, GetAfterBtns, judgeProduceIsContainActivityTypes};
