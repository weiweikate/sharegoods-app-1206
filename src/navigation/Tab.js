import { BottomTabBar, createBottomTabNavigator } from 'react-navigation-tabs';
import React, { Component } from 'react';
import { DeviceEventEmitter, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Home from '../pages/home/HomePage';
import Mine from '../pages/mine/page/MinePage';
import ShopCart from '../pages/shopCart/page/ShopCartPage';
import IsShowNewStore from '../pages/store/IsShowNewStore';
import res from '../comm/res';
import ShowListPage from '../pages/show/ShowListPage';
import user from '../model/user';
import settingModel from '../pages/mine/model/SettingModel';
import { homeTabManager } from '../pages/home/manager/HomeTabManager';
import DesignRule from '../constants/DesignRule';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import Animation from 'lottie-react-native';
import RouterMap from './RouterMap';
import { homeModule } from '../pages/home/model/Modules';
import StringUtils from '../utils/StringUtils';

@observer
class NormalTab extends Component {
    render() {
        const { source, title } = this.props;
        const { assistantImage } = homeModule.bottomIcons[0] || {};
        return <View style={styles.tab}>
            <View>
                <Image style={styles.tabBarIcon} source={source}/>
                {user.isLogin && title === '我的' && (settingModel.availableBalance > 0 || settingModel.userScore > 0
                    || settingModel.coupons > 0 || settingModel.fansMSG > 0 || settingModel.mainTask > 0) ?
                    <Image source={res.other.dot} style={styles.mineDot}/> : null}
            </View>
            <Text
                style={[styles.text, { color: StringUtils.isEmpty(assistantImage) ? '#666' : '#fff' }]}
            >{title}</Text>
        </View>;
    }
}

@observer
class ActiveTab extends Component {

    render() {
        const { source, title } = this.props;
        const { assistantImage } = homeModule.bottomIcons[0] || {};
        return <View style={styles.tab}>
            <Image style={styles.tabBarIcon} source={source}/>
            <Text
                style={[styles.text, { color: StringUtils.isEmpty(assistantImage) ? '#666' : '#fff' }]}
            >{title}</Text>
        </View>;
    }
}

@observer
class Tab extends Component {
    render() {
        if (this.props.focused) {
            return <ActiveTab source={this.props.activeSource} title={this.props.title}/>;
        }
        return <NormalTab source={this.props.normalSource} title={this.props.title}/>;
    }
}

@observer
class HomeTab extends Component {

    render() {
        const { assistantImage, image } = homeModule.bottomIcons[0] || {};
        if (StringUtils.isNoEmpty(assistantImage)) {
            return <Tab
                normalSource={{ uri: assistantImage }}
                activeSource={{ uri: image }}
                focused={homeTabManager.homeFocus || this.props.focused}
                title={'首页'}/>;
        } else {
            if (!homeTabManager.homeFocus || !this.props.focused) {
                return <Tab
                    normalSource={res.tab.home_n}
                    title={'首页'}/>;
            }
            return (
                <ImageBackground style={styles.home} source={res.tab.home_s_bg}>
                    <Animation
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={styles.home}
                        loop={false}
                        enableMergePathsAndroidForKitKatAndAbove={true}
                        imageAssetsFolder={'lottie/home'}
                        source={require('./tab_to_top.json')}/>
                </ImageBackground>
            );
        }
    }

    observeAboveRecommend = autorun(() => {
        const { aboveRecommend } = homeTabManager;
        this.animation && (aboveRecommend ? this.animation.play(0, 7) : this.animation.play(10, 17));
    });

    observeAboveFocused = autorun(() => {
        homeTabManager.homeFocus;
        this.animation && (this.animation.setNativeProps({ progress: homeTabManager.isAboveRecommend ? 0.5 : 1 }));
    }, { delay: 50 });
}

@observer
export class TabBarComponent extends Component {
    render() {
        const { expand } = homeModule.bottomIcons[0] || {};
        const { navColor } = StringUtils.str2Json(expand);
        return <BottomTabBar
            {...this.props}
            style={{
                backgroundColor: StringUtils.isEmpty(navColor) ? '#fff' : navColor,
                height: 48,
                borderTopWidth: 0.2,
                borderTopColor: '#ccc'
            }}/>;
    }
}

export const TabNav = createBottomTabNavigator(
    {
        HomePage: {
            screen: Home,
            navigationOptions: {
                tabBarIcon: ({ focused }) => <HomeTab
                    focused={focused}
                    title={'首页'}/>,
                tabBarOnPress: ({ navigation }) => {
                    if (navigation.isFocused()) {
                        DeviceEventEmitter.emit('retouch_home');
                    } else {
                        navigation.navigate(navigation.state.routeName);
                    }
                }
            }
        },
        ShowListPage: {
            screen: ShowListPage,
            navigationOptions: {
                tabBarLabel: '秀场',
                tabBarIcon: ({ focused }) => {
                    const { assistantImage, image } = homeModule.bottomIcons[1] || {};
                    return <Tab
                        focused={focused}
                        normalSource={StringUtils.isEmpty(assistantImage) ?
                            res.tab.discover_n : { uri: assistantImage }}
                        activeSource={StringUtils.isEmpty(image) ?
                            res.tab.discover_s : { uri: image }}
                        title={'秀场'}/>;
                },
                tabBarOnPress: ({ navigation }) => {
                    if (navigation.isFocused()) {
                        DeviceEventEmitter.emit('retouch_show');
                    } else {
                        navigation.navigate(navigation.state.routeName);
                    }
                }
            }
        },
        MyShop_RecruitPage: {
            screen: IsShowNewStore,
            navigationOptions: {
                tabBarIcon: ({ focused }) => {
                    const { assistantImage, image } = homeModule.bottomIcons[2] || {};
                    return <Tab
                        focused={focused}
                        normalSource={StringUtils.isEmpty(assistantImage) ?
                            res.tab.group_n : { uri: assistantImage }}
                        activeSource={StringUtils.isEmpty(image) ?
                            res.tab.group_s : { uri: image }}
                        title={'拼店'}/>;
                }
            }
        },
        ShopCartPage: {
            screen: ShopCart,
            navigationOptions: {
                tabBarIcon: ({ focused }) => {
                    const { assistantImage, image } = homeModule.bottomIcons[3] || {};
                    return <Tab
                        focused={focused}
                        normalSource={StringUtils.isEmpty(assistantImage) ?
                            res.tab.group_n : { uri: assistantImage }}
                        activeSource={StringUtils.isEmpty(image) ?
                            res.tab.cart_s : { uri: image }}
                        title={'购物车'}/>;
                }
            }
        },
        MinePage: {
            screen: Mine,
            navigationOptions: {
                tabBarIcon: ({ focused }) => {
                    const { assistantImage, image } = homeModule.bottomIcons[4] || {};
                    return <Tab
                        focused={focused}
                        normalSource={StringUtils.isEmpty(assistantImage) ?
                            res.tab.mine_n : { uri: assistantImage }}
                        activeSource={StringUtils.isEmpty(image) ?
                            res.tab.mine_s : { uri: image }}
                        title={'我的'}/>;
                },
                tabBarOnPress: ({ navigation }) => {
                    if (!navigation.isFocused()) {
                        if (user && user.isLogin) {
                            settingModel.mainTaskAdd();
                            navigation.navigate(navigation.state.routeName);
                        } else {
                            navigation.navigate(RouterMap.LoginPage);
                        }
                    }
                }
            }
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
            allowFontScaling: false,
            //tab 页指示符的样式 (tab页下面的一条线).
            indicatorStyle: { height: 0 }
        },
        tabBarComponent: props => (
            <TabBarComponent {...props} />
        ),
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
        width: 24,
        height: 24
    },
    home: {
        width: 44,
        height: 44
    },
    store: {
        width: 40,
        height: 40
    },
    text: {
        fontSize: 11,
        marginTop: 2,
        width: 60,
        textAlign: 'center'
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeText: {
        color: DesignRule.mainColor,
        fontSize: 11,
        marginTop: 4,
        width: 60,
        textAlign: 'center'
    },
    mineDot: {
        position: 'absolute',
        right: -6,
        top: 0,
        width: 16,
        height: 10
    }
});
