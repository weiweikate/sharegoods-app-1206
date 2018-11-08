//开店页面
import React from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import res from '../../../comm/res';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SuccessImg = res.button.tongyon_icon_check_green;

export default class OpenShopSuccessPage extends BasePage {

    $navigationBarOptions = {
        title: '开店成功'
    };

    _clickEnterShop = () => {
        this.props.navigation.popToTop();
    };

    _clickInvite = () => {
        this.$loadingShow();
        SpellShopApi.getById().then((data) => {
            //邀请好友页面
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

                    <Text style={styles.desc}>
                        恭喜你，开店成功
                    </Text>

                    <TouchableOpacity activeOpacity={0.5} onPress={this._clickEnterShop} style={styles.btnStyle}>
                        <Text style={styles.btnText}>
                            进入店铺
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity activeOpacity={0.8} onPress={this._clickInvite} style={[styles.btnStyle, {
                        marginTop: 0,
                        backgroundColor: '#e60012'
                    }]}>
                        <Text style={[styles.btnText, { color: '#fff' }]}>
                            马上邀请好友
                        </Text>
                    </TouchableOpacity>

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
        color: '#666666',
        marginTop: 19,
        textAlign: 'center'
    },
    btnStyle: {
        marginTop: 79,
        width: 150 / 375 * SCREEN_WIDTH,
        height: 48 / 375 * SCREEN_WIDTH,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f6523c',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 11
    },
    btnText: {
        fontSize: 16,
        color: '#e60012'
    }
});
