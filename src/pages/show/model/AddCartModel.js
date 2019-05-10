import ProductApi from '../../product/api/ProductApi';
import { activity_status, activity_type, product_status } from '../../product/ProductDetailModel';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import StringUtils from '../../../utils/StringUtils';

const { isNoEmpty } = StringUtils;

/**
 * @author xzm
 * @date 2019/5/10
 */


export default class AddCartModel {

    requestProductDetail = (code, callback, callback2) => {
        ProductApi.getProductDetailByCodeV2({
            code
        }).then((data) => {
            let tempData = data.data || {};
            let success = this.productSuccess(tempData);
            success ? callback(this.productIsPromotionPrice()) : callback2({ msg: '该商品走丢了去看看别的商品吧' });
        }).catch((e) => {
            callback2(e);
        });
    };

    productIsPromotionPrice = () => {
        const { activityType, activityStatus } = this;
        let tempType = activityType === activity_type.skill || activityType === activity_type.verDown;
        return tempType && activityStatus === activity_status.inSell;
    };

    productSuccess = (data) => {
        return false;
        const { productStatus } = data || {};
        this.productStatus = productStatus;
        if (productStatus === product_status.delete) {
            return false;
        } else {
            this.productData = data || {};
            const {
                videoUrl, imgUrl, imgFileList, minPrice, maxPrice,
                originalPrice, priceType, name, secondName, freight,
                groupPrice, v0Price, shareMoney,
                monthSaleCount, skuList, specifyList, stockSysConfig, promoteInfoVOList,
                restrictions, paramList, comment, totalComment, overtimeComment, now, content,
                promotionResult, promotionDecreaseAmount, promotionPrice, promotionLimitNum,
                promotionSaleNum, promotionStockNum, promotionMinPrice, promotionMaxPrice
            } = data || {};

            let contentArr = isNoEmpty(content) ? content.split(',') : [];

            this.loadingState = PageLoadingState.success;
            this.videoUrl = videoUrl;
            this.imgUrl = imgUrl;
            this.imgFileList = imgFileList || [];
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
            this.groupPrice = groupPrice;
            this.v0Price = v0Price;
            this.shareMoney = shareMoney;
            this.originalPrice = originalPrice;
            this.priceType = priceType;
            this.name = name;
            this.secondName = secondName;
            this.freight = freight;
            this.monthSaleCount = monthSaleCount;
            this.skuList = skuList || [];
            this.specifyList = specifyList || [];
            this.stockSysConfig = stockSysConfig || [];
            this.promoteInfoVOList = promoteInfoVOList || [];
            this.restrictions = restrictions;
            this.paramList = paramList || [];
            /*不赋值默认 判空用*/
            this.comment = comment;
            this.overtimeComment = overtimeComment;
            this.totalComment = totalComment;
            this.contentArr = contentArr;
            this.now = now;

            const { singleActivity, groupActivity, tags } = promotionResult || {};
            this.singleActivity = singleActivity || {};
            this.groupActivity = groupActivity || {};
            this.tags = tags;
            this.promotionDecreaseAmount = promotionDecreaseAmount;

            this.promotionLimitNum = StringUtils.isNoEmpty(promotionLimitNum) ? (promotionLimitNum < 0 ? 0 : promotionLimitNum) : null;
            this.promotionPrice = promotionPrice;
            this.promotionSaleNum = promotionSaleNum;
            this.promotionStockNum = promotionStockNum;
            this.promotionMinPrice = promotionMinPrice;
            this.promotionMaxPrice = promotionMaxPrice;


            let typeT, endTimeT, startTimeT;
            if ((groupActivity || {}).type) {
                const { endTime, startTime, type } = groupActivity || {};
                typeT = type;
                endTimeT = endTime;
                startTimeT = startTime;
            } else {
                const { endTime, startTime, type } = singleActivity || {};
                typeT = type;
                endTimeT = endTime;
                startTimeT = startTime;
            }

            this.startTime = startTimeT;
            this.endTime = endTimeT;
            this.activityType = typeT;
            if (now < startTimeT) {
                this.activityStatus = activity_status.unBegin;
                // this._startSkillInterval(now, startTimeT);
            } else if (now >= startTimeT && now < endTimeT) {
                this.activityStatus = activity_status.inSell;
                // this._startSkillInterval(now, endTimeT);
            } else {
                this.activityStatus = null;
            }

            return true;

        }
    };
}


