//店长才可以使用的店铺设置页面
import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from 'DesignRule';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';
const ArrowImg = res.shopSetting.xjt_03;

const SCREEN_WIDTH = Dimensions.get('window').width;

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

    // 店铺评分
    _scoreShop = () => {
        this.$navigate('spellShop/shopSetting/ShopScorePage', { storeData: this.state.storeData });
    };

    _render() {
        return (

            <View style={{ flex: 1 }}>
                <ScrollView>
                    {
                        [{
                            key: '店铺管理',
                            showArrow: true,
                            onPres: this._managerShop
                        }, {
                            key: '店铺加入方式',
                            showArrow: true,
                            onPres: this._inviteSetting
                        }, {
                            key: '公告管理',
                            showArrow: true,
                            onPres: this._assistantManager
                        }, {
                            key: '店铺晋升',
                            showArrow: true,
                            onPres: this._scoreShop
                        }, {
                            key: '店铺成立时间',
                            showArrow: false,
                            value: this.params.storeData.createTimeStr
                        }].map((item, index) => {
                            return this.renderRow(item, index);
                        })
                    }
                </ScrollView>
            </View>
        )
            ;
    }

    renderRow = ({ key, value, showArrow, onPres }, index) => {
        return (<TouchableWithoutFeedback key={index} onPress={onPres}>
            <View style={[styles.row, index === 0 ? { marginTop: 10 } : null]}>
                <View style={styles.rowTop}>
                    <Text style={styles.text} allowFontScaling={false}>{key}</Text>
                    {
                        showArrow ? <Image source={ArrowImg}/> : <Text style={styles.desc} allowFontScaling={false}>{value || ''}</Text>
                    }
                </View>
                {index === 4 ? null : <View style={styles.line}/>}
            </View>
        </TouchableWithoutFeedback>);
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    btnContainer: {
        marginTop: 46,
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        width: SCREEN_WIDTH,
        height: 44,
        backgroundColor: '#fff'
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 21,
        flex: 1
    },
    text: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    desc: {
        fontSize: 13,
        color: DesignRule.textColor_secondTitle,
        textAlign: 'right'
    },
    line: {
        backgroundColor: DesignRule.lineColor_inColorBg,
        marginHorizontal: 15,
        height: StyleSheet.hairlineWidth
    },
    separateContainer: {
        width: 150,
        height: 48,
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    separateTitle: {
        fontSize: 16,
        color: DesignRule.mainColor
    },
    sendContainer: {
        marginTop: 10,
        width: 150,
        height: 48,
        borderRadius: 5,
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendTitle: {
        fontSize: 16,
        color: 'white'
    }
});
