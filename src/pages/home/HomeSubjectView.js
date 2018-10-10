import React, {Component} from 'react'
import {View, StyleSheet, Image} from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'

export default class HomeSubjectView extends Component {
    render() {
       return <View style={[styles.box, { paddingTop: 10, paddingBottom: 10 }]}>
        <View style={styles.featureBox}>
            <View style={[styles.featureBox1]}>
                <Image
                    source={{ uri: 'https://yanxuan.nosdn.127.net/b72c6486bc681f7b0dcb87d9af0ab1bb.png' }}
                    style={styles.featureBox1Image}/>
            </View>
            <View style={[styles.featureBox2]}>
                <Image
                    source={{ uri: 'https://yanxuan.nosdn.127.net/957c8d117473d103b52ff694f372a346.png' }}
                    style={styles.featureBox2Image}/>
            </View>
            <View style={[styles.featureBox3]}>
                <Image
                    source={{ uri: 'https://yanxuan.nosdn.127.net/e3bcfdff30c97ba87d510da8d9da5d09.png' }}
                    style={styles.featureBox2Image}/>
            </View>
        </View>
    </View>
    }
}

const styles = StyleSheet.create({
    featureBox: {
        position: 'relative',
        height: ScreenUtils.px2dp(200),
        marginLeft: ScreenUtils.px2dp(12),
        marginRight: ScreenUtils.px2dp(12)
    },
    featureBox1: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200)
    },
    featureBox1Image: {
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200),
        borderRadius: 5
    },
    featureBox2: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96)
    },
    featureBox2Image: {
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96),
        borderRadius: 5
    },
    featureBox3: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96)
    },

    // 行样式
    rowCell: {
        paddingLeft: 10,
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between'
    },
    eventRowsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 15
    }
});