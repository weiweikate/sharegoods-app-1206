import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import CommModal from '../../../comm/components/CommModal';
import { NavigationActions } from 'react-navigation';
import LoginAPI from '../api/LoginApi';
import StringUtils from '../../../utils/StringUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import {MRText as Text} from '../../../components/ui'

const {
    refresh,
    button: {
        tongyong_btn_close_white: closeIcon
    },
    other: {
        red_big_envelope
    }
} = res;


export default class GetRedpacketPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            showRedAlter: false,
            // redPacketData: null
            phone: '*****',
            price: 0
        };
    }

    // 导航配置
    $navigationBarOptions = {
        title: '领取红包',
        gesturesEnabled: false
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.jump}>
                跳过
            </Text>
        );
    };

    _renderCouponModal() {
        const { px2dp } = ScreenUtils;
        let view = (
            <View style={{ position: 'absolute', bottom: 18, left: 0, right: 0, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: px2dp(24) }} allowFontScaling={false}>
                    领取成功
                </Text>
                <Text style={{ color: 'white', fontSize: px2dp(11), marginTop: px2dp(5) }} allowFontScaling={false}>
                    可前往我的-优惠券查看
                </Text>
            </View>
        );

        return (
            <CommModal
                ref={(ref) => {
                    this.modal = ref;
                }}
                visible={this.state.showRedAlter}>
                <TouchableOpacity
                    onPress={
                        () => {
                            this._closeModal();
                        }
                    }
                >
                    <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center', justifyContent: 'center' }}>
                        <ImageBackground source={red_big_envelope} style={{
                            height: px2dp(362), width: px2dp(257),
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                color: 'white',
                                includeFontPadding: false,
                                fontSize: px2dp(14),
                                marginTop: 26
                            }} allowFontScaling={false}>

                                {/*{ this.state.redPacketData && this.state.redPacketData.phone?this.redPacketData.phone:''}*/}
                                {StringUtils.formatPhoneNumber(this.state.phone)}
                                {/*{EmptyUtils.isEmpty(this.state.couponData) ? null : StringUtils.encryptPhone(this.state.couponData.phone)}*/}
                            </Text>
                            <Text style={{ color: 'white', includeFontPadding: false, fontSize: px2dp(14) }}>
                                赠送了你一个红包
                            </Text>

                            <Text style={{
                                includeFontPadding: false,
                                color: 'white',
                                fontSize: px2dp(60),
                                marginTop: 20
                            }} allowFontScaling={false}>

                                {/*{this.state.redPacketData && this.state.redPacketData.price?this.state.redPacketData.price:''}*/}
                                {StringUtils.formatMoneyString(this.state.price, false)}
                                {/*{EmptyUtils.isEmpty(this.state.couponData) ? null : this.state.couponData.price}*/}
                                <Text
                                    style={{ includeFontPadding: false, color: 'white', fontSize: px2dp(15) }} allowFontScaling={false}>
                                    元
                                </Text>
                            </Text>
                            <Text style={{
                                includeFontPadding: false,
                                color: 'white',
                                fontSize: px2dp(14),
                                marginTop: 12
                            }} allowFontScaling={false}>
                                红包抵扣金
                            </Text>
                            {view}
                        </ImageBackground>
                        <TouchableWithoutFeedback onPress={() => {
                            this._closeModal();
                        }}>
                            <Image source={closeIcon} style={{
                                position: 'absolute',
                                top: 110,
                                right: 35,
                                width: 24,
                                height: 24
                            }}/>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>
            </CommModal>
        );
    }

    _closeModal = () => {
        this.setState({
            showRedAlter: false
        });
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <View
                    style={Styles.topViewStyle}
                >
                    {this._renderTopText()}
                    {this._renderRedPacketList()}
                </View>
                <View
                    style={Styles.bottomViewStyle}
                >
                    <Text
                        onPress={
                            () => this.jumpToWriteCodePage()
                        }
                        style={{
                            color: '#979797',
                            height: 20,
                            width: 100,
                            fontSize: 13,
                            borderWidth: 1,
                            borderRadius: 10,
                            textAlign: 'center',
                            borderColor: '#979797',
                            paddingTop: 2
                        }}

                    >
                        填写授权码
                    </Text>
                </View>
                {this._renderCouponModal()}
            </View>
        );
    }

    _renderTopText = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 40,
                    backgroundColor: DesignRule.bgColor
                }}
            >
                <Text
                    style={{
                        fontSize: 13,
                        color: DesignRule.textColor_mainTitle,
                        marginLeft: 15
                    }}
                >
                    请选择一个红包
                </Text>

                <TouchableOpacity>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 15

                        }}
                    >
                        <Image
                            style={{
                                width: 16,
                                height: 16
                            }}
                            source={refresh}
                        />
                        <Text
                            style={{
                                fontSize: 13,
                                color: DesignRule.textColor_secondTitle,
                                marginLeft: 5
                            }}
                            onPress={
                                () => this._changeRedpacket()
                            }
                        >
                            换一批
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    /**
     *
     */
    _changeRedpacket = () => {
       // this.
    };
    /**
     * 渲染红包列表
     * @return {*}
     * @private
     */
    _renderRedPacketList = () => {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'

                }}
            >
                <View
                    style={{
                        // flex:1,
                        width: 240,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        flexWrap: 'wrap'  //设置换行显示
                    }}
                >
                    {
                        this._getredPackageListItem().map((redItemView, index) => {
                                return redItemView;
                            }
                        )
                    }

                </View>
            </View>
        );
    };
    /**
     * 渲染红包item
     * @return {Array}
     * @private
     */
    _getredPackageListItem = () => {
        let tempArr = [];
        for (let index = 0; index < 4; index++) {
            tempArr.push(
                <TouchableOpacity
                    key={index}
                    onPress={
                        () => {
                            this.redPacketClick(index);
                        }
                    }
                >
                    <View
                        style={{
                            width: 100,
                            height: 142,
                            marginTop: 30
                        }}
                    >
                        <ImageBackground
                            style={
                                {
                                    flex: 1,
                                    alignItems: 'center'
                                }
                            }
                            source={red_big_envelope}
                        >
                            <Text
                                style={{
                                    marginTop: 20,
                                    height: 30,
                                    color: 'white',
                                    textAlign: 'center'
                                }}
                            >
                                赠送红包
                            </Text>
                            <Text
                                style={{
                                    width: 30,
                                    height: 30,
                                    marginTop: 35,
                                    color: '#80522A',
                                    fontSize: 13,
                                    textAlign: 'center'
                                }}

                            >
                                领
                            </Text>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            );

        }
        return tempArr;

    };

    //Action
    /**
     * 跳过函数
     */
    jump = () => {
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };
    jumpToWriteCodePage = () => {
        this.$navigate('login/login/InviteCodePage');
    };
    redPacketClick = (redPacketIndex) => {
        this.$loadingShow('加载中');
        LoginAPI.userReceivePackage({
            type: 1
        }).then(result => {
            this.$loadingDismiss();
            console.log(result);
            this.setState({
                showRedAlter: true,
                phone: result.data.phone,
                price: result.data.price
            });
        }).catch(reason => {
            this.$loadingDismiss();
            this.$toastShow(reason.msg);
        });
    };
}

const Styles = StyleSheet.create(
    {
        contentStyle: {
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: DesignRule.bgColor
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: DesignRule.textColor_secondTitle
        },
        topViewStyle: {
            height: ScreenUtils.px2dp(430)
            // backgroundColor:ColorUtil.Color_222222

        },
        bottomViewStyle: {
            height: 100,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
);

