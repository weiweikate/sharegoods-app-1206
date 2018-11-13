import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenUtil from '../../utils/ScreenUtils';
const { px2dp } = ScreenUtil;
import user from '../../model/user'
import { observer } from 'mobx-react'
import res from './res'
@observer
export default class HomeUserView extends Component {

    _goToPromotionPage() {
        const { navigation } = this.props;
        navigation && navigation.navigate('mine/MyPromotionPage');
    }

    render() {
        if (!user.isLogin) {
            return <View/>
        }
        let { levelName } = user
        if (!levelName) {
            return <View/>
        }
        return  <View style={styles.container}>
            <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 0}}  colors={['#fff6e7', '#fedb99']} style={styles.inContainer}>
                <Text style={styles.title}>尊敬的</Text><View style={styles.levelName}><Text style={styles.text}>{levelName}</Text></View><Text style={styles.text}>品鉴官，您好！</Text>
                <View style={{flex: 1}}/>
                <TouchableOpacity onPress={() => this._goToPromotionPage()}>
                    <ImageBackground style={styles.btnBack} source={res.userLevel} resizeMode={'stretch'}>
                        <Text style={styles.see}>特权查看</Text>
                        <View style={{width: 8}}/>
                        <Image source={res.arrowRight}/>
                    </ImageBackground>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(44),
        width: ScreenUtil.width
    },
    inContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        marginLeft: px2dp(25),
        color: '#9D732A',
        fontSize: px2dp(14)
    },
    text: {
        color: '#9D732A',
        fontSize: px2dp(14)
    },
    levelName: {
        paddingLeft: px2dp(7),
        paddingRight: px2dp(7),
        margin: px2dp(2),
        borderRadius: px2dp(10),
        borderWidth: 0.5,
        height: px2dp(20),
        borderColor: '#9D732A',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnBack: {
        width: px2dp(74),
        height: px2dp(20),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginRight: px2dp(17),
        borderRadius: px2dp(10)
    },
    see: {
        color: '#fff',
        fontSize: px2dp(11)
    }
});
