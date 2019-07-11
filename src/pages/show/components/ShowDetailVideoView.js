/**
 * @author xzm
 * @date 2019/7/11
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import Video from 'react-native-video';
import DesignRule from '../../../constants/DesignRule';
import icon_video_play from '../../../components/ui/video/icon_video_play.png';
import ScreenUtils from '../../../utils/ScreenUtils';


export default class ShowDetailVideoView extends PureComponent {
  constructor(props) {
    super(props);
      this.state = {
          videoUrl: props.videoUrl,
          videoCover: props.videoCover,
          showVideoCover: true,    // 是否显示视频封面
          showVideoControl: false, // 是否显示视频控制组件
          isPlaying: false,        // 视频是否正在播放
          currentTime: 0,        // 视频当前播放的时间
          duration: 0,           // 视频的总时长
          isFullScreen: false,     // 当前是否全屏显示
          playFromBeginning: false // 是否从头开始播放
      };
  }


    ///播放视频，提供给外部调用
    playVideo() {
        this.setState({
            isPlaying: true,
            showVideoCover: false
        });
    }

    /// 暂停播放，提供给外部调用
    pauseVideo() {
        this.setState({
            isPlaying: false
        });
    }

    /// 点击了工具栏上的播放按钮
    onControlPlayPress() {
        this.onPressPlayButton();
    }

    /// 点击了播放器正中间的播放按钮
    onPressPlayButton() {
        let isPlay = !this.state.isPlaying;
        this.setState({
            isPlaying: isPlay,
            showVideoCover: false
        });
        if (this.state.playFromBeginning) {
            this.videoPlayer.seek(0);
            this.setState({
                playFromBeginning: false
            });
        }
    }


    _render(){
      if (this.state.showVideoCover) {
          return <View style={{ flex: 1, backgroundColor: DesignRule.imgBg_color }}>
              <Image style={{ flex: 1, width: DesignRule.width, height:ScreenUtils.height }}
                     source={{ uri: this.state.videoCover }}
                     resizeMode={'cover'}/>
              <TouchableOpacity style={{
                  position: 'absolute', top: '50%', left: '50%', marginTop: -25, marginLeft: -25
              }} activeOpacity={0.3} onPress={() => {
                  this.onControlPlayPress();
              }}>
                  <Image style={{ width: 50, height: 50 }} source={icon_video_play}/>
              </TouchableOpacity>
          </View>;

      }
      return (
          <View style={{flex:1}}>
              <Video
                  ref={(ref) => this.videoPlayer = ref}
                  source={{ uri: this.state.videoUrl }}
                  rate={1.0}
                  volume={1.0}
                  muted={false}
                  repeat={true}
                  paused={!this.state.isPlaying}
                  resizeMode={'contain'}
                  playWhenInactive={false}
                  playInBackground={false}
                  ignoreSilentSwitch={'ignore'}
                  progressUpdateInterval={250.0}
                  onLoadStart={this._onLoadStart}
                  onLoad={this._onLoaded}
                  onProgress={this._onProgressChanged}
                  onError={this._onPlayError}
                  onBuffer={this._onBuffering}
                  style={{ width:DesignRule.width, height: DesignRule.height,flex:1 ,backgroundColor:'red'}}
              />
          </View>
      )
  }

    render() {
        return (
            <View style={styles.container} onLayout={this._onLayout}>
                {this._render()}
            </View>
        );
    }

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
});


