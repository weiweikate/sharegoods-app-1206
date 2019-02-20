import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import BasePage from '../../../../BasePage';
// import VideoView from '../../../components/ui/video/VideoView';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
// import StringUtils from '../../../utils/StringUtils';
import { MRText as Text } from '../../../../components/ui/UIText';
// import DesignRule from '../../../constants/DesignRule';
import Swiper from 'react-native-swiper';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import pRes from '../../res';
import VideoView from '../../../../components/ui/video/VideoView';
import DesignRule from '../../../../constants/DesignRule';

const { swiper_cancel } = pRes.product.productScore;


const { width, height } = ScreenUtils;

export default class P_ScoreSwiperPage extends BasePage {
    $navigationBarOptions = {
        show: false
    };

    state = {
        count: 1
    };

    _render() {
        const { video, images, videoImg } = this.params;
        return (
            <View style={styles.containerView}>
                <Swiper height={height} loop={false} showsPagination={false} onMomentumScrollEnd={(event, state) => {
                    this.setState({
                        count: state.index + 1
                    });
                }}>
                    {
                        video ? <VideoView videoUrl={video} videoCover={videoImg}/> : null
                    }
                    {
                        images.map((item) => {
                            return <UIImage style={{ width: width, height: height }} source={{ uri: item }}
                                            resizeMode={'contain'}/>;
                        })
                    }
                </Swiper>

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
                    }}>{`${this.state.count}/${images.length}`}</Text>
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

