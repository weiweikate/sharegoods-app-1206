import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
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
            modalVisible: false,
            callBack: null,
            isRecording: false,
            data: undefined,
            type: RNCamera.Constants.Type.back
        };
    }

    show = (callBack) => {
        this.setState({
            modalVisible: true,
            data: undefined,
            callBack
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

    render() {
        const { data, isRecording, type } = this.state;
        return (
            <Modal onRequestClose={this.close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.CameraView}
                        type={type}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        permissionDialogTitle={'使用相机'}
                        permissionDialogMessage={'需要使用相机权限'}
                        onGoogleVisionBarcodesDetected={({ barcodes }) => {
                            console.log(barcodes);
                        }}>
                    </RNCamera>

                    <View style={{
                        flexDirection: 'row',
                        position: 'absolute', top: 0, left: 0, right: 0,
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

                </View>
            </Modal>
        );
    }

    takeVideo = async function() {
        if (this.camera) {
            try {
                const promise = this.camera.recordAsync({
                    mute: false,
                    maxDuration: 10,
                    quality: RNCamera.Constants.VideoQuality['288p']
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
