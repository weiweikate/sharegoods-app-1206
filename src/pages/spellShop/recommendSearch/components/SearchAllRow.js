//拼店页面，店铺行数据
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import StarImg from '../src/dj_03.png';
import DesignRule from 'DesignRule';

export default class RecommendRow extends Component {

    static propTypes = {
        RecommendRowItem: PropTypes.object,
        RecommendRowOnPress: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    _onPress = () => {
        this.props.RecommendRowOnPress && this.props.RecommendRowOnPress(this.props.RecommendRowItem);
    };

    render() {
        const { ...RecommendRowItem } = this.props.RecommendRowItem;
        //bonusNeedMoney总额 tradeBalance本月收入 totalTradeBalance累计收入
        const { tradeBalance = 0, bonusNeedMoney = 0, totalTradeBalance = 0 } = RecommendRowItem;
        let widthScale = bonusNeedMoney === 0 ? 0 : ((tradeBalance / bonusNeedMoney > 1) ? 1 : tradeBalance / bonusNeedMoney);
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
                            {RecommendRowItem.headUrl ? <Image style={styles.icon}
                                                               source={{ uri: RecommendRowItem.headUrl || '' }}/> :
                                <View style={styles.icon}/>}
                            <View style={styles.tittleContainer}>
                                <Text style={styles.name}>{RecommendRowItem.name || ''}</Text>
                                <Text style={styles.member}>{`店主: ${RecommendRowItem.storeUserName || ''}`}</Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row', alignSelf: 'center',
                            width: ScreenUtils.autoSizeWidth(200), height: 5, marginTop:15,
                            borderRadius: 2, borderWidth: 0.5, borderColor: DesignRule.bgColor_btn
                        }}>
                            <View style={{
                                width: widthScale * ScreenUtils.autoSizeWidth(200),
                                backgroundColor: DesignRule.bgColor_btn
                            }}/>
                        </View>
                        <Text style={{
                            marginTop: 8, marginBottom: 14.5, paddingHorizontal: 21.5,
                            color: DesignRule.textColor_secondTitle, fontSize: 10
                        }}>{`距离下一次分红还差${(bonusNeedMoney - tradeBalance > 0) ? (bonusNeedMoney - tradeBalance) : 0}元`}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: 'rgb(244,231,221)' }}/>
                    <View style={{ width: 44 + 70, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                starsArr.map((item, index) => {
                                    return <Image key={index} source={StarImg}/>;
                                })
                            }
                        </View>
                        <Text style={{ marginTop: 9, color: '#939393', fontSize: 14 }}>店铺等级</Text>
                        <TouchableOpacity style={styles.joinBtn} onPress={() => {
                            this._onPress();
                        }}>
                            <Text style={styles.joinText}>+加入我们</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.bottomContainer}>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop}>店铺成员</Text>
                        <Text style={styles.containBottom}>{RecommendRowItem.storeUserNum || 0}</Text>
                    </View>
                    <View style={{ backgroundColor: 'rgb(244,231,221)', width: 1, height: 25 }}/>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.containTop}>店铺累计收入</Text>
                        <Text style={styles.containBottom}>{`${totalTradeBalance}元`}</Text>
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
        marginTop: 15,
        paddingHorizontal: 15
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: DesignRule.lineColor_inColorBg,
        borderRadius: 25
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
        height: 22,
        borderRadius: 11,
        backgroundColor: DesignRule.bgColor_btn
    },
    joinText: {
        fontFamily: 'PingFangSC-Medium',
        color: 'white',
        fontSize: 12,
        paddingHorizontal: 8
    },
    itemIcon: {
        backgroundColor: DesignRule.lineColor_inColorBg,
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

