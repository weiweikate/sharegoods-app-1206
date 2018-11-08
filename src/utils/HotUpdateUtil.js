import {
    Platform,
    Alert,
    Linking,
} from 'react-native';
import {
    isFirstTime,
    isRolledBack,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
    packageVersion,
    currentVersion,
} from 'react-native-update';

import _updateConfig from '../../update.json';

const { appKey } = _updateConfig[Platform.OS];

class HotUpdateUtil {

    static TIME_INTERVAL_KEY = 'TIME_INTERVAL_KEY'

    appVersion = ''
    hashVersion = ''

    constructor() {
        if (isFirstTime){
            this.signSuccess()
        } else if (isRolledBack) {
            alert("提示","刚刚更新失败,版本回滚")
        }
        /**
         * 暂存版本号,和哈希版本版本值
         * @type {*|string}
         */
        this.appVersion = packageVersion ||''
        this.hashVersion = currentVersion || ''
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
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {
                    text: '是', onPress: () => {
                        switchVersion(hash);
                    }
                },
                {
                    text: '下次启动时', onPress: () => {
                        switchVersionLater(hash);
                    }
                }
            ]);
        }).catch(err => {

            Alert.alert('提示', '更新失败.' + err);
        });
    };
    /**
     * 检测更新
     */
    checkUpdate = () => {
        //先注释掉
        return;
        checkUpdate(appKey).then(info => {
            if (info.expired) {
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {
                        text: '确定', onPress: () => {
                            info.downloadUrl && Linking.openURL(info.downloadUrl);
                        }
                    }
                ]);
            } else if (info.upToDate) {
                /**
                 * Alert.alert('提示', '您的应用版本已是最新.');
                 * 如果已是最新版本则什么也不需要做
                 * */
            } else {
                Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description + '\n' + info, [
                    {
                        text: '是', onPress: () => {
                            this.doUpdate(info);
                        }
                    },
                    { text: '否' }
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };
    /**
     * 判断是否需要检测更新,默认三天
     * @param timeInterval 更新检测的最小时间间隔 (天)
     * @return {boolean}
     */

    isNeedToCheck = (timeInterval = 3) =>{
        return false
    }


}

const hotUpdateUtil = new HotUpdateUtil();
export default hotUpdateUtil;
