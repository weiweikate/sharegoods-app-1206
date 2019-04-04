/**
 * @author xzm
 * @date 2018/11/20
 */

"use strict";
import { action, observable, flow } from "mobx";
import DeviceInfo from "react-native-device-info/deviceinfo";
import MineApi from "../../mine/api/MineApi";
import GuideApi from '../../guide/GuideApi'
import { AsyncStorage, Platform } from 'react-native';
import MessageApi from "../../message/api/MessageApi";
import bridge from '../../../utils/bridge';
import user from '../../../model/user';
const requsetCount = 4;
class HomeModalManager {
    /** 控制升级框*/
    @observable
    isShowUpdate = false;
    @observable
    versionData = null;
    /** 控制新手引导*/
    @observable
    isShowGuide = false;
    needShowGuide = true;
    @observable
    guideData = {};
    /** 控制公告*/
    @observable
    isShowNotice = false;
    needShowNotice = true;
    @observable
    noticeData = null;
    /** 控制首页广告*/
    @observable
    isShowAd = false;
    needShowAd = false;
    @observable
    AdData = null;
    /** 是否在首页*/
    @observable
    isHome = false;


    finishCount = 0;
    @action
    entryHome () {
        this.isHome = true;
    }
    @action
    leaveHome () {
        this.isHome = false;
    }
    @action
    requestGuide () {
        if (this.finishCount !== requsetCount) {
            return;
        }
        GuideApi.getUserRecord().then((data) => {
            if (data.data === true) {
                if (user.getFinishGuide() === true) {
                    GuideApi.registerSend({});
                } else {
                    this.isShowGuide = true;
                    this.getRewardzInfo();
                }
            }
        }).catch(() => {
        });
    }
    @action
    requestData () {
        this.finishCount = 0
        this.getVersion();
        this.getMessage();
        this.getAd();
        this.getUserRecord();
    }
    @action
    closeUpdate () {
        AsyncStorage.setItem('isToUpdate',  this.versionData.version);
        this.isShowUpdate = false;
        this.versionData = null;
        if (this.needShowGuide === true){
            this.isShowGuide = true
        } else if (this.needShowNotice === true){
            this.isShowNotice = true
        } else if (this.needShowAd === true){
            this.isShowAd = true
        }
    }

    @action
    closeMessage () {
        let currStr = new Date().getTime() + '';
        AsyncStorage.setItem('lastMessageTime', currStr);
        this.isShowNotice = false;
        this.needShowNotice = false;
        this.noticeData = null;
    }

    @action
    closeGuide  () {
        this.isShowGuide = false;
        this.needShowGuide = false;
        this.guideData = {};
        if (this.needShowNotice === true){
            this.isShowNotice = true
        } else if (this.needShowAd === true){
            this.isShowAd = true
        }
    }

    @action
    closeAd () {
        let currStr = new Date().getTime() + '';
        AsyncStorage.setItem('home_lastAdTime', currStr);
        this.isShowAd = false;
        this.needShowAd = false;
        this.AdData = null;
    }

    @action
    checkShowAlert  = flow(function* () {
        try {
            let {forceUpdate, version, upgrade} = this.versionData;
            if (upgrade === 1 && this.versionData){
                let storage_version = yield AsyncStorage.getItem('isToUpdate')
                if (storage_version !== version || forceUpdate === 1) {
                    //安卓需要判断是否有apk存在
                    if (Platform.OS !== 'ios') {
                        let exist = yield bridge.isApkExist(version)
                        this.versionData.apkExist = exist;
                        this.isShowUpdate = true;
                    } else {
                        this.isShowUpdate = true;
                    }
                }
            }
            this.isShowUpdate = true;
            if (this.isShowUpdate === false){
                if (this.needShowGuide === true){
                    this.isShowGuide = true
                } else if (this.needShowNotice === true){
                    this.isShowNotice = true
                } else if (this.needShowAd === true){
                    this.isShowAd = true
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    });

    @action
    getVersion = () => {
        return  MineApi.getVersion({ version: DeviceInfo.getVersion() }).then((resp) => {
            this.versionData = resp.data;
            this.actionFinish();
        }).catch(()=> {
            this.actionFinish();
        })
    };
    @action
    getUserRecord = () => {
        GuideApi.getUserRecord().then((data) => {
            if (data.data === true) {
                if (user.getFinishGuide() === true) {
                    GuideApi.registerSend({});
                } else {
                    this.needShowGuide = true;
                    this.getRewardzInfo();
                }
                this.actionFinish();
            }
        }).catch(() => {
            this.actionFinish();
        });
    };

    getRewardzInfo = () => {
        GuideApi.rewardzInfo({ type: 17 }).then((data) => {
            data = data.data || [];
            if (data.length > 0) {
                this.guideData = data[0];
            }
        });
    };
//一天弹一次 公告与广告不共存
    @action
    getMessage() {
        let currStr = new Date().getTime() + "";
        AsyncStorage.getItem("lastMessageTime").then((value) => {
            if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                MessageApi.queryNotice({ pageSize: 10, type: 100 }).then(resp => {
                    this.homeMessage = resp.data.data;
                    if (resp.data.data && resp.data.data.length > 0) {
                        this.needShowNotice = true;
                    }
                    this.actionFinish();
                }).catch(()=> {
                    this.actionFinish();
                })
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
        let currStr = new Date().getTime() + "";
        AsyncStorage.getItem("home_lastAdTime").then((value) => {
            if (value == null || parseInt(currStr) - parseInt(value) > 24 * 60 * 60 * 1000) {
                GuideApi.queryAdvertisingList({type:  1}).then(resp => {
                    this.AdData = resp.data.data;
                    if (resp.data.data && resp.data.data.length > 0) {
                        this.needShowAd = true;
                    }
                    this.actionFinish();
                }).catch((msg)=> {
                    this.actionFinish();
                })
            } else {
                this.actionFinish();
            }
        }).catch(() => {
            this.actionFinish();
        });;
    }

    actionFinish() {
        this.finishCount++;
        if (this.finishCount == requsetCount){
            this.checkShowAlert();
        }
    }
}

const homeModalManager = new HomeModalManager();
export default homeModalManager;
