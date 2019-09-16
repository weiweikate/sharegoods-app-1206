/**
 * @author xzm
 * @date 2019/4/3
 */

import React from 'react';
import {
    Clipboard,
    Image,
    ImageBackground,
    Linking,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import BasePage from '../../../../BasePage';
import { MRText as Text, MRTextInput as TextInput } from '../../../../components/ui';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import MineAPI from '../../api/MineApi';
import AvatarImage from '../../../../components/ui/AvatarImage';
import res from '../../res';
import bridge from '../../../../utils/bridge';
import SettingModel from '../../model/SettingModel';

const { icon_search, icon_clean } = res.myData;
const { px2dp } = ScreenUtils;
const {
    bg_fans_item
} = res.homeBaseImg;

const showFansVip = [
    res.showFans.fans_icon_v1,
    res.showFans.fans_icon_v2,
    res.showFans.fans_icon_v3,
    res.showFans.fans_icon_v4,
    res.showFans.fans_icon_v5
];
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


    _listItemRender = ({ item, index }) => {
        const uri = { uri: item.headImg };
        let name = (item.nickname && item.nickname.substring(0, 28)) || '';
        let num = item.level ? item.level : 10;
        // let percent = 0 + '';//item.percent ? item.percent + '%' : '0%';
        return (
            <ImageBackground key={index + 'showFans'} resizeMode={'stretch'} source={bg_fans_item}
                             style={styles.itemWrapper}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.fansIcon, { overflow: 'hidden' }]}>
                        <AvatarImage style={styles.fansIcon} source={uri}/>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.fansNameStyle} numberOfLines={1}>{name}</Text>
                            {num < 9 ? <Image source={showFansVip[num - 1]} style={styles.levelIcon}/> : null}
                        </View>
                        {/*{item.percent && item.percent > 0 ? <View style={{ marginLeft: 8, marginTop: 5 }}>*/}
                            {/*<View style={{*/}
                                {/*width: 100,*/}
                                {/*height: 10,*/}
                                {/*backgroundColor: 'rgba(65,150,100,0.1)',*/}
                                {/*borderRadius: 6*/}
                            {/*}}>*/}
                                {/*<View style={{*/}
                                    {/*flex: 1,*/}
                                    {/*width: percent,*/}
                                    {/*height: 4,*/}
                                    {/*backgroundColor: '#FF0450',*/}
                                    {/*borderRadius: 6*/}
                                {/*}}/>*/}
                            {/*</View>*/}
                            {/*<Text style={{ position: 'absolute', top: -2, left: 5, color: 'white', fontSize: 9 }}>*/}
                                {/*任务进度：{percent}*/}
                            {/*</Text>*/}
                        {/*</View> : null*/}
                        {/*}*/}
                    </View>

                    {SettingModel.WXChatState ? (item.weChatNumber ? <TouchableWithoutFeedback onPress={() => {
                        // 2、跳转代码
                        Linking.canOpenURL('weixin://').then(supported => { // weixin://  alipay://
                            if (supported) {
                                Clipboard.setString(item.weChatNumber);
                                bridge.$toast('复制微信号到剪切版');
                                Linking.openURL('weixin://');
                            } else {
                                bridge.$toast('请先安装微信');
                            }
                        });
                    }}>
                        <Image style={[styles.btnIcon, { marginRight: SettingModel.messageState ? 25 : 0 }]}
                               source={res.showFans.fans_WXChat}/>
                    </TouchableWithoutFeedback> : null) : null}

                    {item.showPhone ? <TouchableWithoutFeedback onPress={() => {
                        item.phone && Linking.openURL(`sms:${item.phone}`);
                    }}>
                        <Image style={[styles.btnIcon, { marginRight: 5 }]} source={res.showFans.messageIcon}/>
                    </TouchableWithoutFeedback> : null
                    }
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
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            fanName: ''
                        });
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
        color: '#2C2C2C',
        fontSize: DesignRule.fontSize_threeTitle,
        marginLeft: 8
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
    levelIcon: {
        width: px2dp(24),
        height: px2dp(16),
        marginLeft: px2dp(5)
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
        height: px2dp(40),
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
    },
    btnIcon: {
        width: px2dp(28),
        height: px2dp(28)
    }

});
