import React, { Component } from 'react';
import {
    View, ScrollView,
    RefreshControl, ImageBackground
} from 'react-native';
import SpellStatusModel from './SpellStatusModel';
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
                <NavigatorBar leftNavItemHidden={true}
                              title={'拼店'}/>
                <ScrollView showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl title="下拉刷新"
                                                            tintColor={DesignRule.textColor_instruction}
                                                            titleColor={DesignRule.textColor_instruction}
                                                            refreshing={false}
                                                            colors={[DesignRule.mainColor]}
                                                            onRefresh={() => {
                                                                SpellStatusModel.requestHome();
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
