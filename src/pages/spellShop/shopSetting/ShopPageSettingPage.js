//店长才可以使用的店铺设置页面
import React from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import ArrowImg from './res/xjt_03.png';
import storeModel from '../model/storeModel';
import BasePage from '../../../BasePage';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ShopPageSettingPage extends BasePage {

    $navigationBarOptions = {
        title: '我的店铺'
    };

    // 店铺管理
    _managerShop = () => {
        //店铺管理是修改店铺的基础信息并保存在店铺中显示
        //异常：仅店长才能修改此功能
        this.$navigate('spellShop/shopSetting/SetShopNamePage', { isChangeStoreInfo: true });
    };

    // 邀请设置
    _inviteSetting = () => {
        //店铺邀请会有几种条件在里面，设置某种条件就会有对应的条件设置才能邀请进来
        //异常：通过条件才能进入到店铺
        this.props.navigation.push('spellShop/shopSetting/InvitationSettingPage', {
            recruitStatus: this.params.recruitStatus
        });
    };

    // 公告管理
    _assistantManager = () => {
        //公告管理可以对公告进行删除
        //异常：店长才可以进行删除
        this.$navigate('spellShop/shopSetting/AnnouncementListPage');
    };

    // 店铺评分
    _scoreShop = () => {
        this.props.navigation.push('spellShop/shopSetting/ShopScorePage');
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
                            key: '店铺邀请设置',
                            showArrow: true,
                            onPres: this._inviteSetting
                        }, {
                            key: '公告管理',
                            showArrow: true,
                            onPres: this._assistantManager
                        }, {
                            key: '店铺评分',
                            showArrow: true,
                            onPres: this._scoreShop
                        }, {
                            key: '店铺成立时间',
                            showArrow: false,
                            value: storeModel.storeCreateTime
                        }].map((item, index) => {
                            return this.renderRow(item, index);
                        })
                    }
                </ScrollView>
            </View>
        );
    }

    renderRow = ({ key, value, showArrow, onPres }, index) => {
        return (<TouchableWithoutFeedback key={index} onPress={onPres}>
            <View style={[styles.row, index === 0 ? { marginTop: 10 } : null]}>
                <View style={styles.rowTop}>
                    <Text style={styles.text}>{key}</Text>
                    {
                        showArrow ? <Image source={ArrowImg}/> : <Text style={styles.desc}>{value || ''}</Text>
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
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#222222'
    },
    desc: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'right'
    },
    line: {
        backgroundColor: '#eeeeee',
        marginHorizontal: 15,
        height: StyleSheet.hairlineWidth
    },
    separateContainer: {
        width: 150,
        height: 48,
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e60012',
        justifyContent: 'center',
        alignItems: 'center'
    },
    separateTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 16,
        color: '#e60012'
    },
    sendContainer: {
        marginTop: 10,
        width: 150,
        height: 48,
        borderRadius: 5,
        backgroundColor: '#e60012',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 16,
        color: '#ffffff'
    }
});
