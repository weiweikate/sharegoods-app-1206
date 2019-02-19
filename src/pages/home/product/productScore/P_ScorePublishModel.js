import { observable, action } from 'mobx';
import Toast from '../../../../utils/bridge';
import apiEnvironment from '../../../../api/ApiEnvironment';
import { request } from '@mr/rn-request';
import HomeAPI from '../../api/HomeAPI';

export default class P_ScorePublishModel {

    @observable maxImageVideoCount = 6;
    @observable productArr = [];

    /*{
    images,
    video,
    starCount,
    contentText
    }*/
    @observable itemDataS = [];

    @action setDefaultData = () => {
        this.productArr = [{}, {}, {}];
        for (let i = 0; i < this.productArr.length; i++) {
            this.itemDataS.push(
                { images: [], video: undefined, starCount: 5, contentText: '' }
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
        itemData.images = images;
    };

    @action deleteImg = (itemIndex, imgIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.images.splice(imgIndex, 1);
    };

    @action addVideo = (itemIndex, video) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.video = video;
    };

    @action deleteVideo = (itemIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.video = undefined;
    };

    _list = () => {

    };


    _publish = () => {
        let params = this.itemDataS.map((item) => {
            return {
                warehouseOrderProductNo: 'test-1',
                skuCode: 'SKU000000880001',
                comment: item.contentText,
                videoUrl: item.video,
                imgUrl: item.images,
                star: item.starCount
            };
        });
        HomeAPI.appraise_publish({ warehouseOrderNo: 'C181210164920000001', params: params }).then((data) => {
            console.log(data);
        });
    };

    uploadVideo(path, itemIndex) {
        let fileData = {
            type: 'video',
            uri: path,
            name: new Date().getTime() + itemIndex + '.mp4'
        };
        request.setBaseUrl(apiEnvironment.getCurrentHostUrl());
        request.upload('/common/upload/oss', fileData, {}).then((res) => {
            if (res.code === 10000 && res.data) {
                this.addVideo(itemIndex, res.data);
            } else {
                Toast.$toast('视频上传失败');
            }
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
