/**
 * 所有店铺...
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import MoneyIcon from '../src/je_07.png';
import StarIcon from '../src/xj_10.png';

export default class RecommendRow extends Component {

    static propTypes = {
        item: PropTypes.object,       // 内容
        onPress: PropTypes.func      // 点击
    };

    _onPress = (item) => {
        this.props.onPress && this.props.onPress(item);
    };

    render() {
        const item = this.props.item || {};
        const storeStar = item.storeStarId;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < (storeStar > 3 ? 3 : storeStar); i++) {
                starsArr.push(i);
            }
        }

        return (<TouchableWithoutFeedback onPress={()=>this._onPress(item)}>
            <View style={styles.rowContainer}>
                {
                    item.headUrl ? <Image source={{ uri: item.headUrl }} style={styles.img}/> :
                        <View style={styles.img}/>
                }
                <View style={styles.right}>
                    <View style={styles.row}>
                        <Text numberOfLines={1} style={styles.title}>{item.name || ''}</Text>
                    </View>
                    <Text style={[styles.desc, styles.margin]}>{item.storeUserNum || 0}成员</Text>
                    <View style={styles.bottomRow}>
                        <Image source={MoneyIcon}/>
                        <Text style={[styles.desc, { color: '#f39500' }]}>{`交易额:${item.totalTradeVolume || 0}元`}</Text>
                        <View style={{ flex: 1 }}/>
                        <View style={styles.starContainer}>
                            {
                                starsArr.map((index) => {
                                    return <Image key={index} style={[index ? { marginLeft: 5 } : null]}
                                                  source={StarIcon}/>;
                                })
                            }
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>);
    }
}

const styles = StyleSheet.create({
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
        marginRight: 0
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 55
    },
    right: {
        marginLeft: 10,
        flex: 1
    },
    margin: {
        marginTop: 10,
        marginBottom: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#c8c8c8',
        backgroundColor: __DEV__ ? '#c8c8c8' : 'white'
    },
    ingContainer: {
        width: 46,
        height: 15,
        borderRadius: 7,
        backgroundColor: '#e60012',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    ingText: {
        fontSize: 11,
        color: '#f7f7f7'
    },
    rowContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    title: {
        // fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color: '#000000',
        maxWidth: 200
    },
    desc: {
        marginLeft: 2,
        fontSize: 12,
        color: '#666666'
    }
});

