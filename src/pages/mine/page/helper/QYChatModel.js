import {
    NativeModules
} from 'react-native';
import user from '../../../../model/user';
import DeviceInfo from 'react-native-device-info/deviceinfo';

const { QYChatModule } = NativeModules;

/**
 *
 */

export default {
    /**
     * groupId:0,
     * staffId:0,
     * title:'七鱼金融',
     * userId:用户id
     * userIcon:用户头像,
     * phoneNum:用户手机号,
     * nickName:用户名称,
     * device:手机型号
     * systemVersion:手机系统版本
     */

    jsonParams: {
        groupId: 0,
        staffId: 0,
        title: '秀购客服',
        userId: user.id || null,
        userIcon: user.headImg,
        nickName: user.nickname,
        device: DeviceInfo.getDeviceName(),
        systemVersion: DeviceInfo.getSystemVersion()
    },

    /**
     * 发起客服聊天
     * @param jsonParams
     */
    qiYUChat(jsonParams) {
        QYChatModule.qiYUChat(jsonParams);
    },
    /**
     * 退出客服聊天系统
     */
    qiYULogout() {
        QYChatModule.qiYULogout();
    }
};
