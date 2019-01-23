/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by feng on 2018/11/28.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule'
import UIText from '../../../components/ui/UIText';
import LoginAPI from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import res from '../../../comm/res';
// import ImageLoad from '@mr/image-placeholder'
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';
import { homeRegisterFirstManager } from '../../home/model/HomeRegisterFirstManager';
import {MRText as Text} from '../../../components/ui'

export default class MentorDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: '选择服务顾问',
        show: true// false则隐藏导航
    };

    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={styles.rightTopTitleStyle} onPress={this.jump}>
                跳过
            </Text>
        );
    };
    /**
     * 跳过函数
     */
    jump = () => {
        bridge.$toast('注册成功');
        LoginAPI.givePackage().then(result => {
            homeRegisterFirstManager.setShowRegisterModalUrl(result.data.give);
            this.$navigateBackToHome();
        }).catch(error => {
            this.$navigateBackToHome();
        });
    };

    _render() {
        const itemData = this.params.itemData;
        console.log('详情页面');
        console.log(itemData);
        return (
            <View style={styles.bgViewStyle}>
                <View
                    style={styles.topBgViewStyle}
                >
                    {/*<MentorItemView*/}
                    {/*itemData={itemData}*/}
                    {/*isSelect={true}*/}
                    {/*/>*/}
                    {/*<View*/}
                    {/*style={{*/}
                    {/*width: 80,*/}
                    {/*height: 80,*/}
                    {/*borderRadius: 40*/}
                    {/*}}*/}
                    {/*>*/}
                    <PreLoadImage
                        imageUri={itemData.headImg}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40
                        }}
                        defaultImage={res.placeholder.noHeadImage}
                        errImage={res.placeholder.noHeadImage}
                    />
                    {/*</View>*/}
                    <UIText
                        value={itemData.nickname ? itemData.nickname : '暂无昵称~'}
                        style={styles.topTextViewStyle}
                    />
                    <UIText
                        value={itemData.profile ? itemData.profile : '暂无简介~'}
                        style={styles.topTextViewStyle}
                    />
                </View>
                <View
                    style={styles.bottomBgViewStyle}
                >
                    <TouchableOpacity
                        onPress={
                            () => {
                                this._selectMentor();
                            }
                        }
                    >
                        <View
                            style={styles.bottomBtnBgViewStyle}
                        >
                            <UIText
                                value={'选择该服务顾问'}
                                style={{
                                    fontSize: 17,
                                    color: DesignRule.white
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _selectMentor = () => {
        let mentorData = this.params.itemData;
        LoginAPI.mentorBind({
            code: mentorData.perfectNumberCode
        }).then(res => {
            this.$toastShow('选择成功');
            homeRegisterFirstManager.setShowRegisterModalUrl(res.data.give);
            this.$navigateBackToHome()
        }).catch(res => {
            this.$toastShow(res.msg)

        });
    };
}

const styles = StyleSheet.create({
    bgViewStyle: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1
    },
    topBgViewStyle: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50
    },
    topTextViewStyle: {
        padding: 20,
        color: DesignRule.textColor_secondTitle,
        fontSize: 12
    },
    bottomBgViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    bottomBtnBgViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.mainColor,
        height: 49,
        borderRadius: 25,
        width: 290
    },
    rightTopTitleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_secondTitle
    }
});
