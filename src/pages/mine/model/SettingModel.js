/**
 * Created by zhoujianxin on 2019/6/20.
 * @Desc
 */

import { observable, action, autorun } from 'mobx';
import store from '@mr/rn-store';
import userModel from '../../../model/user';


const mineKey = '@mr/msgmine';


class SettingModel {
    @observable
    data = {};
    @observable
    params = {
        userScore: 0,
        availableBalance: 0,
        coupons: 0,
        fansMSG: 0
    };
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
         store.get(mineKey).then((data) => {
                console.log('dataMineKey',data)
                if (data) {
                    this.data = data;
                    let item = data[userModel.code];
                    this.userScore = item && item.userScore ? item.userScore : 0;
                    this.availableBalance = item && item.availableBalance ? item.availableBalance : 0;
                    this.coupons = item && item.availableBalance ? item.availableBalance : 0;
                    this.fansMSG = item && item.fansMSG ? item.fansMSG : 0;
                    this.params = {
                        userScore: this.userScore,
                        availableBalance:this.availableBalance,
                        coupons: this.coupons,
                        fansMSG:this.fansMSG,
                    }
                }else {
                    this.data = {};
                    this.userScore = 0;
                    this.availableBalance = 0;
                    this.coupons = 0;
                    this.fansMSG = 0;
                    this.params = {
                        userScore: 0,
                        availableBalance: 0,
                        coupons: 0,
                        fansMSG: 0,
                    }
                }
            })
    }



    @action
    userScoreAdd(num){
        if(userModel.code) {
            if (num) {
                this.userScore = this.userScore + num;
            } else {
                this.userScore = 0;
            }
            let key = userModel.code;
            this.params.userScore = this.userScore;
            let value = this.data;
            value[key] = this.params;
            store.save(mineKey, value);
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
            let key = userModel.code;
            this.params.availableBalance = this.availableBalance;
            let value = this.data;
            value[key] = this.params;
            store.save(mineKey, value);
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
            let key = userModel.code;
            this.params.coupons = this.coupons;
            let value = this.data;
            value[key] = this.params;
            store.save(mineKey, value);
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
            let key = userModel.code;
            this.params.fansMSG = this.fansMSG;
            let value = this.data;
            value[key] = this.params;
            store.save(mineKey, value);
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


autorun(()=>{
    userModel.code ? settingModel.getLocationState() : null;
})

export default settingModel;

