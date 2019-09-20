//拼店页面，店铺行数据
import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import AvatarImage from '../../../../components/ui/AvatarImage';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';


const StarImg = res.recommendSearch.dj_03;

export default class RecommendRow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    _onPress = () => {
        this.props.RecommendRowOnPress && this.props.RecommendRowOnPress(this.props.RecommendRowItem.storeCode);
    };

    render() {
        const { headUrl, name, userName, level, users, tradeBalanceOfMonth, totalTradeBalance } = this.props.RecommendRowItem;
        /*星星*/
        const starsArr = [];
        if (level && typeof level === 'number') {
            for (let i = 0; i < level; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        return (
            <NoMoreClick style={styles.viewContainer} onPress={this._onPress}>
                <View style={styles.headerViewContainer}>
                    <AvatarImage style={styles.icon} source={{ uri: headUrl || '' }}/>
                    <View style={styles.tittleContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={styles.shopName} numberOfLines={1}>{name || ''}</Text>
                            <View style={styles.starView}>
                                {
                                    starsArr.map((item, index) => {
                                        return <Image key={index} source={StarImg} style={{ width: 16, height: 16 }}/>;
                                    })
                                }
                            </View>
                        </View>
                        <Text style={styles.name} numberOfLines={1}>{`店主: ${userName || ''}`}</Text>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop}>{`${tradeBalanceOfMonth || '0.00'}`}</Text>
                        <Text style={styles.containBottom}>店铺本月销售额</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgb(244,231,221)', width: 1, height: 25 }}/>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop}>{`${totalTradeBalance || '0.00'}`}</Text>
                        <Text style={styles.containBottom}>店铺总计销售额</Text>
                    </View>
                </View>
                <View style={styles.iconView}>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            users.map((item, index) => {
                                return <AvatarImage key={index}
                                                    style={[styles.itemIcon, index === 0 && { marginLeft: 0 }]}
                                                    source={{ uri: item.headImg }}/>;
                            })
                        }
                    </View>
                    <NoMoreClick>
                        <Text>申请加入</Text>
                    </NoMoreClick>
                </View>
            </NoMoreClick>);
    }

}

const styles = StyleSheet.create({
    viewContainer: {
        marginTop: 9, marginHorizontal: 15, backgroundColor: 'white', borderRadius: 10
    },
    headerViewContainer: {
        flexDirection: 'row', marginTop: 10, paddingHorizontal: 15, alignItems: 'center'
    },
    icon: {
        width: 60, height: 60, borderRadius: 30, overflow: 'hidden'
    },
    tittleContainer: {
        marginLeft: 10
    },
    shopName: {
        color: DesignRule.textColor_mainTitle, fontSize: 14
    },
    name: {
        color: DesignRule.textColor_instruction, fontSize: 12, marginTop: 4
    },
    starView: {
        flexDirection: 'row'
    },

    bottomContainer: {
        flexDirection: 'row', alignItems: 'center', marginTop: 15
    },
    moneyContainer: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    },
    containTop: {
        color: DesignRule.textColor_secondTitle, fontSize: 18, fontWeight: '500'
    },
    containBottom: {
        marginTop: 7, color: DesignRule.textColor_instruction, fontSize: 10
    },

    iconView: {
        flexDirection: 'row', marginVertical: 15, marginHorizontal: 15,
        justifyContent: 'space-between', alignItems: 'center'
    },

    itemIcon: {
        width: 32, height: 32, borderRadius: 16, overflow: 'hidden', marginLeft: -15
    }
});

