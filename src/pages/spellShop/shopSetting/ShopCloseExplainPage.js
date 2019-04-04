import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import ScreenUtils from '../../../utils/ScreenUtils';
import SpellShopApi from '../api/SpellShopApi';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import spellStatusModel from '../model/SpellStatusModel';
import StringUtils from '../../../utils/StringUtils';

export class ShopCloseExplainPage extends BasePage {
    $navigationBarOptions = {
        title: '解散说明'
    };

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            storeDissolve: ''
        };
    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState
        };
    };

    _continueBtnAction = () => {
        this.$navigateBack();
    };

    _exitBtnAction = () => {
        SpellShopApi.store_disband().then(() => {
            spellStatusModel.getUser(2);
            this.$navigateBackToStore();
        });
    };

    componentDidMount() {
        SpellShopApi.store_dissolve().then((data) => {
            const { storeDissolve } = data.data || {};
            this.setState({
                storeDissolve,
                loadingState: PageLoadingState.success
            });
        }).catch(() => {
            this.setState({
                loadingState: PageLoadingState.fail
            });
        });
    }

    _render() {
        //tradeBalance本月收入  bonusNeedMoney
        const { userCount, tradeBalance, bonusCount, bonusNeedMoney } = this.params.storeData || {};
        let tradeBalanceS = StringUtils.isEmpty(tradeBalance) ? 0 : parseFloat(tradeBalance);
        let bonusNeedMoneyS = StringUtils.isEmpty(bonusNeedMoney) ? 0 : parseFloat(bonusNeedMoney);
        const storeData = [
            { tittle: '当前店铺人数：', content: `${userCount || 0} 人` },
            { tittle: '当前分红次数：', content: `${bonusCount || 0} 次` },
            { tittle: '待分红销售额：', content: `${tradeBalanceS}/${bonusNeedMoneyS} 元` }
        ];
        const { storeDissolve } = this.state;
        return (
            <View>
                <Text style={[styles.tittleText, { paddingTop: 20 }]}>店铺情况</Text>
                <View style={styles.contentView}>
                    {
                        storeData.map((item, index) => {
                            return (
                                <View>
                                    <Text style={[styles.storeRowText, { marginTop: index === 0 ? 20 : 0 }]}>
                                        {item.tittle}
                                        <Text style={{ marginLeft: 11 }}>{item.content}</Text>
                                    </Text>
                                </View>
                            );
                        })
                    }
                </View>
                <Text style={[styles.tittleText, { paddingTop: 15 }]}>解散说明</Text>
                <View style={styles.contentView}>
                    <Text style={styles.explainText}>{storeDissolve}</Text>
                    <View style={styles.btnContainer}>
                        <NoMoreClick style={styles.btnView}
                                     onPress={this._continueBtnAction}>
                            <Text style={styles.btnText}>继续开店</Text>
                        </NoMoreClick>
                        <NoMoreClick
                            style={[styles.btnView, { backgroundColor: DesignRule.bgColor_grayer, marginLeft: 20 }]}
                            onPress={this._exitBtnAction}>
                            <Text style={[styles.btnText, { color: DesignRule.textColor_instruction }]}>坚持解散</Text>
                        </NoMoreClick>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tittleText: {
        alignSelf: 'center', paddingBottom: 10,
        color: DesignRule.textColor_mainTitle, fontSize: 17, fontWeight: 'bold'
    },
    contentView: {
        marginHorizontal: 15,
        borderRadius: 5, backgroundColor: DesignRule.white
    },
    storeRowText: {
        color: DesignRule.textColor_1f2d3d, fontSize: 12,
        paddingBottom: 20, marginHorizontal: 15
    },
    explainText: {
        paddingTop: 12, marginHorizontal: 15, lineHeight: 30,
        color: DesignRule.textColor_1f2d3d, fontSize: 12
    },

    btnContainer: {
        justifyContent: 'center', flexDirection: 'row', marginTop: ScreenUtils.px2dp(30), marginBottom: 20
    },
    btnView: {
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 20, height: 40, width: ScreenUtils.px2dp(140), backgroundColor: DesignRule.mainColor
    },
    btnText: {
        fontSize: 15, color: DesignRule.white
    }
});

export default ShopCloseExplainPage;
