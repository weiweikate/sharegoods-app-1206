import { observable, computed, action } from 'mobx';
import ProductApi from './api/ProductApi';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
import { track, trackEvent } from '../../utils/SensorsTrack';
import user from '../../model/user';
import StringUtils from '../../utils/StringUtils';
import ScreenUtils from '../../utils/ScreenUtils';
import DateUtils from '../../utils/DateUtils';

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
/*活动状态*/
export const activity_status = {
    unBegin: 1,//未开始
    inSell: 2//在售
};
/*（0:秒杀;1:套餐;2:直降;3:满减;4:满折）*/
export const activity_type = {
    skill: 0,
    group: 1,
    verDown: 2,
    fullDown: 3,
    fullSale: 4
};

export default class ProductDetailModel {

    @observable prodCode;
    @observable loadingState = PageLoadingState.loading;
    @observable netFailedInfo = {};

    @observable offsetY = 0;
    @observable opacity = 0;

    /*总数据*/
    @observable productData;
    /*0产品删除 1产品上架 2产品下架(包含未上架的所有状态，出去删除状态) 3未开售*/
    @observable productStatus;
    /*视频*/
    @observable videoUrl;
    /*主图*/
    @observable imgUrl;
    /*轮播图(除去主图)*/
    @observable imgFileList = [];
    @observable minPrice;
    @observable maxPrice;
    @observable groupPrice;
    /*分享显示的零售价*/
    @observable v0Price;
    @observable shareMoney;
    /*原价*/
    @observable originalPrice;
    /*价格类型 2拼店价 3会员价*/
    @observable priceType;
    @observable name;
    @observable secondName;
    /*快递 0包邮*/
    @observable freight;
    /*月销*/
    @observable monthSaleCount;
    /*商品库存*/
    @observable skuList = [];
    /*商品规格*/
    @observable specifyList = [];
    /*库存替换显示
     * [{value(40★充足)}]
     * */
    @observable stockSysConfig = [];
    /*促销信息
     * [{type(8：经验翻倍 9：券兑换),message}]
     * */
    @observable promoteInfoVOList = [];
    /*服务信息 位运算 1(支持优惠券) 4(支持7天退换) 8(支持节假日退换)*/
    @observable restrictions;
    /*参数
     * [{paramName: "上市时间", paramValue: "2018年12月"}]
     * */
    @observable paramList = [];

    /*商品评论{ headImg, nickname, imgUrl ,comment}*/
    @observable comment;
    /*商品数量*/
    @observable totalComment;
    /*商品详情图片*/
    @observable contentArr = [];
    @observable now;

    /**七鱼相关**/
    @observable shopId;
    @observable title;

    /**营销活动**/
    /*0:秒杀;1:套餐;2:直降;3:满减;4:满折*/
    @observable activityType;
    /*活动status 1未开始,2进行中,3已结束*/
    @observable activityStatus;
    @observable startTime;
    @observable endTime;
    /*倒计时*/
    @observable skillTimeout = 0;
    /*秒杀*/
    /*
    * type  活动类型（0:秒杀;1:套餐;2:直降;3:满减;4:满折）
    * startTime
    * endTime
    * */
    @observable singleActivity = {};
    /*套餐*/
    /*subProductList:[]*/
    @observable groupActivity = [];
    /*活动标签*/
    @observable tags = [];
    /*
     * promotionDecreaseAmount 优惠
     * promotionPrice 现价
     * promotionSaleNum 已抢
     * promotionStockNum 还剩
     * */
    @observable promotionDecreaseAmount;

    @observable promotionPrice;
    @observable promotionSaleNum;
    @observable promotionStockNum;

    @observable promotionMinPrice;
    @observable promotionMaxPrice;

    /*产品当前页是否使用活动价格  (直降 秒杀)进行中*/
    @computed get productIsPromotionPrice() {
        const { activityType, activityStatus } = this;
        let tempType = activityType === activity_type.skill || activityType === activity_type.verDown;
        return tempType && activityStatus === activity_status.inSell;
    }

    /*秒杀倒计时显示*/
    @computed get showTimeText() {
        const { skillTimeout, activityStatus } = this;
        //天数
        let days = Math.floor(skillTimeout / (24 * 3600 * 1000));
        //去除天数
        let leave1 = skillTimeout % (24 * 3600 * 1000);
        //小时
        let hours = Math.floor(leave1 / (3600 * 1000));
        //去除小时
        let leave2 = leave1 % (3600 * 1000);
        //分钟
        let minutes = Math.floor(leave2 / (60 * 1000));
        //去除分钟
        let leave3 = leave2 % (60 * 1000);
        //秒
        let second = Math.floor(leave3 / 1000);
        //mill
        let leave4 = Math.floor(leave3 % 1000 / 100);

        hours = days * 24 + hours;
        hours = hours >= 10 ? hours : hours === 0 ? `00` : `0${hours}`;
        minutes = minutes >= 10 ? minutes : minutes === 0 ? `00` : `0${minutes}`;
        second = second >= 10 ? second : second === 0 ? `00` : `0${second}`;
        if (activityStatus === activity_status.unBegin) {
            //'yyyy-MM-dd HH:mm:ss';
            //小于一小时
            if (skillTimeout < 3600 * 1000) {
                return `距开抢${minutes}:${second}:${leave4}`;
            }
            if (DateUtils.isToday(this.startTime)) {
                let time = DateUtils.formatDate(this.startTime, 'HH:mm');
                return `今天${time}开抢`;
            }
            if (DateUtils.isTomorrow(this.startTime)) {
                let time = DateUtils.formatDate(this.startTime, 'HH:mm');
                return `明天${time}开抢`;
            }
            return DateUtils.formatDate(this.startTime, 'dd号HH:mm') + '开抢';
        } else if (activityStatus === activity_status.inSell) {
            if (days < 1) {
                return `距结束${hours}:${minutes}:${second}:${leave4}`;
            } else {
                return DateUtils.formatDate(this.startTime, 'dd-HH mm:ss') + '结束';
            }
        } else {
            return '';
        }
    }

