//拼店权限或店铺基本状态
import { Alert, Linking, PermissionsAndroid } from 'react-native';
import { observable } from 'mobx';
import SpellShopApi from './api/SpellShopApi';
import ScreenUtils from '../../utils/ScreenUtils';
import geolocation from '@mr/rn-geolocation';
import { PageLoadingState } from '../../components/pageDecorator/PageState';

class SpellStatusModel {

    @observable hasAlertErr = false;//有无定位弹框

    @observable loadingState = PageLoadingState.loading;
    @observable netFailedInfo = {};
    //31407 可以看列表  31412没权限
    @observable errorCode = null;
    @observable storeCode = null;

    requestHome = () => {
        SpellShopApi.app_store_user_store().then((data) => {
            this.loadingState = PageLoadingState.success;
            this.storeCode = (data.data || {}).storeCode;
            this.errorCode = null;
        }).catch(e => {
            if (e.code === 9000 || 31412 || 31407) {
                this.loadingState = PageLoadingState.success;
            } else {
                this.loadingState = PageLoadingState.fail;
            }
            this.storeCode = null;
            this.errorCode = e.code;
        });
    };

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

export default spellStatusModel;
