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

import { IntervalMsgType } from '../../../comm/components/IntervalMsgView';





const BoxStatusClose = 0;
const BoxStatusCanOpen = 1;
const BoxStatusOpen = 2;

const TaskStatusUndone = 0;
const TaskStatusFinish = 2;

import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    TouchableWithoutFeedback
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
// import { IntervalMsgNavigate } from '../../../comm/components/IntervalMsgView';
import ImageLoader from '@mr/image-placeholder';
import { routePush } from '../../../navigation/RouterMap';

const { autoSizeWidth, px2dp } = ScreenUtils;
const {
    arrow_red_bottom,
    arrow_red_top,
    expanded_bottom,
    expanded_right
} = res.button;
const {
    task_box_close,
    task_box_can_open,
    task_box_open,
    red_btn,
    yellow_btn,
    task_run_people,
    task_finish,
    red_bg,
    gary_bg,
    current_p,
    inform,
    defaultImage
} = res.task;



// type	string
// example: 1
// 分享类型
//
// url

class TaskItem extends React.Component {
    constructor(props) {
        super(props);
        let data = this.props.data || {};
        this.state = {
            expanded: false,
            isShowDefaultImage: data.logoUrl? false: true
        };

    }

    renderItem(item, expanded) {
        let { complete, memo, name, total, prizeValue, logoUrl = '' } = item;
        let progrossTitle ='('+ complete + '/' + (total ? total : '无上限')+ ')';
        if (total === 1){
            progrossTitle = '';
        }
        let btn = this.renderBtn(item, false);
        let maxWidth = btn?autoSizeWidth(125+15):autoSizeWidth(195+15)
        if (item.type !== 2) {
            maxWidth += autoSizeWidth(15)
        }
        return (
            <View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: autoSizeWidth(64),
                    paddingLeft: autoSizeWidth(15),
                    paddingRight: autoSizeWidth(10)
                }}>
                    {
                        this.state.isShowDefaultImage? <UIImage style={{width: autoSizeWidth(40), height: autoSizeWidth(40)}}
                                                                source={defaultImage}
                        />: <ImageLoader style={{width: autoSizeWidth(40), height: autoSizeWidth(40)}}
                                         source={{uri: logoUrl}}
                                         onError={()=>{this.setState({isShowDefaultImage: true})}}
                        />
                    }

                    <View style={{justifyContent: 'center', marginLeft: 10, flex: 1,marginRight: 5}}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MRText style={{ fontSize: autoSizeWidth(14), color: '#333333', maxWidth: maxWidth}}
                                    numberOfLines={1}>{name + progrossTitle}</MRText>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                            colors={['#FFCB02', '#FF9502']}
                                            style={{borderRadius: 3, overflow: 'hidden', marginLeft: 3, paddingHorizontal: 2}}
                            >
                                <MRText style={{
                                    fontSize: autoSizeWidth(9),
                                    color: 'white',
                                    marginBottom: 0.5
                                }} allowFontScaling={false}>{'+'+prizeValue+'活跃值'}</MRText>
                            </LinearGradient>
                        </View>
                        <MRText style={{ fontSize: autoSizeWidth(12), color: '#999999'}}
                                numberOfLines={1}>{memo}</MRText>
                    </View>
                    {btn}
                    {item.type === 2?  <TouchableOpacity style={{
                        height: autoSizeWidth(50),
                        width: autoSizeWidth(20),
                        marginLeft: autoSizeWidth(5),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                                                         onPress={() => {
                                                             this.setState({ expanded: !expanded });
                                                         }}
                    >
                        <UIImage source={!expanded ? expanded_right : expanded_bottom}
                                 style={{ height: autoSizeWidth(11), width: autoSizeWidth(11) }}/>
                    </TouchableOpacity> : null}
                </View>
            </View>

        );
    }

