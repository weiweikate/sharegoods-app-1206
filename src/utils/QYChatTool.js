
import {
    // NativeModules,
    DeviceEventEmitter
} from 'react-native'

class QYChatTool {

    constructor(){
        //
     this.listener =  DeviceEventEmitter.addListener('msgChanged',)
    }

    /**
     * 消息改变后的触发回调
     * @param msgObj 回调回来的消息
     * @param callBack  回调
     */
    msgChanged=(msgObj,callBack)=>{


        callBack && callBack()

    }

    /**
     * 用户登录后自动触发此函数
     * 初始化七鱼的客服
     * @param userInfo
     * @constructor
     */
    initQYChat=(userInfo)=>{

    }

    /**
     * 发起客服客服服务
     * @param params
     * params={
     * groupId :组id
     * isFromProduct:
     * data:{包括商品的一些信息}
     * }
     */
    beginQYChat=(params)=>{

    }

}

 let qyChatTool  = new QYChatTool();
export default qyChatTool;
