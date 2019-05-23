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
import ShowWhite from '../ShowWhite.json';
const { px2dp } = ScreenUtil;
import res from './../res'
import apiEnvironment from '../../../api/ApiEnvironment';
import user from '../../../model/user';
const {showReleaseIcon} = res;
export default class ReleaseButton extends PureComponent {

    render() {
        let ids = ShowWhite.onlineIds;
        if (apiEnvironment.envType !== 'online') {
            ids = ShowWhite.debugIds;
        }
        this.showRelease = ids.indexOf(user.code) > -1;
        if(!this.showRelease){
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
