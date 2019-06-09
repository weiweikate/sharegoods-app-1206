
const OrderType = {
    DELETED:     0, // "已删除"
    WAIT_PAY:    1, //"待付款"
    WAIT_DELIVER:2, //"待发货"
    DELIVERED:   3, //"已发货")
    COMPLETED:   4, //"交易完成"
    CLOSED:      5, // "交易关闭"
    PAID:        6, //"已付款"
}

const ActivityTypes = {
    SECKILL:         1,  //"秒杀"
    DEPRECIATE:      2,  //"降价拍"
    LEVELUP_PACKAGE: 3,  //"升级礼包"
    ORDINARY_PACKAGE:4,  // "普通礼包"
    EXPRIENCE:       5,  //"经验专区"
    MIAO_SHA:        10, //"秒杀"
    TAO_CAN:         20, //"套餐"
    ZHI_JIANG:       30, //"直降"
    MAN_JIAN:        40, //"满减")
}

const ViewOrderStatus = {
    0:  {
        status: '已删除',
        menuData:[],
    },
    1:  {
        status: '待付款',
        menuData:[{ id:1, operation:'取消订单', isRed:false},
                  { id:2, operation:'去支付'  , isRed:true, }],
    },
    2:  {
        status: '待发货',
        menuData:[{ id:1, operation:'取消订单', isRed:false}],
    },
    3:  {
        status: '已发货',
        menuData:[{ id:5, operation:'查看物流', isRed:false, },
                  { id:6, operation:'确认收货', isRed:true, }],
    },
    4:  {
        status: '交易完成',
        menuData:[{ id:7, operation:'删除订单', isRed:false, },
                  { id:8, operation:'再次购买', isRed:true, }],
    },
    5:  {
        status: '交易关闭',
        menuData:[{ id:7, operation:'删除订单', isRed:false, },
                  { id:8, operation:'再次购买', isRed:true, }],
    },
    6:  {
        status: '已付款',
        menuData:[{ id:1, operation:'取消订单', isRed:false}],
    },
}

function GetViewOrderStatus(status) {
    if (status){
        return ViewOrderStatus[status] || {menuData:[]}
    }
    return {menuData:[]}
}

function checkOrderAfterSaleService(products = [], status, nowTime) {
    if (status === OrderType.WAIT_PAY ||
        status === OrderType.DELETED ||
        status === OrderType.CLOSED
    ) {//待付款、无售后
        return false;
    }
    let hasAfterSaleService = false;

    products.forEach((product) => {
        let { activityList, afterSaleEndTime ,status: afterStaus} = product
        activityList = activityList || [];
        let activityTypes = activityList.map((item) => {
            return item.activityType;
        });
        //礼包产品3  经验值专区商品5 只支持换
        if (activityTypes.indexOf(ActivityTypes.LEVELUP_PACKAGE) !== -1 || activityTypes.indexOf(ActivityTypes.ORDINARY_PACKAGE) !== -1) {
            if (status === OrderType.WAIT_DELIVER || status === OrderType.PAID){
                return;
            }
        }

        if (status === OrderType.COMPLETED && nowTime && afterSaleEndTime && afterSaleEndTime < nowTime && !(afterStaus<7 && afterStaus>=1)) {
            return;
        }

        hasAfterSaleService = true;
    })


    return hasAfterSaleService

}


export {OrderType, GetViewOrderStatus, checkOrderAfterSaleService};
