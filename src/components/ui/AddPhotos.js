import { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import React from 'react';
import NoMoreClick from '../ui/NoMoreClick';
import res from '../../comm/res';
import ScreenUtils from '../../utils/ScreenUtils'
import ImageLoad from '@mr/image-placeholder'
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

    renderPhotoItem = (item, index) => {
        return (
            <View style={{ marginRight: ScreenUtils.autoSizeWidth(5), marginBottom: 12 }} key={index}>
                <ImageLoad style={styles.photo_item} source={{ uri: this.props.imageArr[index] }}/>
                <TouchableOpacity style={styles.delete_btn} onPress={() => {
                    this.props.deletePic(index);
                }}>
                    <Image style={{ width: 24, height: 24 }} source={deleteImage}/>
                </TouchableOpacity>

            </View>);
    };

    render() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' , paddingVertical: ScreenUtils.autoSizeWidth(10)}}>
                {this.props.imageArr.map((item, index) => {
                    return this.renderPhotoItem(item, index);
                })}
                {this.renderAddItem()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    add_photo: {
        height: ScreenUtils.autoSizeWidth(107),
        width: ScreenUtils.autoSizeWidth(107),
    },
    photo_item: {
        height: ScreenUtils.autoSizeWidth(107),
        width: ScreenUtils.autoSizeWidth(107),
        borderRadius: 3
    },
    delete_btn: {
        position: 'absolute',
        left: ScreenUtils.autoSizeWidth(107) - 24
    }
});

export default AddPhotos;
