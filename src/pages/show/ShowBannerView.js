/**
 * 秀场banner
 */
import React, {Component} from 'react'
import { View, Image, StyleSheet, Platform } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { ShowBannerModules } from './Show'
import ScreenUtils from '../../utils/ScreenUtils'
import MRBannerView from '../../components/ui/bannerView/MRBannerView'
import XGSwiper from '../../components/ui/XGSwiper'
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

    _onPressRowWithItem(item) {
        const router = this.bannerModule.bannerNavigate(item.linkType, item.linkTypeCode);
        let params = this.bannerModule.paramsNavigate(item);
        const { navigation } = this.props;
        navigation.navigate(router, params);
    }

    _onPressRow(e) {
        let index = e.nativeEvent.index
        const { bannerList } = this.bannerModule
        let item = bannerList[index]
        const router = this.bannerModule.bannerNavigate(item.linkType, item.linkTypeCode);
        let params = this.bannerModule.paramsNavigate(item);
        const { navigation } = this.props;
        navigation.navigate(router, params);
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

    _onDidScrollToIndex(e) {
        this.setState({index:  e.nativeEvent.index})
    }

    _onDidChange(item, changeIndex) {
        const {index} = this.state
        if (index !== changeIndex) {
            this.setState({index: changeIndex})
        }
    }

    render() {
        const { bannerList } = this.bannerModule
        if (!bannerList || bannerList.length <= 0) {
            return <View/>
        }
        let items = []
        bannerList.map(value => {
            items.push(value.imgUrl)
        })
        return <View style={styles.container}><View style={styles.swiper}>
        {
            Platform.OS === 'ios'
            ?
            <MRBannerView
                style={[{ height: px2dp(175), width: ScreenUtils.width }]}
                imgUrlArray={items}
                itemWidth={px2dp(300)}
                itemSpace={px2dp(10)}
                itemRadius={5}
                onDidSelectItemAtIndex={(index)=>{this._onPressRow(index)}}
                onDidScrollToIndex={(index)=>{this._onDidScrollToIndex(index)}}
                />
            :
            <XGSwiper style={styles.swiper}
                dataSource={bannerList}
                width={ ScreenUtils.width }
                height={ px2dp(175) }
                renderRow={this.renderRow.bind(this)}
                ratio={0.867}
                onPress={this._onPressRowWithItem.bind(this)}
                onDidChange={this._onDidChange.bind(this)}/>
        }
            </View>
            {this.renderIndexView()}
            </View>
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(200),
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
        alignItems: 'center',
        marginTop: px2dp(10)
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
