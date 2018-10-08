/**
 * 今日榜单
 */
import React, {Component} from 'react'
import { View, ScrollView, StyleSheet, Text, Image } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import Modules from './Modules'
const { todayModule } = Modules

const TodayItem = ({item}) => <View style={styles.item}>
    <Image style={styles.img} source={item.img}/>
</View>

class HomeTodayView extends Component {

    constructor(props) {
        super(props)
        const { today } = this.props
        const { loadTodayList } = today
        loadTodayList && loadTodayList()
    }

    render() {
        const { today } = this.props
        const { todayList } = today
        let items = []
        todayList.map((item, index) => {
            items.push(<TodayItem key={index} item={item}/>)
        })
        return <View>
        {
            items.length > 0
            ?
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>今日榜单</Text>
                </View>
                <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {items}
                    <View style={styles.space}/>
                </ScrollView>
            </View>
            :
            null
        }
        </View>
    }
}

@observer
export default class HomeToday extends Component {
    render () {
        return <HomeTodayView today={todayModule} {...this.props}/>
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
