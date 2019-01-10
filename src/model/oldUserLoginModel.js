// import { AsyncStorage } from 'react-native';
import { action, observable } from 'mobx';
import LoginAPI from '../pages/login/api/LoginApi';
import { NavigationActions } from 'react-navigation';
import bridge from '../utils/bridge';

class oldUserLoginModel {

    @observable
    isShowOldBtn = false;
    @observable
    isShowReg  = true;

    /**
     * @param isShowToast 是否显示toast
     */
    @action
    checkIsShowOrNot = (isShowToast) => {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            console.log('hyf-----',res.data);
            this.isShowOldBtn = res.data.oldSwitch;
            this.isShowReg = res.data.regSwitch;

            // this.isShowOldBtn = true;
        }).catch((error) => {
            if (isShowToast) {
                bridge.$toast(error.msg)
            }
            this.isShowOldBtn = false;
            this.isShowReg = true;
        });
    };
    @action
    JumpToLogin = (routeName) => {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data.oldSwitch;
            this.isShowReg = res.data.regSwitch;
            if (res.data.oldSwitch) {
                const navigationAction = NavigationActions.navigate({
                    routeName: routeName
                });
                global.$navigator.dispatch(navigationAction);
            } else {
                bridge.$toast('激活入口已关闭');
            }
        }).catch((error) => {
            this.isShowOldBtn = false;
            bridge.$toast(error.msg)
        });
    };

    //注册
    @action
    isCanTopRegist = (routeName) => {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data.oldSwitch;
            this.isShowReg = res.data.regSwitch;
            if (this.isShowReg) {
                const navigationAction = NavigationActions.navigate({
                    routeName: routeName
                });
                global.$navigator.dispatch(navigationAction);
            } else {
                bridge.$toast('注册入口未开放');
            }
        }).catch((error) => {
            this.isShowOldBtn = false;
             bridge.$toast(error.msg)
        });
    };

    //微信
    isCanLoginWithWx = (callBack) => {
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data.oldSwitch;
            this.isShowReg = res.data.regSwitch;
            if (res.data.regSwitch) {
                callBack(true);
            } else {
                callBack(false);
                bridge.$toast('老用户激活阶段不可注册');
            }
        }).catch((error) => {
            callBack(false);
            this.isShowOldBtn = false;
            bridge.$toast(error.msg)
        });
    };
}

const oldUserLoginSingleModel = new oldUserLoginModel();

export default oldUserLoginSingleModel;
