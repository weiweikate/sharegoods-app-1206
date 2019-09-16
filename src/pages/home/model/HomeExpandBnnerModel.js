import { action, flow, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import ScreenUtils from '../../../utils/ScreenUtils';
import { homeModule } from './Modules';
import store from '@mr/rn-store';
import { getSize } from '../../../utils/OssHelper';

const { px2dp } = ScreenUtils;
const bannerWidth = ScreenUtils.width;
const kHomeExpandStore = '@home/kHomeExpandStore';

class HomeExpandBnnerModel {
    @observable expBannerList = [];
    @observable adHeights = new Map();
    @observable bannerHeight = 0;

    imgUrls = [];

    @action getBannerHeight() {
        let h = 0;
        this.adHeights.forEach((value, key, map) => {
            if (this.imgUrls.indexOf(key) >= 0 && value > 0) {
                h += value + px2dp(15);
            }
        });
        if (h > 0) {
            h -= px2dp(15);
        }
        this.bannerHeight = h;
        homeModule.changeHomeList(homeType.expandBanner, this.expBannerList);
    }

    @action loadBannerList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeExpandStore);
                if (storeRes) {
                    this.handleExpnadHeight(storeRes || []);
                }
            }
            const bannerRes = yield HomeApi.getHomeData({ type: homeType.expandBanner });
            this.handleExpnadHeight(bannerRes.data || []);
            store.save(kHomeExpandStore, bannerRes.data || []);
        } catch (error) {
            console.log(error);
        }
    });

    handleExpnadHeight = (bannerList) => {
        this.imgUrls = [];
        if (bannerList.length > 0) {
            let expBanner = {
                itemData: bannerList,
                id: 4,
                type: homeType.expandBanner
            };
            this.expBannerList = [];
            this.expBannerList.push(expBanner);
            bannerList.map((val, index) => {
                let url = val.image;
                this.imgUrls.push(url);
                if (!this.adHeights.has(url)) {
                    getSize(url, (width, height) => {
                        let h = (bannerWidth * height) / width;
                        this.adHeights.set(url, h);
                        this.getBannerHeight();
                    });
                }
            });
        } else {
            this.expBannerList = [];
        }
        this.getBannerHeight();
    };
}

export const homeExpandBnnerModel = new HomeExpandBnnerModel();

