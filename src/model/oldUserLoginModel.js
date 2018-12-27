// import { AsyncStorage } from 'react-native';
import { action, observable } from 'mobx';
import LoginAPI from '../pages/login/api/LoginApi';
import { NavigationActions } from 'react-navigation';
import bridge from '../utils/bridge';

class oldUserLoginModel {

    @observable
    isShowOldBtn = false;

    @action
    checkIsShowOrNot = () => {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data;
            // this.isShowOldBtn = true;
        }).catch((error) => {
        });
    };
    @action
    JumpToLogin = (routeName) => {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data;
            if (res.data) {
                const navigationAction = NavigationActions.navigate({
                    routeName: routeName
                });
                global.$navigator.dispatch(navigationAction);
            } else {
                bridge.$toast('激活入口已关闭');
            }
        }).catch((error) => {
        });
    };

    //注册
    @action
    isCanTopRegist = (routeName) => {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data;
            if (!res.data) {
                const navigationAction = NavigationActions.navigate({
                    routeName: routeName
                });
                global.$navigator.dispatch(navigationAction);
            } else {
                bridge.$toast('老用户激活阶段不可注册');
            }
        }).catch((error) => {

        });
    };

    //微信
    isCanLoginWithWx = (callBack) => {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data;
            if (!res.data) {
                callBack(true);
            } else {
                callBack(false);
                bridge.$toast('老用户激活阶段不可注册');
            }
        }).catch((error) => {

        });
    };

}

const oldUserLoginSingleModel = new oldUserLoginModel();

export default oldUserLoginSingleModel;
