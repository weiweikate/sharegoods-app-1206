import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    FlatList
} from 'react-native';

import DesignRule from '../../../constants/DesignRule';
import DetailBanner from './DetailBanner';
import RES from '../res/product';
import StringUtils from '../../../utils/StringUtils';
import { MRText as Text } from '../../../components/ui/index';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import { contentImgWidth, price_type } from '../ProductDetailModel';
import { ActivityDidBeginView, ActivityWillBeginView } from './ProductDetailActivityView';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../utils/ScreenUtils';
import RouterMap, { navigate } from '../../../navigation/RouterMap';
import { observer } from 'mobx-react';
import res from '../../home/res';

const { isNoEmpty } = StringUtils;
const { arrow_right_black } = RES.button;
const { arrow_right_red } = RES;
const { toTop } = res.search;
const { px2dp } = ScreenUtils;

/*
* 商品头部
* */
export class HeaderItemView extends Component {

    /*价格模块*/
    _renderPriceView = ({ minPrice, maxPrice, originalPrice, levelText }) => {
        return (
            <View style={styles.priceView}>
                {
                    /*值相等*/
                    minPrice == maxPrice
                        ?
                        <Text style={styles.priceText}>¥<Text style={{ fontSize: 24 }}>{minPrice}</Text></Text>
                        :
                        <Text style={styles.priceText}>¥<Text style={{ fontSize: 24 }}>{minPrice}</Text>-¥<Text
                            style={{ fontSize: 24 }}>{maxPrice}</Text></Text>
                }
                <Text style={styles.originalText}>{originalPrice}</Text>
                <View style={styles.levelView}>
                    <Text style={styles.levelText}>{levelText}</Text>
                </View>
            </View>
        );
    };

    /*加入拼店提示*/
    _renderShop = ({ priceType, shopAction }) => {
        if (priceType === price_type.shop) {
            return null;
        }
        return (
            <NoMoreClick style={styles.shopView} onPress={shopAction}>
                <Text style={styles.shopText}>加入拼店，享更多特权</Text>
                <View style={styles.shopSubView}>
                    <View style={styles.shopSubLineView}/>
                    <Text style={styles.shopSubText}>加入拼店</Text>
                    <Image source={arrow_right_red}/>
                </View>
            </NoMoreClick>
        );
    };

    render() {
        const { navigation, productDetailModel, shopAction } = this.props;
        const { freight, monthSaleCount, originalPrice, minPrice, maxPrice, name, secondName, levelText, priceType } = productDetailModel;
        return (
            <View style={styles.bgView}>
                <DetailBanner data={productDetailModel} navigation={navigation}/>
                <ActivityWillBeginView/>
                <ActivityDidBeginView/>
                {this._renderPriceView({ minPrice, maxPrice, originalPrice, levelText })}
                {this._renderShop({ priceType, shopAction })}
                <Text style={styles.nameText} numberOfLines={2}>{name}</Text>
                {isNoEmpty(secondName) && <Text style={styles.secondNameText} numberOfLines={2}>{secondName}</Text>}
                <View style={styles.freightMonthView}>
                    {/*值为0*/}
                    <Text style={styles.freightMonthText}>快递：{freight == 0 ? '包邮' : `${freight}元`}</Text>
                    <Text style={styles.freightMonthText}>{`月销: ${monthSaleCount}`}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgView: {
        backgroundColor: DesignRule.white
    },

    priceView: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 15,
        height: 44
    },
    priceText: {
        paddingTop: (24 - 16) / 2.0,
        color: DesignRule.textColor_redWarn, fontSize: 16
    },
    originalText: {
        paddingHorizontal: 5,
        color: DesignRule.textColor_instruction, fontSize: 12, textDecorationLine: 'line-through'
    },
    levelView: {
        borderColor: DesignRule.textColor_redWarn, borderWidth: 1, borderRadius: 2
    },
    levelText: {
        paddingHorizontal: 4, paddingVertical: 2,
        color: DesignRule.textColor_redWarn, fontSize: 10
    },

    shopView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginHorizontal: 15, marginBottom: 5,
        backgroundColor: DesignRule.bgColor, borderRadius: 5, height: 40
    },
    shopText: {
        marginLeft: 10,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },
    shopSubView: {
        flexDirection: 'row', alignItems: 'center', marginRight: 13
    },
    shopSubLineView: {
        height: 22, width: 1, backgroundColor: DesignRule.lineColor_inGrayBg
    },
    shopSubText: {
        paddingLeft: 15, paddingRight: 5,
        color: DesignRule.textColor_redWarn, fontSize: 12
    },

