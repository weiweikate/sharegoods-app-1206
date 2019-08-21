/**
 * Created by chenweiwei on 2019/8/21.
 */
import React, { Component } from 'react';;
import {Image, View} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text, NoMoreClick } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import LinearGradient from 'react-native-linear-gradient';
import res from '../res';
import {beginChatType, QYChatTool} from '../../../utils/QYModule/QYChatTool';
import {track, trackEvent} from '../../../utils/SensorsTrack';

const icon_kefu = res.button.icon_kefu;

export default class CustomerServiceButton extends Component{

    constructor(props) {
        super(props);
    }

    jumpQYIMPage = () => {
        track(trackEvent.ClickOnlineCustomerService
            , {customerServiceModuleSource: 1});

        let params = {
            urlString: '',
            title: '平台客服',
            shopId: '',
            chatType: beginChatType.BEGIN_FROM_OTHER,
            data: {}
        };
        QYChatTool.beginQYChat(params);
    }
    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <View style={{
                    width: ScreenUtils.width,
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    zIndex: 21
                }}>
                    <NoMoreClick
                        style={{
                            height: ScreenUtils.autoSizeWidth(40),
                            borderRadius: ScreenUtils.autoSizeWidth(20),
                            overflow: 'hidden'
                        }}
                        onPress={() => this.jumpQYIMPage()}>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                        colors={['#FC5D39', '#FF0050']}
                                        style={{
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            flex: 1
                                        }}
                        >
                            <Image source={icon_kefu} style={{height: 23, width: 23}} resizeMode={'contain'}/>

                            <Text style={{
                                fontFamily: 'PingFangSC-Regular',
                                fontSize: 13,
                                color: 'white',
                                marginLeft: 4
                            }} allowFontScaling={false}>在线客服</Text>
                        </LinearGradient>
                    </NoMoreClick>
                </View>
                <Text style={{
                    fontSize: 10,
                    color: DesignRule.textColor_secondTitle,
                    marginVertical: 5
                }}>服务时间：9:00-22:00</Text>
            </View>
        )
    }
}

