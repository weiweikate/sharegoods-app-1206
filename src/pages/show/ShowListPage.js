import React from 'react'
import { View, StyleSheet } from 'react-native'
import BasePage from '../../BasePage'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp, onePixel } = ScreenUtils
import ShowHotView from './ShowHotView'
import ShowHotFindView from './ShowHotFindView'
export default class ShowListPage extends BasePage {
    $navigationBarOptions = {
        title: '发现',
        leftNavItemHidden: true
    }

    constructor(props) {
        super(props)
        this.$navigationBarOptions.leftNavItemHidden = this.params.fromHome ? false : true
    }

    _render() {
        const {navigation} = this.props
        console.log('this.params.fromHome', this.params.fromHome)
        return <View style={styles.container}>
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
