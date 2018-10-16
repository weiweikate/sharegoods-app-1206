/**
 * 精选热门
 */
import React, {Component} from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Waterfall from '../../components/ui/WaterFall'
import ShowBannerView from './ShowBannerView'
import ShowChoiceView from './ShowChoiceView'
import ShowFindView from './ShowFindView'
import ShowHotScrollView from './ShowHotScrollView'

export default class ShowHotView extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        let data = [{
            duration: '123213',
            comment: 'sfhkjsdhfj ',
            width: 100,
            height: 300,
            id: 1,
            color: '#f00'
            },{
            duration: '123213',
            comment: 'sfhkjsdhfj ',
            width: 100,
            height: 100,
            id: 2,
            color: '#0f0'
            },{
            duration: '123213',
            comment: 'sfhkjsdhfj ',
            width: 100,
            height: 100,
            id: 3,
            color: '#00f'
        }]
        this.waterfall.addItems(data)
    }
    infiniting(done) {
        setTimeout(() => {
            // this.refs.addItems(this.state.list)
            done()
        }, 1000)
    }
    refreshing(done) {
        setTimeout(() => {
            done()
        }, 1000)
    }
    renderLoadMore(loading) {
        if (loading) {
            return (
            <Text>加载中...</Text>
            )
        } else {
            return (
            <Text>加载更多</Text>
            )
        }
    }
    renderItem = (item) => {
        console.log('item', item)
        // const itemHeight = this._getHeightForItem({item})
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => this._onPressContent(item)}
            style={{width:item.width, height: item.height, backgroundColor: item.color}}>
            <View>
              <Text style={{color: '#000'}}>{item.duration}</Text>
              <Text style={{color: '#000'}}>{item.comment}</Text>
            </View>
          </TouchableOpacity>
        )
    }
    renderHeader = () => {
        return <View><ShowBannerView/><ShowChoiceView/><ShowFindView/><ShowHotScrollView/></View>
    }
    render() {
        return(
            <View style={styles.container}>
                <Waterfall
                    space={15}
                    ref={(ref)=>{this.waterfall = ref}}
                    columns={2}
                    infinite={false}
                    renderItem={item => this.renderItem(item)}
                    renderInfinite={loading => this.renderLoadMore(loading)}
                    renderHeader={()=>this.renderHeader()}
                />
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },

})
