/**
 * 数据为空，常用于跟列表有关的页面中去
 * 使用示例：
 * <EmptyView
 *      style={'这里是style，可以自定义'}
 *      source={'自定义图片资源'}
 *      imageStyle={'这里自定义图片的样式'}
 *      description={'为空页面主描述信息'}
 *      isScrollViewContainer={'是否含有下拉刷新功能'}
 *      isRefresh={'标记当前是否处于下拉刷新状态'}
 *      onRefresh={'包含下拉刷新组件时，下拉刷新调用'}
 * />
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    Keyboard,
    Dimensions,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableWithoutFeedback,
} from 'react-native';
import EmptyImage from './source/no_data.png';
import DesignRule from 'DesignRule';

export default class EmptyView extends Component {

    static propTypes = {
        description: PropTypes.string, // 标题描述
        source: PropTypes.any, // 图片
        imageStyle: PropTypes.any, // 图片样式
        // 含有刷新功能
        isScrollViewContainer: PropTypes.bool,//是否允许下拉刷新
        isRefresh: PropTypes.bool, // 仅仅在isScrollViewContainer 为true时 生效
        onRefresh: PropTypes.func, // 仅仅在isScrollViewContainer 为true时会触发
    };

    static defaultProps = {
        description: '暂无数据', // 标题
        isScrollViewContainer: false,
        onRefresh: () => {
            console.warn('Warn: Check whether set click onRefresh on EmptyView~');
        },
    };

    //todo __BARHEIGHT__
    constructor(props) {
        super(props);
        this.state = {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 44
            //height: Dimensions.get('window').height - __BARHEIGHT__,
        };
    }

    // 获取scrollView容器宽高。
    _scrollViewOnLayout = (event) => {
        const {width, height} = event.nativeEvent.layout;
        this.setState({width, height});
    };


    // 渲染正常为空页面
    renderNormalEmptyView = () => {
        const {
            style,
            imageStyle,
            description,
        } = this.props;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container, style]}>
                    <Image source={this._getImgSource()} style={[styles.img, imageStyle]}/>
                    <Text style={styles.description}>{description}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    _getImgSource = () => {
        const {source} = this.props;
        return source || EmptyImage;
    };


    // 渲染含有下拉刷新的为空页面
    renderScrollViewContainerEmptyView = () => {
        const {
            style,
            imageStyle,
            description,
        } = this.props;
        const {width, height} = this.state;
        return (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onLayout={this._scrollViewOnLayout}
                refreshControl={this.renderRefreshControl()}
                style={[styles.scrollViewContainer, style]}
            >

                <View style={[styles.container, {width, height}]}>
                    <Image
                        source={this._getImgSource()}
                        style={[styles.img, imageStyle]}
                    />
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>

            </ScrollView>
        );
    };

    // 刷新组件头
    renderRefreshControl = () => {
        if (typeof this.props.isRefresh !== 'boolean') {
            return null;
        }
        return <RefreshControl
            refreshing={this.props.isRefresh}
            onRefresh={this.props.onRefresh}
            progressBackgroundColor="#ffffff"
        />;
    };

    render() {
        // 根据是否需要支持下拉刷新决定渲染何种类型空页面
        const {isScrollViewContainer} = this.props;
        if (isScrollViewContainer) {
            return this.renderScrollViewContainerEmptyView();
        }
        return this.renderNormalEmptyView();
    }
}


const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    },
    img: {
        marginTop: 116,
    },
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    description: {
        fontSize: 15,
        color: DesignRule.textColor_instruction,
        marginTop: 28,
        textAlign: 'center',
    }
});
