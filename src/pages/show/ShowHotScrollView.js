/**
 * 今日榜单
 */
import React, {Component} from 'react'
import { View, ScrollView, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { showHotModules } from './Show'
import res from './res';
const seeImg = res.button.see;
const maskImg = res.other.show_mask;
import DesignRule from 'DesignRule';
import ImageLoad from '@mr/image-placeholder'
import TimerMixin from 'react-timer-mixin'
import {
    MRText as Text,
} from '../../components/ui';

class HotItem extends Component {
    state = {
        readNumber: 0
    }

    componentWillMount() {
        const { item } = this.props
        this.setState({readNumber: item.click ? item.click : 0})
    }

    _onSelectedItem() {
        const { press } = this.props
        press && press()
        TimerMixin.setTimeout(() => {
            const { readNumber } = this.state
            this.setState({readNumber: readNumber + 1})
        }, 800)
    }

    render() {
        const {item} = this.props
        const { readNumber } = this.state
        let number = readNumber
        if (!number) {
            number = 0
        }
        if (number > 999999) {
            number = 999999 + '+'
        }
        return <TouchableWithoutFeedback onPress={()=> {this._onSelectedItem()}}>
        <View style={styles.item}>
        <ImageLoad style={styles.imgBack} source={{uri: item.coverImg}}>
            <Image style={styles.mask} source={maskImg} resizeMode={'cover'}/>
            <View style={styles.row}>
                <Text style={styles.remark} numberOfLines={1}>{item.pureContent ? item.pureContent.slice(0, 30).trim() : ''}</Text>
                <View style={styles.right}>
                    <Image source={seeImg}/>
                    <Text style={styles.number}>{ number }</Text>
                </View>
            </View>
        </ImageLoad>
        </View>
    </TouchableWithoutFeedback>
    }
}

@observer
export default class ShowHotScrollView extends Component {

    _hotItemAction(item) {
        const { navigation } = this.props
        navigation.navigate('show/ShowDetailPage', {id: item.id})
    }

    render() {
        const { hotList } = showHotModules
        let items = []
        if (!hotList){
            return <View/>
        }
        hotList.map((item, index) => {
            items.push(<HotItem key={index} item={item} press={()=>this._hotItemAction(item)}/>)
        })
        return <View>
        {
            items.length > 0
            ?
            <View style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>热门</Text>
                </View>
                <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {items}
                    <View style={styles.space}/>
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
        height: px2dp(200),
        marginTop: px2dp(10)
    },
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(19),
        fontWeight: '600'
    },
    scroll: {
        height: px2dp(175)
    },
    imgBack: {
        width: px2dp(280),
        height: px2dp(145),
        justifyContent: 'flex-end'
    },
    item: {
        width: px2dp(280),
        height: px2dp(140),
        borderRadius: px2dp(5),
        overflow: 'hidden',
        marginLeft: px2dp(10)
    },
    space: {
        width: px2dp(10)
    },
    row: {
        height: px2dp(30),
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    remark: {
        color: DesignRule.bgColor,
        fontSize: px2dp(12),
        flex: 1
    },
    number: {
        color: '#fff',
        fontSize: px2dp(10),
        marginLeft: px2dp(5)
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: px2dp(60)
    },
    mask: {
        position: 'absolute',
        width: px2dp(280),
        bottom: 0,
        height: px2dp(30)
    }
})
