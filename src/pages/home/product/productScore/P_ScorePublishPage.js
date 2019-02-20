import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import BasePage from '../../../../BasePage';
import P_ScorePubItemView from './components/P_ScorePubItemView';
import ActionSheetView from '../../../spellShop/components/ActionSheetView';
import P_ScorePublishModel from './P_ScorePublishModel';
import { observer } from 'mobx-react';
import ImagePicker from '@mr/rn-image-crop-picker';

import CameraView from '../../../../components/ui/CameraView';
import BusinessUtils from '../../../mine/components/BusinessUtils';
import DesignRule from '../../../../constants/DesignRule';
import RouterMap from '../../../../navigation/RouterMap';

@observer
export class P_ScorePublishPage extends BasePage {

    p_ScorePublishModel = new P_ScorePublishModel();

    $navigationBarOptions = {
        title: '我要晒单',
        rightNavTitle: '发布',
        rightTitleStyle: styles.rightItem
    };

    $NavBarRightPressed = () => {
        this.p_ScorePublishModel._publish(() => {
            this.$navigate(RouterMap.P_ScoreSuccessPage);
        });
    };

    componentDidMount() {
        this.p_ScorePublishModel._lookDetail(this.params.orderNo);
    }

    _pic = (itemIndex) => {
        ImagePicker.openCamera({
            cropping: true,
            width: 300,
            height: 300,
            includeExif: true,
            cropperCancelText: '取消',
            cropperChooseText: '选取',
            loadingLabelText: '处理中...'
        }).then(image => {
            BusinessUtils.pickSingleWithCamera(false, (img) => {
                this.p_ScorePublishModel.addImg(itemIndex, img.imageUrl);
            });
        }).catch(e => {
        });
    };

    _choosePic = (itemIndex) => {
        const { itemDataS, maxImageVideoCount } = this.p_ScorePublishModel;
        const itemData = itemDataS[itemIndex];
        const { images, video } = itemData;
        let leaveCount = maxImageVideoCount - images.length - (video ? 1 : 0);

        BusinessUtils.pickMultiple(leaveCount, (img) => {
            this.p_ScorePublishModel.addImg(itemIndex, img.imageUrl);
        });
        // ImagePicker.openPicker({
        //     multiple: true,
        //     waitAnimationEnd: false,
        //     includeExif: true,
        //     forceJpg: true,
        //     maxFiles: 3,
        //     mediaType: 'photo',
        //     loadingLabelText: '处理中...'
        // }).then(images => {
        //     // BusinessUtils.getImagePicker(callback => {
        //     //     this.setState({ frontIdCard: callback.imageUrl[0] });
        //     // });
        //     BusinessUtils.pickMultiple(6,(img)=>{
        //         this.p_ScorePublishModel.addImgVideo(itemIndex,img)
        //     })
        //     // this.p_ScorePublishModel.uploadImg(images.map(item => item.path), itemIndex);
        // }).catch(e => {
        // });
    };

    _video = (itemIndex) => {
        this.CameraView.show((videoData) => {
            this.p_ScorePublishModel.uploadVideo(videoData, itemIndex);
        });
    };

    _chooseVideo = (itemIndex) => {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            maxFiles: 1,
            mediaType: 'video',
            loadingLabelText: '处理中...'
        }).then(images => {
            this.p_ScorePublishModel.uploadVideo(images[0].path, itemIndex);
        }).catch(e => {
        });
    };
    _showAction = (itemIndex, isVideo) => {
        let items = ['拍照', '我的相册'];
        if (isVideo) {
            items = ['小视频', '我的相册'];
        }
        this.ActionSheetView.show({
            items: items
        }, (value, index) => {
            setTimeout(() => {
                switch (index) {
                    case 0:
                        if (isVideo) {
                            this._video(itemIndex);
                        } else {
                            this._pic(itemIndex);
                        }
                        break;
                    default:
                        if (isVideo) {
                            this._chooseVideo(itemIndex, true);
                        } else {
                            this._choosePic(itemIndex);
                        }
                        break;
                }
            }, 500);
        });
    };

    _renderItem = ({ item, index }) => {
        return <P_ScorePubItemView itemData={{ item, index }}
                                   p_ScorePublishModel={this.p_ScorePublishModel}
                                   showAction={this._showAction}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.id}${index}`;
    };

    _render() {
        const { productArr } = this.p_ScorePublishModel;
        return (
            <View style={styles.container}>
                <FlatList data={productArr}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}/>
                <ActionSheetView ref={(ref) => {
                    this.ActionSheetView = ref;
                }}/>
                <CameraView ref={(ref) => {
                    this.CameraView = ref;
                }}/>
            </View>

        );
    }
}

export default P_ScorePublishPage;

const styles = StyleSheet.create({
    container: { flex: 1 },
    rightItem: {
        color: DesignRule.mainColor
    }
});
