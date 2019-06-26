import React from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    // RefreshControl,
    TouchableWithoutFeedback,
    DeviceEventEmitter, TouchableOpacity,
    Image, BackHandler, Clipboard
} from 'react-native';
import BasePage from '../../../BasePage';
import UIText from '../../../components/ui/UIText';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import user from '../../../model/user';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import MineApi from '../api/MineApi';
import { observer } from 'mobx-react';
import userOrderNum from '../../../model/userOrderNum';
import RouterMap, { routeNavigate } from '../../../navigation/RouterMap';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import EmptyUtils from '../../../utils/EmptyUtils';
// import WaveView from '../../../comm/components/WaveView';
import MessageApi from '../../message/api/MessageApi';
// import ImageLoad from '@mr/image-placeholder';
import UIImage from '../../../components/ui/UIImage';
import { MRText as Text, AvatarImage } from '../../../components/ui';
import LoginAPI from '../../login/api/LoginApi';
import CommModal from '../../../comm/components/CommModal';
import { track, TrackApi, trackEvent } from '../../../utils/SensorsTrack';
import TaskVIew from '../../home/view/TaskVIew';
import { mineTaskModel } from '../../home/model/TaskModel';
import settingModel from '../model/SettingModel'
import PullView from '../components/pulltorefreshlayout'


const {
    // mine_header_bg,
    // mine_account_bg,
    mine_setting_icon_gray,
    mine_message_icon_gray,
    mine_wait_pay_icon,
    mine_wait_send_icon,
    mine_wait_receive_icon,
    mine_after_buy_icon,
    // mine_friendsHelp,
    mine_invite,
    // mine_moreMoney,
    // mine_icon_favorite_shop,
    mine_icon_help_service,
    mine_icon_address,
    // mine_icon_mission,
    // mine_icon_discollect,
    mine_message_icon_white,
    mine_setting_icon_white,
    profile_banner,
    mine_icon_mentor,
    mine_user_icon,
    mine_icon_fans,
    // mine_levelBg,
    mine_showOrder
} = res.homeBaseImg;

const vipBg = [
    res.homeBaseImg.mine_line_v0,
    res.homeBaseImg.mine_line_v1,
    res.homeBaseImg.mine_line_v2,
    res.homeBaseImg.mine_line_v3,
    res.homeBaseImg.mine_line_v4,
    res.homeBaseImg.mine_line_v5,];

/**
 * @author chenxiang
 * @date on 2018/9/13
 * @describe 订单列表
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */

