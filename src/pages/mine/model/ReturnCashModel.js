/**
 * @author zhoujianxin
 * @date on 2019/9/23.
 * @desc 自返金model
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import { observable, action } from 'mobx';
import MineAPI from '../api/MineApi';
import bridge from '../../../utils/bridge';

class ReturnCashModel {
    @observable
    returnCashInfo = {};

    @observable
    returnCashSwitchState = false;//自返金显示开关

    /**
     * @func 获取当前用户自返金信息
     */
    @action getReturnCashInfo() {
        MineAPI.getReturnCashInfo().then(res => {
            console.log('getReturnCashInfo',res)
            this.returnCashInfo = res.data||{};
        }).catch(err => {
            bridge.$toast(err.msg);
        });
    }

    /**
     * @func 获取当前用户自返金开关接口请求
     */
    @action getReturnCashSwitchState() {
        MineAPI.getSelfReturnShow().then((res) => {
            this.returnCashSwitchState = res.data ? res.data : false;
        }).catch(error => {
            this.returnCashSwitchState = false;
        })
    }
}


const returnCashModel = new ReturnCashModel();
export default returnCashModel;

