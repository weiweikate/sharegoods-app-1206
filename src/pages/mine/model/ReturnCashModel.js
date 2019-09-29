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

    @action getReturnCashInfo() {
        MineAPI.getReturnCashInfo().then(res => {
            console.log('getReturnCashInfo',res)
            this.returnCashInfo = res.data||{};
        }).catch(err => {
            bridge.$toast(err.msg);
        });
    }
}


const returnCashModel = new ReturnCashModel();
export default returnCashModel;