    /*秒杀抢空*/
    @computed get showSellOut() {
        const { activityType, activityStatus, promotionStockNum } = this;
        return activityType === activity_type.skill && activityStatus === activity_status.inSell && promotionStockNum === 0;
    }

    /**显示向上返回**/
    @computed get showTop() {
        return this.offsetY > height;
    }

    /*显示标题和快速跳转列表*/
    @computed get showNavText() {
        return this.opacity === 1;
    }

    @computed get showPrice() {
        const { minPrice, maxPrice } = this;
        return minPrice !== maxPrice ? `￥${minPrice}-￥${maxPrice}` : `￥${minPrice}`;
    }

    @computed get levelText() {
        const { priceType, activityStatus, activityType } = this;
        if (activityStatus === activity_status.inSell && activityType === activity_type.verDown) {
            return this.tags[0];
        }
        return priceType === 2 ? '拼店价' : priceType === 3 ? `${user.levelRemark}价` : 'V1价';
    }

    @computed get sectionDataList() {
        const { promoteInfoVOList, contentArr, groupActivity, activityStatus, paramList } = this;

        let sectionArr = [
            { key: productItemType.headerView, data: [productItemType.headerView] }
        ];
        if (activityStatus === activity_status.inSell && (groupActivity.subProductList || []).length > 0) {
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
            { key: productItemType.service, data: [productItemType.service] }
        );
        if (paramList.length !== 0) {
            sectionArr.push(
                { key: productItemType.param, data: [productItemType.param] }
            );
        }
        sectionArr.push(
            { key: productItemType.comment, data: [productItemType.comment] },
            { key: productItemType.content, data: contentArr.slice() },
            { key: productItemType.priceExplain, data: [productItemType.priceExplain] }
        );
        return sectionArr;
    }


    @action productSuccess = (data) => {
        const { productStatus } = data || {};
        this.productStatus = productStatus;
        if (productStatus === product_status.delete) {
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
                prodCode, upTime, now, content,
                shopId, title,
                promotionResult, promotionDecreaseAmount, promotionPrice,
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
            this.totalComment = totalComment;
            this.contentArr = contentArr;
            this.now = now;

            this.shopId = shopId;
            this.title = title;

            const { singleActivity, groupActivity, tags } = promotionResult || {};
            this.singleActivity = singleActivity || {};
            this.groupActivity = groupActivity || {};
            this.tags = tags;
            this.promotionDecreaseAmount = promotionDecreaseAmount;

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
                this._startSkillInterval(now, startTimeT);
            } else if (now >= startTimeT && now < endTimeT) {
                this.activityStatus = activity_status.inSell;
                this._startSkillInterval(now, endTimeT);
            } else {
                this.activityStatus = null;
            }

            /*未开售的时候需要刷新*/
            if (productStatus === product_status.future && upTime && now) {
                this.needUpdateDate && clearTimeout(this.needUpdateDate);
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
                priceType: priceType === price_type.shop ? 100 : user.levelRemark
            });
        }
    };

    @action productError = (error) => {
        this.loadingState = PageLoadingState.fail;
        this.netFailedInfo = error;
    };

    /*任何活动 未开始到开始  开始到结束  刷新(结束时间加500ms)*/
    @action _startSkillInterval = (start, end) => {
        this.skillInterval && clearInterval(this.skillInterval);
        if (isNoEmpty(start) && isNoEmpty(end)) {
            let countdownDate = new Date().getTime() + ((end + 500) - start);
            this.skillInterval = setInterval(() => {
                let timeOut = countdownDate - new Date().getTime();
                if (timeOut <= 0) {
                    timeOut = 0;
                    this.skillInterval && clearInterval(this.skillInterval);
                    this.loadingState = PageLoadingState.loading;
                    this.requestProductDetail();
                }
                this.skillTimeout = timeOut;
            }, 200);
        }
    };

    clearTime = () => {
        this.needUpdateDate && clearTimeout(this.needUpdateDate);
        this.skillInterval && clearInterval(this.skillInterval);
    };

    /****网络请求****/
    requestProductDetail = () => {
        /*
        * SPU00000263 秒杀
        * SPU00000375 直降
        * SPU00000361 套餐主商品 SPU00000098
        * */
        ProductApi.getProductDetailByCodeV2({
            code: this.prodCode
        }).then((data) => {
            this.productSuccess((data || {}).data);
        }).catch((e) => {
            this.productError(e);
        });
    };
}
