import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res/product';
import { MRText as Text } from '../../../components/ui/index';
import { product_status } from '../ProductDetailModel';
import LinearGradient from 'react-native-linear-gradient';
import StringUtils from '../../../utils/StringUtils';
import { formatDate } from '../../../utils/DateUtils';

const { xiangqing_btn_gouwuche_nor, jiarugouwuche_no, me_bangzu_kefu_icon } = res;
const { px2dp } = ScreenUtils;
const { isNoEmpty } = StringUtils;

export default class DetailBottomView extends Component {

    static propTypes = {
        bottomViewAction: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { pData } = this.props;
        let {
            productStatus, skuList, showSellOut, productIsPromotionPrice, selfReturning,
            orderOnProduct, isGroupIn, groupSubProductCanSell, upTime, isHuaFei, isPinGroupIn,
            minPrice, promotionMinPrice
        } = pData || {};
        //总库存
        let stock = 0;
        (skuList || []).forEach((item) => {
            stock = stock + (productIsPromotionPrice ? item.promotionStockNum : item.sellStock);
        });
        //显示已下架
        const isDown = productStatus === product_status.down;
        //不能购买(不是上架状态||不能单独购买||(isGroupIn&&不能买))
        const cantBuy = productStatus !== product_status.on || orderOnProduct === 0 || (isGroupIn && !groupSubProductCanSell);
        //不能加购(不能单独购买)
        const cantJoin = orderOnProduct === 0 || isHuaFei;
        return (
            <View style={{ backgroundColor: 'white' }}>
                {
                    orderOnProduct === 0 &&
                    <View style={styles.toastView}>
                        <Text style={styles.toastText}>该商品不支持单独购买</Text>
                    </View>
                }
                <View style={styles.container}>
                    <TouchableOpacity style={styles.leftBtn}
                                      onPress={() => this.props.bottomViewAction('keFu')}>
                        <Image style={styles.leftImage} source={me_bangzu_kefu_icon}/>
                        <Text style={styles.leftText}>客服</Text>
                    </TouchableOpacity>
                    {
                        (showSellOut || isDown || stock === 0) ?
                            <View style={styles.outView}>
                                <Text style={styles.outText}>{showSellOut ? '已抢光' : (isDown ? '已下架' : '已售罄')}</Text>
                            </View>
                            :
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {!isGroupIn && <TouchableOpacity style={styles.leftBtn}
                                                                 onPress={() => this.props.bottomViewAction('gwc')}
                                                                 disabled={cantJoin}>
                                    <Image style={styles.leftImage}
                                           source={cantJoin ? jiarugouwuche_no : xiangqing_btn_gouwuche_nor}/>
                                    <Text
                                        style={[styles.leftText, { color: cantJoin ? '#E4E4E4' : DesignRule.textColor_secondTitle }]}>加购</Text>
                                </TouchableOpacity>}
                                <View style={[styles.btnView, { width: !isGroupIn ? px2dp(260) : px2dp(292) }]}>
                                    <TouchableOpacity
                                        style={[styles.btn, { backgroundColor: cantBuy ? DesignRule.textColor_placeholder : DesignRule.mainColor }]}
                                        onPress={() => this.props.bottomViewAction('buy')} disabled={cantBuy}>
                                        {
                                            productStatus === product_status.future ?
                                                <LinearGradient style={styles.LinearGradient}
                                                                start={{ x: 0, y: 0 }}
                                                                end={{ x: 1, y: 0 }}
                                                                colors={['#FFE5ED', '#FFE5ED']}>
                                                    <Text style={[styles.btnText, {
                                                        color: DesignRule.mainColor,
                                                        fontSize: 14
                                                    }]}>{upTime ? formatDate(upTime, 'MM月dd日HH:mm') : ''}</Text>
                                                    < Text style={{
                                                        fontSize: 10,
                                                        color: DesignRule.mainColor,
                                                        marginTop: -2
                                                    }}>开始售卖</Text>
                                                </LinearGradient>
                                                :
                                                <LinearGradient style={styles.LinearGradient}
                                                                start={{ x: 0, y: 0 }}
                                                                end={{ x: 1, y: 0 }}
                                                                colors={cantBuy ? ['#CCCCCC', '#CCCCCC'] : ['#FFCB02', '#FF9502']}>
                                                    <Text style={[styles.btnText, {
                                                        color: DesignRule.white,
                                                        fontSize: (isNoEmpty(selfReturning) && selfReturning > 0) ? 14 : 17
                                                    }]}>{isPinGroupIn ? `￥${minPrice}起开团` : '立即购买'}</Text>
                                                    {(isNoEmpty(selfReturning) && selfReturning > 0) && < Text style={{
                                                        fontSize: 11, color: 'white', marginTop: -2
                                                    }}>返{selfReturning}</Text>}
                                                </LinearGradient>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btn]}
                                                      onPress={() => this.props.bottomViewAction(isPinGroupIn ? 'pinGroup' : 'jlj')}>
                                        <LinearGradient style={styles.LinearGradient}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        colors={['#FC5D39', '#FF0050']}>
                                            <Text
                                                style={styles.btnText}>{isPinGroupIn ? `￥${promotionMinPrice}起开团` : '分享秀一秀'}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({
    toastView: {
        justifyContent: 'center', alignItems: 'center',
        height: 22, backgroundColor: '#FFE5ED'
    },
    toastText: {
        color: DesignRule.textColor_redWarn, fontSize: 12
    },

    container: {
        height: 49, flexDirection: 'row', alignItems: 'center', marginBottom: ScreenUtils.safeBottom,
        backgroundColor: 'white'
    },
    leftBtn: {
        justifyContent: 'center', alignItems: 'center', width: px2dp(54)
    },
    leftImage: {
        marginBottom: 1, width: 24, height: 24
    },
    leftText: {
        fontSize: 11, color: DesignRule.textColor_secondTitle
    },

    outView: {
        flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 15,
        borderRadius: 20, height: 40, backgroundColor: DesignRule.bgColor_grayHeader
    },
    outText: {
        fontSize: 17, color: DesignRule.white
    },

    btnView: {
        flexDirection: 'row', overflow: 'hidden',
        marginRight: 15, height: 40, borderRadius: 20
    },
    btn: {
        flex: 1
    },
    LinearGradient: {
        flex: 1,
        justifyContent: 'center', alignItems: 'center'
    },
    btnText: {
        fontSize: 17, color: DesignRule.white
    }

});

