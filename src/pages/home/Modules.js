import { observable, action, flow } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType, homeRoute } from './HomeTypes';
import { bannerModule } from './HomeBannerModel';
import { adModules } from './HomeAdModel';
import { todayModule } from './HomeTodayModel';
import { subjectModule } from './HomeSubjectModel';
import { recommendModule } from './HomeRecommendModel';
import { categoryModule } from './HomeCategoryModel';
import { limitGoModule } from './HomeLimitGoModel'
import res from './res';
import OssHelper from '../../utils/OssHelper';

const {
    school: schoolImg,
    show: showImg,
    share_icon: shareImg,
    signin: signinImg,
    spike: spikeImg
} = res;

class ClassifyModules {
    @observable classifyList = [];

    @action loadClassifyList = () => {
        this.classifyList = [{
            icon: shareImg,
            img: OssHelper('/app/share11.png'),
            name: '升级',
            id: 1,
            route: 'topic/DownPricePage',
            linkTypeCode: 'ZT2019000029'
        }, {
            icon: showImg,
            img: OssHelper('/app/show11.png'),
            name: '秀场',
            id: 1,
            route: 'show/ShowListPage'
        }, {
            icon: signinImg,
            img: OssHelper('/app/signin11.png'),
            name: '签到',
            id: 1,
            route: 'home/signIn/SignInPage',
            needLogin: 1
        }, {
            icon: schoolImg,
            img: OssHelper('/app/school11.png'),
            name: '必看',
            id: 1,
            linkTypeCode: 'FX181226000001',
            route: 'show/ShowDetailPage'
        }, {
            icon: spikeImg,
            img: OssHelper('/app/spike11.png'),
            name: '秒杀',
            id: 1,
            route: 'topic/DownPricePage',
            linkTypeCode: 'ZT2018000002'
        }];

    };
}

export const classifyModules = new ClassifyModules();

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
        categoryModule.loadCategoryList();
        bannerModule.loadBannerList(this.firstLoad);
        todayModule.loadTodayList(this.firstLoad);
        adModules.loadAdList(this.firstLoad);
        classifyModules.loadClassifyList();
        subjectModule.loadSubjectList(this.firstLoad);
        recommendModule.loadRecommendList(this.firstLoad);
        limitGoModule.loadLimitGo()
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
            type: homeType.classify
        }, {
            id: 4,
            type: homeType.ad
        }, {
            id: 9,
            type: homeType.limitGo
        },{
            id: 5,
            type: homeType.starShop
        }, {
            id: 6,
            type: homeType.today
        }, {
            id: 7,
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
            this.goodsIndex = 0;
            const result = yield HomeApi.getGoodsInHome({ page: this.page });
            let list = result.data.data;
            let home = [];
            if (list.length > 0) {
                home.push({
                    id: 9,
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
        this.isFetching = false;
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

        console.log('loadMoreHomeList', goods, this.isEnd);
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



