/**
 * @author xzm
 * @date 2019/3/11
 */

'use strict';

import React,{PureComponent} from 'react';

import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import EmptyUtils from '../../utils/EmptyUtils';
import CommModal from '../../comm/components/CommModal';
import { MRText as Text } from '../../components/ui';
import res from './res';
const { px2dp } = ScreenUtils;

const closeImg = res.button.cancel_white_circle;
const home_notice_bg = res.home_notice_bg;

import XQSwiper from '../../components/ui/XGSwiper';
import DesignRule from '../../constants/DesignRule';

export default class HomeMessageModal extends PureComponent {
    state = {
        messageIndex : 0
    }
    constructor(props){
        super(props);
    }

    messageIndexRender() {
        if (EmptyUtils.isEmptyArr(this.state.messageData)) {
            return null;
        }
        let indexs = [];
        for (let i = 0; i < this.state.messageData.length; i++) {
            let view = i === this.state.messageIndex ?
                <View style={[styles.messageIndexStyle, { backgroundColor: '#FF427D' }]}/> :
                <View style={[styles.messageIndexStyle, { backgroundColor: '#f4d7e4' }]}/>;
            indexs.push(view);
        }
        return (
            <View style={{
                flexDirection: 'row',
                width: px2dp(12 * this.state.messageData.length),
                justifyContent: this.state.messageData.length === 1 ? 'center' : 'space-between',
                marginBottom: px2dp(12),
                height: 12,
                alignSelf: 'center'
            }}>
                {indexs}
            </View>
        );
    }

    messageRender(item, index) {
        return (
            <View key={'message'+index} onStartShouldSetResponder={() => true}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ showsVerticalScrollIndicator: false }}>
                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: DesignRule.fontSize_secondTitle,
                        alignSelf: 'center'
                    }}>
                        {item.title}
                    </Text>
                    <Text style={{
                        width: px2dp(230),
                        color: DesignRule.textColor_secondTitle,
                        fontSize: DesignRule.fontSize_24,
                        marginTop: 14,
                        marginBottom: 10,
                        height: 500
                    }}>
                        {item.content}
                    </Text>
                </ScrollView>
            </View>
        );
    }


    render(){
        return (
            <CommModal ref={(ref) => {
                this.messageModal = ref;
            }}
                   onRequestClose={this.props.onRequestClose}
                   visible={this.props.showMessage}>
                <View style={{ flex: 1, width: ScreenUtils.width, alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={this.props.onRequestClose}>
                        <Image source={closeImg} style={styles.messageCloseStyle}/>
                    </TouchableWithoutFeedback>

                    <ImageBackground source={home_notice_bg} style={styles.messageBgStyle}>
                        <XQSwiper
                            style={{
                                alignSelf: 'center',
                                marginTop: px2dp(145),
                                width: px2dp(230),
                                height: px2dp(211)
                            }}
                            height={px2dp(230)} width={px2dp(230)} renderRow={this.messageRender}
                            dataSource={EmptyUtils.isEmptyArr(this.props.messageData) ? [] : this.props.messageData}
                            loop={false}
                            onDidChange={(item, index) => {
                                this.setState({
                                    messageIndex: index
                                });
                            }}
                        />
                        <View style={{ flex: 1 }}/>
                        {this.messageIndexRender()}
                    </ImageBackground>
                </View>
            </CommModal>
        );
    }
}
const styles = StyleSheet.create({
    messageCloseStyle: {
        width: px2dp(24),
        height: px2dp(24),
        marginTop: px2dp(100),
        alignSelf: 'flex-end',
        marginRight: ((ScreenUtils.width) - px2dp(300)) / 2
    },
    messageBgStyle: {
        width: px2dp(295),
        height: px2dp(390),
        marginTop: px2dp(20)
    },
    messageIndexStyle: {
        width: px2dp(10),
        height: px2dp(10),
        borderRadius: px2dp(5)
    },
})
