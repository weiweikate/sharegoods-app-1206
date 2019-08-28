import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableWithoutFeedback,
    StyleSheet,
    Clipboard
} from 'react-native';

import DesignRule from '../../../constants/DesignRule';
import DetailBanner from './DetailBanner';
import RES from '../res/product';
import StringUtils from '../../../utils/StringUtils';
import { MRText as Text } from '../../../components/ui/index';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import { contentImgWidth, price_type } from '../ProductDetailModel';
import { ActivityDidBeginView, ActivityWillBeginView } from './ProductDetailActivityView';
import ScreenUtils from '../../../utils/ScreenUtils';
import RouterMap, { routeNavigate } from '../../../navigation/RouterMap';
import { observer } from 'mobx-react';
import res from '../../home/res';
import { activity_type, activity_status } from '../ProductDetailModel';
import bridge from '../../../utils/bridge';
import { getSource } from '@mr/image-placeholder/oos';
import { getSize } from '../../../utils/OssHelper';
import { SectionLineView } from './ProductDetailSectionView';

const { isNoEmpty } = StringUtils;
const { arrow_right_black } = RES.button;
const { arrow_right_red } = RES;
const { service_true } = RES.service;
const { toTop } = res.search;
const { saleBig_1001 } = RES.pSacle;

/*
* 商品头部
* */
export class HeaderItemView extends Component {

    /*价格模块*/
    _renderPriceView = ({ minPrice, maxPrice, originalPrice, levelText, monthSaleCount }) => {
        return (
            <View style={styles.priceView}>
                {
                    /*值相等*/
                    this.props.paramsType === '9' ?
                        <Text style={{
                            fontSize: 24,
                            fontWeight: '400',
                            color: DesignRule.textColor_redWarn
                        }}>付邮免费领</Text>
                        :
                        (
                            minPrice == maxPrice ?
                                <Text style={styles.priceText}>¥<Text
                                    style={{ fontSize: 24, fontWeight: '400' }}>{minPrice}</Text></Text>
                                :
                                <Text style={styles.priceText}>¥<Text
                                    style={{ fontSize: 24, fontWeight: '400' }}>{minPrice}</Text>-¥<Text
                                    style={{ fontSize: 24, fontWeight: '400' }}>{maxPrice}</Text></Text>
                        )
                }
                <Text style={styles.originalText}>¥{originalPrice}</Text>
                {
                    isNoEmpty(levelText) && this.props.paramsType !== '9' ? <View style={styles.levelView}>
                        <Text style={styles.levelText}>{levelText}</Text>
                    </View> : null
                }
                {monthSaleCount >= 1000 && <Image source={saleBig_1001}
                                                  style={{
                                                      width: 104,
                                                      height: 33,
                                                      top: -7,
                                                      right: -5,
                                                      position: 'absolute'
                                                  }}/>}
            </View>
        );
    };

    /*加入拼店提示*/
    _renderShop = ({ priceType, shopAction, groupPrice }) => {
        if (priceType === price_type.shop) {
            return null;
        }
        return (
            <NoMoreClick style={styles.shopView} onPress={shopAction}>
                <Text style={styles.shopText}>拼店价 <Text
                    style={{ color: DesignRule.textColor_redWarn }}>￥{groupPrice}</Text></Text>
                <View style={styles.shopSubView}>
                    <View style={styles.shopSubLineView}/>
                    <Text style={styles.shopSubText}>加入拼店</Text>
                    <Image resizeMode={'contain'} source={arrow_right_red} style={{ height: 12 }}/>
                </View>
            </NoMoreClick>
        );
    };

    render() {
        const { navigation, productDetailModel, shopAction } = this.props;
        const {
            freight, monthSaleCount, originalPrice, minPrice, groupPrice, promotionMinPrice, maxPrice, promotionMaxPrice, name,
            secondName, levelText, priceType, activityType, activityStatus, type, isHuaFei
        } = productDetailModel;
        let showWill = activityType === activity_type.skill && activityStatus === activity_status.unBegin;
        let showIn = activityType === activity_type.skill && activityStatus === activity_status.inSell;
        let showPrice = !(activityType === activity_type.skill && activityStatus === activity_status.inSell);
        /*秒杀||话费 || 兑换 不显示拼店*/
        let showShop = (activityType === activity_type.skill && activityStatus === activity_status.inSell) || isHuaFei || this.props.paramsType === '9';
        /*直降中显示活动价 价格区间*/
        let verDownInSell = activityType === activity_type.verDown && activityStatus === activity_status.inSell;
        return (
            <View style={styles.bgView}>
                <DetailBanner data={productDetailModel} navigation={navigation}/>
                {showWill && <ActivityWillBeginView productDetailModel={productDetailModel}/>}
                {showIn && <ActivityDidBeginView productDetailModel={productDetailModel}/>}
                {
                    showPrice && (verDownInSell ?
                        this._renderPriceView({
                            minPrice: promotionMinPrice,
                            maxPrice: promotionMaxPrice,
                            originalPrice,
                            levelText,
                            monthSaleCount
                        })
                        :
                        this._renderPriceView({ minPrice, maxPrice, originalPrice, levelText, monthSaleCount }))
                }
                {!showShop && this._renderShop({ priceType, shopAction, groupPrice })}
                <NoMoreClick onPress={() => {
                }} onLongPress={() => {
                    Clipboard.setString(name);
                    bridge.$toast('已将商品名称复制至剪贴板');
                }}>
                    <Text style={styles.nameText}>{name}</Text>
                </NoMoreClick>
                {isNoEmpty(secondName) && <Text style={styles.secondNameText} numberOfLines={2}>{secondName}</Text>}
                <View style={styles.freightMonthView}>
                    {/*值为0*/}
                    <Text
                        style={styles.freightMonthText}>快递：{type === 3 ? '免运费' : (freight == 0 ? '包邮' : `${freight}元`)}</Text>
                    <Text style={styles.freightMonthText}>{`近期销量: ${monthSaleCount}`}</Text>
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
        justifyContent: 'center',
        borderRadius: 2, backgroundColor: 'rgba(255,0,80,0.1)', height: 14
    },
    levelText: {
        paddingHorizontal: 4,
        color: DesignRule.textColor_redWarn, fontSize: 10
    },

    shopView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginHorizontal: 15,
        backgroundColor: DesignRule.bgColor, borderRadius: 5, height: 40
    },
    shopText: {
        marginLeft: 10,
        color: DesignRule.textColor_mainTitle, fontSize: 14
    },
    shopSubView: {
        flexDirection: 'row', alignItems: 'center', marginRight: 13
    },
    shopSubLineView: {
        height: 22, width: 1, backgroundColor: DesignRule.lineColor_inGrayBg
    },
    shopSubText: {
        paddingLeft: 15, paddingRight: 5, fontWeight: '500',
        color: DesignRule.textColor_redWarn, fontSize: 14
    },

