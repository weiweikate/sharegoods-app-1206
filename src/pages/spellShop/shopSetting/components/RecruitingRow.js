/**
 * 招募中...
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
import DesignRule from 'DesignRule';

export default class RecruitingRow extends Component {

    static propTypes = {
        item: PropTypes.object,         // 内容
        onPress: PropTypes.func      // 点击
    };

    _onPress = () => {
        const { id } = this.props.item || {};
        id && this.props.onPress && this.props.onPress(id);
    };

    render() {
        const { item } = this.props;
        return (<TouchableWithoutFeedback onPress={this._onPress}>
            <View style={styles.rowContainer}>
                {
                    item.headUrl ? <Image source={{ uri: item.headUrl }} style={styles.img}/> :
                        <View style={styles.img}/>
                }
                <View style={styles.right}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{item.name || ''}</Text>
                        <View style={styles.ingContainer}>
                            <Text style={styles.ingText}>
                                招募中
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.desc, styles.margin]}>{item.hadUser || 0}成员</Text>
                    <Text numberOfLines={1} style={[styles.desc, { maxWidth: 200 }]}>店长:{item.storeUser || ''}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>);
    }
}

const styles = StyleSheet.create({
    right: {
        marginLeft: 10
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
        backgroundColor: __DEV__ ? '#c8c8c8' : DesignRule.white
    },
    ingContainer: {
        width: 46,
        height: 15,
        borderRadius: 7,
        backgroundColor: '#0186f5',
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
        backgroundColor: DesignRule.white
    },
    title: {
        fontSize: 13,
        color: '#000000'
    },
    desc: {
        fontSize: 12,
        color: '#666666'
    }
});

