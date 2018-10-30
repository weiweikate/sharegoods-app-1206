/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/10/19.
 *
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import BasePage from '../../../BasePage';
import ShareTaskResultAlert from '../components/ShareTaskResultAlert';
import RefreshLargeList from 'RefreshLargeList';
import ScreenUtils from '../../../utils/ScreenUtils';
import taskApi from '../api/taskApi';
import arrow_bottom from '../res/arrow_bottom.png';
import arrow_top from '../res/arrow_top.png';
import redEnvelope from '../res/redEnvelope.png';
import task_bg from '../res/task_bg.png';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

type Props = {};
export default class ShareTaskListPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this._bind();
        this.time = 0;
        this.status = { 1: 2 };
    }

    $navigationBarOptions = {
        title: '我的任务',
        show: true// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.startTimer();
        // this.shareModal.open();
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    loadPageData() {
    }

    _render() {
        return (
            <View style={styles.container}>
                <RefreshLargeList
                    style={{ flex: 1 }}
                    url={taskApi.taskList}
                    params={{ status: 0 }}
                    ref={(ref) => {
                        this.list2 = ref;
                    }}
                    heightForCell={({ row }) => {
                        return this.status[row] ? autoSizeWidth(335) : autoSizeWidth(95);
                    }}
                    renderItem={this._renderIndexPath}
                    renderItemSeparator={this.renderItemSeparator}
                />
                <ShareTaskResultAlert ref={(ref) => this.shareModal = ref}
                                      success={true}
                                      money={25}
                                      shareValue={18}
                                      onPress={() => {
                                          this.$navigate('mine/userInformation/MyCashAccountPage');
                                      }}/>
            </View>
        );
    }

    renderItemSeparator = () => {
        return <View style={{ height: 7, backgroundColor: '#F7F7F7' }}/>;
    };

    _renderIndexPath = ({ section, row, item }) => {
        let arrow = this.status[row] ? arrow_top : arrow_bottom;
        return (
            <View style={styles.row}>
                <View style={{
                    height: autoSizeWidth(55),
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomColor: '#F7F7F7',
                    borderBottomWidth: 1
                }}>
                    <Text style={{
                        includeFontPadding: 0,
                        color: '#666666',
                        fontSize: autoSizeWidth(12),
                        marginLeft: autoSizeWidth(15),
                        flex: 1
                    }}
                          numberOfLines={2}
                    >
                        {'***发到发到发送到发发多发发送到发定时发放地方*******************发撒点发送到发送到发fads 发发发顺丰发到发疯似的*99999发发发发发发呆99'}
                    </Text>
                    <TouchableOpacity
                        style={{ width: autoSizeWidth(55), alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            if (this.status[row]) {
                                this.status[row] = undefined;
                            } else {
                                this.status[row] = 1;
                            }
                            this.list2.reloadData();
                        }}
                    >
                        <Image source={arrow}/>
                    </TouchableOpacity>
                </View>
                {
                    this.status[row] ?
                        <View style={{ height: 280, paddingHorizontal: autoSizeWidth(15) }}>
                            <Text style={[styles.text, { marginTop: autoSizeWidth(10) }]}
                                  numberOfLines={2}
                            >
                                {'***发到发到发送到发发多发发送到发定时发放地方*******************发撒点发送到发送到发fads 发发发顺丰发到发疯似的*99999发发发发发发呆99'}
                            </Text>
                            <Text style={[styles.text, { marginTop: autoSizeWidth(10) }]}>
                                {'任务开始时间：' + this.time}
                            </Text>
                            <View style={{ marginTop: autoSizeWidth(20), height: autoSizeWidth(170) , flexDirection: 'row'}}>
                                <Image source={task_bg}
                                       style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}/>
                                <View style={{flex: 1}}/>
                                <View style={{width: autoSizeWidth(170), alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={styles.image_title}>任务倒计时</Text>
                                    <TouchableOpacity style={styles.image_btn}>
                                        <Text style={styles.image_btnText}>继续分享</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.image_detail}>站务好友</Text>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: autoSizeWidth(40) }}>
                            <Text style={[styles.text, { marginLeft: autoSizeWidth(15), flex: 1 }]}>
                                {'任务倒计时：' + this.time}
                            </Text>
                            <Image source={redEnvelope} style={{ height: 14, width: 14, marginRight: 3 }}/>
                            <Text style={{
                                color: '#D51243',
                                fontSize: autoSizeWidth(11),
                                marginRight: autoSizeWidth(15)
                            }}>待开奖</Text>
                        </View>
                }
            </View>
        );
    };

    startTimer() {
        let that = this;
        this.timer = setInterval(() => {
            that.time++;
            that.list2.reloadAll();
        }, 1000);
    }

    stopTimer() {
        this.timer && clearInterval(this.timer);
    }

    b

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
        flex: 1,
        backgroundColor: 'white'
    },
    text: {
        color: '#666666',
        fontSize: autoSizeWidth(12),
        includeFontPadding: false
    },
    image_title: {
        color: '#FFFFFF',
        fontSize: autoSizeWidth(12),
        includeFontPadding: false
    },
    image_btn:{
        backgroundColor: '#D51243',
        height: autoSizeWidth(30),
        width: autoSizeWidth(100),
        marginTop: autoSizeWidth(10),
        marginBottom: autoSizeWidth(5),
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 5,
    },
    image_btnText: {
        color: '#FFFFFF',
        fontSize: autoSizeWidth(13),
        includeFontPadding: false
    },
    image_detail: {
        color: '#FFFFFF',
        fontSize: autoSizeWidth(11),
        includeFontPadding: false
    }
});
