/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/10/16.
 *
 */


'use strict';

import React from 'react';
import { Animated, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../utils/ScreenUtils';
import { MRText as Text } from '../../components/ui';
import { DefaultTabBar } from '@mr/react-native-scrollable-tab-view';
import { tabModel } from './model/HomeTabModel';
import res from './res';
import RouterMap, { routePush } from '../../navigation/RouterMap';
import { observer } from 'mobx-react';
import { homeModule } from './model/Modules';
import StringUtils from '../../utils/StringUtils';
import DesignRule from '../../constants/DesignRule';

const tabBarHeight = ScreenUtils.autoSizeWidth(40);

@observer
export default class HomeTopTarBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            top: new Animated.Value(0)
        };

        this.isOpen = true;
    }


    componentDidMount() {
    }

    open = () => {
        if (this.isOpen === false) {
            Animated.timing(
                // Animate value over time
                this.state.top, // The value to drive
                {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }
            ).start();
            this.isOpen = true;
        }
    };


    close = () => {
        if (this.isOpen === true) {
            Animated.timing(
                // Animate value over time
                this.state.top, // The value to drive
                {
                    toValue: -tabBarHeight,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start();
            this.isOpen = false;
        }
    };

    scrollTo = (p) => {
        this.tab && this.tab.scrollTo(p);
    };


    render() {
        let p = this.props.p;
        let itemWidth = 60;
        const colorNormal = StringUtils.isEmpty(homeModule.categoryImg) ? DesignRule.textColor_instruction : '#fff';
        const colorSelect = StringUtils.isEmpty(homeModule.categoryImg) ? DesignRule.mainColor : '#fff';
        const colorUnderLine = StringUtils.isEmpty(homeModule.categoryImg) ? DesignRule.mainColor : '#fff';
        const resCategory = StringUtils.isEmpty(homeModule.categoryImg) ? res.category_main : res.category_white;
        return (
            <Animated.View style={{
                height: tabBarHeight,
                width: ScreenUtils.width,
                flexDirection: 'row',
                transform: [{ translateY: this.state.top }],
                alignItems: 'center',
                backgroundColor: StringUtils.isEmpty(homeModule.categoryImg) ? '#fff' : 'transparent',
                position: 'absolute',
                zIndex: 1
            }}>
                <ImageLoader
                    style={{
                        width: ScreenUtils.width,
                        height: tabBarHeight,
                        position: 'absolute'
                    }}
                    source={{ uri: homeModule.categoryImg }}
                    showPlaceholder={false}/>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ref={ref => {
                        this.tab = ref;
                    }}>
                    <DefaultTabBar
                        activeTab={p.activeTab}
                        style={{ width: itemWidth * p.tabs.length, borderBottomWidth: 0, height: tabBarHeight }}
                        containerWidth={itemWidth * p.tabs.length}
                        scrollValue={p.scrollValue}
                        tabs={p.tabs}
                        underlineStyle={{
                            backgroundColor: colorUnderLine,
                            left: (itemWidth - 20) / 2,
                            width: 18,
                            height: 2.5,
                            bottom: 8,
                            borderRadius: 2
                        }}
                        renderTab={(name, page, isTabActive) => {
                            let item = {};
                            let showType, navIcon, bottomNavIcon;
                            if (page === 0) {

                            } else {
                                item = tabModel.tabList[page - 1] || {};
                                showType = item.showType;
                                navIcon = item.navIcon;
                                bottomNavIcon = item.bottomNavIcon;
                            }
                            return (
                                <TouchableOpacity style={{
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: itemWidth
                                }} onPress={() => {
                                    tabModel.changeTabIndex(page);
                                    p.goToPage(page);
                                }} activeOpacity={0.7}>
                                    {showType === 2 ?
                                        <ImageLoader source={{ uri: isTabActive ? navIcon : bottomNavIcon }}
                                                     style={{
                                                         height: 36,
                                                         width: itemWidth
                                                     }}
                                        /> :
                                        <Text
                                            style={isTabActive ? [styles.tabSelect, { color: colorSelect }] : [
                                                styles.tabNomal, { color: colorNormal }
                                            ]}
                                            numberOfLines={1}>{name}</Text>
                                    }
                                </TouchableOpacity>
                            );
                        }}
                    />
                </ScrollView>
                <TouchableOpacity
                    style={{
                        marginTop: -6,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    activeOpacity={0.7}
                    onPress={() => routePush(RouterMap.CategorySearchPage)}>
                    <Image source={resCategory}
                           style={{ height: 38, width: 38 }}/>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    tabNomal: {
        fontSize: 13
    },
    tabSelect: {
        fontSize: 15
    }
});
