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
    View, Platform

} from 'react-native';
import DesignRule from '../../constants/DesignRule';

export default function SmoothPushHighComponent(WrappedComponent) {
    WrappedComponent.xg_finishPush = false;
    return class HighComponent extends Component {
        constructor(props) {
            super(props);
            this.state = { xg_finishPush: WrappedComponent.xg_finishPush };
        }

        componentDidMount() {
            if (this.state.xg_finishPush !== true) {
                this.xg_finishPush_timer = TimerMixin.setTimeout(() => {
                    this.setState({ xg_finishPush: true });
                    WrappedComponent.xg_finishPush = true;
                }, 700);
            }
        }

        render() {
            if (this.state.xg_finishPush === true) {
                return <WrappedComponent {...this.props}/>;
            } else {
                return <View style={{ flex: 1, backgroundColor: DesignRule.bgcolor }}/>;
            }
        }

        componentWillUnmount() {
            this.xg_finishPush_timer && TimerMixin.clearTimeout(this.xg_finishPush_timer);
        }

    };

}


export function SmoothPushHighComponentEverydelay(WrappedComponent) {
    if (Platform.OS !== 'ios') {
        return WrappedComponent;
    }
    return class HighComponent extends Component {
        constructor(props) {
            super(props);
            this.state = { xg_finishPush: false };
        }

        componentDidMount() {
            this.xg_finishPush_timer = TimerMixin.setTimeout(() => {
                this.setState({ xg_finishPush: true });
            }, 700);
        }

        render() {
            if (this.state.xg_finishPush === true) {
                return <WrappedComponent {...this.props}/>;
            } else {
                return <View style={{ flex: 1, backgroundColor: DesignRule.bgcolor }}/>;
            }
        }

        componentWillUnmount() {
            this.xg_finishPush_timer && TimerMixin.clearTimeout(this.xg_finishPush_timer);
        }

    };

}


function SmoothPushPreLoadHighComponent(WrappedComponent) {
    const shouldComponentUpdate = WrappedComponent.prototype.shouldComponentUpdate;

    WrappedComponent.prototype.shouldComponentUpdate = function(nextProps, nextState) {
        if (nextState && nextState.xg_finishPush === true) {
            if (shouldComponentUpdate) {
                return shouldComponentUpdate.call(this, nextProps, nextState);
            } else {
                return true;
            }
        } else {
            return false;
        }
    };
    WrappedComponent.prototype.change_xg_finishPush = function() {
        this.setState({ xg_finishPush: true });
    };
    const componentDidMount = WrappedComponent.prototype.componentDidMount;
    WrappedComponent.prototype.componentDidMount = function() {
        if (componentDidMount) {
            componentDidMount.call(this);
        }
        this.xg_finishPush_timer = TimerMixin.setTimeout(() => {
            this.change_xg_finishPush();
        }, 700);
    };

    const componentWillUnmount = WrappedComponent.prototype.componentWillUnmount;
    WrappedComponent.prototype.componentWillUnmount = function() {
        if (componentWillUnmount) {
            componentWillUnmount.call(this);
        }
        this.xg_finishPush_timer && TimerMixin.clearTimeout(this.xg_finishPush_timer);
    };

    return WrappedComponent;
}

export { SmoothPushPreLoadHighComponent };

//先请求，如果在第一次退出动画的完成也不进行render，防止卡顿
export function SmoothPushPreLoadHighComponentFirstDelay(WrappedComponent) {
    const shouldComponentUpdate = WrappedComponent.prototype.shouldComponentUpdate;
    WrappedComponent.prototype.xg_finishPush = false;

    WrappedComponent.prototype.shouldComponentUpdate = function(nextProps, nextState) {
        if ((nextState && nextState.xg_finishPush === true) || WrappedComponent.prototype.xg_finishPush === true) {
            if (shouldComponentUpdate) {
                return shouldComponentUpdate.call(this, nextProps, nextState);
            } else {
                return true;
            }
        } else {
            return false;
        }
    };
    WrappedComponent.prototype.change_xg_finishPush = function() {
        this.setState({ xg_finishPush: true });
    };
    const componentDidMount = WrappedComponent.prototype.componentDidMount;
    WrappedComponent.prototype.componentDidMount = function() {
        if (componentDidMount) {
            componentDidMount.call(this);
        }
        if ( WrappedComponent.prototype.xg_finishPush === false){
            this.xg_finishPush_timer = TimerMixin.setTimeout(() => {
                this.change_xg_finishPush();
                WrappedComponent.prototype.xg_finishPush = true;
            }, 700);
        }
    };

    const componentWillUnmount = WrappedComponent.prototype.componentWillUnmount;
    WrappedComponent.prototype.componentWillUnmount = function() {
        if (componentWillUnmount) {
            componentWillUnmount.call(this);
        }
        this.xg_finishPush_timer && TimerMixin.clearTimeout(this.xg_finishPush_timer);
    };

    return WrappedComponent;
}

