/**
 * @author xzm
 * @date 2019/7/10
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import CommModal from '../../../comm/components/CommModal';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';

const { px2dp } = ScreenUtils;

export default class ImageOrVideoModal extends PureComponent {
    render() {
        return (
            <CommModal visible={this.props.visible}
                       onRequestClose={this.props.onRequestClose}>
                <View style={{ height: DesignRule.height }}>
                    <View style={{ flex: 1 }}/>
                    <View style={styles.wrapper}>
                        <TouchableWithoutFeedback onPress={this.props.selectImage}>
                            <View style={styles.itemWrapper}>
                                <MRText style={styles.textStyle}>
                                    照片
                                </MRText>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.line}/>
                        <TouchableWithoutFeedback onPress={this.props.selectVideo}>
                            <View style={styles.itemWrapper}>
                                <MRText style={styles.textStyle}>
                                    视频
                                </MRText>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
                        <View style={[styles.itemWrapper, { marginTop: 8, marginBottom: 10, borderRadius: px2dp(14) }]}>
                            <MRText style={[styles.textStyle,{color:'#FF3B30'}]}>
                                取消
                            </MRText>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </CommModal>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        borderRadius: px2dp(14),
        overflow: 'hidden',
        alignItems: 'center',
        backgroundColor: '#ffffffee'
    },
    itemWrapper: {
        height: px2dp(56),
        width: DesignRule.width - 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffffee'

    },
    textStyle: {
        color: '#007AFF',
        fontSize: 19,
        fontWeight: '600'
    },
    line: {
        width: DesignRule.width - 60,
        height: ScreenUtils.onePixel,
        backgroundColor: '#dedede'
    }
});
