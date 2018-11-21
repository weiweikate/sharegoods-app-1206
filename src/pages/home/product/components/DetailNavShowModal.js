import React, { Component } from 'react';
import {
    View,
    Image,
    ImageBackground,
    Modal,
    TouchableOpacity,
    FlatList,
    Text,
    Platform
} from 'react-native';

import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import res from '../../res';

const {
    detailShowBg,
    message,
    home,
    share
} = res.product;

export default class DetailNavShowModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //是否显示
            confirmCallBack: null
        };
    }

    show = (confirmCallBack) => {
        this.setState({
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
        return <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', height: 278 / 2.0 / 3.0 }}
                                 onPress={() => this._onPress(item)}>
            <Image source={item.img} style={{ marginLeft: 17 }}/>
            <Text style={{ color: DesignRule.textColor_mainTitle, fontSize: 13, marginLeft: 15 }}>{item.tittle}</Text>
            <View style={{
                height: 0.5,
                backgroundColor: DesignRule.lineColor_inColorBg,
                bottom: 0,
                right: 0,
                position: 'absolute',
                width: 187 / 2.0
            }}/>
        </TouchableOpacity>;
    };

    render() {
        let ImgArr = [{ img: message, tittle: '消息', index: 0 }, { img: home, tittle: '首页', index: 1 }, {
            img: share,
            tittle: '分享',
            index: 2
        }];
        return (
            <Modal onRequestClose={this.close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <TouchableOpacity style={{
                    flex: 1, backgroundColor: 'transport',
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
                        style={{
                            top: Platform.OS === 'ios' ? ScreenUtils.headerHeight : 44,
                            right: 18,
                            position: 'absolute', width: 286 / 2.0, height: 278 / 2.0
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

