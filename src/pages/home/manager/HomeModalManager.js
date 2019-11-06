/**
 * @author xzm
 * @date 2018/11/20
 */


'use strict';
import { action, observable, flow ,computed} from 'mobx';
import DeviceInfo from 'react-native-device-info/deviceinfo';
import MineApi from '../../mine/api/MineApi';
import HomeAPI from '../api/HomeAPI';
import store from '@mr/rn-store';
import MessageApi from '../../message/api/MessageApi';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import StringUtils from '../../../utils/StringUtils';
import bridge from '../../../utils/bridge';
import homeController from '../../marketing/controller/HomeController';

const requsetCount = 4;

class HomeModalManager {
    /** 控制升级框*/
    @observable
    versionData = {};
    @observable
    isShowUpdate = false;
    needShowUpdate = false;
    @observable
    isShowPrivacyModal = false;
    needShowPrivacyModal = false
    /** 控制用户升级*/
    @observable
    isShowUserMemberUpdate = false;
    needShowUserMemberUpdate  = false;
    @observable
    UserMemberUpdateData = null;
    /** 控制公告*/
    @observable
    isShowNotice = false;
    needShowNotice = false;
    @observable
    homeMessage = null;

    /** 控制首页中奖*/
    @observable
    isShowPrize = false;
    needShowPrize = false;
    @observable
    prizeData = null;
    /** 是否在首页*/
    /** 控制用户升级弹窗*/
    @observable
    isShowUser = false;
    needShowUser = false;
    Userdata = null;
    @observable
    isHome = false;


    finishCount = 0;

    @computed get isShowModal(){
        return this.isShowNotice || this.isShowPrivacyModal || this.isShowPrize || this.isShowUpdate || this.isShowUser || this.isShowUserMemberUpdate;
    }

    @action
    entryHome() {
        this.isHome = true;
    }

    @action
    leaveHome() {
        this.isHome = false;
        this.step = 0;
    }

    @action
    requestData() {
        this.finishCount = 0;
        this.getVersion();
        this.getMessage();
        this.getPrize();
        this.getPrivacy();
    }

    @action
    openNext() {
        if (this.isShowUpdate ||
            this.isShowNotice ||
            this.isShowPrize ||
            this.isShowUser ||
            this.isShowPrivacyModal
        ) {
            return;
        } // 如果有页面展示

        if (this.needShowUpdate === true) {
            this.isShowUpdate = true;
            track(trackEvent.HomePagePopShow, {homePagePopType: 5});
        }  else if (this.needShowPrivacyModal === true) {
            this.isShowPrivacyModal = true;
        } else if (this.needShowUserMemberUpdate === true) {
            this.isShowUserMemberUpdate = true;
        } else if (this.needShowNotice === true) {
            this.isShowNotice = true;
            track(trackEvent.HomePagePopShow, {homePagePopType: 2});
        } else if (this.needShowPrize === true) {
            this.isShowPrize = true;
            track(trackEvent.HomePagePopShow, {homePagePopType: 6});
        } else if (this.needShowUser === true) {
            this.isShowUser = true;
            track(trackEvent.HomePagePopShow, {homePagePopType: 3});
        }
    }

    @action
    closeUpdate(skip) {
        if (skip) {
            if (!StringUtils.isEmpty(this.versionData)) {
                store.save('@mr/isToUpdate', String(this.versionData.version), () => {
                    this.versionData = null;
                });
            }
        }else {
            track(trackEvent.HomePagePopBtnClick, {homePagePopType: 5, homePagePopImgURL: ''});
        }
        this.isShowUpdate = false;
        this.needShowUpdate = false;
        this.openNext();
    }

    @action
    closePrivacyModal(agree){
        if (agree){
            store.save('@mr/privacy', 'agree', () => {
                this.versionData = null;
            });
            this.isShowPrivacyModal = false;
            this.needShowPrivacyModal = false;
            homeController.notifyArrivedHome();
            this.openNext();
        } else {
            bridge.exitApp();
        }
    }
    @action
    closeUserMemberUpdate(){
        this.isShowUserMemberUpdate = false;
        this.needShowUserMemberUpdate = false;
        this.UserMemberUpdateData = null;
        this.openNext();
    }

