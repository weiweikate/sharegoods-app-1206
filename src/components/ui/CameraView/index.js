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

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.modalVisible !== nextState.modalVisible) {
    //         return true;
    //     }
    //     return false;
    // }

    show = (callBack) => {
        this.setState({
            modalVisible: true,
            callBack
        });
    };

    _close = (data) => {
        const { callBack } = this.state;
        this.setState({
            modalVisible: false
        }, () => {
            callBack && callBack(data);
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
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                        onGoogleVisionBarcodesDetected={({ barcodes }) => {
                            console.log(barcodes);
                        }}>
                    </RNCamera>
                    <TouchableOpacity onPress={this.state.isRecording ? this.cancel : this.takeVideo.bind(this)}
                                      style={styles.recordingBtn}>
                        <Text style={{ fontSize: 14 }}> {this.state.isRecording ? '取消' : '拍照'} </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    takeVideo = async function() {
        if (this.camera) {
            try {
                const promise = this.camera.recordAsync({});
                if (promise) {
                    this.setState({ isRecording: true });
                    const data = await promise;
                    this.setState({ isRecording: false });
                    console.warn('takeVideo', data);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    cancel = () => {
        this.camera.stopRecording;
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
        position: 'absolute', bottom: 40, left: 10,
        width: 40, height: 40, borderRadius: 20, backgroundColor: DesignRule.mainColor
    }
});
