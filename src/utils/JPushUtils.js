import userModel from '../model/user';
import apiEnvironment from '../api/ApiEnvironment';
import deviceInfo from 'react-native-device-info';
import {
    NativeModules
} from 'react-native';

export default {
    /**
     * 更新别名
     */
    updatePushTags: () => {
        /**
         * 未登陆状态直接返回
         */
        if (!userModel.isLogin) {
            return;
        }
        let temObj = {};
        /**
         * 用户等级
         * user level : V0 V1 V2
         */

        if (userModel.levelRemark) {
            temObj.levelRemark = userModel.levelRemark;
        }
        /**
         * dType
         * 用户类型
         */
        if (userModel.dType) {
            if (userModel.dType === 1) {
                temObj.dType = '网信会员';
            } else if (userModel.dType === 2) {
                temObj.dType = '供货会员';
            } else if (userModel.dType === 3) {
                temObj.dType = '网红会员';
            }
        }
        /**
         * 激活状态
         *
         */
        if (userModel.status) {
            if (userModel.status === 0) {
                temObj.status = '未激活';
            } else if (userModel.status === 1) {
                temObj.status = '已激活';
            }
        }
        /**
         * 环境
         */
        let enviromentName = apiEnvironment.getCurrentHostName() || '测试';
        temObj.environment = enviromentName;
        /**
         * 版本号
         */
        let version = deviceInfo.getVersion();
        temObj.version = version;
        NativeModules.commModule.updatePushTags(temObj);
    },
    /**
     * 更新别名 一个设备只能有一个别名
     * {
     * userId:userModel.id
     * }
     *
     */
    updatePushAlias: () => {
        if (userModel.id && userModel.id !== 0) {
            let tempObj = {
                userId: userModel.code + ''
            };
            NativeModules.commModule.updatePushAlias(tempObj);
        }
    }
};
