import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import res from '../../res';

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
        let { shareMoney, productStatus, buyLimit, leftBuyNum } = this.props;
        //限购
        let isLimit = buyLimit !== -1 && leftBuyNum === 0;
        //status2：产品下架    1正常  2下架  3当前时间不能买
        let disable = productStatus === 2;//是否下架  样式

        //btn不能点 变灰
        let cantBuy = productStatus !== 1 || isLimit;
        return (
            <View style={{ height: 49 + ScreenUtils.safeBottom + (disable ? 20 : 0), backgroundColor: 'white' }}>
                {disable ? <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 20,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <Text style={{ color: DesignRule.white, fontSize: 13 }}>商品已经下架啦~</Text>
                </View> : null}
                <View style={styles.container}>
                    <TouchableOpacity
                        style={{ width: ScreenUtils.autoSizeWidth(85), justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.bottomViewAction('gwc')} disabled={cantBuy}>
                        <Image style={{ marginBottom: 6 }}
                               source={cantBuy ? jiarugouwuche_no : xiangqing_btn_gouwuche_nor}/>
                        <Text style={{ fontSize: 11, color: DesignRule.textColor_mainTitle }}>加入购物车</Text>
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
                            color: isLimit ? DesignRule.textColor_instruction : DesignRule.white,
                            fontSize: 17
                        }}>{isLimit ? '您已经购买过该商品' : '立即购买'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: '#FBBB50',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => this.props.bottomViewAction('jlj')}>
                        {
                            // shareMoney未空显示?  为0显示分享赚
                            shareMoney === '0.00' ? <Text style={{ fontSize: 17, color: DesignRule.white }}>分享赚</Text>
                                : <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: DesignRule.white, fontSize: 25 }}>赚</Text>
                                    <View style={{ marginLeft: 5 }}>
                                        <Text style={{ color: DesignRule.white, fontSize: 11 }}>品牌奖励金</Text>
                                        <View style={{
                                            alignItems: 'center',
                                            marginTop: 6
                                        }} maxWidth={ScreenUtils.autoSizeWidth(100)}>
                                            <Text style={{
                                                color: DesignRule.white,
                                                fontSize: 11
                                            }}
                                                  numberOfLines={2}>{StringUtils.isNoEmpty(shareMoney) ? `￥${shareMoney}` : '￥?'}</Text>
                                        </View>
                                    </View>
                                </View>
                        }


                    </TouchableOpacity>
                </View>

            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 49, flexDirection: 'row', backgroundColor: 'white', borderWidth: 1,
        borderColor: DesignRule.lineColor_inGrayBg
    }
});

