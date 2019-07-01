import { observable, action, autorun } from 'mobx';
import ShopCartAPI from '../api/ShopCartApi';
import user from '../../../model/user';
import ScreenUtils from '../../../utils/ScreenUtils';

const EmptyViewTypes = {
    topEmptyItem: 'topEmptyItem',
    recommendListItem: 'recommendListItem'
};

const { px2dp } = ScreenUtils;
const Cell_Height = px2dp(248);

class ShopCartEmptyModel {

    @observable
    emptyViewList = [];
    @observable
    isFetching = false;
    @observable
    errorMsg = '';
    @observable
    isEnd = true;
    pageSize = 10;
    page = 1;

    constructor(props) {
        this.createData();
        this.getRecommendProducts(true);
    }

    createData = () => {
        this.emptyViewList.push(
            {
                id: 0,
                type: EmptyViewTypes.topEmptyItem,
                height: Cell_Height,
                imageHeight: px2dp(168)
            }
        );
    };
    @observable
    isRefreshing = false;
    @action
    getRecommendProducts = (isRefresh = true) => {
        if (isRefresh) {
            this.page = 1;
        } else {
            this.isFetching = true;
            this.page = this.page + 1;
        }
        if (user.isLogin) {
            ShopCartAPI.recommendProducts({
                page: this.page,
                pageSize: this.pageSize
            }).then(result => {
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
                    newArr.push({
                        id: 0,
                        type: EmptyViewTypes.topEmptyItem,
                        height: Cell_Height,
                        imageHeight: px2dp(168)
                    });
                    newArr = newArr.concat(tempArr);
                }
                this.emptyViewList = newArr;
                console.log(result);
            }).catch(error => {
            });
        } else {
            ShopCartAPI.recommend_products_not_login({
                page: this.page,
                pageSize: this.pageSize
            }).then(result => {
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
                    newArr.push({
                        id: 0,
                        type: EmptyViewTypes.topEmptyItem,
                        height: Cell_Height,
                        imageHeight: px2dp(168)
                    });
                    newArr = newArr.concat(tempArr);
                }
                this.emptyViewList = newArr;
                console.log(result);
            }).catch(error => {

            });
        }
    };
}

const shopCartEmptyModel = new ShopCartEmptyModel();

autorun(() => {
    user.isLogin ? shopCartEmptyModel.getRecommendProducts(true) : null;
});
export { shopCartEmptyModel, EmptyViewTypes };
