//开店页面
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import res from '../res';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import { MRText as Text } from '../../../components/ui';
import { navigateBackToStore } from '../../../navigation/RouterMap';

const SuccessImg = res.button.tongyon_icon_check_green;


export default class OpenShopSuccessPage extends BasePage {

    $navigationBarOptions = {
        title: '拼店开店成功'
    };

    componentDidMount() {
        this.timeOut = setTimeout(navigateBackToStore, 1500);
    }

    componentWillUnmount() {
        this.timeOut && clearTimeout(this.timeOut);
    }

    _render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={SuccessImg} style={styles.icon}/>
                    <Text style={styles.title}>恭喜您开店成功</Text>
                    <Text style={styles.desc}>正在前往您的店铺…</Text>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    icon: {
        marginTop: 89, width: 72, height: 72
    },
    title: {
        fontSize: 23, color: DesignRule.textColor_mainTitle, marginTop: 20
    },
    desc: {
        fontSize: 15, color: DesignRule.textColor_instruction, marginTop: 10
    }
});
