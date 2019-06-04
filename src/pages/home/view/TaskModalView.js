/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/5/30.
 *
 */

'use strict';

import React from 'react';
import {navigate, navigateBackToStore} from '../../../navigation/RouterMap';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';

import {
    MRText,
} from '../../../components/ui';
import Modal from '../../../comm/components/CommModal';
import { observer } from 'mobx-react';
import res from '../res';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import taskModel, { mineTaskModel } from '../model/TaskModel';
import LinearGradient from 'react-native-linear-gradient';
import HomeModalManager from '../manager/HomeModalManager';
const {
    taskModal_dou,
    taskModal_btn,
    taskModal_exp,
    taskModal_chou,
    taskModal_h,
    taskModal_header,
    taskModal_wa,
    dou_bg,
    h_bg,
    exp_bg,
    chou_bg,
    V2,
    V3,
    V4,
    V5,
} = res.task;
const GiftType = {
    exp: 1,
    xiudou: 2,
    coupon: 3,
    lottery: 4
}
@observer
export default class TaskModalView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
        this.model = this.props.type === 'home'? taskModel : mineTaskModel

    }


    componentDidMount() {
    }

    renderContent() {

        let alertData = this.model.alertData || []
        let images = [taskModal_exp,taskModal_dou,taskModal_h, taskModal_chou];
        let bgs = [exp_bg, dou_bg, h_bg, chou_bg]
        let lottery = null;
        alertData = alertData.filter((item) => {
            if (GiftType[item.code]){
                if (GiftType[item.code] === GiftType.lottery) {
                    lottery = item;
                    return true;
                }
                return true;
            }
            return false;
        })
        return(
            <View style={styles.modal}>
                <View style={{borderRadius: 10, overflow: 'hidden'}}>
                    <Image source={taskModal_header} style={styles.header}/>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                                    colors={[ '#FFC664','#FF914A']}
                                    style={{ alignItems: "center"}}
                    >
                        <Image source={taskModal_wa} style={{
                            width: ScreenUtils.autoSizeWidth(185),
                            height: ScreenUtils.autoSizeWidth(30),
                            marginBottom: ScreenUtils.autoSizeWidth(10),
                        }}/>
                        {
                            alertData.map((item) => {
                                let {total, code, unit = '', name} = item;
                                return(
                                    <ImageBackground source={bgs[GiftType[code]-1]} style={{
                                        height: ScreenUtils.autoSizeWidth(51),
                                        width: ScreenUtils.autoSizeWidth(170),
                                        marginTop: ScreenUtils.autoSizeWidth(8),
                                        alignItems: 'center',
                                        flexDirection: 'row'
                                    }}>
                                        <Image source={images[GiftType[code]-1]} style={{
                                            width: ScreenUtils.autoSizeWidth(45),
                                            height: ScreenUtils.autoSizeWidth(45),
                                            marginLeft: ScreenUtils.autoSizeWidth(10)
                                        }}/>
                                        <View style={{
                                            marginLeft: ScreenUtils.autoSizeWidth(10)
                                        }}>
                                            <MRText style={{fontSize: ScreenUtils.autoSizeWidth(14), color: DesignRule.mainColor}}>{item.name}</MRText>
                                            <MRText style={{fontSize: ScreenUtils.autoSizeWidth(11), color: '#999999'}}>{total + unit + name}</MRText>
                                        </View>

                                    </ImageBackground>
                                )
                            })
                        }
                        <TouchableOpacity onPress={()=> {this.onPress(lottery)}}>
                            <ImageBackground source={taskModal_btn} style={styles.btn}>
                                <MRText style={styles.btnText}>{lottery?'去抽奖': '确定'}</MRText>
                            </ImageBackground>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        )
    }

    onPress(lottery){
        if (lottery)  {
            navigate('HtmlPage', {uri: lottery.parameter})
        }
        this.model.closeAlert()
    }

    render() {
        return (
            <Modal
                animationType='slide'
                ref={(ref) => {
                    this.modal = ref;
                }}
                onRequestClose={() => {
                    this.model.closeAlert()
                }}
                visible={this.model.openAlert === true}>
                {this.renderContent()}
            </Modal>
        );
    }
}


@observer
export class UserLevelModalView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

    }

    renderContent() {
        let imgs = {V2, V3, V4, V5}
        return(
            <View style={styles.modal}>
                <TouchableOpacity style={{width: ScreenUtils.width, alignItems: 'center'}} onPress={()=> {this.onPress(HomeModalManager.Userdata)}} >
                    <TouchableOpacity onPress={()=> {this.onPress()}}
                                      style={{alignSelf: 'flex-end',
                                          marginRight: ScreenUtils.autoSizeWidth(30),
                                          marginBottom: ScreenUtils.autoSizeWidth(0),}}>
                        <Image source={res.button.cancel_white_circle} style={{
                            width: ScreenUtils.autoSizeWidth(25),
                            height: ScreenUtils.autoSizeWidth(25),
                        }} />
                    </TouchableOpacity>
                    <Image source={imgs[HomeModalManager.Userdata]} style={{
                        width: ScreenUtils.autoSizeWidth(250),
                        height: ScreenUtils.autoSizeWidth(250)}}/>
                </TouchableOpacity>
            </View>
        )
    }

    onPress(v){
        HomeModalManager.closeUserLevel();
        if (v === 'V2') {
            navigateBackToStore()
        }
    }

    render() {
        return (
            <Modal
                animationType='slide'
                ref={(ref) => {
                    this.modal = ref;
                }}
                onRequestClose={() => {
                    HomeModalManager.closeUserLevel()
                }}
                visible={HomeModalManager.isShowUser && HomeModalManager.isHome}>
                {this.renderContent()}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',

    },
    header: {
        width: ScreenUtils.autoSizeWidth(250),
        height: ScreenUtils.autoSizeWidth(50),
    },
    btn: {
        height: ScreenUtils.autoSizeWidth(51),
        width: ScreenUtils.autoSizeWidth(170),
        alignItems: 'center',
        justifyContent: 'center' ,
        marginBottom: ScreenUtils.autoSizeWidth(23),
        marginTop: ScreenUtils.autoSizeWidth(10),
    },
    btnText: {
        fontSize: 18,
        color: '#D75A26'
    },
});
