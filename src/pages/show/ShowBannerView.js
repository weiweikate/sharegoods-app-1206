/**
 * 秀场banner
 */
import React, {Component} from 'react'
import { View, Image, StyleSheet } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { ShowBannerModules } from './Show'
import XGSwiper from '../../components/ui/XGSwiper'
import ScreenUtils from '../../utils/ScreenUtils'

@observer
export default class ShowBannerView extends Component {

    state = {
        index: 0
    }

    constructor(props) {
        super(props)
        this.bannerModule = new ShowBannerModules()
        this.bannerModule.loadBannerList()
    }

    renderRow(item) {
        return <View style={styles.imgView}>
            <Image style={styles.img} source={{uri: item.imgUrl}}/>
        </View>
    }

    onPressRow(item) {
        const router = this.bannerModule.bannerNavigate(item.linkType, item.linkTypeCode);
        let params = this.bannerModule.paramsNavigate(item);
        const { navigation } = this.props;
        navigation.navigate(router, params);
    }

    onDidChange(item, index) {
        this.setState({index: index})
    }

    renderIndexView() {
        const { index } = this.state
        const { bannerCount } = this.bannerModule
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

    render() {
        const { bannerList } = this.bannerModule
        if (!bannerList || bannerList.length <= 0) {
            return <View/>
        }
        return <View><View style={styles.swiper}>
            <XGSwiper style={styles.swiper}
                dataSource={bannerList}
                width={ ScreenUtils.width }
                height={ px2dp(150) }
                renderRow={this.renderRow.bind(this)}
                ratio={0.867}
                onPress={this.onPressRow.bind(this)}
                onDidChange={this.onDidChange.bind(this)}
                />
            </View>
            {this.renderIndexView()}
            </View>
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(230),
        marginTop: px2dp(10),
        width: ScreenUtils.width
    },
    scroll: {
        height: px2dp(175)
    },
    swiper: {
        width: ScreenUtils.width,
        height: px2dp(175)
    },
    img: {
        width: ScreenUtil.width - px2dp(50),
        height: px2dp(175),
        justifyContent: 'flex-end'
    },
    imgView: {
        height: px2dp(175),
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
        color: '#fff',
        fontSize: px2dp(14)
    },
    mask: {
        position: 'absolute',
        width: ScreenUtil.width - 50,
        bottom: 0,
        height: px2dp(40)
    },
    textView: {
        width: ScreenUtil.width - 50,
        height: px2dp(40),
        alignItems: 'center',
        justifyContent: 'center'
    },
    indexView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activityIndex : {
        width: 14,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#A9B4BC',
        margin: 3
    },
    index: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#DDE1E4',
        margin: 3
    }
})
