/**
 * 后期可根据项目中使用的
 * loading展示页面
 * 使用示例：
 * <LoadingView style={'这里是style，可以自定义'}/>
 * <LoadingView style={'这里是style，可以自定义'} source={GifImg} imgStyle={{width: 100, height: 100}}/>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet
} from 'react-native';
import DesignRule from '../../../constants/DesignRule';
import LottieView from 'lottie-react-native';

export default class LoadingView extends Component {

    static propTypes = {
        style: PropTypes.any,    // 样式
        source: PropTypes.any,   // loading-gif动图图片
        imgStyle: PropTypes.any // gif样式
    };


    _renderLoading = () => {
        return (
            <LottieView
                style={{ width: 55, height: 55, justifyContent: 'center', alignItems: 'center' }}
                loop={true}
                autoPlay={true}
                source={require('../../../comm/components/lottieheader/loading.json')}/>
        );
    };

    render() {
        const {
            style,
            source,
            imgStyle
        } = this.props;
        return (<View style={[styles.container, style]}>
            {this._renderLoading(source, imgStyle)}
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.bgColor
    }
});

