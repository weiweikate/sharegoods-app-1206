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

const BoxStatusClose = 0;
const BoxStatusCanOpen = 1;
const BoxStatusOpen = 2;

const TaskStatusUndone = 0;
// const TaskStatusWaitFinish = 1;
const TaskStatusFinish = 2;

import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
} from 'react-native';

import {
    MRText,
    UIImage
} from '../../../components/ui';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import taskModel, { mineTaskModel } from '../model/TaskModel';
const { autoSizeWidth } = ScreenUtils;
const {arrow_red_bottom,
    arrow_red_top,
    expanded_bottom,
    expanded_right
} = res.button;
const {task_progress,
    task_box_close,
    task_box_can_open,
    task_box_open,
    task_bottom_btn,
    task_run_people,
    task_finish
} = res.task;

class TaskItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };

    }

    renderItem(item,expanded ,subTask = false){
        return(
            <View >
                {subTask?<View style={styles.lineOne}/>: null}
                <View style={{paddingHorizontal:10, flexDirection: 'row', alignItems: 'center', height: autoSizeWidth(50)}}>
                    {subTask === false? <View style={{alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFD8BC',
                        height: autoSizeWidth(31),
                        width: autoSizeWidth(31),
                        borderRadius:  autoSizeWidth(31/2),
                        overflow: 'hidden'
                    }}>
                        <MRText style={{fontSize: autoSizeWidth(12), color: '#333333'}}>{'+'+item.integral}</MRText>
                    </View> : null
                    }
                    <MRText style={{fontSize: autoSizeWidth(14), color: '#333333', marginLeft: 10, flex: 1}}>{item.name}</MRText>
                    {this.renderBtn(item)}
                    {subTask === false?
                        <TouchableOpacity style={{height: autoSizeWidth(50),
                            width: autoSizeWidth(20),
                            marginLeft: autoSizeWidth(5),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                                          onPress={()=> {this.setState({expanded: !expanded})}}
                        >
                            <UIImage source={!expanded? expanded_right: expanded_bottom} style={{height: autoSizeWidth(11),width: autoSizeWidth(11)}}/>
                        </TouchableOpacity>: <View style={{ width: autoSizeWidth(20), marginLeft: autoSizeWidth(5)}}/>
                    }
                </View>
                {
                    expanded === true?
                        <View style={{paddingBottom: 5, paddingLeft: subTask? 20: 10}}>
                            <MRText style={{fontSize: autoSizeWidth(10), color: '#666666'}}>就是老地方见啊剪短发啦德弗里斯风景</MRText>
                            <MRText style={{fontSize: autoSizeWidth(10), color: '#666666',marginTop: 5}}>就是老地方见啊剪短发啦德弗里斯风景</MRText>
                        </View>
                        :null
                }
            </View>
        )
    }

    renderBtn(item){

        if(item.status === TaskStatusFinish){
            return <UIImage source={task_finish} style={{height: autoSizeWidth(40),width: autoSizeWidth(55)}}/>
        }else {
            let colors = item.status === TaskStatusUndone ? ['#FC5D39','#FF0050']:['#FFCB02', '#FF9502']
            let title = item.status === TaskStatusUndone ? '前往': '领奖'
            return(
                <TouchableOpacity style={{
                    width: ScreenUtils.autoSizeWidth(60),
                    height:  ScreenUtils.autoSizeWidth(24),
                    borderRadius:  ScreenUtils.autoSizeWidth(12),
                    overflow: 'hidden'
                }}
                                  onPress={() => {}}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    colors={colors}
                                    style={{ alignItems: "center",
                                        justifyContent: "center",
                                        flex: 1}}
                    >
                        <MRText style={{
                            fontSize: autoSizeWidth(13),
                            color: 'white',
                        }} allowFontScaling={false}>{title}</MRText>
                    </LinearGradient>
                </TouchableOpacity>
            )
        }


    }

    render(){
        let data = this.props.data;
        let expanded = this.state.expanded;
        return (
            <View>
                {this.renderItem(data,expanded)}
                {expanded?data.subTasks.map((item)=>{
                    return this.renderItem(item,expanded,true)
                }): null}
                <View style={styles.lineOne}/>
            </View>
        );
    }
}

@observer
export default class TaskVIew extends React.Component {

    constructor(props) {
        super(props);


        this.state = {};
        this.model = this.props.type === 'home'? taskModel : mineTaskModel
    }

    componentDidMount() {
    }

    renderHeader(type){
        if (type !== 'home') {
            return null;
        }
        return(
            <View style={styles.header}>
                <View style={styles.redLine}/>
                <MRText style={{fontSize: autoSizeWidth(16), color: '#666666', fontWeight: '600', marginLeft: 5}}>主线任务</MRText>
                <MRText style={{fontSize: autoSizeWidth(10), color: '#999999', marginLeft: 5}}>{'最高可获得'+'奖励'}</MRText>
            </View>
        )
    }

    renderTitle(type){
        if (type == 'home') {
            return null;
        }
        return(
            <View style={[styles.header, {height: autoSizeWidth(40), paddingHorizontal: 15}]}>
                <MRText style={{fontSize: autoSizeWidth(13), color: '#666666', fontWeight: '600'}}>日常任务</MRText>
                <View style={{flex: 1}}/>
                <MRText style={{fontSize: autoSizeWidth(10), color: '#999999', marginLeft: 5}}>{'最高可获得'+'奖励'}</MRText>
            </View>
        )
    }

    renderProgressView() {
        return(
            <View style={{height: autoSizeWidth(60), alignItems: 'center'}}>
                <View style={{height: autoSizeWidth(40), justifyContent: 'center'}}>
                    <View style={{width: autoSizeWidth(290),
                        backgroundColor: '#f5f5f5',
                        height: autoSizeWidth(8),
                        borderWidth: 1,
                        borderColor: '#eeeeee'}}>
                        <View style={{height: autoSizeWidth(8),
                            width: autoSizeWidth(290)/100*this.model.progress,
                            borderRadius: autoSizeWidth(4),
                            overflow: 'hidden'}}>
                            <UIImage source={task_progress}
                                     style={{ width: autoSizeWidth(290),height: autoSizeWidth(8)}}/>
                        </View>
                        <View style={[DesignRule.style_absoluteFullParent,
                            {flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                left: -10,
                                right: -10
                            }]}>
                            {
                                this.model.boxs.map((item)=> {
                                    return(
                                        this.renderBox(item)
                                    )
                                })
                            }
                        </View>
                        <UIImage source={task_run_people}
                                 style={{position: 'absolute', left: this.model.progress/100*autoSizeWidth(290) - autoSizeWidth(15), width: autoSizeWidth(22), height:autoSizeWidth(15),top: -15}}
                        />
                    </View>
                </View>

            </View>
        )
    }

    renderBox(data){
        let icon = null;
        switch (data.status){
            case BoxStatusClose:
                icon = task_box_close
                break
            case BoxStatusCanOpen:
                icon = task_box_can_open
                break
            case BoxStatusOpen:
                icon = task_box_open
                break
        }
        return(
            <View style={{width: autoSizeWidth(32), height: autoSizeWidth(80), justifyContent: 'center'}}>
                <UIImage source={icon} style={{width: autoSizeWidth(31), height: autoSizeWidth(31)}}/>
                <MRText style={{fontSize: autoSizeWidth(12),
                    color: data.status === BoxStatusOpen? DesignRule.mainColor:'#666666',
                    bottom: 0,
                    left:0,
                    right: 0,
                    textAlign: 'center',
                    position: 'absolute'
                }}>
                    {data.name}
                </MRText>
            </View>
        )
    }

    renderBtn(){
        let expanded  = this.model.expanded;
        return(
            <TouchableOpacity style={{height: autoSizeWidth(16),
                backgroundColor: '#FFF4EC',
                width: autoSizeWidth(20),
                alignSelf:'center'

            }}
                              onPress={()=>{this.model.expandedClick()}}
            >
                <ImageBackground source={task_bottom_btn}
                                 style={[DesignRule.style_absoluteFullParent,{ alignItems: 'center'}]}
                >
                    <UIImage source={expanded? arrow_red_top: arrow_red_bottom} style={{height: autoSizeWidth(6),width: autoSizeWidth(11)}}/>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    renderTaskView(){
        let expanded  = this.model.expanded;
        if (expanded === false){return null}
        return(
            <View style={{ height:  autoSizeWidth(300)}}>
                <View style={{backgroundColor: 'white', borderRadius: 5, marginTop: 10, overflow: 'hidden',flex: 1, marginHorizontal: 15}}>
                    <ScrollView>
                        {
                            this.model.tasks.map((item, index) => {
                                return <TaskItem key={'TaskItem_'+index} data = {item}/>
                            })
                        }

                    </ScrollView>
                    <TouchableOpacity style={{height: 40, justifyContent: 'center', alignItems: 'center'}}>
                        <MRText style={{fontSize: autoSizeWidth(12), color: '#999999'}}>已隐藏完成的任务</MRText>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    render() {
        if (this.model.show === false){
            return null;
        }
        let type = this.props.type;
        return (
            <View style={[{paddingHorizontal: 15},this.props.style]}>
                {this.renderHeader(type)}
                <View style={styles.bg}>
                    {this.renderTitle(type)}
                    {this.renderProgressView()}
                    {this.renderTaskView()}
                    <TouchableOpacity style={{height: autoSizeWidth(15)}}
                                      onPress={()=>{this.model.expandedClick()}}
                    />
                </View>
                {this.renderBtn()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        height:  autoSizeWidth(48),
        alignItems: 'center',
        flexDirection: 'row',
    },
    redLine: {
        backgroundColor: DesignRule.mainColor,
        height: 10,
        width: 4
    },
    bg: {
        backgroundColor: '#FFF4EC',
        borderRadius: 5,
        overflow: 'hidden',
    },
    lineOne:{
        height:0,
        borderWidth:0.8,
        borderColor:'#E4E4E4',
        borderStyle:'dashed',
        borderRadius:0.1,
    }
});
