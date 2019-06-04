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

import { observable, action } from 'mobx';
import HomeApi from '../api/HomeAPI';

import ScreenUtil from '../../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;

import { homeModule } from './Modules';
import bridge from '../../../utils/bridge';
import { get, save } from '@mr/rn-store';

const activity_mission_main_no = 'activity_mission_main_no'    // 主线任务
const activity_mission_daily_no = 'activity_mission_daily_no'     // 日常任务

class TaskModel  {
    type = 'home'
    @observable
    show = false
    @observable
    progress = 0;
    @observable
    totalProgress = 10;
    @observable
    boxs = []
    @observable
    homeHeight = 0 //
    @observable
    expanded = false;
    @observable
    tasks = []
    @observable
    hideFinishTask = true;
    @observable
    advMsg = ''
    @observable
    name = ''
    activityNo = ''
    @observable
    openAlert = false;
    @observable
    alertData = [];

  @action
  getLocationExpanded() {
      get("task_expanded_").then((data) => {
          // alert(data)
          if (data) {
              this.expanded = data.expanded;
          }
      })
      if (this.type === 'home') {
          this.calculateHomeHeight();
      }
  }

    @action
    getData(){
        HomeApi.getMissionActivity({activityType: this.type === 'home'? activity_mission_main_no: activity_mission_daily_no}).then((result)=> {
            let data = result.data || {};
            this.progress = data.activityValue || 0;
            this.boxs = data.ruleList || [];
            let tasks = data.missionList || [];
            this.tasks = this.sort(tasks)
            this.name = data.name;
            this.advMsg = data.advMsg
            if (result.data) {
                this.show = true;
            }else {
                this.show = false;
            }
            this.activityNo = data.no;
            //取数组里面最后面的value为进度条的总值
            let length = data.ruleList.length;
            if (length > 0 && data.ruleList[length-1].value >  this.progress) {
                this.totalProgress = data.ruleList[length-1].value;
            }
            if (this.type === 'home') {
                this.calculateHomeHeight();
            }
        }).catch(()=> {
            this.show = false;
            if (this.type === 'home') {
                this.calculateHomeHeight();
            }
        })
    }

    sort(data){
        if (data.length < 2){
            return data;
        }
        let finishData = [];
        let unData = [];
        for (let i = 0; i< data.length; i++){
            let item = data[i]
            if (item.status === 2){
                let subMissions = item.subMissions || [];
                subMissions = subMissions.filter((item) => {
                    return item.status !== 2
                });
                if (subMissions.length === 0){
                    finishData.push(item);
                    continue
                }
            }
            unData.push(item);
        }
        return [...unData, ...finishData];
    }


    @action
    expandedClick() {
        this.expanded = !this.expanded;
        save("task_expanded_"+ this.type,{expanded: this.expanded});
        if (this.type === 'home') {
            this.calculateHomeHeight();
        }
    }

    @action
    hideFinishTaskClick(){
        this.hideFinishTask =  !this.hideFinishTask;
    }

    @action
    closeAlert(){
        this.openAlert = false;
        this.alertData = [];
    }

    @action
    boxClick(box) {
        bridge.showLoading();
        HomeApi.getActivityPrize({activityNo: this.activityNo, ruleId: box.id}).then(data=> {
            this.boxs = this.boxs.map((item) => {
                if(item.id === box.id){
                    item.prizeStatus = 2
                }
                return item
            })
            this.openAlert = true;
            this.alertData = data.data.prizeList || [];
            bridge.hiddenLoading();
        }).catch(err => {
            bridge.$toast(err.msg)
            bridge.hiddenLoading();
        })
    }
    @action
    getMissionPrize(item,isSubTask){
        bridge.showLoading();
        HomeApi.getMissionPrize({activityNo: this.activityNo, missionNo: item.no, missionType: item.type}).then(data=> {
            bridge.hiddenLoading();
            this.tasks = this.tasks.map((tasks) => {
                if (!isSubTask) {
                    if (tasks.no === item.no){
                        tasks.status = 2
                    }
                }else if (tasks.subMissions) {
                    tasks.subMissions = tasks.subMissions.map(subTask => {
                        if (subTask.no === item.no){
                            subTask.status = 2
                            tasks.complete ++;
                            if (tasks.complete === tasks.total){
                                tasks.status = 2
                            }
                        }
                        return subTask
                    })
                }
                return tasks;
            })
            if (item.prizeValue) {
                this.progress = this.progress + item.prizeValue;
            }
            this.boxs =  this.boxs.map(box => {
                if (this.progress >= box.value &&  box.prizeStatus === 0){
                    box.prizeStatus = 1;
                }
                return box;
            })
            this.openAlert = true;
            this.alertData = data.data.prizeList || [];
        }).catch(err => {
            bridge.$toast(err.msg)
            bridge.hiddenLoading();
        })

    }

    @action
    calculateHomeHeight(){
        let homeHeight = 0;
        if (!this.show){
            homeHeight = 0;
        } else {
            if (this.expanded){
                homeHeight = px2dp(48+383+10);
            } else {
                homeHeight = px2dp(48+83+10);
            }
        }
        if (homeHeight !== this.homeHeight){
            this.homeHeight = homeHeight;
            homeModule.changeHomeList();
        }
    }


}

const taskModel = new TaskModel();
taskModel.getLocationExpanded();
const mineTaskModel = new TaskModel();
mineTaskModel.type = 'mine';
mineTaskModel.getLocationExpanded();

export default taskModel;
export {mineTaskModel};
