/**
 * @author xzm
 * @date 2019/5/14
 */
import StringUtils from '../../../utils/StringUtils';
import { NativeModules } from 'react-native';
import Toast from '../../../utils/bridge';

const formatShowNum = (num) => {
    if (num <= 999) {
        return num + '';
    }

    if (num > 999 && num <= 100000) {
        return '999+';
    }

    return '10w+';
};

const downloadShow = (urls, content) => {
    StringUtils.clipboardSetString(content);
    let promises = [];
    if (urls) {
        urls.map((value) => {
            let url = value;
            let index = value.indexOf('?');
            if( index!== -1){
                url = value.substring(0,index);
            }
            let promise = NativeModules.commModule.saveImageToPhotoAlbumWithUrl(url);
            //     .then(() => {
            //     return Promise.resolve();
            // }).catch(() => {
            //     return Promise.reject();
            // });
            promises.push(promise);
        });
    }

    return Promise.all(promises).then(res => {
        Toast.$toast('图片已下载到相册，文案已复制');
        return Promise.resolve();
    }).catch(error => {
        Toast.$toast('保存失败');
        return Promise.reject();
    });
};


export default {
    formatShowNum,
    downloadShow
};
