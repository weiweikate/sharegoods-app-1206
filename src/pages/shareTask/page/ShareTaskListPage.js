/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/10/19.
 * status: 1进行中 2待开奖 3待领奖 4已结束
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
import DesignRule from 'DesignRule';
import RouterMap from 'RouterMap';

const autoSizeWidth = ScreenUtils.autoSizeWidth;
import TimerMixin from 'react-timer-mixin';
import DateUtils from '../../../utils/DateUtils';

type Props = {};
export default class ShareTaskListPage extends BasePage<Props> {

    constructor(props) {
        super(props);
        this._bind();
        this.seconds = 0;
        this.expansions = {};
        this.state={};

    }

    $navigationBarOptions = {
        title: '我的任务',
        show: true// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {

        // this.shareModal.open();
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    _onEndRefresh() {
        this.startTimer();

    }

    loadPageData() {
    }

    //开启奖励
    getRewards(id) {
        this.$loadingShow();
        let that = this;
        taskApi.getReward({id: id}).then((result)=> {
            that.list2.onRefresh();
            let {recieveMoney, recieveBean} = result.data;
            if (recieveMoney <= 0){
                that.failModal.open();
            }{
                that.successModal.open();
                recieveMoney =  Math.round(recieveMoney*100)/100;
                recieveBean =  Math.round(recieveBean*100)/100;
                that.setState({recieveMoney,recieveBean});
            }
            that.$loadingDismiss();
        }).catch((error) => {
            that.$toastShow(error.msg);
            that.$loadingDismiss();
        });
    }

    _render() {
        return (
            <View style={styles.container}>
                <RefreshLargeList
                    style={{ flex: 1 }}
                    url={taskApi.taskList}
                    params={{}}
                    ref={(ref) => {
                        this.list2 = ref;
                    }}
                    heightForCell={({ row }) => {
                        return this.expansions[row] ? autoSizeWidth(335) : autoSizeWidth(95);
                    }}
                    renderItem={this._renderIndexPath}
                    renderItemSeparator={this.renderItemSeparator}
                    handleRequestResult={(data) => data.data}
                    isSupportLoadingMore={false}
                    onEndRefresh={this._onEndRefresh.bind(this)}
                />
                <ShareTaskResultAlert ref={(ref) => this.successModal = ref}
                                      success={true}
                                      money={this.state.recieveMoney}
                                      shareValue={this.state.recieveBean}
                                      onPress={() => {
                                          this.$navigate('mine/userInformation/MyCashAccountPage');
                                      }}/>
                <ShareTaskResultAlert ref={(ref) => this.failModal = ref}
                                      success={false}
                                      onPress={() => {
                                          this.$navigate('mine/userInformation/MyCashAccountPage');
                                      }}/>
            </View>
        );
    }

    renderItemSeparator = () => {
        return <View style={{ height: 7, backgroundColor: '#F7F7F7' }}/>;
    };

    _renderEndTaskView(recieveMoney) {
        return (
            <View style={{
                width: autoSizeWidth(170),
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{
                    color: DesignRule.textColor_white,
                    fontSize: DesignRule.fontSize_24,
                    marginBottom: 10
                }}>任务结束</Text>
                {recieveMoney === 0 ?
                    <Text style={{ color: DesignRule.textColor_white, fontSize: DesignRule.fontSize_24 }}>
                        {'没有任何秀友帮你激活～\n下次再接再厉'}
                    </Text> :
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={{ color: DesignRule.textColor_white, fontSize: DesignRule.fontSize_24 }}>
                            获得了
                        </Text>
                        <Text style={{ color: '#FFFC00', fontSize: DesignRule.fontSize_threeTitle }}>
                            {recieveMoney}
                        </Text>
                        <Text style={{ color: DesignRule.textColor_white, fontSize: DesignRule.fontSize_24 }}>
                            元现金奖励
                        </Text>
                    </View>

                }

            </View>
        );
    }

    _renderIndexPath = ({ section, row, item }) => {
        let arrow = this.expansions[row] ? arrow_top : arrow_bottom;
        let { status, countDown, shareHits, desc, recieveMoney, id} = item;
        let image_title = '';
        let image_btnText = '';
        let image_detail = '';
        let onPress = null;
        switch (status) {
            case 1:
                image_title = this.getRestTime(countDown, status);
                image_btnText = '继续分享';
                image_detail = shareHits === 0 ? '暂无好友激活' : '已有' + shareHits + '位好友帮你激活';
                onPress = () => {
                    this.$navigate(RouterMap.ShareTaskIntroducePage, { jobId: item.jobId });
                };
                break;
            case 2:
                image_title = '任务已结束';
                image_btnText = '等待开奖';
                image_detail = desc;
                // onPress = () => {() => this.$navigate(RouterMap.ShareTaskIntroducePage, { jobId: item.jobId })}
                break;
            case 3:
                image_title = '任务已结束';
                image_btnText = '开启奖励';
                image_detail = desc;
                onPress = () => {this.getRewards(id)};
                break;
        }
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
                        {'任务：' + item.name}
                    </Text>
                    <TouchableOpacity
                        style={{ width: autoSizeWidth(55), alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            if (this.expansions[row]) {
                                this.expansions[row] = undefined;
                            } else {
                                this.expansions[row] = 1;
                            }
                            this.list2.reloadData();
                        }}
                    >
                        <Image source={arrow}/>
                    </TouchableOpacity>
                </View>
                {
                    this.expansions[row]?
                            <View style={{ height: 280, paddingHorizontal: autoSizeWidth(15) }}>
                                <Text style={[styles.text, { marginTop: autoSizeWidth(10) }]}
                                      numberOfLines={2}
                                >
                                    {'任务说明：' + item.remarks}
                                </Text>
                                <Text style={[styles.text, { marginTop: autoSizeWidth(10) }]}>
                                    {'任务开始时间：' + DateUtils.getFormatDate(item.createTime / 1000, 'yyyy-MM-dd')}
                                </Text>
                                <View style={{
                                    marginTop: autoSizeWidth(20),
                                    height: autoSizeWidth(170),
                                    flexDirection: 'row'
                                }}>
                                    <Image source={task_bg}
                                           style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}/>
                                    <View style={{ flex: 1 }}/>
                                    {
                                        status === 4 ?
                                            this._renderEndTaskView(recieveMoney) :
                                            <View style={{
                                                width: autoSizeWidth(170),
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={styles.image_title}>{image_title}</Text>
                                                <TouchableOpacity style={styles.image_btn} onPress={onPress}>
                                                    <Text style={styles.image_btnText}>{image_btnText}</Text>
                                                </TouchableOpacity>
                                                <Text style={styles.image_detail}>{image_detail}</Text>
                                            </View>
                                    }
                                </View>
                            </View>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center', height: autoSizeWidth(40) }}>
                            <Text style={[styles.text, { marginLeft: autoSizeWidth(15), flex: 1 }]}>
                                {'任务倒计时：' + this.getRestTime(item.countDown, item.status)}
                            </Text>
                            {
                                status === 2 || status === 3 ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={redEnvelope} style={{ height: 14, width: 14, marginRight: 3 }}/>
                                        <Text style={{
                                            color: '#D51243',
                                            fontSize: autoSizeWidth(11),
                                            marginRight: autoSizeWidth(15)
                                        }}>待开奖</Text>
                                    </View> :
                                    null
                            }
                        </View>
                }
            </View>
        );
    };

    getRestTime(countDown, status) {
        if (status !== 1) {
            return '已结束';
        }
        let allSeconds = countDown / 1000;
        if (allSeconds <= this.seconds) {
            this.list2.onRefresh();
            return;
        }
        ;
        let restSeconds = allSeconds - this.seconds;
        let s = restSeconds % 60;
        restSeconds = (restSeconds - s) / 60;
        let m = restSeconds % 60;
        restSeconds = (restSeconds - m) / 60;
        let H = restSeconds % 24;
        restSeconds = (restSeconds - H) / 24;
        let d = restSeconds;
        return `${this.oneToTwo(d)}:${this.oneToTwo(H)}:${this.oneToTwo(m)}:${this.oneToTwo(s)}`;
    }

    oneToTwo(num) {
        if (num >= 10) {
            return num + '';
        } else if (num === 0) {
            return '00';
        } else {
            return '0' + num;
        }
    }


    startTimer() {
        let that = this;
        this.stopTimer();
        this.seconds = 0;
        this.timer = TimerMixin.setInterval(() => {
            that.seconds++;
            that.list2.reloadAll();
        }, 1000);
    }

    stopTimer() {
        this.timer && clearInterval(this.timer);
    }

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
    image_btn: {
        backgroundColor: '#D51243',
        height: autoSizeWidth(30),
        width: autoSizeWidth(100),
        marginTop: autoSizeWidth(10),
        marginBottom: autoSizeWidth(5),
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 5
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
