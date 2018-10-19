/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/19.
 *
 */
"use strict";
import React from "react";
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    FlatList,
    TouchableOpacity
} from "react-native";
import BasePage from "../../../../BasePage";
import ScreenUtils from "../../../../utils/ScreenUtils";
import bg from './res/tuiguang_bg_nor.png'
const { px2dp,autoSizeWidth } = ScreenUtils;
type Props = {};
const promotions = ["50元推广试用套餐/推广周期7天", "50元推广试用套餐/推广周期7天", "50元推广试用套餐/推广周期7天", "50元推广试用套餐/推广周期7天"];
export default class InvitePromotionPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: "邀请推广",
        show: true// false则隐藏导航
    };

    goExplicationPage = () => {
        alert();
    };

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.goExplicationPage}>
                <Text style={{ color: "#666666", fontSize: px2dp(12) }}>
                    推广说明
                </Text>
            </TouchableOpacity>
        );
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }


    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
    }

    _itemRender({item}) {
        return(
            <View>
                <Text>
                    {item}
                </Text>
            </View>
        )
    }


    _render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={bg} style={styles.imageStyle}>
                    <Text style={{color:'white',fontSize:px2dp(20)}}>
                        邀请推广是什么？
                    </Text>
                    <Text style={{textAlign:'center',color:'white',fontSize:px2dp(13)}}>
                        平台拥有很多没有上级用户的会员，{`\n`}
                        您可以通过发送红包的方式进行绑定，{`\n`}
                        平台提供分享通道
                    </Text>
                </ImageBackground>
                <FlatList data={promotions}
                          renderItem={this._itemRender}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,


    },
    imageStyle:{
        width:ScreenUtils.width,
        height:autoSizeWidth(150),
        alignItems:'center',
        justifyContent:'space-between',
        paddingTop:px2dp(25),
        paddingBottom:px2dp(32)
    },
    itemWrapper:{

    }
});
