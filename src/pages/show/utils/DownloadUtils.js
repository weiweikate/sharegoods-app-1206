import user from '../../../model/user';
import apiEnvironment from '../../../api/ApiEnvironment';
import bridge from '../../../utils/bridge';
import Toast from '../../../utils/bridge';
import EmptyUtils from '../../../utils/EmptyUtils';
import { Alert, NativeModules } from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import NetInfo from '@react-native-community/netinfo';
import store from '@mr/rn-store';

const key = '@show/net';
/**
 * @author xzm
 * @date 2019/5/31
 */

const downloadProduct = (detail) => {

    let promises = [];
    if (!EmptyUtils.isEmptyArr(detail.products)) {
        detail.products.map((value) => {
            let showPrice = 0;
            const { singleActivity = {}, groupActivity = {} } = (value && value.promotionResult) || {};
            const { endTime: endTimeT, startTime: startTimeT, currentTime = Date.parse(new Date()) } = groupActivity && groupActivity.type ? groupActivity : singleActivity;
            if (currentTime > startTimeT && currentTime < endTimeT + 500) {
                showPrice = value.promotionMinPrice;
            } else {
                showPrice = value.minPrice;
            }
            let data = {
                imageUrlStr: value.imgUrl,
                titleStr: value.name,
                QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/product/99/${value.prodCode}?upuserid=${user.code || ''}`,
                originalPrice: `￥${value.originalPrice}`,
                currentPrice: `￥${showPrice}`
            };
            let promise = bridge.createShowProductImage(JSON.stringify(data));

            promises.push(promise);
        });
    }
    if (!EmptyUtils.isEmptyArr(promises)) {
        Promise.all(promises);
    }
};

const downloadPitcure = (data) => {
    let urls = [];
    if (data.resource) {
        urls = data.resource.map((item, index) => {
            return item.baseUrl;
        });
    }
    let promises = [];
    if (urls) {
        urls.map((value) => {
            let url = value;
            let index = value.indexOf('?');
            if (index !== -1) {
                url = value.substring(0, index);
            }
            let videoType = ['avi', 'wmv', 'mpeg', 'mp4', 'mov', 'mkv', 'flv', 'f4v', 'm4v', 'rmvb', 'rm', '3gp'];
            let aUrl = url.toLowerCase();
            let isVideo = false;
            for (let i = 0; i < videoType.length; i++) {
                if (StringEndWith(aUrl, videoType[i])) {
                    isVideo = true;
                    break;
                }
            }
            if (!isVideo) {
                promises.push(NativeModules.commModule.saveImageToPhotoAlbumWithUrl(url));
            }
        });
    }
    return Promise.all(promises).then(res => {
        Toast.$toast('文案已复制,图片已下载到相册');
        return Promise.resolve();
    }).catch(error => {
        Toast.$toast('保存失败');
        return Promise.reject();
    });
};

const downloadVideo = (data) => {
    let url = '';
    if (data.resource) {
        data.resource.forEach(item => {
            if (item.type == 4) {
                url = item.baseUrl;
            }
        });
        return NativeModules.commModule.saveVideoToPhotoAlbumWithUrl(url).then(() => {
            Toast.$toast('文案已复制,视频已下载到相册');
            return Promise.resolve();
        }).catch((error) => {
            Toast.$toast('保存失败');
            return Promise.reject();
        });
    }
};

function downloadShow(data, callback) {
    if (EmptyUtils.isEmpty(data)) {
        return;
    }

    if (data.showType === 4) {
        return;
    }

    NetInfo.getConnectionInfo().then((net) => {
        const { type } = net;
        if (type === 'none' || type === 'unknown') {
            bridge.$toast('请检测网络连接');
            return;
        } else if (type === 'cellular') {
            store.get(key).then((time) => {
                if (EmptyUtils.isEmpty(time)) {
                    showAlert(data, callback);
                    return;
                }
                let now = Date.parse(new Date());
                if ((now - time) > 24 * 60 * 60 * 1000) {
                    showAlert(data, callback);
                    return;
                }
                startDownload(data, callback);
            }).catch(error => {
                showAlert(data, callback);
            });
        } else {
            startDownload(data, callback);
        }
    });
}

function startDownload(data, callback) {
    //保存商品推广图
    downloadProduct(data);
    if (!EmptyUtils.isEmpty(data.content)) {
        StringUtils.clipboardSetString(data.content);
    }

    if (data.showType === 1 || data.showType === 2) {
        downloadPitcure(data).then(() => {
            callback && callback();
        });
    }

    if (data.showType == 3) {
        downloadVideo(data).then(() => {
            callback && callback();
        });
    }
}

function showAlert(data, callback) {
    Alert.alert('温馨提示', '您当前处于2G/3G/4G环境\n继续下载将使用流量',
        [
            {
                text: '取消', onPress: () => {
                }
            },
            {
                text: '确定', onPress: () => {
                    let timestamp = Date.parse(new Date());
                    store.save(key, timestamp);
                    downloadShow(data);
                }
            }
        ]
    );
}

function StringEndWith(oriStr, endStr) {
    if (EmptyUtils.isEmpty(oriStr) || EmptyUtils.isEmpty(endStr)) {
        return false;
    }
    let d = oriStr.length - endStr.length;
    return (d >= 0 && oriStr.lastIndexOf(endStr) == d);
}

export default {
    downloadShow
};
