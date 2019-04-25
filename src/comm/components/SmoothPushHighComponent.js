/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/4/22.
 *
 */

'use strict';
import TimerMixin from 'react-timer-mixin';
import React, { Component } from 'react';

import {
    View

} from 'react-native';
import DesignRule from '../../constants/DesignRule';

export default function SmoothPushHighComponent(WrappedComponent) {
    WrappedComponent.xg_finishPush = false;
    return class HighComponent extends Component {
        constructor(props) {
            super(props);
            this.state={xg_finishPush:  WrappedComponent.xg_finishPush}
        }

        componentDidMount() {
            if (this.state.xg_finishPush !== true){
                TimerMixin.setTimeout(()=>{
                    this.setState({xg_finishPush: true});
                    WrappedComponent.xg_finishPush = true
                },700);
            }
        }

        render() {
            if (this.state.xg_finishPush === true) {
                return <WrappedComponent {...this.props}/>;
            } else {
                return <View style={{flex: 1, backgroundColor: DesignRule.bgcolor}}/>;
            }
        }

    };

}

//先请求，如果在第一次退出动画的完成也不进行render，防止卡顿
function SmoothPushPreLoadHighComponent(WrappedComponent) {
    WrappedComponent.xg_finishPush = false;
    const shouldComponentUpdate = WrappedComponent.prototype.shouldComponentUpdate;

     WrappedComponent.prototype.shouldComponentUpdate = function(nextProps, nextState){
         if (WrappedComponent.xg_finishPush === true){
             if (shouldComponentUpdate) {
                 return  shouldComponentUpdate.call(this,nextProps,nextState);
             }else {
                 return true
             }
         } else {
             return false;
         }
     };
    WrappedComponent.prototype.change_xg_finishPush = function() {
        this.setState({xg_finishPush: true});
    };
    const componentDidMount = WrappedComponent.prototype.componentDidMount;
    WrappedComponent.prototype.componentDidMount = function()  {
        if (componentDidMount) {
            componentDidMount.call(this);
        }
        if (WrappedComponent.xg_finishPush === false){
            TimerMixin.setTimeout(()=>{
               WrappedComponent.xg_finishPush = true;
               this.change_xg_finishPush();
           },700);
        }
    }
    return WrappedComponent;
}

export {SmoothPushPreLoadHighComponent};

