import { observable, flow, action, computed } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType } from './HomeTypes';
import { get, save } from '@mr/rn-store';
import ScreenUtils from '../../utils/ScreenUtils';

const kHomeAdStore = '@home/kHomeAdStore';
const { px2dp } = ScreenUtils;
const kAdWidth = (ScreenUtils.width - px2dp(35)) / 2;
const kAdHeight = kAdWidth * (160 / 340);

class AdModules {
    @observable ad = [];
    @observable banner = [];
    @observable adHeights = new Map();
    @observable notExistAdUrls = [];

    adUrls = [];

    @computed get adHeight() {
        let h = kAdHeight * 2 + px2dp(15);
        if (this.banner.length === 0) {
            h += px2dp(5);
        } else {
            h -= px2dp(5);
        }
        this.adHeights.forEach((value, key, map) => {
            if (value > 0) {
                h += value + px2dp(15);
            }
        });
        return h;
    }

    @action loadAdList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield get(kHomeAdStore);
                if (storeRes) {
                    this.ad = storeRes;
                }
            }

            const res = yield HomeApi.getAd({ type: homeType.ad });
            this.ad = res.data;
            save(kHomeAdStore, res.data);
            const bannerRes = yield HomeApi.getBanner({ type: homeType.banner });
            this.banner = bannerRes.data;
            if (this.banner.length === 0) {
                this.adHeights.clear();
                this.adUrls.length = 0;
                this.notExistAdUrls.length = 0;
            } else {
                // 先清空
                this.adUrls.length = 0;
                // 再重新赋值
                this.banner.map((data) => {
                    this.adUrls.push(data.imgUrl);
                });
                this.notExistAdUrls.length = 0;
                // 赋值adHeights
                this.deleteNotExist();
            }
        } catch (error) {
            console.log(error);
        }
    });

    @action
    deleteNotExist = () => {
        let arrTemp = this.adHeights;
        let notExist = this.adUrls;
        arrTemp.forEach((value, key, map) => {
            let urlIndex = this.adUrls.indexOf(key);
            if (urlIndex === -1) {
                // 不存在的，删除
                this.adHeights.delete(key);
            } else {
                notExist.splice(urlIndex, 1);
            }
        });
        this.notExistAdUrls = notExist;
    };
}

export const adModules = new AdModules();
