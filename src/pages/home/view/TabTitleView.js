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
    TouchableWithoutFeedback
} from 'react-native';

import {
    MRText
} from '../../../components/ui';
import { observer } from 'mobx-react';
import { homeModule } from '../model/Modules';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import LinearGradient from 'react-native-linear-gradient';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { ContentType } from '../HomeTypes';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

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
                                        <LinearGradient style={styles.item}
                                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                                        colors={['#FC5D39', '#FF0050']}
                                        >
                                            <MRText style={[styles.title, {color: 'white'}]}>{item.name}</MRText>
                                            {item.secName?<MRText style={[styles.detail, {color: 'white'}]}>{item.secName}</MRText>:null}
                                        </LinearGradient>
                                        :<View style={styles.item}>
                                            <MRText style={styles.title}>{item.name}</MRText>
                                            {item.secName?<MRText style={styles.detail}>{item.secName}</MRText>:null}
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
        height: autoSizeWidth(43),
        paddingHorizontal: autoSizeWidth(10),
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: autoSizeWidth(10),
    },
    title: {
        fontSize: autoSizeWidth(16),
        fontWeight: '600',
        color: DesignRule.textColor_mainTitle
    },
    detail: {
        fontSize: autoSizeWidth(10),
        color: DesignRule.textColor_instruction,
        marginTop: -3
    }
});
