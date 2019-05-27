import BasePage from '../../../../BasePage';
import React from 'react';

import {
    StyleSheet,
    View,
    ImageBackground,
    Image,
    TouchableWithoutFeedback,
    Clipboard, Linking
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import ImageLoad from '@mr/image-placeholder';
import {ImageCacheManager} from 'react-native-cached-image'

const { px2dp } = ScreenUtils;
import res from '../../../spellShop/res';
import homeRes from '../../res'
import DesignRule from '../../../../constants/DesignRule';
import MineAPI from '../../api/MineApi';
import {MRText as Text} from '../../../../components/ui'
import { TrackApi } from '../../../../utils/SensorsTrack';
import bridge from '../../../../utils/bridge';

// const HeaderBarBgImg = res.myShop.txbg_03;
const white_back = res.button.white_back;
const mine_user_icon = homeRes.homeBaseImg.mine_user_icon;
const headerHeight = ScreenUtils.statusBarHeight + 44;

export default class MyMentorPage extends BasePage {
    constructor(props) {
        super(props);
        this.imageCacheManager =  ImageCacheManager()  ;
        this.state = {
            headImg: null,
            nickName: '',
            levelName: '',
            code: '',
            phone: '',
            profile: '',
            weChatNumber:null,
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
                    weChatNumber: info.weChatNumber,
                    nickName: info.nickname,
                    levelName: `${info.levelName}品鉴官`,
                    code: info.code,
                    phone: info.phone,
                    profile: info.profile ? info.profile : '这位服务顾问很懒，什么也没留下~'
                });
                this.imageCacheManager.downloadAndCacheUrl(info.headImg).then((data)=>{
                    this.setState({
                    headImg:ScreenUtils.isIOS? data:`file://${data}`
                    });
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

         let bgImage =  this.state.headImg ? {uri: this.state.headImg} : homeRes.mentor.mentor_no_header_icon;
            return (
            <ImageBackground source={bgImage} style={styles.headerWrapper} blurRadius={ScreenUtils.isIOS ? px2dp(100) : px2dp(15)}>
                    {image}
                <Text style={[styles.itemTextStyle,{marginLeft: 20, marginRight:20}]}>
                    {this.state.nickName?this.state.nickName:''}
                </Text>
                {this.state.weChatNumber ?
                    <View style={{flexDirection: 'row', alignItems: 'center',marginLeft: 20, marginRight:20}}>
                        <Text style={styles.weChatStyle} numberOfLines={1}>微信号：{this.state.weChatNumber}</Text>
                        <TouchableWithoutFeedback onPress={() => {
                            this.state.weChatNumber&&Clipboard.setString(this.state.weChatNumber);
                            bridge.$toast('复制到剪切版');
                        }}>
                            <View style={styles.copyViewStyle}>
                                <Text style={styles.copyTextStyle}>复制</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View> :
                    <View>
                        <Text style={styles.copyTextStyle}>暂无微信号</Text>
                    </View>
                }
                <View style={styles.btnBgStyle}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.state.phone&&Linking.openURL(`tel:${this.state.phone}`)
                    }}>
                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                            <Image source={homeRes.mentor.mentor_phone_icon} style={styles.btnImageStyle}/>
                            <Text style={styles.btnTextStyle}>给TA打电话</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={{width: 1, height: 20, backgroundColor: '#CCCCCC', borderRadius: 1}}/>

                    <TouchableWithoutFeedback onPress={() => {
                        this.state.phone&&Linking.openURL(`sms:${this.state.phone}`)
                    }}>
                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
                            <Image source={homeRes.mentor.mentor_message_icon} style={styles.btnImageStyle}/>
                            <Text style={styles.btnTextStyle}>给TA发短信</Text>
                        </View>
                    </TouchableWithoutFeedback>

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
                <View style={{flexDirection:'row', margin:15, alignItems:'center'}}>
                    <View style={{width:2, height:12, backgroundColor:'#FF0050',borderRadius:2, marginRight:10}}/>
                    <Text style={styles.profileTitleStyle}>
                        简介
                    </Text>
                </View>
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
        height: px2dp(280),
        alignItems: 'center',
        justifyContent: 'center'
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
        height: px2dp(70),
        width: px2dp(70),
        borderRadius: px2dp(35),
        overflow:'hidden'
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
        color: 'white',
        fontSize: DesignRule.fontSize_threeTitle_28,
        includeFontPadding: false,
        marginTop: 20
    },
    lineStyle: {
        height: ScreenUtils.onePixel,
        width: ScreenUtils.width,
        backgroundColor: DesignRule.lineColor_inWhiteBg
    },
    profileWrapper: {
        width: ScreenUtils.width - 40,
        backgroundColor: DesignRule.white,
        marginTop: 42,
        marginLeft: 20,
        marginRight: 20,
        height: px2dp(135),
        borderRadius:px2dp( 10)

    },
    profileTitleStyle: {
        includeFontPadding: false,
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    profileTextStyle: {
        flex:1,
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_threeTitle,
        marginLeft: 15,
        marginRight: 15

    },
    weChatStyle: {
        color: 'white',
        fontSize: DesignRule.fontSize_threeTitle,
        marginLeft: 8,
    },
    copyViewStyle:{
        width: px2dp(44),
        height: px2dp(22),
        borderRadius: px2dp(12),
        marginLeft: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    copyTextStyle: {
        color: 'white',
        fontSize: DesignRule.fontSize_20,
    },
    btnBgStyle:{
        flexDirection: 'row',
        backgroundColor: 'white',
        height: px2dp(44),
        width: ScreenUtils.width - 40,
        alignItems: 'center',
        position: 'absolute',
        bottom: -22,
        left: 20,
        borderRadius:px2dp( 22)
    },
    btnImageStyle:{
        height: px2dp(20),
        width: px2dp(20),
    },
    btnTextStyle:{
        color: '#222222',
        fontSize: DesignRule.fontSize_threeTitle_28,
        marginLeft: 10
    }

});
