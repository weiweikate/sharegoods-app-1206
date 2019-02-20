import { observable, action } from 'mobx';
import Toast from '../../../../utils/bridge';
import apiEnvironment from '../../../../api/ApiEnvironment';
import { request } from '@mr/rn-request';
import HomeAPI from '../../api/HomeAPI';
import orderApi from '../../../order/api/orderApi';

export default class P_ScorePublishModel {

    @observable maxImageVideoCount = 6;
    @observable productArr = [];
    @observable warehouseOrderNo = '';

    /*{
    images,
    video,
    starCount,
    contentText
    }*/
    @observable itemDataS = [];

    @action setDefaultData = (dataList, orderNo) => {
        this.warehouseOrderNo = orderNo;
        this.productArr = dataList || [];
        for (let i = 0; i < this.productArr.length; i++) {
            this.itemDataS.push(
                { images: [], video: undefined, videoImg: undefined, starCount: 5, contentText: '' }
            );
        }
    };

    @action changeText = (itemIndex, text) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.contentText = text;
    };

    @action changeStar = (itemIndex, starIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.starCount = starIndex;
    };

    @action addImg = (itemIndex, images) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.images.push(...images);
    };

    @action deleteImg = (itemIndex, imgIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.images.splice(imgIndex, 1);
    };

    @action addVideo = (itemIndex, video) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.video = video;
        itemData.videoImg = `${video}?x-oss-process=video/snapshot,t_0,f_png,w_600,h_600,m_fast`;
    };

    @action deleteVideo = (itemIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.video = undefined;
        itemData.videoImg = undefined;
    };

    _list = () => {

    };

    _lookDetail = (orderNo) => {
        orderApi.lookDetail({ orderNo: orderNo }).then((data) => {
            let tempList = [];
            let tempData = data.data;
            tempData = (tempData || {}).warehouseOrderDTOList || [];
            tempData.forEach((item) => {
                (item || {}).products.forEach((item) => {
                    tempList.push(item);
                });
            });
            this.setDefaultData(tempList, orderNo);
        });
    };
    _publish = (callBack) => {
        let params = this.itemDataS.map((item, index) => {
            let pData = this.productArr[index];
            return {
                warehouseOrderProductNo: this.warehouseOrderNo,
                skuCode: pData.skuCode,
                comment: item.contentText,
                videoUrl: item.video,
                imgUrl: item.images.join('$'),
                star: item.starCount
            };
        });
        HomeAPI.appraise_publish({ warehouseOrderNo: this.warehouseOrderNo, params: params }).then((data) => {
            callBack && callBack();
            console.log(data);
        }).catch((error) => {
            Toast.$toast(error.msg);
        });
    };

    /**tool**/

    uploadVideo(path, itemIndex) {
        let fileData = {
            type: 'video',
            uri: path,
            name: new Date().getTime() + itemIndex + '.mp4'
        };
        request.setBaseUrl(apiEnvironment.getCurrentHostUrl());
        Toast.showLoading('正在上传');
        request.upload('/common/upload/oss', fileData, {}).then((res) => {
            Toast.hiddenLoading();
            if (res.code === 10000 && res.data) {
                this.addVideo(itemIndex, res.data);
            } else {
                Toast.$toast('视频上传失败');
            }
        }).catch(() => {
            Toast.hiddenLoading();
            Toast.$toast('视频上传失败');
        });
    }

    uploadImg(paths, itemIndex) {
        for (let i = 0; i < paths.length; i++) {
            let uri = paths[i] || '';
            let array = uri.split('.').reverse();
            let fileType = array[0].toLowerCase();
            if (fileType === 'gif') {
                Toast.$toast('不支持上传动态图');
                return;
            }
        }

        request.setBaseUrl(apiEnvironment.getCurrentHostUrl());
        let promises = paths.map((item, index) => {
            let fileData = {
                type: 'img',
                uri: item,
                name: new Date().getTime() + index + '.jpg'
            };
            return request.upload('/common/upload/oss', fileData, {}).then((res) => {
                if (res.code === 10000 && res.data) {
                    return Promise.resolve({ imgUrl: res.data, imageThumbUrl: res.data });
                } else {
                    return Promise.reject({ msg: '上传失败' });
                }
            });
        });
        Promise.all(promises).then((data) => {
            this.addImg(itemIndex, data);
        }).catch(() => {
            Toast.$toast('图片上传失败');
        });
    }
}
