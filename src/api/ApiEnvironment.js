/**
 * Created by wjyx on 2018/7/26.
 * Api HOST配置
 * 支持动态切换
 */
import { AsyncStorage } from 'react-native';
import config from '../../config';
// 磁盘缓存key
const KEY_ApiEnvironment = 'ApiEnvironment';
const KEY_DefaultFetchTimeout = 'DefaultFetchTimeout';
// HOST配置
const ApiConfig = config.env;

class ApiEnvironment {

    constructor() {
        const envType = config.envType;
        this.envType = envType && Object.keys(ApiConfig).indexOf(envType) >= 0 ? envType : 'online';
        //预上上线直接使用release
        // this.envType =  "pre_release"
        this.defaultTimeout = 15; // 请求默认超时时间 单位秒
    }

    // 获取当前主机地址中文名称描述
    getCurrentHostName() {
        return ApiConfig[this.envType].name;
    }

    // 获取当前主机地址host
    getCurrentHostUrl() {
        return ApiConfig[this.envType].host;
    }

    // 获取当前H5主机地址host
    getCurrentWxAppletKey() {
        return ApiConfig[this.envType].wxAppletKey;
    }

    getCurrentH5Url() {
        return ApiConfig[this.envType].h5;
    }

    getMiniProgramType() {
        return ApiConfig[this.envType].miniProgramType === 0 ? 0 : 2;
    }

    // 获取当前oss域名
    getCurrentOssHost() {
        return ApiConfig[this.envType].oss;
    }


    // 获取所有的主机地址配置
    getAllHostCase() {
        return JSON.parse(JSON.stringify(ApiConfig));
    }

    // 获取是否存在host主机地址
    isHostExistWithEnvType(envType) {
        if (!ApiConfig[envType]) {
            return false;
        }
        return !!(ApiConfig[envType].host);
    }

    /**
     * 从磁盘加载最近一次设置的HOST地址和网络超时时间
     * @returns {Promise<void>}
     */
    async loadLastApiSettingFromDiskCache() {
        try {
            const [[, envType], [, defaultTimeout]] = await AsyncStorage.multiGet([KEY_ApiEnvironment, KEY_DefaultFetchTimeout]);
            if (envType && Object.keys(ApiConfig).indexOf(envType) >= 0) {
                this.envType = envType;
            }
            if (defaultTimeout && Number(defaultTimeout) <= 60 && Number(defaultTimeout) > 0) {
                this.defaultTimeout = Number(defaultTimeout);
            }
        } catch (err) {
            __DEV__ && console.error(`加载api-host或请求默认超时时间的配置时出错了:${err.toString()}`);
        }
    }

    /**
     * 切换环境
     * @param envType               不能传不被支持的类型
     * @returns {Promise<void>}
     */
    async saveEnv(envType) {
        try {
            if (envType && Object.keys(ApiConfig).indexOf(envType) >= 0) {
                await AsyncStorage.setItem(KEY_ApiEnvironment, envType);
                this.envType = envType;
            } else {
                __DEV__ && console.error(`Not support envType with: 【${envType}】, for more details to see documents in ApiEnvironment.js file`);
            }
        } catch (e) {
            console.warn(`saveEnv error:${e.toString()}`);
        }
    }

    /**
     * 设置超时时间
     * @param timeout               超时时间单位秒
     * @returns {Promise<void>}
     */
    async setTimeOut(timeout) {
        if (timeout && typeof timeout === 'number' && timeout <= 60 && timeout > 0) {
            this.defaultTimeout = timeout;
            // 磁盘缓存超时时间
            timeout && AsyncStorage.setItem(KEY_DefaultFetchTimeout, `${timeout}`).catch((error) => {
                console.warn(`setTimeOut error: ${error.toString()}`);
            });
        } else {
            console.warn(`timeout: ${timeout} value not support`);
        }
    }

}

const apiEnvironment = new ApiEnvironment();

export default apiEnvironment;
