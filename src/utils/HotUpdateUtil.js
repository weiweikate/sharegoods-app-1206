import {
    Platform,
    // Alert,
    // Linking
} from 'react-native';
import {
    isFirstTime,
    isRolledBack,
    checkUpdate,
    downloadUpdate,
    // switchVersion,
    switchVersionLater,
    markSuccess,
    packageVersion,
    currentVersion
} from 'react-native-update';

import _updateConfig from '../../update.json';
import Storage from './storage';
import config from '../../config'
const key = config["isDevHotUpdate"]?"dev_"+Platform.OS:Platform.OS;
console.log('热更新key-----'+key);
const { appKey } = _updateConfig[key];
console.log('热更新key-----'+appKey);

class HotUpdateUtil {
    //普通更新的时间差 key
    static TIME_INTERVAL_KEY = 'TIME_INTERVAL_KEY';
    //用于存储更新失败的版本
    static UPDATE_ERROR_VERSION = 'UPDATE_ERROR_VERSION';
    appVersion = '';
    hashVersion = '';

    constructor() {
        if (isFirstTime) {
            this.signSuccess();
        } else if (isRolledBack) {
            console.log('刚刚更新失败,版本回滚');
        }
        /**
         * 暂存版本号,和哈希版本版本值
         * @type {*|string}
         */
        this.appVersion = packageVersion || '';
        this.hashVersion = currentVersion || '';
    }

    /**
     * 标记更新成功
     */
    signSuccess = () => {
        markSuccess();
    };
    /**
     * 更新完毕
     * @param info 从update服务器获取的数据
     */
    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            // Alert.alert('提示', '下载完毕,是否重启应用?', [
            //     {
            //         text: '是', onPress: () => {
            //             switchVersion(hash);
            //         }
            //     },
            //     {
            //         text: '下次启动时', onPress: () => {
            //             switchVersionLater(hash);
            //         }
            //     }
            // ]);
            //重新启动更新,不再有提示
            switchVersionLater(hash);
        }).catch(err => {
            // Alert.alert('提示', '更新失败.' + err);
            // console.log('失败提示' + info);
            // this.saveErrorVersion(info);
        });
    };
    /**
     * 检测更新
     * info 自定义字段
     * {
     *  downloadUrl: "https://itunes.apple.com/cn/app/id1439275146"
     *  expired: true
     *  ok: 1
     *  update:bool  是否进行热更新
     *  must:bool 是否为强制热更新
     * }
     */
    checkUpdate = () => {
        checkUpdate(appKey).then(info => {
            console.log('更新数据', info);
            // if (info.expired) {
            //     Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
            //         {
            //             text: '确定', onPress: () => {
            //                 info.downloadUrl && Linking.openURL(info.downloadUrl);
            //             }
            //         }
            //     ]);
            // } else
            // Storage.get(HotUpdateUtil.UPDATE_ERROR_VERSION, undefined).then(res => {
            //     console.log('取出来的版本');
            //     console.log(res);
            //     if (res === undefined) {
            //         this.startUpdate(info);
            //     } else if (res !== info.hash) {
            //         //更新失败的版本则不再提示更新
            //         this.startUpdate(info);
            //     }
            // }).catch(error => {
            //     this.startUpdate(info);
            // });
            //更新
            if (info.expired){

            } else {
                this.startUpdate(info);
            }

        }).catch(e => {
            throw e;
        });
    };
    /**
     * 正式检测更新
     */
    startUpdate = (info) => {
        /**
         * 普通更新
         */
        if (info.metaInfo && info.metaInfo.indexOf('update') !== -1) {
            // Alert.alert('提示', '检测到更新' + info.name + ',是否下载?\n' + info.description, [
            //     {
            //         text: '是', onPress: () => {
            //             this.doUpdate(info);
            //         }
            //     },
            //     { text: '否' }
            // ]);
            this.doUpdate(info);
        }
        /**
         *   强制更新
         */
        else if (info.metaInfo && info.metaInfo.indexOf('must') !== -1) {
            // Alert.alert('提示', '检测到更新' + info.name + ',是否下载?\n' + info.description, [
            //     {
            //         text: '是', onPress: () => {
            //             this.doUpdate(info);
            //         }
            //     }
            // ]);
            this.doUpdate(info);
        }
    };
    /**
     * 存储更新失败的版本
     */
    saveErrorVersion = (info) => {
        //存储更新失败的版本
        // Storage.set(HotUpdateUtil.UPDATE_ERROR_VERSION, info.hash).then(() => {
        // }).catch(() => {
        // });
    };
    /**
     * 判断是否需要检测更新,默认三天
     * @param timeInterval 更新检测的最小时间间隔 (天)
     * @return {boolean}
     */
    isNeedToCheck = (timeInterval = 3) => {
        Storage.get(HotUpdateUtil.TIME_INTERVAL_KEY, undefined).then(res => {
            if (res === undefined) {
                Storage.set(HotUpdateUtil.TIME_INTERVAL_KEY, (new Date().getTime())).then(() => {
                    //初次触发更新
                    this.checkUpdate();
                }).catch(() => {

                });
            } else {
                if ((res + (24 * 3600 * 3)) < (new Date().getTime())) {
                    //三天未检测
                    this.checkUpdate();
                    Storage.set(HotUpdateUtil.TIME_INTERVAL_KEY, (new Date().getTime())).then(() => {
                    }).catch(() => {
                    });
                }
            }
        }).catch(() => {
            //提取错误则重新存储
            Storage.set(HotUpdateUtil.TIME_INTERVAL_KEY, (new Date().getTime())).then(() => {
            }).catch(() => {
            });
        });
    };
}

const hotUpdateUtil = new HotUpdateUtil();
export default hotUpdateUtil;
