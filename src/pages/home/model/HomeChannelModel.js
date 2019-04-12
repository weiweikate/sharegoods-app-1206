import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import { get, save } from '@mr/rn-store';
import { homeModule } from './Modules';

const kHomeChannelStore = '@home/kHomeChannelStore';

class ChannelModules {
    @observable channelList = [];

    @action loadChannel = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield get(kHomeChannelStore);
                if (storeRes) {
                    this.channelList = storeRes || [];
                }
            }
            const res = yield HomeApi.getHomeData({ type: homeType.channel });
            this.channelList = res.data || [];
            homeModule.changeHomeList(homeType.channel);
            save(kHomeChannelStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });
}

export const channelModules = new ChannelModules();
