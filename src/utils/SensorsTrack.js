import { NativeModules,Platform } from 'react-native';
// import SensorsEvent from './SensorsEvent'
import SensorsEvent from './TrackEvent'
import user from '../model/user';
import apiEnvironment from '../api/ApiEnvironment';
import EmptyUtils from './EmptyUtils';
// import StringUtils from './StringUtils';
let timeStamp = null;
const {
    track:nativeTrack,
    trackTimerStart,
    trackTimerEnd,
    trackViewScreen,
    logout,
    login
} = NativeModules.RNSensorsAnalyticsModule;
// track("event_name",parmas)
// trackTimerStart("event_name")
// trackTimerEnd("event_name",parmas)

const spellShopTrack = {
    IndexStoreBannerClick:'IndexStoreBannerClick',//拼店首页banner推荐位
    SharePin:'SharePin',//分享拼店
    PinShopEnter:'PinShopEnter',//查看拼店
    ViewPinShop:'ViewPinShop',//浏览拼店
}

const commonEvent = {
    SkipMarkClick:'SkipMarkClick',//跳标埋点
}

const productTrack = {
    CategorySearchBannerClick:'CategorySearchBannerClick',//类目搜索banner广告位
    ProductListClick:'ProductListClick',//搜索页-商品列表页点击
    Search:'Search',//搜索
    ProductDetail:'productDetail',//浏览商品详情页,
    productDetailBtnClick:'productDetailBtnClick',//按钮点击
    AddToShoppingcart:'AddToShoppingcart',//加入购物车
    Share:'Share',//分享商品
    SpikeTimeClick:'FlashSaleTimeRangeClick',// 限时购tab
    SpikeProdClick:'FlashSaleProductClick',// 限时购商品
    homeTopicProdClick:'SpecialTopicProductClick',// 专题商品
    HomePagePopShow: 'HomePagePopShow',//homePagePopType 首页弹窗展示  0：未知 1：限时购免单 2：公告 3：用户等级升级 4：新手礼包  5：APP升级 6：奖池中奖弹框
    HomePagePopBtnClick: 'HomePagePopBtnClick',//homePagePopType homePagePopImgURL  图片地址
}

const homeEvent = {
    MissionBtnClick: 'MissionBtnClick',//任务按钮点击
    BoxBtnClick: 'BoxBtnClick',//宝箱按钮点击
    MissionFrameBtnClick: 'MissionFrameBtnClick',//任务按钮点击
    ViewHomePageChannel: 'ViewHomePageChannel',
    ViewHomePage: 'ViewHomePage',
//     CategoryBtnClick  类目页按钮点击  点击    $预置属性
//     firstCategoryId  一级类目id  字符串  8.15
//     firstCategoryName  一级类目名称  字符串  8.15
//     contentType  内容类型  字典  8.15  0：未知 1：商品 2：链接 3：专题 4：秀场 5：礼包  6：限时购 7：抽奖 8：直降商品 9：优惠券 10：文本 11：tab导航 12：类目
// contentKey  内容key  字符串  8.15  根据内容类型取值，如为商品则值为商品Code；如为二级类目则为二级类目id
// contentValue  内容值  字符串  8.15  根据内容key取值，如为商品则值为商品名称，如为二级类目，则为二级类目名称
    CategoryBtnClick: 'CategoryBtnClick',
//     SpecialTopicBtnClick  专题页按钮点击  点击    $预置属性  　  8.15
//     specialTopicId  专题id  字符串  8.15
//     specialTopicArea  专题页的区域  字典  8.15  0：未知 1：图片 2：导航 3：商详列表 4：优惠券 5：限时购 6：文本
// contentType  内容类型  字典  8.15  0：未知 1：商品 2：链接 3：专题 4：秀场 5：礼包  6：限时购 7：抽奖 8：直降商品 9：优惠券 10：文本 11：tab导航
// contentKey  内容key  字符串  8.15  根据内容类型取值，如为商品则值为商品Code；如为链接则值为链接等
// contentValue  内容值  字符串  8.15  根据内容key取值，如为商品则值为商品名称，特别说明：如果专题页位置 = 导航，则这里为导航名称
    SpecialTopicBtnClick: 'SpecialTopicBtnClick',
    HomeRecommendClick: 'HomeRecommendClick'
}
/** 订单相关的埋点事件名称*/
const inviteEvent = {
    QrCodeShareto: 'QrCodeShareto',//分享二维码
    ClickLotteryPage: 'ClickLotteryPage',//首页抽奖
    ViewOrderConfirmPage: 'ViewOrderConfirmPage'//浏览下单页
}

