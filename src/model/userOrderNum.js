/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by xzm on 2018/10/25.
 *
 */
'use strict';
import { action, observable } from 'mobx';

import UserApi from './userApi';

class UserOrderNum {
    @observable
    afterSaleServiceNum = 0; //售后
    @observable
    waitPayNum = 0; //待支付
    @observable
    waitReceiveNum = 0; //待收货
    @observable
    waitSendNum = 0; //待发货
    @observable
    waitShowNum = 0; //晒单

    // 设置用户信息
    @action
    updateNum(data) {
        if (!data) {
            return;
        }

        this.afterSaleServiceNum = data.afterSale;
        this.waitPayNum = data.waitPay;
        this.waitReceiveNum = data.waitReceive;
        this.waitSendNum = data.waitDeliver;
        this.waitShowNum = data.comment || 0;
    }

    @action
    clean() {
        this.afterSaleServiceNum = 0;
        this.waitPayNum = 0;
        this.waitReceiveNum = 0;
        this.waitSendNum = 0;
        this.waitShowNum = 0;
    }

    @action getUserOrderNum() {
        return UserApi.getUserOrderNum().then(res => {
            if (res.code === 10000) {
                let data = res.data;
                this.updateNum(data);
            }
            return res.data;
        });
    }
}

const userOrderNum = new UserOrderNum();
export default userOrderNum;
