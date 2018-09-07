//拼店tab页面
import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableWithoutFeedback,
    Text
} from 'react-native';

// 图片资源
import IntroduceImg from './src/hhk_03.png';
import IntroduceImg1 from './src/hhk_031.png';

import NavigatorBar from '../../components/pageDecorator/NavigatorBar';
import ScreenUtils from '../../utils/ScreenUtils';
import BasePage from '../../BasePage';

import { observer } from 'mobx-react';

@observer
export default class SpellShopPage extends BasePage {

    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        show: false
    };

    _onRefresh = () => {

    };

    _clickSearchItem = () => {
        this.$navigate('spellShop/recommendSearch/RecommendPage');
    };

    _renderBarRight = () => {
        return <View style={styles.rightBarItemContainer}>
            <TouchableWithoutFeedback style={styles.rightItemBtn} onPress={this._clickSearchItem}>
                <View>
                    <Text>推荐 </Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback style={styles.rightItemBtn} onPress={this._clickSearchItem}>
                <View>
                    <Text> 店铺</Text>

                </View>
            </TouchableWithoutFeedback>
        </View>;
    };

    _renderContainer = () => {
        return {
            bar: true,
            cmp: <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={this._onRefresh}/>}
                             showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                    <Image style={styles.levelLow} source={IntroduceImg} resizeMode='stretch'/>
                    <Image style={styles.levelLow1} source={IntroduceImg1} resizeMode='stretch'/>
                </View>
            </ScrollView>
        };
    };

    _render() {
        const { bar, cmp } = this._renderContainer();
        return (
            <View style={styles.container}>
                {bar && <NavigatorBar leftNavItemHidden={true} title={'拼店'} renderRight={this._renderBarRight}/>}
                {cmp}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    levelLow: {
        width: ScreenUtils.width,
        height: ScreenUtils.height - ScreenUtils.headerHeight - ScreenUtils.tabBarHeight
    },
    levelLow1: {
        position: 'absolute',
        marginTop: ScreenUtils.isIOSX ? ScreenUtils.autoSizeHeight(78 + 60) : ScreenUtils.autoSizeHeight(78),
        width: ScreenUtils.autoSizeWidth(375 - 59 * 2),
        height: ScreenUtils.autoSizeWidth(257),
        alignSelf: 'center'
    }
});

