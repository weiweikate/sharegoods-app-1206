//店长才可以使用的店铺设置页面
import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback, Alert
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

const ArrowImg = res.shopSetting.xjt_03;

export default class ShopPageSettingPage extends BasePage {

    $navigationBarOptions = {
        title: '我的店铺'
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
            storeData: this.state.storeData,
            myShopCallBack: this.params.myShopCallBack
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

    // 店铺评分
    _scoreShop = () => {
        this.$navigate('store/shopSetting/ShopScorePage', { storeData: this.state.storeData });
    };

    _closeStore = () => {
        Alert.alert('提示', '确认解散该店铺吗？',
            [
                {
                    text: '取消', onPress: () => {
                    }
                },
                {
                    text: '确定', onPress: () => {
                        SpellShopApi.app_store_close().then(() => {
                            spellStatusModel.requestHome();
                            this.$navigateBackToStore();
                        }).catch(e => this.$toastShow(e.msg));
                    }
                }
            ]
        );
    };

    _render() {
        const { buildTime } = this.params.storeData || {};
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {
                        [{
                            key: '店铺管理',
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
                            key: '店铺评分',
                            showArrow: true,
                            onPres: this._scoreShop
                        }, {
                            key: '店铺成立时间',
                            showArrow: false,
                            value: buildTime || ''
                        }].map((item, index) => {
                            return this.renderRow(item, index);
                        })
                    }
                </ScrollView>
                <NoMoreClick style={styles.closeStore} onPress={this._closeStore}>
                    <Text style={styles.closeText}>申请解散</Text>
                </NoMoreClick>
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

    closeStore: {
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', left: 15, right: 15, bottom: ScreenUtils.safeBottom + 15,
        height: 40, borderRadius: 20, borderColor: DesignRule.mainColor, borderWidth: 1
    },
    closeText: {
        fontSize: 17, color: DesignRule.mainColor
    }
});
