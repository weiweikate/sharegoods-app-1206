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

import {
    StyleSheet,
    View,
    ScrollView,
    TouchableWithoutFeedback,
    ImageBackground
} from 'react-native';

import {
    MRText
} from '../../../components/ui';
import { observer } from 'mobx-react';
import { homeModule } from '../model/Modules';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { ContentType } from '../HomeTypes';
import res from '../res'

const autoSizeWidth = ScreenUtils.autoSizeWidth;
const tabBg = res.tabBg

@observer
export default class TabTitleView extends React.Component {

    constructor(props) {
        super(props);


        this.state = {};
    }

    componentDidMount() {
    }


    render() {
        return (
            <ScrollView horizontal = {true}
                        style={{marginLeft: autoSizeWidth(5)}}
                        showsHorizontalScrollIndicator={false}
            >
                {
                    homeModule.tabList.map((item, index) => {
                        if (item.linkType != 1){
                            return <View />
                        }
                        return (
                            <View style={{justifyContent: 'center'}} key = {index+'TabTitleView'}>
                                <TouchableWithoutFeedback onPress={()=> {
                                    homeModule.tabSelect(index, item.id, item.name)
                                    track(trackEvent.HomeRecommendClick, {homeRecArea: 1,contentType: ContentType.tab,
                                        contentValue: item.name, contentIndex: index})
                                }}>
                                    {homeModule.tabListIndex === index?
                                        <ImageBackground style={styles.item}
                                                         source = {tabBg}
                                        >
                                            <MRText style={[styles.title, {color: 'white'}]} numberOfLines={1}>{item.name}</MRText>
                                            {item.secName?<MRText style={[styles.detail, {color: 'white'}]} numberOfLines={1}>{item.secName}</MRText>:null}
                                        </ImageBackground>
                                        :<View style={styles.item}>
                                            <MRText style={styles.title} numberOfLines={1}>{item.name}</MRText>
                                            {item.secName?<MRText style={styles.detail} numberOfLines={1}>{item.secName}</MRText>:null}
                                        </View>
                                    }
                                </TouchableWithoutFeedback>
                            </View>

                        )
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
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: autoSizeWidth(10),
        paddingBottom: autoSizeWidth(8)
    },
    title: {
        fontSize: autoSizeWidth(13),
        fontWeight: '600',
        color: DesignRule.textColor_mainTitle
    },
    detail: {
        fontSize: autoSizeWidth(10),
        color: DesignRule.textColor_instruction,
        marginTop: -3
    }
});
