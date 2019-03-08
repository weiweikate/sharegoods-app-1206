import React, { Component } from "react";
// import { observer } from "mobx-react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text
} from "react-native";
import ScreenUtils from "../../../utils/ScreenUtils";
import DesignRule from "../../../constants/DesignRule";
import res from "../res";
import apiEnvironment from "../../../api/ApiEnvironment";
import PropTypes from "prop-types";

const { px2dp } = ScreenUtils;
const {
    red_button_s,
    red_button_u
} = res;

const ProtocolViewStyle = StyleSheet.create({
    bgContent: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: px2dp(20),
        height: px2dp(50),
        width: ScreenUtils.width,
    },
    selectImageStyle: { width: px2dp(11), height: px2dp(11), marginRight: px2dp(5) },
    readTextStyle: { fontSize: 11, color: DesignRule.textColor_secondTitle },
    protocolClickTextStyle: { color: DesignRule.mainColor, fontSize: 11 }
});
export default class ProtocolView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelect: true
        };
    }

    render() {
        const { selectImageClick, textClick } = this.props;
        const htmlUrl = apiEnvironment.getCurrentH5Url() + "/static/protocol/service.html";
        return (
            <View style={
                ProtocolViewStyle.bgContent
            }>
                <TouchableOpacity onPress={() => {
                    selectImageClick && selectImageClick(!this.state.isSelect);
                    this.setState({
                        isSelect: !this.state.isSelect
                    });
                }}>
                    <Image
                        source={this.state.isSelect ? red_button_s : red_button_u}
                        style={ProtocolViewStyle.selectImageStyle}/>
                </TouchableOpacity>
                <Text style={ProtocolViewStyle.readTextStyle}>
                    阅读并已接受
                </Text>
                <TouchableOpacity onPress={() => {
                    textClick && textClick(htmlUrl);
                }}>
                    <Text style={ProtocolViewStyle.protocolClickTextStyle}>
                        《用户协议》
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

ProtocolView.propTypes = {
    selectImageClick: PropTypes.func,
    textClick: PropTypes.func
};

