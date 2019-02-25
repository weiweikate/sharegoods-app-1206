import ShowListPage from "./ShowListPage"
import ShowDetailPage from './ShowDetailPage'
import ShowGoodsPage from './ShowGoodsPage'
import ShowConnectPage from './ShowConnectPage'
import ShowDetailImagePage from './ShowDetailImagePage'

export default {
    moduleName: 'show',
    childRoutes: {
        ShowListPage,
        ShowDetailPage,
        ShowGoodsPage,
        ShowConnectPage,
        ShowDetailImagePage
    }
}
