/**
 * 今日榜单
 */
import React, {Component} from 'react'
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { TodayModule, homeModule } from './Modules'

const TodayItem = ({item, press}) => <TouchableOpacity style={styles.item} onPress={()=> press && press()}>
    <Image style={styles.img} source={{uri: item.imgUrl}}/>
</TouchableOpacity>

@observer
export default class HomeTodayView extends Component {

    constructor(props) {
        super(props)
        this.todayModule = new TodayModule()
        this.todayModule.loadTodayList()
    }

    _todayItemAction(item) {
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode)
        const {navigation} = this.props
        navigation && navigation.navigate(router,  {linkTypeCode : item.linkTypeCode})
    }

    render() {
        const { todayList } = this.todayModule
        let items = []
        todayList.map((item, index) => {
            items.push(<TodayItem key={index} item={item} press={()=>this._todayItemAction(item)}/>)
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