    nameText: {
        marginHorizontal: 15, paddingBottom: 5,
        color: DesignRule.textColor_mainTitle, fontSize: 15, fontWeight: 'bold'
    },

    secondNameText: {
        marginHorizontal: 15, paddingBottom: 10, color: DesignRule.textColor_secondTitle, fontSize: 12
    },

    freightMonthView: {
        marginHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between'
    },
    freightMonthText: {
        paddingBottom: 10,
        color: DesignRule.textColor_instruction, fontSize: 12
    }
});

/*
* 套餐
* */
export class SuitItemView extends Component {
    _renderItem = ({item}) => {
        const { imgUrl, name, minPrice } = item;
        return (
            <View style={SuitItemViewStyles.item}>
                <UIImage style={SuitItemViewStyles.itemImg} source={{ uri: imgUrl }}/>
                <Text style={SuitItemViewStyles.itemText}
                      numberOfLines={2}>{name}</Text>
                <Text style={SuitItemViewStyles.itemPrice}>{`¥${minPrice}起`}</Text>
            </View>
        );
    };

    _goSuitPage = () => {
        const { productDetailModel } = this.props;
        navigate(RouterMap.SuitProductPage, { productDetailModel });
    };

    render() {
        const { productDetailModel } = this.props;
        const { groupActivity } = productDetailModel;
        return (
            <View style={SuitItemViewStyles.bgView}>
                <NoMoreClick style={SuitItemViewStyles.tittleView} onPress={this._goSuitPage}>
                    <Text style={SuitItemViewStyles.LeftText}>优惠套餐</Text>
                    <View style={SuitItemViewStyles.rightView}>
                        <Text style={SuitItemViewStyles.RightText}>查看全部</Text>
                        <Image source={arrow_right_black}/>
                    </View>
                </NoMoreClick>
                <FlatList
                    style={SuitItemViewStyles.flatList}
                    data={groupActivity.subProductList}
                    keyExtractor={(item, index) => item.id + index + ''}
                    renderItem={this._renderItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={5}
                />
            </View>
        );
    }
}

const SuitItemViewStyles = StyleSheet.create({
    bgView: {
        backgroundColor: DesignRule.white
    },
    tittleView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 15,
        height: 40
    },
    LeftText: {
        color: DesignRule.textColor_mainTitle, fontSize: 15, fontWeight: 'bold'
    },
    rightView: {
        flexDirection: 'row', alignItems: 'center'
    },
    RightText: {
        paddingRight: 8,
        color: DesignRule.textColor_instruction, fontSize: 12
    },
    flatList: {
        marginLeft: 15
    },
    item: {
        width: px2dp(100) + 5
    },
    itemImg: {
        width: px2dp(100), height: px2dp(100), borderRadius: 5
    },
    itemText: {
        color: DesignRule.textColor_secondTitle, fontSize: 12
    },
    itemPrice: {
        color: DesignRule.textColor_redWarn, fontSize: 12, paddingBottom: 19
    }
});

/*
* 促销信息
* */
export class PromoteItemView extends Component {
    render() {
        const { productDetailModel, promotionViewAction } = this.props;
        const { promoteInfoVOList } = productDetailModel;
        if (!promoteInfoVOList || promoteInfoVOList.length === 0) {
            return null;
        }
        return (
            <NoMoreClick style={PromoteItemViewStyles.promotionView} onPress={promotionViewAction}>
                <View style={PromoteItemViewStyles.promotionItemsView}>
                    {
                        promoteInfoVOList.map((item, index) => {
                            //8：经验翻倍 9：券兑换
                            const { type, message } = item;
                            let typeText;
                            if (type === 8) {
                                typeText = '经验翻倍';
                            } else if (type === 9) {
                                typeText = '券兑换';
                            }
                            if (index > 1) {
                                return null;
                            }
                            return <View
                                style={[PromoteItemViewStyles.promotionItemView, { marginTop: index === 0 ? 10 : 0 }]}>
                                <Text
                                    style={PromoteItemViewStyles.promotionItemNameText}>{index === 0 ? '促销' : ''}</Text>
                                {typeText ?
                                    <View
                                        style={[PromoteItemViewStyles.promotionItemRedView, { marginLeft: index === 0 ? 13 : 39 }]}>
                                        <Text
                                            style={[PromoteItemViewStyles.promotionItemRedText]}>{typeText}</Text>
                                    </View>
                                    :
                                    null
                                }
                                <Text
                                    style={[PromoteItemViewStyles.promotionItemText]}
                                    numberOfLines={1}>{message || ''}</Text>
                            </View>;
                        })
                    }
                </View>
                <Image source={arrow_right_black}/>
            </NoMoreClick>
        );
    }
}

