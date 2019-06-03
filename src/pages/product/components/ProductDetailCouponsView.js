import React from 'react';
import { View, StyleSheet, Image, FlatList, ImageBackground } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import ProductApi from '../api/ProductApi';
import { observable } from 'mobx';
import bridge from '../../../utils/bridge';
import res from '../res/product';
import { MRText } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';

const { product_coupon } = res;
const { arrow_right_black } = res.button;
const { width, height, autoSizeHeight, safeBottom, px2dp } = ScreenUtils;

@observer
export default class ProductDetailCouponsView extends React.Component {

    render() {
        const { onPress } = this.props;
        // const { onPress, productDetailCouponsViewModel } = this.props;
        // const { couponsList } = productDetailCouponsViewModel;
        return (
            <NoMoreClick style={styles.container} onPress={onPress}>
                <View>
                    <MRText style={styles.leftText}>优惠</MRText>
                </View>
                <Image source={arrow_right_black}/>
            </NoMoreClick>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15,
        height: 44, backgroundColor: 'white'
    },
    leftText: {
        color: DesignRule.textColor_instruction, fontSize: 13
    }
});

export const couponType = {
    couponSub: 1,//满减券
    couponDiJia: 2,//抵价券
    couponZeKou: 3,//折扣券
    couponDiKou: 4,//抵扣券
    couponDuiHuang: 5,//兑换券
    couponGoodNumber: 7,//靓号
    couponOneValue: 99//一元券
};

export const couponShow = {
    [couponType.couponDiJia]: '抵',
    [couponType.couponZeKou]: '折',
    [couponType.couponDiKou]: '抵',
    [couponType.couponDuiHuang]: '兑',
    [couponType.couponGoodNumber]: '靓'
};

export function couponCategoryShow(item) {
    const products = item.products || [], cat1 = item.cat1 || [], cat2 = item.cat2 || [], cat3 = item.cat3 || [];
    let result = null;
    if (item.type === 5) {
        return '限商品：限指定商品可用';
    }
    if (products.length) {
        if ((cat1.length || cat2.length || cat3.length)) {
            return '限商品：限指定商品可用';
        }
        if (products.length > 1) {
            return '限商品：限指定商品可用';
        }
        if (products.length === 1) {
            let productStr = products[0];
            if (productStr.length > 15) {
                productStr = productStr.substring(0, 15) + '...';
            }
            return `限商品：限${productStr}商品可用`;
        }
    }
    if ((cat1.length + cat2.length + cat3.length) === 1) {
        result = [...cat1, ...cat2, ...cat3];
        return `限品类：限${result[0]}品类可用`;
    }
    if ((cat1.length + cat2.length + cat3.length) > 1) {
        return '限品类：限指定品类商品可用';
    }
    return '全品类：全场通用券（特殊商品除外）';
}

@observer
class ProductDetailCouponsWindowViewItem extends React.Component {
    render() {
        const { productDetailCouponsViewModel, item } = this.props;
        const { requestGetProdCoupon } = productDetailCouponsViewModel;
        const { type, value, name, useConditions, couponTime, getStatus } = item || {};
        const nameTextColor = !getStatus ? DesignRule.textColor_mainTitle : DesignRule.textColor_instruction;
        const subTextColor = !getStatus ? DesignRule.textColor_secondTitle : DesignRule.textColor_placeholder;
        const categoryShow = couponCategoryShow(item);
        console.log(ProductDetailCouponsWindowViewItem);
        return (
            <View style={windowStyles.itemView}>
                <View style={windowStyles.itemContainerView}>
                    {
                        couponShow[type] ? <View style={windowStyles.moneyView}>
                                <MRText style={{ fontSize: 34, color: DesignRule.mainColor }}>{couponShow[type]}</MRText>
                            </View>
                            :
                            <View style={windowStyles.moneyView}>
                                <MRText style={{ fontSize: 16, color: DesignRule.mainColor, paddingTop: 9 }}
                                        numberOfLines={1}>￥</MRText>
                                <MRText style={{ fontSize: 34, color: DesignRule.mainColor }}>{value}</MRText>
                            </View>
                    }

                    <View style={{ flex: 1 }}>
                        <MRText style={{ fontSize: 16, color: nameTextColor }}>{name || ''}</MRText>
                        <MRText style={{
                            fontSize: 10,
                            color: subTextColor
                        }}>{useConditions > 0 ? `满${useConditions}可用` : '无金额门槛'}</MRText>
                        <MRText style={{ fontSize: 10, color: subTextColor }}>{categoryShow}</MRText>
                        <MRText style={{
                            fontSize: 10,
                            color: subTextColor
                        }}>限{couponTime}使用</MRText>
                    </View>
                    <View style={windowStyles.imgView}>
                        {
                            getStatus ? <ImageBackground style={windowStyles.imgView} source={product_coupon}>
                                    <MRText style={{ fontSize: 10, color: DesignRule.textColor_placeholder }}>已领取</MRText>
                                </ImageBackground>
                                :
                                <NoMoreClick onPress={() => requestGetProdCoupon(item)}>
                                    <LinearGradient style={windowStyles.LinearGradient}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }}
                                                    colors={['#FC5D39', '#FF0050']}>
                                        <MRText style={{ fontSize: 12, color: 'white' }}>领取</MRText>
                                    </LinearGradient>
                                </NoMoreClick>
                        }
                    </View>
                </View>
            </View>
        );
    }
}

