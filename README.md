# 秀购

## 关于数据加签
配置文件目录：`src/api/network/rsa_config.js`
需要配置的字段： `client` `version` `rsa_key`

| 参数          | 类型        | 是否必填  | 最大长度  | 描述  | 示例值  |
| ---------     |-------------| --------- | --------- | ----- | -----   |
| sign          | String | 是 | 512   | 用户请求签名，详见3.3     - header中                | 详见3.3.1   |
| timestamp     | String | 是 | 19    | 发送请求的时间，为系统当前时间毫秒数，UTC+8  - header中    | 1521813339311  |
| nonce     | String | 是 | 16    | 请求随机值 - header中     | 58442c21xug38sho1x   |
| client    | String | 是 | | 客户端 - header中| ios/android/miniapp/h5|
| version   |String |是|  | 客户端版本 - header中| 1.0|

## 依赖包
所有依赖包必须固定版本

##接口加签操作
示例
 //密码登陆
  const api={
   在接口后边加个字段 isRSA:true 所有接口默认不进行验签,如果你的接口需要延签,请进行如下配置,其他使用跟以前一样
     post接口加签
     passwordLogin: ['/user/userLogin/passwordLogin',{isRSA:true}],
     get接口加签
     passwordLogin: ['/user/userLogin/passwordLogin',{isRSA:true,method:'get'}],
  } 
  const LoginAPI = ApiUtils(api);
  export default LoginAPI;

##ios自动化本地打包
在项目根目录下执行  
1. cd PackageShellFiles
2. sh iosBuild.sh
程序会自动打包ipa文件,并将包自动上传至蒲公英 
蒲公英账号密码:  账号：13735533492 密码：123qwe
ipa包存储路径为打包机器的  /Users/当前用户名/Documents/app/ios-adHoc 中,报名为打包日期 如: 2018-09-28日17/59/14


## 倒计时工具使用 TimeDownUtils

参数1,回调函数,每秒回调一次,回调参数为倒计时到第几秒了
参数2,倒计时的秒数,不写默认60
startDown(callBack, downTime = this.downTime)

使用实例
```javascript
(new TimeDownUtils()).startDown((time) => {
    this.LoginModel.dowTime = time;
},100);
```



## API 使用
默认请求方式为`POST` , 如果需要`GET`则以数组模式配置

```javascript
const api = {
    getList:['/ai/data/list',{method:'get'}],
    login:'/api/user/login',
    logout:'/api/user/logout',
}
import ApiUtils from '../../../network/ApiUtils';

const LoginApi = ApiUtils(api);

LoginApi.login({name:'damon',pwd:'123456'}).then(result => {
    // 成功处理
}).catch(error => {
    // 错误处理
})
```
        
           

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
import BasePage from '../../BasePage'

export default class DemoListPage extends BasePage {
    
    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            refreshing: false,
            netFailedInfo: null,
        };
    }
    // 导航配置
    $navigationBarOptions = {
        title:'我是标题',
        show: false // false则隐藏导航
    }
    // 页面状态管理（选填）
    $getPageStateOptions = () => {
       return {
           loadingState: this.state.loadingState,
           emptyProps: {
               isScrollViewContainer: true,
               description: '暂无记录'
           }
       };
    };
    // 请使用下划线render
    _render() {
        return (<View></View>)
    }
}
```


自带的方法

```javascript
this.$loadingShow('i am a message')

```
- `$loadingShow` 弹出提示信息，默认显示2.5秒
- `$loadingDismiss` 隐藏提示信息
- `$navigateBack` 返回上一级
- `$navigate` 路由跳转 接受routeName
- `$NavigationBarResetTitle` 重置标题名称
- `$loadingDismiss` 隐藏提示信息
- `$NavBarLeftPressed` 左侧点击事件
- `$NavBarRightPressed` 右侧点击事件


跳转到某一h5页面

```javascript
// 注意 调用$navigate 需继承BasePage
this.$navigate('HtmlPage', {
    title: '用户协议内容',
    uri: 'https://reg.163.com/agreement_mobile_ysbh_wap.shtml?v=20171127'
});

// A->B->C C返回
this.$navigateBack(-2)


// 返回到首页
// routeName 可以不写默认为Tab
this.$navigateReset(routeName)
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

#### Android相关
* react-native三方库模块gradle文件配置请在android工程目录下找对应的gradle引入即可,例如：apply from: '../../../android/rn-vector-icons.gradle'

### 关于多渠道打包
  * 构建基准包：运行 assembleRelease task 构建基准包
  * 打包工具：walle gradle接入方式（也可采用命令行的方式）
  * 打包命令：上传360或爱加密等进行加固，获取未签名包
  
    1.对齐优化：./zipalign -v 4 app-release.encrypted.apk app-release.encrypted_zipalign.apk
        
    2.apksigner V2签名：./apksigner sign --ks sharegoods.jks --out app-release.encrypted_signed.apk  app-release.encrypted_zipalign.apk
        
    3.检查是否签名成功：java -jar CheckAndroidV2Signature.jar app-release.encrypted_signed.apk
        
    4.批量写入渠道：java -jar walle-cli-all.jar batch -f channel app-release.encrypted_signed.apk /Users/louis/tool/1.0.7
        
    5.单个写入渠道：java -jar walle-cli-all.jar put -c wandoujia app-release.encrypted_signed.apk