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
import DateUtils from '../../../utils/DateUtils';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import RouterMap from '../../../navigation/RouterMap';

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
        //店铺管理是修改店铺的基础信息并保存在店铺中显示
        //异常：仅店长才能修改此功能
        this.$navigate('spellShop/shopSetting/SetShopNamePage', {
            storeData: this.state.storeData,
            myShopCallBack: this.params.myShopCallBack
        });
    };

    // 邀请设置
    _inviteSetting = () => {
        //店铺邀请会有几种条件在里面，设置某种条件就会有对应的条件设置才能邀请进来
        //异常：通过条件才能进入到店铺
        this.$navigate('spellShop/shopSetting/InvitationSettingPage', { storeData: this.state.storeData });
    };

    // 公告管理
    _assistantManager = () => {
        //公告管理可以对公告进行删除
        //异常：店长才可以进行删除
        this.$navigate('spellShop/shopSetting/AnnouncementListPage', { storeData: this.state.storeData });
    };

    _addCapacityHistory = () => {
        this.$navigate(RouterMap.AddCapacityHistoryPage);
    };

    // 店铺评分
    _scoreShop = () => {
        this.$navigate('spellShop/shopSetting/ShopScorePage', { storeData: this.state.storeData });
    };

    _closeStore = () => {
        this.$navigate(RouterMap.ShopCloseExplainPage);
    };

    _render() {
        const { createTime } = this.params.storeData || {};
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {
                        [{
                            key: '店铺管理',
                            showArrow: true,
                            onPres: this._managerShop
                        }, {
                            key: '店铺邀请设置',
                            showArrow: true,
                            onPres: this._inviteSetting
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
                            value: StringUtils.isNoEmpty(createTime) && DateUtils.formatDate(createTime, 'yyyy-MM-dd')
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
                            <Image source={ArrowImg}/> : <Text style={styles.desc}>{value || ''}</Text>
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
