/**
 * @author xzm
 * @date 2019/10/21
 */

import React from 'react';
import {
    View,
    Image,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';

import res from '../../../comm/res';

const {btn_close_white} = res.button
const {px2dp} = ScreenUtils;
export default function ActivityView(props) {
    const {source, onClose, onPress} = props;
    return (
        <TouchableWithoutFeedback onPress={()=>{
            onPress && onPress();
            onClose && onClose();
        }}>
            <View>
                <ImageLoader
                    style={styles.contain}
                    source={source}
                    borderRadius={px2dp(5)}>
                    <TouchableWithoutFeedback onPress={() => {
                        onClose && onClose();
                    }}>
                        <View style={styles.closeWrapper}>
                            <Image source={btn_close_white} style={styles.closeIcon}/>
                        </View>
                    </TouchableWithoutFeedback>
                </ImageLoader>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    contain: {
        width: px2dp(260),
        height: px2dp(310),
        borderRadius: px2dp(5)
    },
    closeWrapper: {
        position: 'absolute',
        top: px2dp(7),
        left: px2dp(7),
        width: px2dp(26),
        height: px2dp(26),
        borderRadius: px2dp(13),
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeIcon: {
        width: px2dp(11),
        height: px2dp(11)
    }
})
