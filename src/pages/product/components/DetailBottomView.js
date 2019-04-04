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
        let { productStatus, skuList } = pData || {};
        //总库存
        let stock = 0;
        (skuList || []).forEach((item) => {
            stock = stock + item.sellStock;
        });
        //提示消息样式
        let isDown = productStatus === 2 || stock === 0;
        let showNoticeText = productStatus === 2 ? '商品已经下架啦~' : (stock === 0 ? '商品已售罄' : '');

        //不能加入购物车
        let cantJoin = productStatus === 2;

        //不能立即购买  不正常||库存0
        let cantBuy = productStatus !== 1 || stock === 0;
        //立即购买文案
        let buyText = productStatus === 3 ? '暂不可购买' : '立即购买';
        return (
            <View style={{ height: 48 + ScreenUtils.safeBottom + (isDown ? 20 : 0), backgroundColor: 'white' }}>
                {isDown ? <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 20,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <Text style={{ color: DesignRule.white, fontSize: 13 }}>{showNoticeText}</Text>
                </View> : null}
                <View style={styles.container}>
                    <TouchableOpacity
                        style={[styles.leftBtn, { width: px2dp(60) }]}
                        onPress={() => this.props.bottomViewAction('keFu')}>
                        <Image style={styles.leftImage} source={me_bangzu_kefu_icon}/>
                        <Text style={styles.leftText}>客服</Text>
                    </TouchableOpacity>
                    <View style={{ width: 0.5, backgroundColor: DesignRule.lineColor_inWhiteBg }}/>
                    <TouchableOpacity
                        style={styles.leftBtn}
                        onPress={() => this.props.bottomViewAction('gwc')} disabled={cantJoin}>
                        <Image style={styles.leftImage}
                               source={cantJoin ? jiarugouwuche_no : xiangqing_btn_gouwuche_nor}/>
                        <Text style={styles.leftText}>加入购物车</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.rightBtn, { backgroundColor: cantBuy ? DesignRule.textColor_placeholder : DesignRule.mainColor }]}
                        onPress={() => this.props.bottomViewAction('buy')} disabled={cantBuy}>
                        <Text style={{
                            color: cantBuy ? DesignRule.textColor_instruction : DesignRule.white,
                            fontSize: 15
                        }}>{buyText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.rightBtn, { backgroundColor: '#FBBB50' }]}
                        onPress={() => this.props.bottomViewAction('jlj')}>
                        <Text style={{ fontSize: 15, color: DesignRule.white }}>分享秀一秀</Text>
                    </TouchableOpacity>
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 48, flexDirection: 'row', backgroundColor: 'white', borderWidth: 1,
        borderColor: DesignRule.lineColor_inGrayBg
    },
    leftBtn: {
        justifyContent: 'center', alignItems: 'center',
        width: px2dp(70)
    },
    leftImage: {
        marginBottom: 1
    },
    leftText: {
        fontSize: 11, color: DesignRule.textColor_secondTitle
    },
    rightBtn: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    }
});

