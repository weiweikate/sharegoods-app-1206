/* eslint-disable camelcase */
/**
 * Toast 弹框
 *
 * func: showToast(title , {duration,toastHiddenCallBack})
 *                  title 标题[必传]  置：尺寸时间，隐藏回调
 * func: dismiss    隐藏
 *
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native';
const AnimatedDuration = 150;// 默认的动画持续时间
const ShowTimeDuration = 2.0;// 弹框展示时间，单位S秒,默认2.0S


export default class ToastView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            isShow: false,
            opacity: new Animated.Value(0),       //透明度
            bounceValue: new Animated.Value(0.7), //面板尺寸
        };
        this.__timer__ = null;
        this.toastHiddenCallBack = null;
    }

    componentWillUnmount() {
        this._clearTimer();
    }

    /***
     * 弹框展示
     * @param title      主标题
     * @param duration   持续时间 默认2秒
     * @param toastHiddenCallBack toast在指定时间结束后的回调
     */
    showToast = (title, {duration, toastHiddenCallBack} = {}) => {

        if (this.state.isShow) {
            return;
        }

        if (!title || typeof title !== 'string') {
            console.warn(`showToast Error:\n title is required, type String`);
            return;
        }

        this._clearTimer();

        this.toastHiddenCallBack = toastHiddenCallBack && typeof toastHiddenCallBack === 'function' ? toastHiddenCallBack : null;
        duration = duration && typeof duration === 'number' ? duration : ShowTimeDuration;

        this.setState({
            title,
            isShow: true,
        }, () => {
            this.state.opacity.setValue(0.5);
            Animated.parallel([
                Animated.spring(
                    this.state.bounceValue,
                    {
                        toValue: 1,
                        friction: 6,
                        tension: 60,
                    }
                ),
                Animated.timing(
                    this.state.opacity,
                    {
                        toValue: 1,
                        duration: AnimatedDuration,
                    }
                )
            ]).start();
            this.__timer__ = setInterval(() => {
                this.state.opacity.setValue(0);
                this.state.bounceValue.setValue(0.7);
                this.setState({isShow: false},()=>{
                    this.toastHiddenCallBack && this.toastHiddenCallBack();
                    this._clearTimer();
                });
            }, duration * 1000);
        });

    };

    // 隐藏toast
    dismiss = (callBack) => {
        this._clearTimer();
        if (this.state.isShow) {
            this.setState({
                isShow: false,
            }, () => {
                callBack && typeof callBack === 'function' && callBack();
            });
        } else {
            callBack && typeof callBack === 'function' && callBack();
        }
    };

    //是否正在展示
    isToastShow = () => {
        return this.state.isShow;
    };

    _clearTimer = () => {
        if (this.__timer__) {
            clearInterval(this.__timer__);
            this.__timer__ = null;
        }
    };

    render() {
        if (!this.state.isShow) {
            return null;
        }
        const title = this.state.title || '';
        const {length} = title;
        const paddingHorizontal = length > 14 ? 15 : (length > 1 ? 20 : 30);

        return (
            <View pointerEvents="none" style={styles.container}>
                <Animated.View style={[styles.sheetBlackPanel, {
                    opacity: this.state.opacity,
                    transform: [{ scale: this.state.bounceValue }],
                    paddingHorizontal
            }
        ]}>
                    <Text allowFontScaling={false}
                          style={[styles.title]}
                          numberOfLines={2}>
                        {title}
                    </Text>
                </Animated.View>
            </View>
        );
    }


}


const styles = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheetBlackPanel: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        borderRadius: 5,
        justifyContent: 'center',
        minHeight: 35,
        maxHeight: 53,
        paddingHorizontal: 15,
        paddingVertical: 10,
        minWidth: 100,
        maxWidth: Dimensions.get('window').width - 83 * 2
    },
    title: {// 主title
        color: 'white',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center'
    },
});
