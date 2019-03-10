import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SectionList,
    Image,
    ImageBackground,
    TouchableWithoutFeedback
} from 'react-native';
import { MRText as Text } from '../../../../components/ui/index';
import CommModal from '../../../../comm/components/CommModal';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res/product';

const { px2dp } = ScreenUtils;
const { xp_detail_xp, xp_detail_coupon_bg, xp_detail_coupon, xp_detail_contents } = res.xpProduct;

export default class XpDetailActivityInfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            xpDetailModel: {}
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.modalVisible !== nextState.modalVisible) {
            return true;
        }
        return false;
    }

    show = (xpDetailModel) => {
        this.setState({
            modalVisible: true,
            xpDetailModel: xpDetailModel
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _renderHeader = ({ section }) => {
        const { headerTittle, headerImg } = section;
        return <TouchableWithoutFeedback>
            <View style={styles.itemHeaderView}>
                <Image source={headerImg}/>
                <Text style={styles.itemHeaderText}>{headerTittle}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    _renderItemXp = (item) => {
        return <TouchableWithoutFeedback>
            <View>
                <Text style={styles.itemText}>{`购买满${item.startPrice || ''}元，经验值翻${item.rate || ''}倍`}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    _renderCouponText = (item) => {
        const { value, type } = item.coupon || {};
        if (type === 4) {
            return <View style={styles.bgTopValueView}>
                <Text style={styles.bgTopValueLText}>{`商品\n兑换`}</Text>
            </View>;
        } else if (type === 3) {
            return <View style={styles.bgTopValueView}>
                <Text style={styles.bgTopValueRText}>{(value / 10) || ''}</Text>
                <Text style={styles.bgTopValueLText}>折</Text>
            </View>;
        } else {
            return <View style={styles.bgTopValueView}>
                <Text style={styles.bgTopValueLText}>¥</Text>
                <Text style={styles.bgTopValueRText}>{value || ''}</Text>
            </View>;
        }
    };

    _renderItemCoupon = (item) => {
        const { name, type, useConditions } = item.coupon || {};
        let nameType, valueType;
        //1: 满减 2:抵价 3:折扣 4:抵扣',
        switch (type) {
            case 1:
                nameType = '满减券';
                valueType = useConditions > 0 ? `满${useConditions || ''}可用` : `无金额门槛`;
                break;
            case 2:
                nameType = '抵价券';
                valueType = `无金额门槛`;
                break;
            case 3:
                nameType = '折扣券';
                valueType = useConditions > 0 ? `满${useConditions || ''}可用` : `无金额门槛`;
                break;
            case 4:
                nameType = '抵扣券';
                valueType = `限指定商品可用`;
                break;
            default:
                nameType = '';
                valueType = '';
                break;
        }
        return <TouchableWithoutFeedback>
            <View>
                <Text style={styles.itemText}>{`每满${item.startPrice}元，赠送${item.startCount}张优惠券`}</Text>
                <Text style={styles.itemText}>{`单笔订单最多可领${item.maxCount}张优惠券`}</Text>
                <ImageBackground source={xp_detail_coupon_bg} style={styles.itemCouponBgImg} resizeMode='stretch'>
                    <View style={styles.bgTopView}>
                        {this._renderCouponText(item)}
                        <View style={styles.bgBottomNameView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.bgBottomNameText}>{name || ''}</Text>
                                <View style={styles.bgTopRightView}>
                                    <Text style={styles.bgTopRightText}>{nameType || ''}</Text>
                                </View>
                            </View>
                            <Text style={styles.bgBottomRemarkText}>{valueType}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>;
    };

    _renderItemContents = (item) => {
        return <TouchableWithoutFeedback>
            <View>
                <Text style={styles.itemText}>{`${item.contents || ''}`}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    _renderItem = ({ item, section }) => {
        switch (section.type) {
            case 'xp':
                return this._renderItemXp(item);
            case 'coupon':
                return this._renderItemCoupon(item);
            case 'contents':
                return this._renderItemContents(item);
            default:
                return null;
        }
    };

    _keyExtractor = (item, index) => {
        return `${item.type}${index}`;
    };

    render() {
        const { rules, startPrice, startCount, maxCount, coupon, contents } = this.state.xpDetailModel;

        let sectionListData;
        if ((coupon || {}).id) {
            sectionListData = [
                { headerTittle: '经验值', headerImg: xp_detail_xp, type: 'xp', data: rules || [] },
                {
                    headerTittle: '优惠券',
                    headerImg: xp_detail_coupon,
                    type: 'coupon',
                    data: [{ startPrice, startCount, maxCount, coupon }]
                },
                { headerTittle: '活动说明', headerImg: xp_detail_contents, type: 'contents', data: [{ contents }] }];
        } else {
            sectionListData = [
                { headerTittle: '经验值', headerImg: xp_detail_xp, type: 'xp', data: rules || [] },
                { headerTittle: '活动说明', headerImg: xp_detail_contents, type: 'contents', data: [{ contents }] }];
        }

        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                    <View style={styles.bottomView}>
                        <Text style={styles.tittleText}>活动信息</Text>
                        <SectionList keyExtractor={this._keyExtractor}
                                     showsVerticalScrollIndicator={false}
                                     renderSectionHeader={this._renderHeader}
                                     renderItem={this._renderItem}
                                     sections={sectionListData}/>
                        <TouchableOpacity style={styles.sureBtn} onPress={this._close}>
                            <Text style={styles.sureText}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    topCloseBtn: {
        height: px2dp(175)
    },
    bottomView: {
        flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.white
    },

    tittleText: {
        alignSelf: 'center', marginTop: 15,
        fontSize: 17, color: DesignRule.textColor_mainTitle
    },

    itemHeaderView: {
        flexDirection: 'row', alignItems: 'center',
        paddingTop: 16, paddingBottom: 5, paddingLeft: 15,
        backgroundColor: DesignRule.white
    },
    itemHeaderText: {
        marginLeft: 5,
        color: DesignRule.textColor_instruction, fontSize: 13
    },

    itemText: {
        paddingVertical: 5, paddingHorizontal: 15,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },

    /*图片*/
    itemCouponBgImg: {
        alignSelf: 'center',
        marginVertical: 5, width: px2dp(345), height: 90
    },

    /*优惠券*/
    bgTopView: {
        flexDirection: 'row', alignItems: 'center',
        flex: 1
    },
    bgTopValueView: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        width: px2dp(78)
    },
    bgTopValueLText: {
        color: DesignRule.textColor_mainTitle, fontSize: 14, marginTop: 10
    },
    bgTopValueRText: {
        fontSize: 34, color: DesignRule.textColor_mainTitle
    },

    bgBottomNameView: {
        paddingHorizontal: 15
    },

    bgBottomNameText: {
        color: DesignRule.textColor_mainTitle, fontSize: 13
    },

    bgTopRightView: {
        borderRadius: 2,
        borderWidth: 1,
        borderColor: DesignRule.mainColor,
        marginLeft: 5
    },

    bgTopRightText: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        color: DesignRule.mainColor,
        fontSize: 10
    },

    bgBottomRemarkText: {
        marginTop: 5,
        color: DesignRule.textColor_secondTitle, fontSize: 11
    },

    sureBtn: {
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center',
        height: 44, width: ScreenUtils.width - 30, marginBottom: ScreenUtils.safeBottom + 15,
        backgroundColor: DesignRule.bgColor_btn, borderRadius: 22
    },
    sureText: {
        color: DesignRule.white, fontSize: 17
    }
});

