//当前用户所在的店铺信息
import { action, computed, observable } from 'mobx';

function getDate(stamp) {
    const date = new Date(stamp);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}

class StoreModel {

    @observable
    store = 0;                  //店铺信息
    @observable
    dealer = {};//店长信息

    @observable
    dealerList = [];            //店员列表信息
    @observable
    isOpenStore = false;        //店铺是否开放
    @observable
    isYourStore = false;        //是否是自己的店铺
    @observable
    currTime = null;            //当前服务器系统时间戳

    @observable
    netFailedInfo = null;       //数据加载失败信息

    @observable
    isLoading = true;       //加载中
    @observable
    refreshing = false;     //下拉刷新中


    @computed
    get storeBonusDto() {
        return this.dealerList.storeBonusDto || {};
    }

    // 店铺创建时间
    @computed
    get storeCreateTime() {
        if (this.store && this.store.createTime) {
            return getDate(this.store.createTime);
        } else {
            return '';
        }
    }


    // 获取加入店铺时间
    @computed
    get addStoreTime() {
        if (this.dealer && this.dealer.addStoreTime) {
            return getDate(this.dealer.addStoreTime);
        } else {
            return '';
        }
    }

    @computed
    get recruitStatus() {
        return (this.store && this.store.recruitStatus) ? this.store.recruitStatus : 0;
    }

    @computed
    get storeId() {
        return (this.store && this.store.id) ? this.store.id : '';
    }

    @computed
    get storeStar() {
        return (this.store && this.store.storeStar) ? this.store.storeStar : 0;
    }

    @computed
    get storeHeadUrl() {
        return (this.store && this.store.headUrl) ? this.store.headUrl : null;
    }

    @computed
    get storeName() {
        return (this.store && this.store.name) ? this.store.name : null;
    }

    @computed
    get storeMasterName() {
        return (this.store && this.store.storeUser) ? this.store.storeUser : null;
    }


    @action
    setLoading(loading) {
        this.isLoading = loading;
        this.netFailedInfo = null;
    }

    @action
    setRefreshing(refreshing) {
        this.refreshing = refreshing;
    }

    // 设置店铺信息
    @action
    saveStoreInfo(info) {
        this.isLoading = false;
        this.refreshing = false;
        this.store = info.store;
        this.dealer = info.dealer;
        this.dealerList = info.dealerList || [];
        this.isOpenStore = info.isOpenStore;
        this.isYourStore = info.isYourStore;
        this.currTime = info.currTime;
        this.netFailedInfo = null;
    }

    @action
    setLoadError(info) {
        this.isLoading = false;
        this.netFailedInfo = info;
    }

    // 设置店铺申请权限
    @action
    setStoreRecruitStatus(recruitStatus) {
        if (this.store) {
            this.store.recruitStatus = recruitStatus;
        }
    }

    @action
    setStoreImgAndName(name, headUrl) {
        if (this.store) {
            this.store.name = name;
            this.store.headUrl = headUrl;
        }
    }

    @action
    clearData() {
        this.store = {};
        this.dealer = {};
        this.dealerList = [];
        this.isOpenStore = false;
        this.isYourStore = false;
        this.currTime = null;
        this.isLoading = true;
    }


}

const storeModel = new StoreModel();
export default storeModel;
