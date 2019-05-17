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
const {iconToTop} = res;
export default class ToTopButton extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <View style={this.props.style}>
                    <Image source={iconToTop} style={styles.wrapper}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        width: px2dp(36),
        height: px2dp(36)
    }

});
