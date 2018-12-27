/**
 * 悬浮按钮
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Platform,
    Animated,
    StatusBar,
    StyleSheet,
    Dimensions,
    PanResponder
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;//默认只处理安卓
const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
const MOVE_DIS = 1.5;

export default class SuspensionButton extends Component {

    static propTypes = {
        onPress: PropTypes.func.isRequired // 点击加载的回调函数
    };
    static defaultProps = {
        onPress: () => {
            console.warn('Warn: Check whether set onPress function on SuspensionButton~');
        }
    };


    constructor(props) {
        super(props);
        this.tapX = 0;//首次点击在图片中位置
        this.tapY = 0;
        this.tapXInWin = 0;//首次点击在屏幕中的位置
        this.tapYInWin = 0;

        this.isFirstTap = true;
        this.isTap = true;
        this.multiTap = false;
        this.imgWidth = 0;
        this.imgHeight = 0;
        this.state = {
            aRight: new Animated.Value(ScreenWidth - 100),
            aBottom: new Animated.Value(100)
        };
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => false,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd
        });
    }

    _handlePanResponderGrant = (event, gestureState) => {
        this.tapX = event.nativeEvent.locationX.toFixed(3);
        this.tapY = event.nativeEvent.locationY.toFixed(3);
        if (gestureState.numberActiveTouches > 1) {
            this.multiTap = true;
            return null;
        }
    };

    _handlePanResponderMove = (event, gestureState) => {

        if (gestureState.numberActiveTouches > 1) {
            this.multiTap = true;
        }
        if (this.multiTap) {
            return null;
        }
        if (this.isFirstTap) {
            this.tapXInWin = gestureState.moveX.toFixed(3);
            this.tapYInWin = gestureState.moveY.toFixed(3);
            this.isFirstTap = false;
        } else {
            //用距离判断是不是tap
            let thisTapX = gestureState.moveX.toFixed(3);
            let thisTapY = gestureState.moveY.toFixed(3);
            let x_dis = Math.abs(thisTapX - this.tapXInWin);
            let y_dis = Math.abs(thisTapY - this.tapYInWin);
            let dis = Math.sqrt(x_dis * x_dis + y_dis * y_dis);
            this.isTap = MOVE_DIS >= dis;
        }

        if (!this.isTap) {
            //手指在整个屏幕的坐标点
            const moveX = gestureState.moveX;
            const moveY = gestureState.moveY + STATUSBAR_HEIGHT;

            const offsetX = this.imgWidth - this.tapX;
            const offsetY = this.imgHeight - this.tapY;
            //console.warn(ScreenWidth - moveX - offsetX,ScreenHeight - moveY - offsetY);

            this.state.aRight.setValue(ScreenWidth - moveX - offsetX);
            this.state.aBottom.setValue(ScreenHeight - moveY - offsetY);
        }

    };

    _handlePanResponderEnd = (event, gestureState) => {
        if (this.multiTap) {
            this.multiTap = false;
            this.isFirstTap = true;
            this.isTap = true;
            return null;
        }
        if (this.isTap) {
            this._onImageClick();
        } else {
            this._checkBtnPosition();
        }
        this.isFirstTap = true;
        this.isTap = true;
    };

    _checkBtnPosition = () => {
        let right = this.state.aRight._value;
        let bottom = this.state.aBottom._value;
        if (this.state.aRight._value > (ScreenWidth - 80) || this.state.aRight._value < 0) {
            right = this.state.aRight._value > (ScreenWidth - 80) ? ScreenWidth - 80 : 0;
        }
        if (this.state.aBottom._value > (ScreenHeight - 80) || this.state.aBottom._value < 0) {
            bottom = this.state.aBottom._value > (ScreenHeight - 80) ? ScreenHeight - 80 : 20;
        }
        Animated.timing(
            this.state.aRight,
            {
                toValue: right,
                duration: 150
            }
        ).start();
        Animated.timing(
            this.state.aBottom,
            {
                toValue: bottom,
                duration: 150
            }
        ).start();

    };

    _onImageClick = () => {
        this.props.onPress && this.props.onPress();
    };

    onLayout = (event) => {
        if (this.imgWidth && this.imgHeight) {
            return null;
        }
        const { width, height } = event.nativeEvent.layout;
        this.imgWidth = width;
        this.imgHeight = height;
    };

    render() {
        return (
            <Animated.View
                {...this._panResponder.panHandlers}
                onLayout={this.onLayout}
                style={[styles.imageContainer,
                    styles.suspensionButton,
                    this.props.style, {
                        right: this.state.aRight,
                        bottom: this.state.aBottom
                    }]}>
                {this.props.children}
            </Animated.View>

        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    suspensionButton: {
        width: 80,
        height: 32,
        borderRadius: 10,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red'
    }
});
