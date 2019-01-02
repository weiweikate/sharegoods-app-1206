import React, {Component} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
import { homeModule} from './Modules'
import { adModules } from './HomeAdModel'
import {observer} from 'mobx-react';
import ImageLoad from '@mr/image-placeholder'
const { px2dp }  = ScreenUtils

@observer
export default class HomeAdView extends Component {
    _adAction(value) {
        const router =  homeModule.homeNavigate(value.linkType, value.linkTypeCode)
        const {navigate} = this.props
        const params = homeModule.paramsNavigate(value)
        navigate(router, {...params, preseat:'home_ad'})
    }

    _loadingIndicator() {
        return <View style={{flex: 1, backgroundColor: '#f00'}}/>
    }

    render() {
        const {ad} = adModules
        let items = []
        ad.map((value, index) => {
            if (index === 0) {
                items.push(<TouchableWithoutFeedback key={index} onPress={()=>this._adAction(value)}>
                    <View style={[styles.featureBox1, styles.radius]}>
                    <ImageLoad cacheable={true} source={{ uri: value.imgUrl }} style={styles.featureBox1Image}/>
                    </View>
                </TouchableWithoutFeedback>)
            } else if (index === 1) {
                items.push(
                    <TouchableWithoutFeedback key={index} onPress={()=>this._adAction(value)}>
                        <View style={[styles.featureBox2,styles.radius]}>
                        <ImageLoad cacheable={true} source={{ uri: value.imgUrl}} style={styles.featureBox2Image}/>
                        </View>
                    </TouchableWithoutFeedback>
                )
            } else {
                items.push(<TouchableWithoutFeedback key={index}onPress={()=>this._adAction(value)}>
                    <View style={[styles.featureBox3, styles.radius]}>
                    <ImageLoad source={{ uri:  value.imgUrl }} style={styles.featureBox2Image} cacheable={true}/>
                    </View>
                </TouchableWithoutFeedback>)
            }
        })
       return <View style={styles.container}>
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
    container: {
        backgroundColor: '#fff',
        marginTop:  ScreenUtils.px2dp(10),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    featureBox: {
        position: 'relative',
        height: ScreenUtils.px2dp(200),
    },
    featureBox1: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200),
    },
    radius: {
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    featureBox1Image: {
        width: ScreenUtils.px2dp(185),
        height: ScreenUtils.px2dp(200)
    },
    featureBox2: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(97)
    },
    featureBox2Image: {
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(97)
    },
    featureBox3: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: ScreenUtils.px2dp(153),
        height: ScreenUtils.px2dp(97)
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
