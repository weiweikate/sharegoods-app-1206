import { observable, computed, action, flow } from 'mobx';
import HomeApi from './api/HomeAPI';

export const homeType = {
    swiper: 1,           //轮播
    ad: 2,       //推荐
    subject: 6,         //专题
    starShop: 3,       //明星店铺
    today: 4,             //今日榜单
    recommend: 5,     //精品推荐
    goods: 8,
    other: 'other',
    classify: 'classify',
    goodsTitle: 'goodsTitle',
    user: 'user',
    show: 'show'            //秀场
};

export class BannerModules {
    @observable bannerList = [];

    @computed get bannerCount() {
        return this.bannerList.length;
    }

    @observable opacity = 1;

    @action
    loadBannerList = flow(function* () {
        try {
            const res = yield HomeApi.getSwipers({ type: homeType.swiper });
            this.opacity = res.data && res.data.length > 0 ? 0 : 1;
            this.bannerList = res.data;
        } catch (error) {
            console.log(error);
        }
    });
}

export const bannerModule = new BannerModules();

class AdModules {
    @observable ad = [];
    loadAdList = flow(function* () {
        try {
            const res = yield HomeApi.getAd({ type: homeType.ad });
            this.ad = res.data;
        } catch (error) {
            console.log(error);
        }
    });
}

export const adModules = new AdModules()

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
            route: 'home/search/CategorySearchPage'
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
            route: 'home/search/CategorySearchPage'
        }, {
            icon: spikeImg,
            name: '秒杀',
            id: 1,
            route: 'home/search/CategorySearchPage'
        }];

        HomeApi.classify().then(res => {
            if (res.code === 10000 && res.data) {
                let classifys = [...this.classifyList, ...res.data]
                if (classifys[9]) {
                    classifys[9].route = 'home/search/CategorySearchPage'
                }
                this.classifyList = classifys
            }
        })
    };
}

export const classifyModules = new ClassifyModules()

class StarShopModule {
    @observable shopList = [];

    loadShopList = flow(function* () {
        try {
            const res = yield HomeApi.getStarShop({ type: homeType.starShop });
            this.shopList = res.data;
        } catch (error) {
            console.log(error);
        }
    });
}

export const starShopModule = new StarShopModule()

//今日榜单
class TodayModule {
    @observable todayList = [];
    loadTodayList = flow(function* () {
        try {
            const res = yield HomeApi.getTodays({ type: homeType.today });
            this.todayList = res.data;
        } catch (error) {
            console.log(error);
        }
    });
}

export const todayModule = new TodayModule()

//精品推荐
class RecommendModule {
    @observable recommendList = [];
    loadRecommendList = flow(function* () {
        try {
            const res = yield HomeApi.getRecommends({ type: homeType.recommend });
            this.recommendList = res.data;
        } catch (error) {
            console.log(error);
        }
    });
}

export const recommendModule = new RecommendModule()

//专题
class SubjectModule {
    @observable subjectList = [];
    //记载专题
    loadSubjectList = flow(function* () {
        try {
            const res = yield HomeApi.getSubject({ type: homeType.subject });
            this.subjectList = res.data;
        } catch (error) {
            console.log(error);
        }
    });
}

export const subjectModule = new SubjectModule()

const homeLinkType = {
    good: 1,
    subject: 2,
    down: 3,
    spike: 4,
    package: 5,
    store: 8
};

const homeRoute = {
    [homeLinkType.good]: 'home/product/ProductDetailPage',
    [homeLinkType.subject]: 'topic/DownPricePage',
    [homeLinkType.down]: 'topic/TopicDetailPage',
    [homeLinkType.spike]: 'topic/TopicDetailPage',
    [homeLinkType.package]: 'topic/TopicDetailPage',
    [homeLinkType.store]: 'spellShop/MyShop_RecruitPage'
};

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
    loadHomeList = flow(function* () {
        this.isRefreshing = true;
        setTimeout(() => {
            this.isRefreshing = false;
        }, 3000);
        bannerModule.loadBannerList()
        todayModule.loadTodayList()
        adModules.loadAdList()
        classifyModules.loadClassifyList()
        starShopModule.loadShopList()
        recommendModule.loadRecommendList()
        subjectModule.loadSubjectList()
        this.page = 1;
        this.homeList = [{
            id: 0,
            type: homeType.swiper
        }, {
            id: 1,
            type: homeType.classify
        }, {
            id: 2,
            type: homeType.user
        }, {
            id: 3,
            type: homeType.ad
        }, {
            id: 4,
            type: homeType.show
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
                })
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
        console.log('loadMoreHomeList', this.isFetching, this.isEnd, this.firstLoad)
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
                })
            }
            this.homeList = [...this.homeList, ...home];
            this.page++;
            this.isFetching = false
            this.isEnd = false
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

    //选择专题
    loadMembersInfo = flow(function* () {
        try {
            const res = yield HomeApi.getMembers();
            console.log('loadMembersInfo', res.data);
            this.memberLevels = res.data;
        } catch (error) {
            console.log(error);
        }
    });
}



