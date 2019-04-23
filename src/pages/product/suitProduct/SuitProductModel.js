import { observable, computed, action } from 'mobx';
import bridge from '../../../utils/bridge';

export default class SuitProductModel {

    @observable mainProduct = {};
    @observable subProductArr = [];
    @observable totalProduct = [];

    @observable selectedAmount = 1;
    /*选择中的规格*/
    @observable selectedItems = [];

    //是否能增加
    @computed get canAddAmount() {
        //最大能点击数 选择里面的最小
        if (this.selectedItems.length === 0) {
            return true;
        } else {
            let sellStockList = this.selectedItems.map((item) => {
                return item.sellStock;
            });
            let minSellStock = Math.min.apply(null, sellStockList);
            return minSellStock > this.selectedAmount;
        }
    }

    @action addAmount = () => {
        this.selectedAmount++;
        // this.changeArr();
    };

    @action subAmount = () => {
        if (this.selectedAmount === 1) {
            return;
        }
        this.selectedAmount--;
        //是否能选择
        // this.changeArr();
    };

    // @action changeArr = () => {
    //     this
    //
    // };

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
        //获取选择的item
        this.selectedItems = this.totalProduct.filter((item1) => {
            return item1.isSelected;
        });
    };

    /*初始化*/
    @action setSubProductArr = (productDetailModel) => {
        const { productData, groupActivity } = productDetailModel;
        let tempProductData = JSON.parse(JSON.stringify(productData || {}));
        let tempGroupActivity = JSON.parse(JSON.stringify(groupActivity || {}));

        this.mainProduct = {
            ...tempProductData,
            selectedSkuItem: null,
            isSelected: false
        };
        this.subProductArr = (tempGroupActivity.subProductList || []).map((item) => {
            return {
                ...item,
                /*选择的库存*/
                selectedSkuItem: null,
                isSelected: false
            };
        });

        this.totalProduct = [this.mainProduct, ...this.subProductArr];
    };
}
