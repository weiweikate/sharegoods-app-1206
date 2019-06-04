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
const TaskStatusWaitFinish = 1;
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
import TaskModalView from './TaskModalView';
import { IntervalMsgNavigate } from '../../../comm/components/IntervalMsgView';
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


// type	string
// example: 1
// 分享类型
//
// url

class TaskItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };

    }

    renderItem(item,expanded ,subTask = false){
        let {complete, prizeDesc,name, total, memo, prizeValue} = item;
        return(
            <View >
                {subTask?<View style={styles.lineOne}/>: null}
                <View style={{paddingHorizontal:10, flexDirection: 'row', alignItems: 'center', height: autoSizeWidth(50), width: ScreenUtils.width - 60}}>
                    {prizeValue? <View style={{alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFD8BC',
                        height: autoSizeWidth(31),
                        width: autoSizeWidth(31),
                        borderRadius:  autoSizeWidth(31/2),
                        overflow: 'hidden'
                    }}>
                        <MRText style={{fontSize: autoSizeWidth(11), color: '#333333'}}>{'+'+prizeValue}</MRText>
                    </View> : null
                    }
                    <MRText style={{fontSize: autoSizeWidth(14), color: '#333333', marginLeft: 10, flex: 1}} numberOfLines={1}>{name+'('+complete+'/'+ total+')'}</MRText>
                    {this.renderBtn(item, subTask)}
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
                            <MRText style={{fontSize: autoSizeWidth(10), color: '#666666'}}>{memo}</MRText>
                            <MRText style={{fontSize: autoSizeWidth(10), color: '#666666',marginTop: 5}}>{prizeDesc}</MRText>
                        </View>
                        :null
                }
            </View>
        )
    }

    renderBtn(item, subTask){

        if(item.status === TaskStatusFinish){
            return <UIImage source={task_finish} style={{height: autoSizeWidth(40),width: autoSizeWidth(55)}}/>
        }else if(item.status === TaskStatusUndone && item.type === 2 &&!subTask) {
            return null;
        } else {
                let colors = item.status === TaskStatusUndone ? ['#FC5D39','#FF0050']:['#FFCB02', '#FF9502']
                let title = item.status === TaskStatusUndone ? '前往': '领奖'
                return(
                    <TouchableOpacity style={{
                        width: ScreenUtils.autoSizeWidth(60),
                        height:  ScreenUtils.autoSizeWidth(24),
                        borderRadius:  ScreenUtils.autoSizeWidth(12),
                        overflow: 'hidden'
                    }}
                                      onPress={() => {this.btnClick(item, subTask)}}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        colors={colors}
                                        style={{ alignItems: "center",
                                            justifyContent: "center",
                                            flex: 1}}
                        >
                            <MRText style={{
                                fontSize: autoSizeWidth(13),
                                color: 'white',
                                marginTop: 1
                            }} allowFontScaling={false}>{title}</MRText>
                        </LinearGradient>
                    </TouchableOpacity>
                )
            }

    }

    btnClick(item, subTask){
        if (item.status === TaskStatusWaitFinish ) {
            this.props.model.getMissionPrize(item, subTask)
        }else if (item.status === TaskStatusUndone ) {
            let {interactiveCode, interactiveValue} = item
            IntervalMsgNavigate(parseInt(interactiveCode), interactiveValue);
        }
    }

    render(){
        let data = this.props.data || {};
        let expanded = this.state.expanded;
        let subMissions = data.subMissions || []
        if (this.props.model.hideFinishTask) {
            subMissions = subMissions.filter((item) => {
                return item.status !== TaskStatusFinish
            });
        }

        if (data.status === TaskStatusFinish && subMissions.length === 0 && this.props.model.hideFinishTask){
            return null;
        }

        return (
            <View>
                {this.renderItem(data,expanded)}
                {expanded?subMissions.map((item)=>{
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
                <MRText style={{fontSize: autoSizeWidth(16), color: '#666666', fontWeight: '600', marginLeft: 5}}>{this.model.name}</MRText>
                <MRText style={{fontSize: autoSizeWidth(10), color: '#999999', marginLeft: 5}}>{this.model.advMsg}</MRText>
            </View>
        )
    }

    renderTitle(type){
        if (type == 'home') {
            return null;
        }
        return(
            <View style={[styles.header, {height: autoSizeWidth(40), paddingHorizontal: 15}]}>
                <MRText style={{fontSize: autoSizeWidth(13), color: '#666666', fontWeight: '600'}}>{this.model.name}</MRText>
                <View style={{flex: 1}}/>
                <MRText style={{fontSize: autoSizeWidth(10), color: '#999999', marginLeft: 5}}>{this.model.advMsg}</MRText>
            </View>
        )
    }

    renderProgressView() {
       let progress = this.model.progress/this.model.totalProgress > 1 ? 1: this.model.progress/this.model.totalProgress;
        return(
            <View style={{height: autoSizeWidth(60), alignItems: 'center'}}>
                <View style={{height: autoSizeWidth(40), justifyContent: 'center',marginTop: autoSizeWidth(5)}}>
                    <View style={{width: autoSizeWidth(290),
                        backgroundColor: '#f5f5f5',
                        height: autoSizeWidth(8),
                        borderRadius: autoSizeWidth(4),
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: '#eeeeee'}}>
                        <View style={{height: autoSizeWidth(6),
                            width:  autoSizeWidth(290)*progress,
                            borderRadius: autoSizeWidth(4),
                            overflow: 'hidden'}}>
                            <UIImage source={task_progress}
                                     style={{ width: autoSizeWidth(290),height: autoSizeWidth(8)}}/>
                        </View>
                    </View>
                    <View style={[DesignRule.style_absoluteFullParent,
                        {flexDirection: 'row',
                            alignItems: 'center',
                            left: -10,
                            right: -10,
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
                             style={{position: 'absolute', left: progress*autoSizeWidth(290) - autoSizeWidth(15), width: autoSizeWidth(22), height:autoSizeWidth(15),top: 0}}
                    />
                </View>

            </View>
        )
    }

    renderBox(data){
        let icon = null;
        switch (data.prizeStatus){
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
            <TouchableOpacity style={{width: autoSizeWidth(32),
                height: autoSizeWidth(70),
                justifyContent: 'center',
                left: autoSizeWidth(290 - 32 + 20)/this.model.totalProgress*data.value,
                position: 'absolute'
            }}
                               disabled={data.prizeStatus !== BoxStatusCanOpen}
                              onPress={()=> {this.model.boxClick(data)}}
            >
                <UIImage source={icon} style={{width: autoSizeWidth(40),
                    height: autoSizeWidth(40),
                    marginBottom: autoSizeWidth(5)}}/>
                <MRText style={{fontSize: autoSizeWidth(12),
                    color: data.status === BoxStatusOpen? DesignRule.mainColor:'#666666',
                    bottom: 0,
                    left:-30,
                    right: -30,
                    textAlign: 'center',
                    position: 'absolute',
                }}>
                    {data.value + '活跃'}
                </MRText>
            </TouchableOpacity>
        )
    }

    renderBtn(){
        let expanded  = this.model.expanded;
        return(
            <TouchableOpacity   onPress={()=>{this.model.expandedClick()}}>
            <View style={{height: autoSizeWidth(13),
                width: autoSizeWidth(40),
                alignSelf:'center'

            }}
            >
                <ImageBackground source={task_bottom_btn}
                                 style={[DesignRule.style_absoluteFullParent,{ alignItems: 'center'}]}
                >
                    <UIImage source={expanded? arrow_red_top: arrow_red_bottom} style={{height: autoSizeWidth(6),width: autoSizeWidth(11)}}/>
                </ImageBackground>
            </View>
            </TouchableOpacity>
        )
    }

    renderTaskView(){
        let expanded  = this.model.expanded;
        if (expanded === false){return null}
        return(
            <View style={{ height:  autoSizeWidth(300)}}>
                <View style={{backgroundColor: 'white', borderRadius: 5, marginTop: 10, overflow: 'hidden',flex: 1, marginHorizontal: 15}}>
                    <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            this.model.tasks.map((item, index) => {
                                return <TaskItem key={'TaskItem_'+item.no} data = {item} model={this.model}/>
                            })
                        }

                    </ScrollView>
                    <TouchableOpacity style={{height: 40, justifyContent: 'center', alignItems: 'center'}}
                                      onPress={()=> this.model.hideFinishTaskClick()}
                    >
                        <MRText style={{fontSize: autoSizeWidth(12), color: '#999999'}}>{this.model.hideFinishTask?
                            '显示已完成任务' : '隐藏已完成任务 '}</MRText>
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
            <View style={[{paddingHorizontal: 15, width: ScreenUtils.width, backgroundColor: 'white', paddingBottom: 10},this.props.style]}>
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
                <TaskModalView type = {type}/>
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
        borderWidth:0.7,
        borderColor: '#E4E4E4',
        borderStyle:'dashed',
        borderRadius:0.1,
    }
});
