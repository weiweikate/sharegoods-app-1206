/**
 * @author 陈阳君
 * @date on 2019/09/18
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */
import { observable, computed } from 'mobx';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import SpellShopApi from '../api/SpellShopApi';
import StringUtils from '../../../utils/StringUtils';

export class AddCapacityPriceModel {
    @observable loadingState = PageLoadingState.loading;
    @observable dataList = [];

    @computed get selectedList() {
        return this.dataList.filter((item) => {
            return item.isSelected;
        });
    }

    @computed get totalMoney() {
        return this.selectedList.reduce((pre, cur) => {
            const { salePrice, amount } = cur;
            return StringUtils.add(pre, StringUtils.mul(salePrice, amount));
        }, 0);
    }

    @computed get totalPerson() {
        return this.selectedList.reduce((pre, cur) => {
            const { expandGoodsVolume, amount } = cur;
            return StringUtils.add(pre, StringUtils.mul(expandGoodsVolume, amount));
        }, 0);
    }

    requestList = () => {
        SpellShopApi.expand_goodsList().then((data) => {
            const dataTemp = data.data || {};
            dataTemp.forEach((item) => {
                item.amount = 0;
                item.isSelected = false;
            });
            this.loadingState = PageLoadingState.success;
            this.dataList = dataTemp;
        }).catch(() => {
            this.loadingState = PageLoadingState.fail;
        });
    };
}