    @action
    closeMessage() {//公告无点击
        let currStr = new Date().getTime();
        store.save('@mr/lastMessageTime', String(currStr));
        this.isShowNotice = false;
        this.needShowNotice = false;
        this.homeMessage = null;

        this.openNext();
    }

    @action
    closePrize(open) {
        if (open){
            track(trackEvent.HomePagePopBtnClick, {homePagePopType: 6, homePagePopImgURL: 'btn_bg.png'});
        }
        this.isShowPrize = false;
        this.needShowPrize = false;
        this.prizeData = null;
        this.openNext();
    }

    @action
    closeUserLevel(open, v) {
        if (open){
            track(trackEvent.HomePagePopBtnClick, {homePagePopType: 3, homePagePopImgURL:  v + 'png'});
        }
        this.isShowUser = false;
        this.needShowUser = false;
        this.openNext();
    }

    @action
    checkShowAlert = flow(function* () {
        try {
            let versionData = this.versionData || {};
            let { forceUpdate, version, upgrade } = versionData;
            if (this.versionData && upgrade === 1) {
                let storage_version = yield store.get('@mr/isToUpdate');
                if (storage_version !== version || forceUpdate === 1) {
                    this.needShowUpdate = true;
                }
            }
            this.openNext();
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    @action
    getVersion = () => {
        return MineApi.getVersion({ version: DeviceInfo.getVersion() }).then((resp) => {
            this.versionData = resp.data || {};
            this.actionFinish();
        }).catch(() => {
            this.actionFinish();
        });
    };

    @action
    getPrivacy = () => {
        store.get('@mr/privacy').then((value) => {
            if (value === 'agree') {
                this.actionFinish();
            }else {
                HomeAPI.queryConfig({code: 'privacy_agreement_switch' }).then((data)=> {
                    if (data.data&&(data.data.value == 1)) {
                        this.needShowPrivacyModal = true;
                    }
                    this.actionFinish();
                }).finally(() => {
                    this.actionFinish();
                })
            }
        }).catch(() => {
            this.actionFinish();
        });
    }


//一天弹一次 公告与广告不共存
    @action
    getMessage() {
        let currStr = new Date().getTime() + '';
        store.get('@mr/lastMessageTime').then((value) => {
            if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                MessageApi.queryNotice({ pageSize: 10, type: 100 }).then(resp => {
                    this.homeMessage = resp.data.data;
                    if (resp.data.data && resp.data.data.length > 0) {
                        this.needShowNotice = true;
                    }
                    this.actionFinish();
                }).catch(() => {
                    this.actionFinish();
                });
            } else {
                this.actionFinish();
            }
        }).catch(() => {
            this.actionFinish();
        });
    }


    @action
    getPrize() {
        HomeAPI.getWinningInfo({}).then(data => {
            if (data.data && data.data.popUp) {
                this.needShowPrize = true;
                this.prizeData = data.data;
            }
            this.actionFinish();
        }).catch(() => {
            this.actionFinish();
        });
    }

    @action
    refreshPrize() {
        if (this.finishCount !== requsetCount) {
            return;
        }
        HomeAPI.getWinningInfo({}).then(data => {
            if (data.data && data.data.popUp) {
                this.needShowPrize = true;
                this.prizeData = data.data;
                this.openNext();
            }

        }).catch(() => {

        });
    }

    @action
    getUserMemberUpdate(data) {
        this.needShowUserMemberUpdate = true;
        this.UserMemberUpdateData = data;
        this.openNext();
    }


    @action
    userLevelUpdate(level) {
        this.needShowUser = true;
        this.Userdata = level;
        this.openNext();
    }


    actionFinish() {
        this.finishCount++;
        if (this.finishCount === requsetCount) {
            this.checkShowAlert();
        }
    }
}

const homeModalManager = new HomeModalManager();
export default homeModalManager;
