import React, {Component} from 'react'
import {View, StyleSheet, Image} from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
import { AdModules } from './Modules'
import {observer} from 'mobx-react';

@observer
export default class HomeAdView extends Component {
    constructor(props) {
        super(props)
        this.adModules = new AdModules()
        this.adModules.loadAdList()
    }
    render() {
        const {ad} = this.adModules
        let items = []
        ad.map((value, index) => {
            console.log(' ad.map ',value)
            if (index === 0) {
                items.push(<View key={index} style={[styles.featureBox1]}>
                    <Image
                        source={{ uri: value.imgUrl }}
                        style={styles.featureBox1Image}/>
                </View>)
            } else if (index === 1) {
                items.push(
                    <View key={index}  style={[styles.featureBox2]}>
                        <Image
                            source={{ uri: value.imgUrl}}
                            style={styles.featureBox2Image}/>
                    </View>
                )
            } else {
                items.push(<View key={index}  style={[styles.featureBox3]}>
                    <Image
                        source={{ uri:  value.imgUrl }}
                        style={styles.featureBox2Image}/>
                </View>)
            }
        })
       return <View>
           {
               items.length > 0
               ?
               <View style={[styles.box, { paddingTop: 10, paddingBottom: 10 }]}>
                    <View style={styles.featureBox}>
                        {items}
                    </View>
                </View>
                :
                null
           }
       </View>
    }
}

const styles = StyleSheet.create({
    featureBox: {
        position: 'relative',
        height: ScreenUtils.px2dp(200),
        marginLeft: ScreenUtils.px2dp(12),
        marginRight: ScreenUtils.px2dp(12)
    },
    featureBox1: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200)
    },
    featureBox1Image: {
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200),
        borderRadius: 5
    },
    featureBox2: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96)
    },
    featureBox2Image: {
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96),
        borderRadius: 5
    },
    featureBox3: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(96)
    },

    // 行样式
    rowCell: {
        paddingLeft: 10,
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between'
    },
    eventRowsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 15
    }
})
