
import React from "react";
import { NativeModules, StyleSheet, TouchableOpacity, View ,Image,ImageBackground} from "react-native";
import BasePage from "../../../BasePage";
import { RefreshList, UIText, MRText as Text } from "../../../components/ui";
import StringUtils from "../../../utils/StringUtils";
import ScreenUtils from "../../../utils/ScreenUtils";
import LogisticsDetailItem from "../components/LogisticsDetailItem";
import OrderApi from "../api/orderApi";
import DesignRule from '../../../constants/DesignRule';
import res from "../res";
// import UIImage from "@mr/image-placeholder";

const logisticsTop = res.logisticsTop;
// const logisticsBottom = res.logisticsBottom;
const copy = res.copy;
// const logisticsIcon = res.dizhi;
const Nowuliu = res.kongbeiye_wulian;

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
            expressNo: this.params.expressNo ? this.params.expressNo : "",
            expressName: "",
            loadingState: "loading",
            flags: false,
            viewData: []
        };
    }

    $navigationBarOptions = {
        title: "物流详情",
        show: true// false则隐藏导航
    };
    renderFooter = () => {
        return(
            <View style={{height:20,width:ScreenUtils.width,backgroundColor:DesignRule.bgColor}}/>
        )
    }

    renderHeader = () => {
        return (
            <TouchableOpacity style={styles.logisticsNumber} onPress={() => this.copyToClipboard()}>
                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                    <UIText value={this.state.expressName + "：" + this.state.expressNo}
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
                />
        );
    };

    _render() {
        return (
            <View style={styles.container}>
                {this.state.flags || StringUtils.isEmpty(this.state.expressNo) ?
                    this.renderEmpty() : this.renderSuccess()}
            </View>
        );
    }

    renderEmpty() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Image source={Nowuliu} style={{ width: 92, height: 61 }}/>
                <Text style={{ color: "#909090", fontSize: 15, marginTop: 25 }}>暂无物流信息</Text>
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
                    emptyTip={"暂无数据"}
                />
            </View>
        );
    }

    componentDidMount() {
        this.loadPageData();
    }
    onRefresh=()=>{
        this.loadPageData();
    }
    //**********************************BusinessPart******************************************
    loadPageData() {
        console.log(this.params);
        if (StringUtils.isNoEmpty(this.state.expressNo)) {
            OrderApi.findLogisticsDetail({ expressNo: this.state.expressNo}).then((response) => {
                console.log(response.data.list);
                let arrData = [];
               response.data.list.map((item, index) => {
                    let time = item.time;
                    arrData.push({
                        time: time.replace(" ", "\n"),
                        content1: item.status
                    });
                });
                this.setState({
                    expressName: response.data.expName,
                    viewData: arrData,
                    loadingState: "success"
                });
            }).catch(e => {
                this.$toastShow(e.msg);
                this.setState({
                    flags: true,
                    loadingState: "success"
                });
            });
        } else {
            this.setState({ loadingState: "success" });
        }

    }

    copyToClipboard = () => {
        StringUtils.clipboardSetString(this.state.expressNo);
        NativeModules.commModule.toast("快递单号已复制到剪切板");
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
    }, logisticsNumber: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 10,
        height: 48,
        borderColor: "white",
        justifyContent: "center"
    }
});
