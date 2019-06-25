/**
 * @author xzm
 * @date 2019/6/19
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

import ImageLoad from '@mr/image-placeholder';
import EmptyUtils from '../../../utils/EmptyUtils';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText } from '../../../components/ui';
import ShowApi from '../ShowApi';

const { px2dp, getImgHeightWithWidth } = ScreenUtils;
const size = { width: 345, height: 190 };
const imgW = DesignRule.width - px2dp(30);
const imgH = getImgHeightWithWidth(size, imgW);


export default class TagDescriptionView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: null,
            description: null
        };
    }

    componentDidMount() {
        ShowApi.getTagInfo({ tagId: this.props.tagId }).then((data) => {
            this.setState({
                url: data.data.url,
                description: data.data.description
            });
            this.props.callback && this.props.callback();
        }).catch((e) => {
            this.props.callback && this.props.callback();
        });
    }


    render() {
        if (EmptyUtils.isEmpty(this.state.url)) {
            return null;
        }
        return (
            <View style={styles.wrapper}>
                <ImageLoad source={{ uri: this.state.url }} style={{ width: imgW, height: imgH }}/>
                {this.state.description ? <MRText         numberOfLines={3}
                                                          style={styles.text}>
                    {this.state.description}
                </MRText> : null}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        backgroundColor: DesignRule.white,
        width: imgW,
        borderRadius: px2dp(5),
        alignSelf: 'center',
        overflow: 'hidden',
        marginTop: px2dp(10)
    },
    text: {
        width: imgW,
        padding: px2dp(10),
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_threeTitle,
    }
});

