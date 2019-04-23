//开店页面
import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
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
import HTML from 'react-native-render-html';
import res from '../res';
import { MRText as Text } from '../../../components/ui';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import NoMoreClick from '../../../components/ui/NoMoreClick';


const { openShop_yes, openShop_no } = res.openShop;

export default class OpenShopExplainPage extends BasePage {

    state = {
        pageState: PageLoadingState.loading,
        isSelected: true,
        netFailedInfo: {},
        data: null
    };

    $navigationBarOptions = {
        title: '拼店权益'
    };

    $getPageStateOptions = () => {
        const { netFailedInfo, pageState } = this.state;
        return {
            loadingState: pageState,
            netFailedProps: {
                netFailedInfo: netFailedInfo,
                reloadBtnClick: () => {
                    this.setState({
                        pageState: PageLoadingState.loading
                    }, this._openStore());
                }
            }
        };
    };

    componentDidMount() {
        this._openStore();
    }

    _openStore = () => {
        SpellShopApi.store_openStore().then((data) => {
            this.setState({
                data: data.data,
                pageState: PageLoadingState.success
            });
        }).catch((e) => {
            this.setState({
                pageState: PageLoadingState.fail
            });
        });
    };

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


    _render() {
        const { data, isSelected } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.scrollView}>
                    <HTML html={data}
                          imagesMaxWidth={ScreenUtils.width - 30}
                          imagesInitialDimensions={{ width: ScreenUtils.width - 30, height: 0 }}
                          containerStyle={{ backgroundColor: '#fff' }}/>
                </ScrollView>
                <NoMoreClick onPress={this._clickOpen} style={styles.btnStyle}>
                    <Text style={styles.btnText}>我要开店</Text>
                </NoMoreClick>
                <View style={styles.explainContainer}>
                    <NoMoreClick onPress={() => {
                        this.setState({
                            isSelected: !isSelected
                        });
                    }}>
                        <Image source={isSelected ? openShop_yes : openShop_no}/>
                    </NoMoreClick>
                    <Text style={styles.descText}>点击我要开店则默认同意杭州名融网络有限公司<Text
                        style={{ color: DesignRule.mainColor }} onPress={this._onPress}>《拼店管理条例》</Text></Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 15, marginTop: 10, borderRadius: 5
    },
    btnStyle: {
        justifyContent: 'center', alignItems: 'center', marginTop: 20, alignSelf: 'center',
        width: ScreenUtils.autoSizeWidth(260), height: 44, borderRadius: 22, backgroundColor: DesignRule.mainColor
    },
    btnText: {
        fontSize: 17, color: 'white'
    },

    explainContainer: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        marginTop: 8, marginBottom: ScreenUtils.safeBottom + 20, marginHorizontal: 15
    },

    descText: {
        marginLeft: 8,
        fontSize: 10, color: DesignRule.textColor_secondTitle
    }
});
