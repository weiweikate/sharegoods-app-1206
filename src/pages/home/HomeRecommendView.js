/**
 * 精品推荐
 */
import React, {Component} from 'react'
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import {RecommendModule, homeModule} from './Modules'

const RecommendItem = ({item, press}) => <TouchableOpacity style={styles.item} onPress={()=> press && press()}>
    <View style={styles.imgView}>
        <Image style={styles.img}  source={{uri:item.imgUrl}}/>
    </View>
    <Text style={styles.text} numberOfLines={1}>{item.remark}</Text>
</TouchableOpacity>

@observer
export default class HomeRecommendView extends Component {

    constructor(props) {
        super(props)
        this.recommendModule = new RecommendModule()
        this.recommendModule.loadRecommendList()
    }

    _onRecommendAction(item) {
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode)
        const {navigation} = this.props
        let params = homeModule.paramsNavigate(item)
        navigation && navigation.navigate(router,  params)
    }

    render() {
        const { recommendList } = this.recommendModule
        let items = []
        recommendList.map((item, index) => {
            items.push(<RecommendItem key={index} item={item} press={()=>this._onRecommendAction(item)}/>)
        })
        return <View>
        {
            items.length > 0
            ?
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>精品推荐</Text>
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
        height: px2dp(230),
        backgroundColor: '#fff',
        marginTop: px2dp(10)
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
        width: px2dp(280),
        height: px2dp(140)
    },
    imgView: {
        width: px2dp(280),
        height: px2dp(140),
        borderRadius: px2dp(5),
        overflow: 'hidden',
    },
    item: {
        width: px2dp(280),
        height: px2dp(175),
        marginLeft: px2dp(10)
    },
    space: {
        width: px2dp(10)
    },
    text: {
        color: '#666',
        fontSize: px2dp(13),
        marginTop: px2dp(10)
    }
})
