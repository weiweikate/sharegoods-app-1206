import { observable, flow, action, computed } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType } from './HomeTypes';
import { get, save } from '@mr/rn-store';
import ScreenUtils from '../../utils/ScreenUtils';
import { Image } from 'react-native';

const kHomeAdStore = '@home/kHomeAdStore';
const { px2dp } = ScreenUtils;
const bannerWidth = ScreenUtils.width;
const kAdWidth = (ScreenUtils.width - px2dp(30)) / 2 - 0.5;
const kAdHeight = kAdWidth * (80 / 170) - 0.5;

class AdModules {
    @observable ad = [];
    @observable banner = [];
    @observable adHeights = new Map();

    imgUrls = [];

    @computed get adHeight() {
        let h = kAdHeight * 2;
        if (this.banner.length === 0) {
            h += px2dp(10);
        }
        this.adHeights.forEach((value, key, map) => {
            if (this.imgUrls.indexOf(key) >= 0 && value > 0) {
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
            this.imgUrls = [];
            if (this.banner.length > 0) {
                this.banner.map((val, index) => {
                    let url = val.imgUrl;
                    this.imgUrls.push(url);
                    if (!this.adHeights.has(url)) {
                        Image.getSize(url, (width, height) => {
                            let h = (bannerWidth * height) / width;
                            this.adHeights.set(url, h);
                        });
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    });
}

export const adModules = new AdModules();