    renderBtn(item, subTask) {

        if (item.status === TaskStatusFinish) {
            return <UIImage source={task_finish} style={{ height: autoSizeWidth(40), width: autoSizeWidth(55) }}/>;
        } else if (item.status === TaskStatusUndone && item.type === 2 && !subTask) {
            return null;
        } else {
            let btn = item.status === TaskStatusUndone ? red_btn : yellow_btn;
            let title = item.status === TaskStatusUndone ? '前往' : '领奖';
            if (item.interactiveCode == IntervalMsgType.sign && this.props.isSignIn){
                title = item.status === TaskStatusUndone ? '签到' : '领奖';
            }
            return (
                <TouchableOpacity style={{
                    width:  ScreenUtils.autoSizeWidth(63),
                    height: ScreenUtils.autoSizeWidth(35),
                    marginTop: ScreenUtils.autoSizeWidth(5),

                }}
                                  onPress={() => {
                                      this.btnClick(item, subTask, title);
                                  }}>
                    <ImageBackground source={btn}
                                     resizeMode={'contain'}
                                     style={{width:  ScreenUtils.autoSizeWidth(63), height: ScreenUtils.autoSizeWidth(35), alignItems: 'center', justifyContent: 'center'}}>
                        <MRText style={{
                            fontSize: autoSizeWidth(13),
                            color: 'white',
                            marginBottom: autoSizeWidth(8)
                        }} allowFontScaling={false}>{title}</MRText>
                    </ImageBackground>
                </TouchableOpacity>
            );
        }

    }

    btnClick(item, subTask, title) {
        if (item.interactiveCode == IntervalMsgType.sign && this.props.isSignIn){
            this.props.signIn && this.props.signIn()
        } else {
            this.props.model.getMissionPrize(item, subTask, title);
        }

    }

    renderSubItem(item){
        let { complete, memo, name, total} = item;
        let progrossTitle ='('+ complete + '/' + (total ? total : '无上限')+ ')';
        if (total === 1){
            progrossTitle = '';
        }
        return(
            <View style={{height: autoSizeWidth(52),marginTop: 5,flexDirection: 'row',marginLeft: autoSizeWidth(10),marginRight: autoSizeWidth(10),
                alignItems: 'center', backgroundColor: '#F7F7F7', paddingRight: autoSizeWidth(5)}}>
                <View style={{justifyContent: 'center', marginLeft: 15, flex: 1,marginRight: 5}}>
                    <MRText style={{ fontSize: autoSizeWidth(14), color: '#333333', maxWidth: autoSizeWidth(140)}}
                            numberOfLines={1}>{name + progrossTitle}</MRText>
                    <MRText style={{ fontSize: autoSizeWidth(12), color: '#999999'}}
                            numberOfLines={1}>{memo}</MRText>
                </View>
                {this.renderBtn(item, true)}
            </View>
        )
    }

    render() {
        let data = this.props.data || {};
        let expanded = this.state.expanded;
        let subMissions = data.subMissions || [];
        if (this.props.model.hideFinishTask) {
            subMissions = subMissions.filter((item) => {
                return item.status !== TaskStatusFinish;
            });
        }

        if (data.status === TaskStatusFinish && subMissions.length === 0 && this.props.model.hideFinishTask) {
            return null;
        }

        return (
            <View>
                {this.renderItem(data, expanded)}
                {expanded ? subMissions.map((item) => {
                    return this.renderSubItem(item);
                }) : null}
                <View style={{marginHorizontal: 20, backgroundColor: DesignRule.lineColor_inWhiteBg, height: 0.5}}/>
            </View>
        );
    }
}

