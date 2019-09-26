/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/9/20.
 *
 */

'use strict';

import React from 'react';
import { routePush } from '../../../navigation/RouterMap';

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';

import {
    MRText
} from '../../../components/ui';
import HomeModalManager from '../manager/HomeModalManager';
import Modal from '../../../comm/components/CommModal';

import ScreenUtils from '../../../utils/ScreenUtils';

import { observer } from 'mobx-react';
import DesignRule from '../../../constants/DesignRule';
import LinearGradient from 'react-native-linear-gradient';

@observer
export default class PrivacyModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    onPress(){
        routePush('HtmlPage', { uri: '/static/protocol/privacy.html' });
    }


    renderContent() {
        return (
            <View style={styles.modal}>
                <View  style={styles.bg}>
                    <MRText style={styles.title}>{'隐私保护提示'}</MRText>
                    <MRText style={{ fontSize: 13,
                        color: '#333333',}}>
                        {"      欢迎使用“秀购”！我们非常重视您的个人信息和隐私保护。在您使用“秀购”服务前，请仔细阅读"}
                        <TouchableWithoutFeedback onPress={this.onPress}>
                        <MRText style={{ fontSize: 13,
                            color: DesignRule.mainColor,}}>
                            {"《秀购隐私政策》"}
                        </MRText>
                        </TouchableWithoutFeedback>
                        <MRText style={{ fontSize: 13,
                            color:'#333333',}}>
                            {"，我们将严格经您同意的各项条款使用您的个人信息，以便为您提供更好的服务。\n"}
                        </MRText>
                        <MRText style={{ fontSize: 13,
                            color:'#666666',}}>
                            {"      如您同意此政策，请点击“同意”并开始使用我们的产品和服务，我们尽全力保护您的个人信息安全。\n" +
                            "       请放心，秀购坚决保障您的隐私信息安全，\n您的信息仅在您授权范围内使用。\n" +
                            "       如果您确定无法认同此政策，可点击“不同意“并退出应用。"}
                        </MRText>
                    </MRText>
                    <View style={{marginTop:  ScreenUtils.autoSizeWidth(30), flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={() => {HomeModalManager.closePrivacyModal(false)}}>
                            <View style={{width: ScreenUtils.autoSizeWidth(110),
                                height:  ScreenUtils.autoSizeWidth(34),
                                borderRadius:  ScreenUtils.autoSizeWidth(17),
                                borderWidth: 1,
                                borderColor: '#999999',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight:  ScreenUtils.autoSizeWidth(20)
                            }}>
                                <MRText style={{fontSize:  ScreenUtils.autoSizeWidth(14), color: '#999999'}}>不同意并退出</MRText>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {HomeModalManager.closePrivacyModal(true)}}>
                            <LinearGradient style={{width: ScreenUtils.autoSizeWidth(110),
                                height:  ScreenUtils.autoSizeWidth(34),
                                borderRadius:  ScreenUtils.autoSizeWidth(17),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                            colors={['#FC5D39', '#FF0050']}
                            >
                                <MRText style={{fontSize:  ScreenUtils.autoSizeWidth(16), color: 'white'}}>同意</MRText>
                            </LinearGradient>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    }


    render() {
        return (
            <Modal
                animationType='slide'
                ref={(ref) => {
                    this.modal = ref;
                }}
                onRequestClose={() => {
                    HomeModalManager.closePrize();
                }}
                visible={ HomeModalManager.isShowPrivacyModal && HomeModalManager.isHome}>
                {this.renderContent()}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center'

    },
    bg: {
        width: ScreenUtils.autoSizeWidth(310),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        padding: ScreenUtils.autoSizeWidth(15),
    },
    btn: {
        height: ScreenUtils.autoSizeWidth(40),
        width: ScreenUtils.autoSizeWidth(180),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: ScreenUtils.autoSizeWidth(30)
    },
    btnText: {
        fontSize: ScreenUtils.autoSizeWidth(16),
        color: '#9B5A19'
    },
    title: {
        fontSize: ScreenUtils.autoSizeWidth(16),
        color: '#333333',
        marginTop: ScreenUtils.autoSizeWidth(5),
        textAlign: 'center'
    }
});
