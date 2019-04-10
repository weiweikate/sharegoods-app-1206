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

    imgUrls = [];

    @computed get getExpandHeight() {
        let h = 0;
        this.adHeights.forEach((value, key, map) => {
            if (this.imgUrls.indexOf(key) >= 0 && value > 0) {
                h += value + px2dp(15);
            }
        });
        return h;
    }

    @action loadBannerList = flow(function* () {
        try {
            const bannerRes = yield HomeApi.getHomeData({ type: homeType.expandBanner });
            this.banner = bannerRes.data || [];
            this.handleExpnadHeight(this.banner);
        } catch (error) {
            console.log(error);
        }
    });

    handleExpnadHeight = (list) => {
        this.imgUrls = [];
        if (list.length > 0) {
            list.map((val, index) => {
                let url = val.image;
                this.imgUrls.push(url);
                if (!this.adHeights.has(url)) {
                    Image.getSize(url, (width, height) => {
                        let h = (bannerWidth * height) / width;
                        this.adHeights.set(url, h);
                    });
                }
            });
        } else {
            this.adHeights.clear();
        }
    };
}

export const homeExpandBnnerModel = new HomeExpandBnnerModel();
