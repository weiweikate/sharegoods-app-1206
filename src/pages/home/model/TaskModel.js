/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/5/23.
 *
 */


'use strict';

import { action, observable } from 'mobx';
import HomeApi from '../api/HomeAPI';

import ScreenUtil from '../../../utils/ScreenUtils';
import { homeModule } from './Modules';
import bridge from '../../../utils/bridge';
import store from '@mr/rn-store';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { IntervalMsgNavigate } from '../../../comm/components/IntervalMsgView';
import { homeType } from '../HomeTypes';

const { px2dp } = ScreenUtil;

const activity_mission_main_no = 'activity_mission_main_no_new';    // 主线任务
const activity_mission_daily_no = 'activity_mission_daily_no';     // 日常任务

class TaskModel {
    @observable
    show = false;
    @observable
    progress = 0;
    @observable
    totalProgress = 10;
    @observable
    boxs = [];
    @observable
    homeHeight = 0; //
    @observable
    expanded = true;
    @observable
    tasks = [];
    @observable
    hideFinishTask = false;
    @observable
    advMsg = '';
    @observable
    name = '';
    activityNo = '';
    @observable
    openAlert = false;
    @observable
    alertData = [];
    @observable
    canOpenProgress = -1;

    @action
    getLocationExpanded() {
        store.get('@mr/taskExpanded' + this.type).then((data) => {
            if (data) {
                this.expanded = data.expanded;
            }
            if (this.type === 'home') {
                this.calculateHomeHeight();
            }
        });
    }

    @action
    getData() {
        HomeApi.getMissionActivity({ activityType: this.type === 'home' ? activity_mission_main_no : activity_mission_daily_no }).then((result) => {
            let data = result.data || {};
            this.progress = data.value || 0;
            this.boxs = data.ruleList || [];
            let tasks = data.missionList || [];
            this.tasks = this.sort(tasks);
            this.name = data.name;
            this.advMsg = data.advMsg;
            if (result.data) {
                this.show = true;
            } else {
                this.show = false;
            }
            this.activityNo = data.no;
            //取数组里面最后面的value为进度条的总值
            let length = data.ruleList.length;
            if (length > 0) {
                if (data.ruleList && data.ruleList[length - 1]) {
                    this.totalProgress = data.ruleList[length - 1].value;
                }
            }
            if (this.type === 'home') {
                this.calculateHomeHeight();
            }
            this.findCanOpenProgress();
        }).catch(() => {
            this.show = false;
            if (this.type === 'home') {
                this.calculateHomeHeight();
            }
        });
    }

    @action
    findCanOpenProgress() {
        let canOpenProgress = -1;
        this.boxs.forEach(item => {
            if (canOpenProgress === -1 && item.prizeStatus === 1) {
                canOpenProgress = item.value;
            }
        });
        this.canOpenProgress = canOpenProgress;
    }


    sort(data) {
        if (data.length < 2) {
            return data;
        }
        let finishData = [];
        let unData = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.status === 2) {
                let subMissions = item.subMissions || [];
                subMissions = subMissions.filter((item) => {
                    return item.status !== 2;
                });
                if (subMissions.length === 0) {
                    finishData.push(item);
                    continue;
                }
            }
            unData.push(item);
        }
        return [...unData, ...finishData];
    }


    @action
    expandedClick() {
        this.expandedEvent();
        this.expanded = !this.expanded;
        store.save('@mr/taskExpanded' + this.type, { expanded: this.expanded });
        if (this.type === 'home') {
            this.calculateHomeHeight();
        }
    }

    @action
    hideFinishTaskClick() {
        this.hideFinishTask = !this.hideFinishTask;
    }

    @action
    closeAlert() {
        this.openAlert = false;
        this.alertData = [];
    }

    @action
    boxClick(box) {
        this.boxBtnClickEvent(box);
        bridge.showLoading();
        HomeApi.getActivityPrize({ activityNo: this.activityNo, ruleId: box.id }).then(data => {
            this.boxs = this.boxs.map((item) => {
                if (item.id === box.id) {
                    item.prizeStatus = 2;
                }
                return item;
            });
            this.openAlert = true;
            this.alertData = data.data.prizeList || [];
            this.findCanOpenProgress();
            bridge.hiddenLoading();
        }).catch(err => {
            bridge.$toast(err.msg);
            bridge.hiddenLoading();
        });
    }

    @action
    getMissionPrize(item, isSubTask) {
        this.missionBtnClickEvent(item);
        if (item.status === 0) {
            let { interactiveCode, interactiveValue, category } = item;
            IntervalMsgNavigate(parseInt(interactiveCode), interactiveValue, category === 1);
            return;
        }
        bridge.showLoading();
        HomeApi.getMissionPrize({
            activityNo: this.activityNo,
            missionNo: item.no,
            missionType: item.type
        }).then(data => {
            bridge.hiddenLoading();
            this.tasks = this.tasks.map((tasks) => {
                if (!isSubTask) {
                    if (tasks.no === item.no) {
                        tasks.status = 2;
                    }
                } else if (tasks.subMissions) {
                    tasks.subMissions = tasks.subMissions.map(subTask => {
                        if (subTask.no === item.no) {
                            subTask.status = 2;
                        }
                        return subTask;
                    });
                }
                return tasks;
            });
            this.boxs = this.boxs.map(box => {
                if (this.progress >= box.value && box.prizeStatus === 0) {
                    box.prizeStatus = 1;
                }
                return box;
            });
            this.openAlert = true;
            this.alertData = data.data.prizeList || [];
        }).catch(err => {
            bridge.$toast(err.msg);
            bridge.hiddenLoading();
        });

    }

    @action
    calculateHomeHeight() {
        let homeHeight = 0;
        if (!this.show) {
            homeHeight = 0;
        } else {
            if (this.expanded) {
                homeHeight = px2dp(48 + 383 + 10 + 10);
            } else {
                homeHeight = px2dp(48 + 83 + 10 + 30);
            }

            if (this.type === 'home') {
                homeHeight += px2dp(40);
            }
        }
        if (homeHeight !== this.homeHeight) {
            this.homeHeight = homeHeight;
            homeModule.changeHomeList(homeType.task, [{
                id: 3,
                type: homeType.task
            }]);
        }
    }

    /** 埋点相关*/
    boxBtnClickEvent(item) {
        track(trackEvent.BoxBtnClick, { boxNum: this.boxs.indexOf(item), userValue: this.progress });
    }

    missionBtnClickEvent(item) {
        track(trackEvent.MissionBtnClick, {
            missionBtnName: item.status === 0 ? '前往' : '领奖',
            missionId: item.no,
            missionName: item.name,
            missionIndex: this.tasks.indexOf(item),
            userValue: this.progress
        });
    }

    expandedEvent() {
        track(trackEvent.MissionFrameBtnClick, {
            missionFrameBtnName: this.expanded ?
                '收起任务列表' : '做任务赚活跃值', userValue: this.progress
        });
    }
}

const taskModel = new TaskModel();
taskModel.type = 'home';
taskModel.getLocationExpanded();
const mineTaskModel = new TaskModel();
mineTaskModel.type = 'mine';
mineTaskModel.getLocationExpanded();

export default taskModel;
export { mineTaskModel };
