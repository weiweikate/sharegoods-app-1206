//通知页面
import React from 'react';
import {
    StyleSheet, DeviceEventEmitter,
    View, Text, Image, TouchableOpacity
} from 'react-native';

import { color } from '../../constants/Theme';
import ScreenUtils from '../../utils/ScreenUtils';
import DateUtils from '../../utils/DateUtils';
import StringUtils from '../../utils/StringUtils';
import RefreshList from '../../components/ui/RefreshList';
import BasePage from '../../BasePage';
import arrorw_rightIcon from '../order/res/arrow_right.png';
import MessageApi from './api/MessageApi';
import Toast from '../../utils/bridge';
import DesignRule from 'DesignRule';


export default class NotificationPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            isEmpty: false,
        };
        this.currentPage = 1;
    }

    $navigationBarOptions = {
        title: '通知',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        DeviceEventEmitter.emit('contentViewed');
        this.loadPageData();
    }

    go2Questionnaire() {
        this.$navigate('message/QuestionnairePage');
    }

    renderItem = ({ item, index }) => {
        return (this.renderNoticeItem({
            item,
            index
        }));
    };
    isNoticeItem = (index) => {
        let noticeCode = 200;
        return this.state.viewData[index].status === noticeCode;
    };

    renderAnnouncementItem = ({ item, index }) => {
        return (
            <View style={{ height: 168, width: ScreenUtils.width }}>
                <View style={styles.itemContents}>
                    <Text>{DateUtils.getFormatDate(item.pushTime / 1000)}</Text>
                </View>
                <View style={{ height: 49, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 15, fontSize: 15, color: color.red }}>公告</Text>
                </View>
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
                <View style={{ height: 79, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 5, fontSize: 15 }}>{item.content}</Text>
                </View>
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
            </View>
        );
    };

    renderNoticeItem = ({ item, index }) => {
        return (
            <View style={{ width: ScreenUtils.width }}>
                <View style={styles.itemContents}>
                    <Text>{DateUtils.getFormatDate(item.startTime / 1000,'MM/dd hh:mm')}</Text>
                </View>
                <View style={{paddingVertical:17, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 15, fontSize: 15, color: DesignRule.textColor_mainTitle }}>{item.title}</Text>
                </View>
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
                <View style={{ justifyContent: 'center', backgroundColor: 'white',paddingVertical:32 }}>
                    <Text style={{ marginLeft: 15, fontSize: 15 }}>{item.content}</Text>
                </View>
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
            </View>
        );
    };


    //type:200

    loadPageData =()=> {
        Toast.showLoading()
        MessageApi.queryNotice({ page: 1, pageSize: 15,type:200 }).then(res => {
            Toast.hiddenLoading()
            if (StringUtils.isNoEmpty(res.data.data)) {
                let arrs = [];
                res.data.data.map((item, index) => {
                    arrs.push({
                        startTime: item.startTime,
                        content: item.content,
                        title: item.title,
                        type: item.type,
                    });
                });
                this.setState({
                    viewData: arrs
                });
            }
        }).catch(error=>{
            Toast.hiddenLoading()
            this.setState({isEmpty:true})
            this.$toastShow(error.msg);
        });
    }

    //下拉加载更多
    onLoadMore = () => {
        this.currentPage++;
        this.getDataFromNetwork();
    };
    //刷新
    onRefresh = () => {
        this.currentPage = 1;
        this.getDataFromNetwork();
    };

    getDataFromNetwork =()=> {
        MessageApi.queryNotice({ page: this.currentPage, pageSize: 15 ,type:200}).then(res => {
            if (res.ok && typeof res.data === 'object' && StringUtils.isNoEmpty(res.data.data)) {
                let arrs = this.currentPage == 1 ? [] : this.state.viewData;
                res.data.data.map((item, index) => {
                    arrs.push({
                        startTime: item.startTime,
                        content: item.content,
                        title: item.title,
                        type: item.type,
                    });
                });
                this.setState({
                    viewData: arrs
                });
            } else {
                Toast.toast(res.msg);
                this.setState({ isEmpty: true });
            }
        });
    }

    _render() {
        return (
            <View style={styles.container}>
                <RefreshList
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                />
            </View>
        );
    }

    renderQuestionnaire() {
        return (
            <View style={{ height: 219, width: ScreenUtils.width }}>
                <View style={{ height: 37, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>04/06 12:23</Text>
                </View>
                <View style={{ height: 49, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 15, fontSize: 15, color: color.red }}>[有奖调研]</Text>
                    <Text style={{ marginLeft: 5, fontSize: 15 }}> 您对我们的产品还满意么？</Text>
                </View>
                <View style={{ height: 0.5, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
                <View style={{ height: 93, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ marginLeft: 5, fontSize: 15 }}>想要了解您对我们的印象如何，参加调研，就有机会赢取丰富奖励！</Text>
                </View>
                <View style={{ height: 0.5, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
                <View style={{ height: 41, backgroundColor: 'white' }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => this.go2Questionnaire()}
                                      style={{
                                          height: 41,
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                      }}>
                        <Text style={{ fontSize: 13, color: DesignRule.textColor_instruction }}>查看详情</Text>
                        <Image source={arrorw_rightIcon} style={{ width: 11, height: 10, marginLeft: 5 }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    itemContents: {
        height: 37,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
