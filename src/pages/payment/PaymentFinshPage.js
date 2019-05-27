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
import LinearGradient from 'react-native-linear-gradient'

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
    }

    _render() {
        return (
            <ScrollView style={Styles.contentStyle}>
                {this.renderTopSuccessView()}
                <RenderSeparator title={'你还有兑换券即将过期，快来使用吧'}/>
                {this._renderCouponItem()}
                {this._renderCouponItem()}
                {this._renderShareView()}
            </ScrollView>
        );
    }

    /**
     * 渲染头部成功标识
     * @returns {*}
     */
    renderTopSuccessView = () => {
        return (
            <View style={Styles.topSuccessBgStyle}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: px2dp(190) }}>
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
                            this.$navigateBackToHome();
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
     * 渲染优惠券Items
     * @param itemData
     * @returns {*}
     * @private
     */
    _renderCouponItem = (itemData) => {
        return (
            <View style={{ height: px2dp(95), justifyContent: 'center', alignItems: 'center' ,marginTop:px2dp(10)}}>
                <View style={Styles.couponItemBgStyle}>
                    <View style={{width:px2dp(70),alignItems:'center',justifyContent:'center'}}>
                        <Image source={coupon_bg} style={{width:px2dp(65),height:px2dp(65)}}/>
                    </View>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <MRText style={{color:'#AD4604',fontSize:px2dp(16)}}>
                            商品兑换券
                        </MRText>
                        <MRText style={{color:'#B4B4B4',fontSize:px2dp(12),marginTop:px2dp(3)}}>
                            有效期：2019.05.12
                        </MRText>
                    </View>
                    <View style={{width:px2dp(90),alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity>
                            <LinearGradient colors={["#FC5D39", "#FF0050"]}
                                            style={{height:px2dp(26),width:px2dp(75),alignItems:'center',justifyContent:'center',borderRadius:px2dp(13)}}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}>
                                <MRText style={{color:DesignRule.color_fff,fontSize:px2dp(13)}}>
                                    立即使用
                                </MRText>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    _renderShareView=()=>{
        return(
            <View style={{alignItems:'center',justifyContent:'center'}}>
                <RenderSeparator title={'分享给好友，即可获得三张券'}/>
                <MRText style={{color:'#AD4604',SizeSize:px2dp(14),marginTop:px2dp(10)}}>立即分享至</MRText>
                <TouchableOpacity>
                    <LinearGradient colors={["#FF2100", "#FF6947","#FF2100"]}
                                    style={{height:px2dp(40),width:ScreenUtils.width - px2dp(90),alignItems:'center',justifyContent:'center',borderRadius:px2dp(20),flexDirection:'row',marginTop:px2dp(10)}}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}>
                        <Image source={share_to_wx} style={{height:px2dp(20),width:px2dp(24)}}/>
                        <MRText style={{color:DesignRule.color_fff,fontSize:px2dp(14),marginLeft:px2dp(10)}}>
                            分享微信好友
                        </MRText>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity>
                    <View style={{height:px2dp(40),width:ScreenUtils.width - px2dp(90),alignItems:'center',justifyContent:'center',borderRadius:px2dp(20),flexDirection:'row',marginTop:px2dp(10)}}>
                        <Image source={share_to_friend_circle} style={{height:px2dp(20),width:px2dp(24)}}/>
                        <MRText style={{color:'#AD4604',fontSize:px2dp(14),marginLeft:px2dp(10)}}>
                            分享到朋友圈
                        </MRText>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    _toOrder = () => {

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
        borderRadius:px2dp(3),
        flexDirection:'row'
    },
});
