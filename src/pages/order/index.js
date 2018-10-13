import afterSaleService from './afterSaleService';
import logistics from './logistics';
import order from './order';
export default {
    moduleName: 'order',    //模块名称
    childRoutes: {          //模块内部子路由
        afterSaleService,   //售后模块
        logistics,   //物流模块
        order,  //订单模块
    }
};
