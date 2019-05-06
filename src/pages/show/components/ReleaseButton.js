/**
 * @author xzm
 * @date 2019/4/30
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Image
} from 'react-native';

import ScreenUtil from '../../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;
import res from './../res'
const {showReleaseIcon} = res;
export default class ReleaseButton extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={this.props.style}>
                    <Image source={showReleaseIcon} style={styles.wrapper}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        width: px2dp(60),
        height: px2dp(24)
    }

});
