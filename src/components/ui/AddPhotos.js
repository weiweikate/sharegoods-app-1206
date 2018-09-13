import { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import React from 'react';
import NoMoreClick from '../ui/NoMoreClick';
import addPic from '../../pages/mine/res/customerservice/xk1_03.png';
import deleteImage from '../../pages/mine/res/customerservice/deleteImage.png';


class AddPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            maxNum: this.props.maxNum,
            maxTip: this.props.maxTip
        };
    }

    componentDidMount() {
        this.emitterListener = DeviceEventEmitter.addListener('AddPhotos', (event) => {
            let arr = this.state.photos;
            arr.push(event);
            this.setState({
                photos: arr
            });
            this.props.onArr && this.props.onArr(arr);
        });
    }

    renderAddItem = () => {
        return (
            <NoMoreClick onPress={() => this.props.addPic()}>
                <Image style={styles.add_photo} source={addPic}/>
            </NoMoreClick>
        );
    };

    renderPhotoItem = (item, index) => {
        return (
            <View style={{ marginRight: 8, marginBottom: 12 }} key={index}>
                <Image style={styles.photo_item} source={{ uri: this.props.imageArr[index].imageUrl }}/>
                <TouchableOpacity style={styles.delete_btn} onPress={() => {
                    this.props.deletePic(index);
                }}>
                    <Image style={{ width: 24, height: 24 }} source={deleteImage}/>
                </TouchableOpacity>

            </View>);
    };

    render() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
        height: 83,
        width: 83,
        marginRight: 8
    },
    photo_item: {
        height: 83,
        width: 83,
        borderRadius: 3
    },
    delete_btn: {
        width: 24,
        height: 24,
        position: 'absolute',
        left: 60 - 1
    }
});

export default AddPhotos;
