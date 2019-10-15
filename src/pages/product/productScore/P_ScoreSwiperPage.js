import React from 'react';
import { StyleSheet, View } from 'react-native';
import BasePage from '../../../BasePage';
// import VideoView from '../../../components/ui/video/VideoView';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text } from '../../../components/ui/UIText';
import VideoView from '../../../components/ui/video/VideoView';
import DesignRule from '../../../constants/DesignRule';
import FlyImageViewer from '../../../comm/components/FlyImageViewer';


const { width, height } = ScreenUtils;

export default class P_ScoreSwiperPage extends BasePage {
    $navigationBarOptions = {
        show: false
    };

    // 更换页面背景色
    $setBackgroundColor() {
        return DesignRule.textColor_mainTitle;
    }

    state = {
        index: this.params.index ? this.params.index + 1 : 1
    };

    _renderViewPageItem = (item) => {
        if (item.videoUrl) {
            return <VideoView videoUrl={item.videoUrl} videoCover={item.videoCover}/>;
        } else {
            return (
                <UIImage style={{ width: width, height: height }} source={{ uri: item }}
                         resizeMode={'contain'}/>
            );
        }
    };

    _render() {
        const { images, content } = this.params;

        this.videoImageList = [...images];
        //去掉视频
        // if (StringUtils.isNoEmpty(video)) {
        //     this.videoImageList.unshift({ videoUrl: video, videoCover: videoImg });
        // }
        return (
            <View style={styles.containerView}>
                <FlyImageViewer imageUrls={this.videoImageList}
                                index={this.params.index}
                                unShowDown={true}
                                onCancel={() => {
                                    this.props.navigation.goBack();
                                }}>
                    <View style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 48,
                        width: width,
                        bottom: 0, left: 0, right: 0
                    }}>
                        <Text style={{
                            fontSize: 12,
                            marginHorizontal: 15,
                            color: DesignRule.white
                        }}
                              numberOfLines={3}>{content}</Text>

                    </View>
                </FlyImageViewer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
    }
});

