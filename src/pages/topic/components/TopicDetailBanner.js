import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import XGSwiper from '../../../components/ui/XGSwiper';
import ViewPager from '../../../components/ui/ViewPager';
import EmptyUtils from '../../../utils/EmptyUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import VideoView from '../../../components/ui/video/VideoView';
import ImageLoad from '@mr/image-placeholder';
import {
    MRText as Text
} from '../../../components/ui';

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
            let tempArr = [];
            data.forEach((item, index) => {
                if (!item.videoUrl) {
                    tempArr.push(item.originalImg);
                }
            });
            return tempArr;
        } else {
            return null;
        }
    };

    _renderStyle = () => {
        const { bannerImgList } = this.props;
        const bannerCount = bannerImgList.length;
        return <View style={styles.indexViewTwo}>
            <Text
                style={styles.text} allowFontScaling={false}>{this.state.messageIndex + 1} / {bannerCount}</Text>
        </View>;
    };

    _renderPagination = (index, total) => {
        return <View style={styles.indexViewTwo}>
            <Text
                style={styles.text} allowFontScaling={false}>{index + 1}/{total}</Text>
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
                    <View>
                        <ImageLoad source={{ uri: originalImg }}
                                   style={styles.bannerView}
                                   resizeMode="cover"
                        />
                    </View>
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
                    {Platform.OS === 'ios' ? <XGSwiper height={ScreenUtils.autoSizeWidth(375)} width={ScreenUtils.width}
                                                       loop={false}
                                                       renderRow={this._renderViewPageItem}
                                                       dataSource={EmptyUtils.isEmptyArr(bannerImgList) ? [] : bannerImgList}
                                                       onDidChange={(item, index) => {
                                                           if (this.state.messageIndex !== index) {
                                                               this.setState({
                                                                   messageIndex: index
                                                               });
                                                           }
                                                       }}/>
                        : <ViewPager
                            swiperShow={true}
                            arrayData={EmptyUtils.isEmptyArr(bannerImgList) ? [] : bannerImgList}
                            renderItem={this._renderViewPageItem}
                            height={ScreenUtils.autoSizeWidth(375)}
                            scrollsToTop={true}
                            autoplay={false}
                            loop={false}
                            renderPagination={this._renderPagination}
                            index={0}
                            bounces={true}
                        />}

                    {Platform.OS === 'ios' ? this._renderStyle() : null}
                </View>
            );
        } else {
            return <View style={{ height: ScreenUtils.autoSizeWidth(375), width: ScreenUtils.width }}/>;
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
    },
    bannerView: { height: ScreenUtils.autoSizeWidth(375), width: ScreenUtils.width }
});


export default TopicDetailBanner;
