/**
 * 热门发现item
 */

import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import res from './res';

const seeImg = res.button.see_white;
const maskImg = res.other.show_mask;
import DesignRule from 'DesignRule';
import ImageLoad from '@mr/image-placeholder';
import TimerMixin from 'react-timer-mixin';
import {
    MRText as Text,
} from '../../components/ui';

export default class ShowHotItem extends Component {
    state = {
        readNumber: 0
    };

    componentWillMount() {
        const { data } = this.props;
        this.setState({ readNumber: data.click ? data.click : 0 });
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps
        if (data.click !== this.state.readNumber) {
            this.state.readNumber = data.click
        }
    }


    _onSelectedItem() {
        const { press } = this.props;
        press && press();

        TimerMixin.setTimeout(() => {
            const { readNumber } = this.state;
            this.setState({ readNumber: readNumber + 1 });
        }, 800);
    }

    render() {
        const { data, imageStyle, imageUrl } = this.props;
        const { readNumber } = this.state;
        let number = readNumber;
        if (!number) {
            number = 0;
        }
        if (number > 999999) {
            number = 999999 + '+';
        }
        let img = imageUrl;
        if (!img) {
            img = data.img;
        }
        return <TouchableWithoutFeedback onPress={() => {
            this._onSelectedItem();
        }}>
            <View style={styles.item}>
                <ImageLoad style={[styles.img, imageStyle]} source={{ uri: img }}>
                    <Image style={styles.mask} source={maskImg} resizeMode={'cover'}/>
                    <View style={styles.numberView}>
                        <Image style={styles.seeImg} source={seeImg}/>
                        <Text style={styles.number} allowFontScaling={false}>{number}</Text>
                    </View>
                </ImageLoad>
                <View style={styles.profile}>
                    <Text numberOfLines={2}
                          style={styles.title} allowFontScaling={false}>{data.pureContent ? data.pureContent.slice(0, 100) : ''}</Text>
                    <View style={styles.row}>
                        <ImageLoad borderRadius={px2dp(15)} style={styles.portrait} source={{ uri: data.userHeadImg ? data.userHeadImg : '' }}/>
                        <Text
                            style={styles.name} allowFontScaling={false}>{data.userName && data.userName.length > 5 ? data.userName.slice(0, 5) + '...' : data.userName}</Text>
                        <View style={{ flex: 1 }}/>
                        <Text style={styles.time} allowFontScaling={false}>{data.time}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>;
    }
}

let styles = StyleSheet.create({
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
    numberView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(30)
    },
    profile: {
        height: px2dp(90)
    },
    title: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(12),
        paddingTop: px2dp(10),
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(53),
        justifyContent: 'space-between',
        paddingRight: px2dp(10),
        paddingLeft: px2dp(10)
    },
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
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
        height: px2dp(30),
        borderRadius: px2dp(15)
    },
    name: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(11),
        marginLeft: 5
    },
    time: {
        color: '#939393',
        fontSize: px2dp(11)
    },
    mask: {
        position: 'absolute',
        width: px2dp(168),
        bottom: 0,
        height: px2dp(30)
    }
});
