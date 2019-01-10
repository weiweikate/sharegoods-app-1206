//开店页面
import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import spellStatusModel from '../model/SpellStatusModel';
import DesignRule from '../../../constants/DesignRule';
import {
    MRText as Text
} from '../../../components/ui';

export default class OpenShopSuccessPage extends BasePage {

    $navigationBarOptions = {
        title: '支付测试页面'
    };

    _click = () => {
        SpellShopApi.depositTest().then(() => {
            spellStatusModel.getUser(2);
            this.$navigate('spellShop/shopSetting/SetShopNamePage');
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    height: 49,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: 'white'
                }}>
                    <Text style={{ flex: 1, marginLeft: 24 }}>应付款：0元</Text>
                    <TouchableOpacity
                        onPress={this._click}
                        style={{
                            backgroundColor: DesignRule.mainColor,
                            width: 109,
                            height: 49,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Text style={{ color: 'white' }}>去支付</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
