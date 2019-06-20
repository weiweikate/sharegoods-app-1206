/**
 * Created by zhoujianxin on 2019/6/20.
 * @Desc
 */

import { observable, action } from 'mobx';

class SettingModel {
    @observable
    params = { name: '全部', type: null };

    @action changeType(item) {
        this.params = item;
    }

    @action clearData() {
        this.params = { name: '全部', type: null };
    }
}


const SettingModel = new SettingModel();
export default SettingModel;

