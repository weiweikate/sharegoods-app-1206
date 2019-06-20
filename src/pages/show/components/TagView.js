/**
 * @author xzm
 * @date 2019/6/18
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Image,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { MRText } from '../../../components/ui';
import res from '../res';


const { px2dp } = ScreenUtils;
const { tagDelete } = res;

import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';

export default class TagView extends PureComponent {
    render() {
        let text = `#${this.props.text}`;
        return (
            <TouchableWithoutFeedback
                disabled={!this.props.canDelete}
                onPress={() => {
                    this.props.onPress && this.props.onPress();
                }}
            >
                <View style={[styles.wrapper, this.props.style, { height: px2dp(24), borderRadius: px2dp(12) }]}>
                    <LinearGradient colors={['#FC5D39', '#FF0050']}
                                    start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                                    style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}/>
                    <MRText style={{ color: DesignRule.white, fontSize: DesignRule.fontSize_24 }}>
                        {text}
                    </MRText>
                    {this.props.canDelete ? <Image source={tagDelete} style={styles.deleteIcon}/> : null}
                </View>
            </TouchableWithoutFeedback>

        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px2dp(6),
        overflow: 'hidden'
    },
    text: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_bigBtnText
    },
    deleteIcon: {
        width: px2dp(10),
        height: px2dp(10),
        marginLeft: px2dp(3)
    }

});


