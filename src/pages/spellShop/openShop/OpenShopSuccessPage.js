//开店页面
import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import res from '../res';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import DesignRule from 'DesignRule';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SuccessImg = res.button.tongyon_icon_check_green;
import {
    MRText as Text
} from '../../../components/ui';


export default class OpenShopSuccessPage extends BasePage {

    $navigationBarOptions = {
        title: '拼店开店成功'
    };

    _clickEnterShop = () => {
        this.props.navigation.popToTop();
    };

    _clickInvite = () => {
        this.$loadingShow();
        SpellShopApi.getById().then((data) => {
            //分享好友页面
            this.$loadingDismiss();
            this.$navigate('spellShop/openShop/InvitationFriendPage', { shareInfo: data.data || {} });
        }).catch((error) => {
            this.$loadingDismiss();
            this.$toastShow(error.msg);
        });
    };

    _render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={styles.viewBg}>

                    <Image source={SuccessImg} style={styles.icon}/>

                    <Text style={styles.desc} allowFontScaling={false}>
                        开店成功
                    </Text>

                    <View style={{ flexDirection: 'row', marginTop: 79 }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={this._clickEnterShop} style={styles.btnStyle}>
                            <Text style={styles.btnText} allowFontScaling={false}>
                                进入店铺
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity activeOpacity={0.8} onPress={this._clickInvite} style={[styles.btnStyle, {
                            marginLeft: 20,
                            backgroundColor: DesignRule.mainColor
                        }]}>
                            <Text style={[styles.btnText, { color: '#fff' }]} allowFontScaling={false}>
                                马上分享好友
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewBg: {
        width: SCREEN_WIDTH,
        alignItems: 'center'
    },
    icon: {
        marginTop: 71
    },
    desc: {
        fontSize: 14,
        color: DesignRule.textColor_secondTitle,
        marginTop: 19,
        textAlign: 'center'
    },
    btnStyle: {
        width: 150 / 375 * SCREEN_WIDTH,
        height: 48 / 375 * SCREEN_WIDTH,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f6523c',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        fontSize: 16,
        color: DesignRule.mainColor
    }
});
