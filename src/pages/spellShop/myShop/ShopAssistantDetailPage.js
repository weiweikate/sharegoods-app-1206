//店员详情页面
import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import UIImage from '@mr/image-placeholder';
import {
    MRText as Text
} from '../../../components/ui';
//Source
const SCREEN_WIDTH = Dimensions.get('window').width;

import BasePage from '../../../BasePage';
import DateUtils from '../../../utils/DateUtils';
import SpellShopApi from '../api/SpellShopApi';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import StringUtils from '../../../utils/StringUtils';
import res from '../res';
import resCommon from '../../../comm/res';

const RingImg = res.myShop.headBg;
const HeaderBarBgImg = res.myShop.txbg_03;
const NameIcon = res.myShop.icon_03;
const StarIcon = res.myShop.icon_03_02;
const CodeIcon = res.myShop.icon_03_03;
const PhoneIcon = res.myShop.icon_03_04;
const QbIcon = res.myShop.dzfhj_03_03;
const MoneyIcon = res.myShop.ccz_03;
const detail_zongti = res.myShop.detail_zongti;
const detail_benci = res.myShop.detail_benci;
const NavLeft = resCommon.button.white_back;

export default class ShopAssistantDetailPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }

    $navigationBarOptions = {
        show: false
    };

    _NavBarRenderRightItem = () => {
        return (<View style={styles.transparentView}>
                <View style={styles.leftBarItemContainer}>

                    <TouchableOpacity onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={NavLeft}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        const { userCode } = this.params;
        SpellShopApi.findUserDetail({ userCode }).then((data) => {
            this.setState({
                userInfo: data.data || {}
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    }

    _renderDescRow = (icon, title, style = { marginBottom: 15 }) => {
        return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
            <Image source={icon}/>
            <Text style={styles.rowTitle} allowFontScaling={false}>{title}</Text>
        </View>;
    };


    // 总体贡献度
    _totalContribution = () => {
        //dealerTotalBonus(店员所有)/storeTotalBonus(店铺所有) 总体贡献度
        let { dealerTotalBonus = 0, storeTotalBonus = 0 } = this.state.userInfo;
        dealerTotalBonus = StringUtils.isNoEmpty(dealerTotalBonus) ? dealerTotalBonus : 0;
        storeTotalBonus = StringUtils.isNoEmpty(storeTotalBonus) ? storeTotalBonus : 0;
        if (dealerTotalBonus === 0 || storeTotalBonus === 0) {
            return '0.00%';
        }
        return `${((dealerTotalBonus / storeTotalBonus) * 100).toFixed(2)}%`;
    };

    // 本次贡献度
    _currContribution = () => {
        //dealerThisTimeBonus(店员本次)/storeThisTimeBonus(店铺本次)
        let { dealerThisTimeBonus = 0, storeThisTimeBonus = 0 } = this.state.userInfo;
        dealerThisTimeBonus = StringUtils.isEmpty(dealerThisTimeBonus) ? 0 : dealerThisTimeBonus;
        storeThisTimeBonus = StringUtils.isEmpty(storeThisTimeBonus) ? 0 : storeThisTimeBonus;
        if (dealerThisTimeBonus === 0 || storeThisTimeBonus === 0) {
            return '0.00%';
        }
        return `${((dealerThisTimeBonus / storeThisTimeBonus) * 100).toFixed(2)}%`;
    };

    _renderRow = (icon, title, desc) => {
        return (<View style={styles.row}>
            <Image style={styles.icon} source={icon}/>
            <Text style={styles.title} allowFontScaling={false}>{title}</Text>
            <Text style={styles.desc} allowFontScaling={false}>{desc}</Text>
        </View>);
    };

    renderSepLine = () => {
        return (<View style={styles.line}/>);
    };


    renderContent = () => {
        const { userInfo } = this.state;
        const { updateTime, dealerTotalBonus, dealerThisTimeBonus } = this.state.userInfo;

        //dealerTotalBonusCount参与店铺分红次数
        //dealerTotalBonus(店员所有) -dealerThisTimeBonus(未分红) 获得分红总额

        return (
            <ScrollView style={{ flex: 1 }}>
                <ImageBackground source={HeaderBarBgImg} style={styles.imgBg}>
                    <View style={{
                        marginTop: ScreenUtils.headerHeight,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <ImageBackground source={RingImg}
                                         style={styles.headerBg}>
                            <UIImage
                                style={styles.headImg}
                                source={{ uri: userInfo.headImg }}
                                borderRadius={34}/>
                        </ImageBackground>
                        <View style={styles.shopInContainer}>
                            {this._renderDescRow(NameIcon, `名称：${userInfo.nickName || ''}`)}
                            {this._renderDescRow(StarIcon, `级别：${userInfo.levelName || ''}`)}
                            {this._renderDescRow(CodeIcon, `授权号：${userInfo.code || ''}`)}
                            {this._renderDescRow(PhoneIcon, `手机号：${userInfo.phone || ''}`, null)}
                        </View>
                    </View>
                </ImageBackground>
                {this._renderRow(QbIcon, '加入店铺时间', updateTime && DateUtils.formatDate(updateTime, 'yyyy年MM月dd日'))}
                {this.renderSepLine()}
                {this._renderRow(MoneyIcon, '共获得奖励总额', `${((dealerTotalBonus || 0) - (dealerThisTimeBonus || 0))}元`)}
                {this.renderSepLine()}
                {this._renderRow(detail_zongti, '总体贡献度', this._totalContribution())}
                {this.renderSepLine()}
                {this._renderRow(detail_benci, '本次贡献值', this._currContribution())}
            </ScrollView>);
    };

    _render() {
        return (
            <View style={styles.container}>
                {this._NavBarRenderRightItem()}
                {this.renderContent()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    transparentView: {
        top: ScreenUtils.statusBarHeight,
        height: 44,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 15,
        right: 15,
        zIndex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 88
    },
    imgBg: {
        width: SCREEN_WIDTH,
        height: ScreenUtils.autoSizeWidth(162) + ScreenUtils.headerHeight,
        marginBottom: 11
    },
    headerBg: {
        marginLeft: 16,
        marginRight: 23,
        width: 105 / 375 * SCREEN_WIDTH,
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headImg: {
        width: 68,
        height: 68
    },
    shopInContainer: {
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center'
    },
    rowTitle: {
        fontSize: 13,
        color: 'white',
        marginLeft: 5
    },
    line: {
        height: StyleSheet.hairlineWidth,
        borderColor: '#fdfcfc'
    },
    row: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    icon: {
        marginLeft: 25
    },
    title: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 4
    },
    desc: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle,
        flex: 1,
        textAlign: 'right',
        marginRight: 21
    }
});
