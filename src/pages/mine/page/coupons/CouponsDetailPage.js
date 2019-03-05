import React from "react";
import {
    StyleSheet, View, Image,FlatList,RefreshControl,ActivityIndicator,
    ImageBackground
} from "react-native";
import BasePage from "../../../../BasePage";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from "../../../../constants/DesignRule";
import { MRText as Text, NoMoreClick,UIText} from "../../../../components/ui";
import res from "./../../res";
import API from "../../../../api";
// import StringUtils from "../../../../utils/StringUtils";
import bridge from "../../../../utils/bridge";
import user from "../../../../model/user";
import { formatDate } from "../../../../utils/DateUtils";
const NoMessage = res.couponsImg.coupons_no_data;
const unUsedBgex = res.couponsImg.youhuiquan_bg_unUsedBg_ex;
const unUsedBg = res.couponsImg.youhuiquan_bg_unUsedBg;
const unUsedBgExd = res.couponsImg.youhuiquan_bg_unUsedBg_exd;
const usedBgex = res.couponsImg.youhuiquan_bg_usedBg_ex;
const usedBg = res.couponsImg.youhuiquan_bg_usedBg;
const useBgexd = res.couponsImg.youhuiquan_bg_usedBg_exd;
const itemUp = res.couponsImg.youhuiquan_icon_smallUp;
const itemDown = res.couponsImg.youhuiquan_icon_smallDown;


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

    parseCoupon = (item) => {
        let products = item.products || [], cat1 = item.cat1 || [], cat2 = item.cat2 || [], cat3 = item.cat3 || [];
        let result = null;
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
                <View style={{ backgroundColor: DesignRule.bgColor, marginBottom: 5 ,justifyContent:'center'}}>
                    <ImageBackground style={{
                        width: ScreenUtils.width - px2dp(30),
                        height: item.tobeextend ? px2dp(94) : px2dp(118),
                        margin: 2
                    }}
                                     source={item.status == 0 ? (item.levelimit?(item.tobeextend ? useBgexd : usedBgex):( item.tobeextend ? unUsedBgExd : unUsedBgex)) : (item.tobeextend ? useBgexd : usedBgex)}
                                     resizeMode='stretch'>
                        <View style={{ flexDirection: "row", alignItems: "center", height: px2dp(94) }}>
                            <View style={styles.itemFirStyle}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {
                                        item.type === 3 || item.type === 4 || item.type === 5 || item.type === 12 ? null :
                                            <View style={{ alignSelf: "flex-end", marginBottom: 2 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : DesignRule.textColor_mainTitle,
                                                        marginBottom: 4
                                                    }} allowFontScaling={false}>￥</Text>
                                            </View>}
                                    <View>
                                        <Text style={{
                                            fontSize: item.type === 4 ? 20 : (item.value && item.value.length < 3 ? 33 : 26),
                                            color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : DesignRule.textColor_mainTitle,
                                        }} allowFontScaling={false}>{item.value}</Text>
                                    </View>
                                    {
                                        item.type === 3 ?
                                            <View style={{ alignSelf: "flex-end", marginBottom: 2 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: item.status === 0 ? (item.levelimit ? DesignRule.textColor_mainTitle : DesignRule.mainColor) : DesignRule.textColor_mainTitle,
                                                        marginBottom: 4
                                                    }} allowFontScaling={false}>折</Text>
                                            </View> : null}
                                </View>
                            </View>

                            <View style={{
                                flex: 1,
                                alignItems: "flex-start",
                                marginLeft: 10,
                                justifyContent: "space-between"
                            }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: DesignRule.textColor_mainTitle,
                                        marginRight: 10
                                    }} allowFontScaling={false}>
                                        {item.name}{item.type !== 99 ? null : <UIText value={"（可叠加使用）"} style={{
                                        fontSize: 11,
                                        color: DesignRule.textColor_instruction
                                    }}/>}</Text>
                                    {item.type === 12 ? <UIText value={"x" + item.number} style={{
                                        fontSize: 15,
                                        color: DesignRule.textColor_mainTitle
                                    }}/> : null}
                                </View>
                                <Text style={{
                                    fontSize: 11,
                                    color: DesignRule.textColor_instruction,
                                    marginTop: 6
                                }} allowFontScaling={false}>使用有效期：{item.timeStr}</Text>
                                <UIText style={{ fontSize: 11, color: DesignRule.textColor_instruction, marginTop: 6 }}
                                        value={item.limit}/>
                            </View>
                            {item.status=== 0?(item.levelimit?
                                <UIText value={'等级受限'}
                                        style={{fontSize:13,color:DesignRule.textColor_instruction,marginRight:15}}/>:null):
                                <UIText value={`${item.status===1?'已使用':(item.status===2?'已失效':'待激活')}`}
                                        style={{fontSize:13,color:DesignRule.textColor_instruction,marginRight:15}}/> }
                        </View>
                        {!item.tobeextend?<NoMoreClick style={{ height: px2dp(24), justifyContent: "center", alignItems: "center" }}
                                                       onPress={()=>this.pickUpData(item)}><Image style={{ width: 14, height: 7 }} source={itemDown}/>
                        </NoMoreClick>:null }
                    </ImageBackground>
                    {item.tobeextend ?
                        <View style={{
                            backgroundColor: item.status === 0 ?(item.levelimit? DesignRule.color_ddd:DesignRule.white ): DesignRule.color_ddd,
                            width: ScreenUtils.width - px2dp(30),
                            marginLeft:1,borderRadius:5,marginTop:-2}}>
                            <View style={{ marginTop: 10,marginLeft:10 }}>
                                <Text style={{ marginTop: 5, color: DesignRule.textColor_mainTitle }}
                                      allowFontScaling={false}>使用说明:</Text>
                                <Text style={{
                                    marginTop: 5,
                                    color: DesignRule.textColor_secondTitle,
                                    lineHeight: 25

                                }} allowFontScaling={false}>{item.remarks}</Text>
                            </View>
                            <NoMoreClick style={{ height: px2dp(24), justifyContent: "center", alignItems: "center" }}
                                         onPress={()=>this.toExtendData(item)}><Image style={{ width: 14, height: 7 }} source={itemUp}/>
                            </NoMoreClick>
                        </View> : null}
                </View>
            );
        } else {
            return (
                <View style={{ backgroundColor: DesignRule.bgColor, marginBottom: 5 }}>
                    <ImageBackground style={{
                        width: ScreenUtils.width - px2dp(30),
                        height: px2dp(94),
                        margin: 2
                    }} source={item.status == 0? (item.levelimit?usedBg : unUsedBg)  : usedBg} resizeMode='stretch'>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={styles.itemFirStyle}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {
                                        item.type === 3 || item.type === 4 || item.type === 12 ? null :
                                            <View style={{ alignSelf: "flex-end", marginBottom: 2 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: item.status === 0 ? DesignRule.mainColor : DesignRule.textColor_mainTitle,
                                                        marginBottom: 4
                                                    }} allowFontScaling={false}>￥</Text>
                                            </View>}
                                    <View>
                                        <Text style={{
                                            fontSize: item.type === 4 ? 20 : (item.value && item.value.length < 3 ? 33 : 26),
                                            color: item.status === 0 ? DesignRule.mainColor : DesignRule.textColor_mainTitle
                                        }} allowFontScaling={false}>{item.value}</Text>
                                    </View>
                                    {
                                        item.type === 3 ?
                                            <View style={{ alignSelf: "flex-end", marginBottom: 2 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: item.status === 0 ? DesignRule.mainColor : DesignRule.textColor_mainTitle,
                                                        marginBottom: 4
                                                    }} allowFontScaling={false}>折</Text>
                                            </View> : null}
                                </View>
                            </View>

                            <View style={{
                                flex: 1,
                                alignItems: "flex-start",
                                marginLeft: 10,
                                justifyContent: "center",
                                height: px2dp(94)
                            }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: DesignRule.textColor_mainTitle,
                                        marginRight: 10
                                    }} allowFontScaling={false}>
                                        {item.name}{item.type !== 99 ? null : <UIText value={"（可叠加使用）"} style={{
                                        fontSize: 11,
                                        color: DesignRule.textColor_instruction
                                    }}/>}</Text>
                                    {item.type === 12 ? <UIText value={"x" + item.number} style={{
                                        fontSize: 15,
                                        color: DesignRule.textColor_mainTitle
                                    }}/> : null}
                                </View>
                                <Text style={{
                                    fontSize: 11,
                                    color: DesignRule.textColor_instruction,
                                    marginTop: 6
                                }} allowFontScaling={false}>使用有效期：{item.timeStr}</Text>
                                <UIText style={{ fontSize: 11, color: DesignRule.textColor_instruction, marginTop: 6 }}
                                        value={item.limit}/>
                            </View>
                            {item.status=== 0?(item.levelimit?
                                <UIText value={'等级受限'}
                                        style={{fontSize:13,color:DesignRule.textColor_instruction,marginRight:15}}/>:null):
                                <UIText value={`${item.status===1?'已使用':(item.status===2?'已失效':'待激活')}`}
                                        style={{fontSize:13,color:DesignRule.textColor_instruction,marginRight:15}}/> }
                        </View>
                    </ImageBackground>
                </View>
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
                timeStr: this.fmtDate(item.startTime||0) + "-" + this.fmtDate(item.expireTime||0),
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
