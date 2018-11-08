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
import maskImg from '../../comm/res/show_mask.png'
import DesignRule from 'DesignRule';

const Card = ({item, press}) => <TouchableOpacity style={styles.card} onPress={()=> press && press()}>
    <ImageBackground style={styles.imgView} source={{uri:item.coverImg}} resizeMode={'cover'}>
        <Image style={styles.mask} source={maskImg} resizeMode={'cover'}/>
        <Text style={styles.dis} numberOfLines={2}>{item.pureContent ? item.pureContent.slice(0, 100).trim() : ''}</Text>
    </ImageBackground>
    <View style={styles.profileView}>
        <Image style={styles.portrait} source={{uri:item.userHeadImg ? item.userHeadImg : ''}}/>
        <Text style={styles.name}>{item.userName}</Text>
        <View style={{flex: 1}}/>
        <View style={styles.rightRow}>
            <Image source={seeImg}/>
            <Text style={styles.number}>{item.click ? item.click : 0}</Text>
        </View>
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
        const { navigation } = this.props
        navigation.navigate('show/ShowDetailPage', {id: item.id})
    }

    render() {
        const { choiceList } = this.choiceModule
        let items = []
        if (!choiceList) {
            return <View/>
        }
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
        marginLeft: px2dp(10),
        marginTop: px2dp(10),
        marginRight: px2dp(10),
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
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13),
        marginLeft: px2dp(10)
    },
    title: {
        color: DesignRule.textColor_mainTitle,
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
        height: px2dp(224),
        marginBottom: px2dp(10),
        backgroundColor: '#fff',
        borderRadius: px2dp(5)
    },
    dis: {
        marginLeft: px2dp(10),
        marginRight: px2dp(10),
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
        height: px2dp(53),
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
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(12),
        marginLeft: px2dp(10)
    },
    time: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(11)
    },
    mask: {
        position: 'absolute',
        width: px2dp(325),
        bottom: 0,
        height: px2dp(40)
    }
})
