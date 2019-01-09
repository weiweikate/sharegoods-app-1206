import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import XGSwiper from '../../../components/ui/XGSwiper';
import VideoView from '../../../components/ui/video/VideoView';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
import StringUtils from '../../../utils/StringUtils';
import { MRText as Text } from '../../../components/ui/UIText';
import DesignRule from '../../../constants/DesignRule';
import BasePage from '../../../BasePage';

const { px2dp } = ScreenUtils;

export default class BigImagesPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            data: this.params.pData || {},
            messageIndex: 0
        };
    }

    $navigationBarOptions = {
        show: false
    };

    render() {
        const { imgFileList, videoUrl, imgUrl } = this.state.data;
        let productImgListTemp = [...(imgFileList || [])];
        //添加第一张主图
        productImgListTemp.unshift({ originalImg: imgUrl });
        //图片
        this.productImgListOutVideo = [...productImgListTemp];

        //有视频第一个添加为视频
        if (StringUtils.isNoEmpty(videoUrl)) {
            this.haveVideo = true;
            productImgListTemp.unshift({ videoUrl: videoUrl, videoCover: imgUrl });
        } else {
            this.haveVideo = false;
        }
        this.productImgListWithVideo = productImgListTemp;

        const isSelectedVideo = this.state.messageIndex === 0 && this.haveVideo;
        return (
            <View style={styles.containerView}>
                <TouchableWithoutFeedback onPress={() => {
                    this.$navigateBack();
                }}>
                    <View style={styles.topCloseBtn}>
                        {/*视频 图片*/}
                        <View style={styles.topView}>
                            {this.haveVideo ?
                                <TouchableOpacity style={{ marginRight: 30 }}>
                                    <Text style={{
                                        fontSize: 13,
                                        color: isSelectedVideo ? DesignRule.white : DesignRule.textColor_secondTitle
                                    }}>视频</Text>
                                    <View style={{
                                        height: 2,
                                        marginTop: 2,
                                        backgroundColor: isSelectedVideo ? DesignRule.white : 'transparent'
                                    }}/>
                                </TouchableOpacity> : null}
                            <TouchableOpacity>
                                <Text style={{
                                    fontSize: 13,
                                    color: isSelectedVideo ? DesignRule.textColor_secondTitle : DesignRule.white
                                }}>图片</Text>
                                <View style={{
                                    height: 2,
                                    marginTop: 2,
                                    backgroundColor: isSelectedVideo ? 'transparent' : DesignRule.white
                                }}/>
                            </TouchableOpacity>
                        </View>
                        {/*图片*/}
                        {this._renderBanner()}
                        {/*小点*/}
                        {this._renderPagination()}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    _renderBanner = () => {
        if (this.productImgListWithVideo.length > 0) {
            return (<XGSwiper height={ScreenUtils.autoSizeWidth(375)} width={ScreenUtils.width}
                              loop={false}
                              renderRow={this._renderViewPageItem}
                              dataSource={this.productImgListWithVideo}
                              onDidChange={(item, index) => {
                                  if (this.state.messageIndex !== index) {
                                      this.setState({
                                          messageIndex: index
                                      });
                                  }
                              }}/>
            );
        } else {
            return <View style={{ height: px2dp(375), width: ScreenUtils.width }}/>;
        }
    };

    _renderViewPageItem = (item, index) => {
        if (item.videoUrl) {
            return <VideoView videoUrl={item.videoUrl} videoCover={item.videoCover}/>;
        } else {
            const { originalImg } = item;
            return (
                <UIImage source={{ uri: originalImg }}
                         style={{ height: px2dp(375), width: ScreenUtils.width }}
                         resizeMode={'cover'}/>
            );
        }
    };

    _renderPagination = () => {
        if (this.state.messageIndex === 0 && this.haveVideo) {
            return <View style={styles.indexView}/>;
        }
        const bannerCount = this.productImgListOutVideo.length;
        let items = [];
        let selectedIndex = this.haveVideo ? this.state.messageIndex - 1 : this.state.messageIndex;
        for (let i = 0; i < bannerCount; i++) {
            if (selectedIndex === i) {
                items.push(<View key={i} style={styles.activityIndex}/>);
            } else {
                items.push(<View key={i} style={styles.index}/>);
            }
        }
        return <View style={styles.indexView}>
            {items}
        </View>;
    };
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)',
        width: ScreenUtils.width
    },
    topCloseBtn: {
        justifyContent: 'center',
        height: ScreenUtils.height
    },

    topView: {
        position: 'absolute', top: px2dp(57), width: ScreenUtils.width,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },

    indexView: {
        marginTop: 10,
        height: 6,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    activityIndex: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: DesignRule.textColor_secondTitle,
        marginLeft: 2.5,
        marginRight: 2.5
    },
    index: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: DesignRule.white,
        marginLeft: 2.5,
        marginRight: 2.5
    }
});

