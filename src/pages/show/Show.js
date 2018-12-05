import { observable, computed, action, flow } from 'mobx';
import ShowApi from './ShowApi';
import Toast from '../../utils/bridge';

//推广 1：精选 2：热门 3：推荐 4：最新 全部则不传
export const tag = {
    'Featured': 1,
    'Hot': 2,
    'Recommend': 3,
    'New': 4
};

export const tagName = {
    [tag.Featured]: '精选',
    [tag.Hot]: '热门',
    [tag.Recommend]: '推荐',
    [tag.New]: '最新'
};


export class HomeShowModules {
    @observable showList = [];

    @computed get firstId() {
        if (this.showList.length > 0) {
            return this.showList[0].id;
        } else {
            return 0;
        }
    }

    @computed get showImage() {
        if (this.showList.length > 0) {
            return this.showList[0].img;
        } else {
            return '';
        }
    }

    @action loadShowList = flow(function* (params) {
        try {
            const result = yield ShowApi.showQuery();
            this.showList = result.data.data;
        } catch (error) {
            console.log(error);
        }
    });
}

const homeLinkType = {
    good: 1,
    subject: 2,
    down: 3,
    spike: 4,
    package: 5,
    store: 8
};

const bannerRoute = {
    [homeLinkType.good]: 'home/product/ProductDetailPage',
    [homeLinkType.subject]: 'topic/DownPricePage',
    [homeLinkType.down]: 'topic/TopicDetailPage',
    [homeLinkType.spike]: 'topic/TopicDetailPage',
    [homeLinkType.package]: 'topic/TopicDetailPage',
    [homeLinkType.store]: 'spellShop/MyShop_RecruitPage'
};

export const showTypes = {
    choice: 'choice',
    hot: 'hot',
    recommend: 'recommend',
    banner: 'banner'
};

class ShowBannerModules {
    @observable bannerList = [];
    @observable type = showTypes.banner;

    @computed get bannerCount() {
        return this.bannerList.length;
    }

    @action loadBannerList = () => {
        ShowApi.showSwper({ type: 11 }).then(res => {
            if (res.code === 10000 && res.data) {
                this.bannerList = res.data;
            }
        });
    };

    @action bannerNavigate = (linkType, linkTypeCode) => {
        this.selectedTypeCode = linkTypeCode;
        return bannerRoute[linkType];
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

}

export const showBannerModules = new ShowBannerModules();


class ShowChoiceModules {
    @observable choiceList = [];
    @observable type = showTypes.choice;

    @computed get choiceCount() {
        return this.choiceList.length;
    }

    @action loadChoiceList = flow(function* (params) {
        try {
            const result = yield ShowApi.showQuery({ generalize: tag.Featured });
            this.choiceList = result.data.data;
        } catch (error) {
            console.log(error);
        }
    });
}

export const showChoiceModules = new ShowChoiceModules();

class ShowHotModules {
    @observable hotList = [];
    @observable type = showTypes.hot;

    @computed get hotCount() {
        return this.hotList.length;
    }

    @action loadHotList = flow(function* (params) {
        try {
            const result = yield ShowApi.showQuery({ generalize: tag.Hot });
            this.hotList = result.data.data;
        } catch (error) {
            console.log(error);
        }
    });
}

export const showHotModules = new ShowHotModules();

class ShowSelectedDetail {
    @observable selectedShow = null;
    @observable selectedType = 0;
    @action selectedShowAction = (data, type) => {
        this.selectedShow = data;
        this.selectedType = type;
    };
}

export const showSelectedDetail = new ShowSelectedDetail();

export class ShowRecommendModules {
    @observable recommendList = [];
    @observable selectedList = new Map();
    @observable page = 1;
    @observable collectPage = 1;
    @observable isRefreshing = false;
    @observable type = showTypes.recommend;
    @observable isEnd = false;

    @computed get recommendCount() {
        return this.recommendList.length;
    }

    @action loadRecommendList = (params) => {
        let currentDate = new Date()
        this.page = 1
        this.isEnd = false
        showChoiceModules.loadChoiceList()
        showBannerModules.loadBannerList()
        showHotModules.loadHotList()
        this.isRefreshing = true
        return this.fetchRecommendList(params, currentDate, this.page)
    }

    @action fetchRecommendList = (params, currentDate, page) => ShowApi.showQuery({...params, page: page, size: 10}).then(result => {
        this.isRefreshing = false
        if (parseInt(result.code, 0) === 10000) {
            this.page = 2
            let data = result.data.data
            if (data && data.length > 0) {
                data.map(value => {
                    value.currentDate = currentDate
                })
                return Promise.resolve(data)
            } else {
                return Promise.resolve([])
            }
        } else {
            return Promise.reject('获取列表错误')
        }
    }).catch(error => {
        return Promise.reject(error)
    })

