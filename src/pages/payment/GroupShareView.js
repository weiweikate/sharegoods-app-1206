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
import apiEnvironment from '../../api/ApiEnvironment';
import res from './res';
import StringUtils from '../../utils/StringUtils';
import ScreenUtils from '../../utils/ScreenUtils';
import { TimeLabelText } from '../product/components/promotionGroup/ProductGroupItemView';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import person from '../product/components/promotionGroup/person.png';
import morePerson from '../product/components/promotionGroup/morePerson.png';
import UIImage from '@mr/image-placeholder';
import { backToHome, replaceRoute } from '../../navigation/RouterMap';
import { TrackApi, trackEvent } from '../../utils/SensorsTrack';
import CommGroupShareModal from '../../comm/components/CommGroupShareModal';

const { px2dp } = ScreenUtils;

@observer
export class GroupShareView extends Component {
    render() {
        const { groupId, surplusPerson, groupNum, groupUserHeadImg, groupItem } = this.props.groupShareData || {};
        const { activityAmount, goodsName, goodsImg, v1Price } = groupItem || {};
        if (!groupId) {
            return null;
        }
        const { groupShareViewModal } = this.props;
        const { endTime } = groupShareViewModal;
        const hasNum = StringUtils.sub(groupNum, surplusPerson);
        return (
            <View style={styles.container}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: px2dp(180) }}>
                    <Image source={res.pay_success_icon} style={{ height: px2dp(72), width: px2dp(72) }}/>
                    <MRText style={{
                        fontSize: px2dp(23),
                        color: DesignRule.textColor_mainTitle,
                        marginTop: px2dp(22)
                    }}>{surplusPerson > 0 ? '支付成功' : '拼团成功'}</MRText>
                </View>
                {surplusPerson > 0 && <View style={styles.timeView}>
                    <View style={styles.timeLine}/>
                    <View style={styles.timeCircle}/>
                    <MRText style={styles.timeText}><TimeLabelText endTime={endTime}
                                                                   style={{ color: DesignRule.mainColor }}/>后结束</MRText>
                    <View style={styles.timeCircle}/>
                    <View style={styles.timeLine}/>
                </View>}
                {surplusPerson > 0 && <MRText style={styles.numText}>还差<MRText
                    style={styles.numText1}>{surplusPerson}</MRText>人可拼团成功</MRText>}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
                    <View>
                        <UIImage isAvatar={true}
                                 style={styles.icon}
                                 source={{ uri: groupUserHeadImg }}/>
                        <View style={styles.leaderView}>
                            <MRText style={styles.leaderText}>团长</MRText>
                        </View>
                    </View>
                    {hasNum > 1 && <Image style={[styles.icon, { marginLeft: px2dp(20) }]}
                                          source={person}/>}
                    {hasNum > 3 && <Image style={[styles.icon, { marginLeft: px2dp(20) }]}
                                          source={morePerson}/>}
                    {hasNum > 2 && <Image style={[styles.icon, { marginLeft: px2dp(20) }]}
                                          source={person}/>}
                </View>
                {surplusPerson > 0 && <NoMoreClick onPress={() => {
                    this.ShareModel.open && this.ShareModel.open();
                    TrackApi.OrderPayResultBtnClick({
                        orderPayResultPageType: 0,
                        orderPayType: 2,
                        orderPayResultBtnType: 0,
                        orderResultPageType: 2
                    });
                }}>
                    <LinearGradient style={styles.LinearGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FF0050', '#FC5D39']}>
                        <MRText style={styles.LinearGradientText}>邀请好友来拼团</MRText>
                    </LinearGradient>
                </NoMoreClick>}
                {surplusPerson === 0 &&
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                    <NoMoreClick
                        style={[styles.shortBtn, { borderWidth: 0.5, borderColor: '#979797', marginRight: 15 }]}
                        onPress={() => {
                            replaceRoute('order/order/MyOrdersListPage', { index: 0 });
                            TrackApi.OrderPayResultBtnClick({
                                orderPayResultPageType: 0,
                                orderPayType: 2,
                                orderPayResultBtnType: 2,
                                orderResultPageType: 2
                            });
                        }}>
                        <MRText style={{ color: DesignRule.textColor_instruction, fontSize: 14 }}>查看订单</MRText>
                    </NoMoreClick>
                    <NoMoreClick onPress={() => {
                        TrackApi.OrderPayResultBtnClick({
                            orderPayResultPageType: 0,
                            orderPayType: 2,
                            orderPayResultBtnType: 1,
                            orderResultPageType: 2
                        });
                        backToHome();
                    }}>
                        <LinearGradient style={styles.shortBtn}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FF0050', '#FC5D39']}>
                            <MRText style={{ color: 'white', fontSize: 14 }}>继续逛逛</MRText>
                        </LinearGradient>
                    </NoMoreClick>
                </View>}

                <CommGroupShareModal
                    ref={(ref) => {
                        this.ShareModel = ref;
                    }}
                    endTime={endTime}
                    needPerson={surplusPerson}
                    type={'group'}
                    imageJson={{ // 分享商品图片的数据
                        imageUrlStr: goodsImg || 'logo.png',
                        imageType: 'group', // 为空就是生成商品分享的图片， web：网页分享的图片 group:生成拼团海报
                        titleStr: goodsName || '秀一秀，赚到够',
                        priceStr: activityAmount + '', // 拼团活动价格
                        originalPrice: v1Price + '',//划线价格
                        QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/activity/groupBuyDetails/${groupId || ''}`
                    }}
                    webJson={{
                        title: `[仅剩${surplusPerson}个名额] 我${activityAmount || ''}元带走了${goodsName || ''}` || '秀一秀，赚到够',//分享标题(当为图文分享时候使用)
                        linkUrl: `${apiEnvironment.getCurrentH5Url()}/activity/groupBuyDetails/${groupId || ''}`,//(图文分享下的链接)
                        thumImage: goodsImg || 'logo.png',//(分享图标小图(https链接)图文分享使用)
                        dec: `我买了${goodsName || ''}，该商品已拼${StringUtils.sub(groupNum, surplusPerson)}件了，快来参团吧!`
                    }}
                    trackEvent={trackEvent.ShareGroupbuy} //分享埋点
                    trackParmas={{
                        shareSource: 3,
                        groupbuyId: groupId + '',
                        spuName: goodsName + ''
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', backgroundColor: 'white'
    },
    timeView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
    },
    timeLine: {
        backgroundColor: '#FC5D39', height: 0.5, width: px2dp(68)
    },
    timeCircle: {
        width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FC5D39'
    },
    timeText: {
        color: DesignRule.textColor_mainTitle, fontSize: 13, paddingHorizontal: 10
    },
    numText: {
        marginTop: 3.5,
        color: DesignRule.textColor_mainTitle, fontSize: 13
    },
    numText1: {
        color: DesignRule.textColor_redWarn, fontSize: 16
    },
    icon: {
        width: 40, height: 40
    },
    leaderView: {
        width: 32, height: 15, borderRadius: 7.5, backgroundColor: DesignRule.mainColor,
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', bottom: 0, alignSelf: 'center'
    },
    leaderText: {
        fontSize: 11, color: 'white'
    },
    LinearGradient: {
        justifyContent: 'center', alignItems: 'center',
        width: px2dp(260), height: 40, borderRadius: 20, marginBottom: 20
    },
    LinearGradientText: {
        color: 'white', fontSize: 14
    },

    shortBtn: {
        justifyContent: 'center', alignItems: 'center',
        width: px2dp(157), height: 40, borderRadius: 20
    }
});

export class GroupShareViewModal {
    @observable endTime;
}
