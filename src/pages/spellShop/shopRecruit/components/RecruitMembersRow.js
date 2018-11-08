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
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';

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
                <Text style={styles.topTitle}>{'店铺成员'}</Text>
                <Text style={styles.topDescText}>{`${storeUserList.length || 0}人`}</Text>
                <Image style={styles.topArrow} source={ArrowImg}/>
            </TouchableOpacity>
            <View style={styles.dash}/>
            <ScrollView bounces={false} showsHorizontalScrollIndicator={false}>
                <View style={styles.listContainer}>
                    {
                        storeUserList.map((item, index) => {
                            const { headImg, nickName } = item || {};
                            if (index > 9) {
                                return;
                            }
                            return (<View style={{
                                alignItems: 'center',
                                marginTop: (index >= 5) ? 0 : 9,
                                marginBottom: (index >= 5) ? 24 : 20
                            }} key={index}>
                                {headImg ? <Image source={{ uri: headImg }}
                                                  style={styles.headerImg}/> :
                                    <View style={styles.headerImg}/>}
                                <Text numberOfLines={1} style={styles.name}>{nickName || ''}</Text>
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
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    topIcon: {
        marginLeft: 23,
        marginRight: 8
    },
    topTitle: {
        fontSize: 15,
        color: DesignRule.textColor_mainTitle
    },
    topDescText: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle,
        flex: 1,
        textAlign: 'right'
    },
    topArrow: {
        marginLeft: 5,
        marginRight: 21
    },
    dash: {
        width: ScreenUtils.width,
        backgroundColor: '#E4E4E4',
        height: 1
    },
    listContainer: {
        marginHorizontal: ScreenUtils.autoSizeWidth(30),
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginVertical: 15
    },
    headerImg: {
        width: 40,
        height: 40,
        backgroundColor: '#eee',
        borderRadius: 20
    },
    name: {
        marginTop: 5,
        width: (ScreenUtils.width - ScreenUtils.autoSizeWidth(30) * 2) / 5,
        fontSize: 11,
        color: DesignRule.textColor_secondTitle,
        textAlign: 'center'
    }
});

