/**
 * @author xzm
 * @date 2019/7/11
 */

import React from 'react';
import {
    // StyleSheet,
    View,
    requireNativeComponent
} from 'react-native';
import BasePage from '../../BasePage';

const ShowVideoListView = requireNativeComponent('MrShowVideoListView');

// let mp4 = 'https://cdn.sharegoodsmall.com/sharegoods/a5194393f19c49b48bfd81eb14f530ea.mp4';
// let mp4 = 'https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0300f950000bkjb2dm409jtmn54cqu0&ratio=720p&line=0';
let mp4 = 'http://testovd.sharegoodsmall.com/f266bc8abd05473b84862ec0bde7f16b/6ef4a1e71a9c41349b2e6dc51b951069-cdbe7453d62b932d44b79f0a00561836-sd.mp4';
let cover = 'https://cdn.sharegoodsmall.com/sharegoods/62b9a220bf6c47939edae02f0177cde7.png';
export default class ShowVideoPage extends BasePage {
    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
        super(props);
       this.defaultParams = {
           cover:cover,
           videoUrl:mp4
       }

    }

    _render() {
        return (
            <View   style={{ flex: 1 }}>
                <ShowVideoListView style={{flex:1}}
                                     params={JSON.stringify(this.params.data)}/>
            </View>
        );
    }
}

// var styles = StyleSheet.create({});

