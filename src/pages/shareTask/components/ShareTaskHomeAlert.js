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
import renwu_icon_quan_nor from '../res/renwu_icon_quan_nor.png';
import cancel from '../res/qiandao_btn_return_nor.png';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import DesignRule from 'DesignRule';

const autoSizeWidth = ScreenUtils.autoSizeWidth;

export default class ShareTaskHomeAlert extends React.Component {

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
        this.shareModal.open();
    }

    close() {
        this.shareModal.close();
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
                        <UIText value={this.props.data.name} style={styles.title}/>
                        <UIImage source={renwu_icon_quan_nor} style={styles.contentImage}/>
                        <UIText value={"完成推广任务\n"+ this.props.data.desc} style={styles.detail}/>
                        <TouchableWithoutFeedback onPress={() => {
                            this.props.onPress && this.props.onPress();
                            this.close();
                        }}>
                            <View style = {styles.btn}>
                                <UIText value={"马上领取"} style={{color: DesignRule.white, fontSize: autoSizeWidth(14)}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </ShareTaskAnimation>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: autoSizeWidth(230 + 60),
        height: autoSizeWidth(260 + 20 + 30),
        alignItems: 'center'
    },
    content: {
        width: autoSizeWidth(230),
        height: autoSizeWidth(260),
        alignItems: 'center',
        backgroundColor: DesignRule.white,
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
        color: '#222222',
        fontSize: autoSizeWidth(16),
        marginTop: autoSizeWidth(15)
    },
    contentImage: {
        height: autoSizeWidth(90),
        width: autoSizeWidth(130),
        marginTop: autoSizeWidth(20),
        marginRight: autoSizeWidth(10),
    },
    detail: {
        color: '#666666',
        fontSize: autoSizeWidth(12),
        marginTop: autoSizeWidth(20),
        textAlign: 'center',
    },
    btn: {
        backgroundColor: '#D51243',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        overflow: 'hidden',
        width: autoSizeWidth(160),
        height: autoSizeWidth(40),
        marginTop: autoSizeWidth(15)
    }


});
