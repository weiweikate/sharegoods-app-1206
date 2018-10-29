/**
 * 店员展示
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import PeopleImg from '../res/dy_07.png';
import ArrowImg from '../res/xjt_03.png';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class MembersRow extends Component {

    static propTypes = {
        dealerList: PropTypes.array,
        onPressAllMembers: PropTypes.func,//点击查看全部成员
        onPressMemberItem: PropTypes.func//点击某个成员
    };

    // 点击某个具体的成员
    _clickItemMembers = (id, item) => {
        this.props.onPressMemberItem && this.props.onPressMemberItem(id, item);
    };

    render() {
        const dealerList = this.props.dealerList || [];
        return (<View style={styles.container}>
            <TouchableOpacity onPress={this.props.onPressAllMembers}
                              activeOpacity={1}
                              style={styles.allMembersRow}>
                <Image style={styles.icon} source={PeopleImg}/>
                <Text style={styles.iconTitle}>店铺成员</Text>
                <Text style={styles.iconDesc}>{`共${dealerList.length}人`}</Text>
                <Image style={styles.arrow} source={ArrowImg}/>
            </TouchableOpacity>
            <View style={styles.gapLine}/>
            <View style={styles.membersContainer}>
                {
                    dealerList.map((item, index) => {
                        const { headImg, nickName } = item || {};
                        if (index > 10) {
                            return;
                        }
                        return (<View style={{ alignItems: 'center', marginBottom: (index >= 5) ? 16 : 0 }} key={index}>
                            {headImg ? <Image source={{ uri: headImg }}
                                              style={styles.headerImg}/> :
                                <View style={styles.headerImg}/>}
                            <Text numberOfLines={1} style={styles.name}>{nickName || ''}</Text>
                        </View>);
                    })
                }
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    allMembersRow: {
        height: 38,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginLeft: 23,
        marginRight: 8
    },
    iconTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#222222'
    },
    iconDesc: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 12,
        color: '#666666',
        flex: 1,
        textAlign: 'right'
    },
    arrow: {
        marginLeft: 5,
        marginRight: 21
    },
    gapLine: {
        marginHorizontal: 10,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#dddddd'
    },
    membersContainer: {
        marginHorizontal: ScreenUtils.autoSizeWidth(23),
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    headerImg: {
        width: 28,
        height: 28,
        backgroundColor: '#eee',
        marginTop: 16,
        borderRadius: 14
    },
    name: {
        marginTop: 5,
        width: (ScreenUtils.width - ScreenUtils.autoSizeWidth(23) * 2) / 5,
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 11,
        color: '#666666',
        textAlign: 'center'
    }

});

