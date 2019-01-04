import { observable, action, computed } from 'mobx';
import HomeAPI from '../../api/HomeAPI';
import { PageLoadingState } from '../../../../components/pageDecorator/PageState';
import user from '../../../../model/user';
import EmptyUtils from '../../../../utils/EmptyUtils';
import MessageApi from '../../../message/api/MessageApi';

class XpDetailModel {
    @observable showUpSelectList = false;

    @observable basePageState = PageLoadingState.null;
    @observable basePageError = {};

    @observable baseData = '';
    /*起始金额，送优惠券*/
    @observable startPrice = '';
    /*送优惠券数量*/
    @observable startCount = '';
    /*赠送最大数量*/
    @observable maxCount = '';
    /*说明*/
    @observable contents = '';

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

    /*
    * name 名称
    * remarks 备注
    * effectiveDays 有效期
    * value 面值
    * */
    @observable coupon = {};

    @observable messageCount = 0;


    /***************普通商品******************/
    @observable selectedSpuIndex = 0;
    @observable selectedSpuCode = '';
    @observable productPageState = PageLoadingState.null;
    @observable productPageError = {};

    @observable pData = {};//selectionPage
    //0删除 1正常  2下架  3当前时间不能买
    @observable pProductStatus = '';
    @observable pImgUrl = '';
    @observable pVideoUrl = '';
    @observable pImgFileList = '';
    @observable pName = '';
    @observable pSecondName = '';
    @observable pParamList = [];
    @observable pUpTime = '';


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

    @computed get pCantBuy() {
        let { buyLimit, leftBuyNum } = this.pData;
        //不能买
        return this.pProductStatus !== 1 || (buyLimit !== -1 && leftBuyNum === 0) || this.skuTotal === 0;
    }

    @computed get pBuyText() {
        let { buyLimit, leftBuyNum } = this.pData;
        let isLimit = buyLimit !== -1 && leftBuyNum === 0;
        //能买
        let canBuy = this.pProductStatus === 1 && this.skuTotal !== 0 && !isLimit;
        return canBuy ? '立即购买' : (isLimit ? '您已购买过该商品' : '暂不可购买');
    }

    /******************************【action】******************************************/

    @action selectSpuCode = (spuCode) => {
        this.prods.forEach((item, index) => {
            if (item.spuCode === spuCode) {
                item.isSelected = true;
                this.selectedSpuCode = spuCode;
                this.selectedSpuIndex = index;
            } else {
                item.isSelected = false;
            }
        });
        this.request_getProductDetailByCode();
    };

    /*经验详情接口返回*/
    @action saveActData = (data) => {
        this.basePageState = PageLoadingState.success;
        data = data || {};
        this.startPrice = data.startPrice || '';
        this.startCount = data.startCount || '';
        this.maxCount = data.maxCount || '';
        this.contents = data.contents || '';

        /*原始数据未被观察前添加可观察key*/
        data.prods = data.prods || [];
        data.prods.forEach((item) => {
            item.isSelected = false;
        });
        this.prods = data.prods;

        this.rules = data.rules || [];
        this.coupon = (data.coupon || {}).coupon || {};

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
        this.pProductStatus = data.productStatus || '';
        this.pImgUrl = data.imgUrl || '';
        this.pVideoUrl = data.videoUrl || '';
        this.pImgFileList = data.imgFileList || [];
        this.pName = data.name || '';
        this.pSecondName = data.secondName || '';
        this.pParamList = data.paramList || [];
        this.pUpTime = data.upTime || '';
    };

    @action productError = (error) => {
        this.productPageState = PageLoadingState.fail;
        this.productPageError = error || {};
    };

    /*********【网络】***********/

    request_act_exp_detail = (activityCode) => {
        this.basePageState = PageLoadingState.loading;
        HomeAPI.act_exp_detail({
            //测试 JF201812270017
            activityCode: 'JF201812270017'
        }).then((data) => {
            this.saveActData(data.data);
        }).catch((error) => {
            this.actError(error);
        });
    };

    /**普通商品**/

    /*第一加载第一个  选择加载  失败重试*/
    request_getProductDetailByCode = () => {
        this.productPageState = PageLoadingState.loading;
        HomeAPI.getProductDetailByCode({
            code: this.selectedSpuCode
        }).then((data) => {
            this.saveProductData(data.data);
        }).catch((error) => {
            this.productError(error);
        });
    };

    /**消息数量**/
    getMessageCount = () => {
        MessageApi.getNewNoticeMessageCount().then(result => {
            if (!EmptyUtils.isEmpty(result.data)) {
                const { shopMessageCount, noticeCount, messageCount } = result.data;
                this.messageCount = shopMessageCount + noticeCount + messageCount;
            }
        }).catch((error) => {
        });
    };
}

export default XpDetailModel;
