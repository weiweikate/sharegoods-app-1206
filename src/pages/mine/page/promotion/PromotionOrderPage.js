/**
 *
 * Copyright 2018 杭州名融网络有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/22.
 *
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text} from '../../../../components/ui'
const { px2dp } = ScreenUtils;
import res from '../../res';

const icon = res.button.tongyon_icon_check_green;

type Props = {};
export default class PromotionOrderPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: '',
        show: true// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
    }

    _render() {
        return (
            <View style={styles.container}>
                <Image source={icon} style={{ width: px2dp(70), height: px2dp(70), marginTop: px2dp(66) }}/>
                <Text style={{
                    color: DesignRule.textColor_secondTitle,
                    fontSize: px2dp(15),
                    marginTop: px2dp(15),
                    marginBottom: px2dp(20)
                }}>
                    支付成功
                </Text>
                <Text style={[styles.grayTextStyle, { marginBottom: px2dp(5) }]}>
                    系统会在明天0点进行站内分享
                </Text>
                <Text style={styles.grayTextStyle}>
                    每成功获取一个秀迷将收到站内消息推送
                </Text>
                <View style={styles.buttonsWrapper}>
                    <View style={styles.buttonWrapper}>
                        <Text style={styles.buttonTextStyle}>
                            我的分享
                        </Text>
                    </View>
                    <View style={{ width: px2dp(10) }}/>
                    <View style={styles.buttonWrapper}>
                        <Text style={styles.buttonTextStyle}>
                            站外分享
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        alignItems: 'center'
    },
    grayTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(12)
    },
    buttonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: px2dp(33),
        marginTop: px2dp(30),
        height: px2dp(48)
    },
    buttonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px2dp(5),
        borderColor: DesignRule.mainColor,
        borderWidth: px2dp(0.5)
    },
    buttonTextStyle: {
        color: DesignRule.mainColor,
        fontSize: px2dp(16)
    }
});
