import { action, flow, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';
import { homeModule } from './Modules';
import ScreenUtils from '../../../utils/ScreenUtils';

const kHomeChannelStore = '@home/kHomeChannelStore';

class ChannelModules {
    @observable channelList = [];
    @observable channelHeight = 0;

    @action loadChannel = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeChannelStore);
                if (storeRes) {
                    this.saveChannelHeight(storeRes || []);
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.channel });
            this.saveChannelHeight(res.data || []);
            homeModule.changeHomeList(homeType.channel, this.channelList);
            store.save(kHomeChannelStore, res.data || []);
        } catch (error) {
            console.log(error);
        }
    });

    saveChannelHeight(list) {
        this.channelHeight = list.length > 0 ? (list.length <= 5 ? ScreenUtils.px2dp(90) : ScreenUtils.px2dp(170)) : 0;
        let channelData = {
            itemData: list,
            id: 2,
            type: homeType.channel
        };
        this.channelList = [];
        if (list.length > 0) {
            this.channelList.push(channelData);
        }
    }
}

export const channelModules = new ChannelModules();
