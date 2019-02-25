import React, { Component } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Modal from '../../../comm/components/CommModal';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import NoMoreClick from '../NoMoreClick';
import { MRText as Text } from '../../../components/ui';

import cameraBack from './cameraBack.png';
import cameraFontBack from './cameraFontBack.png';


export default class CameraView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //前后摄像头
            type: RNCamera.Constants.Type.back,
            callBack: null,
            //是否拍摄中
            isRecording: false,

            modalVisible: false,
            //有无数据
            data: undefined,
            //防止安卓过早出现权限弹框  和返回后再点击出现黑屏
            has_authorized: false
        };
    }

    show = (callBack) => {
        this.setState({
            has_authorized: false
        }, () => {
            this.setState({
                modalVisible: true,
                data: undefined,
                has_authorized: true,
                callBack
            });
        });
    };

    _close = () => {
        const { callBack, data } = this.state;
        this.setState({
            isRecording: false,
            modalVisible: false
        }, () => {
            callBack && callBack(data && data.uri);
        });
    };

    _renderCameraView = () => {
        const { data, isRecording, type } = this.state;
        return <View style={styles.container}>
            <RNCamera
                ref={ref => {
                    this.camera = ref;
                }}
                style={styles.CameraView}
                type={type}
                flashMode={RNCamera.Constants.FlashMode.off}
                onStatusChange={({ cameraStatus }) => {
                    if (cameraStatus === RNCamera.Constants.CameraStatus.NOT_AUTHORIZED) {
                        this.setState({
                            has_authorized: false
                        }, () => {
                            Alert.alert('提示', '相机权限未开启，请进入系统－设置中开启，允许秀购使用相机',
                                [
                                    { text: '确定', onPress: this._close }
                                ],
                                { cancelable: false }
                            );
                        });
                    }
                }}>
            </RNCamera>

            <View style={{
                flexDirection: 'row',
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 60 + ScreenUtils.statusBarHeight,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <NoMoreClick style={{
                    marginRight: 15,
                    width: 48,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onPress={this._close}>
                    <Image source={cameraBack}/>
                </NoMoreClick>
                <NoMoreClick style={{
                    marginRight: 15,
                    width: 48,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onPress={() => {
                    this.setState({
                        type: type === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
                    });
                }}>
                    <Image source={cameraFontBack}/>
                </NoMoreClick>

            </View>

            {
                data ? null :
                    <NoMoreClick onPress={this.state.isRecording ? this.cancel : this.takeVideo.bind(this)}
                                 style={styles.recordingBtn}>
                        <Text style={{ fontSize: 14 }}> {this.state.isRecording ? '结束' : '开始'} </Text>
                    </NoMoreClick>
            }

            {
                data && !isRecording ? <View style={{
                    flexDirection: 'row',
                    position: 'absolute', top: 0, left: 0, right: 0,
                    backgroundColor: 'black',
                    height: 40 + ScreenUtils.statusBarHeight * 2,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <NoMoreClick style={{
                        marginRight: 15,
                        width: 48,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => {
                        this.setState({
                            data: undefined
                        });
                    }}>
                        <Text style={{ color: DesignRule.white, fontSize: 13 }}>重拍</Text>
                    </NoMoreClick>
                    <NoMoreClick style={{
                        marginRight: 15,
                        backgroundColor: DesignRule.mainColor,
                        width: 48,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={this._close}>
                        <Text style={{ color: DesignRule.white, fontSize: 13 }}>确定</Text>
                    </NoMoreClick>

                </View> : null
            }
        </View>;
    };

    render() {
        return (
            <Modal onRequestClose={this.close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <View style={styles.container}>
                    {
                        this.state.has_authorized ? this._renderCameraView() : <View style={styles.container}>
                        </View>
                    }
                </View>
            </Modal>
        );
    }

    takeVideo = async function() {
        if (this.camera) {
            try {
                const promise = this.camera.recordAsync({
                    mute: false,
                    maxFileSize: 3 * 1024 * 1024,
                });
                if (promise) {
                    this.setState({ isRecording: true });
                    let data = await promise;
                    this.setState({ isRecording: false, data: data });
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    cancel = () => {
        this.camera.stopRecording();
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: ScreenUtils.width,
        backgroundColor: DesignRule.white
    },
    CameraView: {
        flex: 1
    },
    recordingBtn: {
        position: 'absolute', bottom: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
        width: 80, height: 80, borderRadius: 40, backgroundColor: DesignRule.white
    }
});
