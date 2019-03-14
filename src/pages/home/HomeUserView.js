import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;
import user from '../../model/user';
import { observer } from 'mobx-react';
import res from './res';
import { MRText as Text } from '../../components/ui';

@observer
export default class HomeUserView extends Component {

    _goToPromotionPage() {
        const { navigate } = this.props;
        navigate('mine/userInformation/WaitingForWithdrawCashPage');
    }

    render() {
        if (!user.isLogin) {
            return null;
        }
        let { levelName } = user;
        return <View style={styles.container}>
            <View style={{ height: px2dp(13) }}/>
            <ImageBackground style={styles.inContainer} source={res.account_bg} resizeMode={'stretch'}>
                <View style={styles.left}/>
                <Text style={styles.title} allowFontScaling={false}>尊敬的</Text>
                {levelName
                    ?
                    <Text style={styles.text} allowFontScaling={false}>
                        {
                            levelName
                        }
                    </Text>
                    :
                    null}
                <Text style={styles.text} allowFontScaling={false}>品鉴官，</Text>
                <Text style={styles.title} allowFontScaling={false}>您好</Text>
                <View style={{ flex: 1 }}/>
                <TouchableOpacity style={styles.acount} onPress={() => this._goToPromotionPage()}>
                    <Text style={styles.see} allowFontScaling={false}>查看账户</Text>
                    <Image source={res.arrowRight}/>
                    <View style={{ width: 10 }}/>
                </TouchableOpacity>
            </ImageBackground>
        </View>;
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(44),
        width: ScreenUtil.width,
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        backgroundColor: '#fff'
    },
    inContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: px2dp(30),
        paddingBottom: px2dp(1)
    },
    left: {
        width: px2dp(20)
    },
    title: {
        color: '#333',
        fontSize: px2dp(14)
    },
    text: {
        color: '#333',
        fontSize: px2dp(14),
        fontWeight: '600'
    },
    see: {
        color: '#666',
        fontSize: px2dp(12),
        marginRight: px2dp(4)
    },
    acount: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
