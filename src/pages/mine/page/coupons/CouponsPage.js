import React from "react";
import {
    StyleSheet, View, Image, TouchableOpacity,
} from "react-native";
import BasePage from "../../../../BasePage";
import ScrollableTabView, { DefaultTabBar } from "react-native-scrollable-tab-view";
import ScreenUtils from "../../../../utils/ScreenUtils";
import MyCouponsItems from "./../../components/MyCouponsItems";
import User from "../../../../model/user";
import DesignRule from "../../../../constants/DesignRule";
import NavigatorBar from "../../../../components/pageDecorator/NavigatorBar/NavigatorBar";
import Modal from "../../../../comm/components/CommModal";
import { MRText as Text, NoMoreClick} from "../../../../components/ui";
import res from "./../../res";

const {
    // icon_arrow_up,
    // icon_red_select
} = res;
export default class CouponsPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            titleName: "优惠券",
            CONFIG: ["全部", "1元代金券", "折扣券", "抵用券", "抵价券", "满减券", "周期券"],
            selectIndex:0
        };
    }

    $navigationBarOptions = {
        title: "优惠券",
        show: true // false则隐藏导航
    };

    componentDidMount() {
        if (!User.isLogin) {
            this.gotoLoginPage();
        }
    }

    $NavBarRenderTitle = () => {
        return (
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
                this.setState({ titleName: "折扣券", modalVisible: true });
            }}>
                <Text style={{
                    fontSize: 18,
                    color: DesignRule.textColor_mainTitle,
                    backgroundColor: "transparent"
                }}>{this.state.titleName}</Text>
                <Image source={require("./../../res/homeBaseImg/mine_after_buy_icon.png")}
                       style={{ width: 20, height: 20 }} resizeMode={"contain"}/>
            </TouchableOpacity>
        );
    };

    renderModals() {
        return (
            <Modal
                visible={this.state.modalVisible}
                transparent={true}
                animationType='fade'
                onRequestClose={() => {
                }}
                style={{ flex: 1 }}
                ref="modal">
                <NoMoreClick onPress={() => {
                    this.setState({ modalVisible: false });
                }}>
                    <View style={{ marginTop: -ScreenUtils.statusBarHeight }}>
                        <NavigatorBar title={`${this.state.titleName}`} leftPressed={() => {
                            if (this.state.modalVisible) {
                                this.setState({ modalVisible: false });
                                return;
                            }
                            this.props.navigation.goBack();
                        }}/>
                        <View style={{ height: 15, backgroundColor: DesignRule.bgColor }}/>
                        <View style={{ flex: 1, alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                            <View style={{
                                width: ScreenUtils.width,
                                backgroundColor: "white",
                                flexDirection: "row",
                                flexWrap: "wrap"
                            }}>
                                {this.state.CONFIG.map((item, i) => {
                                    return (
                                        <NoMoreClick key={i} style={{
                                            width: ScreenUtils.width / 3,
                                            marginTop: 10,
                                            marginBottom: 10,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                                     activeOpacity={1}
                                                     onPress={() => this.selectCouType(item,i)}>
                                            <View style={{
                                                borderColor: DesignRule.lineColor_inWhiteBg,
                                                width: 104, height: 34,
                                                borderRadius: 5,
                                                borderWidth: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor:i === this.state.selectIndex ? DesignRule.textColor_redWarn : DesignRule.white,
                                            }}>
                                                <Text style={{
                                                    color: i === this.state.selectIndex ? DesignRule.white : DesignRule.textColor_secondTitle,
                                                    fontSize: 15
                                                }} allowFontScaling={false}>{item}</Text>
                                            </View>
                                        </NoMoreClick>
                                    );
                                })
                                }
                            </View>
                        </View>
                    </View>
                </NoMoreClick>
            </Modal>
        );
    }

    selectCouType = (item,i) => {
        if (i == 0) {
            item = "优惠券";
        }
        this.setState({
            modalVisible: false,
            titleName: item,
            selectIndex: i
        });
    };

    _render() {
        return (
            <View style={{ flex: 1, backgroundColor: DesignRule.bgColor }}>
                {this.renderModals()}
                <ScrollableTabView
                    style={styles.container}
                    renderTabBar={this._renderTabBar}
                    //进界面的时候打算进第几个
                    initialPage={0}>
                    <MyCouponsItems tabLabel={"未使用"} pageStatus={0} nav={this.props.navigation}
                                    isgiveup={this.params.fromOrder}
                                    fromOrder={this.params.fromOrder} justOne={this.params.justOne}
                                    orderParam={this.params.orderParam}
                                    giveupUse={() => {
                                        this.params.callBack("giveUp");
                                        this.$navigateBack();
                                    }}
                                    useCoupons={(data) => {
                                        this.params.callBack(data);
                                        this.$navigateBack();
                                    }}/>
                    <MyCouponsItems tabLabel={"已使用"} pageStatus={1} nav={this.props.navigation}
                                    isgiveup={false}/>
                    <MyCouponsItems tabLabel={"已失效"} pageStatus={2} nav={this.props.navigation}
                                    isgiveup={false}/>
                </ScrollableTabView>
            </View>
        );
    }

    _renderTabBar = () => {
        return <DefaultTabBar
            backgroundColor={"white"}
            activeTextColor={DesignRule.mainColor}
            inactiveTextColor={DesignRule.textColor_instruction}
            textStyle={styles.tabBarText}
            underlineStyle={styles.tabBarUnderline}
            style={styles.tabBar}
            tabStyle={styles.tab}
        />;
    };

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: ScreenUtils.safeBottom
    },
    tabBar: {
        width: ScreenUtils.width,
        height: 48,
        borderWidth: 0.5,
        borderColor: DesignRule.lineColor_inWhiteBg
    },
    tab: {
        paddingBottom: 0
    },
    tabBarText: {
        fontSize: 15
    },
    tabBarUnderline: {
        width: 48,
        height: 2,
        marginHorizontal: (ScreenUtils.width - 48 * 3) / 6,
        backgroundColor: DesignRule.mainColor,
        borderRadius: 1
    }
});
