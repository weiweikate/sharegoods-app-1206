/**
 * 店员展示
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import AvatarImage from '../../../../components/ui/AvatarImage';
import {
    MRText as Text
} from '../../../../components/ui';

const PeopleImg = res.myShop.dy_07;
const ArrowImg = res.myShop.xjt_03;

export default class MembersRow extends Component {

    static propTypes = {
        storeUserList: PropTypes.array,
        onPressAllMembers: PropTypes.func,//点击查看全部成员
        onPressMemberItem: PropTypes.func//点击某个成员
    };

    // 点击某个具体的成员
    _clickItemMembers = (id, item) => {
        this.props.onPressMemberItem && this.props.onPressMemberItem(id, item);
    };

    render() {
        const { userStatus, userCount, storeUserList } = this.props;
        return (<View style={styles.container}>
            <TouchableOpacity onPress={this.props.onPressAllMembers}
                              activeOpacity={1}
                              style={styles.allMembersRow}>
                <Image style={styles.icon} source={PeopleImg}/>
                <Text style={styles.iconTitle} allowFontScaling={false}>店铺成员</Text>
                <Text
                    style={[styles.iconDesc, { marginRight: userStatus !== 1 ? 21 : 0 }]}
                    allowFontScaling={false}>{`共${userCount || 0}人`}</Text>
                {userStatus === 1 ? <Image style={styles.arrow} source={ArrowImg}/> : null}
            </TouchableOpacity>
            <View style={styles.gapLine}/>
            <View style={styles.membersContainer}>
                {
                    (storeUserList || []).map((item, index) => {
                        const { headImg, nickName } = item || {};
                        if (index > 9) {
                            return;
                        }
                        return (<View style={{
                            alignItems: 'center',
                            marginTop: (index >= 5) ? 0 : 9,
                            marginBottom: (index >= 5) ? 24 : 20
                        }} key={index}>
                            <AvatarImage source={{ uri: headImg }}
                                         style={styles.headerImg} borderRadius={20}/>
                            <Text numberOfLines={1} style={styles.name} allowFontScaling={false}>{nickName || ''}</Text>
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
        fontSize: 15,
        color: DesignRule.textColor_mainTitle
    },
    iconDesc: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle,
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
        backgroundColor: DesignRule.lineColor_inGrayBg
    },
    membersContainer: {
        marginHorizontal: ScreenUtils.autoSizeWidth(30),
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    headerImg: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    name: {
        marginTop: 5,
        paddingBottom: 3,
        width: (ScreenUtils.width - ScreenUtils.autoSizeWidth(30) * 2) / 5,
        fontSize: 11,
        color: DesignRule.textColor_secondTitle,
        textAlign: 'center'
    }

});

