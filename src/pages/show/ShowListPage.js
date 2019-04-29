import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import BasePage from '../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import backIconImg from '../../comm/res/button/icon_header_back.png';
import DesignRule from '../../constants/DesignRule';
import { observer } from 'mobx-react';
import {
    MRText as Text
} from '../../components/ui';
import ShowGroundView from './components/ShowGroundView';

@observer
export default class ShowListPage extends BasePage {

    $navigationBarOptions = {
        title: '',
        show: false
    };

    static navigationOptions = {};

    state = {
        page: 0,
        left: false,
        pageFocused: false,
        needsExpensive: false
    };

    handleBackPress = () => {
        if (this.state.left) {
            return false;
        } else {
            this.$navigate('HomePage');
            return true;
        }
    };


    componentWillMount() {
        this.setState({ left: this.params.fromHome });
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                console.log('ShowListPage willFocus', state);
                if (state && (state.routeName === 'ShowListPage' || state.routeName === 'show/ShowListPage')) {
                    this.setState({
                        pageFocused: true
                    });
                }

            }
        );
        this.didBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

                this.pageFocused = false;
                const { state } = payload;
                if (state && state.routeName === 'HomePage') {
                    this.setState({ isShow: false });
                }
                this.setState({
                    pageFocused: false
                });
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
                this.setState({
                    pageFocused: true
                });
            }
        );
        this.setState({ needsExpensive: true });
    }


    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
        this.didBlurSubscription && this.didBlurSubscription.remove();
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    _gotoPage(number) {
        this.setState({ page: number });
    }

    _onChangeTab(number) {
        this.setState({ page: number.i });
    }

    _onLeftPressed() {
        this.props.navigation.goBack(null);
    }

    _press = ({ nativeEvent }) => {
        let data = nativeEvent;
        // data.click = data.click + 1;
        // this.recommendModules.recommendList.replace
        this.$navigate('show/ShowDetailPage', { id: data.id, code: data.code });
    };

    _render() {
        let that = this;
        const { page, left, needsExpensive } = this.state;

        let HotView = null;
        if (needsExpensive) {
            HotView = require('./ShowHotView').default;
        }

        return <View style={styles.container}>
            <View style={styles.header}>
                {
                    left
                        ?
                        <TouchableOpacity style={styles.backImg} onPress={() => this._onLeftPressed()}>
                            <Image source={backIconImg} style={styles.img}/>
                        </TouchableOpacity>
                        :
                        null
                }
                <View style={[{ marginLeft: left ? px2dp(10) : px2dp(15) }, styles.userIcon]}/>
                <View style={{flex:1}}/>
                <View style={styles.titleView}>
                    <TouchableOpacity style={styles.items} onPress={() => this._gotoPage(0)}>
                        <Text style={[{marginRight:px2dp(20)},page === 0 ? styles.activityIndex : styles.index]}
                              allowFontScaling={false}>推荐</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[{marginRight:px2dp(20)},styles.items]}onPress={() => this._gotoPage(1)}>
                        <Text style={page === 1 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>素材圈</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.items,{marginRight:px2dp(20)}]} onPress={() => this._gotoPage(2)}>
                        <Text style={page === 2 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>发现</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.items} onPress={() => this._gotoPage(3)}>
                        <Text style={page === 3 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>活动</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}/>
                <View style={[{marginRight:px2dp(15)}, styles.userIcon]}/>
            </View>
            <ScrollableTabView
                ref={(ref) => this.scrollableTabView = ref}
                style={styles.tab}
                page={this.state.page}
                renderTabBar={() => <DefaultTabBar style={styles.tabBar}/>}
                tabBarUnderlineStyle={styles.underline}
                onChangeTab={(number) => this._onChangeTab(number)}
                showsVerticalScrollIndicator={false}
            >
                <View key={1} style={styles.container} tabLabel="">
                    {
                        needsExpensive
                            ?
                            <HotView navigate={this.$navigate} pageFocus={this.state.pageFocused}/>
                            :
                            null
                    }
                </View>
                <View key={2} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ?

                            <ShowGroundView
                                ref={(ref) => {
                                    this.rightShowList = ref;
                                }}
                                style={{ flex: 1 }}
                                uri={'/discover/query@GET'}
                                onNineClick={({ nativeEvent }) => {
                                    that.$navigate('show/ShowDetailImagePage', {
                                        imageUrls: nativeEvent.imageUrls,
                                        index: nativeEvent.index
                                    });
                                }}
                                onItemPress={({ nativeEvent }) => {
                                    that.$navigate('show/ShowDetailPage', {
                                        id: nativeEvent.id,
                                        code: nativeEvent.code,
                                        ref: this.rightShowList,
                                        index: nativeEvent.index
                                    });
                                }}
                            />
                            :
                            null
                    }
                </View>

                <View key={3} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ?

                            <ShowGroundView
                                ref={(ref) => {
                                    this.rightShowList = ref;
                                }}
                                style={{ flex: 1 }}
                                uri={'/discover/query@GET'}
                                onNineClick={({ nativeEvent }) => {
                                    that.$navigate('show/ShowDetailImagePage', {
                                        imageUrls: nativeEvent.imageUrls,
                                        index: nativeEvent.index
                                    });
                                }}
                                onItemPress={({ nativeEvent }) => {
                                    that.$navigate('show/ShowDetailPage', {
                                        id: nativeEvent.id,
                                        code: nativeEvent.code,
                                        ref: this.rightShowList,
                                        index: nativeEvent.index
                                    });
                                }}
                            />
                            :
                            null
                    }
                </View>

                <View key={4} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ?

                            <ShowGroundView
                                ref={(ref) => {
                                    this.rightShowList = ref;
                                }}
                                style={{ flex: 1 }}
                                uri={'/discover/query@GET'}
                                onNineClick={({ nativeEvent }) => {
                                    that.$navigate('show/ShowDetailImagePage', {
                                        imageUrls: nativeEvent.imageUrls,
                                        index: nativeEvent.index
                                    });
                                }}
                                onItemPress={({ nativeEvent }) => {
                                    that.$navigate('show/ShowDetailPage', {
                                        id: nativeEvent.id,
                                        code: nativeEvent.code,
                                        ref: this.rightShowList,
                                        index: nativeEvent.index
                                    });
                                }}
                            />
                            :
                            null
                    }
                </View>
            </ScrollableTabView>
        </View>;
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    },
    underline: {
        height: 0
    },
    tab: {
        height: 0,
        borderWidth: 0
    },
    tabBar: {
        height: 0,
        borderWidth: 0
    },
    header: {
        height: ScreenUtils.headerHeight,
        paddingTop: ScreenUtils.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    backImg: {
        height: 44,
        width: 45,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        height: 15,
        width: 15
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
    },
    items: {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    index: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13),
        fontWeight: '600',
    },
    activityIndex: {
        color: DesignRule.mainColor,
        fontSize: px2dp(15),
        fontWeight: '600',
    },
    line: {
        backgroundColor: DesignRule.mainColor,
        width: 30,
        height: 2,
        borderRadius: 1
    },
    userIcon: {
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: px2dp(15),
        backgroundColor: 'red'
    }
});
