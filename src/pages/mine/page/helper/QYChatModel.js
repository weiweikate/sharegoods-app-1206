import {
    NativeModules,
    Platform
} from 'react-native';
import user from '../../../../model/user';
import DeviceInfo from 'react-native-device-info/deviceinfo';

const { QYChatModule, JRQYService } = NativeModules;

export default {
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
            systemVersion: DeviceInfo.getSystemVersion(),
            phoneNum: user.phone + ''
        };
        if (Platform.OS === 'ios') {
            JRQYService.initQYChat(jsonParams, () => {

            });
        }
    },

    /**
     * 发起请求
     * @param obj
     * {
     * chatType: 0 消息列表 1 商品详情 2 订单
     * groupId : 组id
     * data：{
     *      相关信息
     *      }
     *     }
     */
    startChat(obj) {


    },
    /**
     * 发起客服聊天
     * @param jsonParams
     */
    qiYUChat() {
        let jsonParams = {
            groupId: 0,
            staffId: 0,
            title: '秀购客服',
            userId: user.code + '',
            userIcon: user.headImg,
            nickName: user.nickname,
            device: DeviceInfo.getDeviceName(),
            systemVersion: DeviceInfo.getSystemVersion(),
            phoneNum: user.phone + ''
        };

        QYChatModule.qiYUChat(jsonParams);
    },
    /**
     * 退出客服聊天系统
     */
    qiYULogout() {
        QYChatModule.qiYULogout();
    }
};
