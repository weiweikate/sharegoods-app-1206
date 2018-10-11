import React, {Component} from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import ProgressBar from '../../components/ui/ProgressBar'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil
import rightImg from './res/right_arrow.png'
import user from '../../model/user'
import {observer} from 'mobx-react';

const Circle = ({sizeStyle}) => <View style={[styles.circle, sizeStyle]}/>

const Level = ({levelStyle, sizeStyle, text}) => <View style={levelStyle}>
    <Text style={styles.level}>{text}</Text>
    <Circle sizeStyle={sizeStyle}/>
</View>

@observer
export default class HomeUserView extends Component {
    _goToPromotionPage() {
        const {navigation} = this.props
        navigation && navigation.navigate('mine/MyPromotionPage')
    }
    render () {
        return <View>
        {
            user.isLogin
            ?
            <View style={styles.container}>
                <LinearGradient colors={['#F7D795', '#F7D794']} style={styles.inContainer}>
                    <View style={styles.left}>
                        <Text style={styles.title}>尊敬的V2会员您好</Text>
                        <View style={styles.progressView}>
                            <View style={styles.progress}>
                                <ProgressBar
                                    fillStyle={{backgroundColor:'#E7AE39',height: 4, borderRadius: 2,}}
                                    backgroundStyle={{backgroundColor: '#9B6D26', borderRadius: 2, height:4 }}
                                    style={{marginTop: 10, width: px2dp(220), height: 4}}
                                    progress={0.3}
                                    />
                            </View>
                            <Level levelStyle={{marginLeft: 24}} sizeStyle={styles.smallCircle} text='V1'/>
                            <Level levelStyle={{marginLeft: px2dp(200) / 5}}  sizeStyle={styles.smallCircle} text='V2'/>
                            <Level levelStyle={{marginLeft: px2dp(200) / 5}} sizeStyle={styles.smallCircle} text='V3'/>
                            <Level levelStyle={{marginLeft: px2dp(200) / 5}} sizeStyle={styles.smallCircle} text='V4'/>
                            <Level levelStyle={{marginLeft: px2dp(200) / 5}} sizeStyle={styles.smallCircle} text='V5'/>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.right}  onPress={()=>this._goToPromotionPage()}>
                        <View style={[styles.circle, styles.bigCircle]}>
                            <Text style={styles.see}>特权查看</Text>
                            <Image style={styles.rightImg} source={rightImg}/>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            :
            null
        }
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(87),
        width: ScreenUtil.width,
        backgroundColor: '#fff',
        marginTop: px2dp(10)
    },
    inContainer: {
        flex: 1,
        marginTop: px2dp(10),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: px2dp(5),
        flexDirection: 'row'
    },
    title: {
        marginTop: px2dp(10),
        marginLeft: px2dp(10),
        color: '#333',
        fontSize: px2dp(14)
    },
    left: {
        flex: 1
    },
    right: {
        width: px2dp(90),
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressView: {
        flex: 1,
        marginLeft: 0,
        flexDirection: 'row'
    },
    circle: {
        borderColor: '#E7AE39'
    },
    smallCircle: {
        borderWidth: px2dp(2),
        backgroundColor: '#fff',
        width: px2dp(12),
        height: px2dp(12),
        borderRadius: px2dp(6)
    },
    bigCircle: {
        borderWidth: px2dp(4),
        backgroundColor: '#fff',
        width: px2dp(50),
        height: px2dp(50),
        borderRadius: px2dp(25),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    progress: {
        position: 'absolute',
        left:  px2dp(28),
        top: px2dp(15),
        width: px2dp(220),
        height: px2dp(5)
    },
    level: {
        color: '#9B6D26',
        fontSize: px2dp(11),
        height: px2dp(19)
    },
    see: {
        marginLeft: px2dp(4),
        color: '#9B6D26',
        fontSize: px2dp(11),
        width: 30
    },
    rightImg: {
        marginLeft: 0
    }
})
