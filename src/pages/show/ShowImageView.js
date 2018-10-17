import React, {Component} from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
const { width, px2dp } = ScreenUtils
const imageHeight = width
import ViewPager from '../../components/ui/ViewPager'

const renderPagination = (index, total) => <View style={styles.indexView}>
    <Text style={styles.text}>{index + 1} / {total}</Text>
</View>   

export default class ShowImageView extends Component {

    state = {
        pageIndex: 0,
        total: 2
    }

    _renderViewPageItem(item) {
        return <Image style={styles.image} source={{uri: item}}/>
    }
    render() {
        let items = [
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539754888357&di=e52675f86a6d03e6bb591d5e68482e12&imgtype=0&src=http%3A%2F%2Fshihuo.hupucdn.com%2Fucditor%2F20180902%2F800x800_0bcf380510a1d6652d4fbd0ce31deb82.jpeg',
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=412515265,3749340971&fm=26&gp=0.jpg'
        ]
        return <View style={styles.wrapper}>
            <ViewPager
                swiperShow={true}
                arrayData={items}
                renderItem={this._renderViewPageItem.bind(this)}
                autoplay={true}
                height={imageHeight}
                renderPagination={renderPagination}
                index={0}
            />
        </View>
    }
}

let styles = StyleSheet.create({
    wrapper: {
        width: width,
        height: imageHeight
    },
    image: {
        width: width,
        height: imageHeight
    },
    indexView: {
        width: px2dp(43),
        height: px2dp(20),
        borderRadius: px2dp(10),
        position: 'absolute',
        right: px2dp(14),
        bottom: px2dp(20),
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#fff',
        fontSize: px2dp(10)
    }
})
