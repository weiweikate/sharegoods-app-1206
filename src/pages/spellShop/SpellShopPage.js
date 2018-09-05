//拼店tab页面
import React, { Component } from "react";
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl
} from "react-native";
import { NavigatorBar } from "jr-baseview";
import ScreenUtils from "../../utils/ScreenUtils";
// 图片资源
import IntroduceImg from "./src/hhk_03.png";
import IntroduceImg1 from "./src/hhk_031.png";
import { observer } from "mobx-react";

@observer
export default class SpellShopPage extends Component {

    // 页面配置
    static jrPageOptions = {
        navigationBarOptions: {
            hideNavBar: true
        }
    };

    constructor(props) {
        super(props);
    }

    _onRefresh = () => {

    };

    _renderContainer = () => {


        return {
            bar: true,
            cmp: <ScrollView refreshControl={<RefreshControl
                refreshing={false}
                onRefresh={this._onRefresh}
            />}
                             showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1 }}>
                    <Image style={styles.levelLow} source={IntroduceImg} resizeMode='stretch'/>
                    <Image style={styles.levelLow1} source={IntroduceImg1} resizeMode='stretch'/>
                </View>
            </ScrollView>
        };

    };

    render() {
        const { bar, cmp } = this._renderContainer();
        return (
            <View style={styles.container}>
                {bar && <NavigatorBar leftNavItemHidden={true} title={"拼店"}/>}
                {cmp}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    levelLow: {
        width: ScreenUtils.width,
        height: ScreenUtils.height - ScreenUtils.headerHeight - ScreenUtils.tabBarHeight
    },
    levelLow1: {
        position: "absolute",
        marginTop: ScreenUtils.isIOSX ? ScreenUtils.autoSizeHeight(78 + 60) : ScreenUtils.autoSizeHeight(78),
        width: ScreenUtils.autoSizeWidth(375 - 59 * 2),
        height: ScreenUtils.autoSizeWidth(257),
        alignSelf: "center"
    }
});

