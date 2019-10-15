/**
 * 店员展示
 */
import React, { Component } from 'react';
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
import StringUtils from '../../../../utils/StringUtils';
import { observer } from 'mobx-react';

const PeopleImg = res.myShop.dy_07;
const ArrowImg = res.myShop.xjt_03;

@observer
export default class MembersRow extends Component {

    render() {
        const { storeData, storeUsers, storeUserCount } = this.props.MyShopDetailModel;
        const { roleType } = storeData;
        return (<View style={styles.container}>
            <TouchableOpacity onPress={this.props.onPressAllMembers}
                              activeOpacity={1}
                              style={styles.allMembersRow}>
                <Image style={styles.icon} source={PeopleImg}/>
                <Text style={styles.iconTitle}>店铺成员</Text>
                <Text
                    style={[styles.iconDesc, { marginRight: StringUtils.isNoEmpty(roleType) ? 0 : 21 }]}>{`共${storeUserCount}人`}</Text>
                {StringUtils.isNoEmpty(roleType) && <Image style={styles.arrow} source={ArrowImg}/>}
            </TouchableOpacity>
            <View style={styles.membersContainer}>
                {
                    storeUsers.map((item, index) => {
                        const { headImg, nickName } = item || {};
                        if (index > 9) {
                            return;
                        }
                        return (<View style={{
                            alignItems: 'center',
                            marginTop: (index >= 5) ? 0 : 10,
                            marginBottom: (index >= 5) ? 11 : 20
                        }} key={index}>
                            <AvatarImage source={{ uri: headImg }}
                                         style={styles.headerImg} borderRadius={20}/>
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
        backgroundColor: 'white', marginHorizontal: 15, borderRadius: 5, marginBottom: 14
    },
    allMembersRow: {
        height: 38,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginLeft: 15,
        marginRight: 8, width: 13, height: 12
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
        marginRight: 15, width: 14, height: 14
    },
    membersContainer: {
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
        width: (ScreenUtils.width - 30) / 5,
        fontSize: 11,
        color: DesignRule.textColor_secondTitle,
        textAlign: 'center'
    }

});