    nameText: {
        marginHorizontal: 15, paddingBottom: 5, paddingTop: 10,
        color: DesignRule.textColor_mainTitle, fontSize: 16, fontWeight: '500'
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
* 促销信息
* */
export class PromoteItemView extends Component {
    render() {
        const { productDetailModel, promotionViewAction } = this.props;
        const { promoteInfoVOList } = productDetailModel;
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
                            return <View key={index}
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
                <Image resizeMode={'contain'} source={arrow_right_black} style={{ height: 10 }}/>
            </NoMoreClick>
        );
    }
}

const PromoteItemViewStyles = StyleSheet.create({
    promotionView: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,
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
    _imgText = (text) => {
        return <View style={ServiceItemViewStyles.itemView}>
            <Image source={service_true} style={{ width: 8, height: 8 }}/>
            <Text style={ServiceItemViewStyles.serviceValueText}>{text}</Text>
        </View>;
    };

    render() {
        const { productDetailModel, serviceAction } = this.props;
        const { afterSaleLimit, sevenDayReturn } = (productDetailModel || {}).groupActivity || {};
        return (
            <NoMoreClick style={ServiceItemViewStyles.serviceView} onPress={serviceAction}>
                <Text style={ServiceItemViewStyles.serviceNameText}>服务</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    {this._imgText('质量保障')}
                    {this._imgText('48小时发货')}
                    {afterSaleLimit ? this._imgText('仅支持换货') : (sevenDayReturn ? this._imgText('7天退换') : null)}
                </View>
                <Image resizeMode={'contain'} source={arrow_right_black} style={{ height: 10 }}/>
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
    itemView: {
        flexDirection: 'row', alignItems: 'center', marginLeft: 10
    },
    serviceValueText: {
        marginLeft: 5,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    }
});

/*
* 参数
* */
export class ParamItemView extends Component {
    render() {
        const { paramAction, productDetailModel } = this.props;
        const { paramList } = productDetailModel;
        const paramNames = paramList.map((item, index) => {
            if (index > 1) {
                return null;
            }
            return item.paramName;
        });
        return (
            <View>
                <SectionLineView/>
                <NoMoreClick style={ParamItemViewStyles.paramView} onPress={paramAction}>
                    <Text style={ParamItemViewStyles.paramText}>参数</Text>
                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{
                            color: DesignRule.textColor_mainTitle,
                            fontSize: 13
                        }}>{paramNames.join(' ')}</Text>
                    </View>
                    <Image resizeMode={'contain'} source={arrow_right_black} style={{ height: 10 }}/>
                </NoMoreClick>
            </View>

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
        getSize(item, (width, height) => {
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
        return <TouchableWithoutFeedback onPress={() => {
            routeNavigate(RouterMap.CheckBigImagesView, { imageUrls: [item] });
        }}>
            <Image source={getSource({ uri: item }, ScreenUtils.width, height, 'lfit')}
                   style={{ width, height }}/>
        </TouchableWithoutFeedback>;
    }
}

/*显示向上箭头*/
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

/*价格说明*/
export class PriceExplain extends Component {
    render() {
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Text style={PriceExplainStyles.tittleText}>价格说明</Text>
                <View style={PriceExplainStyles.lineView}/>
                <Text
                    style={PriceExplainStyles.contentText}>{'划线价格：指商品的专柜价、吊牌价、正品零售价、厂商指导价或该商品的曾经展示过销售价等，并非原价，仅供参考\n未划线价格：指商品的实时价格，不因表述的差异改变性质。具体成交价格根据商品参加活动，或会员使用优惠券、积分等发生变化最终以订单结算页价格为准。'}</Text>
            </View>
        );
    }
}

const PriceExplainStyles = StyleSheet.create({
    tittleText: {
        paddingVertical: 13, marginLeft: 15, fontSize: 15, color: DesignRule.textColor_mainTitle
    },
    lineView: {
        height: 0.5, marginHorizontal: 0, backgroundColor: DesignRule.lineColor_inColorBg
    },
    contentText: {
        padding: 15, color: DesignRule.textColor_instruction, fontSize: 13
    }
});
