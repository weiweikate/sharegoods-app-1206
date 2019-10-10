import React from 'react';
import { Image, NativeModules, StyleSheet, TouchableOpacity, View } from 'react-native';
import BasePage from '../../../BasePage';
import { MRText as Text, RefreshList, UIText } from '../../../components/ui';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import LogisticsDetailItem from '../components/LogisticsDetailItem';
import OrderApi from '../api/orderApi';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
// import UIImage from "@mr/image-placeholder";

// const logisticsTop = res.logisticsTop;
// const logisticsBottom = res.logisticsBottom;
const copy = res.copy;
// const logisticsIcon = res.dizhi;
const Nowuliu = res.placeholder.no_data;

// import {PageLoadingState} from 'PageState';

export default class LogisticsDetailsPage extends BasePage {

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            orderId: this.params.orderId ? this.params.orderId : 0,
            expressNo: this.params.expressNo ? this.params.expressNo : '',
            expressName: this.params.expressName || '',
            loadingState: 'loading',
            flags: false,
            viewData: []
        };
    }

    $navigationBarOptions = {
        title: '物流详情',
        show: true// false则隐藏导航
    };
    renderFooter = () => {
        return (
            <View style={{ height: 20, width: ScreenUtils.width, backgroundColor: DesignRule.bgColor }}/>
        );
    };

    renderHeader = () => {
        return (
            <TouchableOpacity activeOpacity={0.7} style={styles.logisticsNumber} onPress={() => this.copyToClipboard()}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <UIText value={this.state.expressName + '：' + this.state.expressNo}
                            style={{ color: DesignRule.yellow_FF7, marginLeft: 18 }}/>
                    <Image source={copy} style={{ height: 17, width: 17, marginRight: 15 }}/>
                </View>
            </TouchableOpacity>
        );
    };
    renderItem = ({ item, index }) => {
        return (
            <LogisticsDetailItem
                time={item.time}
                content1={item.content1}
                isTop={index === 0}
                isBottom={index + 1 === this.state.viewData.length}
                length={this.state.viewData.length}
            />
        );
    };

    _render() {
        return (
            <View style={styles.container}>
                {this.state.viewData.length === 0 ?
                    this.renderEmpty() : this.renderSuccess()}
            </View>
        );
    }

    renderEmpty() {
        return (
            <View style={styles.container}>
                {this.state.expressNo ? this.renderHeader() : null}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={Nowuliu} style={{ width: 92, height: 61 }}/>
                    <Text style={{ color: '#909090', fontSize: 15, marginTop: 25 }}>暂无物流信息</Text>
                </View>
            </View>
        );
    }

    renderSuccess() {
        return (
            <View style={styles.container}>
                <RefreshList
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据'}
                />
            </View>
        );
    }

    componentDidMount() {
        this.loadPageData();
    }

    onRefresh = () => {
        this.loadPageData();
    };

    //**********************************BusinessPart******************************************
    loadPageData() {
        console.log(this.params);
        if (StringUtils.isNoEmpty(this.state.expressNo)) {
            OrderApi.findLogisticsDetail({
                expressNo: this.state.expressNo,
                expressCode: this.params.expressCode
            }).then((response) => {
                // console.log(response.data.list);
                let arrData = [];
                if (response.data && response.data.expressContent && response.data.expressContent.length > 0) {
                    response.data.expressContent.map((item, index) => {
                        let time = item.time;
                        arrData.push({
                            time: time ? time.replace(' ', '\n') : '',
                            content1: item.content
                        });
                    });
                } else {
                    this.setState({
                        loadingState: 'success',
                        // viewData: [],
                        isEmpty: true
                    });
                    return;
                }
                this.setState({
                    expressName: response.data.expressName,
                    viewData: arrData || [],
                    loadingState: 'success'
                });
            }).catch(e => {
                this.$toastShow(e.msg);
                this.setState({
                    flags: true,
                    loadingState: 'success'
                });
            });
        } else {
            this.setState({ loadingState: 'success' });
        }

    }

    copyToClipboard = () => {
        StringUtils.clipboardSetString(this.state.expressNo);
        NativeModules.commModule.toast('快递单号已复制到剪切板');
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    }, logisticsNumber: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        height: 48,
        borderColor: 'white',
        justifyContent: 'center'
    }
});
