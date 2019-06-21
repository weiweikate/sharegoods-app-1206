/**
 * @author xzm
 * @date 2019/6/19
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import ImageLoad from '@mr/image-placeholder';
import EmptyUtils from '../../../utils/EmptyUtils';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText } from '../../../components/ui';

const { px2dp, getImgHeightWithWidth } = ScreenUtils;
const size = { width: 345, height: 190 };
const imgW = DesignRule.width - px2dp(30);
const imgH = getImgHeightWithWidth(size, imgW);


export default class TagDescriptionView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                url: 'https://cdn.sharegoodsmall.com/sharegoods/7c37d714e9954fbab1cd67f223206fd0.png?width=4608&height=3456',
                description: '现在对于人工智能的态度，了解计算机的和不了解计算机的基本上没有什说什数的意见就是，人工智能很厉害，可能解么现在对于人工智能的态度。'
            }
        };
    }

    componentDidMount() {

    }


    render() {
        if (EmptyUtils.isEmpty(this.state.data)) {
            return null;
        }
        return (
            <View style={styles.wrapper}>
                <ImageLoad source={{ uri: this.state.data.url }} style={{ width: imgW, height: imgH }}/>
                <MRText style={styles.text}>
                    {this.state.data.description}
                </MRText>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        backgroundColor: DesignRule.white,
        width: imgW,
        borderRadius: px2dp(5),
        alignSelf:'center',
        overflow:'hidden',
        marginTop:px2dp(10)
    },
    text: {
        width: imgW,
        padding: px2dp(10),
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_threeTitle
    }
});

