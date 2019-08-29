/**
 * @author xzm
 * @date 2018/10/12
 */
import React from 'react';
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import SignInCircleView from './components/SignInCircleView';
import ImageLoader from '@mr/image-placeholder';
import HomeAPI from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import user from '../../../model/user';
import { observer } from 'mobx-react';
import EmptyUtils from '../../../utils/EmptyUtils';
import MineApi from '../../mine/api/MineApi';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import apiEnvironment from '../../../api/ApiEnvironment';
import { track, TrackApi, trackEvent } from '../../../utils/SensorsTrack';
import { MRText as Text } from '../../../components/ui';
import CommModal from '../../../comm/components/CommModal';
import { homeModule } from '../model/Modules';
import RouterMap from '../../../navigation/RouterMap';
import LinearGradient from 'react-native-linear-gradient';
import TaskView from '../view/TaskView';
import { mineTaskModel } from '../model/TaskModel';

const { px2dp } = ScreenUtils;

const platformHeight = 10;

const {
    coupons_bg: couponBackground,
    modal_close: modalClose,
    signin_header: headerBg,
    white_bg: whiteBg,
    signinButton,
    noSigninButton
} = res.signIn;
const {
    back_white,
    back_black
} = res.button;
const headerHeight = ScreenUtils.statusBarHeight + 44;
const size = {
    width: 375,
    height: 241
};
const headerBgHeight = ScreenUtils.getImgHeightWithWidth(size);

@observer
export default class SignInPage extends BasePage {
    constructor(props) {
        super(props);
        this.first = true; //初次进入
        this.signinRequesting = false;
        this.exchangeing = false;
        this.state = {
            loadingState: PageLoadingState.loading,
            signInData: null,
            exchangeData: null,
            showModal: false,
            modalInfo: null,
            changeHeader: true
        };
    }

    $navigationBarOptions = {
        title: '签到',
        show: false// false则隐藏导航
    };

