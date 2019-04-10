import {
    NativeModules
} from 'react-native';
import user from '../../model/user';
import DeviceInfo from 'react-native-device-info/deviceinfo';

const { JRQYService } = NativeModules;

const beginChatType = {
    BEGIN_FROM_OTHER: 0,//从我的地方发起客服 会直接对接平台客服
    BEGIN_FROM_PRODUCT: 1,//从产品详情发起客服
    BEGIN_FROM_ORDER: 2,//从订单发起客服
    BEGIN_FROM_MESSAGE: 3//从消息列表发起客服
};


const QYChatTool = {
    /**
     * 七鱼客服的初始化，不包括groupid 用户登录后自动触发此方法
     * title:'七鱼客服',
     * userId:用户id
     * userIcon:用户头像,
     * phoneNum:用户手机号,
     * nickName:用户名称,
     * device:手机型号
     * systemVersion:手机系统版本
     */

    initQYChat() {
        let jsonParams = {
            title: '秀购客服',
            userId: user.code + '',
            userIcon: user.headImg,
            nickName: user.nickname,
            device: DeviceInfo.getDeviceName(),
            systemVersion: DeviceInfo.getSystemVersion()
        };
        JRQYService.initQYChat(jsonParams);
    },

    /**
     * 发起客服，指定特定供应商
     * @param params
     *   {
     *     routePath:''
     *     urlString:'hzmrwlyxgs-gys222.qiyukf.com', 供应商域名地址 暂时无用
     *         title:'供应商222',  供应商名称  后台给
     *        shopId: "gys222",   供应商id 用户连接供应商 后台传入
     *       chatType: beginChatType.BEGIN_FROM_PRODUCT,  发起请求类型 详见枚举
     *       数据源
     *       data:{
     *          title:'网易七鱼', 商品或订单title
     *           desc:'网易七鱼是网易旗下一款专注于解决企业与客户沟通的客服系统产品。',  描述
     *           pictureUrlString:'http://qiyukf.com/main/res/img/index/barcode.png', 商品或订单图片连接
     *           urlString:'http://qiyukf.com/', 商品或者url
     *           note:'￥10000',   商品价格或者订单号等
     *      }
     */
    beginQYChat(params = {
        routePath: '',
        urlString: '',
        title: '秀购客服',
        shopId: '',
        chatType: beginChatType.BEGIN_FROM_OTHER,
        data: {}
    }) {
        JRQYService.beginQYChat(params);
    },
    /**
     * 退出客服聊天系统
     */
    qiYULogout() {
        JRQYService.qiYULogout();
    }
};

export { QYChatTool, beginChatType };
