/**
 * @author xzm
 * @date 2018/10/16
 */

import React from 'react';
import {
    StyleSheet, View, DeviceEventEmitter,
    TouchableWithoutFeedback
} from 'react-native';
import { MRText as Text } from '../../components/ui';
import ScreenUtils from '../../utils/ScreenUtils';
import StringUtils from '../../utils/StringUtils';
import DateUtils from '../../utils/DateUtils';
import BasePage from '../../BasePage';
import { RefreshList } from '../../components/ui';
import Toast from '../../utils/bridge';
import EmptyUtils from '../../utils/EmptyUtils';
import MessageAPI from './api/MessageApi';
const { px2dp } = ScreenUtils;
import CommonUtils from '../../utils/CommonUtils'
import MessageUtils from './utils/MessageUtils'
import DesignRule from '../../constants/DesignRule';
import RES from './res';

const emptyIcon = RES.message_empty;
export default class ShopMessagePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            isEmpty: false
            // currentPage: 1,
        };
        this.createdTime = null;
        this.currentPage = 1;
    }

    $navigationBarOptions = {
        title: '消息',
        show: true // false则隐藏导航
    };


    $isMonitorNetworkStatus() {
        return true;
    }

    componentDidMount() {
        this.loadPageData();
    }

    confirmMessage = (id, confirm, createdBy, index) => {
        //otherUserId 消息来源的人员ID
        //messageId 这条消息的ID
        //status    同意或拒绝 0拒绝 1同意
        MessageAPI.confirmMessage({ status: confirm ? 1 : 0, messageId: id, otherUserCode: createdBy }).then(res => {
            let arr = CommonUtils.deepClone(this.state.viewData);
            arr[index].confirm = confirm;
            this.setState({
                viewData: arr
            });

        }).catch(error => {
            this.$toastShow(error.msg);
        });
    };

    //100普通，200拼店
    /*加载数据*/
    loadPageData = () => {
        Toast.showLoading();
        MessageAPI.queryMessage({ page: 1, pageSize: 10, type: 200 }).then(res => {
            Toast.hiddenLoading();
            DeviceEventEmitter.emit('contentViewed');
            if (StringUtils.isNoEmpty(res.data.data)) {
                let arrData = [];
                res.data.data.map((item, index) => {
                    arrData.push(item);
                });
                if (!EmptyUtils.isEmptyArr(arrData)) {
                    this.createdTime = arrData[arrData.length - 1].createdTime;
                }
                this.setState({ viewData: arrData });
            } else {
                Toast.toast(res.msg);
                this.setState({ isEmpty: true });
            }
        }).catch((error) => {
            Toast.hiddenLoading();
            this.setState({ isEmpty: true });
            this.$toastShow(error.msg);
        });
    };

    itemBottomRender(item, index) {
        if (item.messageType === 100) {
            return null;
        }

        if (item.messageType === 200) {
            return (

                <TouchableWithoutFeedback onPress={() => {
                    MessageUtils.goDetailPage(this.$navigate, item.paramType, item.param);
                }}>
                    <View style={{
                        height: px2dp(33),
                        width: ScreenUtils.width,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        borderTopColor: DesignRule.lineColor_inGrayBg,
                        borderTopWidth: ScreenUtils.onePixel
                    }}>
                        <Text style={{ color: DesignRule.textColor_secondTitle, fontSize: px2dp(13) }}>
                            查看详情>>
                        </Text>
                    </View>
                </TouchableWithoutFeedback>

            );
        }

        if (item.messageType === 300) {
            if (EmptyUtils.isEmpty(item.confirm)) {
                return (
                    <View style={styles.itemBottomWrapper}>
                        <TouchableWithoutFeedback onPress={() => {
                            this.confirmMessage(item.id, false, item.createdBy, index);
                        }}>
                            <View style={styles.whiteButtonStyle}>
                                <Text style={{ color: DesignRule.mainColor, fontSize: px2dp(16) }}>
                                    拒绝
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {
                            this.confirmMessage(item.id, true, item.createdBy, index);
                        }}>
                            <View style={styles.redButtonStyle}>
                                <Text style={{ color: 'white', fontSize: px2dp(16) }}>
                                    同意
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                );
            } else if (item.confirm === true) {
                return (
                    <View style={styles.itemBottomWrapper}>
                        <View style={styles.grayButtonStyle}>
                            <Text style={{ color: 'white', fontSize: px2dp(16) }}>
                                已同意
                            </Text>
                        </View>
                    </View>
                );

            } else {
                return (
                    <View style={styles.itemBottomWrapper}>
                        <View style={styles.grayButtonStyle}>
                            <Text style={{ color: 'white', fontSize: px2dp(16) }}>
                                已拒绝
                            </Text>
                        </View>
                    </View>
                );
            }
        }

        if (item.messageType === 400) {
            return (
                <View style={styles.itemBottomWrapper}>
                    <View style={styles.grayButtonStyle}>
                        <Text style={{ color: 'white', fontSize: px2dp(16) }}>
                            拒绝
                        </Text>
                    </View>

                    <View style={styles.grayButtonStyle}>
                        <Text style={{ color: 'white', fontSize: px2dp(16) }}>
                            同意
                        </Text>
                    </View>
                </View>
            );
        }


    }

    /**
     * STORE_APPLY(201, "申请加入店铺"),
     OUT(202, "请出消息"),
     IN(203, "招募消息"),
     STORE_SUCCESS(204, "拼店成功"),
     STORE_FAILED(205, "拼店失败)"),
     APPLY_SUCCESS(206, "申请的店铺已同意"),
     APPLY_FAILED(207, "申请的店铺拒绝了您"),
     TRANSFER_APPLY(208, "转让请求"),
     STORE_DISSOLVE(209, "店铺解散消息)"),
     TRANSFER_SUCCESS(210, "店铺转让成功"),
     TRANSFER_FAILED(211, "店铺转让失败"),
     STORE_START(212, "您的招募店铺“XXX小店”已满足招募要求，马上去开启"),
     * @param item
     * @param index
     * @returns {*}
     */

    renderItem = ({ item, index }) => {


        return (
            <View style={{ width: ScreenUtils.width, backgroundColor: 'white' }}>
                <View style={styles.itemContents}>
                    <Text>{DateUtils.getFormatDate(item.createdTime / 1000, 'MM/dd hh:mm')}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: px2dp(15) }}>
                    <Text style={{
                        marginLeft: 15,
                        fontSize: 15,
                        color: DesignRule.textColor_mainTitle
                    }}>{item.title}</Text>
                </View>
                <View style={{ backgroundColor: 'white', marginVertical: px2dp(15) }}>
                    <Text style={{
                        marginHorizontal: 15,
                        fontSize: 13,
                        color: DesignRule.textColor_secondTitle
                    }}>{item.content}</Text>
                </View>
                {this.itemBottomRender(item, index)}
            </View>
        );
    };
    onLoadMore = () => {
        // this.setState({
        //     currentPage: this.state.currentPage + 1
        // });
        this.currentPage++;
        this.getDataFromNetwork();
    };
    onRefresh = () => {
        // this.setState({
        //     currentPage: 1
        // });
        this.currentPage = 1;
        this.createdTime = null;
        this.getDataFromNetwork();
    };

    getDataFromNetwork() {
        MessageAPI.queryMessage({
            page: this.currentPage,
            pageSize: 10,
            type: 200,
            createdTime: this.createdTime
        }).then(res => {
            if (StringUtils.isNoEmpty(res.data.data)) {
                if (!EmptyUtils.isEmptyArr(arrData)) {
                    this.createdTime = res.data.data[res.data.data.length - 1].createdTime;
                }
                let arrData = this.state.viewData;
                if (this.currentPage === 1) {
                    arrData = [];
                }
                res.data.data.map((item, index) => {
                    arrData.push(item);
                });
                this.setState({ viewData: arrData });
            }
        }).catch((error) => {
            this.$toastShow(error.msg);
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
                    emptyIcon={emptyIcon}
                    emptyTip={'暂无消息通知~'}
                    isEmpty={this.state.isEmpty}
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
    typetitleStyle: {
        height: 49,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    typeContentstyle: {
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    typecommentstyle: {
        height: 80,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 15
    },
    bottomlookstyle: {
        height: 41,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    commonttext: {
        marginLeft: 5,
        fontSize: 15
    },
    tilteposition: {
        marginLeft: 15,
        fontSize: 15
    },
    typecontent2: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    itemContents: {
        height: 37,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.bgColor
    },
    itemBottomWrapper: {
        height: px2dp(60),
        width: ScreenUtils.width,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        borderTopWidth: ScreenUtils.onePixel,
        borderTopColor: DesignRule.lineColor_inGrayBg
    },
    whiteButtonStyle: {
        backgroundColor: 'white',
        width: px2dp(138),
        height: px2dp(40),
        borderWidth: 1,
        borderRadius: px2dp(5),
        borderColor: DesignRule.mainColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    redButtonStyle: {
        backgroundColor: DesignRule.mainColor,
        width: px2dp(138),
        height: px2dp(40),
        borderWidth: 1,
        borderRadius: px2dp(5),
        borderColor: DesignRule.mainColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    grayButtonStyle: {
        backgroundColor: DesignRule.lineColor_inGrayBg,
        width: px2dp(138),
        height: px2dp(40),
        borderWidth: 1,
        borderRadius: px2dp(5),
        borderColor: DesignRule.lineColor_inGrayBg,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
