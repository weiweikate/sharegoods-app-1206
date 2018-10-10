import React, {Component} from 'react'
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native'
import ScreenUtils from '../../utils/ScreenUtils'
import { AdModules , homeModule} from './Modules'
import {observer} from 'mobx-react';

@observer
export default class HomeAdView extends Component {
    constructor(props) {
        super(props)
        this.adModules = new AdModules()
        this.adModules.loadAdList()
    }
    _adAction(value) {
        const router =  homeModule.homeNavigate(value.linkType, value.linkTypeCode)
        const {navigation} = this.props
        navigation.navigate(router)
    }
    render() {
        const {ad} = this.adModules
        let items = []
        ad.map((value, index) => {
            if (index === 0) {
                items.push(<TouchableOpacity key={index} style={[styles.featureBox1]}  onPress={()=>this._adAction(value)}>
                    <Image
                        source={{ uri: value.imgUrl }}
                        style={styles.featureBox1Image}/>
                </TouchableOpacity>)
            } else if (index === 1) {
                items.push(
                    <TouchableOpacity key={index}  style={[styles.featureBox2]} onPress={()=>this._adAction(value)}>
                        <Image
                            source={{ uri: value.imgUrl}}
                            style={styles.featureBox2Image}/>
                    </TouchableOpacity>
                )
            } else {
                items.push(<TouchableOpacity key={index}  style={[styles.featureBox3]} onPress={()=>this._adAction(value)}>
                    <Image
                        source={{ uri:  value.imgUrl }}
                        style={styles.featureBox2Image}/>
                </TouchableOpacity>)
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
