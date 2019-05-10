import BasePage from '../../../../BasePage';
import React from 'react';

import {
    StyleSheet,
    View,
    ImageBackground,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ImageLoad from '@mr/image-placeholder';

const { px2dp } = ScreenUtils;
import res from '../../../spellShop/res';
import homeRes from '../../res'
import DesignRule from '../../../../constants/DesignRule';
import MineAPI from '../../api/MineApi';
import {MRText as Text} from '../../../../components/ui'
import { TrackApi } from '../../../../utils/SensorsTrack';

const HeaderBarBgImg = res.myShop.txbg_03;
const white_back = res.button.white_back;
const mine_user_icon = homeRes.homeBaseImg.mine_user_icon;
const headerHeight = ScreenUtils.statusBarHeight + 44;

export default class MyMentorPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            headImg: null,
            nickName: '',
            levelName: '',
            code: '',
            phone: '',
            profile: ''
        };
    }

    $navigationBarOptions = {
        show: false
    };

    $isMonitorNetworkStatus(){
        return true;
    }

    componentDidMount() {
        this._findLeader();
    }

    _findLeader = () => {
        MineAPI.findLeader().then((data) => {
            let info = data.data;
            if (info) {
                this.setState({
                    headImg: info.headImg,
                    nickName: info.nickname,
                    levelName: `${info.levelName}品鉴官`,
                    code: info.code,
                    phone: info.phone,
                    profile: info.profile ? info.profile : '这位服务顾问很懒，什么也没留下~'
                });
                TrackApi.ViewMyAdviser({hasAdviser:true,adviserCode:info.code});

            }else {
                this.$toastShow('未查询到服务顾问信息');
            }
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                {this._headerRender()}
                {this._itemRender('昵称', this.state.nickName)}
                {/*{this._lineRender()}*/}
                {/*{this._itemRender("职称", this.state.levelName)}*/}
                {/*{this._lineRender()}*/}
                {/*{this._itemRender("授权号", this.state.code)}*/}
                {/*{this._lineRender()}*/}
                {/*{this._itemRender("手机号", this.state.phone)}*/}
                {this._profileRender(this.state.profile)}
                {this._navRender()}
            </View>
        );
    }

    _navRender() {
        return (
            <View
                style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: px2dp(15),
                    height: headerHeight,
                    paddingTop: ScreenUtils.statusBarHeight
                }}>
                    <View style={{ flex: 1 }}>
                        <TouchableWithoutFeedback onPress={() => this.$navigateBack()}>
                            <Image source={white_back} style={{ width: 10, height: 20 }}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <Text style={{
                        color: DesignRule.white,
                        fontSize: px2dp(17),
                        includeFontPadding: false
                    }}>
                        服务顾问详情
                    </Text>
                    <View style={{
                        flex: 1
                    }}/>
                </View>
            </View>
        );
    }


    _headerRender = () => {
        let image = this.state.headImg ?
            <ImageLoad source={{ uri: this.state.headImg }} style={styles.headerIconStyle}/> : <Image source={mine_user_icon} style={styles.headerIconStyle}/> ;

        return (
            <ImageBackground source={HeaderBarBgImg} style={styles.headerWrapper}>
                <View style={styles.headerIconWrapper}>
                    {image}
                </View>
            </ImageBackground>
        );
    };

    _itemRender = (key, value) => {
        return (
            <View style={styles.itemWrapper}>
                <Text style={styles.itemTextStyle}>
                    {`${key}:  `}
                </Text>
                <Text style={styles.itemTextStyle}>
                    {value}
                </Text>
            </View>
        );
    };

    _lineRender = () => {
        return (
            <View style={styles.lineStyle}/>
        );
    };

    _profileRender = (profile) => {
        return (
            <View style={styles.profileWrapper}>
                <Text style={styles.profileTitleStyle}>
                    简介
                </Text>
                <Text style={styles.profileTextStyle}>
                    {profile}
                </Text>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerWrapper: {
        width: ScreenUtils.width,
        height: px2dp(200),
        alignItems: 'center'
    },
    headerIconWrapper: {
        height: px2dp(80),
        width: px2dp(80),
        borderRadius: px2dp(40),
        backgroundColor: 'white',
        marginTop: headerHeight + 20,
        overflow:'hidden'
    },
    headerIconStyle: {
        height: px2dp(80),
        width: px2dp(80),
        borderRadius: px2dp(40),
    },
    itemWrapper: {
        height: px2dp(40),
        width: ScreenUtils.width,
        backgroundColor: DesignRule.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: DesignRule.margin_page
    },
    itemTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle,
        includeFontPadding: false
    },
    lineStyle: {
        height: ScreenUtils.onePixel,
        width: ScreenUtils.width,
        backgroundColor: DesignRule.lineColor_inWhiteBg
    },
    profileWrapper: {
        width: ScreenUtils.width,
        backgroundColor: DesignRule.white,
        marginTop: 7,
        padding: DesignRule.margin_page,
        height: px2dp(135)
    },
    profileTitleStyle: {
        includeFontPadding: false,
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    profileTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_24,
        marginTop: px2dp(10)
    }
});
