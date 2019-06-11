import { TabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { DeviceEventEmitter, Text, View, TouchableWithoutFeedback } from 'react-native';
import Home from '../pages/home/HomePage';
import Mine from '../pages/mine/page/MinePage';
import ShopCart from '../pages/shopCart/page/ShopCartPage';
import MyShop_RecruitPage from '../pages/spellShop/MyShop_RecruitPage';
import { StyleSheet, Image, ImageBackground } from 'react-native';
import res from '../comm/res';
import ScreenUtils from '../utils/ScreenUtils';
import ShowListPage from '../pages/show/ShowListPage';
import user from '../model/user';
import { homeTabManager } from '../pages/home/manager/HomeTabManager';
import DesignRule from '../constants/DesignRule';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import Animation from 'lottie-react-native';
import { TrackApi } from '../utils/SensorsTrack';


const NormalTab = ({ source, title }) => {
    return <View style={styles.tab}>
        <Image style={styles.tabBarIcon} source={source}/>
        <Text style={styles.text}>{title}</Text>
    </View>;
};

const ActiveTab = ({ source, title }) => {
    return <View style={styles.tab}>
        <Image style={styles.tabBarIcon} source={source}/>
        <Text style={styles.activeText}>{title}</Text>
    </View>;
};

const Tab = ({ focused, activeSource, normalSource, title }) => {
    if (focused) {
        return <ActiveTab source={activeSource} title={title}/>;
    }
    return <NormalTab source={normalSource} title={title}/>;
};

@observer
class HomeTab extends Component {

    render() {
        if (!homeTabManager.homeFocus || !this.props.focus) {
            return <Tab normalSource={res.tab.home_n} title={'首页'}/>;
        }
        return (
            <ImageBackground style={styles.home} source={res.tab.home_s_bg}>
                <Animation
                    ref={animation => {
                        this.animation = animation;
                    }}
                    style={styles.home}
                    loop={false}
                    imageAssetsFolder={'lottie/home'}
                    source={require('./tab_to_top.json')}/>
            </ImageBackground>
        );
    }

    observeAboveRecommend = autorun(() => {
        const { aboveRecommend } = homeTabManager;
        this.animation && (aboveRecommend ? this.animation.play(0, 7) : this.animation.play(10, 17));
    });

    componentDidUpdate(prevProps) {
        const { aboveRecommend } = homeTabManager;
        this.animation && (this.animation.setNativeProps({ progress: aboveRecommend ? 0.5 : 1 }));
    }
}

const gotoMyShop = () => {
    if (global.$navigator) {
        global.$navigator._navigation.popToTop();
        global.$navigator._navigation.navigate('MyShop_RecruitPage');
    }
};

const ShowFlag = () =>

    <TouchableWithoutFeedback onPress={() => {
        gotoMyShop();
    }}>
        <View
            style={{
                position: 'absolute',
                width: ScreenUtils.width,
                height: ScreenUtils.width * 254 / 559,
                bottom: ScreenUtils.safeBottom + 46
            }}>
            <Animation
                style={styles.shopFlag}
                autoPlay={true}
                loop={true}
                hardwareAccelerationAndroid={true}
                source={require('./pin_flag.json')}/>
        </View>
    </TouchableWithoutFeedback>;

@observer
export class SpellShopFlag extends Component {

    render() {
        if (!this.props.isShowFlag) {
            return null;
        }
        if (!user) {
            return null;
        }
        if (!user.isLogin) {
            return null;
        }
        if (user.levelRemark >= 'V2' && !user.storeCode) {
            return <ShowFlag/>;
        }
        if (user.storeCode && user.levelRemark >= 'V2' && user.storeStatus === 0) {
            return <ShowFlag/>;
        }
        return null;
    }
}

const ShowTab = () =>
    <TouchableWithoutFeedback onPress={() => {
        gotoMyShop();
    }}>
        <Image
            style={styles.shopTab}
            source={require('./pin_tab.png')}/>
    </TouchableWithoutFeedback>;

@observer
export class SpellShopTab extends Component {
    render() {
        if (!this.props.isShowTab) {
            return null;
        }
        if (!user) {
            return null;
        }
        if (!user.isLogin) {
            return null;
        }
        if (user.levelRemark >= 'V2' && !user.storeCode) {
            return <ShowTab/>;
        }
        if (user.storeCode && user.levelRemark >= 'V2' && user.storeStatus === 0) {
            return <ShowTab/>;
        }

        return null;
    }
}

export const TabNav = TabNavigator(
    {
        HomePage: {
            screen: Home,
            navigationOptions: {
                tabBarIcon: ({ focused }) => <HomeTab normalSource={res.tab.home_n}
                                                      title={'首页'} focus={focused}/>,
                tabBarOnPress: (tab) => {
                    const { jumpToIndex, scene, previousScene } = tab;
                    if (previousScene.key !== 'HomePage') {
                        jumpToIndex(scene.index);
                    } else {
                        DeviceEventEmitter.emit('retouch_home');
                    }
                }
            }
        },
        ShowListPage: {
            screen: ShowListPage,
            navigationOptions: {
                tabBarLabel: '秀场',
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.discover_n}
                                                  activeSource={res.tab.discover_s} title={'秀场'}/>,
                tabBarOnPress: (tab) => {
                    const { jumpToIndex, scene, previousScene } = tab;
                    if (previousScene.key !== 'ShowListPage') {
                        jumpToIndex(scene.index);
                        TrackApi.WatchXiuChang({ xiuChangModuleSource: 1 });
                    } else {
                        DeviceEventEmitter.emit('retouch_show');
                    }
                }
            }
        },
        MyShop_RecruitPage: {
            screen: MyShop_RecruitPage,
            navigationOptions: {
                tabBarIcon: ({ focused }) => {
                    return <Tab focused={focused} normalSource={res.tab.group_n} activeSource={res.tab.group_s}
                                title={'拼店'}/>;
                }
            }
        },
        ShopCartPage: {
            screen: ShopCart,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.cart_n}
                                                  activeSource={res.tab.cart_s} title={'购物车'}/>
            })
        },
        MinePage: {
            screen: Mine,
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused }) => <Tab focused={focused} normalSource={res.tab.mine_n}
                                                  activeSource={res.tab.mine_s} title={'我的'}/>,
                tabBarOnPress: (tab) => {
                    const { jumpToIndex, scene } = tab;
                    if (user && user.isLogin) {
                        jumpToIndex(scene.index);
                    } else {
                        // alert(RouterMap.LoginPage);
                        navigation.navigate('login/login/LoginPage');
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
                height: 48,
                borderTopWidth: 0.2,
                borderTopColor: '#ccc'
            },
            allowFontScaling: false,
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
        color: '#666',
        fontSize: 11,
        marginTop: 4,
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
    shopFlag: {
        flex: 1
    },
    shopTab: {
        position: 'absolute',
        width: 44,
        height: 44,
        left: (ScreenUtils.width / 2) - 22,
        bottom: ScreenUtils.safeBottom
    }
});
