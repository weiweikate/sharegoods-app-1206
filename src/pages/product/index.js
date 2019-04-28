import ProductDetailPage from './ProductDetailPage';
import CheckBigImagesView from './CheckBigImagesView';
import xpProduct from './xpProduct/index';
import productScore from './productScore/index';
import BigImagesPage from './BigImagesPage';
import suitProduct from './suitProduct';

export default {
    moduleName: 'product',    //模块名称
    childRoutes: {          //模块内部子路由
        ProductDetailPage,
        CheckBigImagesView,
        xpProduct,
        productScore,
        BigImagesPage,
        suitProduct
    }
};
