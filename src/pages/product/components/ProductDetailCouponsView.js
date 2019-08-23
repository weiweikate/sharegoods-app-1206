import React from 'react';
import { View, StyleSheet, Image, FlatList, ImageBackground ,TouchableWithoutFeedback} from 'react-native';
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
import StringUtils from '../../../utils/StringUtils';
import CommModal from '../../../comm/components/CommModal';

const { product_coupon ,couponRemarkHide,couponRemarkShow} = res;
const { arrow_right_black } = res.button;
const { width, height, autoSizeHeight, safeBottom, px2dp } = ScreenUtils;
const {isNoEmpty} = StringUtils

export const couponType = {
    couponSub: 1,//满减券
    couponDiJia: 2,//抵价券
    couponZeKou: 3,//折扣券
    couponDiKou: 4,//抵扣券
    couponDuiHuang: 5,//兑换券 周期券

    /*不是优惠券列表接口*/
    couponGoodNumber: 11,//靓号
    couponShop: 12,//拼店券
    couponOneValue: 99//一元券
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

/**商品详情页优惠券item**/
@observer
export default class ProductDetailCouponsView extends React.Component {

    render() {
        const { onPress, productDetailCouponsViewModel } = this.props;
        const { couponsList } = productDetailCouponsViewModel;
        return (
            <NoMoreClick style={styles.container} onPress={onPress}>
                <View style={styles.nameView}>
                    <MRText style={styles.leftText}>优惠</MRText>
                    {
                        (couponsList || []).map((item, index) => {
                            if (index >= 2) {
                                return null;
                            }
                            return <View style={[styles.nameRedView, { marginLeft: index === 0 ? 10 : 5 }]} key={index}>
                                <MRText style={styles.nameRedText} numberOfLines={1}>{item.name}</MRText>
                            </View>;
                        })
                    }
                </View>
                <Image source={arrow_right_black} style={{ width: 7, height: 10 }}/>
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
    },
    nameView: {
        alignItems: 'center', flexDirection: 'row'
    },
    nameRedView: {
        borderRadius: 3, backgroundColor: '#FF00501A'
    },
    nameRedText: {
        paddingHorizontal: 4, paddingVertical: 2, maxWidth: px2dp(130),
        color: DesignRule.textColor_redWarn, fontSize: 10
    }
});

/**弹框列表内item**/
@observer
class ProductDetailCouponsWindowViewItem extends React.Component {
    state = {
        isHide:true
    }
    render() {
        const { productDetailCouponsViewModel, item } = this.props;
        const { requestGetProdCoupon } = productDetailCouponsViewModel;
        const { type, value, name, couponTime, getStatus,remarks } = item || {};
        /*name颜色*/
        const nameTextColor = !getStatus ? DesignRule.textColor_mainTitle : DesignRule.textColor_instruction;
        /*其他文字*/
        const subTextColor = !getStatus ? DesignRule.textColor_secondTitle : DesignRule.textColor_placeholder;
        /*限制*/
        const categoryShow = couponCategoryShow(item);
        const showZheKou = type === couponType.couponZeKou;
        const showMoney = type === couponType.couponSub || type === couponType.couponDiJia;
        let valueS;
        switch (type) {
            case couponType.couponSub:
            case couponType.couponDiJia:
                valueS = value;
                break;
            case couponType.couponZeKou:
                valueS = value / 10;
                break;
            case couponType.couponDiKou:
                valueS = '抵';
                break;
            case couponType.couponDuiHuang:
                valueS = '兑';
                break;
            default:
                valueS = '';
        }
        const{isHide} = this.state;
        return (
            <TouchableWithoutFeedback>
            <View style={windowStyles.itemView}>
                <View style={windowStyles.itemContainerView}>
                    <View style={windowStyles.moneyView}>
                        {showMoney &&
                        <MRText style={{ fontSize: 16, color: DesignRule.mainColor, paddingTop: 9 }}>￥</MRText>
                        }
                        <MRText style={{ fontSize: 34, color: DesignRule.mainColor }}>{valueS}</MRText>
                        {showZheKou &&
                        <MRText style={{ fontSize: 16, color: DesignRule.mainColor, paddingTop: 9 }}>折</MRText>
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <MRText style={{ fontSize: 16, color: nameTextColor }}>{name || ''}</MRText>
                        <MRText style={{ fontSize: 10, color: subTextColor }}>{categoryShow}</MRText>
                        <MRText style={{ fontSize: 10, color: subTextColor }}>限{couponTime}使用</MRText>
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
                {isNoEmpty(remarks) && <NoMoreClick style = {{backgroundColor:'#FAFAFA'}} activeOpacity = {1} onPress = {()=>{
                    this.setState({
                        isHide:!isHide
                    })
                }}>
                {!isHide && <MRText style={windowStyles.remarkText}>{remarks}</MRText>}
                <View style = {windowStyles.remarkView}>
                <Image style = {windowStyles.remarkImage} source = {isHide ? couponRemarkHide : couponRemarkShow}/>
                </View>
                </NoMoreClick>}
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

/**全屏弹框**/
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
        return (
            <CommModal onRequestClose={this._hiddenWindowView} visible={!hidden} transparent={true}>
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
            </CommModal>
        );
    }
}

const windowStyles = StyleSheet.create({
    container: {
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
        marginVertical: 15, marginRight: 15,
        flexDirection: 'row', alignItems: 'center'
    },
    moneyView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        minWidth: px2dp(95)
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
    },
    remarkView:{
        justifyContent:'center',alignItems:'center',
        height:22,borderRadius:3,
    },
    remarkText:{
        paddingHorizontal:15,paddingVertical:8,
        fontSize: 10, color: DesignRule.textColor_secondTitle,
    },
    remarkImage:{
        width:8,height:4
    }
});

/**网络数据  优惠券列表 model**/
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
        const { id } = item || {};
        ProductApi.getProdCoupon({ couponId: id }).then(() => {
            /*本地改变成领取*/
            item.getStatus = 1;
            bridge.$toast('领取成功');
        }).catch((e) => {
            this.requestListProdCoupon(this.spuCode);
            bridge.$toast(e.msg);
        });
    };
}
