/**
 * @author xzm
 * @date 2019/7/22
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Image
} from 'react-native';
import user from '../../../model/user';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../../mine/res';
import showRes from '../res';
import EmptyUtils from '../../../utils/EmptyUtils';
import DesignRule from '../../../constants/DesignRule';
import WriterInfoView from './WriterInfoView';
import {
    MRText as Text,
    AvatarImage

} from '../../../components/ui';

const { px2dp } = ScreenUtils;
const {
    mine_user_icon
} = res.homeBaseImg;

const {
    showHeaderBg
} = showRes;
export default class UserInfoView extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let icon = (user.headImg && user.headImg.length > 0) ?
            <AvatarImage source={{ uri: user.headImg }} style={styles.userIcon}
                         borderRadius={px2dp(65 / 2)}/> : <Image source={mine_user_icon} style={styles.userIcon}
                                                                 borderRadius={px2dp(65 / 2)}/>;
        let name = '';
        if (EmptyUtils.isEmpty(user.nickname)) {
            name = user.phone ? user.phone : '未登录';
        } else {
            name = user.nickname.length > 6 ? user.nickname.substring(0, 6) + '...' : user.nickname;
        }

        //布局不能改，否则android不能显示
        return (
            <View style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                top: 0,
                width: DesignRule.width,
                height: px2dp(270),
                backgroundColor: '#F7F7F7',
                marginBottom: px2dp(ScreenUtils.isIOS ? 10 : 0)
            }}>
                <ImageBackground source={EmptyUtils.isEmpty(user.headImg) ? showHeaderBg : { uri: user.headImg }}
                                 style={styles.headerContainer} blurRadius={EmptyUtils.isEmpty(user.headImg) ? 0 : 10}>
                    {icon}
                    <Text style={styles.nameStyle}>
                        {name}
                    </Text>
                </ImageBackground>
                <WriterInfoView style={{ marginLeft: DesignRule.margin_page, marginTop: px2dp(-35) }}/>
            </View>
        );

    }
}

var styles = StyleSheet.create({
    headerContainer: {
        width: DesignRule.width,
        height: px2dp(235),
        alignItems: 'center'
    },
    userIcon: {
        width: px2dp(65),
        height: px2dp(65),
        marginTop: px2dp(79)
    },
    waterfall: {
        backgroundColor: DesignRule.bgColor
    },
    left: {
        paddingHorizontal: 15
    },
    nameStyle: {
        marginTop: px2dp(15),
        color: DesignRule.white,
        fontSize: px2dp(17)
    }
});

