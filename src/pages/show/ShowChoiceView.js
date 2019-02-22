/**
 * 秀场精选
 */
import React, {Component} from 'react'
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import {observer} from 'mobx-react'
import { showChoiceModules } from './Show'
import res from './res';
const seeImg = res.button.see;
const maskImg = res.other.show_mask;
import DesignRule from '../../constants/DesignRule';
import ImageLoad from '@mr/image-placeholder'
import AvatarImage from '../../components/ui/AvatarImage'
import TimerMixin from 'react-timer-mixin'
import {
    MRText as Text,
} from '../../components/ui';

class Card extends Component {

    state = {
        readNumber: 0
    }

    componentWillMount() {
        const { item } = this.props
        this.setState({readNumber: item.click})
    }

    componentWillReceiveProps(nextProps) {
        const { item } = nextProps
        if (item.click !== this.state.readNumber) {
            this.state.readNumber = item.click
        }
    }

    _onSelectedCard() {
        const { press } = this.props
        press && press()

        TimerMixin.setTimeout(() => {
            const { readNumber } = this.state
            this.setState({readNumber: readNumber + 1})
        }, 800)
    }

    render () {
        const { item } = this.props
        const { readNumber } = this.state
        let number = readNumber
        if (!number) {
            number = 0
        }
        if (number > 999999) {
            number = 999999 + '+'
        }
        return <TouchableWithoutFeedback style={styles.card} onPress={()=> this._onSelectedCard()}>
        <View style={styles.card}>
        <ImageLoad style={styles.imgView} source={{uri:item.coverImg}} resizeMode={'cover'}>
            <Image style={styles.mask} source={maskImg} resizeMode={'cover'}/>
            <Text style={styles.dis} numberOfLines={2} allowFontScaling={false}>{item.pureContent ? item.pureContent.slice(0, 100).trim() : ''}</Text>
        </ImageLoad>
        <View style={styles.profileView}>
            <AvatarImage style={styles.portrait} source={{uri:item.userHeadImg ? item.userHeadImg : ''}} borderRadius={px2dp(15)}/>
            <Text style={styles.name} allowFontScaling={false}>{item.userName}</Text>
            <View style={{flex: 1}}/>
            <View style={styles.rightRow}>
                <Image source={seeImg}/>
                <Text style={styles.number} allowFontScaling={false}>{ number }</Text>
            </View>
        </View>
        </View>
    </TouchableWithoutFeedback>
    }
}

@observer
export default class ShowChoiceView extends Component {

    _onChoiceAction(item) {
        const { navigate, isScroll } = this.props
        console.log('_onChoiceAction', isScroll);
        if (isScroll === true) {
            return
        }
        navigate('show/ShowDetailPage', {id: item.id, code: item.code})
    }

    render() {
        const { choiceList } = showChoiceModules
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
                    <Text style={styles.title} allowFontScaling={false}>精选</Text>
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
