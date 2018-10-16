import React from 'react'
import { View, StyleSheet } from 'react-native'
import BasePage from '../../BasePage'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtils

export default class ShowListPage extends BasePage {
    constructor(props) {
        super(props)
    }
    $navigationBarOptions = {
        title: '发现',
        show: true
    }
    _render() {
        return <View style={styles.container}>
            <ScrollableTabView
                style={styles.tab}
                tabBarActiveTextColor={'#D51234'}
                tabBarInactiveTextColor={'#666'}
                tabBarUnderlineStyle={styles.underline}
                tabBarTextStyle={styles.tabText}
            >
                <View tabLabel="精选热门" />
                <View tabLabel="热门发现" />
            </ScrollableTabView>
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
