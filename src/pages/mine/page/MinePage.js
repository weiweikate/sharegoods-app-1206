import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    ImageBackground,
    // Platform,
    // Linking,
    TouchableWithoutFeedback,
    RefreshControl, DeviceEventEmitter, TouchableOpacity,
    Image
} from 'react-native';
import BasePage from '../../../BasePage';
import UIText from '../../../components/ui/UIText';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import user from '../../../model/user';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import MineApi from '../api/MineApi';
import { observer } from 'mobx-react/native';
import userOrderNum from '../../../model/userOrderNum';
import RouterMap from 'RouterMap';
import DesignRule from 'DesignRule';
import res from '../res';
import EmptyUtils from '../../../utils/EmptyUtils';
import WaveView from 'WaveView';
import MessageApi from '../../message/api/MessageApi';
import ImageLoad from '@mr/image-placeholder';
import UIImage from '../../../components/ui/UIImage';
import {MRText as Text} from '../../../components/ui'
import LoginAPI from '../../login/api/LoginApi';

const {
    mine_header_bg,
    mine_setting_icon_gray,
    mine_message_icon_gray,
    mine_wait_pay_icon,
    mine_wait_send_icon,
    mine_wait_receive_icon,
    mine_after_buy_icon,
    mine_icon_invite,
    mine_coupon_icon,
    mine_icon_data,
    mine_icon_favorite_shop,
    mine_icon_help_service,
    mine_icon_address,
    // mine_icon_mission,
    mine_icon_discollect,
    mine_message_icon_white,
    mine_setting_icon_white,
    profile_banner,
    mine_level_background,
    mine_icon_mentor,
    mine_user_icon,
    // mine_icon_fans
} = res.homeBaseImg;


/**
 * @author chenxiang
 * @date on 2018/9/13
 * @describe 订单列表
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */

const headerBgSize = { width: 375, height: 200 };