const PromoteItemViewStyles = StyleSheet.create({
    promotionView: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginTop: 10,
        backgroundColor: 'white'
    },
    promotionItemsView: {
        flex: 1
    },
    promotionItemView: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 10
    },

    promotionItemNameText: {
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    promotionItemRedView: {
        borderRadius: 3, backgroundColor: '#FF00501A'
    },
    promotionItemRedText: {
        paddingHorizontal: 4, paddingVertical: 2,
        color: DesignRule.textColor_redWarn, fontSize: 10
    },
    promotionItemText: {
        marginLeft: 10, flex: 1,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    }
});

/*
* 服务
* */
export class ServiceItemView extends Component {
    render() {
        const { productDetailModel, serviceAction } = this.props;
        const { restrictions } = productDetailModel;
        return (
            <NoMoreClick style={ServiceItemViewStyles.serviceView} onPress={serviceAction}>
                <Text style={ServiceItemViewStyles.serviceNameText}>服务</Text>
                <Text style={ServiceItemViewStyles.serviceValueText} numberOfLines={1}>
                    {`质量保障·48小时发货${(restrictions & 4) === 4 ? `·7天退换` : ``}${(restrictions & 8) === 8 ? `·节假日发货` : ``}`}
                </Text>
                <Image source={arrow_right_black}/>
            </NoMoreClick>
        );
    }
}

const ServiceItemViewStyles = StyleSheet.create({
    serviceView: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
        backgroundColor: 'white', height: 44
    },
    serviceNameText: {
        color: DesignRule.textColor_instruction, fontSize: 13
    },
    serviceValueText: {
        flex: 1, marginLeft: 15,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    }
});

/*
* 参数
* */
export class ParamItemView extends Component {
    render() {
        const { paramAction } = this.props;
        return (
            <NoMoreClick style={ParamItemViewStyles.paramView} onPress={paramAction}>
                <Text style={ParamItemViewStyles.paramText}>参数</Text>
                <Image source={arrow_right_black}/>
            </NoMoreClick>
        );
    }
}

const ParamItemViewStyles = StyleSheet.create({
    paramView: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15,
        backgroundColor: 'white', height: 44
    },
    paramText: {
        color: DesignRule.textColor_instruction, fontSize: 13
    }
});

/*
* 图片
* */
export class ContentItemView extends Component {
    state = {
        width: contentImgWidth,
        height: 0
    };

    shouldComponentUpdate(nextProps) {
        if (this.state.height === 0 || this.props.item !== nextProps.item) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        const { item } = this.props;
        Image.getSize(item, (width, height) => {
            height = height / width * contentImgWidth;
            this.setState({
                height
            });
        });
    }

    render() {
        const { item } = this.props;
        const { width, height } = this.state;
        if (height === 0) {
            return null;
        }
        return <NoMoreClick onPress={() => {
            navigate(RouterMap.CheckBigImagesView, { imageUrls: [item] });
        }}>
            <Image source={{ uri: item }} style={{ width, height }}/>
        </NoMoreClick>;
    }
}

/*显示*/
@observer
export class ShowTopView extends Component {
    render() {
        const { productDetailModel, toTopAction } = this.props;
        const { showTop } = productDetailModel;
        return <View style={showTopViewStyles.showTopView}>
            {showTop && <NoMoreClick onPress={toTopAction}>
                <Image style={showTopViewStyles.showTopBtn} source={toTop}/>
            </NoMoreClick>}
        </View>;
    }
}

const showTopViewStyles = StyleSheet.create({
    showTopView: {
        position: 'absolute', right: 15, bottom: DesignRule.safeBottom + 69 + 15
    },
    showTopBtn: {
        width: 44, height: 44
    }
});