const showEvent = {
    ViewXiuChang:'ViewXiuChang',//秀场页浏览
    ViewXiuChangDetails:'ViewXiuChangDetails',//秀场文章详情查看
    XiuChangEnterClick:'XiuChangEnterClick',//秀场进入按钮
    XiuChangLikeClick:'XiuChangLikeClick',//秀场点赞按钮点击
    XiuChangDownLoadClick:'XiuChangDownLoadClick',//秀场下载按钮点击
    XiuChangShareClick:'XiuChangShareClick',//秀场分享按钮点击,
    XiuChangAddToCart:'XiuChangAddToCart',//加入购物车点击确认
    XiuChangSpuClick:'XiuChangSpuClick',//点击商品
}

const mineEvent = {
    ClickModifyAvatar: 'ClickModifyAvatar', //点击修改头像
    ModifuAvatarSuccess: 'ModifuAvatarSuccess', // 修改头像成功
    ClickModifyNickName: 'ClickModifyNickName', // 点击修改昵称
    ModifyNickNameSuccess: 'ModifyNickNameSuccess', //修改昵称成功
    ClickRealCodeentityVerify: 'ClickRealCodeentityVerify', //点击实名认证
    ReadCodeentityVerifySuccss: 'ReadCodeentityVerifySuccss', //实名认证成功
    ClickOnlineCustomerService: 'ClickOnlineCustomerService', //点击在线客服 0：未知 1：tab我的-帮助与客服 2：商品详情页3：我的订单 4：售后详情页 100：其他
    ClickPhoneCustomerService: 'ClickPhoneCustomerService', //点击客服电话    0：未知 1：tab我的-帮助与客服 2：商品详情页3：我的订单 4：售后详情页 100：其他
    ViewInviteFriends:'ViewInviteFriends', //点击邀请好友按钮
}

const afterEvent = {
    ApplyReturn: 'ApplyReturn' // 0：未知 1：仅退款 2：退货退款 3：换货
}
const trackEvent = {
    CategoryClick:'CategoryClick',
    bannerClick: 'BannerClick',
    login: 'Login',//登录
    signUp: 'SignUp',//注册
    search: 'Search',//商品搜索
    submitOrderDetail: 'SubmitOrderDetail',//提交订单详情
    // payOrder: 'PayOrder',//支付订单
    payOrderDetail: 'PayOrderDetail',//支付订单详情
    // cancelPayOrder: 'CancelPayOrder',//取消订单
    applyReturn: 'ApplyReturn',//申请退货
    receiveDiscount: 'ReceiveCoupons',//领取优惠券
    receiveOneyuan: 'ReceiveOneyuan',//领一元券
    receiveExp: 'ReceiveExp',//经验值变动
    receiveshowDou: 'ReceiveshowDou',//秀豆变动
    contact: 'Contact',//联系客服
    ArticleDisplay: 'ArticleDisplay',//文章浏览
    ArticleShare: 'ArticleShare',// 文章分享
    BuyGiftSubmit: 'BuyGiftSubmit',//购买礼包
    MesInviteJoinPin: 'MesInviteJoinPin',//邀请加入拼店
    MesInviteJoinPinResult: 'MesInviteJoinPinResult',//邀请加入拼店—结果反馈
    MesApplyJoinPin: 'MesApplyJoinPin',//申请加入拼店
    MesApplyJoinPinResult: 'MesApplyJoinPinResult',//申请加入店铺——结果反馈
    ReceiveDividents: 'ReceiveDividents',//收到分红
    VIPChange: 'VIPChange',//会员流转
    QrcodeShareto: 'QrcodeShareto',//分享二维码,

    ProblemFeedback:'ProblemFeedback',//点击问题反馈,
    ClickContactCustomerService:'ClickContactCustomerService',//点击联系客服
    ViewCoupon:'ViewCoupon',//点击查看优惠券点击查看优惠券
    ViewWaitToRecord:'ViewWaitToRecord',//点击查看待入帐
    ModifuAvatarSuccess:'ModifuAvatarSuccess',//修改头像
    ViewMyOrder:'ViewMyOrder',//查看-我的订单
    OrderAgain:'OrderAgain',//再次购买
    submitOrder: 'SubmitOrder',//提交订单,
    SubmitOrderDetail:'SubmitOrderDetail',//提交订单详情
    ...spellShopTrack,
    ...productTrack,
    ...inviteEvent,
    ...mineEvent,
    ...afterEvent,
    ...commonEvent,
    ...homeEvent,
    ...showEvent
};

