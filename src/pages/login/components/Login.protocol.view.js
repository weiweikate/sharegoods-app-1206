import React, { Component } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import apiEnvironment from '../../../api/ApiEnvironment';
import PropTypes from 'prop-types';

const { px2dp } = ScreenUtils;
const {
    red_button_s,
    red_button_u
} = res;

const ProtocolViewStyle = StyleSheet.create({
    bgContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: px2dp(15),
        height: px2dp(21),
        marginBottom: px2dp(12),
        width: ScreenUtils.width
    },
    selectImageStyle: { width: px2dp(12), height: px2dp(12), marginRight: px2dp(5) },
    readTextStyle: { fontSize: 11, color: DesignRule.textColor_secondTitle },
    protocolClickTextStyle: { color: DesignRule.mainColor, fontSize: px2dp(11), height: px2dp(15) }
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
        const htmlUrl = apiEnvironment.getCurrentH5Url() + '/static/protocol/service.html';
        return (
            <View style={
                ProtocolViewStyle.bgContent
            }>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
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
                    登录代表你已同意
                </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    textClick && textClick(htmlUrl);
                }}>
                    <Text style={ProtocolViewStyle.protocolClickTextStyle}>
                        《秀购用户协议》
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

