import res from '../../../../comm/res';
import detailNavView from './detailNavView';
import xpProduct from './xpProduct/index';
import productScore from './productScore';
import service from './service';
import suitProduct from './suitProduct';
import pDetailNav from './pDetailNav';

const product = {
    ...res,
    detailShowBg: require('./detailShowBg.png'),
    home: require('./home.png'),
    icon_close: require('./icon_close.png'),
    jiarugouwuche_no: require('./jiarugouwuche_no.png'),
    message: require('./message_black.png'),
    share: require('./share.png'),
    detail_search: require('./detail_search.png'),
    detail_kefu: require('./detail_kefu.png'),
    xiangqing_btn_gouwuche_nor: require('./xiangqing_btn_gouwuche_nor.png'),
    me_bangzu_kefu_icon: require('./me_bangzu_kefu_icon.png'),
    product_icon_home: require('./product_icon_home.png'),
    arrow_right_red: require('./arrow_right_red.png'),
    product_coupon: require('./product_coupon.png'),
    detailNavView: {
        ...detailNavView
    },
    xpProduct: {
        ...xpProduct
    },
    productScore: {
        ...productScore
    },
    service: {
        ...service
    },
    suitProduct: {
        ...suitProduct
    },
    pDetailNav: {
        ...pDetailNav
    }
};
export default product;
