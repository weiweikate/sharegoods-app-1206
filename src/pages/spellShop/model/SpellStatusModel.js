//拼店权限或店铺基本状态
import { Alert, Linking, PermissionsAndroid } from 'react-native';
import { action, computed, observable } from 'mobx';
import { autorun } from 'mobx';
import user from '../../../model/user';
import SpellShopApi from '../api/SpellShopApi';
import ScreenUtils from '../../../utils/ScreenUtils';
import geolocation from '@mr/rn-geolocation';

class SpellStatusModel {

    /******************************【observable】******************************************/
    @observable
    refreshing = false;//是否是刷新状态
    @observable
    allowCreateStore = null;       //可不可以走开店流程1允许 2不允许
    @observable
    allowGroupStore = null;       //能否看到拼店推荐页面1允许 2不允许
    @observable
    storeCode = null;//店铺code
    @observable
    storeStatus = null;//店铺状态	 integer($int32)状态 0-关闭 1-正常 2-已缴纳保证金 3-招募中

    @observable hasAlertErr = false;//有无定位弹框

    /******************************【computed】******************************************/

    @computed//可以去开店
    get canCreateStore() {
        return this.allowCreateStore && this.allowCreateStore === 1;
    }

    @computed//可以看到拼店推荐页面
    get canSeeGroupStore() {
        return this.allowGroupStore && this.allowGroupStore === 1;
    }

    /*用户有店铺*/
    @computed get hasStore() {
        return this.storeCode && this.storeStatus === 1;
    }

    /******************************【action】******************************************/
    @action //成功
    getUserData(data) {
        user.saveUserInfo(data);
        user.saveToken(data.token);
        this.refreshing = false;
        this.allowCreateStore = data.allowCreateStore;
        this.allowGroupStore = data.allowGroupStore;
        this.storeCode = data.storeCode;
        this.storeStatus = data.storeStatus;
    }

    @action //错误
    getUserError(error) {
        this.refreshing = false;
        this.allowCreateStore = null;
        this.allowGroupStore = null;
        this.storeCode = null;
        this.storeStatus = null;
    }

    @action //清空数据  重新加载
    clearGetUserData() {
        this.refreshing = false;
        this.allowCreateStore = null;
        this.allowGroupStore = null;
        this.storeCode = null;
        this.storeStatus = null;
    }

    /******************************【common】******************************************/


    //请求加载数据 0静默刷新  1下拉刷新数据  2状态数据清空并标记页面处于初始化加载中...
    getUser(type = 0) {
        const actions = {
            0: null,
            1: () => this.refreshing = true,
            2: this.clearGetUserData
        };

        actions[type] && actions[type]();

        return SpellShopApi.getUser().then((data) => {
            this.getUserData(data.data || {});
            return Promise.resolve(data);
        }).catch((error) => {
            this.getUserError(error);
            return Promise.reject(error);
        });
    }

    //没权限弹框
    alertAction = (error, leftAction, rightAction) => {
        const code = ScreenUtils.isIOS ? error.code === 'permissionsErr' : (error.code === 'permissionsErr' || error.code === '12');
        const shouldAlert = !this.hasAlertErr && code;
        if (shouldAlert) {
            this.hasAlertErr = true;
            Alert.alert('提示', '定位服务未开启，请进入系统－设置－定位服务中打开开关，允许秀购使用定位服务',
                [
                    {
                        text: '取消', onPress: () => {
                            leftAction();
                            this.hasAlertErr = false;
                        }
                    },
                    {
                        text: '去设置', onPress: () => {
                            if (ScreenUtils.isIOS) {
                                Linking.openURL('app-settings:');
                            } else {
                                if (error.code === '12') {
                                    geolocation.goLocationSetting();
                                } else {
                                    PermissionsAndroid.request(
                                        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                                        {
                                            message:
                                                '定位服务未开启，请进入系统－设置－应用－应用管理－权限管理中打开开关，并且允许秀购使用定位服务',
                                            buttonNegative: '取消',
                                            buttonPositive: '确定'
                                        }
                                    );
                                }
                            }
                            rightAction();
                            this.hasAlertErr = false;
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    };
}

const spellStatusModel = new SpellStatusModel();

autorun(() => {
    //监听用户登录状态,刷新拼店基础状态
    spellStatusModel.getUser(user.isLogin ? 2 : 0);
});

export default spellStatusModel;
