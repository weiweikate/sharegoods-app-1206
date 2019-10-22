/**
 * Created by zhoujianxin on 2019/6/20.
 * @Desc
 */

import { observable, action, autorun } from 'mobx';
import store from '@mr/rn-store';
import userModel from '../../../model/user';
import MineAPI from '../api/MineApi';
import bridge from '../../../utils/bridge';
// import DateUtils from '../../../utils/DateUtils';

const mineKey = '@mr/msgmine';


class SettingModel {
    @observable
    data = {};
    @observable
    params = {
        userScore: 0,
        availableBalance: 0,
        coupons: 0,
        fansMSG: 0,
        mainTask: 0
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
    mainTask = 0;

    @observable
    WXChatState = true;

    //帐号与安全页 短信开关控制
    @observable
    messageState = 0;

    @observable
    memberSwitchState =  false//!DateUtils.getDateDiffFun('2019/10/25 00:00:00', '');


    //战力开关控制 普通用户不显示， 默认不显示
    @observable
    myStrengthState = false;

    @action
    getLocationState() {
        store.get('@mr/settingWXState').then((data) => {
            console.log('data',data)
            if (data) {
                this.WXChatState = data.WXChatState;
            }
        });
        this.messageState = userModel.showPhone;

         store.get(mineKey).then((data) => {
                console.log('dataMineKey',data)
                if (data) {
                    this.data = data;
                    let item = data[userModel.code];
                    this.userScore = item && item.userScore ? item.userScore : 0;
                    this.availableBalance = item && item.availableBalance ? item.availableBalance : 0;
                    this.coupons = item && item.availableBalance ? item.availableBalance : 0;
                    this.fansMSG = item && item.fansMSG ? item.fansMSG : 0;
                    this.mainTask = item && item.mainTask ? item.mainTask : 0;
                    this.params = {
                        userScore: this.userScore,
                        availableBalance: this.availableBalance,
                        coupons: this.coupons,
                        fansMSG: this.fansMSG,
                        mainTask: this.mainTask,
                    }
                }else {
                    this.data = {};
                    this.userScore = 0;
                    this.availableBalance = 0;
                    this.coupons = 0;
                    this.fansMSG = 0;
                    this.mainTask = 0;
                    this.params = {
                        userScore: 0,
                        availableBalance: 0,
                        coupons: 0,
                        fansMSG: 0,
                        mainTask: 0,
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
    mainTaskAdd(num){
        if(userModel.code) {
            if (num) {
                this.mainTask = this.mainTask + num;
            } else {
                this.mainTask = 0;
            }
            let key = userModel.code;
            this.params.mainTask = this.mainTask;
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
    messageClick(type) {
        // type 是否展示联系方式 1:是 0:否
        MineAPI.setMessageStatus({showPhone:type}).then(()=>{
            this.messageState = type;
        }).catch(error=>{
            bridge.$toast(error.msg);
        })
    }

    /**
    * @func 判断是否显示新版会员权益
    * @des 当前判断日期是否10月25日前，之后则显示新版 true，之前则为老版 false
    */
    @action
    memberSwitch() {
        // if (DateUtils.getDateDiffFun('2019/10/25 00:00:00', '')) {
        //     this.memberSwitchState = false;
        //     return;
        // }
        MineAPI.getMemberCenterShow().then((res) => {
            this.memberSwitchState = res.data && res.data.showNewMemberBenefit ? res.data.showNewMemberBenefit : false;
        }).catch(error => {
            this.memberSwitchState = false;
        })
    }

    /**
     * @func 判断是否显示我的战力
     * @des 当前判断，显示 true，不显示 false
     */
    @action
    myStrengthSwitch() {
        MineAPI.myStrengthShow().then((res) => {
            this.myStrengthState = res.data && res.data.showBenefitFight ? res.data.showBenefitFight : false;
        }).catch(error => {
            this.myStrengthState = false
        });
    }
}


const settingModel = new SettingModel();


autorun(()=>{
    userModel.code ? settingModel.getLocationState() : null;
})

export default settingModel;

