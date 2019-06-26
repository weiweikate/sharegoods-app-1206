import { observable, flow, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType } from '../HomeTypes';
import ScreenUtils from '../../../utils/ScreenUtils';
import { Image } from 'react-native';
import { homeModule } from './Modules';
import store from '@mr/rn-store';
import HttpUtils from '../../../api/network/HttpUtils';

const { px2dp } = ScreenUtils;
const bannerWidth = ScreenUtils.width;
const kHomeExpandStore = '@home/kHomeExpandStore';

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
        if (h > 0) {
            h -= px2dp(15);
        }
        this.bannerHeight = h;
        homeModule.changeHomeList(homeType.expandBanner);
    }

    @action loadBannerList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeExpandStore);
                if (storeRes) {
                    this.banner = storeRes || [];
                    this.handleExpnadHeight();
                }
            }
            const bannerRes = yield HomeApi.getHomeData({ type: homeType.expandBanner });
            this.banner = bannerRes.data || [];
            this.handleExpnadHeight();
            store.save(kHomeExpandStore, this.banner);
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
                    url = url.split("？")[0]
                    HttpUtils.get(url+'?x-oss-process=image/info').then((data)=> {
                        let height = data.ImageHeight.value;
                        let width = data.ImageWidth.value;
                        let h = (bannerWidth * height) / width;
                        this.adHeights.set(url, h);
                        this.getBannerHeight();
                    })
                }
            });
        }
        this.getBannerHeight();
    };
}

export const homeExpandBnnerModel = new HomeExpandBnnerModel();

