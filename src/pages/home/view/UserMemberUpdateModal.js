/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/10/11.
 *
 */
'use strict';


import React from 'react';
import { routePush } from '../../../navigation/RouterMap';

import {
    StyleSheet,
    View,
    ImageBackground,
    TouchableOpacity,
    Platform
} from 'react-native';

import {
    MRText
} from '../../../components/ui';
import HomeModalManager from '../manager/HomeModalManager';
import Modal from '../../../comm/components/CommModal';

import res from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';

const { user_update, user_update_btn_bg } = res;
import { observer } from 'mobx-react';

@observer
export default class UserMemberUpdateModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    renderContent() {
        let data = HomeModalManager.UserMemberUpdateData || '{}';
        data = JSON.parse(data);
        let title = (data.params || {}).content;
        return (
            <View style={styles.modal}>
                <ImageBackground source={user_update} style={styles.bg}>
                    <View style={styles.content}>
                    <MRText style={styles.title}>{title}</MRText>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => {
                        routePush('HtmlPage', { uri: '/mine/memberRights' });
                        HomeModalManager.closeUserMemberUpdate();
                    }
                    }>
                        <ImageBackground source={user_update_btn_bg} style={styles.btn}>
                            <MRText style={styles.btnText}>立即查看</MRText>
                        </ImageBackground>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    }


    render() {
        if (Platform.OS === 'ios'){
            if (HomeModalManager.isShowUserMemberUpdate && HomeModalManager.isHome){
                return this.renderContent()
            } else {
                return <View />
            }
        }
        return (
            <Modal
                animationType='slide'
                ref={(ref) => {
                    this.modal = ref;
                }}
                onRequestClose={() => {
                    HomeModalManager.closeUserMemberUpdate();
                }}
                visible={HomeModalManager.isShowUserMemberUpdate && HomeModalManager.isHome}>
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
        height: ScreenUtils.autoSizeWidth(248),
        width: ScreenUtils.autoSizeWidth(267),
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    btn: {
        height: ScreenUtils.autoSizeWidth(52),
        width: ScreenUtils.autoSizeWidth(181),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: ScreenUtils.autoSizeWidth(12)
    },
    content: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        height: ScreenUtils.autoSizeWidth(90),
        width: ScreenUtils.autoSizeWidth(220),
        marginBottom: ScreenUtils.autoSizeWidth(16),
        paddingHorizontal: 5

    },
    btnText: {
        fontSize: 18,
        color: '#FFF9C5',
        marginBottom: ScreenUtils.autoSizeWidth(4)
    },
    title: {
        fontSize:  ScreenUtils.autoSizeWidth(14),
        color: '#FF0050',
    }
});
