import { NativeEventEmitter, NativeModules } from 'react-native';
import { observable, computed, action } from 'mobx';
import RouterMap, { navigate } from '../../navigation/RouterMap';

const QY_MSG_CHANGE = 'QY_MSG_CHANGE';
const QY_CARD_CLICK = 'QY_CARD_CLICK';
const { JRQYService } = NativeModules;
const QYManagerEmitter = new NativeEventEmitter(JRQYService);

const CARD_TYPE = {
    PRODUCT_CARD: 0,//商品卡片
    ORDER_CARD: 1//订单卡片
};

const platformShopId = 'hzmrwlyxgs';

class QYChatModel {

    @action
    saveSupplierListData = (allMsgData) => {
        if (allMsgData &&
            allMsgData.sessionListData) {
            let currentArr = allMsgData.sessionListData || [];
            let tempArr = [];
            currentArr.map((item) => {
                if (item.shopId === platformShopId || (item.shopId && item.shopId.length === 0)) {
                    tempArr.unshift(item);
                } else {
                    tempArr.push(item);
                }
            });

            this.sessionListData = tempArr;
        }
    };

    @action
    saveUnreadCount = (allMsgData) => {
        if (allMsgData) {
            this.unreadCount = allMsgData.unreadCount;
        }
    };


    /**
     * 供应商聊天数组
     * 里面存储着所有聊天的供应商
     * @type {Array}
     */
    @observable
    sessionListData = [];

    /**
     * 所有供应商聊天的总未读数据
     * @type {number}
     */
    @observable
    unreadCount = 0;

    @computed
    get isHaveUnreadCount() {
        return this.unreadCount > 0;
    }

    //上次发起客服暂存的商品id
    preProductUrl = '';


    constructor() {
        //增加消息监听
        QYManagerEmitter.addListener(QY_MSG_CHANGE, this.msgChangeHandle);
        QYManagerEmitter.addListener(QY_CARD_CLICK, this.cardClickHandle);
    }

    /**
     * 来自原生的数据源
     * @param msgData
     * {
     *  unreadCount:总体消息未读数
     *  供应商列表
     *  sessionListData：[
     *  {
     *      hasTrashWords:是否存在垃圾文字
     *      lastMessageText：供应商发送过来的最后一条消息
     *      lastMessageType：最后一条消息类型
     *      unreadCount：当前供应商消息未读数
     *      status：状态
     *      lastMessageTimeStamp：最后一条消息的时间戳
     *      shopId：供应商id
     *      avatarImageUrlString：供应商头像
     *      sessionName：供应商所设置的名字
     *  }
     *  ....
     *  ]
     *
     * }
     */
    msgChangeHandle = (msgData) => {
        this.saveSupplierListData(msgData);
        this.saveUnreadCount(msgData);
    };

    cardClickHandle = (handleData) => {
        let productUrl = handleData && handleData.linkUrl ? handleData.linkUrl : '';
        if (this.preProductUrl !== productUrl) {
            let productSplitArr = productUrl.split('/');
            let productCode = productSplitArr.length > 0 ? productSplitArr[productSplitArr.length - 1] : '';
            let card_type = handleData ? handleData.card_type : -1;
            if (parseInt(card_type) === CARD_TYPE.PRODUCT_CARD) {
                navigate(RouterMap.ProductDetailPage, { productCode: productCode });
            } else if (parseInt(card_type) === CARD_TYPE.ORDER_CARD) {
                navigate(RouterMap.MyOrdersDetailPage, { orderNo: productCode });
            }
        }
    };

}

let chatModel = new QYChatModel();

export default chatModel;
