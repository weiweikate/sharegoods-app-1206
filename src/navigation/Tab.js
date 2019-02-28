import { TabNavigator } from 'react-navigation';
import React from 'react';
import Home from '../pages/home/HomePage';
import Mine from '../pages/mine/page/MinePage';
import ShopCart from '../pages/shopCart/page/ShopCartPage';
import MyShop_RecruitPage from '../pages/spellShop/MyShop_RecruitPage';
import { StyleSheet, Image } from 'react-native';
import res from '../comm/res';
import ScreenUtils from '../utils/ScreenUtils';
import ShowListPage from '../pages/show/ShowListPage';
import user from '../model/user';
import RouterMap from './RouterMap';
import DesignRule from '../constants/DesignRule';

export const TabNav = TabNavigator(
    {
        HomePage: {
            screen: Home,
            navigationOptions: {
                tabBarLabel: '首页ssd',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={res.tab.discover_s}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={res.tab.discover_n}/>
                    );
                }
            }
        },
        ShowListPage: {
            screen: ShowListPage,
            navigationOptions: {
                tabBarLabel: '秀场',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={res.tab.discover_s}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={res.tab.discover_n}/>
                    );
                }
            }
        },
        MyShop_RecruitPage: {
            screen: MyShop_RecruitPage,
            navigationOptions: {
                tabBarLabel: '拼店',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={res.tab.group_s}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={res.tab.group_n}/>
                    );
                }
            }
        },
        ShopCartPage: {
            screen: ShopCart,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: '购物车',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={res.tab.cart_s}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={res.tab.cart_n}/>
                    );
                }
            })
        },
        MinePage: {
            screen: Mine,
            navigationOptions: ({ navigation }) => ({
                tabBarLabel: '我的',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={res.tab.mine_s}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={res.tab.mine_n}/>
                    );
                },
                tabBarOnPress: (tab) => {
                    const { jumpToIndex, scene } = tab;
                    if (user && user.isLogin) {
                        jumpToIndex(scene.index);
                    } else {
                        navigation.navigate(RouterMap.LoginPage);
                    }
                }
            })
        }
    },
    {
        tabBarOptions: {

            //当前选中的tab bar的文本颜色和图标颜色
            activeTintColor: DesignRule.mainColor,
            //当前未选中的tab bar的文本颜色和图标颜色
            inactiveTintColor: '#000',
            //是否显示tab bar的图标，默认是false
            showIcon: true,
            //showLabel - 是否显示tab bar的文本，默认是true
            showLabel: true,
            //是否将文本转换为大小，默认是true
            upperCaseLabel: false,
            //material design中的波纹颜色(仅支持Android >= 5.0)
            pressColor: '#788493',
            //按下tab bar时的不透明度(仅支持iOS和Android < 5.0).
            pressOpacity: 0.8,
            //tab bar的样式
            style: {
                backgroundColor: '#fff',
                paddingBottom: ScreenUtils.safeBottomMax + 1,
                height: 50,
                borderTopWidth: 0.2,
                paddingTop: 1,
                borderTopColor: '#ccc'
            },
            //tab bar的文本样式
            labelStyle: {
                fontSize: 11,
                margin: 1
            },
            allowFontScaling : false,
            //tab 页指示符的样式 (tab页下面的一条线).
            indicatorStyle: { height: 0 }
        },
        //tab bar的位置, 可选值： 'top' or 'bottom'
        tabBarPosition: 'bottom',
        //是否允许滑动切换tab页
        swipeEnabled: false,
        //是否在切换tab页时使用动画
        animationEnabled: false,
        //是否懒加载
        lazy: true,
        //返回按钮是否会导致tab切换到初始tab页？ 如果是，则设置为initialRoute，否则为none。 缺省为initialRoute。
        backBehavior: 'none'
    });
const styles = StyleSheet.create({
    tabBarIcon: {
        width: 21,
        height: 21
    }
});
