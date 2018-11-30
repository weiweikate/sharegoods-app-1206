//开店页面
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
//source
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';
import DesignRule from 'DesignRule';
import apiEnvironment from '../../../api/ApiEnvironment';
import SpellShopApi from '../api/SpellShopApi';
import spellStatusModel from '../model/SpellStatusModel';
import res from '../res';

const { openShop_yes, openShop_no } = res.openShop;

export default class OpenShopExplainPage extends BasePage {


    $navigationBarOptions = {
        title: '开店'
    };

    state = { isSelected: true };

    _onPress = () => {
        this.$navigate('HtmlPage', {
            title: '拼店管理条例',
            uri: `${apiEnvironment.getCurrentH5Url()}/static/protocol/pindian.html`
        });
    };

    _clickOpen = () => {
        if (!this.state.isSelected) {
            this.$toastShow('请阅读同意《拼店管理条例》');
            return;
        }
        SpellShopApi.depositTest().then(() => {
            spellStatusModel.getUser(2);
            this.$navigate('spellShop/shopSetting/SetShopNamePage');
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    _renderRow = (title, index, maxIndex) => {
        return (
            <View style={{ width: ScreenUtils.width }} key={index}>

                <View style={{ marginHorizontal: ScreenUtils.autoSizeWidth(30) }}>

                    {/*内容间距view*/}
                    {index !== 0 ?
                        <View style={{
                            marginLeft: 8,
                            width: 2,
                            backgroundColor: DesignRule.mainColor,
                            height: ScreenUtils.autoSizeWidth(42)
                        }}/> : null}

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <View style={styles.circle}>
                                <Text style={styles.circleText}>{index + 1}</Text>
                            </View>
                            {index !== maxIndex - 1 ?
                                <View style={{
                                    marginLeft: 8,
                                    width: 2,
                                    backgroundColor: DesignRule.mainColor,
                                    flex: 1
                                }}/> : null}
                        </View>

                        <View style={styles.desc}>
                            <Text style={{
                                marginRight: 0,
                                fontSize: 13,
                                color: DesignRule.textColor_mainTitle
                            }}>{title}</Text>
                        </View>
                    </View>
                </View>

            </View>

        );
    };

    _render() {

        const arr = [
            '开店要求：会员等级到达V4，即可发起拼店，店员人数达到3人可成功开启1星店铺；',
            '店长权益： 开启拼店，除日常商品推广奖励，还可获得品牌推广奖励，以及店铺管理奖励；',
            '店长职责：店主作为发起者，需维护好店铺及店铺成员之间的关系，管理好店铺；',
            '店铺分为3个等级：1星、2星、3星店铺，级别越高，店长分红就越高。'
        ];

        return (
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{
                        alignSelf: 'center',
                        marginTop: 41,
                        fontSize: 17,
                        color: DesignRule.textColor_mainTitle
                    }}>拼店规则说明</Text>
                    <View style={{ marginTop: 32 }}>
                        {
                            arr.map((item, index) => {
                                return this._renderRow(item, index, arr.length);
                            })
                        }
                    </View>
                    <View style={{
                        alignItems: 'center',
                        marginTop: ScreenUtils.autoSizeHeight(70)
                    }}>
                        <TouchableOpacity activeOpacity={0.5} onPress={this._clickOpen} style={styles.btnStyle}>
                            <Text style={{
                                fontSize: 17,
                                color: 'white'
                            }}>我要开店</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={styles.explainContainer}>
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            isSelected: !this.state.isSelected
                        });
                    }}>
                        <Image source={this.state.isSelected ? openShop_yes : openShop_no}/>
                    </TouchableOpacity>
                    <Text style={styles.descText}>阅读同意</Text>
                    <TouchableOpacity onPress={this._onPress}>
                        <Text style={[styles.descText, { color: DesignRule.mainColor }]}>《拼店管理条例》</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    circle: {
        width: 18,
        height: 18,
        backgroundColor: DesignRule.mainColor,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9
    },
    circleText: {
        fontSize: 12,
        color: 'white'
    },
    desc: {
        marginLeft: 8,
        flex: 1
    },
    btnStyle: {
        width: ScreenUtils.autoSizeWidth(260),
        height: 48,
        borderRadius: 25,
        backgroundColor: DesignRule.mainColor,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },

    explainContainer: {
        flexDirection: 'row',
        marginBottom: ScreenUtils.safeBottom + 20,
        justifyContent: 'center',
        alignItems: 'center'
    },

    descText: {
        marginLeft: 5,
        paddingVertical: 10,
        fontSize: 11,
        color: DesignRule.textColor_instruction,
        textAlign: 'center'
    }
});
