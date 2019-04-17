import React, { Component } from 'react';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Platform,
    Image
} from 'react-native';
import { MRText as Text } from '../../../components/ui/index';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res/product';
import Modal from '../../../comm/components/CommModal';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import QYChatModel from '../../../utils/QYModule/QYChatModel';

const {
    detailShowBg,
    message,
    detail_search,
    share,
    detail_kefu,
    product_icon_home
} = res;

const bgHeight = ScreenUtils.autoSizeWidth(410 / 2.0);
const bgWidth = 286 / 2.0;

@observer
export default class DetailNavShowModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //是否显示
            confirmCallBack: null,
            messageCount: 0,
            showType: 1//1客服,2首页
        };
    }

    show = (messageCount, confirmCallBack, showType = 1) => {
        this.setState({
            messageCount: messageCount,
            modalVisible: true,
            confirmCallBack: confirmCallBack,
            showType: showType
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
        if (item.type === 3) {//客服埋点
            track(trackEvent.ClickOnlineCustomerService, { customerServiceModuleSource: 2 });
        }
        this.state.confirmCallBack && this.state.confirmCallBack(item);
    };

    _separator = () => {
        return <View
            style={{ height: 0.5, marginLeft: 6, marginRight: 6, backgroundColor: DesignRule.lineColor_inWhiteBg }}/>;
    };

    getImgArr = () => {
        let imgArr;
        if (this.state.showType === 2) {
            imgArr = [
                { img: message, tittle: '消息', type: 0 },
                { img: product_icon_home, tittle: '首页', type: 4 },
                { img: detail_search, tittle: '搜索', type: 1 },
                { img: share, tittle: '分享', type: 2 }
            ];
        } else {
            imgArr = [
                { img: message, tittle: '消息', type: 0 },
                { img: detail_search, tittle: '搜索', type: 1 },
                { img: share, tittle: '分享', type: 2 },
                { img: detail_kefu, tittle: '客服', type: 3 }
            ];
        }
        return imgArr;
    };

    _renderItem = ({ item }) => {
        const messageCount = this.state.messageCount + QYChatModel.unreadCount;
        return <TouchableOpacity
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: (bgHeight - 20) / this.getImgArr().length,
                marginTop: item.type === 0 ? 16 : 0
            }}
            onPress={() => this._onPress(item)}>
            <Image source={item.img} style={{ marginLeft: 23 }}/>
            <Text style={{ color: DesignRule.textColor_mainTitle, fontSize: 15, marginLeft: 15 }}
                  allowFontScaling={false}>{item.tittle}</Text>
            {item.type === 0 && messageCount > 0 ? <View style={{
                position: 'absolute', justifyContent: 'center', alignItems: 'center',
                top: ScreenUtils.autoSizeWidth(9),
                left: 23 + 12,
                backgroundColor: DesignRule.mainColor,
                borderRadius: 8, width: 16, height: 16
            }}>
                <Text style={{
                    color: DesignRule.white,
                    fontSize: 9
                }} allowFontScaling={false}>{messageCount > 99 ? 99 : messageCount}</Text>
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
                }} activeOpacity={1}>
                    <ImageBackground
                        resizeMode={'stretch'}
                        style={{
                            top: Platform.OS === 'ios' ? ScreenUtils.headerHeight : 44 + ScreenUtils.statusBarHeight,
                            right: 12,
                            position: 'absolute', width: bgWidth, height: bgHeight
                        }}
                        source={detailShowBg}>
                        <FlatList data={this.getImgArr()}
                                  keyExtractor={(item, index) => `${index}`}
                                  renderItem={this._renderItem}
                                  ItemSeparatorComponent={this._separator}
                                  showsVerticalScrollIndicator={false}
                        />

                    </ImageBackground>
                </TouchableOpacity>
            </Modal>
        );
    }
}

