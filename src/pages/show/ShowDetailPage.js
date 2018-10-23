import React, {Component} from 'react'
import { StyleSheet, ScrollView, Image, TouchableOpacity, View, Text } from 'react-native'
import ShowImageView from './ShowImageView'
import backImg  from '../../comm/res/show_detail_back.png'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp, width } = ScreenUtils
import HTML from 'react-native-render-html'
// import showConnectedImg from '../../comm/res/show_connected.png'
import showConnectImg from '../../comm/res/show_connect.png'
import showGoodImg from '../../comm/res/show_good.png'
// import showDidGoodImg from '../../comm/res/show_did_good.png'
import seeImg from '../../comm/res/see.png'
import showShareImg from '../../comm/res/show_share.png'
import { ShowDetail } from './Show'
import {observer} from 'mobx-react'

const Goods = ({data}) => <View style={styles.goodsItem}>
    <Image style={styles.goodImg} source={{uri: data.imgUrl}}/>
    <View style={styles.goodDetail}>
        <Text style={styles.name}>{data.name}</Text>
        <View style={{height: px2dp(4)}}/>
        <Text style={styles.price}>￥ {data.price}</Text>
    </View>
</View>

@observer
export default class ShowDetailPage extends Component {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params || {};
        this.showDetailModule = new ShowDetail()
        this.showDetailModule.loadDetail(this.params.id)
    }
    _goBack() {
        const {navigation} = this.props
        navigation.goBack(null)
    }
    _goToGoodsPage() {
        const {navigation} = this.props
        navigation.push('show/ShowGoodsPage')
    }
    render() {
        const { detail } = this.showDetailModule
        console.log('ShowDetailPage', detail)
        if (!detail) {
            return <View/>
        }
        let content = `<div>${detail.content}</div>`
        let item = [{
            imgUrl: 'http://hellorfimg.zcool.cn/preview/441745972.jpg',
            name: 'OLAY隔离小白伞ProX都市护护颜隔离防晒露清爽防紫外线…',
            price: '1566'
        },{
            imgUrl: 'http://hellorfimg.zcool.cn/preview/441745972.jpg',
            name: 'OLAY隔离小白伞ProX都市护护颜隔离防晒露清爽防紫外线…',
            price: '1566'
        },{
            imgUrl: 'http://hellorfimg.zcool.cn/preview/441745972.jpg',
            name: 'OLAY隔离小白伞ProX都市护护颜隔离防晒露清爽防紫外线…',
            price: '1566'
        },{
            imgUrl: 'http://hellorfimg.zcool.cn/preview/441745972.jpg',
            name: 'OLAY隔离小白伞ProX都市护护颜隔离防晒露清爽防紫外线…',
            price: '1566'
        }]
        return <View style={styles.container}><ScrollView style={styles.container}>
            <ShowImageView/>
            <View style={styles.profileRow}>
                <View style={styles.profileLeft}>
                    <Image style={styles.portrait} source={{url: 'http://hellorfimg.zcool.cn/preview/441745972.jpg'}}/>
                    <Text style={styles.showName}>上课的</Text>
                </View>
                <View style={styles.profileRight}>
                    <Image source={seeImg}/>
                    <Text style={styles.number}>2334</Text>
                </View>
            </View>
            <HTML html={content} imagesMaxWidth={width} containerStyle={{backgroundColor: '#fff', marginLeft: px2dp(15), marginRight: px2dp(15)}}/>
            <View style={styles.goodsView}>
                {
                    item.map((value, index) => {
                        return <Goods key={index} data={value}/>
                    })
                }
            </View>
            <TouchableOpacity style={styles.backView} onPress={()=>this._goBack()}>
                <Image source={backImg}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareView} onPress={()=>{}}>
                <Image source={showShareImg}/>
            </TouchableOpacity>
        </ScrollView>
        <View style={styles.bottom}>
            <View style={styles.bottomBtn}>
            <Image style={styles.bottomGoodImg} source={showGoodImg}/>
            <Text style={styles.bottomText}>赞 · {detail.likeCount}</Text>
            </View>
            <View style={styles.line}/>
            <View style={styles.bottomBtn}>
            <Image style={styles.connectImg} source={showConnectImg}/>
            <Text style={styles.bottomText}>收藏 · {detail.collectCount}</Text>
            </View>
        </View>
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scroll: {
        flex: 1
    },
    bottom: {
        height: px2dp(50) + ScreenUtils.safeBottom,
        paddingBottom: ScreenUtils.safeBottom,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: ScreenUtils.onePixel,
        borderTopColor: '#ddd'
    },
    backView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: px2dp(50),
        height: px2dp(43) + ScreenUtils.statusBarHeight,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    shareView: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: px2dp(50),
        height: px2dp(43) + ScreenUtils.statusBarHeight,
        alignItems: 'flex-start',
        justifyContent: 'flex-end'
    },
    goodsItem: {
        height: px2dp(66),
        width: ScreenUtils.width - 2 * px2dp(15),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#eee',
        borderWidth: ScreenUtils.onePixel,
        borderRadius: px2dp(2),
        marginBottom: px2dp(10)
    },
    goodImg: {
        height: px2dp(66),
        width: px2dp(66),
    },
    goodDetail: {
        flex: 1,
        marginLeft: px2dp(9),
        marginRight: px2dp(9)
    },
    name: {
        fontSize: px2dp(13),
        color: '#333',
        fontWeight: '600'
    },
    price: {
        fontSize: px2dp(13),
        color: '#FF1A54',
    },
    goodsView: {
        marginTop: px2dp(17),
        marginRight: px2dp(15),
        marginLeft: px2dp(15),
        marginBottom: px2dp(20)
    },
    button: {
        backgroundColor: '#FF1A54',
        height: px2dp(32),
        width: px2dp(125),
        borderRadius: px2dp(16),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: px2dp(15)
    },
    buttonTitle: {
        color: '#fff',
        fontSize: px2dp(15)
    },
    bottomGoodImg: {
        
    },
    bottomText: {
        marginLeft: px2dp(8),
        color: '#333',
        fontSize: px2dp(11)
    },
    connectImg: {
        
    },
    profileRow: {
        height: px2dp(45),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    portrait: {
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: px2dp(15)
    },
    showName: {
        color: '#333',
        marginLeft: px2dp(5),
        fontSize: px2dp(11)
    },
    profileLeft: {
        flexDirection: 'row',
        marginLeft: px2dp(15),
        alignItems: 'center'
    },
    profileRight: {
        flexDirection: 'row',
        marginRight: px2dp(15),
        alignItems: 'center'
    },
    number: {
        color: '#333',
        fontSize: px2dp(11),
        marginLeft: px2dp(9)
    },
    bottomBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    line: {
        width: 1,
        height: px2dp(16),
        backgroundColor: '#eee'
    }
})
