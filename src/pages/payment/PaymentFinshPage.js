import React from 'react';
import BasePage from '../../BasePage';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import res from './res';
import { MRText } from '../../components/ui';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import { TrackApi } from '../../utils/SensorsTrack';
import ShareUtil from '../../utils/ShareUtil';
import user from '../../model/user';
import PaymentApi from './PaymentApi';
// import RouterMap from '../../navigation/RouterMap';
import apiEnvironment from '../../api/ApiEnvironment';
import bridge from '../../utils/bridge';
// import PaymentApi from './PaymentApi';

const { px2dp } = ScreenUtils;
const {
    slice_point,
    coupon_bg,
    pay_success_icon,
    share_to_friend_circle,
    share_to_wx
} = res;

const RenderSeparator = ({ title }) => <View
    style={{ height: 20, width: ScreenUtils.width, flexDirection: 'row', marginTop: px2dp(20) }}>
    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ height: px2dp(1), backgroundColor: '#FFE1C8', width: px2dp(28) }}/>
        <Image source={slice_point} style={{ width: px2dp(10), height: px2dp(9) }}/>
    </View>
    <View style={{ alignItems: 'center', justifyContent: 'center', width: px2dp(225) }}>
        <MRText style={{ fontSize: px2dp(13), color: DesignRule.textColor_mainTitle }}>
            {title}
        </MRText>
    </View>
    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
        <Image source={slice_point} style={{ width: px2dp(10), height: px2dp(9) }}/>
        <View style={{ height: px2dp(1), backgroundColor: '#FFE1C8', width: px2dp(28) }}/>
    </View>
</View>;


export default class PaymentFinshPage extends BasePage {
    $navigationBarOptions = {
        title: '订单完成'
    };

    constructor(props) {
        super(props);
        this.state = {
            showShareView: false,
            couponIdList: [],
            shareCode:''
        };
        //orderPayResultPageType 有券无劵
        TrackApi.ViewOrderPayPage({ orderPayType: 2, orderPayResultPageType: 2 });
        //暂加入，测试
        bridge.$checkIsCanComment();
    }

    componentDidMount() {
        PaymentApi.getUserCouponAmount(
            {
                couponIdList:81
            }
        ).then(result=>{
            console.log(result);
            this.setState({
                couponIdList:result.data || [],
            })
            // this.setState({
            //     couponIdList: [
            //         {
            //             "id": 976323,
            //             "name": "H5新注册兑换券",
            //             "code": "1559117839071000001",
            //             "remarks": null,
            //             "type": 5,
            //             "value": 0,
            //             "useConditions": 0,
            //             "startTime": 1559117839000,
            //             "expireTime": 1559377039000,
            //             "status": 0,
            //             "count": 1,
            //             "url": "/cycle-coupon"
            //         }
            //     ]
            // })
        });
        PaymentApi.judgeShare().then(result=>{
            console.log(result);

            let isShare = result.data && result.data.isShare;
            let  shareCode = result.data && result.data.shareCode;
            this.setState({
                showShareView:isShare,
                shareCode:shareCode,
            })
        }).catch(error=>{
            this.setState({
                showShareView:false
            })
        })
        // setTimeout(() => {
        //     this.setState({
        //         showShareView: true
        //     });
        // }, 2000);
    }

    _render() {
        return (
            <ScrollView style={Styles.contentStyle}>
                {this.renderTopSuccessView()}
                {/*<RenderSeparator title={'你还有兑换券即将过期，快来使用吧'}/>*/}
                {this.renderCouponList()}
                {this.state.showShareView ? this._renderShareView() : null}
            </ScrollView>
        );
    }

