import React, { Component } from 'react';
import {
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import CommModal from 'CommModal';
import DesignRule from 'DesignRule';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';

const topicShow = res.topicShow;
const topicShowClose = res.topicShowClose;

export default class TopicDetailShowModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,//是否显示,
            tittle: '',
            name: '',
            subName: '',
            content: ''
        };
    }

    show = (tittle, name, subName, content) => {
        this.setState({
            modalVisible: true,
            tittle, name, subName,
            content
        });

        this.modal && this.modal.open();
    };
    _onPress = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        return (
            <CommModal onRequestClose={this.close}
                       visible={this.state.modalVisible}
                       ref={(ref) => {
                           this.modal = ref;
                       }}
                       transparent={true}
            >
                <View style={{
                    backgroundColor: 'rgba(0,0,0,0.5)', top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    alignItems: 'center'
                }}>
                    <View style={{ top: ScreenUtils.px2dp(115) }}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', height: 40 }}
                            onPress={this._onPress}>
                            <Image source={topicShowClose}/>
                        </TouchableOpacity>
                        <View style={{
                            backgroundColor: 'white',
                            width: ScreenUtils.px2dp(290),
                            height: ScreenUtils.px2dp(360),
                            borderRadius: ScreenUtils.px2dp(5),
                            alignSelf: 'center'
                        }}>
                            <ImageBackground source={topicShow} style={{
                                width: ScreenUtils.px2dp(290),
                                height: ScreenUtils.px2dp(71),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} resizeMode={'stretch'}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: ScreenUtils.px2dp(18)
                                }} allowFontScaling={false}>{this.state.tittle}</Text>
                            </ImageBackground>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                {this.state.name ? <Text style={{
                                    marginTop: ScreenUtils.px2dp(31),
                                    color: DesignRule.textColor_mainTitle,
                                    fontSize: ScreenUtils.px2dp(15), textAlign: 'center'
                                }} allowFontScaling={false}>{`${this.state.name || ''}`}</Text> : null}

                                <Text style={{
                                    marginTop: ScreenUtils.px2dp(25),
                                    color: DesignRule.textColor_secondTitle,
                                    fontSize: ScreenUtils.px2dp(14),
                                    paddingHorizontal: ScreenUtils.px2dp(32)
                                }} allowFontScaling={false}>{`${this.state.content || ''}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </CommModal>
        );
    }
}

