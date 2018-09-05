# 秀购

## 依赖包
所有依赖包必须固定版本

## 页面修饰器的使用 PageDecorator


页面状态共有5种，如果需要管理页面状态，请配置组件配置`renderByPageState`为true并且提供管理函数`$getPageStateOptions`
```javascript
// 可枚举的页面数据加载状态
const PageLoadingState = {
    loading: "loading",
    empty: "empty",
    success: "success",
    fail: "fail",
    null: "null"
};
```

> 页面正常渲染请修改`loadingState` 为 `success`

example
```javascript
// 引用设置好的状态对象
import {PageLoadingState} from '../../components/pageDecorator/PageState';

export default class DemoListPage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            refreshing: false,
            netFailedInfo: null,
        };
    }
        
    static $PageOptions = {
            navigationBarOptions: {
                title: '导航标题',
                // show: false // 是否显示导航条 默认显示
            },
            // 是否启动页面状态管理
            renderByPageState: true,
        };
        // 与renderByPageState配合使用
        $getPageStateOptions = () => {
            return {
                loadingState: this.state.loadingState,
                // 页面数据加载失败配置
                netFailedProps: {
                    netFailedInfo: this.state.netFailedInfo,
                    reloadBtnClick: () => {
                        console.log('reload');
                        this.setState({
                            netFailedInfo: null,
                            loadingState: PageLoadingState.loading,
                        }, ()=>{
                            // todo 加载数据函数
                        });
                    },
                },
                // 页面数据为空配置
                emptyProps: {},
            };
        };
}
```

#### NetFailedView 网络数据出错组件

netFailedProps
|Prop|Type|Optional|Default|Description|
|----|----|----|----|----|
|netFailedInfo|object|Yes|{"code": -1, "msg": "未知错误,请稍后再试" }|错误信息|
|reloadBtnClick|function|yes||重试按钮点击事件|
|showReloadBtn|boolean|yes|true|是否显示重试按钮|
|buttonText|string|yes|重新加载|重试按钮文案|
|source|any|yes||图片文件|

#### EmptyView 数据为空组件

emptyProps
|Prop|Type|Optional|Default|Description|
|----|----|----|----|----|
|description|string|Yes|暂无数据|标题描述|
|isScrollViewContainer|boolean|yes|false|是否允许下拉刷新|
|isRefresh|boolean|yes||仅仅在isScrollViewContainer 为true时 生效|
|onRefresh|function|yes||刷新函数 仅仅在isScrollViewContainer 为true时 生效|
|source|any|yes||图片文件|

> 各个组件配置使用请查看组件代码 `src/components/pageDecorator/BaseView`