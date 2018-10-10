/**
 * 首页轮播图
 */
import React, { Component } from 'react'
import { View , StyleSheet, Image} from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import {observer} from 'mobx-react';
import { BannerModules } from './Modules'
import ViewPager from '../../components/ui/ViewPager'

const bannerHeight = px2dp(220)

@observer
export default class HomeBannerView extends Component {
    constructor(props) {
        super(props)
        this.bannerModule = new BannerModules()
        this.bannerModule.loadBannerList()
    }
    renderViewPageItem = (item) => {
        return <Image
            source={{ uri: item }}
            style={styles.img}
            onPress={() => { }}
            resizeMode="cover" />
    };

    render() {
        const {bannerList} = this.bannerModule
        let items = []
        bannerList.map((value, index) => {
            items.push(value.imgUrl)
        })
        return <View>
            <ViewPager
                swiperShow={true}
                arrayData={items}
                renderItem={(item) => this.renderViewPageItem(item)}
                dotStyle={{
                    height: px2dp(5),
                    width: px2dp(5),
                    borderRadius: px2dp(5),
                    backgroundColor: '#ffffff',
                    opacity: 0.4
                }}
                activeDotStyle={{
                    height: px2dp(5),
                    width: px2dp(30),
                    borderRadius: px2dp(5),
                    backgroundColor: '#ffffff'
                }}
                autoplay={true}
                height={bannerHeight}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    img: {
        height: bannerHeight,
        width: ScreenUtils.width
    }
})
