/**
 * 网络错误控件
 *
 * a.后台接口或http网络层级的错误，此时netFailedInfo 为网络库的返回值
 * b.业务代码catch到的错误  此时netFailedInfo 为try-catch中的error
 *
 * //最简使用示例：
 * <NetFailedView reloadBtnClick={点击重新加载的回调函数} netFailedInfo={'出错的信息'}/>
 *
 * //高度自定义示例：
 * <NetFailedView
 *      style={'这里是style，可以自定义'}
 *      imageStyle={'这里自定义图片的样式'}
 *      source={'自定义图片资源'}
 *      showReloadBtn={'是否展示重新加载按钮'}
 *      netFailedInfo={'出错的信息'}
 *      reloadBtnClick={() => {console.warn('在这里做点击回调，回调包括后面的参数都是可省的，不传使用默认');}}
 *      buttonText={'这是按钮上的文字'}
 * />
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    Keyboard,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import NetNotConnectImage from './source/net_error.png'; //用于断网，超时展示
import ServerErrorImage from './source/net_error.png'; //用于其他网络请求展示
import Systemupgrade from './source/Systemupgrade.png'; //用于f服务段code：9999展示
const BugErrorCode = -20000;       //异常错误，请稍后再试 js bug error
const SystemUpgradeCode = 9999;
// const NetUnKnowErrorCode = -20001; //未知错误,请稍后再试 (网络错误，但是没有错误码)
import DesignRule from '../../../constants/DesignRule';

export default class NetFailedView extends Component {

    static propTypes = {
        netFailedInfo: PropTypes.object.isRequired,         // 错误，来自网络的错误    或者 标准error
        reloadBtnClick: PropTypes.func.isRequired,          // 点击重新加载的回调函数
        showReloadBtn: PropTypes.bool,// 是否展示重新加载按钮
        buttonText: PropTypes.string,   // 重新加载按钮title
        //图片以及样式
        style: PropTypes.any,           // 样式
        source: PropTypes.any,          // 图片素材
        imageStyle: PropTypes.any      // 图片样式
    };

    // 默认属性
    static defaultProps = {
        buttonText: '重新加载', // 重新加载按钮title
        showReloadBtn: true
    };

    // 解析失败原因
    _getErrorInfo = () => {
        const netFailedInfo = this.props.netFailedInfo || {};
        if (netFailedInfo instanceof Error) {
            return {
                //BugErrorCode
                code: '',
                msg: '异常错误，请稍后再试'
            };
        } else {
            return {
                //netFailedInfo.code || NetUnKnowErrorCode
                code: '',
                msg: netFailedInfo.msg || '未知错误,请稍后再试'
            };
        }
    };


    // 获取需要展示的图片资源,如果是网络问题，展示断网图片，否则返回外部设置的，或者默认的错误图片
    _getImgSource = (source, code) => {
        if (Platform.OS === 'ios') {
            // ios -1001 连接超时 -1005 tcp断开 -1009 网络无连接
            if (code === BugErrorCode || code === -1001 || code === -1005 || code === -1009) {
                return NetNotConnectImage;
            }

            if (code === SystemUpgradeCode){//服务段定义：系统升级维护
                return Systemupgrade;
            }

            return source || ServerErrorImage;
        } else {
            // android 1006 连接超时 1007 网络无连接
            if (code === BugErrorCode || code === 1006 || code === 1007) {
                return NetNotConnectImage;
            }
            if (code === SystemUpgradeCode){//服务段定义：系统升级维护
                return Systemupgrade;
            }
            return source || ServerErrorImage;
        }
    };


    ///渲染按钮
    _renderReloadButton = (buttonText) => {
        ///按钮样式
        const btnStyle = [styles.btn];
        ///按钮文字样式
        const btnTextStyle = [styles.btnText];
        return (<TouchableOpacity activeOpacity={0.5} style={btnStyle} onPress={this.props.reloadBtnClick}>
            <Text style={btnTextStyle} allowFontScaling={false}>
                {buttonText}
            </Text>
        </TouchableOpacity>);
    };

    render() {
        let {
            style,
            source,
            imageStyle,
            buttonText,
            showReloadBtn
        } = this.props;
        const imgS = [styles.img, imageStyle];

        let {
            code,
            msg
        } = this._getErrorInfo();
        if (code === SystemUpgradeCode) {
            msg = '系统维护升级中';
            showReloadBtn =  false;
        }
        return (<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, style]}>

                <Image source={this._getImgSource(source, code)} style={imgS} resizeMode={'contain'}/>

                <Text style={styles.titleStyle} allowFontScaling={false}>
                    {msg}
                </Text>

                {showReloadBtn ? this._renderReloadButton(buttonText) : null}

            </View>
        </TouchableWithoutFeedback>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: DesignRule.bgColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        // marginTop: 116,
    },
    titleStyle: {
        fontSize: 15,
        color: DesignRule.textColor_instruction,
        marginTop: 28,
        textAlign: 'center',
        marginHorizontal: 15
    },
    btn: {
        width: 115,
        height: 36,
        borderRadius: 18,
        marginTop: 27,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: DesignRule.mainColor,
        backgroundColor: 'transparent'
    },
    btnText: {
        fontSize: 15,
        color: DesignRule.mainColor,
        textAlign: 'center'
    }
});
