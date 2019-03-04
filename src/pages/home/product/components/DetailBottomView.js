import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';

const xiangqing_btn_gouwuche_nor = res.product.xiangqing_btn_gouwuche_nor;
const jiarugouwuche_no = res.product.jiarugouwuche_no;

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
                        style={{ width: ScreenUtils.autoSizeWidth(85), justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.bottomViewAction('gwc')} disabled={cantJoin}>
                        <Image style={{ marginBottom: 6 }}
                               source={cantJoin ? jiarugouwuche_no : xiangqing_btn_gouwuche_nor}/>
                        <Text style={{ fontSize: 11, color: DesignRule.textColor_mainTitle }}
                              allowFontScaling={false}>加入购物车</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: cantBuy ? DesignRule.textColor_placeholder : DesignRule.mainColor
                        }}
                        onPress={() => this.props.bottomViewAction('buy')} disabled={cantBuy}>
                        <Text style={{
                            color: cantBuy ? DesignRule.textColor_instruction : DesignRule.white,
                            fontSize: 17
                        }}>{buyText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: '#FBBB50',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => this.props.bottomViewAction('jlj')}>
                        <Text style={{ fontSize: 17, color: DesignRule.white }}>分享秀一秀</Text>
                    </TouchableOpacity>
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 48, flexDirection: 'row', backgroundColor: 'white', borderWidth: 1,
        borderColor: DesignRule.lineColor_inGrayBg
    }
});

