import React, {Component} from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtils
import { homeModule } from './Modules'
import DesignRule from 'DesignRule'
import UIImage from "@mr/image-placeholder";

const Goods = ({goods, press}) => <TouchableWithoutFeedback onPress={()=> press && press()}>
    <View style={styles.container}>
    <View style={styles.image}>
        <UIImage style={styles.image} source={{uri: goods.imgUrl ? goods.imgUrl : ''}}/>
        <View style={styles.titleView}>
            <Text style={styles.title} numberOfLines={1} allowFontScaling={false}>{goods.title}</Text>
        </View>
    </View>
    <Text style={styles.dis} numberOfLines={2} allowFontScaling={false}>{goods.name}</Text>
    <View style={{flex: 1}}/>
    <Text style={styles.money} allowFontScaling={false}>¥ {goods.price} 起</Text>
    </View>
</TouchableWithoutFeedback>

export default class GoodsCell extends Component {
    _goodsAction(data) {
        let route = homeModule.homeNavigate(data.linkType, data.linkTypeCode)
        const { navigate } = this.props
        let params = homeModule.paramsNavigate(data)
        navigate(route,  params)
    }
    render() {
        const {data} = this.props
        if (!data) {
            return <View/>
        }
        return <View style={styles.cell}>
        {
            data[0]
            ?
            <Goods goods={data[0]} press={()=> this._goodsAction(data[0])}/>
            :
            null
        }
        <View style={styles.space}/>
        {
            data[1]
            ?
            <Goods goods={data[1]} press={()=> this._goodsAction(data[1])}/>
            :
            <View style={styles.uncontainer}/>
        }
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(267),
        width: px2dp(172),
        backgroundColor: '#fff',
        borderRadius: px2dp(5),
        borderColor: '#EDEDED',
        borderWidth: onePixel,
        overflow: 'hidden'
    },
    uncontainer: {
        height: px2dp(267),
        width: px2dp(172)
    },
    image: {
        height: px2dp(172),
        width: px2dp(172)
    },
    titleView: {
        height: px2dp(25),
        backgroundColor: '#F0F0F0',
        opacity: 0.75,
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dis: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(12),
        marginTop: px2dp(20),
        marginLeft: px2dp(7),
        marginRight: px2dp(7)
    },
    title: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(12),
        marginLeft: px2dp(5),
        marginRight: px2dp(5)
    },
    money: {
        color: DesignRule.mainColor,
        fontSize: px2dp(14),
        marginBottom: 15,
        marginLeft: px2dp(7)
    },
    cell: {
        height: px2dp(273),
        flexDirection: 'row',
        marginRight: px2dp(15),
        marginLeft: px2dp(15),
        alignItems: 'center',
        justifyContent: 'center'
    },
    space: {
        width: px2dp(5)
    }
})
