/**
 * 超值热卖
 */

import React, {Component} from 'react'
import {View , ScrollView, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtil
import {observer} from 'mobx-react'
import { SubjectModule, homeModule } from './Modules'

const GoodItems = ({img, title, money, press}) => <TouchableOpacity style={styles.goodsView} onPress={()=>{press && press()}}>
    <Image style={styles.goodImg} source={{uri:img ? img : ''}}/>
    <Text style={styles.goodsTitle} numberOfLines={2}>{title}</Text>
    <Text style={styles.money}>¥ {money}</Text>
</TouchableOpacity>

const MoreItem = ({press}) => <TouchableOpacity style={styles.moreView} onPress={()=>{press && press()}}>
    <View style={styles.backView}>
        <Text style={styles.seeMore}>查看更多</Text>
        <View style={styles.line}/>
        <Text style={styles.seeMoreEn}>View More</Text>
    </View>
</TouchableOpacity>

const ActivityItem = ({data, press, goodsPress}) => {
    const {imgUrl, topicBannerProductDTOList} = data
    console.log('ActivityItem', imgUrl)
    let goodsItem = []
    topicBannerProductDTOList && topicBannerProductDTOList.map((value,index) => {
        if (index >= 8) {
            return
        }
        goodsItem.push(
        <GoodItems
            key={index}
            title={value.productName}
            money={value.originalPrice ? value.originalPrice : 0}
            img={value.specImg ? value.specImg : ''}
            press={()=>{goodsPress && goodsPress(value)}}
            />
        )
    })
    return <View>
        <TouchableOpacity style={styles.bannerBox} onPress={()=>{press && press()}}>
            <View style={styles.bannerView}>
                <Image style={styles.banner} source={{uri: imgUrl ? imgUrl : ''}} resizeMode={'cover'}/>
            </View>
        </TouchableOpacity>
        {
            topicBannerProductDTOList && topicBannerProductDTOList.length > 0
            ?
            <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
            {goodsItem}
                {
                    topicBannerProductDTOList.length >= 8 ?  <MoreItem press={()=>{press && press()}}/> : null
                }
                <View style={styles.space}/>
            </ScrollView>
            :
            <View style={{height: px2dp(20)}}/>
        }
    </View>
}

@observer
export default class HomeSubjectView extends Component {
    constructor(props) {
        super(props)
        this.subjectModule = new SubjectModule()
        this.subjectModule.loadSubjectList()
    }
    _subjectActions(item) {
        const { navigation } = this.props
        let params = homeModule.paramsNavigate(item)
        const router = homeModule.homeNavigate(item.linkType, item.linkTypeCode)
        navigation.navigate(router,  params)
    }
    _goodAction(good) {
        const { navigation } = this.props
        console.log('_goodAction', good.productId)
        navigation.navigate('home/product/ProductDetailPage', {productId: good.productId })
    }
    render() {
        const { subjectList } = this.subjectModule
        if (!subjectList) {
            return <View/>
        }
        if (subjectList.length <= 0) {
            return <View/>
        }
        let items = []
        subjectList.map((item, index) => {
            items.push(<ActivityItem data={item} key={index} press={()=>this._subjectActions(item)} goodsPress={(good)=>{this._goodAction(good)}}/>)
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
        height: px2dp(170),
        marginRight: px2dp(10)
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
