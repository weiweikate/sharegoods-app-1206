/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/28.
 *
 */


'use strict';

import React, { Component } from 'react';

import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { MRText as Text } from '../../../components/ui';
// import {
//   UIText,
//   UIImage,
// } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
// import ImageLoad from '@mr/image-placeholder'
// import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';

import ImageLoad from '@mr/image-placeholder';
// import PropTypes from 'prop-types';
const { px2dp } = ScreenUtils;

export default class MentorItemView extends Component {
    state = {
        isSelected: false
    };

    constructor(props) {
        super(props);
        this.state = {
            isSelect: true,
            itemData: props.itemData
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.state.isSelect = nextProps.isSelect;
            this.state.itemData = nextProps.itemData;
        }
    }

    changeSelectState = (isSelect) => {
        this.setState({
            isSelect: isSelect
        });
    };

    render() {
        // const ImageWidth = this.state.isSelect ? ScreenUtils.width / 5 : ScreenUtils.width / 5 - 20;
        // const ImageWidth = ScreenUtils.width / 4 - 20;
        const ImageContentWith = px2dp(60);
        // console.log("this.props.itemData.headImg", this.props.itemData.headImg);
        return (
            <View
                style={[styles.mainBgStyle,
                    this.state.isSelect ? null : { opacity: 0.5 }]}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.clickItemAction && this.props.clickItemAction(this.state.itemData);
                    }}>
                    <View style={{
                        width: ImageContentWith,
                        height: ImageContentWith,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: px2dp(3),
                        borderColor:DesignRule.color_fff,
                        borderRadius:ImageContentWith / 2,
                    }}>
                        <ImageLoad
                            style={{ width: ImageContentWith - px2dp(6), height: ImageContentWith - px2dp(6)}}
                            source={{ uri: this.state.itemData.headImg ? this.state.itemData.headImg : '' }}
                            isAvatar={true}
                            height={ImageContentWith - px2dp(6) }
                            width={ImageContentWith - px2dp(6)}
                            borderRadius={(ImageContentWith - px2dp(6)) / 2}
                        />
                    </View>

                </TouchableOpacity>
                <Text
                    numberOfLines={1}
                    style={{
                        marginTop: 12,
                        fontSize: 12,
                        color: DesignRule.textColor_mainTitle
                    }}
                >
                    {this.state.itemData.nickname ? this.state.itemData.nickname : '暂无昵称~'}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        mainBgStyle: {
            width: ScreenUtils.width / 4,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
);

