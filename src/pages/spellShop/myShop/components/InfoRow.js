/**
 * 店铺行展示信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

export default class InfoRow extends Component {

    static propTypes = {
        icon: PropTypes.any,        // 图片
        title: PropTypes.string,    // 标题
        desc: PropTypes.string,     // 描述
    };

    render() {
        return (<View style={styles.row}>
            <Image style={styles.img} source={this.props.icon}/>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.desc}>{this.props.desc}</Text>
        </View>);
    }
}

const styles = StyleSheet.create({
    row: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    img: {
        marginLeft: 25,
    },
    title: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color: "#222222",
        marginLeft: 4,
    },
    desc: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 12,
        color: "#666666",
        flex: 1,
        textAlign: 'right',
        marginRight: 21
    }
});

