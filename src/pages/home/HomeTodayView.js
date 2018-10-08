/**
 * 今日榜单
 */
import React, {Component} from 'react'
import { View, ScrollView, StyleSheet, Text, Image } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import today1Img from './res/today1.png'
import today2Img from './res/today2.png'
import today3Img from './res/today3.png'

const TodayItem = ({img}) => <View style={styles.item}>
    <Image style={styles.img} source={img}/>
</View>

export default class HomeTodayView extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>今日榜单</Text>
            </View>
            <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                <TodayItem img={today1Img}/><TodayItem img={today2Img}/><TodayItem img={today3Img}/>
                <View style={styles.space}/>
            </ScrollView>
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(243),
        backgroundColor: '#fff'
    },
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#333',
        fontSize: px2dp(19),
        fontWeight: '600'
    },
    scroll: {
        height: px2dp(175)
    },
    img: {
        width: px2dp(300),
        height: px2dp(175)
    },
    item: {
        width: px2dp(300),
        height: px2dp(175),
        borderRadius: px2dp(5),
        overflow: 'hidden',
        marginLeft: px2dp(10)
    },
    space: {
        width: px2dp(10)
    }
})
