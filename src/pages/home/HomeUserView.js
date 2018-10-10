import React, {Component} from 'react'
import { View, StyleSheet, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import ProgressBar from '../../components/ui/ProgressBar'
import ScreenUtil from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtil

const Circle = ({sizeStyle}) => <View style={[styles.circle, sizeStyle]}/>

const Level = ({levelStyle, sizeStyle, text}) => <View style={levelStyle}> 
    <Text style={styles.level}>{text}</Text>
    <Circle sizeStyle={sizeStyle}/>
</View>

export default class HomeUserView extends Component {
    render () {
        return(
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
                    <View style={styles.right}>                   
                    </View>
                </LinearGradient>
            </View>
        )
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
        width: px2dp(90)
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
    }
})
