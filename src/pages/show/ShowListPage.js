import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import BasePage from '../../BasePage'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import ShowHotView from './ShowHotView'
import ShowHotFindView from './ShowHotFindView'
import backIconImg from '../../components/pageDecorator/NavigatorBar/source/icon_header_back.png'

export default class ShowListPage extends BasePage {
    $navigationBarOptions = {
        title: '',
        show: false
    }

    state = {
        page: 0,
        left: false
    }


    componentWillMount() {
        this.setState({ left: this.params.fromHome })
    }

    _gotoPage(number) {
        this.setState({page: number})
    }

    _onChangeTab(number) {
        this.setState({page: number.i})
    }

    _onLeftPressed() {
        this.props.navigation.goBack(null)
    }

    _render() {
        const {navigation} = this.props
        const {page, left} = this.state
        return <View style={styles.container}>
            <View style={styles.header}>
                {
                    left
                    ?
                    <TouchableOpacity style={styles.backImg}  onPress={()=>this._onLeftPressed()}>
                        <Image source={backIconImg} style={styles.img}/>
                    </TouchableOpacity>
                    :
                    <View style={styles.backImg}/>
                }
                <View style={styles.titleView}>
                    <TouchableOpacity style={styles.items} onPress={()=> this._gotoPage(0)}>
                        <Text style={page === 0 ? styles.activityIndex : styles.index}>精选热门</Text>
                        {page === 0 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>
                    <View style={{width: 50}}/>
                    <TouchableOpacity style={styles.items} onPress={()=> this._gotoPage(1)}>
                        <Text style={page === 1 ? styles.activityIndex : styles.index}>最新发现</Text>
                        {page === 1 ? <View style={styles.line}/> : null}
                    </TouchableOpacity>
                </View>
                <View style={styles.backImg}/>
            </View>
            <ScrollableTabView
                ref={(ref)=>this.scrollableTabView = ref}
                style={styles.tab}
                page={this.state.page}
                renderTabBar={() => <DefaultTabBar style={styles.tabBar}/>}
                tabBarUnderlineStyle={styles.underline}
                onChangeTab={(number)=>this._onChangeTab(number)}
            >
                <View key={1} style={styles.container} tabLabel="" >
                    <ShowHotView navigation={navigation}/>
                </View>
                <View key={2}  style={styles.container} tabLabel="   " >
                    <ShowHotFindView navigation={navigation}/>
                </View>
            </ScrollableTabView>
        </View>
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
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    backImg: {
        height:44,
        width: ScreenUtils.headerHeight,
        paddingLeft: 15,
        flexDirection: "row",
        alignItems: 'center'
    },
    img: {
        height: 15,
        width: 15
    },
    titleView: {
        flex: 1,
        height: 44,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    items: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    index: {
        color: '#999',
        fontSize: px2dp(14),
        fontWeight: '600',
        marginBottom: 16
    },
    activityIndex: {
        color: '#D51243',
        fontSize: px2dp(14),
        fontWeight: '600',
        marginBottom: 15
    },
    line: {
        backgroundColor: '#D51243',
        width: 30,
        height: 1
    }
})
