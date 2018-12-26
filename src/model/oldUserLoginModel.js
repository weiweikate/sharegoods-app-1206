// import { AsyncStorage } from 'react-native';
import { action, observable } from 'mobx';
import LoginAPI from '../pages/login/api/LoginApi';
import { NavigationActions } from 'react-navigation';
import bridge from '../utils/bridge';

class oldUserLoginModel {

    @observable
    isShowOldBtn=false;

    @action
    checkIsShowOrNot=()=>{
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data;
            // this.isShowOldBtn = true;
        }).catch((error) => {
        });
    }
    @action
    JumpToLogin=(routeName)=>{
        LoginAPI.oldUserActivateJudge().then((res) => {
            console.log('是还是非-------', res);
            this.isShowOldBtn = res.data;
            if (res.data){
                const navigationAction = NavigationActions.navigate({
                    routeName: routeName
                });
                global.$navigator.dispatch(navigationAction);
            } else {
                bridge.$toast('激活入口已关闭');
            }
        }).catch((error) => {
        });

    }
}

const oldUserLoginSingleModel = new oldUserLoginModel();

export default oldUserLoginSingleModel;
