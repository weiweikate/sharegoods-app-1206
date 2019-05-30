import { observable, action, flow } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType, homeRoute, homeLinkType } from '../HomeTypes';
import { bannerModule } from './HomeBannerModel';
import { homeFocusAdModel } from './HomeFocusAdModel';
import { homeExpandBnnerModel } from './HomeExpandBnnerModel';
import { todayModule } from './HomeTodayModel';
import { channelModules } from './HomeChannelModel';
import { subjectModule } from './HomeSubjectModel';
import { recommendModule } from './HomeRecommendModel';
import { categoryModule } from './HomeCategoryModel';
import { limitGoModule } from './HomeLimitGoModel';
import taskModel from './TaskModel';

//首页modules
class HomeModule {
    @observable homeList = [];
    @observable selectedTypeCode = null;
    @observable isRefreshing = false;
    @observable isFocused = false;
    @observable goodsOtherLen = 0;
    lastGoods = null;
    isFetching = false;
    isEnd = false;
    page = 1;
    firstLoad = true;
    errorMsg = '';
    //解析路由
    @action homeNavigate = (linkType, linkTypeCode) => {
        this.selectedTypeCode = linkTypeCode;
        if (linkType === homeLinkType.page) {
            return linkTypeCode ? linkTypeCode.replace(/[\n]/g, '').trim() : '';
        } else if (linkType === homeLinkType.nothing) {
            return;
        } else {
            return homeRoute[linkType];
        }
    };
    //获取参数
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
        const { linkType } = data;
        return {
            activityType: linkType === 3 ? 2 : linkType === 4 ? 1 : 3,
            activityCode: data.linkTypeCode,
            linkTypeCode: data.linkTypeCode,
            productCode: data.linkTypeCode,
            productType: productType,
            storeCode: data.linkTypeCode,
            categoryId: data.linkTypeCode,
            uri: data.linkTypeCode,
            id: data.id,
            code: data.linkTypeCode,
            keywords: data.name
        };

    };
    @action changeHomeList = (type) => {
        this.homeList = this.homeList.map((item) => {
            return ({ ...item });
        });
    };

    @action refreshHome = (type) => {
        switch (type) {
            case homeType.swiper:
                bannerModule.loadBannerList(this.firstLoad);
                break;
            case homeType.channel:
                channelModules.loadChannel(this.firstLoad);
                break;
            case homeType.expandBanner:
                homeExpandBnnerModel.loadBannerList();
                break;
            case homeType.focusGrid:
                homeFocusAdModel.loadAdList();
                break;
            case homeType.today:
                todayModule.loadTodayList(this.firstLoad);
                break;
            case homeType.fine:
                recommendModule.loadRecommendList(this.firstLoad);
                break;
            case homeType.limitGo:
                limitGoModule.loadLimitGo();
                break;
            case homeType.homeHot:
                subjectModule.loadSubjectList(this.firstLoad);
                break;
            default:
                break;
        }
    };

    //加载为你推荐列表
    @action loadHomeList = flow(function* () {
        this.isRefreshing = true;
        setTimeout(() => {
            this.isRefreshing = false;
        }, 1000);

        // 首页类目
        categoryModule.loadCategoryList();
        // 首页顶部轮播图
        bannerModule.loadBannerList(this.firstLoad);
        // 首页频道类目
        channelModules.loadChannel(this.firstLoad);
        // 首页通栏
        homeExpandBnnerModel.loadBannerList(this.firstLoad);
        // 首焦点广告
        homeFocusAdModel.loadAdList();
        // 首页限时秒杀
        limitGoModule.loadLimitGo();
        // 首页今日榜单
        todayModule.loadTodayList(this.firstLoad);
        // 首页精品推荐
        recommendModule.loadRecommendList(this.firstLoad);
        // 超值热卖
        subjectModule.loadSubjectList(this.firstLoad);

        taskModel.getData();

        this.page = 1;
        this.isEnd = false;
        this.homeList = [{
            id: 0,
            type: homeType.category
        }, {
            id: 1,
            type: homeType.swiper
        }, {
            id: 2,
            type: homeType.user
        }, {
            id: 12,
            type: homeType.task
        }, {
            id: 3,
            type: homeType.channel
        }, {
            id: 4,
            type: homeType.expandBanner
        }, {
            id: 5,
            type: homeType.focusGrid
        }, {
            id: 6,
            type: homeType.limitGo
        }, {
            id: 7,
            type: homeType.star
        }, {
            id: 8,
            type: homeType.today
        }, {
            id: 9,
            type: homeType.fine
        }, {
            id: 10,
            type: homeType.homeHot
        }];
        if (this.isFetching === true) {
            return;
        }
        try {
            this.isFetching = true;
            const result = yield HomeApi.getGoodsInHome({ page: this.page });
            let list = result.data.data || [];
            if (this.page === result.data.totalPage || result.data.totalPage === 0) {
                this.isEnd = true;
            }
            let home = [];
            if (list.length > 0) {
                home.push({
                    id: 11,
                    type: homeType.goodsTitle
                });
            }
            let itemData = [];
            for (let i = 0, len = list.length; i < len; i++) {
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
            this.goodsOtherLen = this.homeList.length;
            this.homeList = [...this.homeList, ...home];
            this.isFetching = false;
            this.isRefreshing = false;
            this.page++;
            this.firstLoad = false;
            this.errorMsg = '';
        } catch (error) {
            this.isFetching = false;
            this.isRefreshing = false;
            this.errorMsg = error.msg;
            console.log(error);
        }
    });

    //加载为你推荐列表
    @action loadMoreHomeList = flow(function* () {
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
            const timeStamp = new Date().getTime();
            this.isFetching = true;
            const result = yield HomeApi.getGoodsInHome({ page: this.page });
            this.isFetching = false;
            let list = result.data.data || [];
            if (this.page === result.data.totalPage) {
                this.isEnd = true;
            }
            let itemData = [];
            let home = [];
            for (let i = 0, len = list.length; i < len; i++) {
                if (i % 2 === 1) {
                    let good = list[i];
                    itemData.push(good);
                    home.push({
                        itemData: itemData,
                        type: homeType.goods,
                        id: 'goods' + good.linkTypeCode + i + timeStamp
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
            this.homeList = this.homeList.concat(home);
            this.page++;
            this.isFetching = false;
            this.errorMsg = '';
        } catch (error) {
            this.isFetching = false;
            this.isRefreshing = false;
            this.errorMsg = error.msg;
            console.log(error);
        }

    });

    bannerPoint = (item, location, index) => ({
        bannerName: item.imgUrl || '',
        bannerId: item.id,
        bannerRank: index,
        bannerType: item.linkType,
        bannerContent: item.linkTypeCode,
        bannerLocation: location ? location : 0
    });

    @action homeFocused = (focuse) => {
        this.isFocused = focuse;
    };
}

export const homeModule = new HomeModule();



