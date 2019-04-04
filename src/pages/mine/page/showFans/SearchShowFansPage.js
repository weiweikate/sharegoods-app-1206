/**
 * @author xzm
 * @date 2019/4/3
 */

import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Image,
    PixelRatio,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import { MRText as Text, MRTextInput as TextInput } from '../../../../components/ui';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import MineAPI from '../../api/MineApi';
import AvatarImage from '../../../../components/ui/AvatarImage';
import res from '../../res';

const { icon_search, icon_clean } = res.myData;
const { px2dp } = ScreenUtils;
const {
    bg_fans_item
} = res.homeBaseImg;
type Props = {};
export default class SearchShowFansPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            fanName: '',
            searchRender: null
        };
    }

    $navigationBarOptions = {
        title: '我的秀迷',
        show: true
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
                        {`V${item.level ? item.level : 0}`}
                    </Text>
                </View>
            </ImageBackground>
        );
    };

    searchBarRender() {
        return (
            <View style={styles.bar_contain}>
                <View style={styles.searchBarWrapper}>
                    <Image source={icon_search} style={styles.searchIcon}/>
                    <TextInput
                        placeholder={'搜索'}
                        value={this.state.fanName}
                        onChangeText={(text) => {
                            this.setState({
                                fanName: text
                            }, () => {
                                this.list && this.list._onRefresh();
                            });
                        }} style={styles.textInputStyle}/>
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                            fanName:''
                        })
                    }}>
                        <Image source={icon_clean} style={styles.cleanIcon}/>
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback onPress={() => {
                    this.$navigateBack();
                }}>
                    <Text style={styles.cancelButtonStyle}>
                        取消
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        );
    }


    _render() {
        let params = this.params.levelId ? {
            levelId: this.params.levelId,
            fansName: this.state.fanName
        } : { fansName: this.state.fanName };
        return (
            <View style={styles.container}>
                {this.searchBarRender()}
                {this.state.fanName ? <RefreshFlatList
                    ref={(ref) => {
                        this.list = ref;
                    }}
                    style={styles.container}
                    url={MineAPI.getShowFansList}
                    renderItem={this._listItemRender}
                    renderEmpty={() => {
                        return <View/>;
                    }}
                    paramsFunc={() => {
                        return params;
                    }}
                /> : null}
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
        borderColor: DesignRule.mainColor,
        paddingHorizontal: 12
    },
    levelTextStyle: {
        color: DesignRule.mainColor,
        includeFontPadding: false,
        fontSize: DesignRule.fontSize_20
    },
    groupWrapper: {
        height: px2dp(44),
        width: DesignRule.width - DesignRule.margin_page * 2,
        backgroundColor: DesignRule.white,
        borderRadius: px2dp(5),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(10),
        alignSelf: 'center',
        marginTop: px2dp(15)
    },
    levelName: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    numTextStyle: {
        fontSize: px2dp(12),
        color: DesignRule.textColor_instruction,
        flex: 1,
        textAlign: 'right'
    },
    bar_contain: {
        width: DesignRule.width,
        height: px2dp(50),
        backgroundColor: DesignRule.white,
        marginTop: -1.0 / PixelRatio.get(),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: px2dp(15),
        flexDirection: 'row'
    },
    searchBarWrapper: {
        flex: 1,
        height: px2dp(34),
        borderRadius: px2dp(17),
        backgroundColor: '#F7F7F7',
        flexDirection: 'row',
        alignItems: 'center'
    },
    cancelButtonStyle: {
        color: '#999999',
        fontSize: px2dp(13),
        marginLeft: px2dp(10)
    },
    searchIcon: {
        width: px2dp(18),
        height: px2dp(18),
        marginLeft: px2dp(10)
    },
    textInputStyle: {
        flex: 1,
        fontSize: px2dp(13),
        marginLeft: px2dp(10)
    },
    cleanIcon: {
        width: px2dp(16),
        height: px2dp(16),
        marginLeft: px2dp(10),
        marginRight: px2dp(10)
    }

});
