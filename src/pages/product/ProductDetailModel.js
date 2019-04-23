import { observable, computed, action } from 'mobx';
import ProductApi from './api/ProductApi';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
import { track, trackEvent } from '../../utils/SensorsTrack';
import user from '../../model/user';
import StringUtils from '../../utils/StringUtils';
import ScreenUtils from '../../utils/ScreenUtils';

const { width, height } = ScreenUtils;
const { isNoEmpty } = StringUtils;

export const contentImgWidth = width;

export const productItemType = {
    headerView: 'headerView',
    suit: 'suit',
    promote: 'promote',
    service: 'service',
    param: 'param',
    comment: 'comment',
    content: 'content',
    priceExplain: 'priceExplain'
};

/**价格类型 2拼店价 3会员价**/
export const price_type = {
    level: 3,
    shop: 2
};

/***0产品删除 1产品上架 2产品下架(包含未上架的所有状态，出去删除状态) 3未开售***/
export const product_status = {
    delete: 0,
    on: 1,
    down: 2,
    future: 3
};

export default class ProductDetailModel {

    @observable prodCode;
    @observable loadingState = PageLoadingState.loading;
    @observable netFailedInfo = {};

    @observable offsetY = 0;
    @observable opacity = 0;

    /*总数据*/
    @observable productData;
    /***0产品删除 1产品上架 2产品下架(包含未上架的所有状态，出去删除状态) 3未开售***/
    @observable productStatus;
    /**视频**/
    @observable videoUrl;
    /**主图**/
    @observable imgUrl;
    /**轮播图(除去主图)**/
    @observable imgFileList = [];
    @observable minPrice;
    @observable maxPrice;
    @observable groupPrice;
    /**分享显示的零售价**/
    @observable v0Price;
    @observable shareMoney;
    /**原价**/
    @observable originalPrice;
    /**价格类型 2拼店价 3会员价**/
    @observable priceType;
    @observable name;
    @observable secondName;
    /**快递 0包邮**/
    @observable freight;
    /**月销**/
    @observable monthSaleCount;
    /**商品库存**/
    @observable skuList = [];
    /**商品规格**/
    @observable specifyList = [];
    /**库存替换显示
     * [{value(40★充足)}]
     * **/
    @observable stockSysConfig = [];
    /**促销信息
     * [{type(8：经验翻倍 9：券兑换),message}]
     * **/
    @observable promoteInfoVOList = [];
    /**服务信息 位运算 1(支持优惠券) 4(支持7天退换) 8(支持节假日退换)**/
    @observable restrictions;
    /**参数
     * [{paramName: "上市时间", paramValue: "2018年12月"}]
     * **/
    @observable paramList = [];

    /**商品评论{ headImg, nickname, imgUrl ,comment}**/
    @observable comment = {};
    /**商品数量**/
    @observable totalComment;
    /**商品详情**/
    @observable contentArr = [];

    /**营销活动**/
    /*秒杀*/
    @observable singleActivity = {};
    /*套餐*/
    /*subProductList:[]*/
    @observable groupActivity = [];

    /**七鱼相关**/
    @observable shopId;
    @observable title;


    /**显示向上返回**/
    @computed get showTop() {
        return this.offsetY > height;
    }

    @computed get showNavText() {
        return this.opacity === 1;
    }

    @computed get showPrice() {
        const { minPrice, maxPrice } = this;
        return minPrice !== maxPrice ? `￥${minPrice}-￥${maxPrice}` : `￥${minPrice}`;
    }

    @computed get levelText() {
        const { priceType } = this;
        return priceType === 2 ? '拼店价' : priceType === 3 ? `${user.levelRemark}价` : 'V1价';
    }

    @computed get sectionDataList() {
        const { promoteInfoVOList, contentArr, groupActivity } = this;

        let sectionArr = [
            { key: productItemType.headerView, data: [productItemType.headerView] }
        ];
        if ((groupActivity.subProductList || []).length !== 0) {
            sectionArr.push(
                { key: productItemType.suit, data: [productItemType.suit] }
            );
        }
        if (promoteInfoVOList.length !== 0) {
            sectionArr.push(
                { key: productItemType.promote, data: [productItemType.promote] }
            );
        }
        sectionArr.push(
            { key: productItemType.service, data: [productItemType.service] },
            { key: productItemType.param, data: [productItemType.param] },
            { key: productItemType.comment, data: [productItemType.comment] },
            { key: productItemType.content, data: contentArr.slice() },
            { key: productItemType.priceExplain, data: [productItemType.priceExplain] }
        );
        return sectionArr;
    }

    @action productSuccess = (data) => {
        const { productStatus } = data || {};
        this.productStatus = productStatus;
        if (productStatus === 0) {
            this.loadingState = PageLoadingState.fail;
            this.netFailedInfo = { msg: `该商品走丢了\n去看看别的商品吧` };
        } else {
            this.productData = data || {};
            const {
                videoUrl, imgUrl, imgFileList, minPrice, maxPrice,
                originalPrice, priceType, name, secondName, freight,
                groupPrice, v0Price, shareMoney,
                monthSaleCount, skuList, specifyList, stockSysConfig, promoteInfoVOList,
                restrictions, paramList, comment, totalComment,
                prodCode, upTime, now, content, shopId, title, promotionResult
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
            this.comment = comment || {};
            this.totalComment = totalComment;
            this.contentArr = contentArr;
            this.shopId = shopId;
            this.title = title;
            const { singleActivity, groupActivity } = promotionResult || {};
            this.singleActivity = singleActivity || {};
            this.groupActivity = groupActivity || {};

            /*productStatus===3的时候需要刷新*/
            if (productStatus === 3 && upTime && now) {
                this.clearTime();
                this.needUpdateDate = setTimeout(() => {
                    this.requestProductDetail();
                }, upTime - now + 500);
            }

            /*商品详情埋点*/
            track(trackEvent.ProductDetail, {
                spuCode: prodCode,
                spuName: name,
                priceShareStore: groupPrice,
                pricePerCommodity: minPrice !== maxPrice ? `￥${minPrice}-￥${maxPrice}` : `￥${minPrice}`,
                priceType: priceType === 2 ? 100 : user.levelRemark
            });
        }
    };

    @action productError = (error) => {
        this.loadingState = PageLoadingState.fail;
        this.netFailedInfo = error;
    };

    clearTime = () => {
        this.needUpdateDate && clearTimeout(this.needUpdateDate);
    };

    /****网络请求****/
    requestProductDetail = () => {
        ProductApi.getProductDetailByCode({
            code: this.prodCode
        }).then((data) => {
            this.productSuccess((data || {}).data);
        }).catch((e) => {
            this.productError(e);
        });
    };
}
