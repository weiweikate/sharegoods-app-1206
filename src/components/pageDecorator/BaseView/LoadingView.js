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
    StyleSheet,
    // ActivityIndicator,
    Easing, Animated
} from 'react-native';
import DesignRule from '../../../constants/DesignRule';
// import res from '../../../comm/res';
import UIImage from "@mr/image-placeholder";
import MRLoadingView from '../../../comm/components/MRLoadingView';

// const { loading_bar } = res.other;

export default class LoadingView extends Component {

    static propTypes = {
        style: PropTypes.any,    // 样式
        source: PropTypes.any,   // loading-gif动图图片
        imgStyle: PropTypes.any // gif样式
    };

    constructor(props) {
        super(props);
        this.state = {
            rotateValue: new Animated.Value(0)
        };
    }

    componentDidMount() {
        if(!this.props.source){
            this.startLoading();
        }
    }


    // 渲染Gif图片或者系统自带的loading图片
    _renderLoading = (source, imgStyle) => {
        if (source) {
            return (<UIImage style={imgStyle} source={source}/>);
        } else {
            return(
                <View style={{overflow: 'hidden', borderRadius:5}}>
                    <MRLoadingView style={{width:70,height:70,backgroundColor:'rgba(0,0,0,0.6)',justifyContent:'center',alignItems:'center'}} />
                </View>);
        }
    };

    // 开始动画
    startLoading = () => {
        const animate = Animated.timing(this.state.rotateValue, {
            toValue: 1,      //角度从0变1
            duration: 2500,  //从0到1的时间
            easing: Easing.linear
        });

        Animated.loop(animate, { useNativeDriver: true }).start();
    };

    render() {
        const {
            style,
            source,
            imgStyle
        } = this.props;
        return (<View style={[styles.container,style]}>
            {this._renderLoading(source,imgStyle)}
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

