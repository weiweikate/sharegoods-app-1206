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
import {routePush} from '../../../navigation/RouterMap';

const {btn_close_white} = res.button
const {px2dp} = ScreenUtils;
export default function ActivityView(props) {
    const {source, onClose, target} = props;
    return (
        <TouchableWithoutFeedback onPress={()=>{
            routePush('HtmlPage', { uri: target });
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
        width: px2dp(235),
        height: px2dp(290),
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
