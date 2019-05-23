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
// import HomeApi from '../api/HomeAPI';

import ScreenUtil from '../../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;

import { homeModule } from './Modules';



 class TaskModel  {
     @observable
     show = false
     @observable
     observable = 50
     @observable
     tasks = []
     homeHeight = 0 //
     @observable
     homeExpanded = false
     @observable
     mineExpanded = false

     @action
     getData(){
        this.tasks = [{name: '50', status: 1},
            {name: '50', status: 1},
            {name: '50', status: 1},
            {name: '50', status: 0},
            {name: '50', status: 0}];
        this.show = true;
        this.calculateHomeHeight();
     }


     @action
     expandedClick(type)
     {
         if (type === 'home') {
             this.homeExpanded = !this.homeExpanded;
             this.calculateHomeHeight();
         }else if (type === 'mine'){
             this.mineExpanded = !this.mineExpanded;
         }
     }

    @action
    calculateHomeHeight(){
         let homeHeight = 0;
        if (!this.show){
           homeHeight = 0;
        } else {
            if (this.homeExpanded){
                homeHeight = px2dp(48+382);
            } else {
                homeHeight = px2dp(48+83);
            }
        }
        if (homeHeight !== this.homeHeight){
            this.homeHeight = homeHeight;
            homeModule.changeHomeList();
        }
   }


}

const taskModel = new TaskModel();

export default taskModel;
