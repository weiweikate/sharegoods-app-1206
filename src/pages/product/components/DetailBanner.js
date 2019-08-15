import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import XGSwiper from '../../../components/ui/XGSwiper';
import ViewPager from '../../../components/ui/ViewPager';
import EmptyUtils from '../../../utils/EmptyUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import VideoView from '../../../components/ui/video/VideoView';
import StringUtils from '../../../utils/StringUtils';
import UIImage from '@mr/image-placeholder';
import DesignRule from '../../../constants/DesignRule';
import { MRText as Text } from '../../../components/ui/index';
import { routeNavigate } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';

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

    //ios
    _renderStyle = () => {
        const bannerCount = (this.productImgListTemp || []).length;
        return <View style={styles.indexViewTwo}>
            <Text
                style={styles.text} allowFontScaling={false}>{this.state.messageIndex + 1} / {bannerCount}</Text>
        </View>;
    };

    //android
    _renderPagination = (index, total) => {
        return <View style={styles.indexViewTwo}>
            <Text
                style={styles.text} allowFontScaling={false}>{index + 1}/{total}</Text>
        </View>;
    };

    _renderViewPageItem = (item = {}, index) => {
        if (item.videoUrl) {
            return <VideoView videoUrl={item.videoUrl} videoCover={item.videoCover}
                              navigation={this.props.navigation}/>;
        } else {
            const { originalImg } = item;
            let imgList = this.getImageList(this.productImgListOutVideo);
            return (
                <TouchableWithoutFeedback onPress={() => {
                    const params = { imageUrls: imgList, index: this.state.haveVideo ? index - 1 : index };
                    routeNavigate(RouterMap.CheckBigImagesView, params);
                }}>
                    <View>
                        <UIImage source={{ uri: originalImg }}
                                 style={{ height: ScreenUtils.autoSizeWidth(375), width: ScreenUtils.width }}
                                 resizeMode={'cover'}/>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    };

    render() {
        //有视频第一个添加为视频
        const { imgFileList, videoUrl, imgUrl } = this.props.data || {};

        let productImgListTemp = [...(imgFileList || [])];
        productImgListTemp = productImgListTemp || [];
        productImgListTemp.unshift({ originalImg: imgUrl });
        this.productImgListOutVideo = [...productImgListTemp];
        if (StringUtils.isNoEmpty(videoUrl)) {
            this.state.haveVideo = true;
            productImgListTemp.unshift({ videoUrl: videoUrl, videoCover: imgUrl });
        } else {
            this.state.haveVideo = false;
        }
        this.productImgListTemp = productImgListTemp;
        if (productImgListTemp.length > 0) {
            return (
                <View>
                    {
                        Platform.OS === 'ios' ?
                            <XGSwiper height={ScreenUtils.autoSizeWidth(375)} width={ScreenUtils.width}
                                      loop={false}
                                      renderRow={this._renderViewPageItem}
                                      dataSource={EmptyUtils.isEmptyArr(productImgListTemp) ? [] : productImgListTemp}
                                      onDidChange={(item, index) => {
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
                                height={ScreenUtils.autoSizeWidth(375)}
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
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: DesignRule.textColor_mainTitle,
        fontSize: 10,
        paddingHorizontal: 8
    }
});


export default DetailBanner;
