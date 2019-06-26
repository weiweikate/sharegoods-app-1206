/**
 * @author xzm
 * @date 2019/5/14
 */
import StringUtils from '../../../utils/StringUtils';
import { NativeModules, Platform } from 'react-native';
import Toast from '../../../utils/bridge';
import EmptyUtils from '../../../utils/EmptyUtils';

const formatShowNum = (num) => {
    if (num <= 999) {
        return num + '';
    } else if (num < 10000) {
        return parseInt(num / 1000) + 'K+';
    } else if (num < 100000) {
        return parseInt(num / 10000) + 'W+';
    } else {
        return '10W+';
    }
};

const downloadShow = (urls, content) => {
    StringUtils.clipboardSetString(content);
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
            if(!isVideo){
                NativeModules.commModule.saveImageToPhotoAlbumWithUrl(url);
            }
        });
    }

    return Promise.all(promises).then(res => {
        if (Platform.OS === 'android') {
            Toast.$toast('图片已下载到相册，文案已复制');
        }
        return Promise.resolve();
    }).catch(error => {
        Toast.$toast('保存失败');
        return Promise.reject();
    });
};

function StringEndWith(oriStr, endStr) {
    if (EmptyUtils.isEmpty(oriStr) || EmptyUtils.isEmpty(endStr)) {
        return false;
    }
    let d = oriStr.length - endStr.length;
    return (d >= 0 && oriStr.lastIndexOf(endStr) == d);
}

function getUrlVars(url) {

    var vars = {};
    if (url) {
        url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
    }
    return vars;
}

export default {
    formatShowNum,
    downloadShow,
    getUrlVars
};
