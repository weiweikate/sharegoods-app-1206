import { observable, computed, action } from 'mobx';
import ProductApi from './api/ProductApi';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
import { track, trackEvent } from '../../utils/SensorsTrack';
import user from '../../model/user';
import StringUtils from '../../utils/StringUtils';
import ScreenUtils from '../../utils/ScreenUtils';
import DateUtils from '../../utils/DateUtils';
import TopicAPI from '../topic/api/TopicApi';
import { ProductDetailCouponsViewModel } from './components/ProductDetailCouponsView';
import { ProductDetailAddressModel } from './components/ProductDetailAddressView';
import { ProductDetailSuitModel } from './components/ProductDetailSuitView';
import ProductGroupModel from './components/promotionGroup/ProductGroupModel';

const { width, height } = ScreenUtils;
const { isNoEmpty } = StringUtils;

export const contentImgWidth = width;

export const productItemType = {
    headerView: 'headerView',
    suit: 'suit',
    coupons: 'coupons',
    promote: 'promote',
    service: 'service',
    param: 'param',
    address: 'address',
    comment: 'comment',
    content: 'content',
    groupIsOld: 'groupIsOld',
    groupOpenPersonS: 'groupOpenPersonS',
    groupProductList: 'groupProductList',
    priceExplain: 'priceExplain'
};