    $isMonitorNetworkStatus() {
        return true;
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this.loadPageData
            }
        };
    };


    componentWillMount() {
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                if (user.token) {
                    this.loadPageData();
                    mineTaskModel.getData();
                } else {
                    if (this.first) {
                        this.loadPageData();
                        this.first = false;
                    }
                }
            }
        );
    }

    componentWillUnmount() {
        this.didFocusSubscription && this.didFocusSubscription.remove();
    }

    loadPageData = () => {
        this.getSignData();
        this.reSaveUserInfo();
        this.getExchange();
        this.getModalInfo();
    };

    getModalInfo = () => {
        HomeAPI.getHomeData({ type: homeType.signIn }).then((data) => {
            this.setState({
                modalInfo: data.data
            });
        });
    };

    /**
     * 获取秀豆兑换比例
     */
    getExchange = () => {
        HomeAPI.getExchange().then((data) => {
            this.setState({
                exchangeData: data.data
            });
        }).catch((error) => {
            this.setState({
                exchangeData: null
            });
        });
    };

    getSignData = () => {
        let callback = this.loadPageData;
        HomeAPI.querySignList(null, { callback }).then((data) => {
            this.setState({
                signInData: data.data,
                // loading: false,
                refreshing: false,
                netFailedInfo: null,
                loadingState: PageLoadingState.success
            });
        }).catch((error) => {
            this.setState({
                // loading: false,
                refreshing: false,
                netFailedInfo: error,
                loadingState: PageLoadingState.fail
            });
        });
    };

    reSaveUserInfo = () => {
        MineApi.getUser({}, { nav: this.props.navigation, callback: this.loadPageData }).then(res => {
            if (res.code === 10000) {
                let data = res.data;
                user.saveUserInfo(data);
            }
        }).catch(err => {
        });
    };

    showMore = () => {
        this.$navigate(RouterMap.HtmlPage, {
            title: '签到规则',
            uri: `${apiEnvironment.getCurrentH5Url()}/static/protocol/signInRule.html`
        });
    };

    //签到
    userSign = () => {
        if (this.signinRequesting) {
            return;
        }
        this.signinRequesting = true;
        let count;
        if (this.state.signInData[3].continuous) {
            count = this.state.signInData[3].continuous;
        } else {
            count = this.state.signInData[2].continuous ? this.state.signInData[2].continuous : 0;
        }
        TrackApi.SignUpFeedback({
            continuousSignNumber: count,
            signRewardType: 1,
            signRewardAmount: this.state.signInData[3] && this.state.signInData[3].canReward
        });
        HomeAPI.userSign().then((data) => {
            this.signinRequesting = false;
            this.$toastShow(`签到成功 +${(this.state.signInData[3] && this.state.signInData[3].canReward) || 0}秀豆`);
            this.getSignData();
            this.reSaveUserInfo();
            if (this.state.modalInfo && this.state.modalInfo.length > 0) {
                this.setState({
                    showModal: true
                });
            }
            mineTaskModel.getData();
        }).catch((error) => {
            this.signinRequesting = false;
            this.$toastShow(error.msg);
        });
    };

    //兑换一元优惠券
    exchangeCoupon = () => {
        if (this.exchangeing) {
            return;
        }
        this.exchangeing = true;
        track(trackEvent.receiveshowDou, {
            showDouDeduct: 'exchange',
            showDouAmount: this.state.signInData[3] && this.state.signInData[3].canReward
        });
        track(trackEvent.receiveOneyuan, { yiYuanCouponsAmount: 1, yiYuanCouponsGetMethod: 'exchange' });
        HomeAPI.exchangeTokenCoin().then((data) => {
            this.exchangeing = false;
            this.$toastShow('成功兑换一张1元现金券');
            this.reSaveUserInfo();
        }).catch((error) => {
            this.exchangeing = false;
            this.$toastShow(error.msg);
        });
    };


    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y <= 200) {
            this.st = Y / 200;
            if (!this.state.changeHeader) {
                this.setState({
                    changeHeader: true
                });
            }
        } else {
            this.st = 1;
            if (this.state.changeHeader) {
                this.setState({
                    changeHeader: false
                });
            }
        }

        this.headerBg.setNativeProps({
            opacity: this.st
        });
    };


    //**********************************ViewPart******************************************
    _signInInfoRender = () => {
        let circlesView = this.state.signInData.map((item, index) => {
            let kind, count;
            count = !EmptyUtils.isEmpty(item.reward) ? item.reward : item.canReward;
            if (index < 3) {
                if (item.continuous > 0) {
                    kind = 'signedIn';
                } else {
                    kind = 'noSignIn';
                }
            } else if (index === 3) {
                if (item.continuous > 0) {
                    kind = 'signingIn';
                } else {
                    kind = 'willSignIn';
                    count = item.canReward;
                }
            } else if (index > 3) {
                kind = 'willSignIn';
            }
            if (index === 0) {
                return <SignInCircleView key={'circle' + index} count={count} kind={kind}/>;
            } else {
                return (
                    <View key={'circle' + index} style={styles.signInItemWrapper}>
                        <View style={{ flex: 1 }}/>
                        <SignInCircleView count={count} kind={kind}/>
                    </View>
                );
            }
        });

        let datesView = this.state.signInData.map((item, index) => {
            return (
                <Text key={'date' + index} style={styles.dateTextStyle}>
                    {item.signDate && item.signDate.replace('-', '.')}
                </Text>
            );
        });

        return (
            <ImageBackground source={whiteBg} resizeMode={'stretch'} style={styles.signInInfoWrapper}>
                <View style={styles.dateWrapper}>
                    {datesView}
                </View>
                <View style={styles.circleWrapper}>
                    {circlesView}
                </View>
                {this._signButton()}
            </ImageBackground>
        );
    };

    _signButton = () => {
        let hasSign = !EmptyUtils.isEmpty(this.state.signInData[3].continuous);

        if (hasSign) {
            let count;
            if (this.state.signInData[3].continuous) {
                count = this.state.signInData[3].continuous;
            } else {
                count = this.state.signInData[2].continuous ? this.state.signInData[2].continuous : 0;
            }
            return (
                <ImageBackground source={signinButton}
                                 style={{
                                     height: px2dp(56),
                                     width: px2dp(291),
                                     marginTop: px2dp(20),
                                     alignItems: 'center',
                                     alignSelf: 'center',
                                     justifyContent: 'center',
                                     borderRadius: px2dp(20)
                                 }}>
                    <Text style={{
                        color: DesignRule.white,
                        fontSize: px2dp(16),
                        marginTop: px2dp(-5)
                    }}>
                        {`已连续签到${count}天`}
                    </Text>
                </ImageBackground>
            );
        }
        return (
            <TouchableWithoutFeedback onPress={this.userSign}>
                <View>
                    <ImageBackground source={noSigninButton}
                                     style={{
                                         height: px2dp(56),
                                         width: px2dp(291),
                                         marginTop: px2dp(20),
                                         justifyContent: 'center',
                                         alignItems: 'center',
                                         alignSelf: 'center',
                                         borderRadius: px2dp(20)
                                     }}>
                        <Text style={{
                            color: DesignRule.white, fontSize: px2dp(16),
                            marginTop: px2dp(-5)
                        }}>
                            签到有礼
                        </Text>
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
        );

    };

    _couponRender() {
        let bgWidth = DesignRule.width - px2dp(14);
        let bgHeight = ScreenUtils.getImgHeightWithWidth({ width: 361, height: 96 }, bgWidth);
        return (
            <View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: px2dp(10),
                    marginTop: px2dp(15),
                    marginLeft: DesignRule.margin_page
                }}>
                    <View style={{ width: 2, height: 8, borderRadius: 2, backgroundColor: DesignRule.mainColor }}/>
                    <Text
                        style={{
                            marginLeft: px2dp(10),
                            color: DesignRule.textColor_secondTitle,
                            fontSize: px2dp(16)
                        }}>
                        其他福利
                    </Text>
                </View>
                <ImageBackground source={couponBackground} style={{
                    height: bgHeight,
                    width: bgWidth,
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginLeft: px2dp(8)
                }}>
                    <View style={styles.couponTextWrapper}>
                        <Text style={styles.couponNameTextStyle}>
                            秀豆兑换1元现金券
                        </Text>
                        <Text style={styles.couponTagTextStyle}>
                            {`${this.state.exchangeData}秀豆兑换1张劵\n无兑换限制，点击即可兑换`}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}/>
                    <TouchableWithoutFeedback onPress={this.exchangeCoupon}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        colors={['#FC5D39', '#FF0050']}
                                        style={styles.convertButtonStyle}>
                            <Text style={styles.convertTextStyle}>
                                立即兑换
                            </Text>
                        </LinearGradient>
                    </TouchableWithoutFeedback>
                </ImageBackground>
            </View>
        );
    }

    navRender = () => {
        return (
            <View
                style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: px2dp(5),
                    paddingRight: px2dp(15),
                    height: headerHeight,
                    paddingTop: ScreenUtils.statusBarHeight
                }}>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={[styles.left, { width: 40 }]}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}>
                            <Image
                                source={this.state.changeHeader ? back_white : back_black}
                                resizeMode={'stretch'}
                                style={{ height: 30, width: 30 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        color: this.state.changeHeader ? DesignRule.white : DesignRule.textColor_mainTitle,
                        fontSize: px2dp(17),
                        includeFontPadding: false
                    }}>
                        签到
                    </Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <TouchableWithoutFeedback onPress={this.showMore}>
                            <Text style={{
                                color: this.state.changeHeader ? DesignRule.white : DesignRule.textColor_mainTitle,
                                fontSize: px2dp(12),
                                includeFontPadding: false
                            }}>
                                签到规则
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>

                </View>
            </View>
        );
    };

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

    _headerIconRender() {

        return (
            <ImageBackground source={headerBg} style={{ width: DesignRule.width, height: headerBgHeight }}>
                <Text style={{
                    marginTop: px2dp(70),
                    color: DesignRule.white,
                    marginLeft: px2dp(34),
                    fontSize: DesignRule.fontSize_threeTitle
                }}>
                    我的秀豆
                </Text>
                <Text style={{
                    color: DesignRule.white,
                    fontSize: px2dp(50),
                    marginLeft: px2dp(34),
                    marginTop: px2dp(5),
                    fontWeight: 'bold',
                    includeFontPadding: false
                }}>
                    {user.userScore ? user.userScore : 0}
                </Text>
            </ImageBackground>
        );


    }


    _modalPress = () => {
        this.setState({
            showModal: false
        });
        if (this.state.modalInfo && this.state.modalInfo.length > 0) {
            const item = this.state.modalInfo[0];
            let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
            let params = homeModule.paramsNavigate(item);
            this.$navigate(router, { ...params });
        }
    };

    _signModalRender() {
        return (this.state.modalInfo && this.state.modalInfo.length > 0) ? (
            <CommModal onRequestClose={() => {
                this.setState({
                    showModal: false
                });
            }} visible={this.state.showModal}>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        this._modalPress();
                    }}>
                        <ImageLoader
                            source={{ uri: this.state.modalInfo[0].image }}
                            showPlaceholder={false}
                            style={styles.modalImageStyle}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({
                            showModal: false
                        });
                    }}>
                        <Image source={modalClose} style={styles.closeIconStyle}/>
                    </TouchableWithoutFeedback>
                </View>
            </CommModal>
        ) : null;
    }

    _render() {

        return (
            <View style={styles.container}>
                <ScrollView
                    onScroll={this._onScroll}
                    scrollEventThrottle={30}
                    showsVerticalScrollIndicator={false}>
                    {this._headerIconRender()}
                    {this.state.signInData ? this._signInInfoRender() : null}
                    <TaskView type={'mine'}
                              isSignIn={true}
                              signIn={this.userSign}
                              style={{ marginTop: platformHeight, backgroundColor: '#F7F7F7', paddingBottom: 0 }}/>
                    {this.state.exchangeData ? this._couponRender() : null}
                    {/*{this.state.exchangeData ? this._reminderRender() : null}*/}
                </ScrollView>
                {this.navBackgroundRender()}
                {this.navRender()}
                {this._signModalRender()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightItemStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(12)
    },
    headerImageStyle: {
        width: ScreenUtils.width,
        height: px2dp(178)
    },
    signInButtonWrapper: {
        backgroundColor: DesignRule.mainColor,
        width: px2dp(82),
        height: px2dp(82),
        borderRadius: px2dp(41),
        borderColor: '#e8cbd3',
        borderWidth: px2dp(4),
        alignSelf: 'center',
        marginTop: px2dp(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    signInCountTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(12),
        alignSelf: 'center',
        marginTop: px2dp(10)
    },
    signInInfoWrapper: {
        width: ScreenUtils.width - px2dp(14),
        paddingTop: px2dp(29),
        marginTop: px2dp(-67),
        marginLeft: px2dp(7),
        paddingBottom: px2dp(37)
    },
    circleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px2dp(21),
        marginTop: px2dp(15)
    },
    signInItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    dateWrapper: {
        flexDirection: 'row',
        paddingHorizontal: px2dp(23),
        justifyContent: 'space-between'
    },
    dateTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(11)
    },
    showBeanIconStyle: {
        width: px2dp(30),
        height: px2dp(30)
    },
    showBeanTextStyle: {
        color: 'white'
    },
    couponBgStyle: {
        height: px2dp(80),
        width: ScreenUtils.width - px2dp(30),
        marginLeft: px2dp(15),
        alignItems: 'center',
        marginTop: px2dp(15),
        flexDirection: 'row'
    },
    couponNameTextStyle: {
        color: DesignRule.textColor_mainTitle_222,
        fontSize: px2dp(16),
        fontWeight: 'bold'
    },
    couponTagTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(10)
    },
    couponTextWrapper: {
        paddingVertical: px2dp(13),
        justifyContent: 'space-between',
        marginLeft: px2dp(78),
        marginTop: -3
    },
    convertWrapper: {
        alignItems: 'center',
        marginRight: px2dp(10),
        height: px2dp(94) - px2dp(30),
        justifyContent: 'space-between'
    },
    convertButtonStyle: {
        height: px2dp(28),
        width: px2dp(70),
        borderRadius: px2dp(14),
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: px2dp(15)
    },
    convertTextStyle: {
        color: 'white',
        fontSize: px2dp(12)
    },
    reminderStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(11),
        marginTop: px2dp(10),
        marginLeft: px2dp(15)
    },
    couponsTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(11),
        alignSelf: 'center',
        marginBottom: px2dp(15),
        includeFontPadding: false
    },
    willSignTextStyle: {
        fontSize: px2dp(30),
        color: 'white'
    },
    closeIconStyle: {
        width: px2dp(38),
        height: px2dp(38),
        marginTop: px2dp(30)
    },
    modalImageStyle: {
        width: ScreenUtils.autoSizeWidth(310),
        height: ScreenUtils.autoSizeHeight(410)
    }

});
