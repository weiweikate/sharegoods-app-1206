/**
 * 店员展示
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const imgWidth = 28 / 375 * SCREEN_WIDTH;
const gap = (SCREEN_WIDTH - 5 * (imgWidth + 20)) / 6;
import PeopleImg from '../res/dy_07.png';
import ArrowImg from '../res/xjt_03.png';
import AddImg from '../res/yaoq03.png';

export default class MembersRow extends Component {

    static propTypes = {
        isYourStore: PropTypes.bool,
        dealerList: PropTypes.array,
        onPressAllMembers: PropTypes.func,//点击查看全部成员
        onPressMemberItem: PropTypes.func,//点击某个成员
        onPressAddItem: PropTypes.func//点击添加成员
    };

    // 点击某个具体的成员
    _clickItemMembers = (id, item) => {
        this.props.onPressMemberItem && this.props.onPressMemberItem(id, item);
    };

    render() {
        const dealerList = this.props.dealerList || [];
        const list = dealerList.concat([null]);
        return (<View style={styles.container}>
            <TouchableOpacity onPress={this.props.onPressAllMembers}
                              activeOpacity={1}
                              style={styles.allMembersRow}>
                <Image style={styles.icon} source={PeopleImg}/>
                <Text style={styles.iconTitle}>店铺成员</Text>
                <Text style={styles.iconDesc}>共{dealerList.length}人</Text>
                <Image style={styles.arrow} source={ArrowImg}/>
            </TouchableOpacity>
            <View style={styles.gapLine}/>
            <View style={styles.membersContainer}>
                {
                    list.map((item, index) => {
                        const showAdd = (index === 9 || (index < 9 && index === list.length - 1)) && this.props.isYourStore;
                        if (showAdd) {//第十个显示加号
                            return (<TouchableOpacity style={{
                                alignItems: 'center',
                                marginLeft: gap,
                                marginBottom: index >= 5 || list.length < 5 ? 17 : 0
                            }}
                                                      key={index}
                                                      activeOpacity={1}
                                                      onPress={this.props.onPressAddItem}>
                                <Image source={AddImg} style={[styles.headerImg, { backgroundColor: 'transparent' }]}/>
                                <Text numberOfLines={1} style={styles.name}>
                                    邀请
                                </Text>
                            </TouchableOpacity>);
                        } else if (index > 9) {
                            return null;
                        }
                        if (!item) {
                            return null;
                        }
                        const { headImg, nickname } = item || {};

                        return (<View style={{
                            alignItems: 'center',
                            marginLeft: gap,
                            marginBottom: (index >= 5 || list.length <= 5) ? 17 : 0
                        }}
                                      key={index}>
                            <View style={[styles.headerImg, headImg ? { borderWidth: 0 } : null]}>
                                {headImg ? <Image source={{ uri: headImg }}
                                                  style={[styles.headerImg, { marginTop: 0, borderWidth: 0 }]}/> : null}
                            </View>
                            <Text numberOfLines={1} style={styles.name}>
                                {nickname || ''}
                            </Text>
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
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    name: {
        marginTop: 5,
        width: imgWidth + 20,
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 11,
        color: '#666666',
        textAlign: 'center'
    },
    headerImg: {
        width: imgWidth,
        height: imgWidth,
        backgroundColor: '#eee',
        borderWidth: 0.5,
        marginTop: 17,
        borderRadius: imgWidth / 2,
        borderColor: "#999999"
    }
});

