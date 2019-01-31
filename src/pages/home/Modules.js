import { observable, computed, action, flow } from 'mobx';
import HomeApi from './api/HomeAPI';
import { homeType, homeRoute } from './HomeTypes';
import { bannerModule } from './HomeBannerModel';
import { adModules } from './HomeAdModel';
import { starShopModule } from './HomeStarShopModel';
import { todayModule } from './HomeTodayModel';
import { subjectModule } from './HomeSubjectModel';
import { recommendModule } from './HomeRecommendModel';
import OssHelper from '../../utils/OssHelper';
import res from './res';

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
        let classifys = [{
            icon: shareImg,
            img: OssHelper('/app/share%403x.png'),
            name: '分享',
            id: 1,
            route: 'topic/DownPricePage',
            linkTypeCode: 'ZT2018000003'
        }, {
            icon: showImg,
            img: OssHelper('/app/show%403x.png'),
            name: '秀场',
            id: 1,
            route: 'show/ShowListPage'
        }, {
            icon: signinImg,
            img: OssHelper('/app/signin%403x.png'),
            name: '签到',
            id: 1,
            route: 'home/signIn/SignInPage',
            needLogin: 1
        }, {
            icon: schoolImg,
            img: OssHelper('/app/school%403x.png'),
            name: '必看',
            id: 1,
            linkTypeCode: 'FX181226000001',
            route: 'show/ShowDetailPage'
        }, {
            icon: spikeImg,
            img: OssHelper('/app/spike%403x.png'),
            name: '秒杀',
            id: 1,
            route: 'topic/DownPricePage',
            linkTypeCode: 'ZT2018000002'
        }];
        HomeApi.classify().then(resData => {
            if (resData.code === 10000 && resData.data) {
                let resClassifys = resData.data;
                resClassifys.map((data) => {
                    if (data.name === '全部分类') {
                        data.route = 'home/search/CategorySearchPage';
                    } else {
                        data.route = 'home/search/SearchResultPage';
                    }
                });
                this.classifyList = classifys.concat(resClassifys);
            }
        });
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
    errorMsg = '';

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
        bannerModule.loadBannerList(this.firstLoad);
        todayModule.loadTodayList(this.firstLoad);
        adModules.loadAdList(this.firstLoad);
        classifyModules.loadClassifyList();
        starShopModule.loadShopList(this.firstLoad);
        recommendModule.loadRecommendList(this.firstLoad);
        subjectModule.loadSubjectList(this.firstLoad);
        this.page = 1;
        this.isEnd = false;
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
            const result = yield HomeApi.getGoodsInHome({ page: this.page });
            let list = result.data.data;
            console.log('loadhomelist', list);
            let home = [];
            if (list.length > 0) {
                home.push({
                    id: 9,
                    type: homeType.goodsTitle
                });
            }
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
            const timeStamp = new Date().getTime();
            this.isFetching = true;
            const result = yield HomeApi.getGoodsInHome({ page: this.page });
            this.isFetching = false;
            let list = result.data.data;
            if (list.length < 10) {
                this.isEnd = true;
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
            // this.isFetching = false;
            // this.isEnd = false;
        } catch (error) {
            this.errorMsg = error.msg;
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



