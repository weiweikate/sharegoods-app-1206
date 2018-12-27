import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import res from '../../res';
import {MRText as Text} from '../../../../components/ui';

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
        //productStatus  1正常  2下架  3当前时间不能买
        let { shareMoney, productStatus, buyLimit, leftBuyNum } = this.props;
        //是否下架
        let isDown = productStatus === 2;//是否下架  样式

        //限购
        let isLimit = buyLimit !== -1 && leftBuyNum === 0;

        //不能加入购物车
        let cantJoin = productStatus === 2;

        //不能买 不正常||限购
        let cantBuy = productStatus !== 1 || isLimit;
        //立即购买文案
        let buyText = productStatus === 3 ? '暂不可购买' : (isLimit ? '您已经购买过该商品' : '立即购买');
        return (
            <View style={{ height: 49 + ScreenUtils.safeBottom + (isDown ? 20 : 0), backgroundColor: 'white' }}>
                {isDown ? <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 20,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <Text style={{ color: DesignRule.white, fontSize: 13 }} allowFontScaling={false}>商品已经下架啦~</Text>
                </View> : null}
                <View style={styles.container}>
                    <TouchableOpacity
                        style={{ width: ScreenUtils.autoSizeWidth(85), justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.props.bottomViewAction('gwc')} disabled={cantJoin}>
                        <Image style={{ marginBottom: 6 }}
                               source={cantJoin ? jiarugouwuche_no : xiangqing_btn_gouwuche_nor}/>
                        <Text style={{ fontSize: 11, color: DesignRule.textColor_mainTitle }} allowFontScaling={false}>加入购物车</Text>
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
                        }} allowFontScaling={false}>{buyText}</Text>
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
                            shareMoney === '0.00' ? <Text style={{ fontSize: 17, color: DesignRule.white }}>分享秀一秀</Text>
                                : <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/*<Text style={{ color: DesignRule.white, fontSize: 25 }} allowFontScaling={false}>赚</Text>*/}
                                    <View style={{ marginLeft: 5 }}>
                                        <Text style={{ color: DesignRule.white, fontSize: 11 }} allowFontScaling={false}>分享秀一秀</Text>
                                        <View style={{
                                            alignItems: 'center',
                                            marginTop: 6
                                        }} maxWidth={ScreenUtils.autoSizeWidth(100)}>
                                            <Text style={{
                                                color: DesignRule.white,
                                                fontSize: 11
                                            }}
                                                  numberOfLines={2} allowFontScaling={false}>{StringUtils.isNoEmpty(shareMoney) ? `${shareMoney}` : '?'}</Text>
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

