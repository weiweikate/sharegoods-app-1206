import React from 'react';
import {
    View,
    StyleSheet, ScrollView, RefreshControl
} from 'react-native';
import DesignRule from '../../../../constants/DesignRule';
import BasePage from '../../../../BasePage';
import UserSingleItem from '../../components/UserSingleItem';
import user from '../../../../model/user';
import { observer } from 'mobx-react/native';
import BusinessUtils from '../../components/BusinessUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';

const dismissKeyboard = require('dismissKeyboard');
import MineApi from '../../api/MineApi';
import RouterMap from '../../../../navigation/RouterMap';

/**
 * @author chenxiang
 * @date on 2018/9/13
 * @describe 订单列表
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */
@observer
export default class UserInformationPage extends BasePage {

    $navigationBarOptions = {
        title: '个人资料',
        show: true // false则隐藏导航
        // hiddenNav:false
    };

    constructor(props) {
        super(props);
        this.state = {
            hasVertifyID: false,
            isShowTakePhotoModal: false
        };
    }


    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };

    _reload = () => {
        MineApi.getUser().then(res => {
            let data = res.data;
            user.saveUserInfo(data);
        }).catch(err => {
            this.$toastShow(err.msg);
        });
    };

    _render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={this._reload}
                        progressViewOffset={64}
                        colors={[DesignRule.mainColor]}
                        tintColor={DesignRule.textColor_instruction}
                        titleColor={DesignRule.textColor_instruction}
                    />}>

                {this.renderWideLine()}

                <UserSingleItem leftText={'头像'} rightText={''} rightTextStyle={styles.grayText}
                                leftTextStyle={styles.blackText} headImage={user.headImg}
                                onPress={() => this.takePhoto()}/>
                <UserSingleItem leftText={'昵称'} rightText={user.nickname} rightTextStyle={styles.grayText}
                                leftTextStyle={styles.blackText} isLine={false} isArrow={true}
                                onPress={() => this.jumpToNickNameModifyPage()}/>
                {this.renderWideLine()}
                <UserSingleItem leftText={user.perfectNumberCode ? '靓号' : '会员号'} rightText={user.perfectNumberCode ? user.perfectNumberCode : user.code} rightTextStyle={styles.grayText}
                                leftTextStyle={styles.blackText} isArrow={false}/>
                <UserSingleItem leftText={'会员等级'} rightText={user.levelRemark}
                                rightTextStyle={[styles.grayText, { color: 'white' }]}
                                leftTextStyle={styles.blackText} isArrow={false} circleStyle={{
                    borderRadius: 15,
                    backgroundColor: '#ff7e00',
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginRight: 15
                }}/>
                <UserSingleItem leftText={'手机号'} rightText={user.phone} rightTextStyle={styles.grayText}
                                leftTextStyle={styles.blackText} isArrow={false} isLine={false}/>
                {this.renderWideLine()}
                <UserSingleItem leftText={'所在区域'}
                                rightText={user.area ? user.province + user.city + user.area : ''}
                                rightTextStyle={[styles.grayText, {
                                    maxWidth: ScreenUtils.width / 5 * 3,
                                    numberOfLines: 2
                                }]} leftTextStyle={styles.blackText} isLine={false}
                                onPress={() => this.renderGetCityPicker()}/>
                {this.renderWideLine()}
                <UserSingleItem leftText={'实名认证'} rightText={user.realname ? '已实名认证' : '未实名认证'}
                                rightTextStyle={[styles.grayText, { color: 'white' }]}
                                leftTextStyle={styles.blackText} isArrow={false} isLine={false}
                                circleStyle={user.realname ? styles.hasVertifyID : styles.notVertifyID}
                                onPress={() => this.jumpToIDVertify2Page()}/>
                {this.renderWideLine()}
                <UserSingleItem leftText={'简介'}
                                itemHeightStyle={{ backgroundColor: 'white', paddingVertical: 12 }}
                                rightText={user.profile ? user.profile : '未填写'}
                                rightTextStyle={[styles.grayText, {
                                    maxWidth: ScreenUtils.width / 5 * 3,
                                    numberOfLines: 2
                                }]} leftTextStyle={styles.blackText} isLine={false}
                                onPress={() => this.editProfile()}/>
            </ScrollView>
        );
    }

    takePhoto = () => {
        BusinessUtils.getImagePicker(callback => {
            this.$loadingShow();
            MineApi.updateUserById({ headImg: callback.imageUrl[0], type: 1 }).then((response) => {
                console.log(response);
                this.$loadingDismiss();
                if (response.code === 10000) {
                    user.headImg = callback.imageUrl[0];
                    this.$toastShow('头像修改成功');
                }
            }).catch(err => {

                this.$loadingDismiss();
                if (err.code === 10009) {
                    this.gotoLoginPage();
                }
            });
        },1,true);
    };
    jumpToIDVertify2Page = () => {
        if (!user.realname) {
            this.$navigate('mine/userInformation/IDVertify2Page');
        }
    };
    jumpToNickNameModifyPage = () => {
        this.$navigate('mine/userInformation/NickNameModifyPage', { oldNickName: user.nickname });
    };
    renderGetCityPicker = () => {
        dismissKeyboard();
        this.$navigate('mine/address/SelectAreaPage', {
            setArea: this.setArea.bind(this),
            tag: 'province',
            fatherCode: '0'
        });
    };
    editProfile = () => {
        this.$navigate(RouterMap.ProfileEditPage);
    };

    setArea(provinceCode, provinceName, cityCode, cityName, areaCode, areaName, areaText) {
        user.province = provinceName;
        user.city = cityName;
        user.area = areaName;

        MineApi.updateUserById({ type: 3, provinceId: provinceCode, cityId: cityCode, areaId: areaCode }).then(res => {
            this.$toastShow('地址修改成功');
        }).catch(err => {
            if (err.code === 10009) {
                this.$navigate('login/login/LoginPage');
            }
        });
    }
}

const styles = StyleSheet.create({
    blackText: {
        fontSize: 15,
        color: DesignRule.textColor_mainTitle
    },
    grayText: {
        fontSize: 15,
        color: DesignRule.textColor_instruction,
        padding: 3
    },
    whiteText: {
        fontSize: 13,
        color: 'white'
    }, hasVertifyID: {
        borderRadius: 15, backgroundColor: '#0186f5', paddingLeft: 10, paddingRight: 10
    }, notVertifyID: {
        borderRadius: 15,
        backgroundColor: DesignRule.lineColor_inGrayBg,
        paddingLeft: 10,
        paddingRight: 10
    }
});



