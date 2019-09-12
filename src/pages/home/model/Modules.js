import { action, flow, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeLinkType, homeRoute, homeType } from '../HomeTypes';
import { bannerModule } from './HomeBannerModel';
import { homeFocusAdModel } from './HomeFocusAdModel';
import { homeExpandBnnerModel } from './HomeExpandBnnerModel';
import { todayModule } from './HomeTodayModel';
import { channelModules } from './HomeChannelModel';
import { subjectModule } from './HomeSubjectModel';
import { recommendModule } from './HomeRecommendModel';
import { limitGoModule } from './HomeLimitGoModel';
import taskModel from './TaskModel';
import { tabModel } from './HomeTabModel';
import store from '@mr/rn-store';
import { ImageAdViewGetHeight } from '../view/TopicImageAdView';
import { GoodsCustomViewGetHeight } from '../view/GoodsCustomView';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import bridge from '../../../utils/bridge';

const autoSizeWidth = ScreenUtils.autoSizeWidth;
const kHomeTopTopic = '@home/topTopic';
const kHomeBottomTopic = '@home/bottomTopic';
const kHomeType = '@home/type';

//首页modules
class HomeModule {
    @observable homeList = [];
    @observable selectedTypeCode = null;
    @observable isRefreshing = false;
    @observable isFocused = false;
    @observable goodsOtherLen = 0;
    @observable tabList = [];
    @observable tabListIndex = 0;
    isFetching = false;
    isEnd = false;
    page = 1;
    firstLoad = true;
    errorMsg = '';
    tabId = '';
    // id数字不要轻易改，model有对应
    fixedPartOne = [{
        id: 0,
        type: homeType.swiper
    }, {
        id: 1,
        type: homeType.user
    }, {
        id: 2,
        type: homeType.channel
    }, {
        id: 3,
        type: homeType.task
    }, {
        id: 4,
        type: homeType.expandBanner
    }, {
        id: 5,
        type: homeType.focusGrid
    }];
    topTopice = [];
    fixedPartTwo = [{
        id: 6,
        type: homeType.limitGo
    }];
    bottomTopice = [];
    fixedPartThree = [{
        id: 7,
        type: homeType.today
    }, {
        id: 8,
        type: homeType.fine
    }, {
        id: 9,
        type: homeType.homeHot
    }, {
        id: 10,
        type: homeType.goodsTitle
    }];
    goods = [];

