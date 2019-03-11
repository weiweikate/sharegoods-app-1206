import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import BasePage from '../../../BasePage';
import P_ScorePubItemView from './components/P_ScorePubItemView';
import ActionSheetView from '../../spellShop/components/ActionSheetView';
import P_ScorePublishModel from './P_ScorePublishModel';
import { observer } from 'mobx-react';
import ImagePicker from '@mr/rn-image-crop-picker';

// import CameraView from '../../../../components/ui/CameraView';
import BusinessUtils from '../../mine/components/BusinessUtils';
import DesignRule from '../../../constants/DesignRule';
import RouterMap from '../../../navigation/RouterMap';

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
        BusinessUtils.pickSingleWithCamera(false, (img) => {
            this.p_ScorePublishModel.addImg(itemIndex, img.imageUrl);
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
    };

    _video = (itemIndex) => {
        this.CameraView.show((videoData) => {
            if (videoData) {
                videoData && this.p_ScorePublishModel.uploadVideo(videoData, itemIndex);
            }
        });
    };

    _chooseVideo = (itemIndex) => {
        ImagePicker.openPicker({
            includeExif: true,
            mediaType: 'video',
            loadingLabelText: '处理中...'
        }).then(video => {
            if (video.size > 3 * 1024 * 1024) {
                this.$toastShow('视频过大,建议上传3M以内的视频');
                return;
            }
            this.p_ScorePublishModel.uploadVideo(video.path, itemIndex);
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
        const { itemDataS } = this.p_ScorePublishModel;
        const itemData = itemDataS[index];
        return <P_ScorePubItemView itemData={{ item, index }}
                                   p_ScorePublishModel={this.p_ScorePublishModel}
                                   modalShow={(index1) => {
                                       this.$navigate(RouterMap.P_ScoreSwiperPage, {
                                           video: itemData.video,
                                           videoImg: itemData.videoImg,
                                           images: itemData.images,
                                           index: index1
                                       });
                                   }}
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
                {/*<CameraView ref={(ref) => {*/}
                    {/*this.CameraView = ref;*/}
                {/*}}/>*/}
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
