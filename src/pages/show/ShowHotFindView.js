/**
 * 热门发现
 */
import React, {Component} from 'react'
import { View, StyleSheet } from 'react-native'
import Waterfall from '../../components/ui/WaterFall'
import {observer} from 'mobx-react'
import { ShowRecommendModules } from './Show'
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
        let data = this.recommendModules.loadRecommendList()
        this.waterfall.addItems(data)
    }
    infiniting(done) {
        setTimeout(() => {
            let data = this.recommendModules.getMoreRecommendList()
            this.waterfall.addItems(data)
            done()
        }, 1000)
    }
    refreshing(done) {
        setTimeout(() => {
            done()
        }, 1000)
    }
    renderItem = (data) => {
        console.log('item', data)
        const {width, height} = data
        let imgHeight = (height / width) * imgWidth
        // const itemHeight = this._getHeightForItem({item})
        return <ItemView imageStyle={{height: imgHeight}}  data={data}/>
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
