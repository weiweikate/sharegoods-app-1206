/**
 * @author xzm
 * @date 2018/11/20
 */

"use strict";
import { action, observable } from "mobx";

import DeviceInfo from "react-native-device-info/deviceinfo";
import MineApi from "../../mine/api/MineApi";
import { AsyncStorage } from "react-native";
import MessageApi from "../../message/api/MessageApi";

class HomeModalManager {
    @observable
    version = null;
    @observable
    homeMessage = null;


    @action
    setVersion(data) {
        this.version = data;
    }

    @action
    setHomeMessage(data) {
        this.homeMessage = data;
    }

    @action
    getVersion = () => {
        return MineApi.getVersion({ version: DeviceInfo.getVersion() }).then((resp) => {
            this.setVersion(resp);
            return resp;
        });
    };

    @action
    getMessage() {
        var currStr = new Date().getTime() + "";
        return AsyncStorage.getItem("lastMessageTime").then((value) => {
            if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                return MessageApi.queryNotice({ page: this.currentPage, pageSize: 10, type: 100 }).then(resp => {
                    this.setHomeMessage(resp);
                    return resp;
                });
            }
        });
    }
}

const homeModalManager = new HomeModalManager();
export default homeModalManager;
