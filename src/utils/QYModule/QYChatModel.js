import { NativeEventEmitter, NativeModules } from "react-native";
import { observable, computed, action } from "mobx";

const QY_MSG_CHANGE = "QY_MSG_CHANGE";
const { JRQYService } = NativeModules;
const QYManagerEmitter = new NativeEventEmitter(JRQYService);

class QYChatModel {

    @action
    saveAllData = (allMsgData) => {
        if (allMsgData) {
            this.msgData = allMsgData;
        }
    };

    @action
    saveSupplierListData = (allMsgData) => {
        if (allMsgData &&
            allMsgData.sessionListData &&
            Array.isArray(allMsgData.sessionListData)) {
            this.sessionListData = allMsgData.sessionListData;
        }
    };

    @action
    saveUnreadCount = (allMsgData) => {
        if (allMsgData) {
            this.unreadCount = allMsgData.unreadCount;
        }
    };

    //暂存原生穿过来的所有消息数据
    @observable
    msgData = {};

    //供应商聊天数组
    @observable
    sessionListData = [];

    //消息未读数
    @observable
    unreadCount = 0;

    @computed
    get isHaveUnreadCount() {
        return this.unreadCount;
    }

    @computed
    get sessionListData() {
        return this.msgData.sessionListData;
    }

    constructor() {
        //增加监听
        this.listener = QYManagerEmitter.addListener(QY_MSG_CHANGE, this.msgChangeHandle);
    }

    msgChangeHandle = (msgData) => {
        this.saveAllData(msgData);
        // this.saveSupplierListData(msgData);
        this.saveUnreadCount(msgData);
    };

}

let chatModel = new QYChatModel();

export default chatModel;
