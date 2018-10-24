import React, { Component } from 'react';
import {
    View,
    Image,
    ImageBackground,
    Modal,
    TouchableOpacity,
    Text
} from 'react-native';
import topicShow from '../res/topicShow.png';
import topicShowClose from '../res/topicShowClose.png';
import ScreenUtils from '../../../utils/ScreenUtils';

export default class TopicDetailShowModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,//是否显示,
            tittle: '',
            content: ''
        };
    }

    show = (tittle, content) => {
        this.setState({
            modalVisible: true,
            tittle,
            content
        });
    };
    _onPress = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        return (
            <Modal onRequestClose={this.close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.5)', top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        top: ScreenUtils.px2dp(105),
                        width: ScreenUtils.px2dp(290),
                        height: ScreenUtils.px2dp(360),
                        alignSelf: 'center',
                        position: 'absolute',
                        alignItems: 'center'
                    }}>
                        <ImageBackground source={topicShow} style={{
                            width: ScreenUtils.px2dp(290),
                            height: ScreenUtils.px2dp(71),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{ color: 'white', fontSize: ScreenUtils.px2dp(18) }}>{this.state.tittle}</Text>
                        </ImageBackground>
                        <Text style={{
                            marginTop: ScreenUtils.px2dp(55.5),
                            color: '#000000',
                            fontSize: ScreenUtils.px2dp(15)
                        }}>XXX升级礼包为定制产品</Text>
                        <Text style={{
                            marginTop: ScreenUtils.px2dp(25),
                            color: '#666666',
                            fontSize: ScreenUtils.px2dp(14),
                            paddingHorizontal: ScreenUtils.px2dp(32)
                        }}>{`购买后即可升级成为V2级用户，可享 受V2用户\n\n消费权限，该礼包产品不可退换货， 如有产品质量问题，可联系客服进行 申诉`}</Text>

                        <TouchableOpacity style={{
                            top: 0,
                            right: 0,
                            position: 'absolute'
                        }} onPress={this._onPress}>
                            <Image source={topicShowClose}/>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        );
    }
}

