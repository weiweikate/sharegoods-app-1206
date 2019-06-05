import { observable, action } from 'mobx';
import HomeApi from '../api/HomeAPI';
import {homeModule} from './Modules'
import { homeType } from '../HomeTypes';
class CategoryModules {
    @observable categoryList = [];

    @action loadCategoryList = () => {
       return HomeApi.classify().then(resData => {
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
                homeModule.changeHomeList(homeType.category)
            }
        }).catch(error => {
            console.log(error);
        });
    };
}

export const categoryModule = new CategoryModules();
