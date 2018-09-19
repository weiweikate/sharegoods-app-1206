import React from "react";
import {
    View,
    StyleSheet,
    SectionList,
    Modal,
    Image,
    TouchableWithoutFeedback
} from "react-native";

import BasePage from "../../../BasePage";
import DetailHeaderView from "./components/DetailHeaderView";
import DetailSegmentView from "./components/DetailSegmentView";
import DetailBottomView from "./components/DetailBottomView";
import SelectionPage from "./SelectionPage";
import HomeAPI from "../api/HomeAPI";
import ScreenUtils from "../../../utils/ScreenUtils";
import xiangqing_btn_return_nor from "./res/xiangqing_btn_return_nor.png";
import xiangqing_btn_more_nor from "./res/xiangqing_btn_more_nor.png";

export default class ProductDetailPage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: {}
        };
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this._productList();
    }

    //数据
    _productList = () => {
        this.$loadingShow();
        HomeAPI.getProductDetail({
            id: this.params.productId
        }).then((data) => {
            this.$loadingDismiss();
            this.setState({
                data: data.data
            });
        }).catch((error) => {
            this.$loadingDismiss();
            this.$toastShow(error.msg);
        });
    };

    //segment 详情0 参数1 选项
    _segmentViewOnPressAtIndex = (index) => {

    };

    //去购物车
    _bottomViewGoGWC = () => {
        this.$navigate("shopCart/ShopCart");
    };


    //去选规格
    _chooseSpecMap = () => {
        this.setState({
            modalVisible: true
        });
    };

    //选择规格确认
    _selectionViewConfirm = (amount, priceId) => {
        this.$loadingShow();
        HomeAPI.addItem({
            "amount": amount,
            "priceId": priceId,
            "productId": this.state.data.product.id
        }).then((data) => {
            this.$loadingDismiss();
        }).catch((error) => {
            this.$loadingDismiss();
            this.$toastShow(error.msg);
        });
    };

    //选择规格关闭
    _selectionViewClose = () => {
        this.setState({
            modalVisible: false
        });
    };


    _renderListHeader = () => {
        return <DetailHeaderView data={this.state.data}/>;
    };

    _renderSectionHeader = () => {
        return <DetailSegmentView segmentViewOnPressAtIndex={this._segmentViewOnPressAtIndex}/>;
    };

    _renderItem = ({}) => {
        return <View style={{ height: 200, backgroundColor: "#EEEEEE" }}></View>;
    };

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        console.log(Y);
        if (Y < 100) {
            this.st = Y * 0.01;
        } else {
            this.st = 1;
        }
        this._refHeader.setNativeProps({
            opacity: this.st
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                <View ref={(e) => this._refHeader = e} style={styles.opacityView}/>
                <View style={styles.transparentView}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={xiangqing_btn_return_nor}/>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <Image source={xiangqing_btn_more_nor}/>
                    </TouchableWithoutFeedback>
                </View>

                <SectionList onScroll={this._onScroll}
                             ListHeaderComponent={this._renderListHeader}
                             renderSectionHeader={this._renderSectionHeader}
                             renderItem={this._renderItem}
                             keyExtractor={(item, index) => `${index}`}
                             showsVerticalScrollIndicator={false}
                             sections={[{ data: [{}] }]}
                             scrollEventThrottle={10}/>
                <DetailBottomView bottomViewGoGWC={this._bottomViewGoGWC} bottomViewBuy={this._chooseSpecMap}
                                  bottomViewAddToGWC={this._chooseSpecMap}/>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}>
                    <SelectionPage selectionViewConfirm={this._selectionViewConfirm}
                                   selectionViewClose={this._selectionViewClose} data={this.state.data}/>
                </Modal>

            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    opacityView: {
        height: ScreenUtils.headerHeight,
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        opacity: 0
    },
    transparentView: {
        backgroundColor: "transparent",
        position: "absolute",
        top: ScreenUtils.statusBarHeight,
        left: 16,
        right: 16,
        zIndex: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }

});

