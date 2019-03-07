import { observable, action } from 'mobx';
import Toast from '../../../utils/bridge';
import apiEnvironment from '../../../api/ApiEnvironment';
import { request } from '@mr/rn-request';
import HomeAPI from '../../home/api/HomeAPI';
import orderApi from '../../order/api/orderApi';
import { NativeModules, Platform } from 'react-native';

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

    @action addVideo = (itemIndex, videoUrl, imgPath) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.video = videoUrl;
        itemData.videoImg = Platform.OS === 'android' ? 'file://' + imgPath : imgPath;
    };

    @action deleteVideo = (itemIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.video = undefined;
        itemData.videoImg = undefined;
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
        console.log(params);
        Toast.showLoading();
        HomeAPI.appraise_publish({ warehouseOrderNo: this.warehouseOrderNo, params: params }).then((data) => {
            Toast.hiddenLoading();
            callBack && callBack();
            console.log(data);
        }).catch((error) => {
            Toast.hiddenLoading();
            Toast.$toast(error.msg);
        });
    };

    /**tool**/

    uploadVideo(videoPath, itemIndex) {
        NativeModules.commModule.RN_Video_Image(videoPath).then(({ imagePath }) => {
            let fileData = {
                type: 'video/mp4',
                uri: videoPath,
                name: new Date().getTime() + itemIndex + '.mov'
            };
            request.setBaseUrl(apiEnvironment.getCurrentHostUrl());
            Toast.showLoading('正在上传');
            request.upload('/common/upload/oss', fileData, {}).then((res) => {
                Toast.hiddenLoading();
                if (res.code === 10000 && res.data) {
                    this.addVideo(itemIndex, res.data, imagePath);
                } else {
                    Toast.$toast('视频上传失败');
                }
            }).catch(() => {
                Toast.hiddenLoading();
                Toast.$toast('视频上传失败');
            });
        });
    }
}
