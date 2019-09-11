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
import { activity_status, activity_type, product_status } from '../ProductDetailModel';
import LinearGradient from 'react-native-linear-gradient';
import StringUtils from '../../../utils/StringUtils';
import { formatDate } from '../../../utils/DateUtils';
import { routePush } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';
import apiEnvironment from '../../../api/ApiEnvironment';
import { observer } from 'mobx-react';

const { xiangqing_btn_gouwuche_nor, jiarugouwuche_no, me_bangzu_kefu_icon } = res;
const { px2dp } = ScreenUtils;
const { isNoEmpty } = StringUtils;

@observer
export default class DetailBottomView extends Component {

    static propTypes = {
        bottomViewAction: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { orderOnProduct, activityType, activityStatus } = this.props.pData || {};
        return (
            <View style={{ backgroundColor: 'white' }}>
                {
                    orderOnProduct === 0 &&
                    <View style={styles.toastView}>
                        <Text style={styles.toastText}>该商品不支持单独购买</Text>
                    </View>
                }
                {
                    activityType === activity_type.pinGroup && activityStatus === activity_status.unBegin &&
                    <View style={styles.toastView1}>
                        <Text style={styles.toastText1}>活动即将开始</Text>
                    </View>
                }
                <View style={styles.container}>
                    {this._renderKeFu()}
                    {this._renderIsOut()}
                </View>
            </View>
        );
    }

    _renderKeFu = () => {
        return (
            <TouchableOpacity style={styles.leftBtn}
                              onPress={() => this.props.bottomViewAction('keFu')}>
                <Image style={styles.leftImage} source={me_bangzu_kefu_icon}/>
                <Text style={styles.leftText}>客服</Text>
            </TouchableOpacity>
        );
    };

    _renderIsOut = () => {
        const { showSellOut, productStatus, skuList, productIsPromotionPrice } = this.props.pData || {};
        //显示已下架
        const isDown = productStatus === product_status.down;
        //总库存
        let stock = 0;
        (skuList || []).forEach((item) => {
            stock = stock + (productIsPromotionPrice ? item.promotionStockNum : item.sellStock);
        });
        if (showSellOut || isDown || stock === 0) {
            return (
                <View style={styles.outView}>
                    <Text style={styles.outText}>{showSellOut ? '已抢光' : (isDown ? '已下架' : '已售罄')}</Text>
                </View>
            );
        } else {
            return this._renderAllBtn();
        }
    };

    _renderAllBtn = () => {
        const { isGroupIn } = this.props.pData || {};
        return (
            <View style={styles.btnContainer}>
                {this._renderShop()}
                <View style={[styles.btnView, { width: !isGroupIn ? px2dp(260) : px2dp(292) }]}>
                    {this._renderBuy()}
                    {this._renderShow()}
                </View>
            </View>
        );
    };

    _renderShop = () => {
        const { orderOnProduct, isGroupIn, isHuaFei } = this.props.pData || {};
        //老礼包不显示购物车
        if (isGroupIn) {
            return null;
        }
        //不能加购
        const cantJoin = orderOnProduct === 0 || isHuaFei;
        return (
            <TouchableOpacity style={styles.leftBtn}
                              onPress={() => this.props.bottomViewAction('gwc')}
                              disabled={cantJoin}>
                <Image style={styles.leftImage}
                       source={cantJoin ? jiarugouwuche_no : xiangqing_btn_gouwuche_nor}/>
                <Text
                    style={[styles.leftText, { color: cantJoin ? '#E4E4E4' : DesignRule.textColor_secondTitle }]}>加购</Text>
            </TouchableOpacity>
        );
    };

    _renderBuy = () => {
        const {
            productStatus, selfReturning, orderOnProduct, isGroupIn,
            groupSubProductCanSell, upTime, isPinGroupIn, minPrice, isSingleSpec
        } = this.props.pData || {};
        //不能购买(不是上架状态||不能单独购买||(isGroupIn&&子商品不够买))
        const cantBuy = productStatus !== product_status.on || orderOnProduct === 0 || (isGroupIn && !groupSubProductCanSell);
        return (
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
                            }]}>{isPinGroupIn ? `￥${minPrice}${!isSingleSpec ? '起' : ''}单买` : '立即购买'}</Text>
                            {(isNoEmpty(selfReturning) && selfReturning > 0) && < Text style={{
                                fontSize: 11, color: 'white', marginTop: -2
                            }}>返{selfReturning}</Text>}
                        </LinearGradient>
                }
            </TouchableOpacity>
        );
    };

    _renderShow = () => {
        const {
            isPinGroupIn, promotionMinPrice, productGroupModel, isSingleSpec
        } = this.props.pData || {};
        const { hasOpenGroup, groupId } = productGroupModel;
        return (
            <TouchableOpacity style={[styles.btn]}
                              onPress={() => {
                                  if (isPinGroupIn && hasOpenGroup) {
                                      routePush(RouterMap.HtmlPage, {
                                          uri: `${apiEnvironment.getCurrentH5Url()}/activity/groupBuyDetails/${groupId}`
                                      });
                                      return;
                                  }
                                  this.props.bottomViewAction(isPinGroupIn ? 'pinGroup' : 'jlj');
                              }}>
                <LinearGradient style={styles.LinearGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FC5D39', '#FF0050']}>
                    <Text
                        style={styles.btnText}>{isPinGroupIn ? (!hasOpenGroup ? `￥${promotionMinPrice}${!isSingleSpec ? '起' : ''}开团` : '查看我的团') : '分享秀一秀'}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

}

const styles = StyleSheet.create({
    toastView: {
        justifyContent: 'center', alignItems: 'center',
        height: 22, backgroundColor: '#FFE5ED'
    },
    toastText: {
        color: DesignRule.textColor_redWarn, fontSize: 12
    },

    toastView1: {
        justifyContent: 'center', alignItems: 'center',
        height: 30, backgroundColor: '#FEF2DD'
    },
    toastText1: {
        color: '#FF9502', fontSize: 13
    },

    container: {
        height: 49, flexDirection: 'row', alignItems: 'center', marginBottom: ScreenUtils.safeBottom,
        backgroundColor: 'white'
    },
    /*客服*/
    leftBtn: {
        justifyContent: 'center', alignItems: 'center', width: px2dp(54)
    },
    leftImage: {
        marginBottom: 1, width: 24, height: 24
    },
    leftText: {
        fontSize: 11, color: DesignRule.textColor_secondTitle
    },
    /*抢光*/
    outView: {
        flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 15,
        borderRadius: 20, height: 40, backgroundColor: DesignRule.bgColor_grayHeader
    },
    outText: {
        fontSize: 17, color: DesignRule.white
    },

    /*按钮*/
    btnContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
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

