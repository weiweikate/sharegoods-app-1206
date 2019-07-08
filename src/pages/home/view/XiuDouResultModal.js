/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/5/27.
 *
 */


'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    ImageBackground,
    TouchableOpacity,
    Image
} from 'react-native';
import ImageLoader from '@mr/image-placeholder';

import {
    MRText
} from '../../../components/ui';
import Modal from '../../../comm/components/CommModal';

import res from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import RefreshFlatList from '../../../comm/components/RefreshFlatList';
import HomeAPI from '../api/HomeAPI';

const { modalBg } = res;

export default class XiuDouResultModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {visible: false};
    }


    renderContent() {
        return (
            <View style={styles.modal}>
                <ImageBackground source={modalBg} style={styles.bg}>
                    <View style={styles.topContainer}>
                        <View style={{flexDirection: 'row', height:  ScreenUtils.autoSizeWidth(30), alignItems: 'center'}}>
                            <MRText style={[styles.detail, {marginLeft: ScreenUtils.autoSizeWidth(15)}]}>获奖用户</MRText>
                            <MRText style={[styles.detail, {marginLeft: ScreenUtils.autoSizeWidth(32), flex: 1}]}>免单奖励</MRText>
                            <MRText style={[styles.detail, {marginRight: ScreenUtils.autoSizeWidth(15)}]}>免单场次</MRText>
                        </View>
                        <RefreshFlatList url={HomeAPI.freeOrderList}
                                         params={{}}
                                         renderItem={this.renderItem}
                                         emptyHeight={ScreenUtils.autoSizeWidth(200)}
                                         defaultEmptyText={'还没内容哦'}
                                         sizeKey={'pageSize'}
                                         pageKey={'pageIndex'}
                        />
                    </View>
                    <View style={styles.bottomContainer}>
                        <MRText style={[styles.detail,{marginHorizontal: ScreenUtils.autoSizeWidth(10)}]}>
                            <MRText style={styles.title}>{'活动概述\n'}</MRText>
                            {'系统将会随机抽取若干参与秒杀活动的用户，送出与支付金额同等价值的秀豆。\n'}
                            <MRText style={styles.title}>{'开奖时间\n'}</MRText>
                            {'每个时段秒杀结束后同步开奖，请留意站内消息。'}
                        </MRText>
                    </View>
                    <TouchableOpacity style={{position: 'absolute',
                        top: 0,
                        right: 0,
                        width: ScreenUtils.autoSizeWidth(40),
                        height: ScreenUtils.autoSizeWidth(40),
                        alignItems: 'center',
                        justifyContent: 'center'}}
                                      onPress={()=>{this.close()}}
                    >
                        <Image source={res.button.btn_close_white}/>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    }

    // "headImg": "https://testcdn.sharegoodsmall.com/sharegoods/8c63c8c7e0e74dbf8239eeafaf60fa81.png",
    // "award": "300秀豆",
    // "time": "昨天13:00"

    renderItem({item}){
        let {headImg, award, time} = item;
        return(
            <View style={{flexDirection: 'row', height:  ScreenUtils.autoSizeWidth(45), alignItems: 'center', backgroundColor: 'white'}}>
                <ImageLoader source={{uri: headImg}}
                             isAvatar={true}
                             style={{marginLeft: ScreenUtils.autoSizeWidth(15), height: ScreenUtils.autoSizeWidth(32), width: ScreenUtils.autoSizeWidth(32)}}/>
                <MRText style={[styles.detail, {marginLeft: ScreenUtils.autoSizeWidth(32), flex: 1}]}>{award}</MRText>
                <MRText style={[styles.detail, {marginRight: ScreenUtils.autoSizeWidth(15)}]}>{time}</MRText>
            </View>
        )
    }


    open(){
        this.setState({visible: true});
    }

    close(){
        this.setState({visible: false});
    }

    render() {
        return (
            <Modal
                animationType='slide'
                ref={(ref) => {
                    this.modal = ref;
                }}
                onRequestClose={() => {
                    this.close();
                }}
                visible={this.state.visible}>
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
        height: ScreenUtils.autoSizeWidth(410),
    },
    topContainer: {
        position: 'absolute',
        top: ScreenUtils.autoSizeWidth(39),
        left: ScreenUtils.autoSizeWidth(10),
        right: ScreenUtils.autoSizeWidth(10),
        height: ScreenUtils.autoSizeWidth(236),
    },
    bottomContainer: {
        position: 'absolute',
        bottom: ScreenUtils.autoSizeWidth(10),
        left: ScreenUtils.autoSizeWidth(10),
        right: ScreenUtils.autoSizeWidth(10),
        height: ScreenUtils.autoSizeWidth(100),
        justifyContent: 'center',
    },
    detail: {
        color: '#999999',
        fontSize: ScreenUtils.autoSizeWidth(10)
    },
    title: {
        color: '#333333',
        fontSize: ScreenUtils.autoSizeWidth(12)
    }
});
