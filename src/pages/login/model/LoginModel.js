import { observable, action, computed } from "mobx";

class LoginModel {
    @observable
    selectIndex = 0;
    @observable
    phoneNumber = "";
    @observable
    vertifyCode = "";
    @observable
    password = "";
    @observable
    isSecuret = true;
    @observable
    dowTime = 0;
    @observable
    haveClick = false;
    @observable
    isSelectProtocol = true;
    @observable
    authPhone = null;

    @action
    setAuthPhone(str){
        this.authPhone = str;
    }

    @action
    saveIsSelectProtocol(isSelect) {
        this.isSelectProtocol = isSelect;
    }

    @action
    savePhoneNumber(phoneNmber) {
        if (!phoneNmber || phoneNmber.length === 0) {
            this.phoneNumber = "";
            return;
        }
        this.phoneNumber = phoneNmber;
    }

    @action
    saveHaveClick(flag) {
        this.haveClick = flag;
    }

    @action
    savePassword(password) {
        if (!password) {
            this.password = "";
            return;
        }
        this.password = password;
    }

    @action
    clearPassword() {
        this.password = "";
    }

    @action
    saveVertifyCode(vertifyCode) {
        if (!vertifyCode) {
            this.vertifyCode = "";
            return;
        }
        this.vertifyCode = vertifyCode;
    }

    @computed
    get isCanClick() {
        if (this.phoneNumber.length < 11 && !this.haveClick || !this.isSelectProtocol) {
            return false;
        }
        if (this.selectIndex === 0) {
            if (this.vertifyCode.length > 0 && !this.haveClick) {
                return true;
            }
        } else {
            if (this.password.length > 3 && !this.haveClick) {
                return true;
            }
        }
    }
}

const loginModel = new LoginModel();
export default loginModel;