    type = 0;


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
        if (topicBannerProductDTOList && topicBannerProductDTOList.length > 0) {
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
            keywords: data.name,
            trackType: 1
        };

    };

    /**
     * 替换占位list
     * @param type view类型
     * @param list 对应的数组数据
     */
    @action changeHomeList = (type, list) => {
        if (list) {
            let startIndex = this.homeList.findIndex(item => {
                return item.type == type;
            });
            let len = 0;
            this.homeList.map(item => {
                if (item.type == type) {
                    len += 1;
                }
            });
            if (startIndex > -1) {
                this.homeList.splice(startIndex, len, ...list);
            }
        }
    };

    @action initHomeParams() {
        this.isFetching = false;
        this.isEnd = false;
        this.isRefreshing = false;
        this.firstLoad = true;
        limitGoModule.spikeList = [];
    }

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
                limitGoModule.loadLimitGo(false);
                break;
            case homeType.homeHot:
                subjectModule.loadSubjectList();
                break;
            default:
                break;
        }
    };


    getHomeListData = (topic) => {
        let home = [];
        if (this.type === 0) {
            home = [...this.fixedPartOne,
                ...this.topTopice,
                ...this.bottomTopice,
                ...this.fixedPartTwo,
                ...this.fixedPartThree,
                ...this.goods
            ];
        } else if (this.type === 2) {
            home = [...this.fixedPartOne,
                ...this.fixedPartTwo,
                ...this.topTopice,
                ...this.bottomTopice,
                ...this.fixedPartThree,
                ...this.goods
            ];
        } else {
            home = [...this.fixedPartOne,
                ...this.topTopice,
                ...this.fixedPartTwo,
                ...this.bottomTopice,
                ...this.fixedPartThree,
                ...this.goods
            ];
        }
        return home;
    };

    // 加载首页数据
    @action loadHomeList = flow(function* () {
        setTimeout(() => {
            this.isRefreshing = false;
        }, 1000);

        if (this.firstLoad) {
            try {
                this.type = yield store.get(kHomeType) || 0;
                let topTopice = yield store.get(kHomeTopTopic);
                this.topTopice = topTopice || [];
                let bottomTopice = yield store.get(kHomeBottomTopic);
                this.bottomTopice = bottomTopice || [];
            } catch (error) {
            }
        }
        this.getTopticData();
        //首页类目
        tabModel.loadTabList(this.firstLoad);
        // 首页顶部轮播图
        bannerModule.loadBannerList(this.firstLoad);
        // 首页频道类目
        channelModules.loadChannel(this.firstLoad);
        // 首页通栏
        homeExpandBnnerModel.loadBannerList(this.firstLoad);
        // 首焦点广告
        homeFocusAdModel.loadAdList();
        // 首页限时秒杀
        limitGoModule.loadLimitGo(true);
        // 首页今日榜单
        todayModule.loadTodayList(this.firstLoad);
        // 首页精品推荐
        recommendModule.loadRecommendList(this.firstLoad);
        // 超值热卖
        subjectModule.loadSubjectList();

        taskModel.getData();

        this.firstLoad = false;
        this.page = 1;
        this.isEnd = false;
        if (this.isFetching === true) {
            return;
        }
        if (this.homeList.length === 0) {
            this.homeList = this.getHomeListData();
        }
        try {
            const tabData = yield HomeApi.getTabList();
            this.tabList = tabData.data || [];
            if (this.tabList.length > 0) {
                if (this.tabId) {
                    let tabId = this.tabList[0].id;
                    let tabName = this.tabList[0].name;
                    let tabListIndex = 0;
                    this.tabList.forEach((item, index) => {
                        if (item.id === this.tabId) {
                            tabListIndex = index;
                            tabId = item.id;
                            tabName = item.name;
                        }
                    });
                    this.tabId = tabId;
                    this.tabName = tabName;
                    this.tabListIndex = tabListIndex;
                } else {
                    this.tabId = this.tabList[0].id;
                    this.tabName = this.tabList[0].name;
                    this.tabListIndex = 0;
                }
                this.getGoods();
            } else {
                this.isEnd = true;
            }
        } catch (error) {
            this.errorMsg = error.msg;
            this.isRefreshing = false;
        }
    });

    @action getGoods() {
        this.isEnd = false;
        HomeApi.getRecommendList({ tabId: this.tabId, 'page': 1, 'pageSize': 10 }).then(data => {
            let list = data.data.data || [];
            if (!data.data.isMore) {
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
                        id: 'goods' + good.recommendId + good.id
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
            let temp = this.homeList.filter((item) => {
                return item.type !== homeType.goods;
            });
            this.goodsOtherLen = temp.length;
            this.homeList = [...temp, ...home];
            this.goods = home;
            this.isRefreshing = false;
            this.page = 1;
            this.errorMsg = '';
        }).catch(err => {
            this.isRefreshing = false;
            this.errorMsg = err.msg;
        });
    }

    // 加载为你推荐列表
    @action loadMoreHomeList = flow(function* () {
        if (this.isFetching || this.isRefreshing) {
            return;
        }
        if (this.isEnd) {
            return;
        }
        if (StringUtils.isEmpty(this.tabId)) {
            return;
        }
        try {
            this.isFetching = true;
            const result = yield HomeApi.getRecommendList({ page: this.page + 1, tabId: this.tabId, pageSize: 10 });
            this.isFetching = false;
            let list = result.data.data || [];
            if (!result.data.isMore) {
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
                        id: 'goods' + good.recommendId + good.id
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
            this.goods = this.goods.concat(home);
            this.page += 1;
            this.isFetching = false;
            this.errorMsg = '';
            this.isRefreshing = false;
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

    @action tabSelect(index, tabId, tabName) {
        this.tabListIndex = index;
        this.tabId = tabId;
        this.tabName = tabName;
        this.getGoods();
    }

    @action getTopticData() {
        HomeApi.getHomeCustom({}).then((data) => {
            data = data.data || [];
            let i = 0;
            let top = true;
            let bottom = true;
            data.forEach((item, index) => {
                let code = item.code;
                if (code === 'placeholder') {
                    this.type = 2 - index;
                    store.save(kHomeType, this.type);
                    return;
                }
                i++;
                let isTop = i === 1;
                if (isTop) {
                    top = false;
                } else {
                    bottom = false;
                }
                HomeApi.getCustomTopic({ topicCode: code, page: 1, pageSize: 10 }).then((data) => {
                    if (isTop) {
                        this.topTopice = this.handleData(data, isTop);
                        store.save(kHomeTopTopic, this.topTopice);
                    } else {
                        this.bottomTopice = this.handleData(data);
                        store.save(kHomeBottomTopic, this.bottomTopice);
                    }
                    this.homeList = this.getHomeListData(true);
                });
            });

            if (top) {
                this.topTopice = [];
                store.save(kHomeBottomTopic, this.bottomTopice);
            }
            if (bottom) {
                this.bottomTopice = [];
                store.save(kHomeBottomTopic, this.bottomTopice);
            }

            if (top || bottom) {
                this.homeList = this.getHomeListData(true);
            }
        });

    }

    @action handleData = (data, isTop) => {
        if (!data.data || !data.data.widgets) {
            return [];
        }
        data = data.data.widgets.data || [];
        data = [...data];
        let p = [];
        let count = data.length;
        for (let index = 0; index < count; index++) {
            let item = data[index];
            if (item.type === homeType.custom_goods) {
                item.itemHeight = GoodsCustomViewGetHeight(item);
                item.marginBottom = ScreenUtils.autoSizeWidth(0);
                if (count - 1 > index) {
                    let type = data[index + 1].type;
                    if (type === homeType.custom_imgAD || type === homeType.custom_text) {
                        item.marginBottom = ScreenUtils.autoSizeWidth(15);
                    }
                }
                item.itemHeight += item.marginBottom;
            }

            if (item.type === homeType.custom_imgAD) {
                item.itemHeight = ImageAdViewGetHeight(item);
            }

            if (item.type === homeType.custom_text) {
                item.detailHeight = 0;
                item.textHeight = 0;
                item.itemHeight = 0;
                if (item.text) {
                    p.push(bridge.getTextHeightWithWidth(item.text, autoSizeWidth(14), ScreenUtils.width - autoSizeWidth(30)).then((r) => {
                        item.textHeight = r.height;
                        item.itemHeight = r.height + item.detailHeight + autoSizeWidth(20);
                    }));
                }
                if (item.subText) {
                    p.push(bridge.getTextHeightWithWidth(item.subText, autoSizeWidth(12), ScreenUtils.width - autoSizeWidth(30)).then((r) => {
                        item.detailHeight = r.height;
                        item.itemHeight = r.height + item.textHeight + autoSizeWidth(20);
                    }));
                }
            }
        }


        Promise.all(p).then(() => {
            if (isTop) {
                this.topTopice = data;
                store.save(kHomeTopTopic, this.topTopice);
            } else {
                this.bottomTopice = data;
                store.save(kHomeBottomTopic, this.bottomTopice);
            }
            this.homeList = this.getHomeListData(true);
        });

    };
}

export const homeModule = new HomeModule();



