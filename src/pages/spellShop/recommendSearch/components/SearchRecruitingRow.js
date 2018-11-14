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
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../../../utils/ScreenUtils';


export default class SearchRecruitingRow extends Component {

    static propTypes = {
        item: PropTypes.object,         // 内容
        onPress: PropTypes.func      // 点击
    };

    _onPress = (item) => {
        this.props.onPress && this.props.onPress(item);
    };

    render() {
        const { item = {} } = this.props;
        return (<TouchableWithoutFeedback onPress={() => this._onPress(item)}>
            <View style={styles.rowContainer}>
                <View style={styles.headerViewContainer}>
                    {item.headUrl ? <Image style={styles.icon}
                                           source={{ uri: item.headUrl || '' }}/> :
                        <View style={styles.icon}/>}
                    <View style={styles.tittleContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.name} numberOfLines={1}>{item.name || ''}</Text>
                            <View style={styles.ingContainer}>
                                <Text style={styles.ingText}>招募中</Text>
                            </View>
                        </View>
                        <Text style={styles.member} numberOfLines={1}>{`店主: ${item.storeUserName || ''}`}</Text>
                    </View>
                </View>
                <View style={{ width: 1, height: 100, backgroundColor: 'rgb(244,231,221)' }}/>
                <View style={{ width: ScreenUtils.autoSizeWidth(44 + 70), alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{
                        color: DesignRule.textColor_secondTitle,
                        fontSize: 10,
                        fontFamily: 'PingFangSC-Light'
                    }}>店铺成员</Text>
                    <Text style={{
                        color: DesignRule.textColor_secondTitle,
                        fontSize: 11,
                        fontFamily: 'PingFangSC-Medium',
                        marginTop: 5
                    }}>{item.storeUserNum || 0}</Text>
                    <TouchableOpacity style={styles.joinBtn} onPress={() => {
                        this._onPress(item);
                    }}>
                        <Text style={styles.joinText}>+加入我们</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>);
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: ScreenUtils.autoSizeWidth(15),
        marginTop: 10,
        backgroundColor: '#FEFAF7'
    },
    headerViewContainer: {
        flex: 1,
        paddingVertical: 25,
        marginLeft: ScreenUtils.autoSizeWidth(15),
        flexDirection: 'row'
    },
    icon: {
        width: ScreenUtils.autoSizeWidth(50),
        height: ScreenUtils.autoSizeWidth(50),
        backgroundColor: DesignRule.lineColor_inColorBg,
        borderRadius: ScreenUtils.autoSizeWidth(25)
    },
    tittleContainer: {
        justifyContent: 'center',
        marginLeft: ScreenUtils.autoSizeWidth(11),
        flex: 1
    },
    name: {
        maxWidth: ScreenUtils.autoSizeWidth(90),
        color: DesignRule.textColor_mainTitle,
        fontSize: 14
    },
    member: {
        marginTop: 9,
        color: DesignRule.textColor_instruction,
        fontSize: 11
    },
    ingContainer: {
        marginLeft: 10,
        height: 15,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0186f5'
    },
    ingText: {
        fontFamily: 'PingFang-SC-Medium',
        paddingHorizontal: 7,
        color: 'white',
        fontSize: 11
    },
    joinBtn: {
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
        height: 22,
        borderRadius: 11,
        backgroundColor: DesignRule.bgColor_btn
    },
    joinText: {
        fontFamily: 'PingFangSC-Medium',
        color: 'white',
        fontSize: 12,
        paddingHorizontal: 8
    }
});

