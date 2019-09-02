/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/8/12.
 *
 */


'use strict';

import React from 'react';

import { ImageBackground, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { MRText } from '../../../components/ui';
import { observer } from 'mobx-react';
import { homeModule } from '../model/Modules';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { ContentType } from '../HomeTypes';
import res from '../res';
import StringUtils from '../../../utils/StringUtils';

const autoSizeWidth = ScreenUtils.px2dp;
const tabBg = res.tabBg;

@observer
export default class TabTitleView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (homeModule.tabList.length === 0) {
            return null;
        }
        return (
            <ScrollView horizontal={true}
                        style={{ marginLeft: autoSizeWidth(5), marginTop: autoSizeWidth(13) }}
                        showsHorizontalScrollIndicator={false}>
                {
                    homeModule.tabList.map((item, index) => {
                        if (item.linkType != 1) {
                            return <View/>;
                        }
                        return (
                            <TouchableWithoutFeedback key={index + 'TabTitleView'} onPress={() => {
                                homeModule.tabSelect(index, item.id, item.name);
                                track(trackEvent.HomeRecommendClick, {
                                    homeRecArea: 1, contentType: ContentType.tab,
                                    contentValue: item.name, contentIndex: index
                                });
                            }}>
                                {homeModule.tabListIndex === index ?
                                    <ImageBackground style={styles.item}
                                                     source={tabBg}
                                                     resizeMode={'contain'}>
                                        <MRText style={[styles.title, { color: 'white' },
                                            { marginTop: StringUtils.isNoEmpty(item.secName) ? 0 : 10 }]}
                                                numberOfLines={1}>{item.name}</MRText>
                                        <MRText style={[styles.detail, { color: 'white' }]}
                                                numberOfLines={1}>{StringUtils.isNoEmpty(item.secName) ? item.secName : ''}</MRText>
                                    </ImageBackground>
                                    : <View style={styles.item}>
                                        <MRText
                                            style={[styles.title, { marginTop: StringUtils.isNoEmpty(item.secName) ? 0 : 10 }]}
                                            numberOfLines={1}>{item.name}</MRText>
                                        <MRText style={styles.detail}
                                                numberOfLines={1}>{StringUtils.isNoEmpty(item.secName) ? item.secName : ''}</MRText>
                                    </View>
                                }
                            </TouchableWithoutFeedback>
                        );
                    })
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        height: autoSizeWidth(53),
        width: autoSizeWidth(70),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: autoSizeWidth(13),
        fontWeight: '600',
        color: DesignRule.textColor_mainTitle
    },
    detail: {
        fontSize: autoSizeWidth(10),
        color: DesignRule.textColor_instruction,
        marginTop: -3,
        marginBottom: 10
    }
});
