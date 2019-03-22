import React from "react";
import {
    StyleSheet, View, Image,FlatList,RefreshControl,ActivityIndicator,
} from "react-native";
import BasePage from "../../../../BasePage";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from "../../../../constants/DesignRule";
import { MRText as Text, NoMoreClick} from "../../../../components/ui";
import res from "./../../res";
import API from "../../../../api";
// import StringUtils from "../../../../utils/StringUtils";
import bridge from "../../../../utils/bridge";
import user from "../../../../model/user";
import { formatDate } from "../../../../utils/DateUtils";
import CouponExplainItem from "../../components/CouponExplainItem";
import CouponNormalItem from "../../components/CouponNormalItem";
const NoMessage = res.couponsImg.coupons_no_data;


const { px2dp } = ScreenUtils;
export default class CouponsDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            viewData: [],
            pageStatus: this.props.pageStatus,
            isEmpty: true,
            isFirstLoad: true
        };
        this.currentPage = 0;
        this.isLoadMore = false;
        this.isEnd = false;

    }

    $navigationBarOptions = {
        title: "优惠券",
        show: true // false则隐藏导航
    };
    componentDidMount() {
        this.onRefresh();
    }

    _keyExtractor = (item, index) => index;
    // 空布局
    _renderEmptyView = () => {
        if (this.state.isFirstLoad) {
            return (
                <View style={styles.footer_container}>
                    <ActivityIndicator size="small" color="#888888"/>
                    <Text style={styles.footer_text}>拼命加载中…</Text>
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Image source={NoMessage} style={{ width: 110, height: 110, marginTop: 112 }}/>
                    <Text style={{ color: DesignRule.textColor_instruction, fontSize: 15, marginTop: 11 }}
                          allowFontScaling={false}>还没有优惠券哦</Text>
                    <Text style={{ color: DesignRule.textColor_instruction, fontSize: 12, marginTop: 3 }}
                          allowFontScaling={false}>快去商城逛逛吧</Text>
                    <NoMoreClick
                        onPress={() => {
                            this._gotoLookAround();
                        }}>
                        <View style={styles.guangStyle}>
                            <Text style={{
                                color: DesignRule.mainColor,
                                fontSize: 15
                            }} allowFontScaling={false}>
                                去逛逛
                            </Text>
                        </View>
                    </NoMoreClick>
                </View>
            );
        }

    };
    _gotoLookAround = () => {
        this.$navigateBackToHome();
    };

    parseCoupon = (item) => {
        let products = item.products || [], cat1 = item.cat1 || [], cat2 = item.cat2 || [], cat3 = item.cat3 || [];
        let result = null;
        if(item.type === 5){
            return "限商品：限指定商品可用";
        }
        if (products.length) {
            if ((cat1.length || cat2.length || cat3.length)) {
                return "限商品：限指定商品可用";
            }
            if (products.length > 1) {
                return "限商品：限指定商品可用";
            }
            if (products.length === 1) {
                let productStr = products[0];
                if (productStr.length > 15) {
                    productStr = productStr.substring(0, 15) + "...";
                }
                return `限商品：限${productStr}商品可用`;
            }
        }
        else if ((cat1.length + cat2.length + cat3.length) === 1) {
            result = [...cat1, ...cat2, ...cat3];
            return `限品类：限${result[0]}品类可用`;
        }
        else if ((cat1.length + cat2.length + cat3.length) > 1) {
            return `限品类：限指定品类商品可用`;
        } else {
            return "全品类：全场通用券（特殊商品除外）";
        }
    };
    renderItem = ({ item, index }) => {
        // 优惠券状态 status  0-未使用 1-已使用 2-已失效 3-未激活
        if (item.remarks) {
            return (
                <CouponExplainItem item={item} index={index} toExtendData={()=>this.toExtendData(item)}
                                   pickUpData={()=>this.pickUpData(item)} clickItem={()=>{}}/>
            );
        } else {
            return (
                <CouponNormalItem  item={item} index={index} clickItem={()=>{}}/>
            );
        }

    };
    fmtDate(obj) {
        return formatDate(obj, "yyyy.MM.dd");
    }
    toExtendData=(item)=>{
        let index = this.state.viewData.indexOf(item);
        let viewData = this.state.viewData;
        viewData[index].tobeextend=false;
        this.setState({viewData:viewData})
    }
    pickUpData=(item)=>{
        let index = this.state.viewData.indexOf(item);
        let viewData = this.state.viewData;
        viewData[index].tobeextend=true;
        this.setState({viewData:viewData})

    }
    parseData = (dataList) => {
        let arrData = [];
        console.log("currentPage",this.currentPage);
        if (this.currentPage === 1) {//refresh
            this.handleList(dataList, arrData);
            console.log("couponsDetail",arrData);
            this.setState({ viewData: arrData, isFirstLoad: false });
        } else {//more
            this.handleList(dataList, arrData);
            this.setState({ viewData: this.state.viewData.concat(arrData) });
        }

    };
    handleList = (dataList, arrData) => {
        dataList.forEach((item) => {
            arrData.push({
                code: item.code,
                id: item.id,
                status: item.status,
                name: item.name,
                timeStr: item.startTime&&item.expireTime?this.fmtDate(item.startTime||0) + "-" + this.fmtDate(item.expireTime||0):null,
                value: item.type === 3 ? (item.value / 10) : (item.type === 4 ? "商品\n兑换" : (item.type === 5 ? "兑换" : item.value)),
                limit: this.parseCoupon(item),
                couponConfigId: item.couponConfigId,
                remarks: item.remarks,
                type: item.type,
                levelimit: item.levels ? (item.levels.indexOf(user.levelId) !== -1 ? false : true) : false
            });
        });
    };
    onLoadMore = () => {
        console.log("onLoadMore", this.isLoadMore,this.isEnd,this.state.isFirstLoad);
        if (!this.isLoadMore && !this.isEnd && !this.state.isFirstLoad) {
            this.currentPage++;
            this.getDataFromNetwork();
        }
    };
    onRefresh = () => {
        console.log("refresh");
        this.isEnd = false;
        this.currentPage = 1;
        this.getDataFromNetwork();
    };
    getDataFromNetwork(){
        API.userCouponList({
            page: this.currentPage,
            pageSize: 10,
            status:this.params.status,
            couponIds:this.params.couponIds,
            pageType:2
        }).then(result => {
            let data = result.data || {};
            let dataList = data.data || [];
            this.isLoadMore = false;
            console.log("getDataFromNetwork",dataList);
            this.parseData(dataList);

            if (dataList.length === 0) {
                this.isEnd = true;
                return;
            }
        }).catch(result => {
            this.setState({
                isFirstLoad: false, viewData: []
            });
            this.isLoadMore = false;
            bridge.$toast(result.msg);
        });
    }

    _render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.viewData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => this.onLoadMore()}
                    ListFooterComponent={this._footer}
                    ListEmptyComponent={this._renderEmptyView}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={5}
                    refreshControl={<RefreshControl refreshing={false}
                                                    onRefresh={this.onRefresh}
                                                    colors={[DesignRule.mainColor]}/>}
                />
            </View>
        )
    }

}
const styles = StyleSheet.create(
    {
        container: {
            paddingTop: 15,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: DesignRule.bgColor
        },
        itemFirStyle: {
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            width: px2dp(80)
        },
    }
);
