//拼店权限或店铺基本状态
import { action, computed, observable } from 'mobx';
import { autorun } from 'mobx';

// import user from "../../../model/user";
class SpellStatusModel {

    /******************************【页面状态】******************************************/
    @observable
    refreshing = false;     //页面是否处于下拉刷新中
    @observable
    pageLoading = true;     //页面是否处于加载中
    @observable
    netFailedInfo = null;   //页面加载失败原因

    /******************************【当前用户基础拼店信息状态】******************************************/
    @observable
    addFlag = false;    //是否可以加入店铺
    @observable
    openFlag = false;   //是否可以开店
    @observable
    isYourStore = false;//店铺是否是自己的
    @observable
    store = null;       //店铺信息


    /******************************【store.status字段解释】******************************************/
    //店铺开通状态： 0-关闭 1-正常 2-已缴纳保证金 3-招募中

    @computed   //自己所加入的的店铺处于招募中
    get canEnterShopRecruiting() {
        return (this.store && this.store.status === 3);
    }

    @computed   //是否可以进入查看店铺信息的
    get canEnterShopInfo() {
        return this.store && this.store.status === 1;
    }

    @computed   //是否进入推荐页面（a.未加入过店铺但有加入权限的 b.加入过店铺，但是店铺仅缴纳保证金未开通的）
    get canEnterShopRecommend() {
        // 1.有店但是处于已缴纳，未设置为店名、头像的状态 或者店铺关闭的 2.无店，但是可以加入店铺
        if (this.netFailedInfo) {
            return false;
        }
        if (this.store && this.store.status === 2) {
            return true;
        }
        return this.addFlag;
    }

    @computed   //店铺状态处于仅缴纳保证金未创建的（创建指设置了店铺的基础信息的）
    get storeOnlyPayButNotCreate() {
        return this.store && this.isYourStore && this.store.status === 2;
    }


    /******************************【action】******************************************/
    @action //请求加载数据
    loadBaseInfoByType(type = 0) {
        const actions = {
            0: null,                            //什么都不做，静默刷新
            1: () => this.refreshing = true,      //标记为下拉刷新数据
            2: this.clearDataAndMarkLoading    //状态数据清空并标记页面处于初始化加载中...
        };
        actions[type] && actions[type]();
        // SpellShopApi.getStoreBaseInfoByUserId().then(this.setBaseInfoResponse.bind(this));
    }

    @action //设置数据
    setBaseInfoResponse(response) {
        if (!response) {
            return;
        }
        if (response.ok) {//数据请求成功
            const { data } = response;
            this.refreshing = false;
            this.pageLoading = false;
            this.netFailedInfo = null;
            this.addFlag = data.addFlag;
            this.openFlag = data.openFlag;
            this.isYourStore = data.isYourStore;
            this.store = data.store;
        } else {
            this.refreshing = false;
            this.pageLoading = false;
            this.netFailedInfo = response;
            this.addFlag = false;
            this.openFlag = false;
            this.isYourStore = false;
            this.store = null;
        }
    }

    @action //数据清空并标记未页面加载中状态
    clearDataAndMarkLoading() {
        this.refreshing = false;
        this.pageLoading = true;
        this.netFailedInfo = null;
        this.addFlag = false;
        this.openFlag = false;
        this.isYourStore = false;
        this.store = null;
    }
}

const spellStatusModel = new SpellStatusModel();


autorun(() => {
    //监听用户登录状态。刷新拼店基础状态
    // spellStatusModel.loadBaseInfoByType(user.isLogin?2:0);
});

export default spellStatusModel;
