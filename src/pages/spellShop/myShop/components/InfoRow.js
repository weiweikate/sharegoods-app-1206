/**
 * 店铺行展示信息
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';
import DesignRule from 'DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import {
    MRText as Text
} from '../../../../components/ui';

export default class InfoRow extends Component {

    static propTypes = {
        icon: PropTypes.any,        // 图片
        title: PropTypes.string,    // 标题
        desc: PropTypes.string     // 描述
    };

    render() {
        return (<View style={styles.row}>
            <Image style={styles.img} source={this.props.icon}/>
            <Text style={styles.title} allowFontScaling={false}>{StringUtils.isNoEmpty(this.props.title) ? this.props.title : ''}</Text>
            <Text style={styles.desc} allowFontScaling={false}>{StringUtils.isNoEmpty(this.props.desc) ? this.props.desc : ''}</Text>
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
        marginLeft: 25
    },
    title: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 4
    },
    desc: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle,
        flex: 1,
        textAlign: 'right',
        marginRight: 21
    }
});

