/**
 * @author 陈阳君
 * @date on 2019/10/08
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { MRText } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res/product';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { routePop } from '../../../../navigation/RouterMap';
import StringUtils from '../../../../utils/StringUtils';

const { white_go } = res.button;
const { back, share } = res.pDetailNav;
const { statusBarHeight } = ScreenUtils;

@observer
export class MemberNavView extends Component {
    render() {
        const { showAction } = this.props;
        return (
            <View style={styles.bgView}>
                <View style={styles.containerView}>
                    <View style={[styles.barItemContainer, { justifyContent: 'flex-start' }]}>
                        <NoMoreClick style={styles.btnContainer} onPress={() => {
                            routePop();
                        }}>
                            <Image source={back} style={{ width: 28, height: 28 }}/>
                        </NoMoreClick>
                    </View>
                    <View style={styles.centerView}>
                    </View>
                    <View style={[styles.barItemContainer, { justifyContent: 'flex-end' }]}>
                        <NoMoreClick style={styles.btnContainer} onPress={showAction}>
                            <Image source={share} style={{ width: 28, height: 28 }}/>
                        </NoMoreClick>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        zIndex: 1000,
        position: 'absolute', top: 0, left: 0, right: 0
    },
    containerView: {
        flexDirection: 'row', marginTop: statusBarHeight,
        height: 44
    },
    barItemContainer: {
        flexDirection: 'row',
        width: 88, height: 44
    },
    btnContainer: {
        justifyContent: 'center', alignItems: 'center',
        width: 44, height: 44
    },
    centerView: {
        flex: 1, justifyContent: 'center', alignItems: 'center', height: 44
    }
});

@observer
export class MemberPriceView extends Component {
    render() {
        const { totalProPrice, totalPrice } = this.props.memberProductModel;
        return (
            <LinearGradient style={stylesMem.container}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#FF0050', '#FC5D39']}>
                <View style={stylesMem.leftView}>
                    <MRText style={{ fontSize: 20, color: 'white', lineHeight: 41 }}>¥<MRText
                        style={{ fontSize: 36, fontWeight: '500' }}>{totalProPrice}</MRText></MRText>
                    <View style={{ marginLeft: 10 }}>
                        <View style={stylesMem.liBaoView}>
                            <MRText style={{ fontSize: 11, color: 'white' }}>礼包价</MRText>
                        </View>
                        <MRText style={{
                            fontSize: 12,
                            color: 'white',
                            textDecorationLine: 'line-through'
                        }}>原价{totalPrice}</MRText>
                    </View>
                </View>
                <NoMoreClick style={stylesMem.rightView} onPress={() => {
                    this.props.allAction && this.props.allAction();
                }}>
                    <MRText style={{ fontSize: 14, color: 'white' }}>礼包商品</MRText>
                    <Image source={white_go} style={stylesMem.img}/>
                </NoMoreClick>
            </LinearGradient>
        );
    }
}

const stylesMem = StyleSheet.create({
    container: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 56
    },
    leftView: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 15
    },

    liBaoView: {
        backgroundColor: '#E41842', width: 40, height: 16, borderRadius: 2,
        justifyContent: 'center', alignItems: 'center', marginBottom: 2
    },

    rightView: {
        flexDirection: 'row', alignItems: 'center', marginRight: 15
    },
    img: {
        width: 7, height: 12, marginLeft: 10
    }
});

@observer
export class MemberNameView extends Component {
    render() {
        const { activityName, mainProduct, freight } = this.props.memberProductModel;
        const { saleNum } = mainProduct;
        return (
            <View style={stylesName.container}>
                <MRText style={stylesName.nameText}
                        numberOfLines={2}>{activityName}</MRText>
                <View style={stylesName.saleView}>
                    <MRText style={{
                        fontSize: 12,
                        color: DesignRule.textColor_instruction
                    }}>快递：{freight == 0 ? '包邮' : freight}</MRText>
                    <MRText style={{ fontSize: 12, color: DesignRule.textColor_instruction }}>近期销量：{saleNum}</MRText>
                </View>
            </View>
        );
    }
}

const stylesName = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    nameText: { marginHorizontal: 15, marginTop: 5, fontSize: 16, color: DesignRule.textColor_mainTitle },
    saleView: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginHorizontal: 15, marginBottom: 10, marginTop: 5
    }
});

@observer
export class MemberBuyView extends Component {
    render() {
        const { totalProPrice, totalDeProPrice, promotionInfoItem } = this.props.memberProductModel;
        const { show, showTag, promotionPrice } = promotionInfoItem;
        const priceType = show === 1 ? `${showTag}：` : '套餐价：';
        //支付
        const pricePay = show === 1 ? promotionPrice : totalProPrice;
        //节省
        const totalPrice = StringUtils.add(totalProPrice, totalDeProPrice);
        const priceSub = show === 1 ? StringUtils.sub(totalPrice, promotionPrice) : totalDeProPrice;

        return (
            <View style={stylesBottom.container}>
                <View style={stylesBottom.container1}>
                    <View style={stylesBottom.leftView}>
                        <MRText style={{ fontSize: 12, color: DesignRule.textColor_mainTitle }}>{priceType}<MRText
                            style={{ fontSize: 17, color: DesignRule.textColor_redWarn }}>￥{pricePay}
                        </MRText>
                        </MRText>
                        <MRText
                            style={{ fontSize: 10, color: DesignRule.textColor_redWarn }}>为你节省{priceSub}</MRText>
                    </View>
                    <NoMoreClick onPress={() => {
                        this.props.buyAction && this.props.buyAction();
                    }}>
                        <LinearGradient style={stylesBottom.btn}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={['#FC5D39', '#FF0050']}>
                            <MRText style={{ fontSize: 14, color: 'white' }}>立即购买</MRText>
                        </LinearGradient>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const stylesBottom = StyleSheet.create({
    container: {
        height: 48 + ScreenUtils.safeBottom, backgroundColor: 'white'
    },
    container1: {
        height: 48,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    leftView: {
        marginLeft: 15
    },
    btn: {
        width: 100, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15
    }
});
