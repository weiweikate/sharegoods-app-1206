import { observable, action, flow } from 'mobx';
import HomeApi from '../api/HomeAPI';

class CategoryModules {
    @observable categoryList = [];

    @action loadCategoryList = flow(function* () {
        HomeApi.classify().then(resData => {
            if (resData.code === 10000 && resData.data) {
                let resClassifys = resData.data || [];
                resClassifys.map((data) => {
                    if (data.name === '全部分类') {
                        data.route = 'home/search/CategorySearchPage';
                    } else {
                        data.route = 'home/search/SearchResultPage';
                    }
                });
                this.categoryList = resClassifys;
            }
        }).catch(error => {
            console.log(error);
        });
    });
}

export const categoryModule = new CategoryModules();