    @action getMoreRecommendList = (params) => {
        if (this.isEnd) {
            return Promise.reject(-1);
        }
        if (this.isRefreshing) {
            return Promise.reject(-1);
        }
        let currentDate = new Date()
        this.isRefreshing = true
        return ShowApi.showQuery({page: this.page, ...params,size: 10}).then(result => {
            this.isRefreshing = false
            if (parseInt(result.code, 0) === 10000) {
                let data = result.data.data;
                if (data && data.length !== 0) {
                    this.page += 1;
                    data.map(value => {
                        value.currentDate = currentDate;
                    });
                    return Promise.resolve(data);
                } else {
                    this.isEnd = true;
                    return Promise.resolve([]);
                }
            } else {
                return Promise.reject('获取列表错误');
            }
        }).catch(error => {
            return Promise.reject(error);
        });
    };

    @action selectedAction = (data) => {
        data.selected = !data.selected;
        // let index = this.selectedList.findIndex((value) => data.id === value.id)
        // console.log('selectedAction', data, index)
        // if (this.selectedList.has(data.id)) {
        //     this.selectedList.delete(data.id)
        // } else {
        //     this.selectedList.set(data.id, true)
        // }
        // console.log('this.selectedList', this.selectedList.toJS())
    };

    @action loadCollect = () => {
        this.isEnd = true
        let currentDate = new Date()
        this.collectPage = 1
        this.isRefreshing = true
        return ShowApi.showCollectList({page: this.collectPage, size: 10}).then(result => {
            this.isRefreshing = false
            if (parseInt(result.code, 0) === 10000) {
                this.collectPage += 1;
                let data = result.data.data;
                if (data && data.length !== 0) {
                    data.map(value => {
                        value.currentDate = currentDate;
                    });
                    return Promise.resolve(data);
                } else {
                    return Promise.resolve([]);
                }
            } else {
                return Promise.reject('获取列表错误');
            }
        }).catch(error => {
            return Promise.reject(error);
        });
    };

    @action getMoreCollect = () => {
        if (this.isEnd) {
            return Promise.reject(-1);
        }
        if (this.isRefreshing) {
            return Promise.reject(-1);
        }
        let currentDate = new Date()
        this.isRefreshing = true
        return ShowApi.showCollectList({page: this.collectPage, size: 10}).then(result => {
            this.isRefreshing = false
            if (parseInt(result.code, 0) === 10000) {
                let data = result.data.data;
                if (!data) {
                    this.isEnd = true;
                    return Promise.resolve([]);
                }
                if (data && data.length !== 0) {
                    this.collectPage += 1;
                    data.map(value => {
                        value.currentDate = currentDate;
                    });
                    return Promise.resolve(data);
                } else {
                    this.isEnd = true;
                    return Promise.resolve([]);
                }
            } else {
                return Promise.reject('获取列表错误');
            }
        }).catch(error => {
            return Promise.reject(error);
        });
    };

    batchCancelConnected = (selectedIds) => ShowApi.showCollectCancel({
        articleId: '',
        type: 1,
        articleIds: selectedIds
    });
}

export class ShowDetail {
    @observable detail = '';
    @observable isGoodActioning = false;     // 正在点赞
    @observable isCollecting = false;        //正在收藏
    @action loadDetail = flow(function* (id) {
        try {
            const result = yield ShowApi.showDetail({ id: id });
            this.detail = result.data;
            return result.data;
        } catch (error) {
            console.log(error);
        }
    });

    @action showGoodAction = flow(function* () {
        try {
            this.isGoodActioning = true;
            let result = {};
            if (this.detail.hadLike) {
                result = yield ShowApi.showGoodCancel({
                    articleId: this.detail.id,
                    type: 2,
                    articleIds: [this.detail.id]
                });
            } else {
                result = yield ShowApi.showGood({ articleId: this.detail.id, type: 2, articleIds: [this.detail.id] });
            }
            this.isGoodActioning = false;
            if (parseInt(result.code, 0) === 10000) {
                if (this.detail.hadLike) {
                    this.detail.likeCount -= 1;
                } else {
                    this.detail.likeCount += 1;
                }
                this.detail.hadLike = !this.detail.hadLike;
            }
        } catch (error) {
            this.isGoodActioning = false;
            Toast.$toast(error.msg);
        }
    });

    @action showConnectAction = flow(function* () {
        try {
            this.isCollecting = true;
            let result = {};
            if (!this.detail.hadCollect) {
                result = yield ShowApi.showConnect({ articleId: this.detail.id, type: 1, articleIds: [this.detail.id] });
            } else {
                result = yield ShowApi.showCollectCancel({
                    articleId: this.detail.id,
                    type: 1,
                    articleIds: [this.detail.id]
                });
            }
            this.isCollecting = false;
            if (parseInt(result.code, 0) === 10000) {
                if (this.detail.hadCollect) {
                    this.detail.collectCount -= 1;
                } else {
                    this.detail.collectCount += 1;
                }
                this.detail.hadCollect = !this.detail.hadCollect;
            }
        } catch (error) {
            this.isCollecting = false;
            Toast.$toast(error.msg);
        }
    });

}
