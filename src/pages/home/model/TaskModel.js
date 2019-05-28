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
     type = 'home'
     @observable
     show = false
     @observable
     progress = 40
     @observable
     boxs = []
     @observable
     homeHeight = 0 //
     @observable
     expanded = false;
     @observable
     tasks = []


     @action
     getData(){
        this.boxs = [{name: '50', status: 2},
            {name: '50', status: 2},
            {name: '50', status: 1},
            {name: '50', status: 0},
            {name: '50', status: 0}];
        this.show = true;
        this.tasks = [{name:'分享飞机撒了房间（2/3）',  integral: 30, status: 0,
            subTasks:[{name:'分享飞机撒了房间1',  integral: 30, status: 0},
                      {name:'分享飞机撒了房间2',  integral: 30, status: 1},
                      {name:'分享飞机撒了房间3',  integral: 30, status: 2}
            ]},
            {name:'分享飞机撒了房间',  integral: 40, status: 1, subTasks:[]},
            {name:'分享飞机撒了房间',  integral: 40, status: 2, subTasks:[]}
        ]
         if (this.type === 'home') {
             this.calculateHomeHeight();
         }
         setTimeout(()=>{
             this.tasks = [{name:'分享飞机撒了房间（2/3）',  integral: 30, status: 0,
                 subTasks:[{name:'分享飞机撒了房间1',  integral: 30, status: 0},
                     {name:'分享飞机撒了房间2',  integral: 30, status: 1},
                     {name:'分享飞机撒了房间3',  integral: 30, status: 2}
                 ]},
                 {name:'分享飞机撒了房间',  integral: 40, status: 1, subTasks:[]},
                 {name:'分享飞机撒了房间',  integral: 40, status: 2, subTasks:[]},
                 {name:'分享飞机撒了房间',  integral: 40, status: 1, subTasks:[]},
                 {name:'分享飞机撒了房间',  integral: 40, status: 2, subTasks:[]}
             ]
         },5000)
     }


     @action
     expandedClick()
     {
         this.expanded = !this.expanded;
         if (this.type === 'home') {
             this.calculateHomeHeight();
         }
     }

    @action
    calculateHomeHeight(){
         let homeHeight = 0;
        if (!this.show){
           homeHeight = 0;
        } else {
            if (this.expanded){
                homeHeight = px2dp(48+383);
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
const mineTaskModel = new TaskModel();
mineTaskModel.type = 'mine';

export default taskModel;
export {mineTaskModel};
