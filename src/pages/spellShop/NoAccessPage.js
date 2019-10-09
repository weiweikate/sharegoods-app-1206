import React, { Component } from 'react';
import {
    View, ScrollView,
    RefreshControl, ImageBackground
} from 'react-native';
import SpellStatusModel from './model/SpellStatusModel';
import ScreenUtils from '../../utils/ScreenUtils';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import DesignRule from '../../constants/DesignRule';
import res from './res';
import { backToHome, routeNavigate, routePush } from '../../navigation/RouterMap';
import NoMoreClick from '../../components/ui/NoMoreClick';
import user from '../../model/user';
import RouterMap from '../../navigation/RouterMap';

const { pindianzhaojiling, pindianzhaojilingbg } = res;

export default class NoAccessPage extends Component {
    render() {
        const imgWidth = ScreenUtils.width;
        const imgHeight = ScreenUtils.height - ScreenUtils.headerHeight - (this.props.leftNavItemHidden ? ScreenUtils.tabBarHeight : 0);
        return (
            <View style={{ flex: 1 }}>
                <NavigatorBar leftNavItemHidden={this.props.leftNavItemHidden}
                              leftPressed={() => {
                                  this.props.navigation.goBack();
                              }}
                              title={this.props.leftNavItemHidden ? '拼店' : '店铺详情'}/>
                <ScrollView showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl title="下拉刷新"
                                                            tintColor={DesignRule.textColor_instruction}
                                                            titleColor={DesignRule.textColor_instruction}
                                                            refreshing={SpellStatusModel.refreshing}
                                                            colors={[DesignRule.mainColor]}
                                                            onRefresh={() => {
                                                                SpellStatusModel.getUser(1);
                                                            }}/>}>
                    <ImageBackground
                        style={{ width: imgWidth, height: imgHeight }}
                        source={pindianzhaojilingbg}
                        resizeMode='stretch'>
                        <ImageBackground style={{ width: imgWidth, height: imgHeight }}
                                         source={pindianzhaojiling}
                                         resizeMode='contain'>
                            <NoMoreClick style={{ flex: 1 }} onPress={() => {
                                backToHome();
                            }}/>
                            <NoMoreClick style={{ flex: 1 }} onPress={() => {
                                if (!user.isLogin) {
                                    routeNavigate(RouterMap.LoginPage);
                                    return;
                                }
                                if (user.upUserCode) {
                                    routePush(RouterMap.MyMentorPage);
                                } else {
                                    backToHome();
                                }
                            }}/>
                        </ImageBackground>
                    </ImageBackground>
                </ScrollView>
            </View>
        );
    }
}
