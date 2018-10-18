/**
 * 秀场发现
 */
import React, {Component} from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { ShowFindModules } from './Show'
import seeImg from '../../comm/res/see_white.png'
import maskImg from '../../comm/res/show_mask.png'

const Card = ({item, press}) => <TouchableOpacity style={styles.card} onPress={()=> press && press()}>
    <ImageBackground style={styles.imgView} source={{uri:item.imgUrl}}>
        <Image style={styles.mask} source={maskImg} resizeMode={'cover'}/>
        <View style={styles.seeRow}>
            <Text style={styles.text} numberOfLines={1}>{item.remark}</Text>
            <Image source={seeImg}/>
            <Text style={styles.number}>{item.number}</Text>
        </View>
    </ImageBackground>
    <View style={styles.profileView}>
        <Image style={styles.portrait} source={{uri:item.portrait}}/>
        <View>
            <Text style={styles.name}>{item.name}</Text>
            <View style={{height: px2dp(8)}}/>
            <Text style={styles.time}>{item.time}</Text>
        </View>
    </View>
</TouchableOpacity>

@observer
export default class ShowChoiceView extends Component {

    constructor(props) {
        super(props)
        this.findModule = new ShowFindModules()
        this.findModule.loadFindList()
    }

    _onFindAction(item) {
        // let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode)
        // const {navigation} = this.props
        // let params = homeModule.paramsNavigate(item)
        // navigation && navigation.navigate(router,  params)
    }

    render() {
        const { findList } = this.findModule
        let items = []
        findList.map((item, index) => {
            items.push(<Card key={index} item={item} press={()=>this._onFindAction(item)}/>)
        })
        return <View>
        {
            items.length > 0
            ?
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>发现</Text>
                </View>
                <ScrollView
                    style={styles.scroll}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.space}/>
                    {items}
                </ScrollView>
            </View>
            :
            null
        }
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(285)
    },
    scroll: {
        height: px2dp(232)
    },
    img: {
        width: px2dp(300),
        height: px2dp(140)
    },
    imgView: {
        width: px2dp(133),
        height: px2dp(177),
        overflow: 'hidden',
        justifyContent: 'flex-end'
    },
    item: {
        width: px2dp(280),
        height: px2dp(175),
        marginLeft: px2dp(10)
    },
    space: {
        width: px2dp(15)
    },
    text: {
        color: '#fff',
        fontSize: px2dp(11),
        flex: 1
    },
    title: {
        color: '#333',
        fontSize: px2dp(19)
    },
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        marginRight: px2dp(15),
        height: px2dp(232),
        width: px2dp(133),
        backgroundColor: '#fff',
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    dis: {
        marginLeft: px2dp(10),
        marginBottom: px2dp(5),
        color: '#fff',
        fontSize: px2dp(11)
    },
    seeRow: {
        flexDirection: 'row',
        height: px2dp(40),
        width: px2dp(133),
        alignItems: 'flex-end',
        paddingBottom: px2dp(9),
        paddingRight: px2dp(5),
        paddingLeft: px2dp(5)
    },
    number: {
        color: '#fff',
        fontSize: px2dp(10),
        marginLeft: px2dp(4)
    },
    rightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: px2dp(50)
    },
    profileView: {
        height: px2dp(60),
        flexDirection: 'row',
        alignItems: 'center'
    },
    portrait: {
        marginLeft: px2dp(10),
        width: px2dp(30),
        height: px2dp(30),
        marginRight: px2dp(10),
        borderRadius: px2dp(15)
    },
    name: {
        color: '#333',
        fontSize: px2dp(12)
    },
    time: {
        color: '#666',
        fontSize: px2dp(11)
    },
    mask: {
        position: 'absolute',
        width: px2dp(133),
        bottom: 0,
        height: px2dp(40)
    }
})
