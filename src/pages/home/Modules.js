import { observable, computed, action, flow } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType, homeRoute }  from './HomeTypes'
import { bannerModule } from './HomeBannerModel'
import { adModules } from './HomeAdModel'
import { starShopModule } from './HomeStarShopModel'
import { todayModule } from './HomeTodayModel'
import { subjectModule } from './HomeSubjectModel'
import { recommendModule } from './HomeRecommendModel'
import schoolImg from './res/school.png';
import showImg from './res/show.png';
import shareImg from './res/share.png';
import signinImg from './res/signin.png';
import spikeImg from './res/spike.png';

class ClassifyModules {
    @observable classifyList = [];
    @action loadClassifyList = () => {
        this.classifyList = [{
            icon: shareImg,
            name: '分享',
            id: 1,
            route: 'topic/DownPricePage',
            linkTypeCode: 'ZT2018000019'
        }, {
            icon: showImg,
            name: '秀场',
            id: 1,
            route: 'show/ShowListPage'
        }, {
            icon: signinImg,
            name: '签到',
            id: 1,
            route: 'home/signIn/SignInPage',
            needLogin: 1
        }, {
            icon: schoolImg,
            name: '必看',
            id: 1,
            route: 'show/ShowDetailPage'
        }, {
            icon: spikeImg,
            name: '秒杀',
            id: 1,
            route: 'topic/DownPricePage',
            linkTypeCode: 'ZT2018000012'
        }];
    };
}

export const classifyModules = new ClassifyModules();

//首页modules
class HomeModule {
    @observable homeList = [];
    @observable selectedTypeCode = null;
    @observable isRefreshing = false;
    isFetching = false;
    isEnd = false;
    page = 1;
    firstLoad = true;

    @action homeNavigate = (linkType, linkTypeCode) => {
        this.selectedTypeCode = linkTypeCode;
        return homeRoute[linkType];
    };

    @action paramsNavigate = (data) => {
        const { topicBannerProductDTOList } = data;
        let product = null;
        let productType = '';
        if (topicBannerProductDTOList) {
            product = topicBannerProductDTOList[0];
            if (product) {
                productType = product.productType;
            }
        }

        const { storeDTO } = data;
        let storeId = 0;
        if (storeDTO) {
            storeId = storeDTO.id;
        }

        const { linkType } = data;
        return {
            activityType: linkType === 3 ? 2 : linkType === 4 ? 1 : 3,
            activityCode: data.linkTypeCode,
            linkTypeCode: data.linkTypeCode,
            productCode: data.linkTypeCode,
            productType: productType,
            storeId: storeId
        };

    };

    //加载为你推荐列表
    loadHomeList = flow(function* (isCache) {
        this.isRefreshing = true;
        setTimeout(() => {
            this.isRefreshing = false;
        }, 2000);
        bannerModule.loadBannerList(isCache);
        todayModule.loadTodayList(isCache);
        adModules.loadAdList(isCache);
        classifyModules.loadClassifyList();
        starShopModule.loadShopList(isCache);
        recommendModule.loadRecommendList(isCache);
        subjectModule.loadSubjectList(isCache);
        this.page = 1;
        this.homeList = [{
            id: 0,
            type: homeType.swiper
        }, {
            id: 2,
            type: homeType.user
        }, {
            id: 1,
            type: homeType.classify
        }, {
            id: 3,
            type: homeType.ad
        }, {
            id: 7,
            type: homeType.starShop
        }, {
            id: 5,
            type: homeType.today
        }, {
            id: 6,
            type: homeType.recommend
        }, {
            id: 8,
            type: homeType.subject
        }];

        if (this.isFetching === true) {
            return;
        }

        try {
            this.isFetching = true;
            const res = yield HomeApi.getGoodsInHome({ page: this.page });
            let list = res.data.data;
            console.log('loadhomelist', list);
            let home = [{
                id: 9,
                type: homeType.goodsTitle
            }];
            let itemData = [];
            for (let i = 0; i < list.length; i++) {
                if (i % 2 === 1) {
                    let good = list[i];
                    itemData.push(good);
                    home.push({
                        itemData: itemData,
                        type: homeType.goods,
                        id: 'goods' + i
                    });
                    itemData = [];
                } else {
                    itemData.push(list[i]);
                }
            }
            if (itemData.length > 0) {
                home.push({
                    itemData: itemData,
                    type: homeType.goods,
                    id: 'goods'
                });
            }
            this.homeList = [...this.homeList, ...home];
            this.isFetching = false;
            this.isRefreshing = false;
            this.page++;
            this.firstLoad = false;
        } catch (error) {
            console.log(error);
            this.isFetching = false;
            this.isRefreshing = false;
        }
    });

    //加载为你推荐列表
    loadMoreHomeList = flow(function* () {
        console.log('loadMoreHomeList', this.isFetching, this.isEnd, this.firstLoad);
        if (this.isFetching) {
            return;
        }
        if (this.isEnd) {
            return;
        }
        if (this.firstLoad) {
            return;
        }
        try {
            this.isFetching = true;
            const res = yield HomeApi.getGoodsInHome({ page: this.page });
            this.isFetching = false;
            let list = res.data.data;
            if (list.length <= 0) {
                this.isEnd = true;
                return;
            }
            let itemData = [];
            let home = [];
            for (let i = 0; i < list.length; i++) {
                if (i % 2 === 1) {
                    let good = list[i];
                    itemData.push(good);
                    home.push({
                        itemData: itemData,
                        type: homeType.goods,
                        id: 'goods' + good.linkTypeCode
                    });
                    itemData = [];
                } else {
                    itemData.push(list[i]);
                }
            }
            if (itemData.length > 0) {
                home.push({
                    itemData: itemData,
                    type: homeType.goods,
                    id: 'goods'
                });
            }
            this.homeList = [...this.homeList, ...home];
            this.page++;
            this.isFetching = false;
            this.isEnd = false;
        } catch (error) {
            console.log(error);
        }
    });
}

export const homeModule = new HomeModule();

export class MemberModule {
    @observable memberLevel = '';
    @observable memberLevels = [];

    @computed get levelCount() {
        return this.memberLevels.length;
    }

    @computed get totalExp() {
        let exp = 0;
        if (this.memberLevels.length > 0) {
            let lastLevel = this.memberLevels[this.memberLevels.length - 1];
            exp = lastLevel.upgradeExp;
            console.log('MemberModule', exp);
        }
        return exp;
    }

    @computed get levelNumber() {
        let level = [];
        if (this.memberLevels.length > 0) {
            let lastLevel = 0;
            this.memberLevels.map(value => {
                lastLevel = value.upgradeExp - lastLevel;
                level.push(lastLevel);
                lastLevel = value.upgradeExp;
            });
        }
        return level;
    }
}



