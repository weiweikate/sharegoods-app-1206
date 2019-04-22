import { observable, computed, action } from 'mobx';
import bridge from '../../../utils/bridge';

export default class SuitProductModel {
    @observable mainProduct = { selectedSkuItem: null, sellStock: 2 };
    @observable subProductArr = [];

    @observable selectedAmount = 1;
    /*选择中的规格*/
    @observable selectedItems = [];

    @computed getTotalProduct() {

    }

    //是否能增加
    @computed get canAddAmount() {
        //最大能点击数 选择里面的最小
        let tempArr = [this.mainProduct, ...this.selectedItems];
        tempArr.map(() => {
            return;
        });
        let tempItem = tempArr.reduce((pre, cur) => {
            if (!cur) {
                return pre;
            }
            if (pre.sellStock <= cur.sellStock) {
                return pre;
            } else {
                return cur;
            }
        });
        return tempItem.sellStock > this.selectedAmount;
    }

    @action addAmount = () => {
        this.selectedAmount++;
        this.changeArr();
    };

    @action subAmount = () => {
        if (this.selectedAmount === 1) {
            return;
        }
        this.selectedAmount--;
        this.changeArr();
    };

    @action changeArr = () => {
        let tempArr = [this.mainProduct, ...this.selectedItems];

    };

    @action changeItem = (item) => {
        const { isSelected } = item;
        if (isSelected) {
            /*选择了:删除sku和选择状态*/
            item.selectedSkuItem = null;
            item.isSelected = false;
        } else {
            /*未选择:弹框选择规格后*/
            if (item.sellStock < this.selectedAmount) {
                bridge.$toast(`所选规格的商品库存不满${this.selectedAmount}件`);
            } else {
                item.selectedSkuItem = item;
                item.isSelected = true;
            }
        }
        let tempArr = [this.mainProduct, ...this.selectedItems];
        this.selectedItems = tempArr.filter((item1) => {
            return item1.isSelected;
        });
    };

    /*初始化*/
    @action setSubProductArr = (mainProduct, subProducts) => {
        this.mainProduct = {
            ...mainProduct,
            selectedSkuItem: null
        };
        this.subProductArr = subProducts.map((item) => {
            return {
                ...item,
                /*选择的库存*/
                selectedSkuItem: null,
                isSelected: false
            };
        });
    };
}
