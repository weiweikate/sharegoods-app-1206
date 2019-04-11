import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import { get, save } from '@mr/rn-store';
import ScreenUtils from '../../../utils/ScreenUtils';

const kHomeChannelStore = '@home/kHomeChannelStore';
const { px2dp } = ScreenUtils;

class ChannelModules {
    @observable channelList = [];
    @observable channelHeight = 0;

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
            this.channelHeight = this.channelList.length > 0 ? px2dp(90) : 0;
            save(kHomeChannelStore, res.data);
        } catch (error) {
            console.log(error);
        }
    });
}

export const channelModules = new ChannelModules();
