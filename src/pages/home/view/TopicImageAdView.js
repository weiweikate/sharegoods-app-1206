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

import { TouchableOpacity, View } from 'react-native';

import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
// import { mediatorCallFunc } from '../../../SGMediator';
import MRBannerViewComponent from '../../../components/ui/bannerView/MRBannerViewComponent';
import { topicAdOnPress } from '../HomeTypes';

export class TopicImageAdView extends React.Component {

    render() {
        let data = this.props.data;
        let height = data.itemHeight;
        if (height === 0) {
            return <View/>;
        }
        return (
            <View style={{ height, width: ScreenUtils.width, flexDirection: 'row' }}>
                {this.renderImages(data, height)}
            </View>
        );
    }

    renderImages(data, height) {
        switch (data.layout) {
            case '1':
            case '2':
            case '3':
            case '4':
                let links = data.imgs[0].links || [];
                return (
                    <View style={{ height, width: ScreenUtils.width }}>
                        <ImageLoader style={{ height, width: ScreenUtils.width, flexDirection: 'row' }}
                                     source={{ uri: data.imgs[0].src }}
                        >{
                            links.map((item) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                            topicAdOnPress(data,item, this.props.p);


                                    }}
                                                      style={{ flex: 1 }}
                                    >
                                    </TouchableOpacity>
                                );
                            })
                        }
                        </ImageLoader>
                    </View>
                );
            case 'carousel':
                let imgs = data.imgs.map(value => {
                    return value.src || '';
                });
                return (
                    <View style={{ height: height - ScreenUtils.autoSizeWidth(10), width: ScreenUtils.width, marginTop: ScreenUtils.autoSizeWidth(10) }}>
                        <MRBannerViewComponent
                            itemRadius={5}
                            imgUrlArray={imgs}
                            bannerHeight={height - ScreenUtils.autoSizeWidth(10)}
                            modeStyle={1}
                            autoLoop={true}
                            onDidSelectItemAtIndex={(i) => {
                                let links = data.imgs[i].links;
                                if (links && links.length > 0) {
                                    topicAdOnPress(data, links[0], this.props.p);
                                }

                            }}/>
                    </View>);
        }
    }

}

export function ImageAdViewGetHeight(data) {
//     1（一拖一）
// 2（一拖二）
// 3（一拖三）
// 4（一拖四）
// carousel（轮播海报）
    if (!data || !data.imgs || data.imgs.length === 0) {
        return 0;
    }
    let {width, height} = data.imgs[0];
    let viewHeight = 0;
    if (typeof width === 'number' && typeof height === 'number') {
        viewHeight = ScreenUtils.width / width * height;
    }
    switch (data.layout) {
        case '1':
            return viewHeight || ScreenUtils.autoSizeWidth(160);
        case '2':
            return viewHeight || ScreenUtils.autoSizeWidth(120);
        case '3':
            return viewHeight || ScreenUtils.autoSizeWidth(100);
        case '4':
            return viewHeight || ScreenUtils.autoSizeWidth(100);
        case 'carousel':
            return viewHeight? (viewHeight+ScreenUtils.autoSizeWidth(10)): ScreenUtils.autoSizeWidth(170);
    }
    return 0;
}

export function ImageAdViewGetItemStyle(data, height) {
    let padding = ScreenUtils.autoSizeWidth(5);
    let width = ScreenUtils.width - ScreenUtils.autoSizeWidth(30);
    switch (data.layout) {
        case '1':
            return { width, height };
        case '2':
            padding = ScreenUtils.autoSizeWidth(10);
            return { width: (width - padding) / 2, height, marginRight: padding };
        case '3':
            return { width: (width - 2 * padding) / 3, height, marginRight: padding };
        case '4':
            return { width: (width - 3 * padding) / 4, height, marginRight: padding };
        case 'carousel':
            return { width, height };
    }
    return {};
}


