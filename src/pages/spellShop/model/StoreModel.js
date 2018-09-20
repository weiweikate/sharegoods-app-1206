//店铺基本状态
import { action, computed, observable } from 'mobx';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';
import SpellShopApi from '../api/SpellShopApi';

class StoreModel {

    /******************************【observable】******************************************/

    @observable//页面状态
    loadingState = PageLoadingState.null;

    @observable//配合loadingState.fail使用
    netFailedInfo = null;

    @observable//是否是刷新状态
    refreshing = false;


    @observable//店铺信息
    storeData = {};

    @observable //可不可以走开店流程1允许 2不允许  招募中和店铺使用
    allowCreateStore = null;
    @observable //能否看到拼店推荐页面1允许 2不允许  招募中和店铺使用
    allowGroupStore = null;

    @observable//状态 0-关闭 1-正常 2-已缴纳保证金 3-招募中
    status = null;

    @observable//0:不在店铺 1:以加入 2-申请中 3-邀请加入中 4-取消申请 5-邀请不加入 6-邀请取消 9-已经退出 10:店铺关闭
    userStatus = null;

    @observable//招募状态 0-需要店长审核后加入 1-允许任何人加入 2-不允许任何人加入
    recruitStatus = null;

    @observable//店铺开店需要人数/店铺最大人数
    maxUser = null;

    @observable//店铺当前人数
    storeUserNum = null;

    @observable//店铺店员list
    storeUserList = [];

    @observable//店铺店员list
    storeBonusDto = {};

    /******************************【computed】******************************************/
    @computed//是否能开启店铺
    get canOpenStore() {
        return this.maxUser && this.storeUserNum && (this.maxUser < this.storeUserNum);
    }

    /******************************【action】******************************************/
    @action //成功
    getByIdData(data) {
        this.loadingState = PageLoadingState.success;
        this.netFailedInfo = null;
        this.refreshing = false;

        this.storeData = data;
    }

    @action //错误
    getByIdError(error) {
        this.loadingState = PageLoadingState.fail;
        this.netFailedInfo = error;

        this.refreshing = false;

        this.storeData = null;
    }

    @action //清空数据  重新加载
    clearGetByIdData() {
        this.loadingState = PageLoadingState.loading;
        this.netFailedInfo = null;

        this.refreshing = false;

        this.storeData = null;
    }

    /******************************【common】******************************************/


    //请求加载数据 0静默刷新  1下拉刷新数据  2状态数据清空并标记页面处于初始化加载中...
    getById(type = 0, id) {
        const actions = {
            0: null,
            1: () => this.refreshing = true,
            2: this.clearGetByIdData
        };

        actions[type] && actions[type]();

        SpellShopApi.getById({ id: id }).then((data) => {
            this.getByIdData(data.data || {});
        }).catch((error) => {
            this.getByIdError(error);
        });
    }

}

const storeModel = new StoreModel();

export default storeModel;
