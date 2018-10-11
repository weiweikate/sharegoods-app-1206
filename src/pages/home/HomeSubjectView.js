/**
 * 超值热卖
 */

import React, {Component} from 'react'
import {View , ScrollView, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtil
import {observer} from 'mobx-react'
import { subjectModule, homeModule } from './Modules'

const GoodItems = ({img, title, money}) => <View style={styles.goodsView}>
    <Image style={styles.goodImg} source={{uri:img}}/>
    <Text style={styles.goodsTitle} numberOfLines={2}>{title}</Text>
    <Text style={styles.money}>¥ {money}</Text>
</View>

const MoreItem = ({press}) => <TouchableOpacity style={styles.moreView} onPress={()=>{press && press()}}>
    <View style={styles.backView}>
        <Text style={styles.seeMore}>查看更多</Text>
        <View style={styles.line}/>
        <Text style={styles.seeMoreEn}>View More</Text>
    </View>
</TouchableOpacity>

const AcitivyItem = ({data, press}) => {
    const {imgUrl, topicBannerProductDTOList} = data
    let goodsItem = []
    topicBannerProductDTOList && topicBannerProductDTOList.map((value,index) => {
        goodsItem.push(<GoodItems key={index} title={value.productName} money={value.startPrice} img={value.specImg}/>)
    })
    return <View>
        <TouchableOpacity style={styles.bannerBox} onPress={()=>{press && press()}}>
            <View style={styles.bannerView}>
                <Image style={styles.banner} source={{url: imgUrl}}/>
            </View>
        </TouchableOpacity>
        <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
            {goodsItem}
            <MoreItem press={()=>{press && press()}}/>
            <View style={styles.space}/>
        </ScrollView>
    </View>
}

@observer
export default class HomeSubjectView extends Component {
    constructor(props) {
        super(props)
        subjectModule.loadSubjectList()
    }
    _subjectActions(item) {
        subjectModule.selectedSubjectAction(item)
        const { navigation } = this.props
        const router = homeModule.homeNavigate(item.linkType, item.linkTypeCode)
        navigation.navigate(router,  {linkTypeCode : item.linkTypeCode})
    }
    render() {
        const { subjectList } = subjectModule
        if (!subjectList) {
            return <View/>
        }
        if (subjectList.length <= 0) {
            return <View/>
        }
        let items = []
        subjectList.map((item, index) => {
            items.push(<AcitivyItem data={item} key={index} press={()=>this._subjectActions(item)}/>)
        })
        return <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>超值热卖</Text>
            </View>
            {items}
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: px2dp(10)
    },
    space: {
        width: px2dp(15)
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
    bannerBox: {
        height: px2dp(181),
        alignItems: 'center',
        justifyContent: 'center'
    },
    bannerView: {
        width: px2dp(345),
        height: px2dp(181),
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    banner: {
        width: px2dp(345),
        height: px2dp(181),
    },
    scroll: {
        height: px2dp(170),
        marginLeft: px2dp(17),
        marginTop: px2dp(5),
        marginBottom: px2dp(20)
    },
    goodsView: {
        width: px2dp(100),
        height: px2dp(170)
    },
    goodImg: {
        width: px2dp(100),
        height: px2dp(100)
    },
    goodsTitle: {
        color: '#666',
        fontSize: px2dp(12),
        marginTop: px2dp(8)
    },
    money: {
        color: '#D51234',
        fontSize: px2dp(14),
        marginTop: px2dp(8)
    },
    moreView: {
        width: px2dp(100),
        height: px2dp(170),
        alignItems: 'center',
        justifyContent: 'center'
    },
    backView: {
        backgroundColor: '#F7F7F7',
        width: px2dp(75),
        height: px2dp(75),
        borderRadius: px2dp(75) / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    seeMore: {
        color: '#666',
        fontSize: px2dp(11)
    },
    seeMoreEn: {
        color: '#666',
        fontSize: px2dp(9)
    },
    line: {
        height: onePixel,
        width: px2dp(43),
        backgroundColor: '#e3e3e3',
        margin: px2dp(2.5)
    }
})
