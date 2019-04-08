import { observable, flow, action, computed } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import ScreenUtils from '../../../utils/ScreenUtils';
import { Image } from 'react-native';
import { get, save } from '@mr/rn-store';

const kHomeExpandStore = '@home/kHomeRecommendStore';
const { px2dp } = ScreenUtils;
const bannerWidth = ScreenUtils.width;

class HomeExpandBnnerModel {
    @observable banner = [];
    @observable adHeights = new Map();

    imgUrls = [];

    @computed get bannerHeight() {
        let h = 0;
        this.adHeights.forEach((value, key, map) => {
            if (this.imgUrls.indexOf(key) >= 0 && value > 0) {
                h += value + px2dp(15);
            }
        });
        return h;
    }

    @action loadBannerList = flow(function* (isCache) {
        console.log('-------')
        try {
            if (isCache) {
                const storeRes = yield get(kHomeExpandStore);
                if (storeRes) {
                    this.banner = storeRes || [];
                    this.handleExpnadHeight();
                }
            }
            const bannerRes = yield HomeApi.getHomeData({ type: homeType.expandBanner });
            this.banner = bannerRes.data || [];
            this.handleExpnadHeight();
            save(kHomeExpandStore, bannerRes.data);
        } catch (error) {
            console.log(error);
        }
    });

    handleExpnadHeight = () => {
        this.imgUrls = [];
        if (this.banner.length > 0) {
            this.banner.map((val, index) => {
                let url = val.image;
                this.imgUrls.push(url);
                if (!this.adHeights.has(url)) {
                    Image.getSize(url, (width, height) => {
                        let h = (bannerWidth * height) / width;
                        this.adHeights.set(url, h);
                    });
                }
            });
        }
    };
}

export const homeExpandBnnerModel = new HomeExpandBnnerModel();