function track(event_name,parmas) {
    if (!event_name || event_name.length === 0){
        return;
    }
    //不为线上环境就，不上传埋点数据
    let track_testPhones = ['13675893461'];//这些为数据测试手机号，任何环境都上报传埋点数据
    if (apiEnvironment.envType !== 'online' && track_testPhones.indexOf(user.phone || '') === -1) {
        return;
    }
    let currentTimeStamp = new Date().getTime();
    //时间间隔超过10分钟重新生成sessionId
    if (!timeStamp || currentTimeStamp - timeStamp > 1000 * 60 * 10) {
        timeStamp = currentTimeStamp
    }
    parmas = {
        'platformType':Platform.OS === 'ios' ? 'iOS' : 'Android',
        'userLevel':user.isLogin ? user.level : 'V1',
        // "distinct_id":user.isLogin?user.id:'',
        sessionId:'sessionId_' + timeStamp,
        ...parmas
    }
    EmptyUtils.clearEmptyProperty(parmas)
    nativeTrack(event_name,parmas);
}

function trackUtil(p) {
    let arr = {};
    let keys = Object.keys(p);
    const count = keys.length;
    for (let i = 0; i < count; i++) {
        let key = keys[i];
        let value = p[key]
        arr[key] = (s) => {
            track(value.name, {
                ...value.params,...s})
        }
    }
    return arr;
}

const TrackApi = trackUtil(SensorsEvent)

export {
    track,
    trackTimerStart,
    trackTimerEnd,
    trackViewScreen,
    logout,
    login,
    trackEvent,
    trackUtil,
    TrackApi
};

/**
 * 导出 login 方法给 RN 使用.
 *
 * @param loginId 用户唯一下登录ID
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.login("developer@sensorsdata.cn")}>
 *     </Button>
 */

/**
 * 导出 logout 方法给 RN 使用.
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.logout()}>
 *     </Button>
 */

/**
 * 导出 trackViewScreen 方法给 RN 使用.
 *
 * 此方法用于 RN 中 Tab 切换页面的时候调用，用于记录 $AppViewScreen 事件.
 *
 * @param url        页面的 url  记录到 $url 字段中(如果不需要此属性，可以传 null ).
 * @param properties 页面的属性.
 *
 * 注：为保证记录到的 $AppViewScreen 事件和 Auto Track 采集的一致，
 *    需要传入 $title（页面的title） 、$screen_name （页面的名称，即 包名.类名）字段.
 *
 * RN 中使用示例：
 *     <Button
 *            title="Button"
 *            onPress={()=>
 *            RNSensorsAnalyticsModule.trackViewScreen(null,{"$title":"RN主页","$screen_name":"cn.sensorsdata.demo.RNHome"})}>
 *     </Button>
 *
 */
