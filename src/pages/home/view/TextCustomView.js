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
    TouchableWithoutFeedback,
    Text
} from 'react-native';

import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { topicAdOnPress } from '../HomeTypes';

const autoSizeWidth = ScreenUtils.autoSizeWidth;


export default class TextCustomView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
    }

    //linkType 链接类型：1商品 2专题 3限时购专场 4直降商品 5不做跳转
    onPress(data) {
            topicAdOnPress(data, data, this.props.p, this.props.data.text);
    }

    render() {
        let data = this.props.data || {};
        let backgroundColor = data.widgetColor || 'white';
        let textAlign = data.textAlign || 'left';
        let color = data.textColor || DesignRule.textColor_mainTitle;
        return (
            <TouchableWithoutFeedback onPress={() => this.onPress(data)}>
                <View style={{
                    backgroundColor, marginHorizontal: autoSizeWidth(15),
                    width: ScreenUtils.width - autoSizeWidth(30),
                    borderRadius: 5,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    height: data.itemHeight,
                    paddingHorizontal: autoSizeWidth(10)

                }}>
                    {data.text ?
                        <Text style={{ textAlign, color, fontSize: autoSizeWidth(14) }}>{data.text}</Text> : null}
                    {data.subText ? <Text
                        style={{ textAlign, color, fontSize: autoSizeWidth(12), marginTop: 3 }}>{data.subText}</Text> : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

// const styles = StyleSheet.create({});