export const sectionType = {
    sectionHeader: 'section0',//头部
    sectionSuit: 'section1',//套餐
    sectionPromotion: 'section2',//营销
    sectionSetting: 'section3',//设置类 单行
    sectionScore: 'section4',//晒单
    sectionGroup: 'section41',//拼团
    sectionContent: 'section5',//图片
    sectionExPlain: 'section6'//价格说明
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
/*（0:秒杀;1:套餐;2:直降;3:满减;4:满折,5拼团）*/
export const activity_type = {
    skill: 0,
    group: 1,
    verDown: 2,
    fullDown: 3,
    fullSale: 4,
    pinGroup: 5
};

export default class ProductDetailModel {

    productDetailCouponsViewModel = new ProductDetailCouponsViewModel();
    productDetailAddressModel = new ProductDetailAddressModel();
    productDetailSuitModel = new ProductDetailSuitModel();
    productGroupModel = new ProductGroupModel();

    trackType;
    trackCode;
    @observable loadingState = PageLoadingState.loading;
    @observable netFailedInfo = {};

    @observable offsetY = 0;
    @observable opacity = 0;

    @observable prodCode;
    /*总数据*/
    @observable productData = {};
    /*0产品删除 1产品上架 2产品下架(包含未上架的所有状态，出去删除状态) 3未开售*/
    @observable productStatus;
    /*1-普通商品,2-内购商品,3-虚拟商品,4-卡券商品*/
    @observable type;
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
    /*自返金额*/
    @observable selfReturning;
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
    /*商品库存全*/
    @observable skuList = [];

    /**根据现有库存和地区库存结合成新德skuList**/
    @computed get skuListByArea() {
        const { productDetailAddressModel, skuList } = this;
        const { areaSkuList } = productDetailAddressModel;
        if (areaSkuList) {
            if (areaSkuList.length > 0) {
                return areaSkuList.map((areaSkuItem) => {
                    for (const skuItem of skuList) {
                        if (skuItem.skuCode === areaSkuItem.skuCode) {
                            return { ...skuItem, ...areaSkuItem };
                        }
                    }
                    return null;
                });
            }
            return [];
        }
        return skuList;
    }

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
    /*参数
     * [{paramName: "上市时间", paramValue: "2018年12月"}]
     * */
    @observable paramList = [];

    /*商品评论{ headImg, nickname, imgUrl ,comment}*/
    @observable comment;
    @observable overtimeComment;
    /*商品数量*/
    @observable totalComment;
    /*商品详情图片*/
    @observable contentArr = [];
    @observable now;
    /*开售时间*/
    @observable upTime;
    @observable sevenDayReturn;//7天退换
    @observable weekendDelivery;//节假日发货
    @observable orderOnProduct;//商详下单

    /**七鱼相关**/
    @observable shopId;
    @observable title;

    /**营销活动**/
    @observable promotionLimitNum;
    /*0:秒杀;1:套餐;2:直降;3:满减;4:满折,5拼团*/
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
     * promotionAttentionNum 关注人数
     * promotionSaleRate 进度条
     * */
    @observable promotionDecreaseAmount;
    @observable promotionPrice;

    @observable promotionSaleNum;
    @observable promotionStockNum;
    @observable promotionAttentionNum;
    @observable promotionSaleRate;

    @observable promotionMinPrice;
    @observable promotionMaxPrice;

    @computed get isSingleSpec() {
        let isSingle = true;
        /*是否单规格*/
        for (const item of (this.specifyList || [])) {
            if (item.specValues.length > 1) {
                isSingle = false;
                break;
            }
        }
        return isSingle;
    }

    @computed get nameShareText() {
        const { activityType, activityStatus, promotionDecreaseAmount, secondName } = this;
        if (activityType === activity_type.skill && activityStatus === activity_status.inSell) {
            return {
                name: `工厂价秒杀，不足24小时！${this.name}`,
                desc: '击穿工厂价，实惠仅此一次！'
            };
        } else if (activityType === activity_type.verDown && activityStatus === activity_status.inSell) {
            return {
                name: `直降${promotionDecreaseAmount}元，实惠仅此一次！${this.name}`,
                desc: '击穿工厂价，实惠仅此一次！'
            };
        } else {
            return {
                name: `${this.monthSaleCount >= 1000 ? '[明星爆款]' : (this.monthSaleCount >= 500 ? '[人气爆款]' : '[爆款新品]')}${this.name}`,
                desc: secondName
            };
        }
    }

    @computed get priceTypeTextList() {
        const { couponsList } = this.productDetailCouponsViewModel;
        if (this.isSkillIn) {
            return ['秒杀价', '限时'];
        } else if (couponsList.length > 0) {
            return ['领券更省', '限时'];
        } else {
            return ['零售价'];
        }
    }

    /*产品当前页是否使用活动价格  (直降 秒杀)进行中 (拼团未计算在内,因为有存在正常单独购买流程)*/
    @computed get productIsPromotionPrice() {
        const { activityType, activityStatus } = this;
        let tempType = activityType === activity_type.skill || activityType === activity_type.verDown;
        return tempType && activityStatus === activity_status.inSell;
    }

    @computed get isSkillIn() {
        const { activityType, activityStatus } = this;
        return activityType === activity_type.skill && activityStatus === activity_status.inSell;
    }

    @computed get isHuaFei() {
        const { type, skuList } = this;
        if (type === 3) {
            const { assetsBind } = skuList[0] || {};
            if ((assetsBind || {}).assetsType === 'TELEPHONE_CHARGE') {
                return true;
            }
        }
        return false;
    }

    @computed get isGroupIn() {
        const { activityType, activityStatus, groupActivity } = this;
        return activityType === activity_type.group && activityStatus === activity_status.inSell && (groupActivity.subProductList || []).length > 0;
    }

    //老礼包还要计算子商品能不能买
    @computed get groupSubProductCanSell() {
        const { subProductList } = this.groupActivity;
        for (const subProduct of (subProductList || [])) {
            const { skuList } = subProduct || {};
            const skuItem = (skuList || [])[0];
            const { sellStock } = skuItem || {};
            if (sellStock < 1) {
                return false;
            }
        }
        return true;
    }

    @computed get isPinGroupIn() {
        const { activityType, activityStatus } = this;
        return activityType === activity_type.pinGroup && activityStatus === activity_status.inSell;
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
        let leave4 = Math.floor(leave3 % 1000 / 10);

        hours = days * 24 + hours;
        hours = hours >= 10 ? hours : hours === 0 ? '00' : `0${hours}`;
        minutes = minutes >= 10 ? minutes : minutes === 0 ? '00' : `0${minutes}`;
        second = second >= 10 ? second : second === 0 ? '00' : `0${second}`;
        leave4 = leave4 >= 10 ? leave4 : leave4 === 0 ? '00' : `0${leave4}`;
        if (activityStatus === activity_status.unBegin) {
            if (this.activityType === activity_type.pinGroup) {
                return `距开始${hours}:${minutes}:${second}:${leave4}`;
            }
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
            if (this.activityType === activity_type.pinGroup) {
                return `${hours}:${minutes}:${second}:${leave4}`;
            }
            if (days < 1) {
                return `距结束${hours}:${minutes}:${second}:${leave4}`;
            } else {
                return DateUtils.formatDate(this.endTime, 'MM-dd HH:mm') + '结束';
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
            return this.tags[0] || '';
        }
        return priceType === 2 ? '拼店价' : '';
    }

    @computed get sectionDataList() {
        const {
            promoteInfoVOList, contentArr, paramList, productDetailCouponsViewModel,
            type, isGroupIn, productDetailSuitModel, isHuaFei, isPinGroupIn, singleActivity
        } = this;
        const { couponsList } = productDetailCouponsViewModel;
        const { activityCode } = productDetailSuitModel;
        const { activityTag } = singleActivity;
        /*头部*/
        let sectionArr = [
            { key: sectionType.sectionHeader, data: [{ itemKey: productItemType.headerView }] }
        ];
        /*套餐*/
        if (isGroupIn || activityCode) {
            !isHuaFei && sectionArr.push(
                { key: sectionType.sectionSuit, data: [{ itemKey: productItemType.suit }] }
            );
        }
        /*优惠券,促销*/
        let promoteItemList = [];
        couponsList.length !== 0 && promoteItemList.push({ itemKey: productItemType.coupons });
        promoteInfoVOList.length !== 0 && promoteItemList.push({ itemKey: productItemType.promote });
        (promoteItemList.length !== 0 && !isHuaFei) && sectionArr.push({
            key: sectionType.sectionPromotion,
            data: promoteItemList
        });

        /*服务,参数,选择地址*/
        let settingList = [];
        !isHuaFei && settingList.push({ itemKey: productItemType.service });
        paramList.length !== 0 && settingList.push({ itemKey: productItemType.param });
        type !== 3 && settingList.push({ itemKey: productItemType.address });
        sectionArr.push({ key: sectionType.sectionSetting, data: settingList });
        /*拼团相关*/
        let groupList = [];
        activityTag === 101106 && groupList.push({ itemKey: productItemType.groupIsOld });
        groupList.push({ itemKey: productItemType.groupOpenPersonS });
        groupList.push({ itemKey: productItemType.groupProductList });
        isPinGroupIn && sectionArr.push({ key: sectionType.sectionGroup, data: groupList });
        /*晒单,图片,价格说明*/
        sectionArr.push(
            { key: sectionType.sectionScore, data: [{ itemKey: productItemType.comment }] },
            { key: sectionType.sectionContent, data: contentArr.slice() },
            { key: sectionType.sectionExPlain, data: [{ itemKey: productItemType.priceExplain }] }
        );
        return sectionArr;
    }


    @action productSuccess = (data) => {
        const { productStatus } = data || {};
        this.productStatus = productStatus;
        if (productStatus === product_status.delete) {
            this.loadingState = PageLoadingState.fail;
            this.netFailedInfo = { msg: '该商品走丢了\n去看看别的商品吧' };
        } else {
            this.productData = data || {};
            const {
                type, videoUrl, imgUrl, imgFileList, minPrice, maxPrice,
                originalPrice, priceType, name, secondName, freight,
                groupPrice, v0Price, shareMoney, selfReturning,
                monthSaleCount, skuList, specifyList, stockSysConfig, promoteInfoVOList,
                paramList, comment, totalComment, overtimeComment,
                upTime, now, content, sevenDayReturn, weekendDelivery, orderOnProduct,
                promotionResult, promotionDecreaseAmount, promotionPrice, promotionLimitNum,
                promotionSaleNum, promotionStockNum, promotionMinPrice, promotionMaxPrice, promotionAttentionNum, promotionSaleRate
            } = data || {};

            let contentArr = isNoEmpty(content) ? content.split(',') : [];

            this.loadingState = PageLoadingState.success;
            this.type = type;
            this.videoUrl = videoUrl;
            this.imgUrl = imgUrl;
            this.imgFileList = imgFileList || [];
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
            this.groupPrice = groupPrice;
            this.v0Price = v0Price;
            this.shareMoney = shareMoney;
            this.selfReturning = selfReturning;
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
            this.paramList = paramList || [];
            /*不赋值默认 判空用*/
            this.comment = comment;
            this.overtimeComment = overtimeComment;
            this.totalComment = totalComment;
            this.contentArr = contentArr;
            this.now = now;
            this.upTime = upTime;
            this.sevenDayReturn = sevenDayReturn;
            this.weekendDelivery = weekendDelivery;
            this.orderOnProduct = orderOnProduct;

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
            this.promotionAttentionNum = promotionAttentionNum;
            this.promotionSaleRate = promotionSaleRate;

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

            /**
             * 0：未知1：普通商品2：秒杀商品3：套餐商品4：直降商品 7：礼包商品
             */
            let productType = 1;
            if (this.activityStatus === activity_status.inSell) {
                if (this.activityType === activity_type.skill) {
                    productType = 2;
                }
                if (this.activityType === activity_type.verDown) {
                    productType = 4;
                }
                if (this.activityType === activity_type.group) {
                    productType = 3;
                }
            }
            /*商品详情埋点*/
            track(trackEvent.ProductDetail, {
                productShowSource: this.trackType || 0,
                sourceAttributeCode: this.trackCode || 0,
                spuCode: this.prodCode,
                spuName: name,
                productType: productType,
                priceShareStore: groupPrice,
                priceShow: this.activityStatus === activity_status.inSell ? promotionMinPrice : minPrice,
                priceType: priceType === price_type.shop ? '100' : user.levelRemark
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

    /****商详网络请求****/
    requestProductDetail = () => {
        /*
        * SPU00000263 秒杀
        * SPU00000375 直降
        * SPU00000361 套餐主商品 SPU00000098
        * */
        /*兼容旧版本秒杀跳转普通商品*/
        if (this.prodCode && this.prodCode.indexOf('MS') === 0) {
            TopicAPI.seckill_findByCode({ code: this.prodCode }).then((data) => {
                const { prodCode } = data.data || {};
                this.requestProductDetailReal(prodCode);
            }).catch(e => {
                this.productError(e);
            });
        } else {
            this.requestProductDetailReal(this.prodCode);
        }
        /**获取收货地址**/
        this.productDetailAddressModel.requestAddress();
        /*获取当前商品优惠券列表*/
        this.productDetailCouponsViewModel.requestListProdCoupon(this.prodCode);
        /*获取套餐信息*/
        this.productDetailSuitModel.request_promotion_detail(this.prodCode);
    };

    /**请求商品**/
    requestProductDetailReal = (code) => {
        this.prodCode = code;
        ProductApi.getProductDetailByCodeV2({
            code: this.prodCode
        }).then((data) => {
            let tempData = data.data || {};
            this.productSuccess(tempData);
            /*获取当前商品供应商*/
            this.requestShopInfo(tempData.merchantCode);
            /**赋值prodCode会autoRun自动拉取库存**/
            if (tempData && tempData.type !== 3) {
                this.productDetailAddressModel.prodCode = this.prodCode;
            }

            //拼团
            const { activityType, singleActivity } = this;
            if (activityType !== activity_type.pinGroup) {
                return;
            }
            const { code, activityTag } = singleActivity;
            this.productGroupModel.requestCheckStartJoinUser({
                prodCode: this.prodCode,
                activityCode: code,
                activityTag
            });
            this.productGroupModel.requestGroupList({ prodCode: this.prodCode, activityCode: code });
            this.productGroupModel.requestGroupProduct({ activityCode: code, prodCode: this.prodCode });
            this.productGroupModel.requestGroupDesc();
        }).catch((e) => {
            this.productError(e);
        });
    };


    requestShopInfo = (code) => {
        ProductApi.getProductShopInfoBySupplierCode({ supplierCode: code }).then((data) => {
            this.shopInfoSuccess(data.data);
        });
    };

    @action shopInfoSuccess = (data) => {
        const { shopId, title } = data;
        this.shopId = shopId;
        this.title = title;
    };
}
