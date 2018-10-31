import { TabNavigator } from 'react-navigation';
import React from 'react';
import Home from './pages/home/HomePage';
// import Mine from './pages/mine/page/MinePage';
import Mine from './pages/mine/page/NewMinePage';
import ShopCart from './pages/shopCart/page/ShopCartPage';
import SpellShop from './pages/spellShop/SpellShopPage';
import {
    StyleSheet,
    Image
} from 'react-native';
import CommTabImag from './comm/res/CommTabImag';
import ColorUtil from './utils/ColorUtil';
import ScreenUtils from './utils/ScreenUtils';
import ShowListPage from './pages/show/ShowListPage';
import discoverImg from './comm/res/tab_discover_selected.png';
import undiscoverImg from './comm/res/tab_discover_unselected.png';

export const TabNav = TabNavigator(
    {
        HomePage: {
            screen: Home,
            navigationOptions: {
                tabBarLabel: '主页',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={CommTabImag.home_Tab_img.img_Sel}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={CommTabImag.home_Tab_img.img_Nor}/>
                    );
                }
            }
        },
        ShowListPage: {
            screen: ShowListPage,
            navigationOptions: {
                tabBarLabel: '发现',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={discoverImg}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={undiscoverImg}/>
                    );
                }
            }
        },
        SpellShopPage: {
            screen: SpellShop,
            navigationOptions: {
                tabBarLabel: '拼店',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={CommTabImag.spellShop_Tab_img.img_Sel}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={CommTabImag.spellShop_Tab_img.img_Nor}/>
                    );
                }
            }
        },
        ShopCartPage: {
            screen: ShopCart,
            navigationOptions: {
                tabBarLabel: '购物车',
                tabBarIcon: ({ focused }) => {
                    if (focused) {
                        return (
                            <Image style={styles.tabBarIcon} source={CommTabImag.shopCart_Tab_img.img_Sel}/>
                        );
                    }
                    return (
                        <Image style={styles.tabBarIcon} source={CommTabImag.shopCart_Tab_img.img_Nor}/>
                    );
                }
            }
        },
        MinePage: {
            screen: Mine,
            navigationOptions:
                {
                    tabBarLabel: '我的',
                    tabBarIcon: ({ focused }) => {
                        if (focused) {
                            return (
                                <Image style={styles.tabBarIcon} source={CommTabImag.mine_Tab_img.img_Sel}/>
                            );
                        }
                        return (
                            <Image style={styles.tabBarIcon} source={CommTabImag.mine_Tab_img.img_Nor}/>
                        );
                    }
                }

        }

    },
    {
        tabBarOptions: {

            //当前选中的tab bar的文本颜色和图标颜色
            activeTintColor: ColorUtil.mainRedColor,
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
                height: 50 + ScreenUtils.safeBottomMax,
                borderTopWidth: 0.2,
                paddingTop: 1,
                borderTopColor: '#ccc'
            },
            //tab bar的文本样式
            labelStyle: {
                fontSize: 11,
                margin: 1
            },
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
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    tabBarIcon: {
        width: 21,
        height: 21
    }
});
