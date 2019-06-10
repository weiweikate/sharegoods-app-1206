import { Linking, ActionSheetIOS, Platform, Alert, NativeModules } from 'react-native';
// import ImagePicker from 'react-native-image-picker';
// import Toast from "../components/Toast"; //第三方相机
import apiEnvironment from '../../../api/ApiEnvironment';
import Toast from './../../../utils/bridge';
import { request } from '@mr/rn-request';
import ImagePicker from '@mr/rn-image-crop-picker';

const Utiles = {
    /**
     * callBack
     * @param callBack {ok: 是否上传成功，imageThumbUrl}
     */    //NativeModules.commModule.RN_ImageCompression(uri, response.fileSize, 1024 * 1024 * 3, () => {
    getImagePicker: (callBack, num = 1, cropping = false, withSize = false) => {
        let newCallback = (value) => {
            if (value && value.ok) {
                let result = value.images.map((item) => {
                    return item.url;
                });
                callBack({ imageUrl: result, imageThumbUrl: result });
            }
        };
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({
                    options: ['取消', '拍照', '从相册选择'],
                    title: '请选择方式',
                    cancelButtonIndex: 0
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        if (withSize) {
                            Utiles.pickSingleWithCamera(cropping, callBack);
                        } else {
                            Utiles.pickSingleWithCamera(cropping, newCallback);
                        }
                    }
                    if (buttonIndex === 2) {
                        if (num > 1) {
                            if (withSize) {
                                Utiles.pickMultiple(num, callBack);
                            } else {
                                Utiles.pickMultiple(num, newCallback);
                            }
                        } else {
                            if (withSize) {
                                Utiles.pickSingle(cropping, false, callBack);
                            } else {
                                Utiles.pickSingle(cropping, false, newCallback);
                            }
                        }
                    }
                });
        } else {

            Alert.alert(
                '请选择方式',
                null,
                [
                    { text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
                    {
                        text: '拍照', onPress: () => {
                            if (withSize) {
                                Utiles.pickSingleWithCamera(cropping, callBack);
                            } else {
                                Utiles.pickSingleWithCamera(cropping, newCallback);
                            }
                        }
                    },
                    {
                        text: '从相册选择', onPress: () => {
                            if (num > 1) {
                                if (withSize) {
                                    Utiles.pickMultiple(num, callBack);

                                } else {
                                    Utiles.pickMultiple(num, newCallback);
                                }
                            } else {
                                if (withSize) {
                                    Utiles.pickSingle(cropping, false, callBack);

                                } else {
                                    Utiles.pickSingle(cropping, false, newCallback);

                                }
                            }
                        }
                    }

                ],
                { cancelable: false }
            );
        }
    },
    pickSingleWithCamera(cropping, callBack) {
        ImagePicker.openCamera({
            cropping: cropping,
            width: 600,
            height: 600,
            includeExif: true,
            cropperCancelText: '取消',
            cropperChooseText: '选取',
            loadingLabelText: '处理中...'
        }).then(image => {
            // console.log('received image', image);
            // this.setState({
            //     image: {uri: image.path, width: image.width, height: image.height},
            //     images: null
            // });
            let param = {
                path: image.path,
                width: image.width,
                height: image.height
            };
            Utiles.upload([param], [image.size + ''], callBack, true);
        }).catch(e => {
        });
    },
    pickSingle(cropit, circular = false, callBack) {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            cropperCancelText: '取消',
            cropperChooseText: '选取',
            loadingLabelText: '处理中...'
        }).then(image => {
            // console.log('received image', image);
            // this.setState({
            //     image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
            //     images: null
            // });
            let path = image.path;
            let width = image.width;
            let height = image.height;
            Utiles.upload([{ width, height, path }], [image.size + ''], callBack);
        }).catch(e => {
            console.log(e);
        });
    },

    pickMultiple: (num, callBack) => {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            maxFiles: num,
            mediaType: 'photo',
            loadingLabelText: '处理中...'
        }).then(images => {
            Utiles.upload(images.map((item) => {
                let path = item.path;
                let width = item.width;
                let height = item.height;
                return { width, height, path };
            }), images.map(item => item.size + ''), callBack);
        }).catch(e => {
        });
    },
    upload(images, sizes, callBack, camera = false) {
        for (let i = 0; i < images.length; i++) {
            let uri = images[i].path;
            uri = uri || '';
            let array = uri.split('.');
            array.reverse();
            let fileType = array[0].toLowerCase();
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
        // this.$toastShow('图片上传中，请稍后');
        let upload = () => {
            //commonAPI/ossClient
            //user/
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
                // alert(JSON.stringify(res))
                // callBack({
                //     ok: true,
                //     imageUrl: res.url,
                //     imageThumbUrl: res.url,
                //     width:res.width,
                //     height:res.height,
                //     camera: camera
                // });
                callBack({
                    ok: true,
                    imageUrl: imgUrls,
                    imageThumbUrl: imgUrls,
                    images: res,
                    camera: camera
                });
            }).catch(error => {
                Toast.hiddenLoading();
                // callBack({ ok: false, msg: '上传图片失败' });
                console.log(error);
                console.warn('图片上传失败' + error.toString());
                Toast.$toast('图片上传失败');
            });
        };
        let paths = images.map((vale) => {
            return vale.path;
        });
        NativeModules.commModule.RN_ImageCompression(paths, sizes, 1024 * 1024 * 3, upload);
    },
    callPhone: (phoneNum) => {
        Linking.openURL('tel:' + phoneNum);
    }
};

export default Utiles;
