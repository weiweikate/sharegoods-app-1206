import { observable, action, flow } from 'mobx';
import HomeApi from '../api/HomeAPI';
import { homeModule } from './Modules';
import { homeType } from '../HomeTypes';
import store from '@mr/rn-store';

const kHomeCategoryStore = '@home/kHomeCategoryStore';

class CategoryModules {
    @observable categoryList = [];

    @action loadCategoryList = flow(function* (isCache) {
        try {
            if (isCache) {
                const storeRes = yield store.get(kHomeCategoryStore);
                if (storeRes) {
                    this.categoryList = storeRes || [];
                }
            }
            const res = yield HomeApi.classify();
            let resClassifys = res.data || [];
            resClassifys.map((data) => {
                if (data.name === '全部分类') {
                    data.route = 'home/search/CategorySearchPage';
                } else {
                    data.route = 'home/search/SearchResultPage';
                }
            });
            this.categoryList = resClassifys || [];
            homeModule.changeHomeList(homeType.category);
            store.save(kHomeCategoryStore, this.categoryList);
        } catch (error) {
            console.log(error);
        }
    });
}

export const categoryModule = new CategoryModules();
