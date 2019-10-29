import { observable, computed, action } from 'mobx';
import StringUtils from '../../../utils/StringUtils';
import { suitType } from '../components/ProductDetailSuitView';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import ProductApi from '../api/ProductApi';

const { add, mul } = StringUtils;

export const afterSaleLimitType = {
    '01': '支持退货退款',
    '02': '支持退款',
    '03': '支持换货',
    '11': '不支持售后'
};

export default class SuitProductModel {
    @observable loadingState = PageLoadingState.loading;
    @observable netFailedInfo = {};
    /*套餐类型*/
    @observable extraType;
    @observable activityCode;
    @observable activityName;
    /*数量*/
    @observable selectedAmount = 1;
    /*子商品活动信息
    * groupCode
    * content
    * image 套餐营销图
    * shareContent 套餐分享内容
    * singlePurchaseNumber 单次购买个数
    * afterSaleLimit '01,02'售后type
    * afterSaleTip 售后解释
    * maxPurchaseTimes 最大购买次数限制 0:无限制
    * purchaseTimes 剩余可买次数
    * subProducts
    * */
    @observable packageItem = {};
    /*商品们*/
    /*product级别 额外增加字段
    * selectedSkuItem: null,
    * isSelected,
    * */
    @observable suitProducts = [];

    @observable promotionInfoItem = {};
    @observable promotionInfoItems = [];

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
            afterSaleLimitText = `${afterSaleLimitText},${afterSaleLimitType[item]}`;
        });
        return afterSaleLimitText.slice(1);
    }

    //分享
    @computed get priceRetailTotal() {
        return this.suitProducts.reduce((pre, cur) => {
            const { skuList } = cur;
            return add(pre, skuList[0].promotionPrice);
        }, 0);
    }

    //分享
    @computed get priceTotal() {
        return this.suitProducts.reduce((pre, cur) => {
            const { originalPrice } = cur;
            return add(pre, originalPrice);
        }, 0);
    }

    //分享
    @computed get totalShareMoney() {
        return this.suitProducts.reduce((pre, cur) => {
            const { skuList } = cur;
            const skuMin = skuList.map((item) => {
                return item.minPriceY || 0;
            });
            const skuMinShare = Math.min.apply(null, skuMin);
            return add(pre, skuMinShare);
        }, 0);
    }

    //是否能增加
    @computed get canAddAmount() {
        const { singlePurchaseNumber } = this.packageItem;
        if (this.selectedProductSkuS.length === 0) {
            /*限购情况:限购数>选择数*/
            return singlePurchaseNumber ? singlePurchaseNumber > this.selectedAmount : true;
        } else {
            const sellStockList = this.selectedProductSkuS.map((item) => {
                return item.sellStock;
            });
            const minSellStock = Math.min.apply(null, sellStockList);
            if (singlePurchaseNumber) {
                /*限购情况:限购数>选择数*/
                return (minSellStock > this.selectedAmount) && (singlePurchaseNumber > this.selectedAmount);
            }
            return minSellStock > this.selectedAmount;
        }
    }

    @computed get totalPayMoney() {
        return this.selectedProductSkuS.reduce((pre, cur) => {
            const { promotionPrice } = cur;
            return add(pre, mul(promotionPrice, this.selectedAmount));
        }, 0);
    }

    @computed get totalSubMoney() {
        return this.selectedProductSkuS.reduce((pre, cur) => {
            const { promotionDecreaseAmount } = cur;
            return add(pre, mul(promotionDecreaseAmount, this.selectedAmount));
        }, 0);
    }

    @action addAmount = () => {
        if (!this.canAddAmount) {
            return;
        }
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

        /*如果选择的规格的库存小于选择数   修改选择数量*/
        const sellStockList = this.selectedProductSkuS.map((item) => {
            return item.sellStock;
        });
        const minSellStock = Math.min.apply(null, sellStockList);
        if (minSellStock < this.selectedAmount) {
            this.selectedAmount = minSellStock;
        }
    };

    /*初始化*/
    @action setProductArr = (productDetailSuitModel, packageIndex) => {
        const { mainProduct, packages, extraType, activityCode, activityName } = productDetailSuitModel;
        this.extraType = extraType;
        this.activityCode = activityCode;
        this.activityName = activityName;
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

    promotionInfo = (prodCode, activityCode, groupCode) => {
        ProductApi.product_promotion_info({
            prodCode, activityCode, groupCode
        }).then((data) => {
            const dataList = data.data || [];
            this.promotionInfoItems = dataList;
            this.promotionInfoItem = dataList[0] || {};
        });
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
