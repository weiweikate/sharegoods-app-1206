/**
 * @author xzm
 * @date 2018/10/23
 * @providesModule CommModal
 */

// import {
//     requireNativeComponent,
//     Platform,
//     Modal,
// } from 'react-native';
// const NativeModalAndroid = requireNativeComponent('ModalAndroid');//内部使用popwindow实现全屏
// const CommModal = Platform.OS === 'android' ? NativeModalAndroid : Modal;
// export default CommModal;

import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
    AppState,
    requireNativeComponent
} from "react-native";

const NativeModalAndroid = requireNativeComponent("ModalAndroid");//内部使用popwindow实现全屏

export default class CommModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            update: false,
            visible: this.props.visible
        };
    }

    componentDidMount() {
        AppState.addEventListener("change", this._handleAppStateChange);
    }

    componentWillReceiveProps(props) {
        this.setState({ visible: props.visible });
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = (AppState) => {
        console.log("AppState", AppState);
        console.log("AppState _handleAppStateChange", this.state.visible);
        this.setState({
            update: !this.state.update,
            visible: this.state.visible
        });
    };

    close = () => {
        requestAnimationFrame(() => {
            if (this.props.close) {
                // console.log("close","执行了父组件的close方法")
                this.props.close();
            } else {
                // console.log("close","执行本组件方法")
                this.setState({ visible: false });
            }
        });
    };


    render() {
        if (Platform.OS === "ios") {
            return (
                <Modal
                    animationType={this.props.animation ? this.props.animation : "none"}// 进场动画 fade
                    onRequestClose={() => this.close()}
                    visible={this.state.visible}// 是否可见
                    transparent
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}

                    >
                        <View style={styles.container}>
                            {this.props.children}
                        </View>
                    </TouchableOpacity>
                </Modal>
            );
        }
        return (
            <NativeModalAndroid
                style={{ width: 0, height: 0 }}//避免显示空白
                ref={(modalAndroid) => {
                    this.modalAndroid = modalAndroid;
                }}
                visible={[this.state.visible, this.state.update]}>
                <TouchableOpacity
                    activeOpacity={1}
                >
                    <View style={styles.container}>
                        {this.props.children}
                    </View>
                </TouchableOpacity>
            </NativeModalAndroid>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    }
});