    renderCouponList = () => {
        const { couponIdList } = this.state;
        let couponItemViewList = [];
        if (Array.isArray(couponIdList) && couponIdList.length > 0) {

            couponItemViewList = couponIdList.map((couponItem) => {
                return this._renderCouponItem(couponItem);
            });
            couponItemViewList.unshift(<RenderSeparator title={'你还有兑换券即将过期，快来使用吧'}/>);
            return couponItemViewList;
        }
    };
    /**
     * 渲染头部成功标识
     * @returns {*}
     */
    renderTopSuccessView = () => {
        return (
            <View style={Styles.topSuccessBgStyle}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: px2dp(180) }}>
                    <Image source={pay_success_icon} style={{ height: px2dp(72), width: px2dp(72) }}/>
                    <MRText style={{
                        fontSize: px2dp(23),
                        color: DesignRule.textColor_mainTitle,
                        marginTop: px2dp(22)
                    }}>支付成功</MRText>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: px2dp(100), height: px2dp(34) }} onPress={() => {

                            this._gotoHome();
                        }}>
                            <View style={{
                                borderWidth: px2dp(0.5),
                                color: DesignRule.textColor_instruction,
                                borderColor: DesignRule.textColor_instruction,
                                borderRadius: px2dp(17),
                                height: px2dp(34),
                                width: px2dp(100),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <MRText style={{ color: DesignRule.textColor_instruction, fontSize: px2dp(15) }}>
                                    返回首页
                                </MRText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: px2dp(100), height: px2dp(34) }} onPress={() => {
                            this._toOrder();
                        }}>
                            <View style={{
                                borderWidth: px2dp(0.5),
                                color: DesignRule.mainColor,
                                borderRadius: px2dp(17),
                                borderColor: DesignRule.mainColor,
                                height: px2dp(34),
                                width: px2dp(100),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <MRText style={{ color: DesignRule.mainColor, fontSize: px2dp(15) }}>
                                    查看订单
                                </MRText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    /**
     * 去首页
     * @private
     */
    _gotoHome = () => {
        TrackApi.OrderPayResultBtnClick({
            orderPayResultPageType: 0,
            orderPayType: 2,
            orderPayResultBtnType: 1
        });
        // this.$navigateBackToHome();
        this.$navigateReset();
    };
    /**
     * 去订单页面事件
     */
    _toOrder = () => {
        TrackApi.OrderPayResultBtnClick({
            orderPayResultPageType: 0,
            orderPayType: 2,
            orderPayResultBtnType: 2
        });
        let replace = NavigationActions.replace({
            key: this.props.navigation.state.key,
            type: 'ReplacePayScreen',
            routeName: 'order/order/MyOrdersListPage',
            params: { index: 2 }
        });
        this.props.navigation.dispatch(replace);
    };

    /**
     * 渲染优惠券Items
     * @param itemData
     * @returns {*}
     * @private
     */
    _renderCouponItem = (itemData) => {
        return (
            <View style={{ height: px2dp(95), justifyContent: 'center', alignItems: 'center', marginTop: px2dp(10) }}>
                <View style={Styles.couponItemBgStyle}>
                    <View style={{ width: px2dp(70), alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={coupon_bg} style={{ width: px2dp(65), height: px2dp(65) }}/>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <MRText style={{ color: '#AD4604', fontSize: px2dp(16) }}>
                            商品兑换券
                        </MRText>
                        <MRText style={{ color: '#B4B4B4', fontSize: px2dp(12), marginTop: px2dp(3) }}>
                            有效期：{this.format(itemData.expireTime) }
                        </MRText>
                    </View>
                    <View style={{ width: px2dp(90), alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            this._couponItemClick(itemData);
                        }}>
                            <LinearGradient colors={['#FC5D39', '#FF0050']}
                                            style={{
                                                height: px2dp(26),
                                                width: px2dp(75),
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: px2dp(13)
                                            }}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}>
                                <MRText style={{ color: DesignRule.color_fff, fontSize: px2dp(13) }}>
                                    立即使用
                                </MRText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    /**
     * 优惠券Item点击
     * @param couponItem
     */
    _couponItemClick = (couponItem) => {
        TrackApi.OrderPayResultBtnClick({
            orderPayResultPageType: 0,
            orderPayType: 2,
            orderPayResultBtnType: 5
        });

        this.$navigate('HtmlPage',{
            uri:couponItem.url
        });
    };
    /**
     * 分享相关View
     * @returns {*}
     * @private
     */
    _renderShareView = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <RenderSeparator title={'分享给好友，即可获得三张券'}/>
                <MRText style={{ color: '#AD4604', SizeSize: px2dp(14), marginTop: px2dp(10) }}>立即分享至</MRText>
                <TouchableOpacity onPress={() => {
                    this._shareToWX();
                }}>
                    <LinearGradient colors={['#FF2100', '#FF6947', '#FF2100']}
                                    style={{
                                        height: px2dp(40),
                                        width: ScreenUtils.width - px2dp(90),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: px2dp(20),
                                        flexDirection: 'row',
                                        marginTop: px2dp(10)
                                    }}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}>
                        <Image source={share_to_wx} style={{ height: px2dp(20), width: px2dp(24) }}/>
                        <MRText style={{ color: DesignRule.color_fff, fontSize: px2dp(14), marginLeft: px2dp(10) }}>
                            分享微信好友
                        </MRText>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    this._shareToFriendCircle();
                }}>
                    <View style={{
                        height: px2dp(40),
                        width: ScreenUtils.width - px2dp(90),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: px2dp(20),
                        flexDirection: 'row',
                        marginTop: px2dp(10)
                    }}>
                        <Image source={share_to_friend_circle} style={{ height: px2dp(20), width: px2dp(24) }}/>
                        <MRText style={{ color: '#AD4604', fontSize: px2dp(14), marginLeft: px2dp(10) }}>
                            分享到朋友圈
                        </MRText>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    /**
     * 分享到微信
     * @private
     */
    _shareToWX = () => {
        TrackApi.OrderPayResultBtnClick({
            orderPayResultPageType: 0,
            orderPayType: 2,
            orderPayResultBtnType: 3
        });

        ShareUtil.onShare({
            shareType: 1,
            platformType: 0,
            title: '【秀购】发现一个很给力的活动,快去看看~',
            dec: '',
            thumImage: user.headImg,
            linkUrl: `${apiEnvironment.getCurrentH5Url()}/activity/drawShare/${this.state.shareCode}`
        });
    };
    /**
     * 分享到朋友圈
     * @private
     */
    _shareToFriendCircle = () => {
        TrackApi.OrderPayResultBtnClick({
            orderPayResultPageType: 0,
            orderPayType: 2,
            orderPayResultBtnType: 4
        });

        ShareUtil.onShare({
            hdImageURL:user.headImg,
            imageUrl:user.headImg,
            shareType: 1,
            platformType: 1,
            thumImage:user.headImg,
            title: '【秀购】发现一个很给力的活动,快去看看~',
            dec: '',
            linkUrl: `${apiEnvironment.getCurrentH5Url()}/activity/drawShare/${this.state.shareCode}`
        });
    };

    format = (timeStamp) => {
        let newShijianchuo = timeStamp + '';
        while (newShijianchuo.length < 13) {
            newShijianchuo = newShijianchuo + '0';
        }
        let time = new Date(parseInt(newShijianchuo));
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        // let h = time.getHours();
        // let mm = time.getMinutes();
        return y+'.'+m+'.'+d;
    };
}

const Styles = StyleSheet.create({
    contentStyle: {
        flex: 1,
        backgroundColor: DesignRule.bgcolor
    },
    topSuccessBgStyle: {
        height: px2dp(270),
        backgroundColor: DesignRule.color_fff
    },
    couponItemBgStyle: {
        elevation: 20,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: DesignRule.textColor_secondTitle,
        height: px2dp(80),
        width: ScreenUtils.width - px2dp(60),
        backgroundColor: DesignRule.color_fff,
        borderRadius: px2dp(3),
        flexDirection: 'row'
    }
});
