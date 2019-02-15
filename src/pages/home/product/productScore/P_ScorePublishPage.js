import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import BasePage from '../../../../BasePage';
import P_ScorePubItemView from './components/P_ScorePubItemView';
import ActionSheetView from '../../../spellShop/components/ActionSheetView';
import P_ScorePublishModel from './P_ScorePublishModel';
import { observer } from 'mobx-react';
// import BusinessUtils from '../../../mine/components/BusinessUtils';
import ImagePicker from '@mr/rn-image-crop-picker';

@observer
export class P_ScorePublishPage extends BasePage {

    p_ScorePublishModel = new P_ScorePublishModel();


    componentDidMount() {
        this.p_ScorePublishModel.setDefaultData();
    }

    _camera = (itemIndex) => {
        ImagePicker.openCamera({
            cropping: true,
            width: 300,
            height: 300,
            includeExif: true,
            cropperCancelText: '取消',
            cropperChooseText: '选取',
            loadingLabelText: '处理中...'
        }).then(image => {
            this.p_ScorePublishModel.addImgVideo(itemIndex);

            // Utiles.upload([image.path], callBack)
        }).catch(e => {
        });
    };

    _choosePic = (itemIndex) => {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            maxFiles: 3,
            mediaType: 'photo',
            loadingLabelText: '处理中...'
        }).then(images => {
            // Utiles.upload(images.map(item => item.path), callBack)
        }).catch(e => {
        });
    };

    _video = (itemIndex) => {

    };

    _chooseVideo = (itemIndex,) => {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            maxFiles: 1,
            mediaType: 'video',
            loadingLabelText: '处理中...'
        }).then(images => {
            // Utiles.upload(images.map(item => item.path), callBack)
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
                            this._camera(itemIndex);
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
            }, 400);
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
            </View>

        );
    }
}

export default P_ScorePublishPage;

const styles = StyleSheet.create({
    container: { flex: 1 }
});
