import React from 'react'
import { View, StyleSheet } from 'react-native'
import BasePage from '../../BasePage'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtils
import ShowHotView from './ShowHotView'
import ShowHotFindView from './ShowHotFindView'
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar'
export default class ShowListPage extends BasePage {
    $navigationBarOptions = {
        title: '发现',
        show: false
    }

    _render() {
        const {navigation} = this.props
        return <View style={styles.container}>
            <NavigatorBar leftNavItemHidden={this.params.fromHome} title={'拼店'}/>
            <ScrollableTabView
                style={styles.tab}
                tabBarActiveTextColor={'#D51234'}
                tabBarInactiveTextColor={'#666'}
                tabBarUnderlineStyle={styles.underline}
                tabBarTextStyle={styles.tabText}
                tabBarBackgroundColor={'#fff'}
            >
                <View style={styles.container} tabLabel="精选热门" >
                    <ShowHotView navigation={navigation}/>
                </View>
                <View style={styles.container}  tabLabel="热门发现" >
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
        height: onePixel,
        backgroundColor: '#D51234'
    },
    tab: {
        height: px2dp(50)
    },
    tabText: {
        fontSize: 14,
        paddingTop: 10
    }
})
