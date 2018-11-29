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
    Text,
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from 'DesignRule';
import { NavigationActions } from 'react-navigation';
import MentorItemView from '../components/MentorItemView';
import UIText from '../../../comm/components/UIText';


export default class MentorDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {};
    }

    $navigationBarOptions = {
        title: '选择导师',
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
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };


    _render() {
        return (
            <View style={styles.bgViewStyle}>
                <View
                    style={styles.topBgViewStyle}
                >
                    <MentorItemView
                    />
                    <UIText
                        value={'接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜' +
                        '接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜' +
                        '接胡搜接胡搜接胡搜接胡搜\n' +
                        '接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜接胡搜\' +\n' +
                        '                    \'接胡搜接胡搜接胡搜接胡搜\\n'}
                        style={styles.topTextViewStyle}
                    />
                </View>
                <View
                    style={styles.bottomBgViewStyle}
                >
                    <View
                        style={styles.bottomBtnBgViewStyle}
                    >
                        <UIText
                            value={'选择该导师'}
                            style={{
                                fontSize: 17,
                                color: DesignRule.white
                            }}
                            onPress={{

                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }
    _selectMentor=()=>{

    }
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
    topTextViewStyle:{
        padding: 20,
        color: DesignRule.textColor_secondTitle,
        fontSize: 12
    },
    bottomBgViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    bottomBtnBgViewStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.mainColor,
        height: 49,
        borderRadius:25,
        width:290
    },
    rightTopTitleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_secondTitle
    }
});
