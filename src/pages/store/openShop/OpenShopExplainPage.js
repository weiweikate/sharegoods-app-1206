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
import res from '../res';
import { MRText as Text } from '../../../components/ui';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import RouterMap from '../../../navigation/RouterMap';
import bridge from '../../../utils/bridge';
import { BannersVerticalView } from '../../../comm/components/BannersVerticalView';
import HomeAPI from '../../home/api/HomeAPI';
import { homeType } from '../../home/HomeTypes';
import LinearGradient from 'react-native-linear-gradient';

const { openShop_yes, openShop_no } = res.openShop;

export default class OpenShopExplainPage extends BasePage {

    state = {
        pageState: PageLoadingState.loading,
        isSelected: true,
        netFailedInfo: {},
        data: []
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
        HomeAPI.getHomeData({ type: homeType.store29 }).then((data) => {
            this.setState({
                data: data.data,
                pageState: PageLoadingState.success
            });
        }).catch(() => {
            this.setState({
                pageState: PageLoadingState.fail
            });
        });
    };

    _onPress = () => {
        this.$navigate(RouterMap.HtmlPage, {
            title: '拼店管理条例',
            uri: `${apiEnvironment.getCurrentH5Url()}/static/protocol/pindian.html`
        });
    };

    _clickOpen = () => {
        if (!this.state.isSelected) {
            this.$toastShow('请阅读同意《拼店管理条例》');
            return;
        }

        Alert.alert('提示', '请您确认是否创建拼店，创建拼店后则进入店铺招募同时无法加入其他拼店，需关闭招募店铺才可以加入其他拼店',
            [
                {
                    text: '确认开店', onPress: () => {
                        bridge.showLoading();
                        SpellShopApi.checkQualificationOpenStore().then((data) => {
                            bridge.hiddenLoading();
                            if (data.data) {
                                this.$navigate('store/shopSetting/SetShopNamePage', { isSplit: this.params.isSplit });
                            }
                        }).catch((error) => {
                            bridge.hiddenLoading();
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
                    <BannersVerticalView style={{ marginBottom: 0 }} bannerList={data}
                                         ImgWidth={ScreenUtils.width - 30}/>
                </ScrollView>
                <NoMoreClick onPress={this._clickOpen}>
                    <LinearGradient style={styles.btnStyle}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <Text style={styles.btnText}>我要开店</Text>
                    </LinearGradient>
                </NoMoreClick>
                <View style={styles.explainContainer}>
                    <NoMoreClick onPress={() => {
                        this.setState({
                            isSelected: !isSelected
                        });
                    }}>
                        <Image source={isSelected ? openShop_yes : openShop_no} style={{ width: 12, height: 12 }}/>
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
        width: ScreenUtils.autoSizeWidth(345), height: 40, borderRadius: 22, backgroundColor: DesignRule.mainColor
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
