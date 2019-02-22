import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import BasePage from '../../BasePage';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../utils/ScreenUtils';
import RecycleHeaderView from './components/RecycleHeaderView'
const { px2dp } = ScreenUtils;
// import ShowHotView from './ShowHotView';
// import ShowHotFindView from './ShowHotFindView';
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

    _press = ({nativeEvent})=>{
        let data = nativeEvent;
        // data.click = data.click + 1;
        // this.recommendModules.recommendList.replace
        this.$navigate('show/ShowDetailPage', { id: data.id, code: data.code });
    }

    _render() {
        const { page, left, needsExpensive } = this.state;

        let HotView = null;
        // let HotFindView = null;
        if (needsExpensive) {
            HotView = require('./ShowHotView').default;
            // HotFindView = require('./ShowHotFindView').default;
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
                        <View style={styles.backImg}/>
                }
                <View style={styles.titleView}>
                    <TouchableOpacity style={styles.items} onPress={() => this._gotoPage(0)}>
                        <Text style={page === 0 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>精选热门</Text>
                        {page === 0 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>
                    <View style={{ width: 50 }}/>
                    <TouchableOpacity style={styles.items} onPress={() => this._gotoPage(1)}>
                        <Text style={page === 1 ? styles.activityIndex : styles.index}
                              allowFontScaling={false}>最新秀场</Text>
                        {page === 1 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>
                </View>
                <View style={styles.backImg}/>
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
                            <HotView navigate={this.$navigate} ref={(ref) => {
                                this.showHotViewRef = ref;
                            }} pageFocus={this.state.pageFocused}/>
                            :
                            null
                    }
                </View>
                <View key={2} style={styles.container} tabLabel="   ">
                    {
                        needsExpensive
                            ?

                            <ShowGroundView style={{flex:1}}
                                            onItemPress={({nativeEvent})=> {

                                                this.$navigate('show/ShowDetailPage', { id: nativeEvent.id, code: nativeEvent.code });}}
                            >
                                <RecycleHeaderView style={{height:50,width:50,backgroundColor:'red',flex:1}}/>

                            </ShowGroundView>

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
        width: ScreenUtils.headerHeight,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        height: 15,
        width: 15
    },
    titleView: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    items: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    index: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(14),
        fontWeight: '600',
        marginBottom: 16
    },
    activityIndex: {
        color: DesignRule.mainColor,
        fontSize: px2dp(14),
        fontWeight: '600',
        marginBottom: 15
    },
    line: {
        backgroundColor: DesignRule.mainColor,
        width: 30,
        height: 2,
        borderRadius: 1
    }
});
