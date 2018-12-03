/**
 * @author xzm
 * @date 2018/11/20
 */

"use strict";
import { action, observable } from "mobx";

class HomeRegisterFirstManager {
    @observable
    justRegistered = false;

    @action
    setJustRegistered(data) {
        //this.justRegistered = data;
    }

}

const homeRegisterFirstManager = new HomeRegisterFirstManager();
export default homeRegisterFirstManager;
