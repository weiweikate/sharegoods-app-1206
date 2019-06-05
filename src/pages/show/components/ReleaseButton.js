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
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtil;
import res from './../res'
import WhiteModel from '../model/WhiteModel';
const {showReleaseIcon} = res;
@observer
export default class ReleaseButton extends PureComponent {
    render() {
        if(WhiteModel.userStatus !== 2){
            return null;
        }
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
        width: px2dp(45),
        height: px2dp(45)
    }

});
