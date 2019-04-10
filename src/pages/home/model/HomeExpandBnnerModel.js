import { observable, flow, action, computed } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import ScreenUtils from '../../../utils/ScreenUtils';
import { Image } from 'react-native';

const { px2dp } = ScreenUtils;
const bannerWidth = ScreenUtils.width;

class HomeExpandBnnerModel {
    @observable banner = [];
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
        this.bannerHeight = h ;
    }

    @action loadBannerList = flow(function* () {
        try {
            const bannerRes = yield HomeApi.getHomeData({ type: homeType.expandBanner });
            this.banner = bannerRes.data || [];
            this.handleExpnadHeight();
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
                        this.getBannerHeight();
                    });
                }
            });
        }
            this.getBannerHeight();
    };
}

export const homeExpandBnnerModel = new HomeExpandBnnerModel();
