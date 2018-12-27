import { observable, action, computed } from 'mobx';
import HomeAPI from '../../api/HomeAPI';
import { PageLoadingState } from '../../../../components/pageDecorator/PageState';
import user from '../../../../model/user';

class XpDetailModel {
    @observable basePageState = PageLoadingState.null;
    @observable basePageError = {};

    @observable baseData = '';
    /*活动名称*/
    @observable name = '';
    /*banner*/
    @observable bannerUrl = '';
    /*优惠券id*/
    @observable couponId = '';
    /*起始金额，送优惠券*/
    @observable startPrice = '';
    /*送优惠券数量*/
    @observable startCount = '';
    /*赠送最大数量*/
    @observable maxCount = '';
    /*活动开始时间*/
    @observable startTime = '';
    /*活动结束时间*/
    @observable endTime = '';
    /*创建人*/
    @observable createAdmin = '';
    /*说明*/
    @observable contents = '';
    /*创建时间*/
    @observable createTime = '';
    /*修改时间*/
    @observable updateTime = '';

    /*
    * spuCode  产品code
    * name     产品名称
    * imgUrl   产品图片
    * status   状态（0：关闭 1：正常）
    */
    /*产品列表*/
    @observable prods = [];

    /*
    * startPrice    起始金额
    * rate          倍数
    */
    /*规则列表*/
    @observable rules = [];


    /***************普通商品******************/
    @observable selectedSpuCode = '';
    @observable productPageState = PageLoadingState.null;
    @observable productPageError = {};

    @observable pData = {};
    @observable pImgUrl = '';
    @observable pVideoUrl = '';
    @observable pImgFileList = '';
    @observable pName = '';
    @observable pSecondName = '';
    @observable pParamList = [];


    @computed get pHtml() {
        let contentS = this.pData.content || '';
        contentS = contentS.split(',') || [];
        let html = '';
        contentS.forEach((item) => {
            html = `${html}<p><img src=${item}></p>`;
        });
        return html;
    }

    @computed get pPrice() {
        let { minPrice, maxPrice } = this.pData;
        return minPrice !== maxPrice ? `${minPrice || ''}-${maxPrice || ''}` : `${minPrice || ''}`;
    }

    @computed get skuTotal() {
        let skuList = this.pData.skuList;
        let count = 0;
        skuList.forEach((item) => {
            count = count + item.sellStock;
        });
        return count;
    }

    @computed get pPriceType() {
        let priceType = this.pData.priceType;
        return priceType === 2 ? '拼店价' : priceType === 3 ? `${user.levelRemark}价` : '原价';
    }

    /******************************【action】******************************************/

    @action selectSpuCode = (spuCode) => {
        this.prods.forEach((item) => {
            if (item.spuCode === spuCode) {
                item.isSelected = true;
                this.request_getProductDetailByCode(item.spuCode);
            } else {
                item.isSelected = false;
            }
        });
    };

    /*经验详情接口返回*/
    @action saveActData = (data) => {
        this.basePageState = PageLoadingState.success;
        data = data || {};
        this.name = data.name || '';
        this.bannerUrl = data.bannerUrl || '';
        this.couponId = data.couponId || '';
        this.startPrice = data.startPrice || '';
        this.startCount = data.startCount || '';
        this.maxCount = data.maxCount || '';
        this.startTime = data.startTime || '';
        this.endTime = data.endTime || '';
        this.createAdmin = data.createAdmin || '';
        this.contents = data.contents || '';
        this.createTime = data.createTime || '';
        this.updateTime = data.updateTime || '';
        this.prods = data.prods || [{}];
        this.rules = data.rules || [];

        /*请求默认第一个数据*/
        if (this.prods.length > 0) {
            let item = this.prods[0];
            this.selectSpuCode(item.spuCode);
        }
    };

    @action actError = (error) => {
        this.basePageState = PageLoadingState.fail;
        this.basePageError = error || {};
    };

    @action saveProductData = (data) => {
        this.productPageState = PageLoadingState.success;
        data = data || {};

        this.pData = data;
        this.pImgUrl = data.imgUrl || '';
        this.pVideoUrl = data.videoUrl || '';
        this.pImgFileList = data.imgFileList || '';
        this.pName = data.name || '';
        this.pSecondName = data.secondName || '';
        this.pParamList = data.paramList || [];
    };

    @action productError = (error) => {
        this.productPageState = PageLoadingState.fail;
        this.productPageError = error || {};
    };

    /*********【网络】***********/

    @action request_act_exp_detail = (activityCode) => {
        this.basePageState = PageLoadingState.loading;
        HomeAPI.act_exp_detail({
            activityCode: 'JF201812240014'
        }).then((data) => {
            this.saveActData(data.data);
        }).catch((error) => {
            this.actError(error);
        });
    };

    /**普通商品**/

    /*第一加载第一个  选择加载  失败重试*/
    @action request_getProductDetailByCode = (spuCode) => {
        this.productPageState = PageLoadingState.loading;
        spuCode = spuCode || this.selectedSpuCode;
        this.selectedSpuCode = spuCode;
        HomeAPI.getProductDetailByCode({
            code: 'SPU00000168'
        }).then((data) => {
            this.saveProductData(data.data);
        }).catch((error) => {
            this.productError(error);
        });
    };
}

export default XpDetailModel;
