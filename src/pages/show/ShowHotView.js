/**
 * 精选热门
 */
import React, {Component} from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Waterfall from '../../components/ui/WaterFall'
import ShowBannerView from './ShowBannerView'
import ShowChoiceView from './ShowChoiceView'
import ShowHotScrollView from './ShowHotScrollView'
import {observer} from 'mobx-react'
import { ShowRecommendModules, tag } from './Show'
import ScreenUtils from '../../utils/ScreenUtils'
const {  px2dp } = ScreenUtils
import ItemView from './ShowHotItem'

const imgWidth = px2dp(168)

@observer
export default class ShowHotView extends Component {
    constructor(props) {
        super(props)
        this.recommendModules = new ShowRecommendModules()
    }
    componentDidMount() {
        this.recommendModules.loadRecommendList({generalize: tag.Recommend}).then(data => {
            this.waterfall.addItems(data)
        })
    }
    infiniting(done) {
        setTimeout(() => {
            this.recommendModules.getMoreRecommendList({generalize: tag.Recommend}).then(data => {
                this.waterfall.addItems(data)
            })
            done()
        }, 1000)
    }
    refreshing(done) {
        setTimeout(() => {
            done()
        }, 1000)
    }
    _gotoDetail() {
        const { navigation } = this.props
        navigation.navigate('show/ShowDetailPage')
    }
    renderItem = (data) => {
        let imgWide = data.imgWide ? data.imgWide : 1
        let imgHigh = data.imgHigh ? data.imgHigh : 1
        let imgHeight = (imgHigh / imgWide) * imgWidth
        return <ItemView imageStyle={{height: imgHeight}}  data={data} press={()=>{this._gotoDetail(data)}}/>
    }
    renderHeader = () => {
        return <View><ShowBannerView navigation={this.props.navigation}/>
        <ShowChoiceView navigation={this.props.navigation}/>
        <ShowHotScrollView navigation={this.props.navigation}/>
            <View style={styles.titleView}>
                <Text style={styles.recTitle}>推荐</Text>
            </View>
        </View>
    }
    _keyExtractor = (data) => data.id + ''
    render() {
        return(
            <View style={styles.container}>
                <Waterfall
                    space={10}
                    ref={(ref)=>{this.waterfall = ref}}
                    columns={2}
                    infinite={true}
                    hasMore={true}
                    renderItem={item => this.renderItem(item)}
                    // renderInfinite={loading => this.renderLoadMore(loading)}
                    renderHeader={()=>this.renderHeader()}
                    containerStyle={{marginLeft: 15, marginRight: 15}}
                    keyExtractor={(data) => this._keyExtractor(data)}
                    infiniting={(done)=>this.infiniting(done)}
                />
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    recTitle: {
        color: '#333',
        fontSize: px2dp(19),
        fontWeight: '600'
    }
})