@observer
export class ProductDetailCouponsWindowView extends React.Component {
    state = {
        hidden: true
    };

    showWindowView = () => {
        this.setState({
            hidden: false
        });
    };
    _hiddenWindowView = () => {
        this.setState({
            hidden: true
        });
    };

    _renderItem = ({ item }) => {
        const { productDetailCouponsViewModel } = this.props;
        return <ProductDetailCouponsWindowViewItem item={item}
                                                   productDetailCouponsViewModel={productDetailCouponsViewModel}/>;
    };
    _keyExtractor = (item, index) => {
        return (item || {}).id + index;
    };

    render() {
        const { productDetailCouponsViewModel } = this.props;
        const { couponsList } = productDetailCouponsViewModel;
        const { hidden } = this.state;
        if (hidden) {
            return null;
        }
        return (
            <View style={windowStyles.container}>
                <NoMoreClick style={{ flex: 1 }} onPress={this._hiddenWindowView}/>
                <View style={windowStyles.contentView}>
                    <View style={windowStyles.tittleView}>
                        <MRText style={windowStyles.tittleText}>领取优惠券</MRText>
                    </View>
                    <FlatList data={couponsList}
                              style={windowStyles.flatListView}
                              renderItem={this._renderItem}
                              keyExtractor={this._keyExtractor}
                              showsVerticalScrollIndicator={false}/>
                    <View style={windowStyles.bottomView}>
                        <NoMoreClick style={windowStyles.bottomBtn} onPress={this._hiddenWindowView}>
                            <MRText style={windowStyles.bottomText}>确认</MRText>
                        </NoMoreClick>
                    </View>
                </View>
            </View>
        );
    }
}

const windowStyles = StyleSheet.create({
    container: {
        zIndex: 2000,
        position: 'absolute', width, height, left: 0, top: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    contentView: {
        position: 'absolute', left: 0, bottom: 0,
        borderTopLeftRadius: 8, borderTopRightRadius: 8,
        width, height: autoSizeHeight(410) + safeBottom, backgroundColor: 'white'
    },
    tittleView: {
        height: 44, justifyContent: 'center', alignItems: 'center'
    },
    tittleText: {
        fontSize: 15, color: DesignRule.textColor_secondTitle
    },

    LinearGradient: {
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 14, height: 28, width: 60
    },

    flatListView: {
        flex: 1, backgroundColor: DesignRule.bgColor
    },
    itemView: {
        marginTop: 15, marginHorizontal: 15,
        borderRadius: 3, backgroundColor: 'white'
    },
    itemContainerView: {
        marginVertical: 15, marginLeft: 24, marginRight: 15,
        flexDirection: 'row', alignItems: 'center'
    },
    moneyView: {
        flexDirection: 'row', alignItems: 'center',
        width: 70
    },
    imgView: {
        height: 60, width: 60, justifyContent: 'center', alignItems: 'center'
    },

    bottomView: {
        height: 49 + safeBottom, alignItems: 'center'
    },
    bottomBtn: {
        marginTop: 4.5, justifyContent: 'center', alignItems: 'center',
        height: 40, backgroundColor: DesignRule.mainColor, borderRadius: 20, width: px2dp(345)
    },
    bottomText: {
        fontSize: 17, color: 'white'
    }
});

export class ProductDetailCouponsViewModel {
    /**
     * 主键id
     * 优惠劵名称name
     * 优惠劵类型type 1: 满减 2:抵价 3:折扣 4:抵扣,5:兑换,7:靓号,99:一元券
     * 价值value
     * 时间couponTime
     * getStatus 1 用户是否已领取
     */

    @observable couponsList = [];
    spuCode = '';
    /*请求*/
    requestListProdCoupon = (spuCode) => {
        this.spuCode = spuCode;
        ProductApi.listProdCoupon({ spuCode }).then((data) => {
            this.couponsList = data.data || [];
        }).catch((e) => {
        });
    };

    requestGetProdCoupon = (item) => {
        const { code } = item || {};
        ProductApi.getProdCoupon({ couponId: code }).then(() => {
            item.getStatus = 1;
            bridge.$toast('领取成功');
        }).catch((e) => {
            this.requestListProdCoupon(this.spuCode);
            bridge.$toast(e.msg);
        });
    };
}
