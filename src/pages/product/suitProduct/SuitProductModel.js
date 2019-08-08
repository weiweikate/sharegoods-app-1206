import { observable, computed, action } from 'mobx';
import StringUtils from '../../../utils/StringUtils';
import { suitType } from '../components/ProductDetailSuitView';

const { add, mul } = StringUtils;

const afterSaleLimitType = {
    '01': '支持退换货',
    '02': '支持退款',
    '03': '支持换货',
    '11': '不支持售后'
};

export default class SuitProductModel {
    /*套餐类型*/
    @observable extraType;
    /*数量*/
    @observable selectedAmount = 1;
    /*子商品活动信息
    * groupCode
    * content
    * image
    * shareContent
    * singlePurchaseNumber
    * afterSaleLimit
    * afterSaleTip
    * maxPurchaseTimes
    * purchaseTimes
    * subProducts
    * */
    @observable packageItem = {};
    /*商品们*/
    /*product级别 额外增加字段
    * selectedSkuItem: null,
    * isSelected,
    * */
    @observable suitProducts = [];

    /*被选中的商品*/
    @computed get selectedProductSkuS() {
        const selectedSkuItems = [];
        this.suitProducts.forEach((item) => {
            if (item.selectedSkuItem) {
                selectedSkuItems.push(item.selectedSkuItem);
            }
        });
        return selectedSkuItems;
    }

    @computed get selected_products() {
        const selectedItems = [];
        this.suitProducts.forEach((item) => {
            if (item.selectedSkuItem) {
                selectedItems.push(item);
            }
        });
        return selectedItems;
    }

    @computed get isSuitFixed() {
        return this.extraType === suitType.fixedSuit;
    }

    @computed get afterSaleLimitText() {
        let afterSaleLimitText = '';
        const { afterSaleLimit } = this.packageItem;
        (afterSaleLimit || '').split(',').forEach((item) => {
            afterSaleLimitText = `${afterSaleLimitText}${afterSaleLimitType[item]}`;
        });
        return afterSaleLimitText;
    }

    //是否能增加
    @computed get canAddAmount() {
        if (this.selectedProductSkuS.length === 0) {
            return true;
        } else {
            const sellStockList = this.selectedProductSkuS.map((item) => {
                return item.sellStock;
            });
            const minSellStock = Math.min.apply(null, sellStockList);
            return minSellStock > this.selectedAmount;
        }
    }

    @computed get totalPayMoney() {
        const payPrice = this.selectedProductSkuS.reduce((pre, cur) => {
            const { promotionPrice } = cur;
            return add(pre, mul(promotionPrice, this.selectedAmount));
        }, 0);
        return payPrice;
    }

    @computed get totalSubMoney() {
        return this.selectedProductSkuS.reduce((pre, cur) => {
            const { promotionDecreaseAmount } = cur;
            return add(pre, mul(promotionDecreaseAmount, this.selectedAmount));
        }, 0);
    }

    @action addAmount = () => {
        this.selectedAmount++;
    };

    @action subAmount = () => {
        if (this.selectedAmount === 1) {
            return;
        }
        this.selectedAmount--;
    };

    @action changeItemWithSku = ({ productItem, skuItem }) => {
        productItem.selectedSkuItem = skuItem;
    };

    /*初始化*/
    @action setProductArr = (productDetailSuitModel, packageIndex) => {
        const { mainProduct, packages, extraType } = productDetailSuitModel;
        this.extraType = extraType;
        const packageItem = packages[packageIndex] || {};
        this.packageItem = JSON.parse(JSON.stringify(packageItem));

        const tempMainProduct = JSON.parse(JSON.stringify(mainProduct || {}));
        /*
        * defaultSkuItem是否不可选择规格,直接显示
        * selectedSkuItem已选规格
        * 主商品单规格->默认赋值
        * 子商品单规格->固定套餐->默认赋值
        * */
        //主商品
        const mainDefault = this.getDefaultSku(tempMainProduct);
        const mainTemp = {
            isMainProduct: true,
            ...tempMainProduct,
            selectedSkuItem: mainDefault,
            defaultSkuItem: mainDefault
        };
        /*子商品*/
        const { subProducts } = this.packageItem;
        const subProductsTemp = (subProducts || []).map((item) => {
            const itemDefault = this.getDefaultSku(item);
            return {
                ...item,
                selectedSkuItem: extraType === suitType.fixedSuit ? itemDefault : null,
                defaultSkuItem: itemDefault
            };
        });
        this.suitProducts = [mainTemp, ...(subProductsTemp || [])];
    };

    getDefaultSku = (productData) => {
        const { skuList, specifyList } = productData;
        let isSingle = true;
        /*是否单规格*/
        for (const item of (specifyList || [])) {
            if (item.specValues.length > 1) {
                isSingle = false;
                return;
            }
        }
        if (isSingle) {
            return skuList[0];
        }
        return null;
    };
}
