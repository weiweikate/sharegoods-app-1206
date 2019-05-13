import { observable, computed, action, flow } from 'mobx';
import ShowApi from './ShowApi';
import Toast from '../../utils/bridge';
import ScreenUtil from '../../utils/ScreenUtils';
import { TrackApi } from '../../utils/SensorsTrack';
import { homeType } from '../home/HomeTypes';
import {height} from './ShowBannerView';

const { px2dp } = ScreenUtil;

//1:推荐，2:素材圈，3:发现，4:活动
export const tag = {
    'Recommend': 1,
    'Material': 2,
    'Found': 3,
    'Activity': 4
};

export const tagName = {
    [tag.Recommend]: '推荐',
    [tag.Material]: '素材圈',
    [tag.Found]: '发现',
    [tag.Activity]: '活动'
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

export const showTypes = {
    choice: 'choice',
    hot: 'hot',
    recommend: 'recommend',
    banner: 'banner'
};

class ShowBannerModules {
    @observable bannerList = [];
    @observable type = showTypes.banner;

    @computed get bannerHeight() {
        return this.bannerList.length > 0 ? height : 0;
    }

    @action loadBannerList = () => {
        ShowApi.getShowBanner({ type: homeType.discover }).then(res => {
            if (res.code === 10000) {
                this.bannerList = res.data || [];
            }
        });
    };
}

export const showBannerModules = new ShowBannerModules();

class ShowChoiceModules {
    @observable choiceList = [];
    @observable type = showTypes.choice;

    @computed get choiceHeight() {
        return this.choiceList.length * px2dp(234);
    }

    @action loadChoiceList = flow(function* (params) {
        try {
            const result = yield ShowApi.showQuery({ generalize: tag.Featured });
            this.choiceList = result.data.data;
            return result;
        } catch (error) {
            console.log(error);
        }
    });
}

export const showChoiceModules = new ShowChoiceModules();


export class ShowRecommendModules {
    @observable recommendList = [];
    @observable selectedList = new Map();
    @observable page = 1;
    @observable collectPage = 1;
    @observable isRefreshing = false;
    @observable type = showTypes.recommend;
    @observable isEnd = false;
    @observable recommendHeight = 0;

    @computed get recommendCount() {
        return this.recommendList.length;
    }

    @action fetchRecommendList = (params, currentDate, page) => {
        return ShowApi.showQuery({ ...params, page: page }).then(result => {
            this.isRefreshing = false;
            if (parseInt(result.code, 0) === 10000) {
                this.page = 2;
                let data = result.data.data;
                if (data && data.length > 0) {
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
            Toast.$toast(error.msg || '获取列表错误');
            throw error;
        });
    };

    @action getMoreRecommendList = (params) => {
        if (this.isEnd) {
            return Promise.reject(-1);
        }
        if (this.isRefreshing) {
            return Promise.reject(-1);
        }
        let currentDate = new Date();
        this.isRefreshing = true;
        return ShowApi.showQuery({ page: this.page, ...params, size: 10 }).then(result => {
            this.isRefreshing = false;
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
            Toast.$toast(error.msg || '获取列表错误');
            throw error;
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
        this.isEnd = true;
        let currentDate = new Date();
        this.collectPage = 1;
        this.isRefreshing = true;
        return ShowApi.showCollectList({ page: this.collectPage, size: 10 }).then(result => {
            this.isRefreshing = false;
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
            Toast.$toast(error.msg || '获取列表错误');
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
        let currentDate = new Date();
        this.isRefreshing = true;
        return ShowApi.showCollectList({ page: this.collectPage, size: 10 }).then(result => {
            this.isRefreshing = false;
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
            Toast.$toast(error.msg || '获取列表错误');
            return Promise.reject(error);
        });
    };

    @action batchCancelConnected = (selectedIds) => {
        Toast.showLoading();
        return ShowApi.showCollectCancel({
            articleId: '',
            type: 1,
            articleIds: selectedIds
        }).then(data => {
            Toast.hiddenLoading();
            return Promise.resolve(data);
        }).catch(error => {
            Toast.hiddenLoading();
            console.log('showCollectCancel', error);
            Toast.$toast(error.msg || '服务器连接异常');
            throw error;
        });
    };
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
            throw error;
        }
    });

    @action showDetailCode = flow(function* (code) {
        try {
            const result = yield ShowApi.showDetailCode({ code: code });
            this.detail = result.data;
            return result.data;
        } catch (error) {
            console.log(error);
            throw error;
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
                result = yield ShowApi.showConnect({
                    articleId: this.detail.id,
                    type: 1,
                    articleIds: [this.detail.id]
                });
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
                    TrackApi.CancelArticleCollection({ articeCode: this.detail.code, articleTitle: this.detail.title });
                } else {
                    this.detail.collectCount += 1;
                    TrackApi.CollectingArticle({ articeCode: this.detail.code, articleTitle: this.detail.title });
                }
                this.detail.hadCollect = !this.detail.hadCollect;
            }
        } catch (error) {
            this.isCollecting = false;
            Toast.$toast(error.msg);
        }
    });

}
