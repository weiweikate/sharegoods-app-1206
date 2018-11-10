import React, { Component } from 'react';
import {
    Text, StyleSheet, View, ScrollView,
    RefreshControl
} from 'react-native';
import SpellStatusModel from './model/SpellStatusModel';
import ScreenUtils from '../../utils/ScreenUtils';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';

import DesignRule from 'DesignRule';

export default class NoAccessPage extends Component {

    _renderRow = (title, index, maxIndex) => {
        return (
            <View style={{ width: ScreenUtils.width }} key={index}>

                <View style={{ marginHorizontal: 15 }}>

                    {index !== 0 ?
                        <View style={{
                            marginLeft: 8,
                            width: 2,
                            backgroundColor: DesignRule.mainColor,
                            height: 33
                        }}/> : null}

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <View style={styles.circle}>
                                <Text style={styles.circleText}>{index + 1}</Text>
                            </View>
                            {index !== maxIndex - 1 ?
                                <View style={{
                                    marginLeft: 8,
                                    width: 2,
                                    backgroundColor: DesignRule.mainColor,
                                    flex: 1
                                }}/> : null}
                        </View>

                        <Text style={styles.desc}>{title}</Text>

                    </View>
                </View>

            </View>

        );
    };

    render() {
        const arr = [
            '拼店是什么？',
            '拼店的玩法和价值',
            '拼店能给你带来哪些好处'
        ];
        return (
            <View style={{ flex: 1 }}>
                <NavigatorBar leftNavItemHidden={this.props.leftNavItemHidden}
                              leftPressed={() => {
                                  this.props.navigation.goBack();
                              }}
                              title={'拼店'}/>
                <ScrollView showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl title="下拉刷新"
                                                            tintColor={DesignRule.textColor_instruction}
                                                            titleColor={DesignRule.textColor_instruction}
                                                            refreshing={SpellStatusModel.refreshing}
                                                            onRefresh={() => {
                                                                SpellStatusModel.getUser(1);
                                                            }}/>}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            alignSelf: 'center',
                            marginTop: 41,
                            fontSize: 17,
                            color: DesignRule.textColor_mainTitle
                        }}>等级未注册用户</Text>
                        <View style={{ marginTop: 32 }}>
                            {
                                arr.map((item, index) => {
                                    return this._renderRow(item, index, arr.length);
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    circle: {
        width: 18,
        height: 18,
        backgroundColor: DesignRule.mainColor,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9
    },
    circleText: {
        fontSize: 12,
        color: 'white'
    },
    desc: {
        marginLeft: 8,
        marginRight: 0,
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    }
});
