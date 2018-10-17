/**
 * 精选热门
 */
import React, {Component} from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Image } from 'react-native'
import Waterfall from '../../components/ui/WaterFall'
import ShowBannerView from './ShowBannerView'
import ShowChoiceView from './ShowChoiceView'
import ShowFindView from './ShowFindView'
import ShowHotScrollView from './ShowHotScrollView'
import {observer} from 'mobx-react'
import { ShowRecommendModules } from './Show'
import ScreenUtils from '../../utils/ScreenUtils'
const {  px2dp } = ScreenUtils
import seeImg from '../../comm/res/see.png'

const imgWidth = px2dp(168)

const ItemView = ({data, press, imageStyle}) => <TouchableOpacity style={styles.item} onPress={()=>{press && press()}}>
    <ImageBackground style={[styles.img, imageStyle]} source={{uri: data.imgUrl}}>
        <View style={styles.numberView}>
            <Image style={styles.seeImg} source={seeImg}/>
            <Text style={styles.number}>{data.number}</Text>
        </View>
    </ImageBackground>
    <View style={styles.profile}>
        <Text numberOfLines={2} style={styles.title}>{data.remark}</Text>
        <View style={styles.row}>
            <Image style={styles.portrait} source={{uri:data.portrait}}/>
            <Text style={styles.name}>{data.name}</Text>
            <View style={{flex: 1}}/>
            <Text style={styles.time}>{data.time}</Text>
        </View>
    </View>
</TouchableOpacity>

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
    renderItem = (data) => {
        console.log('item', data)
        const {width, height} = data
        let imgHeight = (height / width) * imgWidth
        // const itemHeight = this._getHeightForItem({item})
        return <ItemView imageStyle={{height: imgHeight}}  data={data}/>
    }
    renderHeader = () => {
        return <View><ShowBannerView/><ShowChoiceView/><ShowFindView/><ShowHotScrollView/>
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
                    infinite={false}
                    renderItem={item => this.renderItem(item)}
                    renderInfinite={loading => this.renderLoadMore(loading)}
                    renderHeader={()=>this.renderHeader()}
                    containerStyle={{marginLeft: 15, marginRight: 15}}
                    keyExtractor={(data) => this._keyExtractor(data)}
                />
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: px2dp(5),
        overflow: 'hidden',
        width: px2dp(168),
        marginBottom: px2dp(10)
    },
    img: {
        width: px2dp(168),
        height: px2dp(170),
        justifyContent: 'flex-end'
    },
    dis: {
        height: px2dp(88),
        backgroundColor: '#fff'
    },
    numberView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(30)
    },
    profile: {
        height: px2dp(90),
        padding : px2dp(10)
    },
    title: {
        color: '#666',
        fontSize: px2dp(12)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(53)
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
    },
    seeImg: {
        marginLeft: px2dp(10)
    },
    number: {
        marginLeft: px2dp(10),
        fontSize: px2dp(10),
        color: '#fff'
    },
    portrait: {
        width: px2dp(30),
        height : px2dp(30),
        borderRadius: px2dp(15)
    },
    name: {
        color: '#333',
        fontSize: px2dp(11),
        marginLeft: 5
    },
    time: {
        color: '#939393',
        fontSize: px2dp(11),
        marginRight: px2dp(10)
    }
})
