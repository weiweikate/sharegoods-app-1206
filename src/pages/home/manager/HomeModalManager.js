/**
 * @author xzm
 * @date 2018/11/20
 */


'use strict';
import { action, observable, flow } from 'mobx';
import DeviceInfo from 'react-native-device-info/deviceinfo';
import MineApi from '../../mine/api/MineApi';
import HomeAPI from '../api/HomeAPI';
import { homeLinkType, homeType } from '../HomeTypes';
import { AsyncStorage } from 'react-native';
import MessageApi from '../../message/api/MessageApi';
import { track, trackEvent } from '../../../utils/SensorsTrack';

const requsetCount = 4;

class HomeModalManager {
    /** 控制升级框*/
    @observable
    isShowUpdate = false;
    /** 控制公告*/
    @observable
    isShowNotice = false;
    needShowNotice = false;
    @observable
    noticeData = null;
    /** 控制首页广告*/
    @observable
    isShowAd = false;
    needShowAd = false;
    @observable
    AdData = null;

    /** 控制首页新手礼包*/
    @observable
    isShowGift = false;
    needShowGift = false;
    @observable
    giftData = null;

    /** 控制首页中奖*/
    @observable
    isShowPrize  = false;
    needShowPrize  = false;
    @observable
    prizeData = null;
    /** 是否在首页*/
    @observable
    isHome = false;


    finishCount = 0;

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
        this.getAd();
        this.getPrize();
    }

    @action
    closeUpdate(skip) {
        if (skip) {
            AsyncStorage.setItem('isToUpdate', String(this.versionData.version));
        }
        this.isShowUpdate = false;
        this.versionData = null;
        if (this.needShowNotice === true) {
            this.isShowNotice = true;
        } else if (this.needShowAd === true) {
            this.isShowAd = true;
        }else if (this.needShowGift === true) {
            this.isShowGift = true;
            track(trackEvent.NewUserGuideShow, {})
        }
    }

    @action
    closeMessage() {
        let currStr = new Date().getTime();
        AsyncStorage.setItem('lastMessageTime', String(currStr));
        this.isShowNotice = false;
        this.needShowNotice = false;
        this.noticeData = null;
        if (this.needShowGift === true) {
            this.isShowGift = true;
            track(trackEvent.NewUserGuideShow, {})
        }else if (this.needShowPrize === true) {
            this.isShowPrize = true;
        }
    }


    @action
    closeAd() {
        let currStr = new Date().getTime();
        AsyncStorage.setItem('home_lastAdTime', String(currStr));
        this.isShowAd = false;
        this.needShowAd = false;
        this.AdData = null;
        if (this.needShowGift === true) {
            this.isShowGift = true;
            track(trackEvent.NewUserGuideShow, {})
        }else if (this.needShowPrize === true) {
            this.isShowPrize = true;
        }
    }

    @action
    closePrize() {
        this.isShowPrize = false;
        this.needShowPrize  = false;
        this.prizeData = null;
        //关闭抽奖结果的弹框，如果可以有新手的弹框，就显示
        if (this.needShowGift === true){
            this.isShowGift = true;
            track(trackEvent.NewUserGuideShow, {})
        }
    }

    @action
    closeGift() {
        this.isShowGift = false;
        this.needShowGift  = false;
        this.giftData = null;
        track(trackEvent.NewUserGuideBtnClick, {})
        //关闭新手的弹框的，如果可以有抽奖结果，就显示
        if (this.needShowPrize === true){
            this.isShowPrize = true;
        }
    }

    @action
    checkShowAlert = flow(function* () {
        try {
            let versionData = this.versionData || {};
            let { forceUpdate, version, upgrade } = versionData;
            if (this.versionData && upgrade === 1) {
                let storage_version = yield AsyncStorage.getItem('isToUpdate');
                if (storage_version !== version || forceUpdate === 1) {
                    this.isShowUpdate = true;
                }
            }
            if (this.isShowUpdate === false) {
                 if (this.needShowNotice === true) {
                    this.isShowNotice = true;
                } else if (this.needShowAd === true) {
                    this.isShowAd = true;
                }else if (this.needShowGift === true) {
                     this.isShowGift = true;
                     track(trackEvent.NewUserGuideShow, {})
                 }else if (this.needShowPrize === true) {
                     this.isShowPrize = true;
                 }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    @action
    getVersion = () => {
        return MineApi.getVersion({ version: DeviceInfo.getVersion() }).then((resp) => {
            this.versionData = resp.data;
            this.actionFinish();
        }).catch(() => {
            this.actionFinish();
        });
    };


//一天弹一次 公告与广告不共存
    @action
    getMessage() {
        let currStr = new Date().getTime() + '';
        AsyncStorage.getItem('lastMessageTime').then((value) => {
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

//一天弹一次 公告与广告不共存
    @action
    getAd() {
        let currStr = new Date().getTime() + '';
        AsyncStorage.getItem('home_lastAdTime').then((value) => {
            if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                HomeAPI.getHomeData({ type: homeType.windowAlert }).then(resp => {
                    if (resp.data && resp.data.length > 0) {
                        this.needShowAd = true;
                        this.AdData = resp.data[0];
                    }
                    this.actionFinish();
                }).catch((msg) => {
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
            if (data.data){
                this.needShowPrize = true;
                this.prizeData = data.data;
            }
            this.actionFinish();
        }).catch(() => {
            this.actionFinish();
        })
    }

    @action
    refreshPrize() {
        if (this.finishCount !== requsetCount) {
            return;
        }
        HomeAPI.getWinningInfo({}).then(data => {
            if (data.data){
                this.needShowPrize = true;
                this.prizeData = data.data;
                if (!this.isShowUpdate && !this.isShowNotice && !this.isShowAd && !this.isShowGift){
                    this.isShowPrize = true;
                }
            }

        }).catch(() => {

        })
    }


    @action
    getGift() {
        HomeAPI.getPopupBox({popupBoxType: 1}).then(data => {
            if (data.data && data.data.length > 0){
                let item = data.data[0];
                this.needShowGift = true;
                this.giftData = {image: item.imgUrl, linkTypeCode: item.linkTypeCode, linkType: homeLinkType.link};
            }
            if (!this.isShowUpdate && !this.isShowNotice && !this.isShowAd && !this.isShowPrize){
                this.isShowGift = true;
                track(trackEvent.NewUserGuideShow, {})
            }
        }).catch(() => {
        })
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