const headerBgSize = { width: 375, height: 237 };
const platformHeight = 10;
const { px2dp, statusBarHeight } = ScreenUtils;
const headerHeight = ScreenUtils.statusBarHeight + 44;
// const offset = ScreenUtils.getImgHeightWithWidth(headerBgSize) - headerHeight;
@observer
export default class MinePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            nickname: user.phone,
            headImg: '',
            netFailedInfo: null,
            loadingState: PageLoadingState.success,
            isRefreshing: false,
            changeHeader: true,
            hasMessageNum: 0,
            hasFans: false,
            hasFansMSGNum: 0,
            modalId: false
        };

    }

    $navigationBarOptions = {
        show: false // false则隐藏导航
    };
    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    componentDidMount() {
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
                const { state } = payload;
                this.loadMessageCount();
                this._needShowFans();
                console.log('willFocusSubscriptionMine', state);
                if (state && state.routeName === 'MinePage') {
                    this.refresh();
                }
                TrackApi.myPage();
                mineTaskModel.getData();
            });
        this.listener = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);

        // this.refresh();
    }

    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
        this.willBlurSubscription && this.willBlurSubscription.remove();
        this.listener && this.listener.remove();
    }

    handleBackPress = () => {
        this.$navigateBackToHome();
        return true;

    };

    _needShowFans = () => {
        LoginAPI.queryShowFansStatus().then((res) => {
            this.setState({
                hasFans: res.data
            });
        }).catch((error) => {

        });
    };

    $isMonitorNetworkStatus() {
        return false;
    }

    loadMessageCount = () => {
        MessageApi.getNewNoticeMessageCount().then(result => {
            if (!EmptyUtils.isEmpty(result.data)) {
                this.setState({
                    hasMessageNum: result.data.shopMessageCount + result.data.noticeCount + result.data.messageCount
                });
            }
        }).catch((error) => {
            this.setState({
                hasMessageNum: 0
            });
        });
    };

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y <= 0) {
            this.setState({
                changeHeader: true
            });
        } else {
            this.st = 1;
            this.setState({
                changeHeader: false
            });
        }


        // this.headerBg.setNativeProps({
        //     opacity: this.st
        // });
    };

    refresh = () => {
        userOrderNum.getUserOrderNum();
        // this.$loadingShow('加载中...', 1000);
        MineApi.getUser().then(res => {
            // this.$loadingDismiss();
            let data = res.data;
            user.saveUserInfo(data);
        }).catch(err => {
            // this.$loadingDismiss();
        });
    };

    _reload = () => {
        this.loadMessageCount();
        userOrderNum.getUserOrderNum();
        MineApi.getUser().then(res => {
            let data = res.data;
            user.saveUserInfo(data);
        }).catch(err => {

        });
    };

    jumpToUserInformationPage = () => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        TrackApi.ViewPersonalInfo();
        this.$navigate(RouterMap.UserInformationPage);
    };

    copyId = () => {
        let code = user.perfectNumberCode && (user.perfectNumberCode !== user.code) ? `${user.perfectNumberCode}` : `${user.code}`;
        Clipboard.setString(code);
        this.setState({
            modalId: false
        });
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={{flex: 1}}>
                <PullView
                    bounces={false}
                    contentBackgroundColor={'#F7F7F7'}
                    backgroundColor={'#F7F7F7'}
                    renderForeground={this.renderUserHead}
                    renderStickyHeader={this.renderLevelNameNav}
                    stickyHeaderHeight={this.state.changeHeader ? 0 : px2dp(44 + statusBarHeight)}
                    parallaxHeaderHeight={ScreenUtils.getImgHeightWithWidth(headerBgSize)}
                    onScroll={this._onScroll}
                    showsVerticalScrollIndicator={false}
                >
                    {this.renderBodyView()}
                </PullView>
                {/*{this.navRender()}*/}
            </View>
        )
    }

    navRender = () => {
        return (
            <View
                style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: px2dp(15),
                    height: headerHeight,
                    paddingTop: ScreenUtils.statusBarHeight
                }}>
                    <View style={{ flex: 1 }}/>
                    <Text style={{
                        color: this.state.changeHeader ? DesignRule.white : DesignRule.textColor_mainTitle,
                        fontSize: px2dp(17),
                        includeFontPadding: false
                    }}>
                        我的
                    </Text>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        alignSelf: 'center',
                        justifyContent: 'flex-end',
                        flexDirection: 'row'
                    }}>
                        <UIImage source={this.state.changeHeader ? mine_setting_icon_white : mine_setting_icon_gray}
                                 style={{ height: px2dp(21), width: px2dp(21), marginRight: 15 }}
                                 onPress={() => this.jumpToSettingPage()}/>
                        <View>
                            <UIImage source={this.state.changeHeader ? mine_message_icon_white : mine_message_icon_gray}
                                     style={{ height: px2dp(21), width: px2dp(21) }}
                                     onPress={() => this.jumpToServicePage()}/>
                            {this.state.hasMessageNum ? <View style={{
                                width: 10,
                                height: 10,
                                backgroundColor: this.state.changeHeader ? DesignRule.white : DesignRule.mainColor,
                                position: 'absolute',
                                top: -3,
                                right: -3,
                                borderRadius: 5
                            }}/> : null}

                        </View>
                    </View>
                </View>
            </View>
        );
    };

    renderUserHead = () => {
        let accreditID = !EmptyUtils.isEmpty(user.code) ? (
            <TouchableWithoutFeedback onLongPress={() => {
                this.setState({
                    modalId: true
                });
            }}>
                <Text style={{ fontSize: 11, color: DesignRule.textColor_instruction, includeFontPadding: false, marginTop: 5 }}>
                    {user.perfectNumberCode && (user.perfectNumberCode !== user.code) ? `靓号：${user.perfectNumberCode}` : `会员号: ${user.code}`}
                </Text>
            </TouchableWithoutFeedback>
        ) : null;

        let xiuOld = !EmptyUtils.isEmpty(user.shareGoodsAge) ? (
                <Text style={{ fontSize: 11, color: DesignRule.textColor_instruction, includeFontPadding: false, marginTop: 5,marginRight:15 }}>
                    {user.shareGoodsAge ? `秀龄：${user.shareGoodsAge}` : '0天'}
                </Text>
        ) : null;

        let levelArr = ['V0','V1','V2','V3','V4','V5']
        let index = 10;
        for(let i = 0;i < levelArr.length;i++){
            if(levelArr[i] === user.levelRemark){
                index = i;
            }
        }

        let name = '';

        if (EmptyUtils.isEmpty(user.nickname)) {
            name = user.phone ? user.phone : '未登录';
        } else {
            name = user.nickname.length > 8 ? user.nickname.substring(0, 8) + '...' : user.nickname;
        }

        let icon = (user.headImg && user.headImg.length > 0) ?
            <AvatarImage source={{ uri: user.headImg }} style={styles.userIconStyle}
                         borderRadius={px2dp(27)}/> : <Image source={mine_user_icon} style={styles.userIconStyle}
                                                             borderRadius={px2dp(27)}/>;

        return (
            <View style={styles.headerBgStyle}>
                <View style={{ height: px2dp(54), flexDirection: 'row', marginRight: px2dp(5),}}>
                    <TouchableOpacity onPress={this.jumpToUserInformationPage} activeOpacity={1}>
                        {icon}
                    </TouchableOpacity>
                    <View style={{
                        flex:1,
                        height: px2dp(54),
                        marginLeft: px2dp(10),
                        justifyContent: 'center'
                    }}>
                        <TouchableWithoutFeedback onPress={this.jumpToUserInformationPage}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text maxLength={8}
                                    style={{
                                        color: DesignRule.textColor_mainTitle,
                                        fontSize: px2dp(16),
                                        includeFontPadding: false
                                    }}>
                                    {name}
                                </Text>
                                <UIImage source={res.button.white_go}
                                         style={{height: px2dp(12), width: px2dp(7), marginLeft: px2dp(12)}}
                                         resizeMode={'stretch'}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{flexDirection: 'row'}}>
                            {xiuOld}
                            {accreditID}
                        </View>
                    </View>
                    {/*<TouchableOpacity onPress={()=>{*/}
                        {/*this.$navigate(RouterMap.MyPromotionPage);*/}
                        {/*TrackApi.ViewLevelInterest({ moduleSource: 2 });*/}
                    {/*}} activeOpacity={1}>*/}
                        {/*<Image source={mine_moreMoney}*/}
                               {/*style={{width: px2dp(54), height: px2dp(54), marginLeft: px2dp(21)}}*/}
                               {/*/>*/}
                    {/*</TouchableOpacity>*/}
                </View>
                <View style={{flexDirection:'row',flex:1}}>
                    {this.accountRender()}
                </View>
                {this.copyModalRender()}
                {this.renderLevelName(index)}
            </View>
        );
    };

    renderLevelName =(index)=>{
        return(
            <ImageBackground style={{
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                height: 37,
                width: 345,
                borderRadius: 10,
            }} source={index !== 10 ? vipBg[index] : vipBg[2]}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginLeft: 20,
                    marginRight: 20
                }}>
                    <Text style={{
                        flex: 1,
                        color: index === 2 || index === 4 || index === 5 ? '#FFE6B1' : DesignRule.textColor_mainTitle,
                        fontSize: DesignRule.fontSize_threeTitle,
                        fontWeight: '600'
                    }}>
                        {user.token ? index !== 10 ? `V${index}${user.levelName ? user.levelName : ''}品鉴官` : '' : ''}
                    </Text>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigate(RouterMap.MyPromotionPage);
                        TrackApi.ViewLevelInterest({moduleSource: 2});
                    }}>
                        <View>
                            <ImageBackground style={{
                                height: 20, width: 73, justifyContent: 'center',
                                alignItems: 'center',
                            }} source={res.homeBaseImg.mine_btn_yellow}>
                                <Text style={{color: DesignRule.textColor_mainTitle, fontSize: DesignRule.fontSize_22}}>
                                    查看权益>
                                </Text>
                            </ImageBackground>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    }

    renderLevelNameNav =()=>{
        let name = '';

        if (EmptyUtils.isEmpty(user.nickname)) {
            name = user.phone ? user.phone : '未登录';
        } else {
            name = user.nickname.length > 8 ? user.nickname.substring(0, 8) + '...' : user.nickname;
        }

        let icon = (user.headImg && user.headImg.length > 0) ?
            <AvatarImage source={{ uri: user.headImg }} style={styles.userIconNavStyle}
                         borderRadius={px2dp(15)}/> : <Image source={mine_user_icon} style={styles.userIconNavStyle}
                                                             borderRadius={px2dp(15)}/>;

        return(
            <View style={{
                position: 'absolute',
                top: 0,
                paddingTop:statusBarHeight,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                height: px2dp(44 + statusBarHeight),
                width: px2dp(ScreenUtils.width),
                paddingVertical: 5,
                backgroundColor:'#ffffff',
            }}>
                {icon}
                <View style={{flexDirection: 'row', alignItems: 'center', flex:1, marginLeft: px2dp(10)}}>
                    <Text maxLength={8}
                          style={{
                              color: DesignRule.textColor_mainTitle,
                              fontSize: px2dp(16),
                              includeFontPadding: false
                          }}>
                        {name}
                    </Text>
                </View>
                <TouchableWithoutFeedback onPress={() => {
                    this.$navigate(RouterMap.MyPromotionPage);
                    TrackApi.ViewLevelInterest({ moduleSource: 2 });
                }}>
                    <ImageBackground style={{
                        height: 24, width: 85,justifyContent:'center',
                        alignItems: 'center',marginRight:15}} source={res.homeBaseImg.mine_btn_yellow}>
                        <Text style={{ color: DesignRule.textColor_mainTitle, fontSize: DesignRule.fontSize_22 }}>
                            {user.token ? `${user.levelName ? user.levelName : ''}品鉴官>` : ''}
                        </Text>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    copyModalRender = () => {
        return (<CommModal
            onRequestClose={() => {
                this.setState({
                    modalId: false
                });
            }}
            transparent={true}
            visible={this.state.modalId}>
            <TouchableWithoutFeedback onPress={() => {
                this.setState({
                    modalId: false
                });
            }}>
                <View style={{ flex: 1, width: DesignRule.width, height: DesignRule.height }}>
                    <TouchableWithoutFeedback onPress={() => this.copyId()}>
                        <View style={styles.copyViewStyle}>
                            <Text style={styles.copyTextStyle}>复制</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </CommModal>);
    };

    accountRender = () => {
        return (
            <View style={{
                marginTop: px2dp(5),
                marginHorizontal: px2dp(15),
                justifyContent: 'center'
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {this.accountItemView(StringUtils.formatMoneyString(user.totalBalance ? user.totalBalance : '0.00', false), '个人账户(元)',1,() => {
                        settingModel.availableBalanceAdd();
                        this.go2CashDetailPage(1);
                        TrackApi.ViewAccountBalance();
                    })}
                    <View style={{height:30,width:1,backgroundColor:'#E4E4E4'}}/>
                    {this.accountItemView(user.totalScore ? user.totalScore : '0', '秀豆账户(枚)', 2 ,() => {
                        settingModel.userScoreAdd();
                        this.go2CashDetailPage(2);
                        TrackApi.ViewShowDou();
                    })}
                    <View style={{height:30,width:1,backgroundColor:'#E4E4E4'}}/>
                    {this.accountItemView(user.couponCount ? user.couponCount : '0', '优惠券(张)', 3, () => {
                        settingModel.couponsAdd();
                        this.go2CashDetailPage(3);
                    })}
                </View>
            </View>
        );
    };


    activeRender=()=>{
        return(
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 15,
                marginLeft: px2dp(15),
                marginRight: px2dp(15)
            }}>
                <TouchableWithoutFeedback onPress={() => {
                    this.$navigate(RouterMap.InviteFriendsPage);
                }}>
                    <View>
                        <Image resizeMode={'contain'}
                            style={{
                            height: px2dp(70),
                            width: (ScreenUtils.width - 30)
                        }} source={mine_invite}/>
                    </View>
                </TouchableWithoutFeedback>
                {/*<TouchableWithoutFeedback onPress={() => {*/}
                    {/*this.$navigate('HtmlPage', { uri: '/activity/freeOrder' });*/}
                {/*}}>*/}
                    {/*<View>*/}
                        {/*<ImageBackground style={{*/}
                            {/*height: px2dp(70),*/}
                            {/*width: (ScreenUtils.width - 45) / 2*/}
                        {/*}} source={mine_friendsHelp}>*/}
                            {/*<View style={{flex: 1, justifyContent: 'center', marginLeft: 15}}>*/}
                                {/*<Text style={{fontSize: 14, color: '#333333', fontWeight: '600', marginBottom: 5}}>*/}
                                    {/*助力减</Text>*/}
                                {/*<Text style={{height: 26, fontSize: 10, color: '#999999'}}>好友助力减到底</Text>*/}
                            {/*</View>*/}
                        {/*</ImageBackground>*/}
                    {/*</View>*/}
                {/*</TouchableWithoutFeedback>*/}
            </View>
        )
    };

    getAdjustsFontSize = (text) => {
        let fontSize = Math.sqrt(80 * 20 / text.length);
        fontSize = Math.min(fontSize, 19);
        return Math.max(fontSize, 1);
    };

    accountItemView = (num, text, index, onPress) => {
        let  msgNum = 0;
        if(index === 1){
            msgNum = settingModel.availableBalance;
        }else if(index === 2){
            msgNum = settingModel.userScore;
        }else if(index === 3){
            msgNum = settingModel.coupons;
        }

        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={{
                    width: px2dp(110),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: px2dp(10),
                    marginBottom: px2dp(15)
                }}>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text allowFontScaling={true} style={{
                            textAlign: 'center',
                            color: '#333333',
                            includeFontPadding: false,
                            height: 22,
                            maxWidth: 80,
                            fontSize: this.getAdjustsFontSize(`${num}`)
                        }}>
                            {num}
                        </Text>
                        {msgNum > 0 ? <View style={{
                            minWidth: px2dp(16),
                            height: px2dp(16),
                            borderRadius: px2dp(8),
                            position: 'relative',
                            top: -5,
                            right: 0,
                            backgroundColor: DesignRule.mainColor,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(10) }}>
                                {msgNum > 99 ? '99+' : msgNum}
                            </Text>
                        </View> : null
                        }
                    </View>
                    <View style={{ height: 9 }}/>
                    <Text style={{ color: '#999999', fontSize: px2dp(12) }}>
                        {text}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    orderRender() {
        return (
            <View style={{
                backgroundColor: 'white',
                marginHorizontal: DesignRule.margin_page,
                borderRadius: px2dp(10),
                marginTop: px2dp(10)
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: px2dp(10),
                    marginBottom: px2dp(10)
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{width:2, height:8,backgroundColor:'#FF0050'}}/>
                        <UIText value={'我的订单'}
                                style={{
                                    marginLeft: 10,
                                    fontSize: DesignRule.fontSize_threeTitle,
                                    color: DesignRule.textColor_mainTitle,
                                    fontWeight: '600'
                                }}/>
                    </View>
                    <TouchableWithoutFeedback onPress={this.jumpToAllOrder}>
                        <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'center' }}>
                            <UIText value={'查看全部'}
                                    style={{
                                        fontSize: DesignRule.fontSize_24,
                                        color: DesignRule.textColor_instruction
                                    }}/>
                            <UIImage source={res.button.arrow_right} style={{ height: 12 }}
                                     resizeMode={'contain'}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {/*<ScrollView style={{ width: DesignRule.width - DesignRule.margin_page * 2 }} horizontal={true}*/}
                            {/*showsHorizontalScrollIndicator={false}>*/}
                    <View style={{ flex: 1, flexDirection: 'row', paddingBottom: px2dp(15) }}>
                        {this.renderOrderStates()}
                    </View>
                {/*</ScrollView>*/}
            </View>

        );
    }

    utilsRender() {
        return (
            <View style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                flexWrap: 'wrap',
                marginVertical: px2dp(10),
                marginHorizontal: DesignRule.margin_page,
                borderRadius: px2dp(5)
            }}>
                <View
                    style={{
                        flexDirection:'row',
                        alignItems:'center',
                        marginTop: px2dp(10)
                    }}>
                    <View style={{width:2, height:8,backgroundColor:'#FF0050'}} />
                    <Text
                        style={{
                            includeFontPadding: false,
                            fontSize: DesignRule.fontSize_threeTitle,
                            color: DesignRule.textColor_mainTitle,
                            marginLeft: 10,
                            fontWeight: '600',
                            width: ScreenUtils.width - DesignRule.margin_page * 2
                        }}>
                        常用工具
                    </Text>
                </View>
                {this.renderMenu()}
            </View>
        );
    }

    renderBodyView = () => {
        return (
            <View style={{flex:1,backgroundColor:'#F7F7F7'}}>
                <TaskVIew type={'mine'} style={{marginTop:platformHeight,backgroundColor: '#F7F7F7', paddingBottom: 0 }}/>
                {this.orderRender()}
                {this.activeRender()}
                {this.utilsRender()}
                {/*{this.renderMoreMoney()}*/}
            </View>
        );
    };

    renderMoreMoney = () => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.$navigate(RouterMap.ShowRichTextDetailPage, {
                    fromHome: false,
                    code: 'SHOW2019052714482778300000600000'
                });
                TrackApi.ViewHowTo();
            }}>
                <UIImage style={styles.makeMoneyMoreBackground} resizeMode={'stretch'} source={profile_banner}/>
            </TouchableWithoutFeedback>
        );
    };

    renderOrderStates = () => {
        let statesImage = [mine_wait_pay_icon, mine_wait_send_icon, mine_wait_receive_icon, mine_showOrder, mine_after_buy_icon];
        let statesText = ['待付款', '待发货', '待收货', '待晒单', '售后/退款'];
        let width = (DesignRule.width - DesignRule.margin_page * 2) / 5;
        let arr = [];
        for (let i = 0; i < statesImage.length; i++) {
            let num = this.getOrderNum(i);
            let numView = num ? (
                <View style={{
                    minWidth: px2dp(16),
                    height: px2dp(16),
                    borderRadius: px2dp(8),
                    position: 'absolute',
                    top: px2dp(-10),
                    right: px2dp(-10),
                    backgroundColor: DesignRule.mainColor,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(10) }}>
                        {num > 99 ? '99+' : num}
                    </Text>
                </View>
            ) : null;

            arr.push(
                <NoMoreClick style={{ width, justifyContent: 'center', alignItems: 'center', paddingTop: px2dp(15) }}
                             onPress={() => this.jumpToOrderAccordingStates(i)} key={i}>
                    <ImageBackground source={statesImage[i]}
                                     style={{ height: 28, width: 28, marginBottom: 3, overflow: 'visible' }}>
                        {numView}
                    </ImageBackground>
                    <UIText value={statesText[i]}
                            style={{ color: '#212121', includeFontPadding: false, fontSize: px2dp(12) }}/>
                </NoMoreClick>
            );
        }
        return arr;
    };

    getOrderNum(index) {
        switch (index) {
            case 0:
                return userOrderNum.waitPayNum;
                break;
            case 1:
                return userOrderNum.waitSendNum;
                break;
            case 2:
                return userOrderNum.waitReceiveNum;
                break;
            case 3:
                return userOrderNum.waitShowNum;
                break;
            case 4:
                return userOrderNum.afterSaleServiceNum;
            default:
                return 0;
                break;
        }
    }

    renderMenu = () => {

        let mentor = {
            text: '我的顾问',
            icon: mine_icon_mentor,
            onPress: () => {
                if (user.upUserCode) {
                    settingModel.fansMSGAdd();
                    this.$navigate(RouterMap.MyMentorPage);
                }
            }
        };

        let fans = {
            text: '我的秀迷',
            icon: mine_icon_fans,
            num: settingModel.fansMSG,
            onPress: () => {
                if (this.state.hasFans) {
                    this.$navigate(RouterMap.MainShowFansPage);
                }
            }
        };
        // let invite = {
        //     text: '分享好友',
        //     icon: mine_icon_invite,
        //     onPress: () => {
        //         this.$navigate(RouterMap.InviteFriendsPage);
        //     }
        // };
        // let coupon = {
        //     text: '我的优惠券',
        //     icon: mine_coupon_icon,
        //     onPress: () => {
        //         TrackApi.ViewCoupon({ couponModuleSource: 1 });
        //         this.$navigate(RouterMap.CouponsPage);
        //     }
        // };
        // let data = {
        //     text: '我的经验值',
        //     icon: mine_icon_data,
        //     onPress: () => {
        //         TrackApi.ViewMyInfos();
        //         this.$navigate(RouterMap.MyPromotionPage);
        //     }
        // };
        // let shop = {
        //     text: '收藏店铺',
        //     icon: mine_icon_favorite_shop,
        //     onPress: () => {
        //         TrackApi.ViewMyPinCollection();
        //         this.$navigate(RouterMap.MyCollectPage);
        //     }
        // };
        let service = {
            text: '帮助中心',
            icon: mine_icon_help_service,
            onPress: () => {
                TrackApi.ClickCustomerService();
                this.$navigate(RouterMap.MyHelperPage);
            }
        };
        let address = {
            text: '地址管理',
            icon: mine_icon_address,
            onPress: () => {
                this.$navigate(RouterMap.AddressManagerPage);
            }
        };
        // let collect = {
        //     text: '秀场收藏',
        //     icon: mine_icon_discollect,
        //     onPress: () => {
        //         TrackApi.ViewMyXiuCollection();
        //         TrackApi.WatchXiuChang({ xiuChangModuleSource: 3 });
        //         this.$navigate(RouterMap.ShowConnectPage);
        //     }
        // };


        let mentorSet = {
            text: '服务顾问',
            icon: mine_icon_mentor,
            onPress: () => {
                this.$navigate(RouterMap.SetMentorPage);
            }
        };

        let message = {
            text: '消息',
            icon: mine_message_icon_gray,
            num: this.state.hasMessageNum,
            onPress: () => {
                this.$navigate(RouterMap.MessageCenterPage);
            }
        };

        let setting = {
            text: '设置',
            icon: mine_setting_icon_gray,
            onPress: () => {
                this.jumpToSettingPage()
            }
        }


        let menu = [service, address, message, setting];


        if (this.state.hasFans) {
            menu.unshift(fans);
        }

        if (user.upUserCode) {
            menu.unshift(mentor);
        } else {
            menu.unshift(mentorSet);
        }



        let arr = [];
        for (let i = 0; i < menu.length; i++) {
            arr.push(
                <NoMoreClick style={{
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: px2dp(12),
                    marginBottom: px2dp(15)
                }} onPress={menu[i].onPress} key={i}>
                    <View style={{ paddingTop: 7, paddingLeft: 8, paddingRight: 8, paddingBottom: 0 }}>
                        <UIImage source={menu[i].icon}
                                 resizeMode={'contain'}
                                 style={{ width: 20, marginBottom: 8 }}/>
                        {menu[i].num ? <View style={{
                            minWidth: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: DesignRule.mainColor,
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                color: DesignRule.white,
                                fontSize: 9,
                                includeFontPadding: false
                            }}>{menu[i].num > 99 ? '99+' : menu[i].num}</Text>
                        </View> : null}
                    </View>
                    <UIText value={menu[i].text} style={styles.greyText}/>

                </NoMoreClick>
            );
        }
        return arr;
    };


    //跳转到对应的订单状态页面
    jumpToOrderAccordingStates = (index) => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        track(trackEvent.ViewMyOrder, { myOrderModuleSource: 1 });
        switch (index) {
            case 0:
                this.$navigate(RouterMap.MyOrdersListPage, { index: 1 });
                break;
            case 1:
                this.$navigate(RouterMap.MyOrdersListPage, { index: 2 });
                break;
            case 2:
                this.$navigate(RouterMap.MyOrdersListPage, { index: 3 });
                break;
            case 3:
                this.$navigate(RouterMap.MyOrdersListPage, { index: 4 });
                break;
            case 4:
                this.$navigate(RouterMap.AfterSaleListPage, { index: 4 });
                break;
        }
    };

    //跳转到对应的账户页面
    go2CashDetailPage(i) {
        switch (i) {
            case 1:
                this.$navigate(RouterMap.MyCashAccountPage, { availableBalance: user.availableBalance });
                break;
            case 2:
                this.$navigate(RouterMap.MyIntegralAccountPage, { userScore: user.userScore ? user.userScore : 0 });
                break;
            case 3:
                TrackApi.ViewCoupon({ couponModuleSource: 1 });
                this.$navigate(RouterMap.CouponsPage);
                break;
            default:
                break;
        }
    }


    jumpToAllOrder = () => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        track(trackEvent.ViewMyOrder, { myOrderModuleSource: 1 });
        routeNavigate(RouterMap.MyOrdersListPage, { index: 0 });
    };
    jumpToServicePage = () => {
        if (!user.isLogin) {
            routeNavigate(RouterMap.LoginPage);
            return;
        }
        routeNavigate(RouterMap.MessageCenterPage);
    };

    jumpToSettingPage = () => {
        this.$navigate(RouterMap.SettingPage, { callBack: () => this.loadPageData() });
    };
}

