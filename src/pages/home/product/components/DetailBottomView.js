import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import xiangqing_btn_gouwuche_nor from '../res/xiangqing_btn_gouwuche_nor.png';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import jiarugouwuche_no from '../res/jiarugouwuche_no.png';

export default class DetailBottomView extends Component {

    static propTypes = {
        bottomViewAction: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { shareMoney, status, buyLimit, leftBuyNum } = this.props;
        //限购
        let isLimit = buyLimit !== -1 && leftBuyNum === 0;
        //status2：产品下架
        let disable = status === 2;
        let cantBuy = disable || isLimit;
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
                    <TouchableOpacity style={{ width: 63, justifyContent: 'center', alignItems: 'center' }}
                                      onPress={() => this.props.bottomViewAction('gwc')} disabled={cantBuy}>
                        <Image style={{ marginBottom: 6 }}
                               source={cantBuy ? jiarugouwuche_no : xiangqing_btn_gouwuche_nor}/>
                        <Text style={{ fontSize: 11, color: DesignRule.textColor_instruction }}>购物车</Text>
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
                            fontSize: 14
                        }}>{isLimit ? '您已经购买过该商品' : '立即购买'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: '#FBBB50',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}
                        onPress={() => this.props.bottomViewAction('jlj')}>
                        <Text style={{ color: DesignRule.white, fontSize: 25 }}>赚</Text>
                        <View style={{ marginLeft: 5 }}>
                            <Text style={{ color: DesignRule.white, fontSize: 11 }}>品牌奖励金</Text>
                            <View style={{
                                marginTop: 6,
                                alignItems: 'center'
                            }} maxWidth={ScreenUtils.autoSizeWidth(100)}>
                                <Text style={{
                                    color: DesignRule.white,
                                    fontSize: 11
                                }}
                                      numberOfLines={2}>{StringUtils.isNoEmpty(shareMoney) ? `￥${shareMoney}` : '￥?'}</Text>
                            </View>
                        </View>
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

