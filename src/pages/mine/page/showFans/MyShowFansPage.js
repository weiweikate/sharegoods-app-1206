/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/12/25.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground
} from 'react-native';
import BasePage from '../../../../BasePage';
import { MRText as Text } from '../../../../components/ui';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import MineAPI from '../../api/MineApi';
import res from '../../res';
import AvatarImage from '../../../../components/ui/AvatarImage';
const {
    bg_fans_item
} = res.homeBaseImg;
type Props = {};
export default class MyShowFansPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            fansNum: null
        };
    }

    $navigationBarOptions = {
        title: '我的秀迷',
        show: true// false则隐藏导航
    };


    _listItemRender = ({ item }) => {
        const uri = { uri: item.headImg };
        return (
            <ImageBackground resizeMode={'stretch'} source={bg_fans_item} style={styles.itemWrapper}>
                <View style={[styles.fansIcon, { overflow: 'hidden' }]}>
                    <AvatarImage style={styles.fansIcon} source={uri}/>
                </View>
                <Text style={styles.fansNameStyle}>
                    {item.nickname}
                </Text>

                    <View style={styles.levelWrapper}>
                        <Text style={styles.levelTextStyle}>
                            {`V${item.level ? item.level  : 0}`}
                        </Text>
                    </View>

            </ImageBackground>
        );
    };

    _headerRender = () => {
        if (this.state.fansNum) {
            return (
                <Text style={styles.headerTextWrapper}>
                    {`秀迷人数： ${this.state.fansNum}人`}
                </Text>
            );
        } else {
            return null;
        }
    };

    _render() {
        return (
            <View style={styles.container}>

                {/*{this._listItemRender()}*/}
                <RefreshFlatList
                    style={styles.container}
                    url={MineAPI.getShowFansList}
                    renderItem={this._listItemRender}
                    // totalPageNum={(result)=> {return result.data.isMore ? 10 : 0}}
                    renderHeader={this._headerRender}
                    onStartRefresh={this.loadPageData}
                    handleRequestResult={(result) => {
                        this.setState({
                            fansNum: result.data.totalNum
                        });
                        return result.data.data;
                    }}

                    // ref={(ref) => {this.list = ref}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemWrapper: {
        height: 66 * 240 / 195,
        width: (ScreenUtils.width - DesignRule.margin_page * 2) * 1071 / 1030,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: DesignRule.margin_page + 5,
        marginTop: 3,
        alignSelf: 'center'
    },
    fansIcon: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    fansNameStyle: {
        color: DesignRule.textColor_mainTitle_222,
        fontSize: DesignRule.fontSize_mainTitle,
        marginLeft: 8,
        paddingVertical: 5
    },
    typeWrapper: {
        width: 55,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noActivateTextStyle: {
        fontSize: DesignRule.fontSize_20,
        color: DesignRule.textColor_secondTitle
    },
    activateTextStyle: {
        fontSize: DesignRule.fontSize_20,
        color: DesignRule.mainColor
    },
    headerTextWrapper: {
        marginLeft: DesignRule.margin_page,
        marginTop: 15,
        fontSize: DesignRule.fontSize_threeTitle,
        color: DesignRule.textColor_secondTitle
    },
    levelWrapper: {
        borderRadius: 2,
        height: 15,
        justifyContent: 'center',
        borderWidth: 1,
        marginLeft: 15,
        borderColor:DesignRule.mainColor,
        paddingHorizontal:12,
    },
    levelTextStyle: {
        color: DesignRule.mainColor,
        includeFontPadding: false,
        fontSize: DesignRule.fontSize_20
    }

});
