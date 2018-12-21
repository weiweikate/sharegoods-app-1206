import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Modal from 'CommModal';
import DesignRule from 'DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import {MRText as Text}from './UIText';


// const MAX_SCREEN = Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
// const PANNELHEIGHT = 203;
// const Animated_Duration = 300; //默认的动画持续时间
export default class ConfirmAlert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // height: PANNELHEIGHT,
            title: props.title,
            //私有state
            modalVisible: false, //是否显示
            // top: new Animated.Value(-PANNELHEIGHT), //白色面板顶部距离屏幕底部
            // backOpacity: new Animated.Value(0), //背景颜色
            alignType: 'center',
            leftText: '取消',
            rightText: '确认'
        };
    }

    show = ({ closeCallBack, confirmCallBack, title, height, alignType, leftText, rightText }) => {
        this.setState({
            // height: height || PANNELHEIGHT,
            alignType: alignType || this.state.alignType,
            leftText: leftText || this.state.leftText,
            rightText: rightText || this.state.rightText,
            title: title || this.state.title,
            confirmCallBack: confirmCallBack,
            closeCallBack: closeCallBack,
            modalVisible: true
        }, this._startAnimated);
    };

    //开始动画
    _startAnimated = () => {
        //底部到顶部的
        // Animated.parallel([
        //     Animated.timing(
        //         //透明度
        //         this.state.top,
        //         {
        //             toValue: (MAX_SCREEN - this.state.height) / 2,
        //             duration: Animated_Duration
        //         }
        //     ),
        //     Animated.timing(
        //         //透明度
        //         this.state.backOpacity,
        //         {
        //             toValue: 1,
        //             duration: Animated_Duration
        //         }
        //     )
        // ]).start();
    };

    /**
     * 关闭动画
     * @callBack 动画结束的回到函数
     **/
    _closeAnimated = (cb) => {
        this.setState({ modalVisible: false }, () => {
            this.state.closeCallBack && this.state.closeCallBack();
        });
        // Animated.parallel([
        //     Animated.timing(
        //         //透明度
        //         this.state.top,
        //         {
        //             toValue: -this.state.height,
        //             duration: (Animated_Duration * 2) / 3
        //         }
        //     ),
        //     Animated.timing(
        //         //透明度
        //         this.state.backOpacity,
        //         {
        //             toValue: 0,
        //             duration: (Animated_Duration * 2) / 3
        //         }
        //     )
        // ]).start(() => {
        //     this.setState({ modalVisible: false }, () => {
        //         if (cb && typeof cb === 'function') {
        //             cb();
        //         }
        //     });
        // });
    };

    _clickOk = () => {
        this.setState({ modalVisible: false }, () => {
            this.state.confirmCallBack && this.state.confirmCallBack();
        });
        // this._closeAnimated(() => {
        //     this.state.confirmCallBack && this.state.confirmCallBack();
        // });
    };

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        return (
            <Modal visible={this.state.modalVisible} onRequestClose={this._closeAnimated}>
                <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                    {/*<Animated.View*/}
                    {/*style={[*/}
                    {/*styles.container,*/}
                    {/*{*/}
                    {/*backgroundColor: 'rgba(0,0,0,0.5)',*/}
                    {/*opacity: this.state.backOpacity*/}
                    {/*}*/}
                    {/*]}*/}
                    {/*/>*/}

                    {/*<Animated.View*/}
                    {/*style={[*/}
                    {/*styles.whitePanel,*/}
                    {/*{*/}
                    {/*top: this.state.top,*/}
                    {/*opacity: this.state.backOpacity,*/}
                    {/*height: this.state.height*/}
                    {/*}*/}
                    {/*]}*/}
                    {/*>*/}
                    <View style={styles.whitePanel}>
                        <Text style={{
                            fontSize: 15,
                            color: DesignRule.textColor_secondTitle,
                            textAlign: this.state.alignType,
                            marginHorizontal: 16,
                            marginVertical: 32
                        }} textAlign={this.state.alignType}>{this.state.title}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
                            <TouchableOpacity onPress={this._closeAnimated} style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: DesignRule.lineColor_inGrayBg,
                                width: (ScreenUtils.width - ScreenUtils.autoSizeWidth(16 * 8)) / 2,
                                height: 32,
                                borderRadius: 5
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: DesignRule.textColor_instruction
                                }}>{this.state.leftText}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._clickOk} style={{
                                marginLeft: ScreenUtils.autoSizeWidth(16 * 2),
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: DesignRule.mainColor,
                                width: (ScreenUtils.width - ScreenUtils.autoSizeWidth(16 * 8)) / 2,
                                height: 32,
                                borderRadius: 5
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: 'white'
                                }}>{this.state.rightText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*</Animated.View>*/}
                </View>
            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    whitePanel: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 32
    },
    title: {
        textAlign: 'center',
        fontSize: 15,
        color: DesignRule.textColor_mainTitle
    }
});

