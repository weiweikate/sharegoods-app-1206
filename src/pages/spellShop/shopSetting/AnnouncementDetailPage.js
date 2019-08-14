//公告详情页面
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import { MRText as Text } from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';

const Banner = res.shopSetting.banner_02;

export default class AnnouncementDetailPage extends BasePage {

    $navigationBarOptions = {
        title: '公告详情'
    };

    _render() {
        const { content, title } = this.params || {};
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        style={styles.container}>
                <ImageBackground style={styles.banner} source={Banner}>
                    <Text style={styles.title} allowFontScaling={false}>{title || ' '}</Text>
                </ImageBackground>
                <View style={styles.bgContainer}>
                    <Text style={styles.content} allowFontScaling={false}>
                        {content || ' '}
                    </Text>
                </View>
                <View style={styles.gap}/>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        marginTop: 27,
        fontWeight: '500',
        fontSize: 18,
        color: 'white'
    },
    bgContainer: {
        flex: 1,
        alignItems: 'center'
    },
    banner: {
        alignItems: 'center',
        width: ScreenUtils.width,
        height: 150 / 375 * ScreenUtils.width
    },
    content: {
        fontSize: 13,
        lineHeight: 24,
        color: DesignRule.textColor_mainTitle,
        marginTop: 48,
        marginHorizontal: 32
    },
    gap: {
        height: 32
    }
});
