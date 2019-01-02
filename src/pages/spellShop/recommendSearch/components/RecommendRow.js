//拼店页面，店铺行数据
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import StringUtils from '../../../../utils/StringUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import ImageLoad from '@mr/image-placeholder';
import {
    MRText as Text
} from '../../../../components/ui';


const StarImg = res.recommendSearch.dj_03;

export default class RecommendRow extends Component {

    static propTypes = {
        RecommendRowItem: PropTypes.object,
        RecommendRowOnPress: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    renderIconItem = ({ item }) => {
        return (<TouchableOpacity onPress={() => {
        }} style={[styles.itemIcon, { marginLeft: 15 }]}>
            {StringUtils.isNoEmpty(item.headImg) ?
                <ImageLoad style={styles.itemIcon} source={{ uri: item.headImg }} borderRadius={20}/> :
                <View style={[styles.itemIcon, { backgroundColor: DesignRule.lineColor_inColorBg }]}/>}
        </TouchableOpacity>);
    };
    _onPress = () => {
        this.props.RecommendRowOnPress && this.props.RecommendRowOnPress(this.props.RecommendRowItem.storeNumber);
    };

    render() {
        const { ...RecommendRowItem } = this.props.RecommendRowItem;
        //bonusNeedMoney总额 tradeBalance本月收入 totalTradeBalance累计收入
        let { storeUserList, tradeBalance, bonusNeedMoney, totalTradeBalance } = RecommendRowItem;
        let tradeBalanceS = StringUtils.isEmpty(tradeBalance) ? 0 : parseFloat(tradeBalance);
        bonusNeedMoney = StringUtils.isEmpty(bonusNeedMoney) ? 0 : parseFloat(bonusNeedMoney);
        let progress = bonusNeedMoney === 0 ? 0.00 : ((tradeBalanceS / bonusNeedMoney) * 100).toFixed(2);
        let widthScale = bonusNeedMoney === 0 ? 0 : ((tradeBalanceS / bonusNeedMoney > 1) ? 1 : tradeBalanceS / bonusNeedMoney);
        const storeStar = RecommendRowItem.storeStarId;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return (<TouchableWithoutFeedback style={styles.container} onPress={this._onPress}>

            <View style={styles.viewContainer}>
                <View style={styles.topViewContainer}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerViewContainer}>
                            {StringUtils.isNoEmpty(RecommendRowItem.headUrl) ? <ImageLoad style={styles.icon}
                                                                                          borderRadius={25}
                                                                                          source={{ uri: RecommendRowItem.headUrl }}/> :
                                <View style={[styles.icon, { backgroundColor: DesignRule.lineColor_inColorBg }]}/>}
                            <View style={styles.tittleContainer}>
                                <Text style={styles.name} numberOfLines={1} allowFontScaling={false}>{RecommendRowItem.name || ''}</Text>
                                <Text style={styles.member}
                                      numberOfLines={1} allowFontScaling={false}>{`店主: ${RecommendRowItem.storeUserName || ''}`}</Text>
                            </View>
                        </View>
                        <FlatList
                            style={styles.midFlatList}
                            data={storeUserList}
                            keyExtractor={(item) => item.id + ''}
                            renderItem={this.renderIconItem}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            initialNumToRender={5}
                        />
                        <View style={{
                            backgroundColor: DesignRule.lineColor_inWhiteBg, alignSelf: 'center', flexDirection: 'row',
                            width: ScreenUtils.autoSizeWidth(200), height: 5, marginTop: 6,
                            borderRadius: 2, overflow: 'hidden'
                        }}>
                            <View style={{
                                width: widthScale * ScreenUtils.autoSizeWidth(200),
                                backgroundColor: DesignRule.bgColor_btn
                            }}/>
                        </View>
                        <Text style={{
                            marginTop: 8, marginBottom: 11, paddingHorizontal: 15,
                            color: DesignRule.textColor_secondTitle, fontSize: 10
                        }} allowFontScaling={false}>奖励任务完成度<Text style={{ color: DesignRule.mainColor }}>{progress}%</Text></Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: 'rgb(244,231,221)' }}/>
                    <View style={{
                        width: ScreenUtils.autoSizeWidth(44 + 70),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                starsArr.map((item, index) => {
                                    return <Image key={index} source={StarImg}/>;
                                })
                            }
                        </View>
                        <Text style={{ marginTop: 9, color: '#939393', fontSize: 12 }} allowFontScaling={false}>店铺等级</Text>
                        <TouchableOpacity style={styles.joinBtn} onPress={() => {
                            this._onPress();
                        }}>
                            <Text style={styles.joinText} allowFontScaling={false}>+申请加入</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.bottomContainer}>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop} allowFontScaling={false}>店铺成员</Text>
                        <Text style={styles.containBottom} allowFontScaling={false}>{RecommendRowItem.storeUserNum || ''}</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgb(244,231,221)', width: 1, height: 25 }}/>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop} allowFontScaling={false}>店铺本月收入</Text>
                        <Text style={styles.containBottom} allowFontScaling={false}>{`${tradeBalance || '0.00'}元`}</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgb(244,231,221)', width: 1, height: 25 }}/>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop} allowFontScaling={false}>店铺累计收入</Text>
                        <Text style={styles.containBottom} allowFontScaling={false}>{`${totalTradeBalance || '0.00'}元`}</Text>
                    </View>
                </View>

            </View>
        </TouchableWithoutFeedback>);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: ScreenUtils.width
    },
    viewContainer: {
        marginTop: 9,
        marginHorizontal: 15,
        backgroundColor: 'white'
    },

    topViewContainer: {
        backgroundColor: '#FEFAF7',
        flexDirection: 'row'
    },


    headerViewContainer: {
        flexDirection: 'row',
        height: 44,
        marginTop: 15,
        paddingHorizontal: 15
    },
    icon: {
        width: 50,
        height: 50
    },
    tittleContainer: {
        justifyContent: 'center',
        marginLeft: 11,
        flex: 1
    },
    name: {
        color: DesignRule.textColor_mainTitle,
        fontSize: 14
    },
    member: {
        marginTop: 9,
        color: DesignRule.textColor_instruction,
        fontSize: 11
    },
    joinBtn: {
        marginTop: 17,
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        borderRadius: 10,
        backgroundColor: DesignRule.bgColor_btn
    },
    joinText: {
        fontFamily: 'PingFangSC-Medium',
        color: 'white',
        fontSize: 10,
        paddingHorizontal: 8
    },

    midFlatList: {
        marginTop: 17
    },
    itemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20
    },

    bottomContainer: {
        flexDirection: 'row',
        height: 63,
        alignItems: 'center'
    },
    moneyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containTop: {
        fontFamily: 'PingFangSC-Light',
        color: DesignRule.textColor_secondTitle,
        fontSize: 10
    },
    containBottom: {
        fontFamily: 'PingFangSC-Medium',
        marginTop: 7,
        color: DesignRule.textColor_secondTitle,
        fontSize: 11
    }


});

