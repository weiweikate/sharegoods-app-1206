import React, { Component } from "react";
import PropTypes from "prop-types";

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback
} from "react-native";
import ScreenUtils from "../../../../utils/ScreenUtils";
import ViewPager from "../../../../components/ui/ViewPager";
import ProductActivityView from "./ProductActivityView";
import user from "../../../../model/user";

const { px2dp } = ScreenUtils;

/**
 * 商品详情头部view
 */

export default class DetailHeaderView extends Component {


    static propTypes = {
        data: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            swiperShow: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 100);
    }

    getImageList=(data)=>{
        if(data){
            return data.map((item,index)=>{
                return item.originalImg;
            })
        }else {
            return null;
        }
    }

    _renderViewPageItem = (item, index) => {
        const { originalImg } = item;
        let imgList = this.getImageList(this.props.data.productImgList);
        return (
            <TouchableWithoutFeedback onPress={() => {
                const params = { imageUrls : imgList ,index:index};
                const { navigation } = this.props;
                navigation && navigation.navigate('home/product/CheckBigImagesView', params);
            }}>
                <Image source={{ uri: originalImg }}
                       style={{ height: ScreenUtils.autoSizeWidth(377), width: ScreenUtils.width }}
                       resizeMode="cover"
                />
            </TouchableWithoutFeedback>
        );
    };

    _renderPagination = (index, total) => <View style={styles.indexView}>
        <Text style={styles.text}>{index + 1} / {total}</Text>
    </View>;

    render() {
        const { activityType } = this.props;
        const { productImgList = [{}], freight = 0, monthSaleTotal = 0, price = 0, originalPrice = 0, product = {} ,priceType=''} = this.props.data || {};
        const { name = "", afterSaleServiceDays } = product;
        return (
            <View>
                {productImgList.length > 0 && this.state.swiperShow ? <ViewPager swiperShow={true}
                                                                                 loop={false}
                                                                                 height={ScreenUtils.autoSizeWidth(377)}
                                                                                 arrayData={productImgList}
                                                                                 renderItem={(item, index) => this._renderViewPageItem(item, index)}
                                                                                 renderPagination={this._renderPagination}/> :
                    <View style={{ height: ScreenUtils.autoSizeWidth(377), width: ScreenUtils.width }}/>}
                {activityType === 1 || activityType === 2 ?
                    <ProductActivityView activityType={activityType}
                                         ref={(e) => {
                                             this.ActivityView = e;
                                         }}
                                         activityData={this.props.activityData}
                                         productActivityViewAction={this.props.productActivityViewAction}/> : null}
                <View style={{ backgroundColor: "white" }}>
                    <View style={{ marginLeft: 16, width: ScreenUtils.width - 32 }}>
                        <Text style={{
                            marginTop: 14,
                            color: "#222222",
                            fontSize: 15
                        }}>{`${name}`}</Text>
                        <View style={{ flexDirection: "row", marginTop: 21, alignItems: "center" }}>
                            <Text style={{ color: "#D51243", fontSize: 18 }}>{`￥${price}起`}</Text>
                            <Text style={{
                                marginLeft: 5,
                                color: "#BBBBBB",
                                fontSize: 10,
                                textDecorationLine: "line-through"
                            }}>{`￥${originalPrice}`}</Text>
                            <Text style={{
                                marginLeft: 5,
                                backgroundColor: "red",
                                color: "#FFFFFF",
                                fontSize: 10, paddingHorizontal: 5
                            }}>{priceType === 3 ? "拼店价" : priceType === 2 ? `${user.levelName}价` : "原价"}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 18, marginBottom: 14, alignItems: "center" }}>
                            <Text
                                style={{
                                    color: "#BBBBBB",
                                    fontSize: 11
                                }}>快递：{freight === 0 ? "包邮" : `${freight}元`}</Text>
                            <Text style={{
                                color: "#666666",
                                fontSize: 13,
                                marginLeft: ScreenUtils.autoSizeWidth(108)
                            }}>{`月销售${monthSaleTotal}笔`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: "white", marginTop: 10, marginBottom: 12 }}>
                    <View style={{
                        flexDirection: "row",
                        marginLeft: 16,
                        width: ScreenUtils.width - 32,
                        marginVertical: 13,
                        alignItems: "center"
                    }}>
                        <Text style={{ color: "#D51243", fontSize: 13 }}>服务</Text>
                        <Text style={{
                            marginLeft: 11,
                            color: "#666666",
                            fontSize: 13
                        }}>{`正品保证·急速发货 ${afterSaleServiceDays}天无理由退换`}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    indexView: {
        position: "absolute",
        height: px2dp(20),
        borderRadius: px2dp(10),
        right: px2dp(14),
        bottom: px2dp(20),
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: "#fff",
        fontSize: px2dp(10),
        paddingHorizontal: 8
    }
});
