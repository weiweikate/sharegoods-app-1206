/**
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import PeopleImg from '../src/dy_07.png';
import ArrowImg from '../src/xjt_03.png';
import DashImg from '../src/xt_03.png';
import AddImg from '../src/yaoq03.png';
import ScreenUtils from '../../../../utils/ScreenUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const imgWidth = 28 / 375 * SCREEN_WIDTH;
const gap = (SCREEN_WIDTH - 5 * (imgWidth + 20)) / 6;

export default class AssistantRow extends Component {

    static propTypes = {
        clickAllMembers: PropTypes.func,
        clickAddMembers: PropTypes.func,
        dealerList: PropTypes.array,
        originDealerList: PropTypes.array
    };

    render() {
        return (<View style={styles.row}>
            <TouchableOpacity activeOpacity={1} onPress={this.props.clickAllMembers} style={styles.topRow}>
                <Image style={styles.topIcon} source={PeopleImg}/>
                <Text style={styles.topTitle}>参与成员</Text>
                <Text style={styles.topDescText}>共{(this.props.originDealerList || []).length}人</Text>
                <Image style={styles.topArrow} source={ArrowImg}/>
            </TouchableOpacity>
            <Image source={DashImg} style={styles.dash}/>
            <ScrollView bounces={false} showsHorizontalScrollIndicator={false}>
                <View style={styles.listContainer}>
                    {
                        (this.props.dealerList || []).map((item, index) => {

                            if (!item) {
                                return (<TouchableOpacity style={styles.item}
                                                          key={index}
                                                          activeOpacity={1}
                                                          onPress={this.props.clickAddMembers}>
                                    <Image source={AddImg}
                                           style={[styles.itemHeader, { backgroundColor: 'transparent' }]}/>
                                    <Text numberOfLines={1} style={styles.itemTitleText}>
                                        邀请
                                    </Text>
                                </TouchableOpacity>);
                            }

                            const { headImg } = item;
                            return (<View style={styles.item} key={index}>
                                <View style={styles.itemHeader}>
                                    {
                                        headImg ? <Image source={{ uri: headImg }}
                                                         style={[styles.itemHeader, { marginTop: 0 }]}/> : null
                                    }
                                </View>
                                <Text numberOfLines={1} style={styles.itemTitleText}>{'欧阳哈哈哈哈哈哈哈哈' || ''}</Text>
                            </View>);
                        })
                    }
                </View>
            </ScrollView>
        </View>);
    }
}

const styles = StyleSheet.create({
    row: {
        backgroundColor: 'white'
    },
    topRow: {
        height: 38,
        flexDirection: 'row',
        alignItems: 'center'
    },
    topIcon: {
        marginLeft: 23,
        marginRight: 8
    },
    topTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#222222'
    },
    topDescText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 12,
        color: '#666666',
        flex: 1,
        textAlign: 'right'
    },
    topArrow: {
        marginLeft: 5,
        marginRight: 21
    },
    dash: {
        width: ScreenUtils.width - 15,
        marginLeft: 15,
        height: 0.5
    },
    listContainer: {
        flexDirection: 'row'
    },
    item: {
        alignItems: 'center',
        marginLeft: gap,
        marginBottom: 17
    },
    itemHeader: {
        width: imgWidth,
        height: imgWidth,
        backgroundColor: '#F6F6F6',
        borderWidth: 0.5,
        marginTop: 17,
        borderRadius: imgWidth / 2,
        borderColor: '#999999',
        overflow: 'hidden'
    },
    itemTitleText: {
        marginTop: 5,
        width: imgWidth + 20,
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 11,
        color: '#666666',
        textAlign: 'center'
    }
});

