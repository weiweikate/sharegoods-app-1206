//店员详情页面
import React from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    RefreshControl,
    ImageBackground
} from 'react-native';
//Source
const SCREEN_WIDTH = Dimensions.get('window').width;
import HeaderBarBgImg from './res/txbg_02.png';
import RingImg from './res/headBg.png';
import RmbIcon from './res/zje_11.png';
import ZuanIcon from './res/cs_12.png';
import MoneyIcon from './res/fhje_14.png';
import QbIcon from './res/dzfhj_03-03.png';
//icon
import NameIcon from './res/icon_03.png';
import StarIcon from './res/icon_03-02.png';
import CodeIcon from './res/icon_03-03.png';
import PhoneIcon from './res/icon_03-04.png';
import BasePage from '../../../BasePage';
import DateUtils from '../../../utils/DateUtils';
import SpellShopApi from '../api/SpellShopApi';
import DesignRule from 'DesignRule';

export default class ShopAssistantDetailPage extends BasePage {

    $navigationBarOptions = {
        title: '店员详情'
    };

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        const { userId } = this.params;
        SpellShopApi.findUserDetail({ userId }).then((data) => {
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
            <Text style={styles.rowTitle}>{title}</Text>
        </View>;
    };


    // 总体贡献度
    _totalContribution = (storeBonusDto) => {
        //dealerTotalBonus(店员所有)/storeTotalBonus(店铺所有) 总体贡献度
        const { dealerTotalBonus = 0, storeTotalBonus = 0 } = this.state.userInfo;
        if (storeTotalBonus === 0) {
            return '0%';
        }
        return `${((dealerTotalBonus / storeTotalBonus) * 100).toFixed(2)}%`;
    };

    // 本次贡献度
    _currContribution = (storeBonusDto) => {
        //dealerThisTimeBonus(店员本次)/storeThisTimeBonus(店铺本次)
        const { dealerThisTimeBonus = 0, storeThisTimeBonus = 0 } = this.state.userInfo;
        if (storeThisTimeBonus === 0) {
            return '0%';
        }
        return `${((dealerThisTimeBonus / storeThisTimeBonus) * 100).toFixed(2)}%`;
    };

    _renderRow = (icon, title, desc) => {
        return (<View style={styles.row}>
            <Image style={styles.icon} source={icon}/>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>{desc}</Text>
        </View>);
    };

    renderSepLine = () => {
        return (<View style={styles.line}/>);
    };


    renderContent = () => {
        const { userInfo } = this.state;
        const headerWidth = 65 / 375 * SCREEN_WIDTH;

        const { updateTime, dealerTotalBonusCount, dealerTotalBonus, dealerThisTimeBonus } = this.state.userInfo;

        //dealerTotalBonusCount参与店铺分红次数
        //dealerTotalBonus(店员所有) -dealerThisTimeBonus(未分红) 获得分红总额

        return (<ScrollView style={{ flex: 1 }}
                            refreshControl={<RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />}>
            <ImageBackground source={HeaderBarBgImg} style={styles.imgBg}>
                <ImageBackground source={RingImg}
                                 style={styles.headerBg}>
                    {
                        userInfo.headImg ?
                            <Image style={{ width: headerWidth, height: headerWidth, borderRadius: headerWidth / 2 }}
                                   source={{ uri: userInfo.headImg }}/> : null
                    }
                </ImageBackground>
                <View style={styles.shopInContainer}>
                    {this._renderDescRow(NameIcon, `名称：${userInfo.nickName || ''}`)}
                    {this._renderDescRow(StarIcon, `级别：${userInfo.levelName || ''}`)}
                    {this._renderDescRow(CodeIcon, `授权号：${userInfo.code || ''}`)}
                    {this._renderDescRow(PhoneIcon, `手机号：${userInfo.phone || ''}`, null)}
                </View>
            </ImageBackground>
            {this._renderRow(RmbIcon, '加入店铺时间', DateUtils.formatDate(updateTime, 'yyyy-MM-dd'))}
            {this.renderSepLine()}
            {this._renderRow(ZuanIcon, '参与店铺分红次数', `${dealerTotalBonusCount || 0}次`)}
            {this.renderSepLine()}
            {this._renderRow(MoneyIcon, '共获得分红总额', `${((dealerTotalBonus || 0) - (dealerThisTimeBonus || 0))}元`)}
            {this.renderSepLine()}
            {this._renderRow(QbIcon, '总体贡献度', this._totalContribution())}
            {this.renderSepLine()}
            {this._renderRow(MoneyIcon, '本次贡献值', this._currContribution())}
        </ScrollView>);
    };

    _render() {
        return (
            <View style={styles.container}>
                {this.renderContent()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imgBg: {
        width: SCREEN_WIDTH,
        height: 182 / 375 * SCREEN_WIDTH,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerBg: {
        marginLeft: 16,
        marginRight: 23,
        width: 105 / 375 * SCREEN_WIDTH,
        height: 105 / 375 * SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
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
