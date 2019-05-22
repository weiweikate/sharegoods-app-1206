import React from 'react';
import {
    View,
    StyleSheet, ScrollView, RefreshControl, Clipboard, TouchableWithoutFeedback
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
import CommModal from '../../../../comm/components/CommModal';
import { MRText as Text } from '../../../../components/ui';
import { track, trackEvent } from '../../../../utils/SensorsTrack';

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
        title: '修改微信号',
        show: true // false则隐藏导航
        // hiddenNav:false
    };

    constructor(props) {
        super(props);
        this.state = {
            hasVertifyID: false,
            isShowTakePhotoModal: false,
            showCopy: false
        };
    }


    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };

    _reload = () => {
        if (user.isLogin) {
            MineApi.getUser().then(res => {
                let data = res.data;
                console.log('data',data);
                user.saveUserInfo(data);
            }).catch(err => {
                this.$toastShow(err.msg);
                if (err.code === 10009) {
                    this.gotoLoginPage();
                }
            });
        } else {
            this.gotoLoginPage();
        }

    };

    copyCode = () => {
        let code = user.perfectNumberCode && (user.perfectNumberCode !== user.code) ? `${user.perfectNumberCode}` : `${user.code}`;
        Clipboard.setString(code);
        this.setState({
            showCopy: false
        });
    };

    showCopyModal = () => {
        this.setState({
            showCopy: true
        });
    };


    copyModal = () => {
        return (
            <CommModal
                onRequestClose={() => {
                    this.setState({
                        showCopy: false
                    });
                }}

                visible={this.state.showCopy}>
                <TouchableWithoutFeedback onPress={()=>{
                    this.setState({
                        showCopy: false
                    });
                }}>
                    <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
                        <TouchableWithoutFeedback onPress={this.copyCode}>
                            <View style={{
                                backgroundColor: DesignRule.white,
                                height: 60,
                                width: DesignRule.width - 120,
                                paddingLeft: DesignRule.margin_page,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 2
                            }}>
                                <Text style={{
                                    color: DesignRule.textColor_mainTitle_222,
                                    fontSize: DesignRule.fontSize_threeTitle_28
                                }}>
                                    复制
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </CommModal>
        );
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
                <UserSingleItem
                    leftText={user.perfectNumberCode && (user.perfectNumberCode !== user.code) ? '靓号' : '会员号'}
                    rightText={user.perfectNumberCode && (user.perfectNumberCode !== user.code) ? user.perfectNumberCode : user.code}
                    rightTextStyle={styles.grayText}
                    leftTextStyle={styles.blackText} isArrow={false}
                    onPress={() => this.showCopyModal()}
                />
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
                <UserSingleItem leftText={'微信号'} rightText={user.weChatNumber?user.weChatNumber:'设置微信号'} rightTextStyle={styles.grayText}
                                leftTextStyle={styles.blackText} isLine={false} isArrow={true}
                                onPress={() => this.jumpToSetWechatPage()}/>
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
                {this.copyModal()}
            </ScrollView>
        );
    }

    takePhoto = () => {
        track(trackEvent.ClickModifyAvatar,{});
        BusinessUtils.getImagePicker(callback => {
            this.$loadingShow();
            MineApi.updateUserById({ headImg: callback.imageUrl[0], type: 1 }).then((response) => {
                console.log(response);
                this.$loadingDismiss();
                if (response.code === 10000) {
                    user.headImg = callback.imageUrl[0];
                    this.$toastShow('头像修改成功');
                    if (callback.camera === true){
                        track(trackEvent.ModifuAvatarSuccess, {modificationMode:1});
                    } else {
                        track(trackEvent.ModifuAvatarSuccess, {modificationMode:2});
                    }
                }
            }).catch(err => {

                this.$loadingDismiss();
                if (err.code === 10009) {
                    this.gotoLoginPage();
                }
            });
        }, 1, true);
    };
    jumpToIDVertify2Page = () => {
        if (!user.realname) {
            track(trackEvent.ClickRealCodeentityVerify, {});
            this.$navigate('mine/userInformation/IDVertify2Page');
        }
    };
    jumpToNickNameModifyPage = () => {
        track(trackEvent.ClickModifyNickName, {});
        this.$navigate('mine/userInformation/NickNameModifyPage', { oldNickName: user.nickname });
    };

    jumpToSetWechatPage = () => {
        this.$navigate('mine/userInformation/SetWechatPage', { weChatNumber: user.weChatNumber });
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



