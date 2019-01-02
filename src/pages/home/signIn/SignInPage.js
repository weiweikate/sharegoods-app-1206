/**
 * @author xzm
 * @date 2018/10/12
 */
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import SignInCircleView from './components/SignInCircleView';

const { px2dp } = ScreenUtils;

import HomeAPI from '../api/HomeAPI';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import user from '../../../model/user';
import { observer } from 'mobx-react/native';
import EmptyUtils from '../../../utils/EmptyUtils';
import MineApi from '../../mine/api/MineApi';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import apiEnvironment from '../../../api/ApiEnvironment';
import { track, trackEvent } from '../../../utils/SensorsTrack';
// import {track,trackEvent}from '../../../utils/SensorsTrack'

import { MRText as Text } from '../../../components/ui';

const {
    sign_in_bg: signInImageBg,
    showbean_icon: showBeanIcon,
    coupons_bg: couponBackground
} = res.signIn;

@observer
export default class SignInPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            signInData: null,
            exchangeData: null
        };
    }

    $navigationBarOptions = {
        title: '签到',
        show: true// false则隐藏导航
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

    $NavBarRenderRightItem = () => {
        return (
            <TouchableOpacity onPress={this.showMore}>
                <Text style={styles.rightItemStyle}>
                    签到规则
                </Text>
            </TouchableOpacity>
        );
    };

    componentDidMount() {
        this.loadPageData();
    }


    loadPageData = () => {
        this.getSignData();
        this.reSaveUserInfo();
        this.getExchange();
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
        HomeAPI.querySignList().then((data) => {
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
        this.$navigate('HtmlPage', {
            title: '签到规则',
            uri: `${apiEnvironment.getCurrentH5Url()}/static/protocol/signInRule.html`
        });
    };

    //签到
    userSign = () => {
        track(trackEvent.receiveshowDou, { showDouGet: 'scqd', showDouAmount: this.state.signInData[3].canReward });
        HomeAPI.userSign().then((data) => {
            this.$toastShow(`签到成功 +${this.state.signInData[3].canReward}秀豆`);
            this.getSignData();
            this.reSaveUserInfo();
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    //兑换一元优惠券
    exchangeCoupon = () => {
        track(trackEvent.receiveshowDou, {
            showDouDeduct: 'exchange',
            showDouAmount: this.state.signInData[3].canReward
        });
        track(trackEvent.receiveOneyuan, { yiYuanCouponsAmount: 1, yiYuanCouponsGetMethod: 'exchange' });
        HomeAPI.exchangeTokenCoin().then((data) => {
            this.$toastShow('成功兑换一张1元抵扣券');
            this.reSaveUserInfo();
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    //**********************************ViewPart******************************************
    _signInButtonRender() {
        let fontSize = px2dp(22);
        if (user.userScore) {
            let str = user.userScore + '';
            if (str.length > 4) {
                fontSize = px2dp(16);
            }
        }

        return (
            <TouchableWithoutFeedback onPress={()=>{
                this.$toastShow('今天已签到！');
            }}>
                <View style={styles.signInButtonWrapper}>
                    <Image style={styles.showBeanIconStyle} resizeMode={'stretch'} source={showBeanIcon}/>
                    <Text style={[styles.showBeanTextStyle, { fontSize: fontSize }]}>
                        {user.userScore ? user.userScore : 0}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _smallLineRenderWithColor(color) {
        return (<View style={{ backgroundColor: color, height: px2dp(2), width: px2dp(15) }}/>);
    }

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
                        <View style={{ backgroundColor: index < 4 ? 'white' : '#c6b478', height: px2dp(2), flex: 1 }}/>
                        <SignInCircleView count={count} kind={kind}/>
                    </View>
                );
            }
        });

        let datesView = this.state.signInData.map((item, index) => {
            return (
                <Text key={'date' + index} style={styles.dateTextStyle}>
                    {item.signDate.replace('-', '.')}
                </Text>
            );
        });

        return (
            <View style={styles.signInInfoWrapper}>
                <View style={styles.circleWrapper}>
                    {this._smallLineRenderWithColor('white')}
                    {circlesView}
                    {this._smallLineRenderWithColor('#c6b478')}
                </View>
                <View style={styles.dateWrapper}>
                    {datesView}
                </View>
            </View>
        );
    };

    _couponRender() {
        return (
            <ImageBackground source={couponBackground} style={styles.couponBgStyle}>
                <Text style={{ color: DesignRule.mainColor, fontSize: px2dp(36), marginLeft: px2dp(30) }}>
                    1<Text style={{ color: DesignRule.mainColor, fontSize: px2dp(14) }}>元</Text>
                </Text>
                <View style={styles.couponTextWrapper}>
                    <Text style={styles.couponNameTextStyle}>
                        抵扣券
                    </Text>
                    <Text style={styles.couponTagTextStyle}>
                        全场通用/无时间限制
                    </Text>
                </View>
                <View style={{ flex: 1 }}/>
                <View style={styles.convertWrapper}>
                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: px2dp(12),
                        includeFontPadding: false
                    }}>
                        消耗秀豆
                    </Text>
                    <Text style={{ color: DesignRule.mainColor, fontSize: px2dp(12), includeFontPadding: false }}>
                        {`-- ${this.state.exchangeData} --`}
                    </Text>
                    <TouchableWithoutFeedback onPress={this.exchangeCoupon}>
                        <View style={styles.convertButtonStyle}>
                            <Text style={styles.convertTextStyle}>
                                立即兑换
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    }

    _headerIconRender() {
        let hasSign = !EmptyUtils.isEmpty(this.state.signInData[3].continuous);
        let view = hasSign ? this._hasSignRender() : this._willSignRender();
        return view;

    }

    _hasSignRender = () => {
        let count;
        if (this.state.signInData[3].continuous) {
            count = this.state.signInData[3].continuous;
        } else {
            count = this.state.signInData[2].continuous ? this.state.signInData[2].continuous : 0;
        }
        return (
            <ImageBackground
                source={signInImageBg}
                style={styles.headerImageStyle}
                resizeMode={'stretch'}>
                {this._signInButtonRender()}
                <Text style={styles.signInCountTextStyle}>
                    {`连续签到${count}天`}
                </Text>
            </ImageBackground>
        );
    };

    _willSignRender = () => {
        let count;
        if (this.state.signInData[3].continuous) {
            count = this.state.signInData[3].continuous;
        } else {
            count = this.state.signInData[2].continuous ? this.state.signInData[2].continuous : 0;
        }
        return (
            <ImageBackground
                source={signInImageBg}
                style={styles.headerImageStyle}
                resizeMode={'stretch'}>
                <TouchableWithoutFeedback onPress={this.userSign}>
                    <View style={styles.signInButtonWrapper}>
                        <Text style={styles.willSignTextStyle}>
                            签
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <Text style={styles.signInCountTextStyle}>
                    {`连续签到${count}天`}
                </Text>
            </ImageBackground>
        );
    };

    _reminderRender = () => {
        return (
            <Text style={styles.reminderStyle}>
                {`注：${this.state.exchangeData}秀豆兑换1张券，无兑换限制，点击即可兑换`}
            </Text>
        );
    };

    _render() {

        return (
            <View style={styles.container}>
                {this._headerIconRender()}
                {this.state.signInData ? this._signInInfoRender() : null}
                {this.state.exchangeData ? this._couponRender() : null}
                {this.state.exchangeData ? this._reminderRender() : null}
                <View style={{ flex: 1 }}/>
                <TouchableWithoutFeedback onPress={() => this.$navigate('mine/coupons/CouponsPage')}>
                    <View>
                        <Text style={styles.couponsTextStyle}>
                            已有{user.tokenCoin ? user.tokenCoin : 0}张抵扣券>
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
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
        width: ScreenUtils.width - px2dp(30),
        height: px2dp(110),
        borderRadius: px2dp(5),
        backgroundColor: '#d4c59e',
        justifyContent: 'space-between',
        paddingVertical: px2dp(25),
        marginTop: px2dp(-30),
        marginLeft: px2dp(15)
    },
    circleWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    signInItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    dateWrapper: {
        flexDirection: 'row',
        paddingHorizontal: px2dp(15),
        justifyContent: 'space-between'
    },
    dateTextStyle: {
        color: 'white',
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
        height: px2dp(94),
        width: ScreenUtils.width - px2dp(30),
        marginLeft: px2dp(15),
        alignItems: 'center',
        marginTop: px2dp(15),
        flexDirection: 'row'
    },
    couponNameTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(14)
    },
    couponTagTextStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(12)
    },
    couponTextWrapper: {
        paddingVertical: px2dp(26),
        justifyContent: 'space-between',
        marginLeft: px2dp(30)
    },
    convertWrapper: {
        alignItems: 'center',
        marginRight: px2dp(10),
        height: px2dp(94) - px2dp(30),
        justifyContent: 'space-between'
    },
    convertButtonStyle: {
        height: px2dp(20),
        width: px2dp(68),
        borderRadius: px2dp(10),
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
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
    }

});
