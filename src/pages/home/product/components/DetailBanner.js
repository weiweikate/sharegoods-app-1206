import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableWithoutFeedback, Text, Platform } from 'react-native';
import XGSwiper from '../../../../components/ui/XGSwiper';
import ViewPager from '../../../../components/ui/ViewPager';
import EmptyUtils from '../../../../utils/EmptyUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import VideoView from '../../../../components/ui/video/VideoView';
import StringUtils from '../../../../utils/StringUtils';

export class DetailBanner extends Component {
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
        const { productImgList } = this.props.data;
        const bannerCount = productImgList.length;
        return <View style={styles.indexViewTwo}>
            <Text
                style={styles.text}>{this.state.messageIndex + 1} / {this.state.haveVideo ? bannerCount + 1 : bannerCount}</Text>
        </View>;
    };

    _renderPagination = (index, total) => {
        return <View style={styles.indexViewTwo}>
            <Text
                style={styles.text}>{index + 1}/{total}</Text>
        </View>;
    };

    _renderViewPageItem = (item = {}, index) => {
        const { productImgList } = this.props.data;
        if (item.videoUrl) {
            return <VideoView videoUrl={item.videoUrl} videoCover={item.videoCover}/>;
        } else {
            const { originalImg } = item;
            let imgList = this.getImageList(productImgList);
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
        //有视频第一个添加为视频
        const { productImgList = [], product = {} } = this.props.data || {};
        const { videoUrl, imgUrl } = product;

        let productImgListTemp = [...productImgList];
        if (StringUtils.isNoEmpty(videoUrl)) {
            this.state.haveVideo = true;
            productImgListTemp.unshift({ videoUrl: videoUrl, videoCover: imgUrl });
        } else {
            this.state.haveVideo = false;
        }
        if (productImgListTemp.length > 0) {
            return (
                <View>
                    {
                        Platform.OS === 'ios' ?
                            <XGSwiper height={ScreenUtils.autoSizeWidth(377)} width={ScreenUtils.width}
                                      loop={false}
                                      renderRow={this._renderViewPageItem}
                                      dataSource={EmptyUtils.isEmptyArr(productImgListTemp) ? [] : productImgListTemp}
                                      onWillChange={(item, index) => {
                                          if (this.state.messageIndex !== index) {
                                              this.setState({
                                                  messageIndex: index
                                              });
                                          }
                                      }}/>
                            : <ViewPager
                                swiperShow={true}
                                arrayData={EmptyUtils.isEmptyArr(productImgListTemp) ? [] : productImgListTemp}
                                renderItem={this._renderViewPageItem}
                                height={ScreenUtils.autoSizeWidth(377)}
                                scrollsToTop={true}
                                autoplay={false}
                                loop={false}
                                renderPagination={this._renderPagination}
                                index={0}
                                bounces={true}
                            />
                    }
                    {Platform.OS === 'ios' ? this._renderStyle() : null}
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


export default DetailBanner;
