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
import {
    Animated,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import ImageLoader from '@mr/image-placeholder';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import { MRText as Text } from '../../components/ui';
import { DefaultTabBar } from '@mr/react-native-scrollable-tab-view';
import { tabModel } from './model/HomeTabModel';
import res from './res'
import { routePush } from '../../navigation/RouterMap';
import RouterMap from '../../navigation/RouterMap';
const category = res.category;

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
    }


    close = () => {
        if (this.isOpen === true) {
            Animated.timing(
                // Animate value over time
                this.state.top, // The value to drive
                {
                    toValue: -42,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start();
            this.isOpen = false;
        }
    };

    scrollTo = (p) => {
        this.tab &&  this.tab.scrollTo(p);
    }


  render() {
      let p = this.props.p;
      let itemWidth = 60;
      let tabBarHeight = 42;
    return (
          <Animated.View style={{ height: tabBarHeight,
              width: ScreenUtils.width,
              backgroundColor: 'white',
              position: 'absolute',
              paddingHorizontal: 15,
              zIndex: 1,
              transform: [{ translateY: this.state.top }],
              flexDirection: 'row',
              alignItems: 'center'
          }}>
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
                          backgroundColor: DesignRule.mainColor,
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
                                  tabModel.changeTabIndex(page)
                                  p.goToPage(page);
                              }} activeOpacity={0.7}>
                                  {showType === 2 ?
                                      <ImageLoader source={{ uri: isTabActive ? navIcon : bottomNavIcon }}
                                                   style={{
                                                       height: 36,
                                                       width: itemWidth
                                                   }}
                                      /> :
                                      <Text style={isTabActive ? styles.tabSelect : styles.tabNomal}
                                            numberOfLines={1}>{name}</Text>
                                  }
                              </TouchableOpacity>
                          );
                      }}
                  />
              </ScrollView>
              <TouchableOpacity
                  style={{ marginTop: -6}}
                  activeOpacity={0}
              onPress={ () => routePush(RouterMap.CategorySearchPage)}>
              <Image source={category}
                     style={{height: 30, width: 30}}
              />
              </TouchableOpacity>
          </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
    tabNomal: {
        fontSize: 12,
        color: '#999999'
    },
    tabSelect: {
        fontSize: 14,
        color: DesignRule.mainColor
    }
});
