import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import BasePage from '../../../../BasePage';
// import VideoView from '../../../components/ui/video/VideoView';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
// import StringUtils from '../../../utils/StringUtils';
import { MRText as Text } from '../../../../components/ui/UIText';
// import DesignRule from '../../../constants/DesignRule';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import pRes from '../../res';
import VideoView from '../../../../components/ui/video/VideoView';
import DesignRule from '../../../../constants/DesignRule';
import XGSwiper from '../../../../components/ui/XGSwiper';
import StringUtils from '../../../../utils/StringUtils';

const { swiper_cancel } = pRes.product.productScore;


const { width, height } = ScreenUtils;

export default class P_ScoreSwiperPage extends BasePage {
    $navigationBarOptions = {
        show: false
    };

    state = {
        index: 1
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
        const { video, images, videoImg, content } = this.params;

        this.videoImageList = [...images];
        if (StringUtils.isNoEmpty(video)) {
            this.videoImageList.unshift({ videoUrl: video, videoCover: videoImg });
        }
        return (
            <View style={styles.containerView}>
                <XGSwiper height={height} width={width}
                          loop={false}
                          renderRow={this._renderViewPageItem}
                          dataSource={this.videoImageList}
                          onDidChange={(item, index) => {
                              // if (this.state.index !== index) {
                              this.setState({
                                  index: index + 1
                              });
                              // }
                          }}/>
                <View style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    height: 44,
                    top: 20,
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: DesignRule.textColor_instruction
                    }}>{`${this.state.index}/${this.videoImageList.length}`}</Text>
                </View>

                <View style={{
                    position: 'absolute',
                    height: 48,
                    width: width,
                    bottom: 0, left: 15, right: 15
                }}>
                    <Text style={{
                        fontSize: 12,
                        width: width - 30,
                        color: DesignRule.white
                    }}
                          numberOfLines={3}>{content}</Text>

                </View>

                <NoMoreClick style={{
                    position: 'absolute',
                    width: 44,
                    height: 44,
                    top: 20,
                    left: 14,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onPress={() => {
                    this.$navigateBack();
                }}>
                    <Image source={swiper_cancel}/>
                </NoMoreClick>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)'
    }
});

