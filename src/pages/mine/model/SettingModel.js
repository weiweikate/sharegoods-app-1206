/**
 * Created by zhoujianxin on 2019/6/20.
 * @Desc
 */

import { observable, action } from 'mobx';
import store from '@mr/rn-store';
import userModel from '../../../model/user';


const userScoreKey = '@mr/MSGUserScore';
const availableBalanceKey = '@mr/MSGAvailableBalance';
const couponsKey = '@mr/MSGCoupons';
const fansMSGKey = '@mr/fansMSG';

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
    fansMSG = 0;

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

        if(userModel.code){
            store.get(`${userScoreKey}${userModel.code}`).then((data) => {
                console.log('data',data)
                if (data) {
                    this.userScore = data.userScore;
                }
            });
            store.get(`${availableBalanceKey}${userModel.code}`).then((data) => {
                console.log('data',data)
                if (data) {
                    this.availableBalance = data.availableBalance;
                }
            });
            store.get(`${couponsKey}${userModel.code}`).then((data) => {
                console.log('data',data)
                if (data) {
                    this.coupons = data.coupons;
                }
            });
            store.get(`${fansMSGKey}${userModel.code}`).then((data) => {
                console.log('data',data)
                if (data) {
                    this.fansMSG = data.fansMSG;
                }
            });
        }

    }

    @action
    userScoreAdd(num){
        if(userModel.code) {
            if (num) {
                this.userScore = this.userScore + num;
            } else {
                this.userScore = 0;
            }
            store.save(`${userScoreKey}${userModel.code}`, { userScore: this.userScore });
        }
    }

    @action
    availableBalanceAdd(num){
        if(userModel.code) {
            if (num) {
                this.availableBalance = this.availableBalance + num;
            } else {
                this.availableBalance = 0;
            }
            store.save(`${availableBalanceKey}${userModel.code}`, {availableBalance: this.availableBalance });
        }
    }

    @action
    couponsAdd(num){
        if(userModel.code) {
            if (num) {
                this.coupons = this.coupons + num;
            } else {
                this.coupons = 0;
            }
            store.save(`${couponsKey}${userModel.code}`, { coupons: this.coupons });
        }
    }

    @action
    fansMSGAdd(num){
        if(userModel.code) {
            if (num) {
                this.fansMSG = this.fansMSG + num;
            } else {
                this.fansMSG = 0;
            }
            store.save(`${fansMSGKey}${userModel.code}`, { fansMSG: this.fansMSG });
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