@observer
export default class TaskVIew extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
        this.model = this.props.type === 'home' ? taskModel : mineTaskModel;
    }

    componentDidMount() {
    }

    renderHeader(type) {
        if (type !== 'home') {
            return null;
        }
        return (
            <View style={styles.header}>
                <View style={styles.redLine}/>
                <MRText style={{
                    fontSize: px2dp(16),
                    color: DesignRule.textColor_secondTitle,
                    fontWeight: '600',
                    marginLeft: px2dp(10)
                }}>{this.model.name}</MRText>
                <MRText style={{
                    fontSize: autoSizeWidth(10),
                    color: '#999999',
                    marginLeft: 5
                }}>{this.model.advMsg}</MRText>
            </View>
        );
    }

    renderTitle() {

        return (
            <View style={[styles.header, { height: autoSizeWidth(40), paddingHorizontal: 15 }]}>
                <MRText style={{
                    fontSize: autoSizeWidth(16),
                    color: '#333333',
                    fontWeight: '600'
                }}>{this.model.name}</MRText>
                <UIImage source={inform} style={{width: autoSizeWidth(15),height: autoSizeWidth(13), marginLeft: autoSizeWidth(5)}}/>
                <MRText style={{
                    fontSize: autoSizeWidth(10),
                    color: '#333333',
                    marginLeft: autoSizeWidth(5)
                }}>{this.model.advMsg}</MRText>
            </View>
        );
    }

    renderProgressView() {
        let progress = this.model.progress / this.model.totalProgress > 1 ? 1 : this.model.progress / this.model.totalProgress;
        return (
            <View style={{paddingHorizontal: 10}}>
                <View style={{backgroundColor: "#FFF1D9", height: autoSizeWidth(80), alignItems: 'center', borderRadius: 5, overflow: 'hidden'}}>
                    <View style={{ height: autoSizeWidth(40), justifyContent: 'center', marginTop: autoSizeWidth(25)}}>
                        <View style={{
                            width: autoSizeWidth(290),
                            backgroundColor: '#f5f5f5',
                            height: autoSizeWidth(5),
                            borderRadius: autoSizeWidth(4),
                            overflow: 'hidden',
                            borderColor: '#eeeeee'
                        }}>
                            <View style={{
                                height: autoSizeWidth(5),
                                width: autoSizeWidth(290) * progress,
                                borderRadius: autoSizeWidth(4),
                                overflow: 'hidden'
                            }}>
                                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                                colors={['#FC5D39', '#FF0050']}
                                                style={{ width: autoSizeWidth(290), height: autoSizeWidth(5)}}
                                />
                            </View>
                        </View>
                        <View style={[DesignRule.style_absoluteFullParent,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                left: -10,
                                right: -10
                            }]}>
                            {
                                this.model.boxs.map((item) => {
                                    return (
                                        this.renderBox(item)
                                    );
                                })
                            }
                        </View>
                        {
                            this.model.canOpenProgress !== -1?  <UIImage source={task_run_people}
                                                                         style={{
                                                                             position: 'absolute',
                                                                             left: this.model.canOpenProgress/this.model.totalProgress * autoSizeWidth(290) - autoSizeWidth(5),
                                                                             width: autoSizeWidth(25),
                                                                             height: autoSizeWidth(23),
                                                                             top: autoSizeWidth(5)
                                                                         }}
                            /> : null
                        }

                    </View>
                </View>
            </View>
        );
    }

    renderBox(data) {
        let icon = null;
        switch (data.prizeStatus) {
            case BoxStatusClose:
                icon = task_box_close;
                break;
            case BoxStatusCanOpen:
                icon = task_box_can_open;
                break;
            case BoxStatusOpen:
                icon = task_box_open;
                break;
        }
        return (
            <TouchableOpacity style={{
                width: autoSizeWidth(47),
                height: autoSizeWidth(65),
                alignItems: 'center',
                left: autoSizeWidth(290) / this.model.totalProgress * data.value -autoSizeWidth(47/2.0),
                position: 'absolute',
            }}
                              disabled={data.prizeStatus !== BoxStatusCanOpen}
                              onPress={() => {
                                  this.model.boxClick(data);
                              }}
            >
                <UIImage source={icon} style={{
                    width: autoSizeWidth(28),
                    height: autoSizeWidth(28),
                    marginBottom: autoSizeWidth(5)
                }}/>
                <ImageBackground style={{ bottom: 0,
                    position: 'absolute',
                    width: autoSizeWidth(47),
                    height: autoSizeWidth(24),
                    alignItems: 'center',
                    justifyContent: 'center',
                }} source={data.prizeStatus !== BoxStatusClose ? red_bg: gary_bg}>
                    <MRText style={{
                        fontSize: autoSizeWidth(8),
                        color: data.prizeStatus !== BoxStatusClose ? 'white' : '#EEEEEE',
                        marginBottom: autoSizeWidth(4)
                    }}>
                        {data.value + '活跃'}
                    </MRText>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    renderBtn() {
        return (
            <TouchableOpacity style={{ height: autoSizeWidth(30), justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
                              onPress={() => this.model.expandedClick()}
            >
                <MRText style={{ fontSize: autoSizeWidth(10), color: DesignRule.mainColor }}>{this.model.expanded ?
                    '收起任务列表' : '做任务赚活跃值'}</MRText>
                <UIImage source={this.model.expanded ? arrow_red_top : arrow_red_bottom}
                         style={{ height: autoSizeWidth(6), width: autoSizeWidth(11), marginLeft: 3 }}/>
            </TouchableOpacity>
        )
    }

    renderTaskView() {
        let expanded = this.model.expanded;
        return (
            <View style={{ height: expanded === false ?0:autoSizeWidth(280) }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 5,
                    overflow: 'hidden',
                    flex: 1,
                }}>
                    <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            this.model.tasks.map((item, index) => {
                                return <TaskItem key={'TaskItem_' + item.no}
                                                 data={item} model={this.model}
                                                 isSignIn={this.props.isSignIn}
                                                 signIn={this.props.signIn}
                                />;
                            })
                        }

                    </ScrollView>
                </View>
            </View>
        );
    }


    render() {
        if (this.model.show === false) {
            return null;
        }
        let type = this.props.type;
        let progress = this.model.progress + '';
        let fontSize = autoSizeWidth(17);
        if (this.model.type === 'home'){
            return (
                <View style={[{
                    width: ScreenUtils.width,
                }, this.props.style]}>
                    <View style={{
                        width: ScreenUtils.width,
                        paddingHorizontal: 15,
                    }}>
                    {this.renderTitle(type)}
                    </View>
                    <TouchableWithoutFeedback onPress={()=> {routePush('HtmlPage', {uri: '/cycle-coupon'})}}>
                        <View>
                    <ImageLoader style={{height: ScreenUtils.autoSizeWidth(120), width: ScreenUtils.width}}
                                 source={{uri: 'https://mr-prod-sg.oss-cn-hangzhou.aliyuncs.com/app/10_01_28__08_23_2019.jpg'}}
                    />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{backgroundColor: 'white',borderRadius: 8,
                        overflow: 'hidden',
                        marginTop: 10,
                        marginHorizontal: 15
                    }}>
                        {this.renderTaskView()}
                        {this.renderBtn()}
                    </View>
                    <TaskModalView type={type}/>
                </View>
            );

        }
        return (
            <View style={[{
                width: ScreenUtils.width,
                paddingHorizontal: 15,
            }, this.props.style]}>
                <View style={{backgroundColor: 'white',borderRadius: 8,
                    overflow: 'hidden',
                    marginTop: 5,}}>
                    {this.renderTitle(type)}
                    {this.renderProgressView()}
                    {this.renderTaskView()}
                    {this.renderBtn()}
                </View>
                <ImageBackground source={current_p}
                                 style={{width: autoSizeWidth(90),
                                     height: autoSizeWidth(45),
                                     right: 23,
                                     top: type === 'home'?  autoSizeWidth(10):autoSizeWidth(10),
                                     position: 'absolute',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                 }}>
                    <MRText style={{color: '#FF0050', fontSize: fontSize, fontWeight: '600', marginBottom: autoSizeWidth(14)}}>{progress}</MRText>
                </ImageBackground>
                <TaskModalView type={type}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: autoSizeWidth(48),
        alignItems: 'center',
        flexDirection: 'row'
    },
    redLine: {
        backgroundColor: DesignRule.mainColor,
        width: px2dp(2),
        height: px2dp(8),
        borderRadius: px2dp(1)
    }
});
