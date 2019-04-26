import res from '../../../comm/res';
import afterSaleService from './afterSaleService';

const index = {
    addressLine: require('./addressLine.png'),
    arrow_right: res.button.arrow_right_black,
    buyerHasPay: require('./buyerHasPay.png'),
    car: require('./car.png'),
    copy: require('./copy.png'),
    dingdanxiangqing_icon: require('./dingdanxiangqing_icon_fuk.png'),
    dingdanxiangqing_icon_guangbi: require('./dingdanxiangqing_icon_guangbi.png'),
    dingdanxiangqing_icon_yifehe: require('./dingdanxiangqing_icon_yifehe.png'),
    dingdanxiangqing_icon_yiwangcheng: require('./dingdanxiangqing_icon_yiwangcheng.png'),
    dingdanxianqing_icon_yifuk: require('./dingdanxianqing_icon_yifuk.png'),
    dingdanxiangqing_icon_fuk: require('./dingdanxiangqing_icon_fuk.png'),
    dizhi: require('./dizhi.png'),
    dizhi_icon: require('./dizhi_icon.png'),
    kongbeiye_wulian: require('./kongbeiye_wulian.png'),
    kongbeuye_dingdan: require('./kongbeuye_dingdan.png'),
    logisticsBottom: require('./logisticsBottom.png'),
    logisticsTop: require('./logisticsTop.png'),
    no_wuliu: require('./no_wuliu.png'),
    productDetailHome: require('../../home/res/ic_to_home.png'),
    productDetailImg: require('./productDetailImg.png'),
    productDetailMessage: require('../../home/res/message_black.png'),
    search_icon: require('./search_icon.png'),
    search: require('./search.png'),
    coupons_icon: require('./coupons_icon.png'),
    message_bg: require('./dingdan_bg_gengduo_nor.png'),
    message_three: require('./tongyong_icon_more_nor.png'),
    delete_icon: require('./tongyong_icon_dingdan_nor.png'),
    empty_icon: require('./emptyIcon.png'),
    afterSaleService: {
        ...afterSaleService
    },
    ...res
};
export default index;
