/**
 * @author xzm
 * @date 2018/11/20
 */

'use strict';
import { action, observable } from 'mobx';

const newuser_n = 'https://cdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/newuser_n.png';
const newuser_y = 'https://cdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/newuser_y.png';
const olduser = 'https://cdn.sharegoodsmall.com/sharegoods/resource/sg/images/package/olduser.png';

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
