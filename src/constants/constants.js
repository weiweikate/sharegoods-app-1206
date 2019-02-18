let constants = {
    //全局开关
    debugPage:'',//设置debug页面PaymentMethodPage ProductDetailPage
    vertifyCodeTime:60,//验证码计时
    needVertifyCodeToast:false,//是否开启验证码toast


    //功能常量
    TO_LOGIN:'toLogin',//用户未登录
    PAGESIZE:10,
    CARTDATA:'cartData',//离线购物车数据


    //业务常量

    /*
     * 一、总订单状态                                 子订单状态
     *
     * 1、待支付                                     待支付
     * 2、待发货                                     待发货     退款
     * 3、待收货（待确认）                            待收货     退货  冻结中
     * 4、待自提                                     待收货     退款
     * 5、确认收货                                    确认收货  退款 退货 换货 冻结中
     * 6、退货退款（全部退完，退货关闭）                 退款 退货
     * 7、已完成                                     确认收货   退款 退货
     * 8、已关闭                                     已关闭
     * 9、用户删除（实际为已完成状态）
     * 10、定时关闭                                   已关闭
     *
     * 退款：没有发货的商品，则显示退款，点击直接进入退款操作页面
     * 退换：如果已经发货，则显示退换，点击则进入选择售后类型页面
     * 退款中：退款中，如需要审核，则出现这个状态，如没有审核，则直接售后完成
     * 退换中，为退换中流程，未完成前状态
     * 售后完成：完成状态，成功与否都是显示这个状态，用户可以查看详情
     *
     * 二、checkList(operation menu-->id)which is suitable for MyOrdersListPage and MyOrdersDetailPage
     * and the following two constants is written according to this!
     *
     * 取消订单                 ->  1
     * 去支付                   ->  2
     * 继续支付                 ->  3
     * 订单退款                 ->  4
     * 查看物流                 ->  5
     * 确认收货                 ->  6
     * 删除订单(已完成)          ->  7
     * 再次购买                 ->  8
     * 删除订单(已关闭(取消))    ->  9
     *
     * 三、The router to PaymentMethodPage currently includes ConfirOrderPage,MyOrdersListPage,MyOrdersDetailPage and so on!
     * and the params currently is {orderNum:data.orderNum,amounts:amounts}
     *
     * */
    //suitable for MyOrdersListView
    viewOrderStatus:[
        {
            index:0,
            menuData:[],
        },{
            index:1,
            orderStatus:'待支付',
            menuData:[{
                id:1,
                operation:'取消订单',
                isRed:false,
            },{
                id:2,
                operation:'去支付',
                isRed:true,
            },
            //     {
            //     id:3,
            //     operation:'继续支付',
            //     isRed:true,
            // }
            ],
            menuData2:[]
        },{
            index:2,
            orderStatus:'待发货',
            menuData:[],
            menuData2:['退款','退款中','售后完成']
        },{
            index:3,
            orderStatus:'待收货',
            menuData:[{
                id:5,
                operation:'查看物流',
                isRed:false,
            },{
                id:6,
                operation:'确认收货',
                isRed:true,
            }],
            menuData2:['退换','退换中','售后完成']
        },{
            index:4,
            orderStatus:'已完成',
            menuData:[{
                id:7,
                operation:'删除订单',
                isRed:false,
            },{
                id:8,
                operation:'再次购买',
                isRed:true,
            },
                ,{
                    id:10,//完成订单的新补充功能
                    operation:'晒单',
                    isRed:true,
                }],
            menuData2:['退款','退款中','售后完成']
        },{
            index:5,
            orderStatus:'已关闭',
            menuData:[{
                id:7,
                operation:'删除订单',
                isRed:false,
            },{
                id:8,
                operation:'再次购买',
                isRed:true,
            }],
            menuData2:['退换','退换中','售后完成']
        },{
            index:6,
            orderStatus:'已关闭',
            menuData:[{
                id:7,
                operation:'删除订单',
                isRed:false,
            },{
                id:8,
                operation:'再次购买',
                isRed:true,
            }],
            menuData2:['']
        },{
            index:7,
            orderStatus:'已关闭',
            menuData:[{
                id:7,
                operation:'删除订单',
                isRed:false,
            },{
                id:8,
                operation:'再次购买',
                isRed:true,
            }],
            menuData2:['',]
        },{
            index:8,
            orderStatus:'已关闭',
            menuData:[{
                id:9,
                operation:'删除订单',
                isRed:false,
            },{
                id:8,
                operation:'再次购买',
                isRed:true,
            }],
            menuData2:['',]
        }, {
            index:9,
            orderStatus:'用户删除',
            menuData:[],
            menuData2:['',]
        }, {
            index:10,
            // orderStatus:'定时关闭',
            orderStatus:'已关闭',
            menuData:[
                {
                    id:9,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:true,
                }
            ],
            menuData2:['',]
        },
    ],




    //suitable for MyOrdersListDetail
    pageStateString:[
        {

        }, {
            index:1,
            buyState:'等待买家付款',
            // moreDetail:'28:45:45后自动取消订单',
            // sellerState:'收货人：赵信                   13588462014',
            // sellerTime:'收货地址：浙江省杭州市萧山区宁围镇鸿宁路望京商务C2-502',
            disNextView:false,
            menu:[
                {
                    id:1,
                    operation:'取消订单',
                    isRed:false,
                },{
                    id:2,
                    operation:'去支付',
                    isRed:true,
                },{
                    id:3,
                    operation:'继续支付',
                    isRed:true,
                },
            ],
        }, {
            index:2,
            buyState:'买家已付款',
            moreDetail:'',
            sellerState:'等待卖家发货...',
            sellerTime:'',
            disNextView:true,
            menu:[
                {
                    id:4,
                    operation:'订单退款',
                    isRed:false,
                }
            ],
        },{
            index:3,
            buyState:'卖家已发货',
            // moreDetail:'06天18:24:45后自动确认收货',
            sellerState:'仓库正在扫描出库...',
            // sellerTime:'2018-04-25 12:45:45',
            disNextView:true,
            menu:[
                {
                    id:5,
                    operation:'查看物流',
                    isRed:false,
                },{
                    id:6,
                    operation:'确认收货',
                    isRed:true,
                },
            ],
        },{
            index:4,
            buyState:'订单已完成',
            moreDetail:'',
             sellerState:'已签收',
            sellerTime:'',
            disNextView:true,
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:true,
                },
            ],
        },{
            index:5,
            buyState:'订单已完成',
            moreDetail:'',
            sellerState:'已签收',
            // sellerTime:'2018-04-25 12:45:45',
            disNextView:true,
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:true,
                },
            ],
        },{
            index:6,
            buyState:'交易关闭',
            moreDetail:'',
            sellerState:'已关闭',
            // sellerTime:'2018-04-25 12:45:45',
            disNextView:true,
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:false,
                },
            ],
        },{
            index:7,
            buyState:'交易关闭',
            moreDetail:'',
            sellerState:'已关闭',
            // sellerTime:'2018-04-25 12:45:45',
            disNextView:true,
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:false,
                },
            ],
        },{
            index:8,
            buyState:'交易关闭',
            moreDetail:'',
            // sellerState:'收货人：赵信                   13588462014',
            // sellerTime:'收货地址：浙江省杭州市萧山区宁围镇鸿宁路望京商务C2-502',
            disNextView:true,
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:false,
                },
            ],
        },{
            index:9,
            buyState:'已完成',
            moreDetail:'',
            sellerState:'已签收',
            // sellerTime:'2018-04-25 12:45:45',
            disNextView:true,
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:false,
                },
            ],
        },{
            index:10,
            buyState:'交易关闭',
            moreDetail:'',
            sellerState:'已关闭',
            // sellerTime:'2018-04-25 12:45:45',
            disNextView:true,
            menu:[
                {
                    id:7,
                    operation:'删除订单',
                    isRed:false,
                },{
                    id:8,
                    operation:'再次购买',
                    isRed:true,
                },
            ],
        },
    ]
};
export default constants;


