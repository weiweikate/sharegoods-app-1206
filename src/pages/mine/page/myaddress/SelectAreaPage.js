import BasePage from "../../../../BasePage";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import UIText from "../../../../components/ui/UIText";
import arrow_right from "../../../mine/res/customerservice/icon_06-03.png";
import MineAPI from "../../api/MineApi";
import bridge from "../../../../utils/bridge";

export default class SelectAreaPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: "选择地区"
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            tag: props.navigation.state.params.tag,
            fatherCode: props.navigation.state.params.fatherCode
        };
    }

    componentDidMount() {
        // 拿数据
        this.getArea();
    }

    getArea = () => {
        MineAPI.getAreaList({ fatherCode: this.state.fatherCode }).then((response) => {
            this.setState({
                datas: response.data || []
            });
        }).catch(data => {
            bridge.$toast(data.msg);
        });
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={(flatList) => this._flatList = flatList}
                    ItemSeparatorComponent={this._separator}
                    renderItem={this._renderItem}
                    extraData={this.state}
                    onRefresh={this.refreshing}
                    refreshing={false}
                    keyExtractor={(item) => item.id + ""}
                    showsVerticalScrollIndicator={false}
                    getItemLayout={(data, index) => (
                        //行高于分割线高，优化
                        { length: 48, offset: (48 + 0.5) * index, index }
                    )}
                    data={this.state.datas} />
            </View>
        );
    }

    _renderItem = (item) => {
        return <TouchableOpacity style={styles.container} onPress={() => this._onItemClick(item.item)}>
            <UIText value={item.item.name} style={styles.blackText}/>
            <Image source={arrow_right} style={{ width: 12, height: 20, marginRight: 18 }} resizeMode={"contain"}/>
        </TouchableOpacity>;
    };

    _separator = () => {
        return <View style={{ height: 0.5, backgroundColor: "#EEEEEE" }}/>;
    };

    _onItemClick = (item) => {
        const { setArea } = this.props.navigation.state.params || {};
        if (this.state.tag === "province") {
            // 跳转到市级
            this.$navigate("mine/address/SelectAreaPage", {
                setArea: setArea,
                tag: "city",
                provinceCode: item.code,
                provinceName: item.name,
                fatherCode: item.code
            });
        } else if (this.state.tag === "city") {
            // 跳转到区级
            this.$navigate("mine/address/SelectAreaPage", {
                setArea: setArea,
                tag: "area",
                provinceCode: this.props.navigation.state.params.provinceCode,
                provinceName: this.props.navigation.state.params.provinceName,
                cityCode: item.code,
                cityName: item.name,
                fatherCode: item.code
            });
        } else if (this.state.tag === "area") {
            // 回退并刷新
            this.$navigateBack(-3);
            const { provinceCode, provinceName, cityCode, cityName } = this.props.navigation.state.params || {};
            let areaText = provinceName + cityName + item.name;
            setArea && setArea(provinceCode, provinceName, cityCode, cityName, item.code, item.name, areaText);
        }
    };
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        height: 48
    },
    blackText: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 15,
        color: "#222222",
        marginLeft: 15,
        flex: 1
    }
});
