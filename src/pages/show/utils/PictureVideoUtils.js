/**
 * @author xzm
 * @date 2019/6/22
 */
import { NativeModules, Platform } from 'react-native';
import ImagePicker from '@mr/rn-image-crop-picker';
import Toast from '../../../utils/bridge';
import { request } from '@mr/rn-request/index';
import apiEnvironment from '../../../api/ApiEnvironment';

class PictureVideoUtils {
    selectPictureOrVideo = (num, canVideo, callBack) => {
        if (Platform.OS === 'ios') {
            NativeModules.MRImagePickerBridge.getImageOrVideo(
                {
                    edit: true,
                    multiple: true,
                    waitAnimationEnd: false,
                    includeExif: true,
                    forceJpg: true,
                    maxFiles: num,
                    canVideo,
                    mediaType: 'photo',
                    loadingLabelText: '处理中...'
                }
            ).then(images => {
                if (images && images.length === 1 && images[0].type.indexOf('video') > -1) {
                    let video = images[0];
                    this.uploadVideo(video, (data) => {
                        callBack(data);
                    });
                } else {
                    this.upload(images.map((item) => {
                        let path = item.path;
                        let width = item.width;
                        let height = item.height;
                        return { width, height, path };
                    }), images.map(item => item.size + ''), callBack);
                }
            }).catch(e => {
            });
        } else {
            ImagePicker.openPicker({
                edit: true,
                multiple: true,
                waitAnimationEnd: false,
                includeExif: true,
                forceJpg: true,
                maxFiles: num,
                canVideo,
                mediaType: 'photo',
                loadingLabelText: '处理中...'
            }).then(images => {
                if (images && images.length === 1 && images[0].type.indexOf('video') > -1) {
                    NativeModules.commModule.compressVideo(images[0].path).then((data) => {
                        let video = images[0];
                        video.path = 'file://' + data;
                        this.uploadVideo(video, (data) => {
                            callBack(data);
                        });
                    }).catch((error) => {
                    });
                } else {
                    this.upload(images.map((item) => {
                        let path = item.path;
                        let width = item.width;
                        let height = item.height;
                        return { width, height, path };
                    }), images.map(item => item.size + ''), callBack);
                }
            }).catch(e => {
            });
        }

    };

    uploadVideo = (video, callback) => {
        // Toast.showLoading('正在上传');
        let datas = {
            type: 'video/mp4',
            uri: video.path,
            name: new Date().getTime() + 'c.mp4'
        };
        let formData = new FormData();
        formData.append('file', datas);
        // formData.append('', datas.path);
        request.setBaseUrl(apiEnvironment.getCurrentHostUrl());
        let promise1 = request.upload('/common/upload/oss', datas, {}).then((res) => {
            if (res.code === 10000 && res.data) {
                return Promise.resolve({
                    url: res.data,
                    width: video.width,
                    height: video.height,
                    type: 'video',
                    videoTime: video.videoTime
                });
            } else {
                return Promise.reject({
                    msg: '视频上传失败'
                });
            }
        }).catch((e) => {
            return Promise.reject({
                msg: '视频上传失败'
            });
        });

        let promise2 = NativeModules.commModule.RN_Video_Image(video.path).then(({ imagePath }) => {
            let datas = {
                type: 'image/png',
                uri: '' + imagePath,
                name: new Date().getTime() + 'c.png'
            };
            let formData = new FormData();
            formData.append('file', datas);
            request.setBaseUrl(apiEnvironment.getCurrentHostUrl());
            return request.upload('/common/upload/oss', datas, {}).then((res) => {
                if (res.code === 10000 && res.data) {
                    return Promise.resolve({ url: res.data, type: 'cover' });
                } else {
                    return Promise.reject({
                        msg: '视频上传失败'
                    });
                }
            }).catch((e) => {
                Toast.hiddenLoading();
            });
            return Promise.resolve(imagePath);
        }).catch(e => {
            return Promise.reject({
                msg: '视频上传失败'
            });
        });

        Promise.all([promise1, promise2]).then((data) => {
            Toast.hiddenLoading();
            if (data) {
                let params = { type: 'video' };
                data.map((item) => {
                    if (item.type === 'cover') {
                        params.cover = item.url;
                    }
                    if (item.type === 'video') {
                        params.video = item.url;
                        params.width = item.width;
                        params.height = item.height;
                        params.videoTime = item.videoTime;
                    }
                });

                callback(params);
            }
        }).catch(e => {
            Toast.hiddenLoading();
        });
    };
    upload = (images, sizes, callBack, camera = false) => {
        for (let i = 0; i < images.length; i++) {
            let uri = images[i].path;
            uri = uri || '';
            let array = uri.split('.');
            array.reverse();
            let fileType = array[0] && array[0].toLowerCase();
            let videoType = ['avi', 'wmv', 'mpeg', 'mp4', 'mov', 'mkv', 'flv', 'f4v', 'm4v', 'rmvb', 'rm', '3gp'];
            if (fileType === 'gif') {
                Toast.$toast('不支持上传动态图');
                return;
            } else if (videoType.indexOf(fileType) !== -1) {
                Toast.$toast('不支持上传视频');
                return;
            }
        }

        Toast.showLoading('正在上传');
        let upload = () => {
            let url = apiEnvironment.getCurrentHostUrl();
            request.setBaseUrl(url);
            let promises = [];

            for (let i = 0; i < images.length; i++) {
                let datas = {
                    type: 'image/png',
                    uri: images[i].path,
                    name: new Date().getTime() + i + 'c.png'
                };
                let formData = new FormData();
                formData.append('file', datas);
                promises.push(request.upload('/common/upload/oss', datas, {}).then((res) => {
                    if (res.code === 10000 && res.data) {
                        return Promise.resolve({ url: res.data, width: images[i].width, height: images[i].height });
                    } else {
                        return Promise.reject({
                            msg: '图片上传失败'
                        });
                    }
                }));
            }
            Promise.all(promises).then(res => {
                console.log(res);
                Toast.hiddenLoading();
                const imgUrls = res.map((item) => {
                    return item.url;
                });
                callBack({
                    ok: true,
                    imageUrl: imgUrls,
                    imageThumbUrl: imgUrls,
                    images: res,
                    camera: camera
                });
            }).catch(error => {
                Toast.hiddenLoading();
                console.log(error);
                console.warn('图片上传失败' + error.toString());
                Toast.$toast('图片上传失败');
            });
        };
        let paths = images.map((vale) => {
            return vale.path;
        });
        NativeModules.commModule.RN_ImageCompression(paths, sizes, 1024 * 1024 * 1, upload);
    };

    uploadSingleImage = (image, callback,uploadErr) => {
        let url = apiEnvironment.getCurrentHostUrl();
        request.setBaseUrl(url);
        let datas = {
            type: 'image/png',
            uri: 'file://' + image,
            name: new Date().getTime() + 'c.png'
        };
        let formData = new FormData();
        formData.append('file', datas);
        let upload = () => {
            request.upload('/common/upload/oss', datas, {}).then((res) => {
                if (res.code === 10000 && res.data) {
                    callback({ url: res.data });
                } else {
                    callback(null);
                }
            }).catch((error)=>{
                uploadErr();
            });
        };
        NativeModules.commModule.RN_ImageCompression([image], null, 1024 * 1024 * 1, upload);
    };

}


export default new PictureVideoUtils();
