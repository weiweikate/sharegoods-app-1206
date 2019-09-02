import { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import React from 'react';
import NoMoreClick from '../ui/NoMoreClick';
import res from '../../comm/res';
import ScreenUtils from '../../utils/ScreenUtils'
import ImageLoad from '@mr/image-placeholder'
import { routePush } from '../../navigation/RouterMap';
import RouterMap from '../../navigation/RouterMap';
const addPic = res.placeholder.add_picture;
const deleteImage = res.button.delete_picture;


class AddPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            maxTip: this.props.maxTip
        };
    }

    componentDidMount() {
        this.emitterListener = DeviceEventEmitter.addListener('AddPhotos', (event) => {
            let arr = [...this.props.imageArr];
            arr.push(event);
            this.props.onArr && this.props.onArr(arr);
        });
    }

    renderAddItem = () => {
        if (this.props.maxNum <= this.props.imageArr.length){
            return null;
        }
        return (
            <NoMoreClick onPress={() => this.props.addPic()}>
                <Image style={styles.add_photo} source={addPic}/>
            </NoMoreClick>
        );
    };

    renderPhotoItem = (item, index, imgList) => {
        return (
            <TouchableOpacity style={{ marginRight: ScreenUtils.autoSizeWidth(5), marginBottom: 12 }} key={index}
                              activeOpacity={0.7}
                              onPress={()=> {this.imgClick(imgList,index)}}
            >
                <ImageLoad style={styles.photo_item} source={{ uri: this.props.imageArr[index] }}/>
                <TouchableOpacity activeOpacity={0.7} style={styles.delete_btn} onPress={() => {
                    this.props.deletePic(index);
                }}>
                    <Image style={{ width: 24, height: 24 }} source={deleteImage}/>
                </TouchableOpacity>

            </TouchableOpacity>);
    };

    imgClick(imageUrls, index){
        routePush(RouterMap.CheckBigImagesView,{imageUrls, index})
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' , paddingVertical: ScreenUtils.autoSizeWidth(10)}}>
                {this.props.imageArr.map((item, index, arr) => {
                    return this.renderPhotoItem(item, index, arr);
                })}
                {this.renderAddItem()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    add_photo: {
        height: ScreenUtils.autoSizeWidth(106),
        width: ScreenUtils.autoSizeWidth(106),
    },
    photo_item: {
        height: ScreenUtils.autoSizeWidth(106),
        width: ScreenUtils.autoSizeWidth(106),
        borderRadius: 3
    },
    delete_btn: {
        position: 'absolute',
        left: ScreenUtils.autoSizeWidth(106) - 24
    }
});

export default AddPhotos;
