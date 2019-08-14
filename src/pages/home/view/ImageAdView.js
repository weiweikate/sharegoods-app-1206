/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/8/7.
 *
 */


'use strict';

import React from 'react';

import {
    View,
    TouchableOpacity
} from 'react-native';

import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
import { mediatorCallFunc } from '../../../SGMediator';
import MRBannerViewComponent from '../../../components/ui/bannerView/MRBannerViewComponent';
import { topicAdOnPress } from '../HomeTypes';

export default class ImageAdView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
    }

    renderImages(data, height){
        height = height - 10;
        let style = ImageAdViewGetItemStyle(data, height)
        switch (data.layout){
            case '1':
            case '2':
            case '3':
            case '4':
                return  data.imgs.map((item) => {
                    return (
                        <TouchableOpacity onPress={()=> {
                            mediatorCallFunc('Home_AdNavigate',item)
                        }}>
                            <ImageLoader style={style}
                                         source={{uri: item.src}}
                            />
                        </TouchableOpacity>
                    )
                })
            case 'carousel':
                let imgs = data.imgs.map(value => {
                    return value.src || ''
                });
                return  <MRBannerViewComponent
                    itemRadius={5}
                    imgUrlArray={imgs}
                    bannerHeight={height}
                    modeStyle={1}
                    autoLoop={true}
                    onDidSelectItemAtIndex={(i) => {
                        mediatorCallFunc('Home_AdNavigate',data.imgs[i])
                    }}/>
        }
    }



    render() {
        let data = this.props.data;
        let height = data.itemHeight;
        if (height === 0){
            return <View />
        }
        return (
            <View style={{height, width: ScreenUtils.width - ScreenUtils.autoSizeWidth(30), marginLeft: ScreenUtils.autoSizeWidth(15), flexDirection: 'row', paddingTop: 10}}>
                {this.renderImages(data, height)}
            </View>
        );
    }
}

export class TopicImageAdView extends React.Component {

    render() {
        let data = this.props.data;
        let height = data.itemHeight;
        if (height === 0){
            return <View />
        }
        return (
            <View style={{height, width: ScreenUtils.width - ScreenUtils.autoSizeWidth(30), marginLeft: ScreenUtils.autoSizeWidth(15), flexDirection: 'row', paddingTop: 10}}>
                {this.renderImages(data, height)}
            </View>
        );
    }

    renderImages(data, height){
        height = height - 10;
        switch (data.layout){
            case '1':
            case '2':
            case '3':
            case '4':
                let links = data.imgs[0].links || []
                return (
                    <ImageLoader style={{height, width: ScreenUtils.width - ScreenUtils.autoSizeWidth(30)}}
                                 source={{uri: data.imgs[0].src}}
                    >{
                        links.map((item) => {
                            return (
                                <TouchableOpacity onPress={()=> {
                                    topicAdOnPress(item.linkType,item.linkValue[0])

                                }}
                                                  style={{flex: 1}}
                                >
                                </TouchableOpacity>
                            )
                        })
                    }
                    </ImageLoader>
                )
            case 'carousel':
                let imgs = data.imgs.map(value => {
                    return value.src || ''
                });
                return  <MRBannerViewComponent
                    itemRadius={5}
                    imgUrlArray={imgs}
                    bannerHeight={height}
                    modeStyle={1}
                    autoLoop={true}
                    onDidSelectItemAtIndex={(i) => {
                        let links = data.imgs[i].links;
                        if (links && links.length > 0){
                            topicAdOnPress(links[0].linkType,links[0].linkValue[0])
                        }

                    }}/>
        }
    }

}

export function ImageAdViewGetHeight(data) {
//     1（一拖一）
// 2（一拖二）
// 3（一拖三）
// 4（一拖四）
// carousel（轮播海报）
    if (!data || !data.imgs || data.imgs.length === 0){
        return 0;
    }
    switch (data.layout){
        case '1':
            return ScreenUtils.autoSizeWidth(120);
            return data.height / data.width * (ScreenUtils.width - ScreenUtils.autoSizeWidth(30)) + 10
        case '2':
            return  ScreenUtils.autoSizeWidth(120) + 10
        case '3':
            return ScreenUtils.autoSizeWidth(100) + 10
        case '4':
            return ScreenUtils.autoSizeWidth(100) + 10
        case 'carousel':
            return  ScreenUtils.autoSizeWidth(160) + 10
    }
    return 0;
}

export function ImageAdViewGetItemStyle(data, height) {
    let padding = ScreenUtils.autoSizeWidth(5)
    let width = ScreenUtils.width - ScreenUtils.autoSizeWidth(30);
    switch (data.layout){
        case '1':
            return {width, height}
        case '2':
            padding = ScreenUtils.autoSizeWidth(10)
            return  {width : (width - padding)/2, height, marginRight: padding}
        case '3':
            return {width : (width - 2*padding)/3, height, marginRight: padding}
        case '4':
            return {width : (width - 3*padding)/4, height, marginRight: padding}
        case 'carousel':
            return {width, height}
    }
    return {};
}


