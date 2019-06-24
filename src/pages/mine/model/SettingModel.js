/**
 * Created by zhoujianxin on 2019/6/20.
 * @Desc
 */

import { observable, action } from 'mobx';
import store from '@mr/rn-store';

class SettingModel {

    @observable
    JSPushMessage = true;

    @observable
    userScore = 0;

    @observable
    availableBalance = 0;

    @observable
    coupons = 0;

    @observable
    WXChatState = true;

    @observable
    messageState = true;

    @action
    getLocationState() {
        store.get('@mr/settingWXState').then((data) => {
            console.log('data',data)
            if (data) {
                this.WXChatState = data.WXChatState;
            }
        });

        store.get('@mr/settingMSGState').then((data) => {
            console.log('data',data)
            if (data) {
                this.messageState = data.messageState;
            }
        });
    }

    @action
    userScoreAdd(num){
        if(num){
            this.userScore = this.userScore + num;
        }else {
            this.userScore = 0;
        }
    }

    @action
    availableBalanceAdd(num){
        if(num){
            this.availableBalance = this.availableBalance + num;
        }else {
            this.availableBalance = 0;
        }
    }

    @action
    couponsAdd(num){
        if(num){
            this.coupons = this.coupons + num;
        }else {
            this.coupons = 0;
        }
    }

    @action
    wxChatClick() {
        this.WXChatState = !this.WXChatState;
        store.save('@mr/settingWXState', { WXChatState: this.WXChatState });
    }

    @action
    messageClick() {
        this.messageState = !this.messageState;
        store.save('@mr/settingMSGState', { messageState: this.messageState });
    }

}


const settingModel = new SettingModel();
settingModel.getLocationState();

export default settingModel;

