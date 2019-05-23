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

const { xiangqing_btn_gouwuche_nor, jiarugouwuche_no, me_bangzu_kefu_icon } = res;
const { px2dp } = ScreenUtils;

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
        //productStatus  1正常  2下架  3当前时间不能买
        let { productStatus, skuList, showSellOut, productIsPromotionPrice } = pData || {};
        //总库存
        let stock = 0;
        (skuList || []).forEach((item) => {
            stock = stock + productIsPromotionPrice ? item.promotionStockNum : item.sellStock;
        });
        //提示消息样式
        let isDown = productStatus === product_status.down;
        let showNoticeText = '商品已经下架啦~';

        //不能加入购物车
        let cantJoin = productStatus === product_status.down;

        //不能立即购买  不正常||库存0
        let cantBuy = productStatus !== product_status.on || stock === 0;
        //立即购买文案
        let buyText = productStatus === product_status.future ? '暂不可购买' : '立即购买';

        return (
            <View style={{ height: 49 + ScreenUtils.safeBottom + (isDown ? 20 : 0), backgroundColor: 'white' }}>
                {
                    isDown &&
                    <View style={styles.toastView}>
                        <Text style={styles.toastText}>{showNoticeText}</Text>
                    </View>
                }
                <View style={styles.container}>
                    <TouchableOpacity style={styles.leftBtn}
                                      onPress={() => this.props.bottomViewAction('keFu')}>
                        <Image style={styles.leftImage} source={me_bangzu_kefu_icon}/>
                        <Text style={styles.leftText}>客服</Text>
                    </TouchableOpacity>
                    {
                        (showSellOut || stock === 0) ?
                            <View style={styles.outView}>
                                <Text style={styles.outText}>{showSellOut ? '已抢光' : '已售罄'}</Text>
                            </View>
                            :
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.leftBtn}
                                                  onPress={() => this.props.bottomViewAction('gwc')}
                                                  disabled={cantJoin}>
                                    <Image style={styles.leftImage}
                                           source={cantJoin ? jiarugouwuche_no : xiangqing_btn_gouwuche_nor}/>
                                    <Text style={styles.leftText}>加购</Text>
                                </TouchableOpacity>
                                <View style={styles.btnView}>
                                    <TouchableOpacity
                                        style={[styles.btn, { backgroundColor: cantBuy ? DesignRule.textColor_placeholder : DesignRule.mainColor }]}
                                        onPress={() => this.props.bottomViewAction('buy')} disabled={cantBuy}>
                                        <LinearGradient style={styles.LinearGradient}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        colors={['#FFCB02', '#FF9502']}>
                                            <Text style={[styles.btnText, {
                                                color: cantBuy ? DesignRule.textColor_instruction : DesignRule.white
                                            }]}>{buyText}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btn, { backgroundColor: '#FBBB50' }]}
                                                      onPress={() => this.props.bottomViewAction('jlj')}>
                                        <LinearGradient style={styles.LinearGradient}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        colors={['#FC5D39', '#FF0050']}>
                                            <Text style={styles.btnText}>分享秀一秀</Text>
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
        height: 20, backgroundColor: 'rgba(0,0,0,0.5)'
    },
    toastText: {
        color: DesignRule.white, fontSize: 13
    },

    container: {
        height: 49, flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'white'
    },
    leftBtn: {
        justifyContent: 'center', alignItems: 'center', width: px2dp(54)
    },
    leftImage: {
        marginBottom: 1
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
        marginRight: 15, height: 40, width: px2dp(260), borderRadius: 20
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

