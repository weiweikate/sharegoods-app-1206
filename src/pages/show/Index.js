import ShowListPage from './ShowListPage'
import ShowDetailPage from './ShowDetailPage'
import ShowGoodsPage from './ShowGoodsPage'
import ShowConnectPage from './ShowConnectPage'
import ShowDetailImagePage from './ShowDetailImagePage'
import ReleaseNotesPage from './ReleaseNotesPage'
import ShowProductListPage from './ShowProductListPage'
import ShowRichTextDetailPage from './ShowRichTextDetailPage'
import MyDynamicPage from './MyDynamicPage'
import TagSelectorPage from './TagSelectorPage'
import TagDetailPage from './TagDetailPage'
import ShowVideoPage from './ShowVideoPage'
export default {
    moduleName: 'show',
    childRoutes: {
        ShowListPage,
        ShowDetailPage,
        ShowGoodsPage,
        ShowConnectPage,
        ShowDetailImagePage,
        ReleaseNotesPage,
        ShowProductListPage,
        ShowRichTextDetailPage,
        MyDynamicPage,
        TagSelectorPage,
        TagDetailPage,
        ShowVideoPage
    }
}
