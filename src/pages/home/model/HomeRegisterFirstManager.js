/**
 * @author xzm
 * @date 2018/11/20
 */

'use strict';
import { action, observable } from 'mobx';
import OssHelper from '../../../utils/OssHelper';
const newuser_n = OssHelper('/sharegoods/resource/sg/images/package/newuser_n.png');
const newuser_y = OssHelper('/sharegoods/resource/sg/images/package/newuser_y.png');
const olduser = OssHelper('/sharegoods/resource/sg/images/package/olduser.png');

class HomeRegisterFirstManager {
    @observable
    showRegisterModalUrl = null;

    @action
    setShowRegisterModalUrl(data) {
        this.showRegisterModalUrl = data;
    }

}

const homeRegisterFirstManager = new HomeRegisterFirstManager();
export  { homeRegisterFirstManager, newuser_n, newuser_y, olduser };
