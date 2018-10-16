/**
 * 今日榜单
 */
import React, {Component} from 'react'
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { ShowHotModules } from './Show'
import seeImg from '../../comm/res/see.png'

const HotItem = ({item, press}) => <TouchableOpacity style={styles.item} onPress={()=> press && press()}>
    <ImageBackground style={styles.imgBack} source={{uri: item.imgUrl}}>
        <View style={styles.row}>
            <Text style={styles.remark}>{item.remark}</Text>
            <View style={styles.right}>
                <Image source={seeImg}/>
                <Text style={styles.number}>{item.number}</Text>
            </View>
        </View>
    </ImageBackground>
</TouchableOpacity>

@observer
export default class ShowHotScrollView extends Component {

    constructor(props) {
        super(props)
        this.hotModule = new ShowHotModules()
        this.hotModule.loadHotList()
    }

    _hotItemAction(item) {
        // let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode)
        // let params = homeModule.paramsNavigate(item)
        // const {navigation} = this.props
        // navigation && navigation.navigate(router,  params)
    }

    render() {
        const { hotList } = this.hotModule
        let items = []
        hotList.map((item, index) => {
            items.push(<HotItem key={index} item={item} press={()=>this._hotItemAction(item)}/>)
        })
        return <View>
        {
            items.length > 0
            ?
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>热门</Text>
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
        height: px2dp(233)
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
    imgBack: {
        width: px2dp(280),
        height: px2dp(145),
        justifyContent: 'flex-end'
    },
    item: {
        width: px2dp(280),
        height: px2dp(140),
        borderRadius: px2dp(5),
        overflow: 'hidden',
        marginLeft: px2dp(10)
    },
    space: {
        width: px2dp(10)
    },
    row: {
        height: px2dp(30),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    remark: {
        color: '#f6f6f6',
        fontSize: px2dp(12)
    },
    number: {
        color: '#fff',
        fontSize: px2dp(10)
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})
