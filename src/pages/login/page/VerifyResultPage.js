import BasePage from '../../../BasePage';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import resLogin from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import { UIText } from '../../../components/ui';
import LinearGradient from 'react-native-linear-gradient';
import res from '../../../comm/res';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { beginChatType, QYChatTool } from '../../../utils/QYModule/QYChatTool';
import { routePop } from '../../../navigation/RouterMap';

const { px2dp } = ScreenUtils;
export default class VerifyResultPage extends BasePage {

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    $navigationBarOptions = {
        show: true, // false则隐藏导航
        leftNavImage: res.other.close_X,
        leftImageStyle: { marginLeft: 10, width: 20, height: 20 },
        headerStyle: { borderBottomWidth: 0 }
    };

    $NavigationBarDefaultLeftPressed() {
        routePop(2);
    }

    toService = () => {
        track(trackEvent.ClickOnlineCustomerService
            , { customerServiceModuleSource: 1 });

        let params = {
            urlString: '',
            title: '平台客服',
            shopId: '',
            chatType: beginChatType.BEGIN_FROM_OTHER,
            data: {}
        };
        QYChatTool.beginQYChat(params);
    };

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <Image style={Styles.loginLogo} source={resLogin.login_logo}/>
                <Image style={{ width: 140, height: 140, marginTop: 22 }} source={resLogin.verify_result}/>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <UIText value={'验证失败'} style={{ fontWeight: 'bold', fontSize: 16, color: '#333' }}/>
                    <UIText value={'该异常账号已冻结，请联系平台客服'}
                            style={{ fontSize: 12, color: '#666', marginTop: 7 }}/>
                </View>
                <View style={{ flex: 1 }}>
                    <LinearGradient colors={['#FF1C89', '#FD0129']}
                                    style={[Styles.loginButton, { marginTop: px2dp(48) }]}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={Styles.touchableStyle}
                            onPress={() => {
                                // 密码登录
                                this.toService();
                            }}>
                            <UIText style={{ color: 'white', fontSize: px2dp(17) }} value={'联系平台客服'}/>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}


const Styles = StyleSheet.create({
    contentStyle: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginLogo: {
        width: px2dp(62),
        height: px2dp(45),
        marginTop: px2dp(48)
    },
    touchableStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButton: {
        height: px2dp(42),
        borderRadius: px2dp(22),
        width: ScreenUtils.width - px2dp(60),
        marginTop: px2dp(50)
    }
});
