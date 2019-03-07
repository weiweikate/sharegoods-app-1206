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
import { formatDate } from '../../../utils/DateUtils';
import {MRText as Text} from '../../../components/ui/index';

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
            return <VideoView videoUrl={item.videoUrl} videoCover={item.videoCover} navigation = {this.props.navigation}/>;
        } else {
            const { originalImg } = item;
            let imgList = this.getImageList(this.productImgListOutVideo);
            return (
                <TouchableWithoutFeedback onPress={() => {
                    const params = { imageUrls: imgList, index: this.state.haveVideo ? index - 1 : index };
                    const { navigation } = this.props;
                    navigation && navigation.navigate('product/CheckBigImagesView', params);
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
        const { imgFileList, videoUrl, imgUrl, productStatus, upTime } = this.props.data || {};

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
                    {/*未开始售卖*/}
                    {productStatus === 3 ? <View style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0, height: 20,
                        backgroundColor: 'rgba(255,0,80,0.8)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: DesignRule.white,
                            fontSize: 13
                        }} allowFontScaling={false}>{`${upTime ? formatDate(upTime, 'yyyy-MM-dd HH:mm') : ''}开售`}</Text>
                    </View> : null}
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
    }
});


export default DetailBanner;
