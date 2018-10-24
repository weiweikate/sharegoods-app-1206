/**
 * 秀场banner
 */
import React, {Component} from 'react'
import { View, Text } from 'react-native'
// import ScreenUtil from '../../utils/ScreenUtils'
// const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { ShowBannerModules } from './Show'
import XGSwiper from '../../components/ui/XGSwiper'
import ScreenUtils from '../../utils/ScreenUtils'

// const BannerItem = ({item}) => <View style={styles.item}>
//     <View style={styles.imgView}>
//         <Image style={styles.img} source={{uri:item.imgUrl}}/>
//     </View>
//     <Text style={styles.text} numberOfLines={1}>{item.remark}</Text>
// </View>

@observer
export default class ShowBannerView extends Component {

    constructor(props) {
        super(props)
        this.bannerModule = new ShowBannerModules()
        this.bannerModule.loadBannerList()
    }

    _onBannerAction(item) {
        // let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode)
        // const {navigation} = this.props
        // let params = homeModule.paramsNavigate(item)
        // navigation && navigation.navigate(router,  params)
    }

    renderRow(item) {
        console.log('renderRow', item)
        return <View style={{backgroundColor: '#f00', height: 150}}>
            <Text>1</Text>
        </View>
    }

    onPressRow(item) {
        const { navigation } = this.props
        navigation.navigate('show/ShowDetailPage', {id: item.id})
    }

    render() {
        const { bannerList } = this.bannerModule
        if (!bannerList) {
            return <View/>
        }
        return <View style={{width: ScreenUtils.width, height: 150}}>
            <XGSwiper style={{width: ScreenUtils.width, height: 150, backgroundColor: 'white'}}
                dataSource={['0', '1' ,'2','3']}
                width={ ScreenUtils.width }
                height={ 150 }
                renderRow={this.renderRow}
                ratio={0.867}
                onPress={this.onPressRow}
                />
            </View>
    }
}

// let styles = StyleSheet.create({
//     container: {
//         height: px2dp(230),
//         backgroundColor: '#fff',
//         marginTop: px2dp(10)
//     },
//     scroll: {
//         height: px2dp(175)
//     },
//     img: {
//         width: px2dp(300),
//         height: px2dp(140)
//     },
//     imgView: {
//         width: px2dp(280),
//         height: px2dp(140),
//         borderRadius: px2dp(5),
//         overflow: 'hidden',
//     },
//     item: {
//         width: px2dp(280),
//         height: px2dp(175),
//         marginLeft: px2dp(10)
//     },
//     space: {
//         width: px2dp(10)
//     },
//     text: {
//         color: '#666',
//         fontSize: px2dp(13),
//         marginTop: px2dp(10)
//     }
// })
