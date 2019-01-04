//开店页面
import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
//source
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import apiEnvironment from '../../../api/ApiEnvironment';
import SpellShopApi from '../api/SpellShopApi';
import spellStatusModel from '../model/SpellStatusModel';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';


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

        Alert.alert('提示', `请您确认是否创建拼店，创建拼店后则进入店铺招募同时无法加入其他拼店，需关闭招募店铺才可以加入其他拼店`,
            [
                {
                    text: '确认开店', onPress: () => {
                        SpellShopApi.depositTest().then(() => {
                            spellStatusModel.getUser(2);
                            this.$navigate('spellShop/shopSetting/SetShopNamePage');
                        }).catch((error) => {
                            this.$toastShow(error.msg);
                        });
                    }
                },
                {
                    text: '取消开店', onPress: () => {
                    }
                }
            ]
        );
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
                                <Text style={styles.circleText} allowFontScaling={false}>{index + 1}</Text>
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
                            }} allowFontScaling={false}>{title}</Text>
                        </View>
                    </View>
                </View>

            </View>

        );
    };

    _render() {

        const arr = [
            '升级会员等级到V4（达人品鉴官）',
            '发起拼店',
            '店员人数达到5人（包括店主）',
            '成功开启店铺，招募更多店员',
            '联合店员共同完成目标，取得品牌奖励',
            '店铺分为3个等级（普通店、导师店、大咖店），每个级别的店铺权益不同，等级越高，享受的权益越多。'
        ];

        return (
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{
                        alignSelf: 'center',
                        marginTop: 41,
                        fontSize: 17,
                        color: DesignRule.textColor_mainTitle
                    }} allowFontScaling={false}>拼店规则说明</Text>
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
                            }} allowFontScaling={false}>我要开店</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.explainContainer}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                isSelected: !this.state.isSelected
                            });
                        }}>
                            <Image source={this.state.isSelected ? openShop_yes : openShop_no}/>
                        </TouchableOpacity>
                        <Text style={styles.descText} allowFontScaling={false}>阅读同意</Text>
                        <TouchableOpacity onPress={this._onPress}>
                            <Text style={[styles.descText, { color: DesignRule.mainColor }]}
                                  allowFontScaling={false}>《拼店管理条例》</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

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
        marginTop: 8,
        flexDirection: 'row',
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
