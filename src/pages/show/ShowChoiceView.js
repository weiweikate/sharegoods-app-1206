/**
 * 秀场精选
 */
import React, {Component} from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { ShowChoiceModules } from './Show'
import seeImg from '../../comm/res/see.png'

const Card = ({item, press}) => <TouchableOpacity style={styles.card} onPress={()=> press && press()}>
    <ImageBackground style={styles.imgView} source={{uri:item.imgUrl}}>
        <Text style={styles.dis}>氨基酸洗面奶，30秒自动起泡清洁力强不伤脸，不含角质合痘痘肌和敏感肌，涂抹在手上等...</Text>
    </ImageBackground>
    <View style={styles.seeRow}>
        <Text style={styles.text} numberOfLines={1}>{item.remark}</Text>
        <View style={styles.rightRow}>
            <Image source={seeImg}/>
            <Text style={styles.number}>{item.number}</Text>
        </View>
    </View>
    <View style={styles.profileView}>
        <Image style={styles.portrait} source={{uri:item.portrait}}/>
        <Text style={styles.name}>{item.name}</Text>
        <View style={{flex: 1}}/>
        <Text style={styles.time}>{item.time}</Text>
    </View>
</TouchableOpacity>

@observer
export default class ShowChoiceView extends Component {

    constructor(props) {
        super(props)
        this.choiceModule = new ShowChoiceModules()
        this.choiceModule.loadChoiceList()
    }

    _onChoiceAction(item) {
        // let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode)
        // const {navigation} = this.props
        // let params = homeModule.paramsNavigate(item)
        // navigation && navigation.navigate(router,  params)
    }

    render() {
        const { choiceList } = this.choiceModule
        let items = []
        choiceList.map((item, index) => {
            items.push(<Card key={index} item={item} press={()=>this._onChoiceAction(item)}/>)
        })
        return <View>
        {
            items.length > 0
            ?
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>精选</Text>
                </View>
                {items}
            </View>
            :
            null
        }
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        marginTop: px2dp(10)
    },
    scroll: {
        height: px2dp(175)
    },
    img: {
        width: px2dp(300),
        height: px2dp(140)
    },
    imgView: {
        width: px2dp(325),
        height: px2dp(163),
        borderRadius: px2dp(5),
        overflow: 'hidden',
        margin: px2dp(10),
        justifyContent: 'flex-end'
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
        color: '#666',
        fontSize: px2dp(13),
        marginLeft: px2dp(10)
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
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        height: px2dp(254),
        marginBottom: px2dp(10),
        backgroundColor: '#fff'
    },
    dis: {
        marginLeft: px2dp(10),
        marginBottom: px2dp(5),
        color: '#fff',
        fontSize: px2dp(11)
    },
    seeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    number: {
        color: '#808080',
        fontSize: px2dp(10),
        marginLeft: px2dp(5)
    },
    rightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: px2dp(10)
    },
    profileView: {
        height: px2dp(60),
        flexDirection: 'row',
        alignItems: 'center'
    },
    portrait: {
        marginLeft: px2dp(14),
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: px2dp(15)
    },
    name: {
        color: '#333',
        fontSize: px2dp(12),
        marginLeft: px2dp(10)
    },
    time: {
        color: '#666',
        fontSize: px2dp(11)
    }
})
