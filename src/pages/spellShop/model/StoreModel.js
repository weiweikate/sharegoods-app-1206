//店铺基本状态
import { action, computed, observable } from 'mobx';
import SpellShopApi from '../api/SpellShopApi';

class StoreModel {

    /******************************【observable】******************************************/

    @observable//店铺信息
    storeData = {};

    @observable//店铺信息
    myStore = null;

    @observable//状态 0-关闭 1-正常 2-已缴纳保证金 3-招募中
    status = null;

    @observable//0:不在店铺 1:以加入 2-申请中 3-邀请加入中 4-取消申请 5-邀请不加入 6-邀请取消 9-已经退出 10:店铺关闭
    userStatus = null;

    @observable//招募状态 0-需要店长审核后加入 1-允许任何人加入 2-不允许任何人加入
    recruitStatus = null;

    @observable//店铺开店需要人数/店铺最大人数
    maxUser = null;

    @observable//店铺店员list
    storeUserList = [];

    /******************************【computed】******************************************/
    @computed//是否能开启店铺
    get canOpenStore() {
        return this.maxUser && this.storeUserNum && (this.maxUser < this.storeUserNum);
    }

    /******************************【action】******************************************/
    @action //成功
    getByIdData(data) {
        this.storeData = data;
        this.myStore = data.myStore;
        this.status = data.status;
        this.userStatus = data.userStatus;
        this.recruitStatus = data.recruitStatus;
        this.maxUser = data.maxUser;
        this.storeUserList = data.storeUserList || [];

    }

    @action //错误
    getByIdError(error) {
        this.storeData = null;
        this.myStore = null;
        this.status = null;
        this.userStatus = null;
        this.recruitStatus = null;
        this.maxUser = null;
        this.storeUserList = null;
    }

    @action //清空数据  重新加载
    clearGetByIdData() {
        this.storeData = null;
        this.myStore = null;
        this.status = null;
        this.userStatus = null;
        this.recruitStatus = null;
        this.maxUser = null;
        this.storeUserList = null;
    }

    /******************************【common】******************************************/


    //请求加载数据 0静默刷新  1下拉刷新数据  2状态数据清空并标记页面处于初始化加载中...
    getById(type = 0) {
        const actions = {
            0: null,
            1: () => this.refreshing = true,
            2: this.clearGetByIdData
        };

        actions[type] && actions[type]();

        SpellShopApi.getById().then((data) => {
            this.getByIdData(data.data || {});
        }).catch((error) => {
            this.getByIdError(error);
        });
    }

}

const storeModel = new StoreModel();

export default storeModel;
