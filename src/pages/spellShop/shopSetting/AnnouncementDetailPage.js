//公告详情页面
import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    ImageBackground
} from 'react-native';
import Banner from './res/banner_02.png';
import BasePage from '../../../BasePage';

export default class AnnouncementDetailPage extends BasePage {

    $navigationBarOptions = {
        title: '公告详情'
    };

    _render() {
        const { content, title } = this.props.navigation.state.params || {};
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        style={styles.container}>
                <ImageBackground style={styles.banner} source={Banner}>
                    <Text style={styles.title}>{title || ' '}</Text>
                </ImageBackground>
                <View style={styles.bgContainer}>
                    <Text style={styles.content}>
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
        fontWeight: 'bold',
        fontSize: 18,
        color: '#ffffff'
    },
    bgContainer: {
        flex: 1,
        alignItems: 'center'
    },
    banner: {
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: 150 / 375 * Dimensions.get('window').width
    },
    content: {
        fontSize: 13,
        lineHeight: 24,
        color: 'rgb(34,34,34)',
        marginTop: 48,
        marginHorizontal: 32
    },
    gap: {
        height: 32
    }
});
