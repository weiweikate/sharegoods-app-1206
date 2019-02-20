import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Modal from '../../../comm/components/CommModal';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';

export default class CameraView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            callBack: null,
            isRecording: false
        };
    }

    show = (callBack) => {
        this.setState({
            modalVisible: true,
            callBack
        });
    };

    render() {
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
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        permissionDialogTitle={'使用相机'}
                        permissionDialogMessage={'需要使用相机权限'}
                        onGoogleVisionBarcodesDetected={({ barcodes }) => {
                            console.log(barcodes);
                        }}>
                    </RNCamera>
                    <TouchableOpacity onPress={this.state.isRecording ? this.cancel : this.takeVideo.bind(this)}
                                      style={styles.recordingBtn}>
                        <Text style={{ fontSize: 14 }}> {this.state.isRecording ? '结束' : '开始'} </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    takeVideo = async function() {
        const { callBack } = this.state;
        if (this.camera) {
            try {
                const promise = this.camera.recordAsync({
                    mute: false,
                    maxDuration: 10,
                    quality: RNCamera.Constants.VideoQuality['288p']
                });
                if (promise) {
                    this.setState({ isRecording: true });
                    const data = await promise;
                    console.warn('takeVideo', data);
                    this.setState({
                        isRecording: false,
                        modalVisible: false
                    }, () => {
                        callBack && callBack(data.uri);
                    });
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
        width: ScreenUtils.width
    },
    CameraView: {
        flex: 1
    },
    recordingBtn: {
        position: 'absolute', bottom: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
        width: 80, height: 80, borderRadius: 40, backgroundColor: DesignRule.white
    }
});
