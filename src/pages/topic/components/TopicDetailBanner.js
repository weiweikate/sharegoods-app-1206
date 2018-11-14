import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import XGSwiper from '../../../components/ui/XGSwiper';
import EmptyUtils from '../../../utils/EmptyUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import VideoView from '../../../components/ui/video/VideoView';

export class TopicDetailBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageIndex: 0,
            haveVideo: false
        };
    }

    getImageList = (data) => {
        if (data) {
            return data.map((item, index) => {
                return item.originalImg;
            });
        } else {
            return null;
        }
    };

    _renderStyle = () => {
        const { bannerImgList } = this.props;
        const bannerCount = bannerImgList.length;
        return <View style={styles.indexViewTwo}>
            <Text
                style={styles.text}>{this.state.messageIndex + 1} / {bannerCount}</Text>
        </View>;
    };

    _renderViewPageItem = (item = {}, index) => {
        const { bannerImgList } = this.props;
        if (item.videoUrl) {
            return <VideoView videoUrl={item.videoUrl} videoCover={item.videoCover}/>;
        } else {
            const { originalImg } = item;
            let imgList = this.getImageList(bannerImgList);
            return (
                <TouchableWithoutFeedback onPress={() => {
                    const params = { imageUrls: imgList, index: this.state.haveVideo ? index - 1 : index };
                    const { navigation } = this.props;
                    navigation && navigation.navigate('home/product/CheckBigImagesView', params);
                }}>
                    <Image source={{ uri: originalImg }}
                           style={{ height: ScreenUtils.autoSizeWidth(377), width: ScreenUtils.width }}
                           resizeMode="cover"
                    />
                </TouchableWithoutFeedback>
            );
        }
    };

    render() {
        this.state.haveVideo = this.props.haveVideo;
        const { bannerImgList } = this.props;
        if (bannerImgList.length > 0) {
            return (
                <View>
                    <XGSwiper height={ScreenUtils.autoSizeWidth(377)} width={ScreenUtils.width}
                              loop={false}
                              renderRow={this._renderViewPageItem}
                              dataSource={EmptyUtils.isEmptyArr(bannerImgList) ? [] : bannerImgList}
                              onWillChange={(item, index) => {
                                  if (this.state.messageIndex !== index) {
                                      this.setState({
                                          messageIndex: index
                                      });
                                  }
                              }}/>
                    {this._renderStyle()}
                </View>
            );
        } else {
            return <View style={{ height: ScreenUtils.autoSizeWidth(377), width: ScreenUtils.width }}/>;
        }
    }
}

const styles = StyleSheet.create({
    indexViewTwo: {
        position: 'absolute',
        height: 20,
        borderRadius: 10,
        right: 14,
        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#fff',
        fontSize: 10,
        paddingHorizontal: 8
    }
});


export default TopicDetailBanner;
