import ShowListPage from './ShowListPage'
import ShowDetailPage from './ShowDetailPage'
import ShowConnectPage from './ShowConnectPage'
import ShowDetailImagePage from './ShowDetailImagePage'
import ReleaseNotesPage from './ReleaseNotesPage'
import ShowProductListPage from './ShowProductListPage'
import ShowRichTextDetailPage from './ShowRichTextDetailPage'
import MyDynamicPage from './MyDynamicPage'
import TagSelectorPage from './TagSelectorPage'
import TagDetailPage from './TagDetailPage'
import ShowVideoPage from './ShowVideoPage'
import FansListPage from './FansListPage'
export default {
    moduleName: 'show',
    childRoutes: {
        ShowListPage,
        ShowDetailPage,
        ShowConnectPage,
        ShowDetailImagePage,
        ReleaseNotesPage,
        ShowProductListPage,
        ShowRichTextDetailPage,
        MyDynamicPage,
        TagSelectorPage,
        TagDetailPage,
        ShowVideoPage,
        FansListPage
    }
}
