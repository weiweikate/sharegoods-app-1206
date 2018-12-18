/**
 * 列表footer
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {View, Text, Easing, Animated, StyleSheet, TouchableOpacity} from 'react-native';
import LoadingImg from './source/sxin_03.png';
export default class ListFooter extends Component {
    static propTypes = {
        loadingMore: PropTypes.bool, //是否正在加载更多
        errorDesc: PropTypes.string, //错误描述
        onPressLoadError: PropTypes.func //出错时候点击回调
    };

    static defaultProps = {
        loadingMore: false,
        onPressLoadError: () => {
            console.warn('ListFooter: Youm may miss onPressLoadError func');
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            rotateValue: new Animated.Value(0),
        };
    }

    // 点不出错的时候，点击重新加载
    _clickError = () => {
        const { onPressLoadError } = this.props;
        onPressLoadError && onPressLoadError();
    };

    componentDidMount() {
        this.__Mount__ = true;
        this.startLoading();
    }

    componentWillUnmount() {
        this.__Mount__ = false;
    }

    // 判断是否继续动画
    judgeWhetherReload = ()=>{
        if(this.__Mount__){
            this.startLoading();
        } else {
            this.state.rotateValue.setValue(0);
        }
    };

    // 开始动画
    startLoading = ()=>{
        this.state.rotateValue.setValue(0);//首先至为0位置
        Animated.parallel([
            Animated.timing(this.state.rotateValue, {
                toValue: 1,      //角度从0变1
                duration: 800,  //从0到1的时间
                easing: Easing.out(Easing.linear),//线性变化，匀速旋转
            }),
        ]).start(this.judgeWhetherReload);
    };

    render() {
        let { errorDesc, loadingMore } = this.props;
        // 是否正在加载
        if (loadingMore) {
            return (
                <View style={[styles.container,{flexDirection: 'row',alignItems: 'center'}]}>
                    <Animated.Image style={{
                        transform: [{
                            rotateZ: this.state.rotateValue.interpolate({
                                inputRange: [0,1],
                                outputRange: ['0deg','360deg']
                            })
                        }]}} source={LoadingImg}/>
                    <Text style={{marginLeft: 8,color: '#B5B5B5',fontSize: 12}} allowFontScaling={false}>加载更多中...</Text>
                    {/*<ActivityIndicator animating={true} color={'gray'} size={'small'} />*/}
                </View>
            );
        }

        // 出错描述
        if (errorDesc) {
            errorDesc = typeof errorDesc === 'string' ? errorDesc : '未知错误~';
            return (
                <TouchableOpacity style={styles.container} onPress={this._clickError}>
                    <Text numberOfLines={2} style={styles.title} allowFontScaling={false}>
                        {`${errorDesc}\n点击重新加载`}
                    </Text>
                </TouchableOpacity>
            );
        }

        // 没有更多数据
        return (
            <View style={styles.container}>
                <Text num style={styles.title} allowFontScaling={false}>
                    到底啦~
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30
    },
    title: {
        color: '#B5B5B5',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18
    }
});
