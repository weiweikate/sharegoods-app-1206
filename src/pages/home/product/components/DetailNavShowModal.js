import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    Modal,
    TouchableOpacity,
    FlatList,
    Text,
    Platform,
    Image
} from 'react-native';

import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import res from '../../res';

const {
    detailShowBg,
    message,
    detail_search,
    share,
    detail_kefu
} = res.product;

const bgHeight = ScreenUtils.autoSizeWidth(410 / 2.0);
const bgWidth = 286 / 2.0;
const ImgArr = [
    { img: message, tittle: '消息', index: 0 },
    { img: detail_search, tittle: '搜索', index: 1 },
    { img: share, tittle: '分享', index: 2 },
    { img: detail_kefu, tittle: '客服', index: 3 }
];

export default class DetailNavShowModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //是否显示
            confirmCallBack: null,
            messageCount: 0
        };
    }

    show = (messageCount, confirmCallBack) => {
        this.setState({
            messageCount: messageCount,
            modalVisible: true,
            confirmCallBack: confirmCallBack
        });
    };

    close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _onPress = (item) => {
        this.setState({
            modalVisible: false
        });
        this.state.confirmCallBack && this.state.confirmCallBack(item);
    };

    _renderItem = ({ item }) => {
        return <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', height: bgHeight / ImgArr.length }}
            onPress={() => this._onPress(item)}>
            <Image source={item.img} style={{ marginLeft: 23 }}/>
            <Text style={{ color: DesignRule.textColor_mainTitle, fontSize: 15, marginLeft: 15 }}>{item.tittle}</Text>
            <View style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: 1,
                backgroundColor: DesignRule.lineColor_inColorBg
            }}/>
            {item.index === 0 && this.state.messageCount > 0 ? <View style={{
                position: 'absolute',
                top: ScreenUtils.autoSizeWidth(9),
                left: ScreenUtils.autoSizeWidth(31),
                backgroundColor: DesignRule.mainColor,
                borderRadius: 4
            }}>
                <Text style={{
                    color: DesignRule.white,
                    fontSize: 9,
                    paddingHorizontal: 4,
                    paddingVertical: 2
                }}>{this.state.messageCount > 99 ? 99 : this.state.messageCount}</Text>
            </View> : null}
        </TouchableOpacity>;
    };

    render() {
        return (
            <Modal onRequestClose={this.close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <TouchableOpacity style={{
                    flex: 1,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute'
                }} onPress={() => {
                    this.setState({
                        modalVisible: false
                    });
                }}>
                    <ImageBackground
                        resizeMode={'stretch'}
                        style={{
                            top: Platform.OS === 'ios' ? ScreenUtils.headerHeight : 44,
                            right: 18,
                            position: 'absolute', width: bgWidth, height: bgHeight
                        }}
                        source={detailShowBg}>
                        <FlatList data={ImgArr}
                                  keyExtractor={(item, index) => `${index}`}
                                  renderItem={this._renderItem}
                        />

                    </ImageBackground>
                </TouchableOpacity>
            </Modal>
        );
    }
}

