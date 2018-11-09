/**
 * 首页轮播图
 */
import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils;
import { observer } from 'mobx-react';
import { bannerModule, homeModule } from './Modules'
// import ViewPager from '../../components/ui/ViewPager'
const bannerHeight = px2dp(230)
import MRBannerViewMode from '../../components/ui/bannerView/MRBannerViewMode'

@observer
export default class HomeBannerView extends Component {
    state = {
        index : 0
    }
    _renderViewPageItem(item) {
        return <TouchableOpacity onPress={()=>this._onPressRow(item)}><Image style={styles.img} source={{uri: item}}/></TouchableOpacity>
    }
    _renderPagination = (index, total) => {
        const { bannerCount } = bannerModule
        let items = []
        for (let i = 0; i < bannerCount; i++) {
            if (index === i) {
                items.push(<View key={i} style={styles.activityIndex}/>)
            } else {
                items.push(<View key={i} style={styles.index}/>)
            }
        }
        return  <View style={styles.indexView}>
            {items}
        </View>
    }
    _onPressRow = (item) => {
        const { bannerCount, bannerList } = bannerModule
        let data = null
        for (let i = 0; i < bannerCount; i++) {
            if (bannerList[i].imgUrl === item) {
                data = bannerList[i]
                break
            }
        }
        const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        let params = homeModule.paramsNavigate(data);
        const { navigation } = this.props;
        navigation.navigate(router, params);
    }
    render() {
        const { bannerList } = bannerModule;
        if (bannerList.length === 0) {
            return null;
        }

        let items = []
        bannerList.map(value => {
            items.push(value.imgUrl)
        })

        return <View>
             {/*<ViewPager*/}
                {/*swiperShow={true}*/}
                {/*arrayData={items}*/}
                {/*renderItem={this._renderViewPageItem.bind(this)}*/}
                {/*autoplay={true}*/}
                {/*loop={false}*/}
                {/*height={bannerHeight}*/}
                {/*renderPagination={this._renderPagination.bind(this)}*/}
                {/*index={0}*/}
                {/*scrollsToTop={true}*/}
            {/*/>*/}
            <MRBannerViewMode imgUrlArray={items} bannerHeight={bannerHeight} modeStyle={1} onDidSelectItemAtIndex={(index)=>{alert(index)}}/>
        </View>
    }
}

const styles = StyleSheet.create({
    img: {
        height: bannerHeight,
        width: ScreenUtils.width
    },
    indexView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: ScreenUtils.width,
        height: px2dp(15)
    },
    activityIndex: {
        width: px2dp(24),
        height: px2dp(6),
        borderRadius: px2dp(3),
        backgroundColor: '#fff',
        marginLeft: px2dp(2.5),
        marginRight: px2dp(2.5)
    },
    index: {
        width: px2dp(6),
        height: px2dp(6),
        borderRadius: px2dp(3),
        backgroundColor: '#f4f4f4',
        marginLeft: px2dp(2.5),
        marginRight: px2dp(2.5)
    }
});
