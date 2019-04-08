import { observable, flow, action, computed } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType } from './HomeTypes';
import ScreenUtils from '../../utils/ScreenUtils';
import { Image } from 'react-native';

const { px2dp } = ScreenUtils;
const bannerWidth = ScreenUtils.width;

class HomeExpandBnnerModel {
    @observable banner = [];
    @observable adHeights = new Map();

    imgUrls = [];

    @computed get bannerHeight() {
        let h = 0;
        if (this.banner.length === 0) {
            h += px2dp(10);
        } else {
            h += px2dp(5);
        }
        this.adHeights.forEach((value, key, map) => {
            if (this.imgUrls.indexOf(key) >= 0 && value > 0) {
                h += value + px2dp(15);
            }
        });
        return h;
    }

    @action loadBannerList = flow(function* (isCache) {
        try {
            const bannerRes = yield HomeApi.getHomeData({ type: homeType.expandBanner });
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

export const homeExpandBnnerModel = new HomeExpandBnnerModel();
