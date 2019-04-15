/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/10/19.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';

import {
    UIText,
    UIImage
} from '../../../components/ui';
import ShareTaskAnimation from './ShareTaskAnimation';
import res from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
const cancel = res.button.cancel_white_circle;
const fail = res.renwu_icon_yihan_nor;
const success = res.renwu_icon_gongxi_nor;

const autoSizeWidth = ScreenUtils.autoSizeWidth;

export default class ShareTaskResultAlert extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
    }

    _bind() {
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.shareModal && this.shareModal.open();
    }

    close() {
        this.shareModal && this.shareModal.close();
    }

    componentDidMount() {
    }

    render() {
        return (
            <ShareTaskAnimation ref={(ref) => this.shareModal = ref}
                                contentStyle={{ marginTop: -50 }}
            >
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={this.close}>
                        <UIImage source={cancel} style={styles.image}/>
                    </TouchableWithoutFeedback>
                    <View style={styles.content}>
                        {
                            this.props.success ? (
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <UIText value={'获得现金奖励'} style={styles.title}/>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-end',
                                            marginTop: 5,
                                            width: autoSizeWidth(230)
                                        }}>
                                            <View style={{ flex: 1 }}/>
                                            <UIText value={'¥'} style={{
                                                color: '#FF1A54',
                                                fontSize: autoSizeWidth(14),
                                                marginBottom: 3
                                            }}/>
                                            <UIText value={this.props.money}
                                                    style={{ color: '#FF1A54', fontSize: autoSizeWidth(34) }}/>
                                            <View style={{ flex: 1 }}>
                                                <UIText value={'+' + this.props.shareValue + '秀豆'}
                                                        style={{
                                                            color: '#888888',
                                                            fontSize: autoSizeWidth(11),
                                                            marginBottom: 3,
                                                            marginLeft: 5
                                                        }}/>
                                            </View>
                                        </View>
                                        <TouchableWithoutFeedback onPress={() => {
                                            this.props.onPress && this.props.onPress();
                                            this.close();
                                        }}>
                                            <View style={styles.btn}>
                                                <UIText value={'查看账户'}
                                                        style={{ color: 'white', fontSize: autoSizeWidth(14) }}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <UIText value={'现金奖励已存入\"现金账户 \"'} style={styles.detail}/>
                                    </View>
                                ) :
                                <UIText value={'没有任何秀友帮你激活～\n下次再接再厉'}
                                        style={{
                                            fontSize: autoSizeWidth(11),
                                            color: '#666666',
                                            marginTop: autoSizeWidth(170),
                                            textAlign: 'center'
                                        }}
                                />

                        }
                    </View>
                    <UIImage source={this.props.success ? success : fail} style={styles.contentImage}/>
                </View>
            </ShareTaskAnimation>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: autoSizeWidth(230 + 60),
        height: autoSizeWidth(270 + 20 + 30),
        alignItems: 'center'
    },
    content: {
        width: autoSizeWidth(230),
        height: autoSizeWidth(270),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        overflow: 'hidden'
    },
    image: {
        alignSelf: 'flex-end',
        height: autoSizeWidth(30),
        width: autoSizeWidth(30),
        marginBottom: autoSizeWidth(20)
    },
    title: {
        color: DesignRule.textColor_mainTitle,
        fontSize: autoSizeWidth(14),
        marginTop: autoSizeWidth(125)
    },
    contentImage: {
        height: autoSizeWidth(145),
        width: autoSizeWidth(160),
        top: autoSizeWidth(20),
        left: autoSizeWidth(65),
        position: 'absolute'
    },
    detail: {
        color: DesignRule.textColor_instruction,
        fontSize: autoSizeWidth(11),
        marginTop: autoSizeWidth(5),
        textAlign: 'center'
    },
    btn: {
        backgroundColor: DesignRule.mainColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: autoSizeWidth(20),
        overflow: 'hidden',
        width: autoSizeWidth(160),
        height: autoSizeWidth(40),
        marginTop: autoSizeWidth(15)
    }


});