const profileWidth = ScreenUtils.width - (DesignRule.margin_page - 1.5) * 2;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    whatLeft: {  // 组件定义了一个上边框
        flex: 1,
        borderTopWidth: 1,
        borderColor: 'black',
        backgroundColor: 'green' //每个界面背景颜色不一样
    },
    whiteText: {
        fontSize: 15,
        color: 'white'
    },
    greyText: {
        fontSize: 12,
        color: '#212121'
    },
    blackText: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    headerBgStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.getImgHeightWithWidth(headerBgSize),
        paddingTop: ScreenUtils.statusBarHeight + 10,
        backgroundColor: 'white'
    },
    userIconStyle: {
        width: px2dp(54),
        height: px2dp(54),
        borderRadius: px2dp(27),
        marginLeft: px2dp(21)
    },
    userIconNavStyle: {
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: px2dp(15),
        marginLeft: px2dp(21)
    },
    saveMoneyWrapper: {
        height: px2dp(34),
        width: px2dp(100),
        borderBottomLeftRadius: px2dp(17),
        borderTopLeftRadius: px2dp(17),
        backgroundColor: '#FFC079',
        position: 'absolute',
        right: 0,
        bottom: px2dp(38),
        justifyContent: 'space-between',
        paddingLeft: px2dp(22),
        paddingVertical: px2dp(1)
    },
    makeMoneyMoreBackground: {
        height: (profileWidth * 140 / 702),
        width: profileWidth,
        top: ScreenUtils.getImgHeightWithWidth(headerBgSize) - px2dp(31),
        left: DesignRule.margin_page - 1.5,
        position: 'absolute',
        flexDirection: 'row'
    },
    moreMoneyWrapper: {
        marginLeft: px2dp(180),
        alignSelf: 'center',
        height: px2dp(32),
        justifyContent: 'space-between'
    },
    copyViewStyle: {
        height: 20,
        width: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        marginTop: ScreenUtils.getImgHeightWithWidth(headerBgSize) / 2 - 5,
        marginLeft: px2dp(90),
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    copyTextStyle: {
        color: DesignRule.white,
        fontSize: DesignRule.fontSize_22
    },
});

