/**
 * Created by zhoujianxin on 2019/6/20.
 * @Desc
 */

import { observable, action } from 'mobx';
import store from '@mr/rn-store';

class SettingModel {
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

