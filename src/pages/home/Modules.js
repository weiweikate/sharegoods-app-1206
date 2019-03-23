import { observable, action, flow } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType, homeRoute } from './HomeTypes';
import { bannerModule } from './HomeBannerModel';
import { adModules } from './HomeAdModel';
import { todayModule } from './HomeTodayModel';
import { subjectModule } from './HomeSubjectModel';
import { recommendModule } from './HomeRecommendModel';
import { categoryModule } from './HomeCategoryModel';
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
    isFetching = false;
    isEnd = false;
    page = 1;
    firstLoad = true;
    errorMsg = '';
    goodsIndex = 0
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
    loadHomeList = flow(function* () {
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
            id: 3,
            type: homeType.classify
        }, {
            id: 4,
            type: homeType.ad
        }, {
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
            this.goodsIndex = 0
            const result = yield HomeApi.getGoodsInHome({ page: this.page });
            let list = result.data.data;
            let home = [];
            if (list.length > 0) {
                home.push({
                    id: 9,
                    type: homeType.goodsTitle
                });
            }
            for (let i = 0; i < list.length; i++) {
                home.push({
                    itemData: list[i],
                    type: homeType.goods,
                    id: 'goods' + i,
                    goodsIndex: this.goodsIndex ++
                });
            }
            this.homeList = [...this.homeList, ...home];
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
    loadMoreHomeList = flow(function* () {
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
            let list = result.data.data;
            console.log('home list is', list)
            if (list.length <= 0) {
                console.log('home list is end')
                this.isEnd = true;
            }
            let home = [];
            for (let i = 0; i < list.length; i++) {
                home.push({
                    itemData: list[i],
                    type: homeType.goods,
                    id: 'goods' + i + timeStamp,
                    goodsIndex:  this.goodsIndex ++
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
        }
    });

    bannerPoint = (item, location) => ({
        bannerName: item.imgUrl,
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



