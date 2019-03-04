import { TabNavigator } from 'react-navigation';
import React from 'react';
import {Text, View} from 'react-native'
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


const NormalTab = ({source, title}) => {
    return <View style={styles.tab}>
    <Image style={styles.tabBarIcon} source={source}/>
    <Text style={styles.text}>{title}</Text>
    </View>
}

const ActiveTab = ({source, title}) => {
    return <View style={styles.tab}>
    <Image style={styles.tabBarIcon} source={source}/>
    <Text style={styles.activeText}>{title}</Text>
    </View>
}

const Tab = ({focused, activeSource, normalSource, title}) => {
    if (focused) {
        return <ActiveTab source={activeSource} title={title}/>
    }
    return <NormalTab source={normalSource} title={title}/>
}

export const TabNav = TabNavigator(
    {
        HomePage: {
            screen: Home,
            navigationOptions: {
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.home_n} activeSource={res.tab.home_s} title={'首页'}/>
            }
        },
        ShowListPage: {
            screen: ShowListPage,
            navigationOptions: {
                tabBarLabel: '秀场',
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.discover_n} activeSource={res.tab.discover_s} title={'秀场'}/>
            }
        },
        MyShop_RecruitPage: {
            screen: MyShop_RecruitPage,
            navigationOptions: {
                tabBarIcon: ({ focused }) => {
                    // return <Image style={styles.store} source={res.tab.home_store}/>
                    return <Tab focused={focused} normalSource={res.tab.group_n} activeSource={res.tab.group_s} title={'拼店'}/>
                }
            }
        },
        ShopCartPage: {
            screen: ShopCart,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.cart_n} activeSource={res.tab.cart_s} title={'购物车'}/>
            })
        },
        MinePage: {
            screen: Mine,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.mine_n} activeSource={res.tab.mine_s} title={'我的'}/>,
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
            showIcon: true,
            showLabel: false,
            //showLabel - 是否显示tab bar的文本，默认是true
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
    },
    store: {
        width: 40,
        height: 40
    },
    text: {
        color: '#666',
        fontSize: 11,
        marginTop: 4
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeText: {
        color: DesignRule.mainColor,
        fontSize: 11,
        marginTop: 4
    }
});
