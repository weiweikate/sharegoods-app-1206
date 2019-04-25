import React, { Component } from 'react';
import ScreenUtils from '../../../../utils/ScreenUtils';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    TextInput as RNTextInput, Keyboard
} from 'react-native';
import {
    UIText
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react/native';
import { confirmOrderModel } from '../../model/ConfirmOrderModel';
import res from '../../res';

const arrow_right = res.arrow_right;
const couponIcon = res.coupons_icon;

@observer
export default class ConfirmPriceView extends Component {

    render() {
        return (
            <View style={{ marginBottom: 250 }}>
                {this.renderLine()}
                {/*{this.renderCouponsPackage()}*/}
                {this.renderPriceView()}
            </View>
        );
    }

    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inWhiteBg }}/>
        );
    };
    renderPriceView = () => {
        let promotionAmount = confirmOrderModel.promotionAmount || 0;
        promotionAmount = parseFloat(promotionAmount);
        //优惠券文案处理
        let couponAmount = confirmOrderModel.couponAmount
        let couponCount = confirmOrderModel.couponCount || 0;
        if (couponAmount!= undefined){//有优惠金额显示金额
            couponAmount = couponAmount == 0? '请选择优惠券':'-¥'+couponAmount
        } else {//无优惠金额显示优惠卷名称
            couponAmount = couponCount > 0?(confirmOrderModel.couponName+(couponCount>1?'x'+couponCount: '')):'请选择优惠券'
        }
        if (!confirmOrderModel.canUseCou) {
            couponAmount = '不支持使用优惠券'
        }
        return (

            <View style={{ backgroundColor: 'white' }}>
                <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
                {confirmOrderModel.allProductPrice != undefined? < View style={styles.couponsStyle}>
                    <UIText value={'商品金额'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText value={`¥${confirmOrderModel.allProductPrice}`}
                                style={[styles.grayText]}/>
                    </View>
                </View>: null
                }
                {this.renderLine()}
                <View style={[styles.couponsStyle,]}>
                    <UIText value={'运费'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText value={`¥${confirmOrderModel.totalFreightFee}`}
                                style={[styles.grayText]}/>
                    </View>
                </View>
                <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
                {promotionAmount !== 0 ? <View style={styles.couponsStyle}
                                               activeOpacity={0.5}
                                               disabled={!confirmOrderModel.canUseCou}
                                               onPress={this.props.jumpToCouponsPage}>
                    <UIText value={'组合优惠'} style={styles.blackText}/>
                    {this.renderLine()}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={promotionAmount>0?('-¥'+promotionAmount):('+¥'+ Math.abs(promotionAmount))}
                            style={[styles.grayText, { marginRight: ScreenUtils.autoSizeWidth(15) }]}/>
                        <Image source={arrow_right}/>
                    </View>
                </View> : null}

                <TouchableOpacity style={styles.couponsStyle}
                                  activeOpacity={0.5}
                                  disabled={!confirmOrderModel.canUseCou}
                                  onPress={this.props.jumpToCouponsPage}>
                    <UIText value={'优惠券'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={couponAmount}
                            style={[styles.grayText, { marginRight: ScreenUtils.autoSizeWidth(15) }]}/>
                        <Image source={arrow_right}/>
                    </View>
                </TouchableOpacity>
                {this.renderLine()}
                <TouchableOpacity style={styles.couponsStyle}
                                  activeOpacity={0.5}
                                  onPress={() => this.props.jumpToCouponsPage('justOne')}>
                    <UIText value={'1元现金券'} style={styles.blackText}/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <UIText
                            value={confirmOrderModel.tokenCoin ? confirmOrderModel.tokenCoinText : '选择1元现金券'}
                            style={[styles.grayText, { marginRight: ScreenUtils.autoSizeWidth(15) }]}/>
                        <Image source={arrow_right}/>
                    </View>
                </TouchableOpacity>
                {this.renderLine()}
                <TouchableOpacity style={styles.couponsStyle} onPress={() => {
                    if (this.input.isFocused()) {
                        this.input.blur();
                        Keyboard.dismiss();
                    }
                }}>
                    <UIText value={'买家留言'} style={styles.blackText}/>
                    <RNTextInput
                        ref={(e) => this.input = e}
                        style={styles.inputTextStyle}
                        onChangeText={text => confirmOrderModel.message = text}
                        placeholder={'选填：填写内容已与卖家协商确认'}
                        placeholderTextColor={DesignRule.textColor_instruction}
                        numberOfLines={1}
                        underlineColorAndroid={'transparent'}
                        onFocus={this.props.inputFocus}
                    />
                </TouchableOpacity>
                {this.renderLine()}

            </View>
        );
    };
    renderCouponsPackage = () => {
        return (
            <View style={{ borderTopColor: DesignRule.lineColor_inWhiteBg, borderTopWidth: 0.5 }}>
                {confirmOrderModel.couponList ?
                    confirmOrderModel.couponList.map((item, index) => {
                        return <View style={{ backgroundColor: 'white' }} key={index}>
                            {index === 0 ? <Image source={couponIcon} style={styles.couponIconStyle}/> : null}
                            <View style={styles.couponsOutStyle}>
                                <UIText style={styles.couponsTextStyle} value={item.couponName}/>
                                <UIText style={styles.couponsNumStyle} value={`x1`}/>
                            </View>
                            <View style={styles.couponsLineStyle}/>
                        </View>;
                    })
                    :
                    null}
            </View>
        );
    };

}
const styles = StyleSheet.create({
    couponsLineStyle: {
        marginLeft: ScreenUtils.autoSizeWidth(36),
        backgroundColor: DesignRule.bgColor,
        height: 0.5,
        width: '100%'
    },
    blackText: {
        fontSize: ScreenUtils.px2dp(13),
        lineHeight: ScreenUtils.autoSizeWidth(18),
        color: DesignRule.textColor_mainTitle
    }, grayText: {
        fontSize: ScreenUtils.px2dp(13),
        lineHeight: ScreenUtils.autoSizeWidth(18),
        color: DesignRule.textColor_instruction
    }, inputTextStyle: {
        marginLeft: ScreenUtils.autoSizeWidth(20),
        height: ScreenUtils.autoSizeWidth(40),
        flex: 1,
        backgroundColor: 'white',
        fontSize: ScreenUtils.px2dp(14)
    },
    couponsStyle: {
        height: ScreenUtils.autoSizeWidth(44),
        flexDirection: 'row',
        paddingLeft: ScreenUtils.autoSizeWidth(15),
        paddingRight: ScreenUtils.autoSizeWidth(15),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    couponIconStyle: {
        width: ScreenUtils.autoSizeWidth(15),
        height: ScreenUtils.autoSizeWidth(12),
        position: 'absolute',
        left: ScreenUtils.autoSizeWidth(15),
        top: ScreenUtils.autoSizeWidth(12)
    },
    couponsOutStyle: {
        height: ScreenUtils.autoSizeWidth(34),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: ScreenUtils.autoSizeWidth(36)
    },
    couponsTextStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: ScreenUtils.px2dp(13),
        alignSelf: 'center'
    },
    couponsNumStyle: {
        color: DesignRule.textColor_instruction,
        fontSize: ScreenUtils.px2dp(13),
        alignSelf: 'center',
        marginRight: ScreenUtils.autoSizeWidth(13.5)
    }

});
