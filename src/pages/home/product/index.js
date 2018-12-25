
import ProductDetailPage from "./ProductDetailPage";
import CheckBigImagesView from "./CheckBigImagesView";
import xpProduct from './xpProduct'

export default {
    moduleName: 'product',    //模块名称
    childRoutes: {          //模块内部子路由
        ProductDetailPage,
        CheckBigImagesView,
        xpProduct
    }
}
