import {action, autorun, observable} from 'mobx';
import ShopCartAPI from '../api/ShopCartApi';
import user from '../../../model/user';
import ScreenUtils from '../../../utils/ScreenUtils';

const EmptyViewTypes = {
    topEmptyItem: 'topEmptyItem',
    recommendListItem: 'recommendListItem'
};

const {px2dp} = ScreenUtils;
const Cell_Height = px2dp(248);

class ShopCartEmptyModel {
    @observable
    emptyViewList = [];
    @observable
    isRefreshing = false;

    isFetching = false;
    errorMsg = '';
    isEnd = false;
    pageSize = 10;
    page = 1;
    firstLoad = true;

    @action
    setRefreshing = (showRefresh) => {
        this.isRefreshing = showRefresh;
    }
    @action
    getRecommendProducts = (isRefresh = true) => {

        if (isRefresh) {
            this.page = 1;
        } else {
            this.isFetching = true;
            this.page = this.page + 1;
        }
        this.firstLoad = false;
        if (user.isLogin) {
            ShopCartAPI.recommendProducts({
                page: this.page,
                pageSize: this.pageSize
            }).then(result => {
                this.isEnd = true;
                let goodList = result.data || [];
                let tempArr = [];
                let newArr = [];
                tempArr = goodList.map((goodItem, index) => {
                    return {
                        ...goodItem,
                        id: index,
                        type: EmptyViewTypes.recommendListItem,
                        height: Cell_Height,
                        imageHeight: px2dp(168)
                    };
                });
                if (isRefresh) {
                    if (tempArr && tempArr.length > 0) {
                        newArr.push({
                            id: 0,
                            type: EmptyViewTypes.topEmptyItem,
                            height: Cell_Height,
                            imageHeight: px2dp(168)
                        });
                    }
                    newArr = newArr.concat(tempArr);
                }
                this.emptyViewList = newArr;
                this.errorMsg = '';
                this.isFetching = false;
                this.isRefreshing = false;
                console.log(result);
            }).catch(error => {
                this.isEnd = true;
                this.isFetching = false;
                this.isRefreshing = false;
                this.errorMsg = error.msg;
            });
        } else {
            ShopCartAPI.recommend_products_not_login({
                page: this.page,
                pageSize: this.pageSize
            }).then(result => {
                this.isEnd = true;
                let goodList = result.data || [];
                let tempArr = [];
                let newArr = [];

                tempArr = goodList.map((goodItem, index) => {
                    return {
                        ...goodItem,
                        id: index,
                        type: EmptyViewTypes.recommendListItem,
                        height: Cell_Height,
                        imageHeight: px2dp(168)
                    };
                });
                if (isRefresh) {
                    if (tempArr && tempArr.length > 0) {
                        newArr.push({
                            id: 0,
                            type: EmptyViewTypes.topEmptyItem,
                            height: Cell_Height,
                            imageHeight: px2dp(168)
                        });
                    }
                    newArr = newArr.concat(tempArr);
                }
                this.emptyViewList = newArr;
                this.errorMsg = '';
                this.isFetching = false;
                this.isRefreshing = false;
                console.log(result);
            }).catch(error => {
                this.isEnd = true;
                this.isFetching = false;
                this.isRefreshing = false;
                this.errorMsg = error.msg;
            });
        }
    };
}

const shopCartEmptyModel = new ShopCartEmptyModel();

autorun(() => {
    user.isLogin ? shopCartEmptyModel.getRecommendProducts(true) : null;
});
export {shopCartEmptyModel, EmptyViewTypes};
