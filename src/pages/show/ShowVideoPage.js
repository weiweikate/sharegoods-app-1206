/**
 * @author xzm
 * @date 2019/7/11
 */

import React  from 'react';
import {
  // StyleSheet,
  View,
} from 'react-native';
import BasePage from '../../BasePage';
import ShowDetailVideoView from './components/ShowDetailVideoView';

let mp4 = 'https://cdn.sharegoodsmall.com/sharegoods/a5194393f19c49b48bfd81eb14f530ea.mp4';
let cover = "https://cdn.sharegoodsmall.com/sharegoods/62b9a220bf6c47939edae02f0177cde7.png";
export default class ShowVideoPage extends BasePage {
    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
    super(props);
  }

  _render(){
      return(
          <View style={{flex:1}}>
              <ShowDetailVideoView
                  videoUrl={mp4}
                  videoCover={cover}
              />
          </View>
      )
  }
}

// var styles = StyleSheet.create({});

