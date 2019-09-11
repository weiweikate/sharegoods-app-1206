/**
 * @author 陈阳君
 * @date on 2019/09/11
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText } from '../../components/ui';
import DesignRule from '../../constants/DesignRule';
import NoMoreClick from '../../components/ui/NoMoreClick';
import ShareUtil from '../../utils/ShareUtil';
import apiEnvironment from '../../api/ApiEnvironment';
import res from './res';
import StringUtils from '../../utils/StringUtils';
import ScreenUtils from '../../utils/ScreenUtils';

export class GroupShareView extends Component {

    _onPress = (text) => {
        const { groupId, groupNum, surplusPerson, groupItem } = this.props.groupShareData || {};
        const { activityAmount, goodsName, goodsImg } = groupItem || {};
        ShareUtil.onShare({
            platformType: text === '微信' ? 0 : (text === '朋友圈' ? 1 : 2),
            shareType: 1,
            title: `【仅剩${surplusPerson}个名额】我${activityAmount}元带走了${goodsName || ''}`,
            dec: `我买了${goodsName || ''}，该商品已拼${StringUtils.sub(groupNum, surplusPerson)}件了，快来参团吧！`,
            linkUrl: `${apiEnvironment.getCurrentH5Url()}/activity/groupBuyDetails/${groupId}`,
            thumImage: `${goodsImg}`
        });
    };

    _renderIcon = (source, text) => {
        return <NoMoreClick style={styles.icon} onPress={() => {
            this._onPress(text);
        }}>
            <Image style={styles.iconImg} source={source}/>
            <MRText style={styles.iconText}>{text}</MRText>
        </NoMoreClick>;
    };

    render() {
        const { groupId, surplusPerson } = this.props.groupShareData || {};
        if (!groupId) {
            return null;
        }
        return (
            <View style={styles.container}>
                <MRText style={styles.topText}>还差<MRText
                    style={styles.topText1}>{surplusPerson}</MRText>人，赶紧邀请好友来参团吧</MRText>
                <View style={styles.iconContainer}>
                    {this._renderIcon(res.share.wechat, '微信')}
                    {this._renderIcon(res.share.weiXinTimeLine, '朋友圈')}
                    {this._renderIcon(res.share.QQ, 'QQ')}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    topText: {
        marginTop: 25,
        color: DesignRule.textColor_mainTitle, fontSize: 13, lineHeight: 16
    },
    topText1: {
        color: DesignRule.textColor_redWarn, fontSize: 16
    },
    iconContainer: {
        flexDirection: 'row', marginTop: 20, width: 105 + ScreenUtils.px2dp(55) * 2, justifyContent: 'space-between'
    },

    icon: {
        alignItems: 'center'
    },
    iconImg: {
        width: 35, height: 35
    },
    iconText: {
        marginTop: 8,
        color: DesignRule.textColor_mainTitle, fontSize: 11
    }

});
