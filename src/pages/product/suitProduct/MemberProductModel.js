import { observable, computed, action } from 'mobx';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import ProductApi from '../api/ProductApi';
import StringUtils from '../../../utils/StringUtils';
import { afterSaleLimitType } from './SuitProductModel';

const { add } = StringUtils;
/**
 * @author 陈阳君
 * @date on 2019/10/07
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

export default class MemberProductModel {
    @observable loadingState = PageLoadingState.loading;
    @observable netFailedInfo = {};

    @observable productCode;
    @observable activityCode;
    @observable activityName;
    @observable extraType;
    @observable freight;
    @observable mainProduct = {};
    /*packages层级下的对象
    * afterSaleLimit
    * afterSaleTip
    * canBuy
    * content
    * groupCode
    * image
    * shareContent
    * singlePurchaseNumber
    * subProducts
    * */
    @observable packageVideo = null;
    @observable mainImages = [];
    @observable detailImages = [];
    @observable subProducts = [];
    @observable afterSaleLimit = '';
    @observable afterSaleTip = '';
    @observable shareContent = '';

    @computed get afterSaleLimitText() {
        let afterSaleLimitText = '';
        const { afterSaleLimit } = this;
        (afterSaleLimit || '').split(',').forEach((item) => {
            afterSaleLimitText = `${afterSaleLimitText},${afterSaleLimitType[item]}`;
        });
        return afterSaleLimitText.slice(1);
    }

    @computed get totalPrice() {
        if (!this.mainProduct.skuList) {
            return '';
        }
        const mainPrice = this.mainProduct.skuList[0].price;
        const subPrice = this.subProducts.reduce((pre, cur) => {
            const { skuList } = cur;
            return add(pre, skuList[0].price);
        }, 0);
        return mainPrice + subPrice;
    }

    @computed get totalProPrice() {
        if (!this.mainProduct.skuList) {
            return '';
        }
        const mainPrice = this.mainProduct.skuList[0].promotionPrice;
        const subPrice = this.subProducts.reduce((pre, cur) => {
            const { skuList } = cur;
            return add(pre, skuList[0].promotionPrice);
        }, 0);
        return mainPrice + subPrice;
    }

    @computed get totalDeProPrice() {
        if (!this.mainProduct.skuList) {
            return '';
        }
        const mainPrice = this.mainProduct.skuList[0].promotionDecreaseAmount;
        const subPrice = this.subProducts.reduce((pre, cur) => {
            const { skuList } = cur;
            return add(pre, skuList[0].promotionDecreaseAmount);
        }, 0);
        return mainPrice + subPrice;
    }

    @action request_promotion_detail = (productCode) => {
        ProductApi.promotion_detail({ productCode }).then((data) => {
            this.loadingState = PageLoadingState.success;
            const dataDic = data.data || {};
            const { activityCode, activityName, extraType, freight, mainProduct, packages } = dataDic;
            this.productCode = productCode;
            this.activityCode = activityCode;
            this.activityName = activityName;
            this.extraType = extraType;
            this.freight = freight;
            this.mainProduct = mainProduct || {};
            const { packageVideo, mainImages, detailImages, subProducts, afterSaleLimit, afterSaleTip, shareContent } = packages[0] || {};
            this.packageVideo = packageVideo;
            this.mainImages = mainImages;
            this.detailImages = detailImages;
            this.subProducts = subProducts;
            this.afterSaleLimit = afterSaleLimit;
            this.afterSaleTip = afterSaleTip;
            this.shareContent = shareContent;
        }).catch(e => {
            this.loadingState = PageLoadingState.fail;
            this.netFailedInfo = e;
        });
    };
}
