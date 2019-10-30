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
import LinearGradient from 'react-native-linear-gradient';

@observer
export default class TabTitleView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (homeModule.tabList.length === 0 || homeModule.showStatic === true) {
            return null;
        }
        return (
            <ScrollView horizontal={true}
                        style={{ marginLeft: autoSizeWidth(5)}}
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
                                                numberOfLines={1}>{StringUtils.isNoEmpty(item.secName) ? item.secName : ' '}</MRText>
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


@observer
export class StaticTabTitleView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        homeModule.changeShowStatic(true);
    }

    componentWillUnmount(){
        homeModule.changeShowStatic(false);
    }


    render() {
        if (homeModule.tabList.length === 0) {
            return null;
        }
        return (
            <View  style={{ paddingBottom: autoSizeWidth(5), backgroundColor: DesignRule.bgColor}}>
            <ScrollView horizontal={true}
                        style={{ paddingLeft: autoSizeWidth(5), backgroundColor: 'white'}}
                        showsHorizontalScrollIndicator={false}>
                {
                    homeModule.tabList.map((item, index) => {
                        if (item.linkType != 1) {
                            return <View/>;
                        }
                        return (
                            <TouchableWithoutFeedback key={index + 'StaticTabTitleView'} onPress={() => {
                                homeModule.tabSelect(index, item.id, item.name);
                                track(trackEvent.HomeRecommendClick, {
                                    homeRecArea: 1, contentType: ContentType.tab,
                                    contentValue: item.name, contentIndex: index
                                });
                            }}>
                                {homeModule.tabListIndex === index ?
                                    <View style={styles.staticItem}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        colors={['#FC5D39', '#FF0050']}
                                        style={{ overflow: 'hidden',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: autoSizeWidth(11),
                                            height: autoSizeWidth(22),
                                            paddingHorizontal: 2
                                        }}
                                    >
                                        <MRText style={[styles.staticTitle, { color: 'white' }]}
                                                numberOfLines={1}>{item.name}</MRText>
                                    </LinearGradient>
                                    </View>
                                    : <View style={styles.staticItem}>
                                        <MRText
                                            style={styles.staticTitle}
                                            numberOfLines={1}>{item.name}</MRText>
                                    </View>
                                }
                            </TouchableWithoutFeedback>
                        );
                    })
                }
            </ScrollView>
            </View>
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
    },
    staticItem: {
        height: autoSizeWidth(30),
        width: autoSizeWidth(70),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    staticTitle: {
        fontSize: autoSizeWidth(13),
        fontWeight: '600',
        color: DesignRule.textColor_mainTitle
    },
});
