/**
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import PeopleImg from '../src/dy_07.png';
import ArrowImg from '../src/xjt_03.png';
import DashImg from '../src/xt_03.png';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class AssistantRow extends Component {

    static propTypes = {
        clickAllMembers: PropTypes.func,
        storeData: PropTypes.object
    };

    render() {
        let storeUserList = this.props.storeData.storeUserList || [];
        return (<View style={styles.row}>
            <TouchableOpacity activeOpacity={1} onPress={this.props.clickAllMembers} style={styles.topRow}>
                <Image style={styles.topIcon} source={PeopleImg}/>
                <Text style={styles.topTitle}>{'参与成员'}</Text>
                <Text style={styles.topDescText}>{`共${storeUserList.length || 0}人`}</Text>
                <Image style={styles.topArrow} source={ArrowImg}/>
            </TouchableOpacity>
            <Image source={DashImg} style={styles.dash}/>
            <ScrollView bounces={false} showsHorizontalScrollIndicator={false}>
                <View style={styles.listContainer}>
                    {
                        storeUserList.map((item, index) => {
                            const { headImg, nickName } = item;
                            return (<View style={styles.item} key={index}>
                                {
                                    headImg ? <Image source={{ uri: headImg }}
                                                     style={[styles.itemHeader, { marginTop: 0 }]}/> :
                                        <View style={styles.itemHeader}/>
                                }
                                <Text numberOfLines={1} style={styles.itemTitleText}>{nickName || ' '}</Text>
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
        fontSize: 15,
        color: '#222222'
    },
    topDescText: {
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
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginVertical: 15
    },
    itemHeader: {
        width: 40,
        height: 40,
        backgroundColor: '#F6F6F6',
        borderRadius: 20
    },
    itemTitleText: {
        marginTop: 10,
        width: 40 + 20,
        fontSize: 11,
        color: '#666666',
        textAlign: 'center'
    }
});

