/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/1.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Animated,
    NativeModules
} from 'react-native';

import {
    UIImage
} from '../../../components/ui';
import ShareTaskHomeAlert from './ShareTaskHomeAlert';
import res from '../res';
import taskApi from '../api/taskApi';
import { NavigationActions } from 'react-navigation';
import RouterMap from '../../../navigation/RouterMap';
const task_icon = res.task_icon;

export default class ShareTaskIcon extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {
            x: new Animated.Value(40),
            hasTask: false,
            data:{},//id: null,type: null, name: null, desc: null,
        };
        this.isOpen = false;
    }

    _bind() {
        this._onPress = this._onPress.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.queryTask = this.queryTask.bind(this);
    }

    componentDidMount() {
    }

    queryTask() {
        taskApi.queryTask({}).then((result => {
            let hasTask = false;
            if (result.data.receiveFlag === true){//表示有任务可以领取
                hasTask = true;
            }
            this.setState({hasTask, data:result.data});
        })).catch(()=>{});
    }

    _onPress() {
        if (this.isOpen === true) {
            // if (this.state.data.receiveFlag === false){//表示任务已经领取
            //     this._gotoTaskList();
            // } else {
                this.alert.open();
            // }
            this.close();
        } else {
            this.open();
        }

    }

    _gotoTaskList(id){
        global.$navigator.dispatch(NavigationActions.push({ routeName: RouterMap.ShareTaskIntroducePage, params: {jobId: this.state.data.id, status: 1,id: id}}));
    }
    //领取任务
    receiveTask(){
        let that = this;
        taskApi.reciveTask({}).then((result => {
            that._gotoTaskList(result.data.id);
        })).catch((error)=> {
            NativeModules.commModule.toast(error.msg || '任务领取失败');
        });
    }

    open() {
        Animated.spring(
            // Animate value over time
            this.state.x, // The value to drive
            {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }
        ).start();
        this.isOpen = true;
    }

    close() {
        if (this.isOpen === true) {
            Animated.spring(
                // Animate value over time
                this.state.x, // The value to drive
                {
                    toValue: 40,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start();
            this.isOpen = false;
        }
    }


    render() {
        return <View/>;//隐藏task
        if (this.state.hasTask === false) {
            return <View/>;
        }

        return (
            <Animated.View style={[this.props.style, { transform: [{ translateX: this.state.x}] }]}>
                <TouchableOpacity onPress={this._onPress}>
                    <UIImage source={task_icon}
                             style={styles.image}
                    />
                </TouchableOpacity>
                <ShareTaskHomeAlert ref={(ref) => {
                    this.alert = ref;
                }}
                                    onPress={this.receiveTask.bind(this)}
                                    data={this.state.data}
                />
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 55,
        width: 80
    }
});
