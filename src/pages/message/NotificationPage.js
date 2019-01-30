//通知页面
import React from 'react';
import {
    StyleSheet, DeviceEventEmitter,
    View
} from 'react-native';
import {MRText as Text} from '../../components/ui'
import ScreenUtils from '../../utils/ScreenUtils';
import DateUtils from '../../utils/DateUtils';
import StringUtils from '../../utils/StringUtils';
import RefreshList from '../../components/ui/RefreshList';
import BasePage from '../../BasePage';
import MessageApi from './api/MessageApi';
import Toast from '../../utils/bridge';
import DesignRule from '../../constants/DesignRule';
import RES from './res';
const emptyIcon = RES.message_empty;


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
        this.loadPageData();
    }

    $isMonitorNetworkStatus(){
        return true;
    }

    renderItem = ({ item, index }) => {
        return (this.renderNoticeItem({
            item,
            index
        }));
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
                    <Text style={{ marginHorizontal: 15, fontSize: 15 }}>{item.content}</Text>
                </View>
                <View style={{ height: 1.5, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
            </View>
        );
    };


    //type:200

    loadPageData =()=> {
        Toast.showLoading()
        MessageApi.queryNotice({ page: 1, pageSize: 10,type:200 }).then(res => {
            DeviceEventEmitter.emit('contentViewed');
            Toast.hiddenLoading()
            if (res.data.data) {
                let arrs = [];
                res.data.data.map((item, index) => {
                    arrs.push({
                        startTime: item.startTime,
                        content: item.content,
                        title: item.title,
                        type: item.type,
                    });
                });
                if(arrs.length > 0){
                    this.setState({
                        viewData: arrs
                    });
                }else {
                    this.setState({isEmpty:true})
                }

            }else {
                this.setState({isEmpty:true})
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
        MessageApi.queryNotice({ page: this.currentPage, pageSize: 10 ,type:200}).then(res => {
            if (res.ok && typeof res.data === 'object' && StringUtils.isNoEmpty(res.data.data)) {
                let arrs = this.currentPage === 1 ? [] : this.state.viewData;
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
                    emptyIcon={emptyIcon}
                    emptyTip={'暂无消息通知~'}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        paddingBottom:20
    },
    itemContents: {
        height: 37,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
