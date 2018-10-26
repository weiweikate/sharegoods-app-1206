/**
 * 热门发现item
 */

import React from 'react'
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
const {  px2dp } = ScreenUtils
import seeImg from '../../comm/res/see_white.png'
import maskImg from '../../comm/res/show_mask.png'

export default ({data, press, imageStyle}) => <TouchableOpacity style={styles.item} onPress={()=>{press && press()}}>
    <ImageBackground style={[styles.img, imageStyle]} source={{uri: data.img}}>
        <Image style={styles.mask} source={maskImg} resizeMode={'cover'}/>
        <View style={styles.numberView}>
            <Image style={styles.seeImg} source={seeImg}/>
            <Text style={styles.number}>{data.click ? data.click : 0}</Text>
        </View>
    </ImageBackground>
    <View style={styles.profile}>
        <Text numberOfLines={2} style={styles.title}>{data.title}</Text>
        <View style={styles.row}>
            <Image style={styles.portrait} source={{uri:data.userHeadImg ? data.userHeadImg : ''}}/>
            <Text style={styles.name}>{data.userName}</Text>
            <View style={{flex: 1}}/>
            <Text style={styles.time}>{data.time}</Text>
        </View>
    </View>
</TouchableOpacity>

let styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        borderRadius: px2dp(5),
        overflow: 'hidden',
        width: px2dp(168),
        marginBottom: px2dp(10)
    },
    img: {
        width: px2dp(168),
        height: px2dp(170),
        justifyContent: 'flex-end'
    },
    numberView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(30)
    },
    profile: {
        height: px2dp(90),
        padding : px2dp(10)
    },
    title: {
        color: '#666',
        fontSize: px2dp(12)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(53)
    },
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    seeImg: {
        marginLeft: px2dp(10)
    },
    number: {
        marginLeft: px2dp(10),
        fontSize: px2dp(10),
        color: '#fff'
    },
    portrait: {
        width: px2dp(30),
        height : px2dp(30),
        borderRadius: px2dp(15)
    },
    name: {
        color: '#333',
        fontSize: px2dp(11),
        marginLeft: 5
    },
    time: {
        color: '#939393',
        fontSize: px2dp(11),
        marginRight: px2dp(10)
    },
    mask: {
        position: 'absolute',
        width: px2dp(168),
        bottom: 0,
        height: px2dp(30)
    }
})
