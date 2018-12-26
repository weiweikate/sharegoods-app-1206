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
"use strict";
import { action, observable } from "mobx";

import UserApi from "./userApi";

class UserOrderNum {
    @observable
    afterSaleServiceNum = 0;
    @observable
    waitPayNum = 0;
    @observable
    waitReceiveNum = 0;
    @observable
    waitSendNum = 0;

    // 设置用户信息
    @action
    updateNum(data) {
        if (!data) {
            return;
        }

        this.afterSaleServiceNum = data.afterSale;
        this.waitPayNum = data.nonPay;
        this.waitReceiveNum = data.nonReceiving;
        this.waitSendNum = data.nonDelivery;
    }

    @action
    clean() {
        this.afterSaleServiceNum = 0;
        this.waitPayNum = 0;
        this.waitReceiveNum = 0;
        this.waitSendNum = 0;
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
