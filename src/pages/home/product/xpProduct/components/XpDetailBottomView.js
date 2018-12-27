import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MRText as Text } from '../../../../../components/ui';
import DesignRule from '../../../../../constants/DesignRule';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import LinearGradient from 'react-native-linear-gradient';
import res from '../../../res';

const gwc = res.product.detailNavView.detail_car_down;
const { px2dp } = ScreenUtils;

export default class XpDetailBottomView extends Component {
    render() {
        const { bottomViewAction } = this.props;
        return (
            <View style={styles.containerView}>
                <View style={styles.bgView}>
                    <TouchableOpacity style={styles.gwcBtn} onPress={() => bottomViewAction('goGwc')}>
                        <Image source={gwc}/>
                        <Text style={styles.gwcText}>购物车</Text>
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
                        <TouchableOpacity style={styles.btn} onPress={() => bottomViewAction('buy')}>
                            <LinearGradient style={styles.LinearGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['#FF0088', '#FF0050']}>
                                <Text style={styles.btnText}>立即购买</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
    }
});
