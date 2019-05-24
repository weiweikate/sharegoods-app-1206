import { observable } from 'mobx';
import HomeAPI from '../../home/api/HomeAPI';
import { homeType } from '../../home/HomeTypes';

export default class MyShopDetailModel {
    @observable productList = [];
    @observable bottomBannerList = [];


    /*网络*/
    requestShopProducts() {
        HomeAPI.getHomeData({ type: homeType.shopProducts }).then((data) => {
            this.productList = data.data || [];
        });
    }

    requestShopBanner() {
        HomeAPI.getHomeData({ type: homeType.shopBanner }).then((data) => {
            this.bottomBannerList = data.data || [];
        });
    }
}
