import user from '../../../model/user';
import apiEnvironment from '../../../api/ApiEnvironment';
import bridge from '../../../utils/bridge';
import EmptyUtils from '../../../utils/EmptyUtils';
import { NativeModules } from 'react-native';
import Toast from '../../../utils/bridge';
import StringUtils from '../../../utils/StringUtils';

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
            Toast.$toast('文案已复制,图片已下载到相册');
            return Promise.resolve();
        }).catch((error) => {
            return Promise.reject();
        });
    }
};

const downloadShow = (data) => {
    if (EmptyUtils.isEmpty(data)) {
        return;
    }

    if (data.showType === 4) {
        return;
    }
    //保存商品推广图
    downloadProduct(data);
    if (!EmptyUtils.isEmpty(data.content)) {
        StringUtils.clipboardSetString(data.content);
    }

    if (data.showType === 1 || data.showType === 2) {
        return downloadPitcure(data);
    }

    if (data.showType == 3) {
        return downloadVideo(data);
    }


};

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
