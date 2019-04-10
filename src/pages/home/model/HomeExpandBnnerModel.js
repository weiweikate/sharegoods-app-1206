import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import ScreenUtils from '../../../utils/ScreenUtils';
import { Image } from 'react-native';

const { px2dp } = ScreenUtils;
const bannerWidth = ScreenUtils.width;

class HomeExpandBnnerModel {
    @observable banner = [];
    @observable adHeights = new Map();
    @observable expandHeight = 0;

    imgUrls = [];

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
        this.expandHeight = 0;
        this.imgUrls = [];
        if (list.length > 0) {
            list.map((val, index) => {
                let url = val.image;
                this.imgUrls.push(url);
                if (!this.adHeights.has(url)) {
                    Image.getSize(url, (width, height) => {
                        let h = (bannerWidth * height) / width;
                        this.adHeights.set(url, h);
                        this.adHeights.forEach((value, key, map) => {
                            if (this.imgUrls.indexOf(key) >= 0 && value > 0) {
                                this.expandHeight += value + px2dp(15);
                            }
                        });
                    });
                }
            });
        }
    };
}

export const homeExpandBnnerModel = new HomeExpandBnnerModel();