const { px2dp, statusBarHeight } = ScreenUtils;
const headerHeight = ScreenUtils.statusBarHeight + 44;
const offset = ScreenUtils.getImgHeightWithWidth(headerBgSize) - headerHeight;
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
            hasMessage: false,
            hasFans:false
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
        this.listener = DeviceEventEmitter.addListener('contentViewed', this.loadMessageCount);
        // this.refresh();
    }

    componentWillUnmount() {
        this.didBlurSubscription && this.didBlurSubscription.remove();
        this.listener && this.listener.remove();
    }

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                this.loadMessageCount();
                this._needShowFans();
                console.log('willFocusSubscriptionMine', state);
                if (state && state.routeName === 'MinePage') {
                    this.refresh();
                }

            });
    }

    _needShowFans=()=>{
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.setState({
                hasFans: res.data
            });
        }).catch((error) => {

        });
    }

    $isMonitorNetworkStatus() {
        return false;
    }

    loadMessageCount = () => {
        MessageApi.getNewNoticeMessageCount().then(result => {
            if (!EmptyUtils.isEmpty(result.data)) {
                this.setState({
                    hasMessage: result.data.shopMessageCount || result.data.noticeCount || result.data.messageCount
                });
            }
        }).catch((error) => {
            this.setState({
                hasMessage: false
            });
        });
    };

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y < offset) {
            this.st = Y / offset;

            this.setState({
                changeHeader: this.st > 0.7 ? false : true
            });
        } else {
            this.st = 1;
            this.setState({
                changeHeader: false
            });
        }


        this.headerBg.setNativeProps({
            opacity: this.st
        });
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
        this.setState({
            isRefreshing: true
        });
        MineApi.getUser().then(res => {
            let data = res.data;
            user.saveUserInfo(data);
            this.setState({
                isRefreshing: false
            });
        }).catch(err => {
            this.setState({
                isRefreshing: false
            });
        });
    };

    jumpToUserInformationPage = () => {
        if (!user.isLogin) {
            this.gotoLoginPage();
            return;
        }
        this.$navigate('mine/userInformation/UserInformationPage');
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
                {this.navBackgroundRender()}
                {this.navRender()}
            </View>
        );
    }

    navBackgroundRender() {
        return (
            <View ref={(ref) => this.headerBg = ref}
                  style={{
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: headerHeight,
                      opacity: 0
                  }}/>
        );
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
                        color: this.state.changeHeader ? DesignRule.white : '#828282',
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
                            {this.state.hasMessage ? <View style={{
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
            <Text style={{ fontSize: 11, color: DesignRule.white, includeFontPadding: false, marginTop: 5 }}>
                {`授权ID: ${user.code}`}
            </Text>
        ) : null;

        let name = '';

        if (EmptyUtils.isEmpty(user.nickname)) {
            name = user.phone ? user.phone : '未登陆';
        } else {
            name = user.nickname.length > 6 ? user.nickname.substring(0, 6) + '...' : user.nickname;
        }

        let icon = (user.headImg && user.headImg.length > 0) ?  <ImageLoad source={{ uri: user.headImg }} style={styles.userIconStyle}
                                                                           borderRadius={px2dp(27)}/> : <Image source={mine_user_icon} style={styles.userIconStyle}
                                                                                                                   borderRadius={px2dp(27)}/>

        return (
            <ImageBackground style={styles.headerBgStyle} source={mine_header_bg}>
                <View style={{ height: px2dp(54), flexDirection: 'row' }}>
                    <TouchableOpacity onPress={this.jumpToUserInformationPage} activeOpacity={1}>
                        {icon}
                    </TouchableOpacity>
                    <View style={{
                        height: px2dp(54),
                        marginLeft: px2dp(10),
                        justifyContent: 'center'
                    }}>
                        <TouchableWithoutFeedback onPress={this.jumpToUserInformationPage}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    maxLength={6}
                                    style={{
                                        color: DesignRule.white,
                                        fontSize: px2dp(18),
                                        includeFontPadding: false
                                    }}>
                                    {name}
                                </Text>
                                <UIImage source={res.button.white_go}
                                         style={{ height: px2dp(12), width: px2dp(7), marginLeft: px2dp(12) }}
                                         resizeMode={'stretch'}/>
                            </View>
                        </TouchableWithoutFeedback>
                        {accreditID}
                    </View>
                    <View style={{ flex: 1 }}/>

                    <ImageBackground style={{
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: px2dp(51),
                        width: px2dp(139),
                        paddingVertical: 5,
                        backgroundColor: '#efcd97',
                        borderBottomLeftRadius: 25,
                        borderTopLeftRadius: 25,
                        paddingLeft: px2dp(3.8)
                    }} source={mine_level_background}>
                        <WaveView topTitle={!EmptyUtils.isEmpty(user.levelName) ? user.levelRemark : 'VO'}
                                  waveBackgroundColor={DesignRule.mainColor}
                                  waveColor={'#B1021B'}
                                  waveLightColor={'#D01433'}
                                  topTitleColor={'#ffffff'}
                                  topTitleSize={12}
                                  progressValue={user.token && (user.levelFloor !== user.levelCeil) ? parseInt((user.experience - user.levelFloor) * 100 / (user.levelCeil - user.levelFloor)) : 0}
                                  style={{
                                      width: px2dp(44),
                                      height: px2dp(44)
                                  }}
                        />
                        <TouchableWithoutFeedback onPress={() => {
                            this.$navigate(RouterMap.MyPromotionPage);
                        }}>
                            <View style={{
                                justifyContent: 'space-between',
                                marginLeft: 5,
                                marginRight: DesignRule.margin_page
                            }}>
                                <Text style={{
                                    color: DesignRule.textColor_mainTitle,
                                    fontSize: DesignRule.fontSize_threeTitle
                                }}>
                                    {user.token ? `${user.levelName}品鉴官` : ''}
                                </Text>
                                <Text style={{ color: DesignRule.white, fontSize: DesignRule.fontSize_22 }}>
                                    查看权益>
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </ImageBackground>
                </View>
            </ImageBackground>
        );
    };

    accountRender = () => {
        return (
            <ImageBackground source={mine_header_bg} style={{
                marginTop: px2dp(41),
                marginHorizontal: px2dp(15),
                borderRadius: 5,
                overflow: 'hidden'
            }}>
                <View style={{ height: px2dp(44), paddingHorizontal: px2dp(15), justifyContent: 'center' }}>
                    <Text style={{ fontSize: DesignRule.fontSize_secondTitle, color: DesignRule.white }}>
                        我的资产
                    </Text>
                </View>
                <View
                    style={{
                        backgroundColor: DesignRule.lineColor_inColorBg,
                        width: ScreenUtils.width - px2dp(30),
                        height: ScreenUtils.onePixel,
                        alignSelf: 'center',
                        opacity: 0.7
                    }}/>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    {this.accountItemView(StringUtils.formatMoneyString(user.availableBalance ? user.availableBalance : '0.00', false), '现金账户', () => {
                        this.go2CashDetailPage(1);
                    })}
                    {this.accountItemView(user.userScore ? user.userScore + '' : '0', '秀豆账户', () => {
                        this.go2CashDetailPage(2);
                    })}
                    {this.accountItemView(StringUtils.formatMoneyString(user.blockedBalance ? user.blockedBalance : '0.00', false), '待提现账户', () => {
                        this.go2CashDetailPage(3);
                    })}

                    {/*{this.accountItemView(StringUtils.formatMoneyString(user.availableBalance), '现金账户', '#FF4F6E', () => {*/}
                    {/*this.go2CashDetailPage(1);*/}
                    {/*})}*/}

                    {/*{this.accountItemView(StringUtils.isEmpty(user.userScore) ? '0' : StringUtils.formatMoneyString(user.userScore, false) + '', '秀豆账户', DesignRule.bgColor_yellowCard, () => {*/}
                    {/*this.go2CashDetailPage(2);*/}
                    {/*})}*/}
                    {/*{this.accountItemView(StringUtils.formatMoneyString(user.blockedBalance), '待提现账户', '#8EC7FF', () => {*/}
                    {/*this.go2CashDetailPage(3);*/}
                    {/*})}*/}
                </View>
            </ImageBackground>
        );
    };


    // accountRender = () => {
    //     return (
    //         <View source={mine_account_bg} style={{
    //             marginTop: px2dp(10),
    //             backgroundColor:DesignRule.white,
    //             paddingHorizontal:DesignRule.margin_page,
    //         }}>
    //             <View style={{ height: px2dp(44), justifyContent: 'center' }}>
    //                 <Text style={{ fontSize: DesignRule.fontSize_secondTitle, color: DesignRule.textColor_secondTitle }}>
    //                     我的资产
    //                 </Text>
    //             </View>
    //             <View
    //                 style={{
    //                     backgroundColor: DesignRule.lineColor_inColorBg,
    //                     width: ScreenUtils.width - px2dp(30),
    //                     height: ScreenUtils.onePixel,
    //                     alignSelf: 'center',
    //                 }}/>
    //             <View style={{
    //                 flexDirection: 'row',
    //                 justifyContent: 'space-between'
    //             }}>
    //
    //                 {this.accountItemView(StringUtils.formatMoneyString(user.availableBalance), '现金账户', '#FF4F6E', () => {
    //                     this.go2CashDetailPage(1);
    //                 })}
    //
    //                 {this.accountItemView(StringUtils.isEmpty(user.userScore) ? '0' : StringUtils.formatMoneyString(user.userScore, false) + '', '秀豆账户', DesignRule.bgColor_yellowCard, () => {
    //                     this.go2CashDetailPage(2);
    //                 })}
    //                 {this.accountItemView(StringUtils.formatMoneyString(user.blockedBalance), '待提现账户', '#8EC7FF', () => {
    //                     this.go2CashDetailPage(3);
    //                 })}
    //             </View>
    //         </View>
    //     );
    // };

    // accountItemView = (num, text, color, onPress) => {
    //     return (
    //         <TouchableWithoutFeedback onPress={onPress}>
    //             <View style={{
    //                 backgroundColor: color,
    //                 width: px2dp(110),
    //                 height:px2dp(62),
    //                 borderRadius: px2dp(5),
    //                 elevation: 2,
    //                 shadowColor: DesignRule.textColor_mainTitle,
    //                 shadowOffset: { h: 2, w: 2 },
    //                 shadowRadius: px2dp(6),
    //                 shadowOpacity: 0.1,
    //                 justifyContent: 'space-between',
    //                 alignItems: 'center',
    //                 marginTop: px2dp(27),
    //                 marginBottom: px2dp(38),
    //                 paddingTop:px2dp(16),
    //                 paddingBottom:px2dp(11)
    //             }}>
    //                 <Text allowFontScaling={true} style={{
    //                     textAlign: 'center',
    //                     color: 'white',
    //                     includeFontPadding: false,
    //                     width: 80,
    //                     height: 20,
    //                     fontSize: this.getAdjustsFontSize(num)
    //                 }}>
    //                     {num}
    //                 </Text>
    //                 <Text style={{ color: 'white', fontSize: px2dp(11), includeFontPadding: false }}>
    //                     {text}
    //                 </Text>
    //             </View>
    //         </TouchableWithoutFeedback>
    //     );
    // };

    getAdjustsFontSize = (text) => {
        let fontSize = Math.sqrt(80 * 20 / text.length);
        fontSize = Math.min(fontSize, 19);
        return Math.max(fontSize, 1);
    };

    accountItemView = (num, text, onPress) => {
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={{
                    width: px2dp(110),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: px2dp(16),
                    marginBottom: px2dp(27)
                }}>
                    <Text allowFontScaling={true} style={{
                        textAlign: 'center',
                        color: 'white',
                        includeFontPadding: false,
                        width: 80,
                        height: 20,
                        fontSize: this.getAdjustsFontSize(num)
                    }}>
                        {num}
                    </Text>
                    <View style={{ height: 9 }}/>
                    <Text style={{ color: 'white', fontSize: px2dp(12), includeFontPadding: false }}>
                        {text}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    // accountItemView = (num, text, func) => {
    //     return (
    //         <TouchableWithoutFeedback onPress={func}>
    //             <View style={{ alignItems: 'center' }}>
    //                 <Text style={{ fontSize: DesignRule.fontSize_mainTitle, color: DesignRule.white }}>
    //                     {num}
    //                 </Text>
    //                 <Text style={{ marginTop: px2dp(5), fontSize: DesignRule.fontSize_24, color: DesignRule.white }}>
    //                     {text}
    //                 </Text>
    //             </View>
    //         </TouchableWithoutFeedback>
    //     );
    // };

    orderRender() {
        return (
            <View style={{
                backgroundColor: 'white',
                marginTop: DesignRule.margin_listGroup,
                marginHorizontal: DesignRule.margin_page,
                borderRadius: px2dp(5)
            }}>
                <View style={{
                    height: px2dp(44),
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                        <UIText value={'我的订单'}
                                style={{
                                    fontSize: DesignRule.fontSize_secondTitle,
                                    color: DesignRule.textColor_mainTitle
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
                <View style={{
                    backgroundColor: DesignRule.lineColor_inWhiteBg,
                    width: ScreenUtils.width - DesignRule.margin_page * 2,
                    height: ScreenUtils.onePixel,
                    alignSelf: 'center'
                }}/>
                <View style={{ flex: 1, flexDirection: 'row', paddingBottom: px2dp(28) }}>
                    {this.renderOrderStates()}
                </View>
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
                    style={{ height: px2dp(44), paddingHorizontal: DesignRule.margin_page, justifyContent: 'center' }}>
                    <Text
                        style={{
                            color: DesignRule.textColor_mainTitle,
                            fontSize: DesignRule.fontSize_secondTitle,
                            includeFontPadding: false
                        }}>
                        常用工具
                    </Text>
                </View>
                <View style={{
                    backgroundColor: DesignRule.lineColor_inWhiteBg,
                    width: ScreenUtils.width - DesignRule.margin_page * 2,
                    height: ScreenUtils.onePixel,
                    marginBottom: px2dp(24)
                }}/>
                {this.renderMenu()}
            </View>
        );
    }

    renderBodyView = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}
                        onScroll={this._onScroll.bind(this)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._reload}
                                progressViewOffset={statusBarHeight + 44}
                                colors={[DesignRule.mainColor]}
                                title="下拉刷新"
                                tintColor={DesignRule.textColor_instruction}
                                titleColor={DesignRule.textColor_instruction}
                            />}
            >
                {this.renderUserHead()}
                {this.accountRender()}
                {this.orderRender()}
                {this.utilsRender()}
                {this.renderMoreMoney()}
            </ScrollView>
        );
    };

    renderMoreMoney = () => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.$navigate('ShowListPage');

            }}>
                <UIImage style={styles.makeMoneyMoreBackground} resizeMode={'stretch'} source={profile_banner}/>
            </TouchableWithoutFeedback>
        );
    };

    renderOrderStates = () => {
        let statesImage = [mine_wait_pay_icon, mine_wait_send_icon, mine_wait_receive_icon, mine_after_buy_icon];
        let statesText = ['待付款', '待发货', '待收货', '售后/退款'];
        let arr = [];
        for (let i = 0; i < statesImage.length; i++) {
            let num = this.getOrderNum(i);
            let numView = num ? (
                <View style={{
                    width: px2dp(16),
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
                        {num > 99 ? 99 : num}
                    </Text>
                </View>
            ) : null;

            arr.push(
                <NoMoreClick style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: px2dp(30) }}
                             onPress={() => this.jumpToOrderAccordingStates(i)} key={i}>
                    <ImageBackground source={statesImage[i]}
                                     style={{ height: 18, width: 20, marginBottom: 10, overflow: 'visible' }}>
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
                return userOrderNum.afterSaleServiceNum;
                break;
            default:
                return 0;
                break;
        }
    }

    renderMenu = () => {

        let leftImage = [mine_icon_invite, mine_coupon_icon, mine_icon_data, mine_icon_favorite_shop, mine_icon_help_service, mine_icon_address, mine_icon_discollect
            // ,this.state.hasFans?mine_icon_fans:null
            , user.upUserCode ? mine_icon_mentor : null];
        let leftText = ['邀请好友', '优惠券', '我的晋升', '收藏店铺', '帮助与客服', '地址', '秀场收藏'
            // , this.state.hasFans?'我的秀迷':null
            ,user.upUserCode ? '导师' : null];

        let arr = [];
        for (let i = 0; i < leftImage.length; i++) {
            arr.push(
                <NoMoreClick style={{
                    width: '25%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10
                }} onPress={() => this.orderMenuJump(i)} key={i}>
                    <UIImage source={leftImage[i]}
                             style={{ height: i === 0 ? 19 : 18, width: 20, marginBottom: 10 }}/>
                    <UIText value={leftText[i]} style={styles.greyText}/>
                </NoMoreClick>
            );
        }
        return arr;
    };


    //跳转到对应的订单状态页面
    jumpToOrderAccordingStates = (index) => {
        if (!user.isLogin) {
            this.$navigate('login/login/LoginPage');
            return;
        }
        switch (index) {
            case 0:
                this.$navigate('order/order/MyOrdersListPage', { index: 1 });
                break;
            case 1:
                this.$navigate('order/order/MyOrdersListPage', { index: 2 });
                break;
            case 2:
                this.$navigate('order/order/MyOrdersListPage', { index: 3 });
                break;
            case 3:
                this.$navigate('order/afterSaleService/AfterSaleListPage', { index: 4 });
                break;
        }
    };

    //跳转到对应的账户页面
    go2CashDetailPage(i) {
        switch (i) {
            case 1:
                this.$navigate('mine/userInformation/MyCashAccountPage', { availableBalance: user.availableBalance });
                break;
            case 2:
                this.$navigate('mine/userInformation/MyIntegralAccountPage', { userScore: user.userScore ? user.userScore : 0 });
                break;
            case 3:
                this.$navigate('mine/userInformation/WaitingForWithdrawCashPage', { blockedBalance: user.blockedBalance ? user.blockedBalance : 0 });
                break;
            default:
                break;
        }
    }

    orderMenuJump = (index) => {
        // if (!user.isLogin) {
        //     this.props.navigation.navigate('login/login/LoginPage');
        //     return;
        //let leftText = ['邀请好友', '优惠券', '我的数据', '收藏店铺', '帮助', '地址', '足迹', '发现收藏'];
        switch (index) {
            case 0:
                this.$navigate(RouterMap.InviteFriendsPage);
                break;
            case 1:
                this.$navigate(RouterMap.CouponsPage);
                break;
            case 2:
                this.$navigate(RouterMap.MyPromotionPage);
                break;
            case 3:
                // this.props.navigation.navigate('order/order/MyOrdersListPage', { index: 2 });
                this.$navigate(RouterMap.MyCollectPage);
                break;
            case 4:
                // this.props.navigation.navigate('mine/MyCollectPage');
                this.$navigate(RouterMap.MyHelperPage);
                break;
            case 5:
                this.$navigate(RouterMap.AddressManagerPage);
                break;
                // case 6:
                //     this.props.navigation.navigate(RouterMap.UserPromotionPage);
                //     break;
                // case 6:
                //     this.props.navigation.navigate(RouterMap.ShareTaskListPage);
                break;
            case 6:
                this.$navigate(RouterMap.ShowConnectPage);
                break;
            //邀请评分
            // case 10:
            //     //
            //     const appId = "1";
            //     const url = `https://itunes.apple.com/cn/app/id${appId}?mt=8`;
            //     Platform.OS === "ios" && Linking.canOpenURL(url).then(() => {
            //         Linking.openURL(url);
            //     }).catch(e => {
            //         console.warn(e);
            //         // Toast.toast('无法前往AppStore');
            //     });
            //     break;
            //邀请评分
            // case 7:
            //     this.$navigate(RouterMap.WebViewDemo);
            //     break;
            // case 7:
            //     if(this.state.hasFans){
            //         this.$navigate(RouterMap.MyShowFansPage);
            //     }
            //     break;
            case 7:
                if (user.upUserCode) {
                    this.$navigate(RouterMap.MyMentorPage);
                }
                break;
            default:

                break;
        }
    };

    jumpToAllOrder = () => {
        if (!user.isLogin) {
            this.gotoLoginPage()
            return;
        }
        this.$navigate('order/order/MyOrdersListPage', { index: 0 });
    };
    jumpToServicePage = () => {
        if (!user.isLogin) {
            this.$navigate('login/login/LoginPage');
            return;
        }
        this.$navigate('message/MessageCenterPage');
    };

    jumpToSettingPage = () => {
        this.$navigate('mine/SettingPage', { callBack: () => this.loadPageData() });

    };
}

const profileWidth=ScreenUtils.width - (DesignRule.margin_page-1.5) * 2;
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
        paddingTop: ScreenUtils.statusBarHeight,
        justifyContent: 'center'
    },
    userIconStyle: {
        width: px2dp(54),
        height: px2dp(54),
        borderRadius: px2dp(27),
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
        height: (profileWidth*140/702),
        width: profileWidth,
        top: ScreenUtils.getImgHeightWithWidth(headerBgSize) - px2dp(31),
        left: DesignRule.margin_page-1.5,
        position: 'absolute',
        flexDirection: 'row'
    },
    moreMoneyWrapper: {
        marginLeft: px2dp(180),
        alignSelf: 'center',
        height: px2dp(32),
        justifyContent: 'space-between'
    }
});

