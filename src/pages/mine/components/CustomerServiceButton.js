/**
 * Created by chenweiwei on 2019/8/21.
 */
import React, { Component } from 'react';
import {Image, View} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { MRText as Text, NoMoreClick } from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import {beginChatType, QYChatTool} from '../../../utils/QYModule/QYChatTool';
import {track, trackEvent} from '../../../utils/SensorsTrack';

const icon_kefu_2 = res.helperAndCustomerService.icon_kefu_2;

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
                    paddingHorizontal: 26,
                    zIndex: 21
                }}>
                    <NoMoreClick
                        style={{
                            height: ScreenUtils.autoSizeWidth(40),
                            borderRadius: ScreenUtils.autoSizeWidth(20),
                            overflow: 'hidden',
                            borderWidth:ScreenUtils.autoSizeWidth(0.5),
                            borderColor:"#CCCCCC",
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom:ScreenUtils.autoSizeWidth(5),
                        }}
                        onPress={() => this.jumpQYIMPage()}>
                        <Image source={icon_kefu_2} style={{height: 23, width: 23}} resizeMode={'contain'}/>

                        <Text style={{
                            fontSize: 13,
                            color: DesignRule.textColor_instruction,
                            marginLeft: 4
                        }} allowFontScaling={false}>平台客服</Text>
                    </NoMoreClick>
                </View>
                <Text style={{
                    fontSize: 10,
                    color: DesignRule.textColor_instruction,
                    marginVertical: 5
                }}>服务时间：9:00-22:00</Text>
            </View>
        )
    }
}

