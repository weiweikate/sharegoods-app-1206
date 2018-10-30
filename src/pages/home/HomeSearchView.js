/*
* 首页查询
*/

import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import ScreenUtils from "../../utils/ScreenUtils";

const { px2dp, statusBarHeight } = ScreenUtils;
import logoImg from "./res/logo.png";
import searchImg from "./res/icon_search.png";
import msgImg from "./res/message.png";
import UIText from "../../components/ui/UIText";

export default ({ navigation }) =>
    <View style={styles.navBar}>
        <Image source={logoImg} style={styles.logo}/>
        <TouchableOpacity style={styles.searchBox}
                          onPress={() => navigation.navigate("home/search/SearchPage")}>
            <Image source={searchImg} style={styles.searchIcon}/>
            <UIText style={styles.inputText} value={"请输入关键词搜索"}/>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("message/MessageCenterPage")}>
            <Image source={msgImg} style={styles.scanIcon}/>
        </TouchableWithoutFeedback>
    </View>


let styles = StyleSheet.create({
    navBar: {
        flexDirection: "row",
        paddingLeft: px2dp(10),
        paddingRight: px2dp(10),
        height: statusBarHeight + 44,
        paddingTop: statusBarHeight,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 4
    },
    logo: {
        height: 27,
        width: 35
    },
    searchBox: {
        height: 30,
        flexDirection: "row",
        flex: 1,  // 类似于android中的layout_weight,设置为1即自动拉伸填充
        borderRadius: 15,  // 设置圆角边
        backgroundColor: "white",
        alignItems: "center",
        marginLeft: 8,
        marginRight: 10,
        opacity: 0.8
    },
    scanIcon: {
        height: 24,
        width: 24
    },
    searchIcon: {
        marginLeft: 10,
        marginRight: 10,
        width: 16,
        height: 16
    },
    inputText: {
        flex: 1,
        color: "#666666",
        fontSize: 14
    }
});
