//店长才可以使用的店铺设置页面
import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import SpellShopApi from '../api/SpellShopApi';
import spellStatusModel from '../SpellStatusModel';
import apiEnvironment from '../../../api/ApiEnvironment';
import RouterMap from '../../../navigation/RouterMap';
import LinearGradient from 'react-native-linear-gradient';
import CommModal from '../../../comm/components/CommModal';

const ArrowImg = res.shopSetting.xjt_03;
const { shopCloseAlert } = res.shopSetting;

export default class ShopPageSettingPage extends BasePage {

    $navigationBarOptions = {
        title: '店铺管理'
    };

    constructor(props) {
        super(props);
        this.state = {
            storeData: this.params.storeData
        };
    }

    // 店铺管理
    _managerShop = () => {
        this.$navigate('store/shopSetting/SetShopNamePage', {
            storeData: this.state.storeData
        });
    };

    // 公告管理
    _assistantManager = () => {
        //公告管理可以对公告进行删除
        //异常：店长才可以进行删除
        this.$navigate('store/shopSetting/AnnouncementListPage', { storeData: this.state.storeData });
    };

    _addCapacityHistory = () => {
        this.$navigate('store/addCapacity/AddCapacityHistoryPage', { storeData: this.state.storeData });
    };

    _tutor = () => {
        const uri = apiEnvironment.getCurrentH5Url() + '/spellStore/tutor/list';
        this.$navigate(RouterMap.HtmlPage, {
            uri: uri
        });
    };

    _closeStore = () => {
        this.CloseShopModal.show(() => {
            SpellShopApi.app_store_close().then(() => {
                spellStatusModel.requestHome();
                this.$navigateBackToStore();
            }).catch(e => this.$toastShow(e.msg));
        });
    };

    _render() {
        const { buildTime } = this.params.storeData || {};
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {
                        [{
                            key: '店铺信息',
                            showArrow: true,
                            onPres: this._managerShop
                        }, {
                            key: '公告管理',
                            showArrow: true,
                            onPres: this._assistantManager
                        }, {
                            key: '我的扩容',
                            showArrow: true,
                            onPres: this._addCapacityHistory
                        }, {
                            key: '导师管理',
                            showArrow: true,
                            onPres: this._tutor
                        }, {
                            key: '店铺成立时间',
                            showArrow: false,
                            value: buildTime || ''
                        }].map((item, index) => {
                            return this.renderRow(item, index);
                        })
                    }
                </ScrollView>

                <LinearGradient style={styles.alertView}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FC5D39', '#FF0050']}>
                    <Text style={styles.alertText}>温馨提示：</Text>
                    <Text style={styles.alertText1}>关闭店铺后，90天后您才能创建新店、拆分开新店</Text>
                </LinearGradient>
                <View style={styles.alertS}/>
                <NoMoreClick style={styles.closeStore} onPress={this._closeStore}>
                    <Text style={styles.closeText}>关闭店铺</Text>
                </NoMoreClick>
                <CloseShopModal ref={(ref) => {
                    this.CloseShopModal = ref;
                }}/>
            </View>
        );
    }

    renderRow = ({ key, value, showArrow, onPres }, index) => {
        return (<TouchableWithoutFeedback key={index} onPress={onPres}>
            <View style={[styles.row, { marginTop: index === 0 ? 10 : 0 }]}>
                <View style={styles.rowTop}>
                    <Text style={styles.text}>{key}</Text>
                    {
                        showArrow ?
                            <Image source={ArrowImg} style={{ width: 10, height: 10 }}/> :
                            <Text style={styles.desc}>{value || ''}</Text>
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        height: 44,
        justifyContent: 'center',
        backgroundColor: DesignRule.white
    },
    rowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    text: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    desc: {
        fontSize: 13,
        color: DesignRule.textColor_secondTitle
    },

    alertView: {
        borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15
    },

    alertText: {
        paddingHorizontal: 15, fontSize: 14, color: 'white', paddingTop: 10, fontWeight: '500'
    },

    alertText1: {
        paddingHorizontal: 15, fontSize: 14, color: 'white', paddingBottom: 10
    },

    alertS: {
        width: 10, height: 10, borderColor: 'transparent', borderWidth: 10, alignSelf: 'center',
        borderTopColor: '#FD2E44'
    },

    closeStore: {
        justifyContent: 'center', alignItems: 'center',
        marginBottom: ScreenUtils.safeBottom + 15, marginHorizontal: 15,
        height: 40, borderRadius: 20, borderColor: '#999999', borderWidth: 0.5
    },
    closeText: {
        fontSize: 16, color: DesignRule.textColor_instruction, fontWeight: '500'
    }
});

class CloseShopModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            callBack: null
        };
    }

    show = (callBack) => {
        this.setState({
            modalVisible: true,
            callBack
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}>
                <View style={stylesM.container}>
                    <Image style={stylesM.img} source={shopCloseAlert}/>
                    <Text style={stylesM.titleText}>确定关闭您的店铺吗？</Text>
                    <Text style={stylesM.contentText}>
                        关闭店铺后，
                        <Text style={stylesM.contentText1}>90天</Text>
                        后您才能创建新店、拆分开新店。
                    </Text>
                    <View style={stylesM.btnView}>
                        <NoMoreClick style={stylesM.btnL} onPress={() => {
                            this.setState({
                                modalVisible: false
                            }, () => {
                                this.state.callBack && this.state.callBack();
                            });
                        }}>
                            <Text style={stylesM.btnTextL}>确定关店</Text>
                        </NoMoreClick>
                        <NoMoreClick onPress={this._close}>
                            <LinearGradient style={stylesM.btnR}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['#FC5D39', '#FF0050']}>
                                <Text style={stylesM.btnTextR}>再想想</Text>
                            </LinearGradient>
                        </NoMoreClick>
                    </View>
                </View>
            </CommModal>
        );
    }
}

const stylesM = StyleSheet.create({
    container: {
        width: ScreenUtils.px2dp(240), borderRadius: 15, backgroundColor: 'white', alignItems: 'center'
    },
    img: {
        width: 27, height: 27, marginTop: 15, marginBottom: 10
    },
    titleText: {
        color: DesignRule.textColor_mainTitle, fontSize: 15, fontWeight: '500', marginBottom: 10
    },
    contentText: {
        color: DesignRule.textColor_mainTitle, fontSize: 13, marginBottom: 20, paddingHorizontal: ScreenUtils.px2dp(25)
    },
    contentText1: {
        color: DesignRule.mainColor, fontSize: 14
    },
    btnView: {
        flexDirection: 'row', marginBottom: 20
    },
    btnL: {
        width: ScreenUtils.px2dp(92),
        height: 34,
        borderRadius: 17,
        borderWidth: 0.5,
        borderColor: DesignRule.textColor_instruction,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ScreenUtils.px2dp(16)
    },
    btnR: {
        width: ScreenUtils.px2dp(92), height: 34, borderRadius: 17,
        justifyContent: 'center', alignItems: 'center'
    },
    btnTextL: {
        color: DesignRule.textColor_instruction, fontSize: 15
    },
    btnTextR: {
        color: 'white', fontSize: 15
    }
});
