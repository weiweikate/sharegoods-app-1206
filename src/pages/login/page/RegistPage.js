import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import ColorUtil from '../../../utils/ColorUtil';
import BasePage from '../../../BasePage';
import CommRegistView from '../components/CommRegistView';
import ScreenUtils from '../../../utils/ScreenUtils';

class RegistModel {
    @observable
    phoneNumber = '';
    @observable
    vertifyCode = '';
    @observable
    password = '';
    @observable
    dowTime = 0;
    @observable
    isSecuret = true;

    @action
    savePhoneNumber(phoneNmber) {
        if (!phoneNmber) {
            this.phoneNumber = '';
            return;
        }
        this.phoneNumber = phoneNmber;
    }

    @action
    savePassword(password) {
        if (!password) {
            this.password = '';
            return;
        }
        this.password = password;
    }

    @action
    saveVertifyCode(vertifyCode) {
        if (!vertifyCode) {
            this.vertifyCode = '';
            return;
        }
        this.vertifyCode = vertifyCode;
    }


    @computed
    get isCanClick() {
        if (this.phoneNumber.length === 11 && this.vertifyCode.length > 0 && this.password.length >= 6) {
            return true;
        } else {
            return false;
        }
    }

}

@observer
export default class RegistPage extends BasePage {
    pageModel = new RegistModel();
    // 导航配置
    $navigationBarOptions = {
        title: '注册'
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <CommRegistView
                    // config={viewType:0}
                    viewType={0}
                    loginClick={this.clickNext}
                />
                <View style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                    height: 11,
                    width: ScreenUtils.width
                }}>
                    <TouchableOpacity/>
                    <Image source={LoginAndRegistRes.openEyeImage}
                           style={{ width: 11, height: 11, marginRight: 5 }}/>
                    <TouchableOpacity/>
                    <Text style={{ fontSize: 11, color: ColorUtil.Color_666666 }}>
                        阅读并接受
                    </Text>
                    <TouchableOpacity>
                        <Text style={{ color: ColorUtil.mainRedColor, fontSize: 11 }}>
                            《用户协议》
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>


        );
    }

    //点击下一步
    clickNext = (phone, code, password) => {


    };
}

