import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MRText as Text } from '../../../../../components/ui';
import DesignRule from '../../../../../constants/DesignRule';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import res from '../../../res';
import ShopCartStore from '../../../../shopCart/model/ShopCartStore';
import { observer } from 'mobx-react';

const gwc = res.product.detailNavView.detail_car_down;
const { px2dp } = ScreenUtils;

@observer
export default class XpDetailBottomView extends Component {
    render() {
        const { bottomViewAction, xpDetailModel } = this.props;
        const shopNumber = ShopCartStore.getAllGoodsClassNumber > 99 ? 99 : ShopCartStore.getAllGoodsClassNumber;
        const { pCantBuy, pBuyText, skuTotal } = xpDetailModel;
        return (
            <View>
                {skuTotal === 0 ? <View style={styles.messageContainer}>
                    <Text style={styles.noCount}>暂无库存</Text>
                </View> : null}
                <View style={styles.containerView}>
                    <View style={styles.bgView}>
                        <TouchableOpacity style={styles.gwcBtn} onPress={() => bottomViewAction('goGwc')}>
                            <Image source={gwc}/>
                            <Text style={styles.gwcText}>购物车</Text>
                            {shopNumber === 0 ? null :
                                <View style={styles.numbView}>
                                    <Text style={styles.numbText}>{shopNumber}</Text>
                                </View>}
                        </TouchableOpacity>
                        <View style={styles.btnView}>
                            <TouchableOpacity style={styles.btn} onPress={() => bottomViewAction('joinCart')}>
                                <LinearGradient style={styles.LinearGradient}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                colors={['#FBBB50', '#FBBB50']}>
                                    <Text style={styles.btnText}>加入购物车</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={() => bottomViewAction('buy')}
                                              disabled={pCantBuy}>
                                <LinearGradient style={styles.LinearGradient}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                colors={pCantBuy ? ['#cccccc', '#cccccc'] : ['#FF0088', '#FF0050']}>
                                    <Text style={styles.btnText}>{pBuyText}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    messageContainer: {
        justifyContent: 'center', alignItems: 'center',
        height: 20, backgroundColor: 'rgba(0,0,0,0.2)'
    },
    noCount: {
        fontSize: 12, color: DesignRule.white
    },

    containerView: {
        height: ScreenUtils.safeBottom + 49,
        backgroundColor: DesignRule.white
    },
    bgView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        height: 49
    },
    gwcBtn: {
        alignItems: 'center', justifyContent: 'center',
        width: 64
    },
    gwcText: {
        marginTop: 2,
        fontSize: 11, color: DesignRule.textColor_mainTitle
    },
    btnView: {
        flexDirection: 'row', overflow: 'hidden',
        marginRight: 15, height: 40, width: px2dp(212), borderRadius: 20
    },
    btn: {
        flex: 1
    },
    LinearGradient: {
        flex: 1,
        justifyContent: 'center', alignItems: 'center'
    },
    btnText: {
        fontSize: 13, color: DesignRule.white
    },

    numbView: {
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', top: 0, right: 16,
        height: 12, width: 12, borderRadius: 6,
        backgroundColor: DesignRule.mainColor
    },
    numbText: {
        color: 'white',
        fontSize: 8
    }
});
