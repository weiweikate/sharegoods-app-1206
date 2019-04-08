import { observable, action, flow } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeType, homeRoute } from '../HomeTypes';
import { bannerModule } from './HomeBannerModel';
import { homeFocusAdModel } from './HomeFocusAdModel';
import { homeExpandBnnerModel } from './HomeExpandBnnerModel';
import { todayModule } from './HomeTodayModel';
import { channelModules } from './HomeChannelModel';
import { subjectModule } from './HomeSubjectModel';
import { recommendModule } from './HomeRecommendModel';
import { categoryModule } from './HomeCategoryModel';
import { limitGoModule } from './HomeLimitGoModel';

//首页modules
class HomeModule {
    @observable homeList = [];
    @observable selectedTypeCode = null;
    @observable isRefreshing = false;
    @observable isFocused = false;
    lastGoods = null;
    isFetching = false;
    isEnd = false;
    page = 1;
    firstLoad = true;
    errorMsg = '';
    goodsIndex = 0;
    //解析路由
    @action homeNavigate = (linkType, linkTypeCode) => {
        this.selectedTypeCode = linkTypeCode;
        return homeRoute[linkType];
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

        const { storeDTO } = data;
        let storeCode = 0;
        if (storeDTO) {
            storeCode = storeDTO.storeNumber;
        }

        const { linkType } = data;
        return {
            activityType: linkType === 3 ? 2 : linkType === 4 ? 1 : 3,
            activityCode: data.linkTypeCode,
            linkTypeCode: data.linkTypeCode,
            productCode: data.linkTypeCode,
            productType: productType,
            storeCode: storeCode,
            uri: data.linkTypeCode,
            id: data.showId,
            code: data.linkTypeCode
        };

    };

    //加载为你推荐列表
    @action loadHomeList = flow(function* () {
        this.isRefreshing = true;
        setTimeout(() => {
            this.isRefreshing = false;
        }, 2000);
        // 首页类目
        categoryModule.loadCategoryList();
        // 首页顶部轮播图
        bannerModule.loadBannerList(this.firstLoad);
        // 首页频道类目
        channelModules.loadChannel();
        // 首页通栏
        homeExpandBnnerModel.loadBannerList();
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

        this.page = 1;
        this.isEnd = false;
        this.lastGoods = null;
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
            this.goodsIndex = 0;
            const result = yield HomeApi.getGoodsInHome({ page: this.page });
            let list = result.data.data;
            if (this.page === result.data.totalPage) {
                this.isEnd = true;
            }
            let home = [];
            if (list.length > 0) {
                home.push({
                    id: 11,
                    type: homeType.goodsTitle
                });
            }
            this.homeList = this.homeList.concat(home);
            let goods = this.configure(list, 0);
            console.log('loadHomeList', goods);
            this.homeList = this.homeList.concat(goods);
            this.isFetching = false;
            this.isRefreshing = false;
            this.page++;
            this.firstLoad = false;
            this.errorMsg = '';
        } catch (error) {
            console.log(error);
            this.isFetching = false;
            this.isRefreshing = false;
            this.errorMsg = error.msg;
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
            this.loadMoreGoods();
        } catch (error) {
            this.isFetching = false;
            this.isRefreshing = false;
            this.errorMsg = error.msg;
        }
    });

    @action loadMoreGoods = flow(function* () {
        this.isFetching = true;
        const timeStamp = new Date().getTime();
        let list = [];
        if (this.lastGoods) {
            list.push(this.lastGoods);
            this.lastGoods = null;
        }
        const result = yield HomeApi.getGoodsInHome({ page: this.page });
        list = list.concat(result.data.data);
        if (this.page === result.data.totalPage) {
            this.isEnd = true;
        }
        let goods = this.configure(list, timeStamp);
        if (this.isEnd === true && this.lastGoods) {
            goods.push({
                itemData: [this.lastGoods],
                type: homeType.goods,
                id: 'goods' + (timeStamp ? timeStamp : 0)
            });
        }
        this.homeList = this.homeList.concat(goods);
        this.page++;
        this.isFetching = false;
        this.errorMsg = '';
        if (goods.length === 0 && this.isEnd === false) {
            this.loadMoreGoods();
        }
    });

    configure = (baseArray, timeStamp) => {
        let len = baseArray.length;
        let n = 2;
        let lineNum = 0;
        if (len % n === 0) {
            lineNum = len / n;
        } else {
            lineNum = Math.floor((len / n));
            this.lastGoods = baseArray[baseArray.length - 1];
        }
        let goodsRes = [];
        for (let i = 0; i < lineNum; i++) {
            let temp = baseArray.slice(i * n, i * n + n);
            goodsRes.push({
                itemData: temp,
                type: homeType.goods,
                id: 'goods' + i + (timeStamp ? timeStamp : 0)
            });
        }
        return goodsRes;
    };


    @action configureHomelist = (list, timeStamp) => {
        let timeline = [];
        for (let i = 0; i < list.length; i++) {
            timeline.push({
                itemData: list[i],
                type: homeType.goods,
                id: 'goods' + i + (timeStamp ? timeStamp : 0),
                goodsIndex: this.goodsIndex++
            });
        }
        return timeline;
    };

    bannerPoint = (item, location) => ({
        bannerName: item.imgUrl || '',
        bannerId: item.id,
        bannerRank: item.rank,
        bannerType: item.linkType,
        bannerContent: item.linkTypeCode,
        bannerLocation: location ? location : 0
    });

    @action homeFocused = (focuse) => {
        this.isFocused = focuse;
    };
}

export const homeModule = new HomeModule();



