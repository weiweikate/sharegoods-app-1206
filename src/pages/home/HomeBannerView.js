/**
 * 首页轮播图
 */
import React, { Component } from 'react'
import { View , StyleSheet, Image} from 'react-native'
import Swiper from 'react-native-swiper'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import {observer} from 'mobx-react';
import Modules from './Modules'
const { bannerModule } = Modules

const bannerHeight = px2dp(220)

class HomeBannerView extends Component {
    constructor(props) {
        super(props)
        const {loadBannerList} = this.props.bannerModule
        loadBannerList && loadBannerList()
    }
    render() {
        const {bannerList} = this.props.bannerModule
        let items = []
        bannerList.map((value, index) => {
            items.push(<Image key={index} style={styles.img} source={{uri:value }}/>)
        })
        return <View><Swiper dotStyle={{
            height: px2dp(5),
            width: px2dp(5),
            borderRadius: px2dp(5),
            backgroundColor: '#fff',
            opacity: 0.4
        }}
        activeDotStyle={{
            height: px2dp(5),
            width: px2dp(30),
            borderRadius: px2dp(5),
            backgroundColor: '#fff'
        }}
        autoplay={true}
        height={bannerHeight} showsButtons={false}>
            {items}
        </Swiper>
        </View>
    }
}

@observer
export default class HomeBanner extends Component {
    render () {
        return <HomeBannerView bannerModule={bannerModule} {...this.props}/>
    }
}

const styles = StyleSheet.create({
    img: {
        height: bannerHeight,
        width: ScreenUtils.width
    }
})
