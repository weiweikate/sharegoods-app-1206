/**
 * @providesModule FlyImageViewer
 * @flow
 * 多图浏览
 */

import React, { Component } from 'react';
import { ImageCacheManager } from 'react-native-cached-image'
import {
    TouchableOpacity,
    View,
    Image,
    Animated,
    TouchableHighlight,
    TouchableWithoutFeedback,
    CameraRoll,
    Platform,
    StyleSheet,
    ActionSheetIOS,
    Alert
} from 'react-native';
//import * as typings from './image-viewer.type'
// import {TransmitTransparently} from 'nt-transmit-transparently'
import ImageZoom from './FlyImageZoom';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import ImageLoad from '@mr/image-placeholder'
import {MRText as Text} from '../../components/ui';

let staticStyle = {
    show: false,
    currentShowIndex: 0,
    imageSizes: [],
    isShowMenu: false
};

declare var window: Window;
// var ScreenWidth = Dimensions.get('window').width;
//@TransmitTransparently('style')
export default class FlyImageViewer extends Component {

    getStyle(width: number, height: number) {
        return {
            modalContainer: {
                backgroundColor: DesignRule.textColor_mainTitle,
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            },
            watchOrigin: {
                position: 'absolute',
                width: width,
                bottom: 20,
                justifyContent: 'center',
                alignItems: 'center'
            },
            watchOriginTouchable: {
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 30,
                borderColor: 'white',
                borderWidth: 0.5,
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
            },
            watchOriginText: {
                color: 'white',
                backgroundColor: 'transparent'
            },
            imageStyle: {},
            container: {
                backgroundColor: DesignRule.textColor_mainTitle
            },
            // 多图浏览需要调整整体位置的盒子
            moveBox: {
                flexDirection: 'row',
                alignItems: 'center'
            },
            menuContainer: {
                position: 'absolute',
                width: width,
                height: height,
                left: 0,
                bottom: 0
            },
            menuShadow: {
                position: 'absolute',
                width: width,
                height: height,
                backgroundColor: DesignRule.textColor_mainTitle,
                left: 0,
                bottom: 0,
                opacity: 0.2,
                zIndex: 10
            },
            menuContent: {
                position: 'absolute',
                width: width,
                left: 0,
                bottom: 0,
                zIndex: 11
            },
            operateContainer: {
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                height: 40,
                borderBottomColor: DesignRule.textColor_placeholder,
                borderBottomWidth: 1
            },
            operateText: {
                color: DesignRule.textColor_mainTitle
            },
            loadingTouchable: {
                width: width,
                height: height
            },
            loadingContainer: {
                justifyContent: 'center',
                alignItems: 'center',
                width: width,
                height: height
            },
            failContainer: {
                justifyContent: 'center',
                alignItems: 'center',
                width: width,
                height: height
            },
            failImage: {
                width: 90,
                height: 60
            },
            arrowLeftContainer: {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                justifyContent: 'center'
            },
            arrowRightContainer: {
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                justifyContent: 'center'
            }
        };
    }

    static defaultProps = {
        show: false,
        imageUrls: [],
        enableImageZoom: true,
        visible: false,

        flipThreshold: 80,
        maxOverflow: 300,
        failImageSource: '',
        index: 0,
        saveToLocalByLongPress: true,
        menuContext: {
            saveToLocal: '保存到相册',
            cancel: '取消'
        },

        onShowModal: () => {
        }
        ,
        onCancel: () => {
        },

        loadingRender: () => {
            return null;
        },

        onSaveToCamera: () => {
        },

        onChange: () => {
        }
        ,
        onClick: (close?: Function) => {
            close();
        },

        onDoubleClick: (close?: Function) => {

        },

        renderHeader: () => {
            return null;
        },

        renderFooter: () => {
            return null;
        },

        renderIndicator: (currentIndex: number, allSize: number) => {
            return React.createElement(View, { style: simpleStyle.count }, React.createElement(Text, { style: simpleStyle.countText }, currentIndex + '/' + allSize));
        },

        renderArrowLeft: () => {
            return null;
        },

        renderArrowRight: () => {
            return null;
        }
    };
    state = {
        show: false,
        currentShowIndex: 0,
        imageSizes: [],
        isShowMenu: false
    };

    // 背景透明度渐变动画
    fadeAnim = new Animated.Value(0);

    // 当前基准位置
    standardPositionX = 0;

    // 整体位移，用来切换图片用
    positionXNumber = 0;
    positionX = new Animated.Value(0);

    width = 0;
    height = 0;


    styles = this.getStyle(0, 0);
    // 是否执行过 layout. fix 安卓不断触发 onLayout 的 bug
    hasLayout = false;

    // 记录已加载的图片 index
    loadedIndex = new Map();

    componentWillMount() {
        this.init(this.props);
    }

    /**
     * props 有变化时执行
     */
    init(nextProps) {
        if (nextProps.imageUrls.length === 0) {
            // 隐藏时候清空
            this.fadeAnim.setValue(0);
            return this.setState(staticStyle);
        }

        // 给 imageSizes 塞入空数组
        const imageSizes = [];
        nextProps.imageUrls.forEach(imageUrl => {
            imageSizes.push({
                width: imageUrl.width || 0,
                height: imageUrl.height || 0,
                status: 'loading'
            });
        });

        this.setState({
            currentShowIndex: nextProps.index,
            imageSizes
        }, () => {
            // 立刻预加载要看的图
            this.loadImage(nextProps.index);

            this.jumpToCurrentImage();

            // 显示动画
            Animated.timing(this.fadeAnim, {
                toValue: 1,
                duration: 200
            }).start();
        });
    }

    /**
     * 调到当前看图位置
     */
    jumpToCurrentImage() {
        // 跳到当前图的位置
        this.positionXNumber = -this.width * this.state.currentShowIndex;
        this.standardPositionX = this.positionXNumber;
        this.positionX.setValue(this.positionXNumber);
    }

    /**
     * 加载图片
     */
    loadImage(index: number) {
        if (this.loadedIndex.has(index)) {
            return;
        }
        this.loadedIndex.set(index, true);

        const image = this.props.imageUrls[index];
        let imageStatus = Object.assign({}, this.state.imageSizes[index]);

        // 保存 imageSize
        const saveImageSize = () => {
            // 如果已经 success 了，就不做处理
            if (this.state.imageSizes[index] && this.state.imageSizes[index].status !== 'loading') {
                return;
            }

            const imageSizes = this.state.imageSizes.slice();
            imageSizes[index] = imageStatus;
            this.setState({
                imageSizes
            });
        };

        if (this.state.imageSizes[index].status === 'success') {
            // 已经加载过就不会加载了
            return;
        }

        // 如果已经有宽高了，直接设置为 success
        if (this.state.imageSizes[index].width > 0 && this.state.imageSizes[index].height > 0) {
            imageStatus.status = 'success';
            saveImageSize();
            return;
        }

        // 是否加载完毕了图片大小
        let sizeLoaded = false;
        // 是否加载完毕了图片
        let imageLoaded = false;

        if (Platform.OS !== 'web') {
            const prefetchImagePromise = Image.prefetch(image);

            // 图片加载完毕回调
            prefetchImagePromise.then(() => {
                imageLoaded = true;
                if (sizeLoaded) {
                    imageStatus.status = 'success';
                    saveImageSize();
                }
            }, () => {
                // 预加载失败
                imageStatus.status = 'fail';
                saveImageSize();
            });

            // 获取图片大小
            if (image.width && image.height) {
                // 如果已经传了图片长宽,那直接 success
                sizeLoaded = true;
                imageStatus.width = image.width;
                imageStatus.height = image.height;
                imageStatus = this.setImageWidthToScreenWidth(imageStatus);

                if (imageLoaded) {
                    imageStatus.status = 'success';
                    saveImageSize();
                }
            } else {
                Image.getSize(image, (width, height) => {
                    sizeLoaded = true;
                    imageStatus.width = width;
                    imageStatus.height = height;
                    imageStatus = this.setImageWidthToScreenWidth(imageStatus);

                    if (imageLoaded) {
                        imageStatus.status = 'success';
                        saveImageSize();
                    }
                }, (error) => {
                    // 获取大小失败
                    imageStatus.status = 'fail';
                    saveImageSize();
                });
            }
        } else {
            const imageFetch = new window.Image();
            imageFetch.src = image;
            imageFetch.onload = () => {
                imageStatus.width = imageFetch.width;
                imageStatus.height = imageFetch.height;
                imageStatus.status = 'success';
                saveImageSize();
            };
            imageFetch.onerror = () => {
                imageStatus.status = 'fail';
                saveImageSize();
            };
        }
    }

    setImageWidthToScreenWidth = (imageStatus) => {
        if (imageStatus) {
            let scale = imageStatus.width / ScreenUtils.width;
            imageStatus.height = imageStatus.height / scale;
            imageStatus.width = ScreenUtils.width;
        }
        return imageStatus;

    };


    /**
     * 触发溢出水平滚动
     */
    handleHorizontalOuterRangeOffset(offsetX: number) {
        this.positionXNumber = this.standardPositionX + offsetX;
        this.positionX.setValue(this.positionXNumber);

        if (offsetX < 0) {
            if (this.state.currentShowIndex < this.props.imageUrls.length - 1) {
                this.loadImage(this.state.currentShowIndex + 1);
            }
        } else if (offsetX > 0) {
            if (this.state.currentShowIndex > 0) {
                this.loadImage(this.state.currentShowIndex - 1);
            }
        }
    }

    /**
     * 手势结束，但是没有取消浏览大图
     */
    handleResponderRelease(vx: number) {
        if (vx > 0.7) {
            // 上一张
            this.goBack.call(this);

            // 这里可能没有触发溢出滚动，为了防止图片不被加载，调用加载图片
            if (this.state.currentShowIndex > 0) {
                this.loadImage(this.state.currentShowIndex - 1);
            }
        } else if (vx < -0.7) {
            // 下一张
            this.goNext.call(this);
            if (this.state.currentShowIndex < this.props.imageUrls.length - 1) {
                this.loadImage(this.state.currentShowIndex + 1);
            }
        }

        if (this.positionXNumber - this.standardPositionX > this.props.flipThreshold) {
            // 上一张
            this.goBack.call(this);
        } else if (this.positionXNumber - this.standardPositionX < -this.props.flipThreshold) {
            // 下一张;
            this.goNext.call(this);
        } else {
            // 回到之前的位置
            this.resetPosition.call(this);
        }
    }

    /**
     * 到上一张
     */
    goBack() {
        if (this.state.currentShowIndex === 0) {
            // 回到之前的位置
            this.resetPosition.call(this);
            return;
        }

        this.positionXNumber = this.standardPositionX + this.width;
        this.standardPositionX = this.positionXNumber;
        Animated.timing(this.positionX, {
            toValue: this.positionXNumber,
            duration: 100
        }).start();

        this.setState({
            currentShowIndex: this.state.currentShowIndex - 1
        }, () => {
            this.props.onChange(this.state.currentShowIndex);
        });
    }

    /**
     * 到下一张
     */
    goNext() {
        if (this.state.currentShowIndex === this.props.imageUrls.length - 1) {
            // 回到之前的位置
            this.resetPosition.call(this);
            return;
        }

        this.positionXNumber = this.standardPositionX - this.width;
        this.standardPositionX = this.positionXNumber;
        Animated.timing(this.positionX, {
            toValue: this.positionXNumber,
            duration: 100
        }).start();

        this.setState({
            currentShowIndex: this.state.currentShowIndex + 1
        }, () => {
            this.props.onChange(this.state.currentShowIndex);
        });
    }

    /**
     * 回到原位
     */
    resetPosition() {
        this.positionXNumber = this.standardPositionX;
        Animated.timing(this.positionX, {
            toValue: this.standardPositionX,
            duration: 150
        }).start();
    }

    /**
     * 长按
     */
    handleLongPress(image) {
        if (this.props.saveToLocalByLongPress) {
            // 出现保存到本地的操作框
            // this.setState({
            //     isShowMenu: true
            // });
            let that = this;
            if (Platform.OS === 'ios'){
                ActionSheetIOS.showActionSheetWithOptions({
                        options: ['取消', '保存图片到相册'],
                        // title: null,
                        cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                        if (buttonIndex === 1) {that.saveToLocal()}
                    });
            }else {

                Alert.alert(
                    '保存图片',
                    null,
                    [
                        {text: '取消', onPress: () => console.log('取消'),style: 'cancel'},
                        {text: '保存图片到相册', onPress: () => that.saveToLocal()}
                    ],
                    { cancelable: false }
                )
            }
        }
    }

    /**
     * 单击
     */
    handleClick() {
        this.props.onClick(this.handleCancel.bind(this));
    }

    /**
     * 双击
     */
    handleDoubleClick() {
        this.props.onDoubleClick(this.handleCancel.bind(this));
    }

    /**
     * 退出
     */
    handleCancel() {
        this.hasLayout = false;
        this.props.onCancel();
    }

    /**
     * 完成布局
     */
    handleLayout(event: React.LayoutChangeEvent) {
        if (this.hasLayout) {
            return;
        }

        this.hasLayout = true;

        this.width = event.nativeEvent.layout.width;
        this.height = event.nativeEvent.layout.height;
        this.styles = this.getStyle(this.width, this.height);

        // 强制刷新
        this.forceUpdate();
        this.jumpToCurrentImage();
    }

    /**
     * 获得整体内容
     */
    getContent() {
        // 获得屏幕宽高
        const screenWidth = this.width;
        const screenHeight = this.height;

        const ImageElements = this.props.imageUrls.map((image, index) => {
            let width = this.state.imageSizes[index] && this.state.imageSizes[index].width;
            let height = this.state.imageSizes[index] && this.state.imageSizes[index].height;
            const imageInfo = this.state.imageSizes[index];

            // 如果宽大于屏幕宽度,整体缩放到宽度是屏幕宽度
            if (width > screenWidth) {
                const widthPixel = screenWidth / width;
                width *= widthPixel;
                height *= widthPixel;
            }

            // 如果此时高度还大于屏幕高度,整体缩放到高度是屏幕高度
            if (height > screenHeight) {
                const HeightPixel = screenHeight / height;
                width *= HeightPixel;
                height *= HeightPixel;
            }

            if (imageInfo.status === 'success' && this.props.enableImageZoom) {

                return (
                    <ImageZoom key={index}
                               style={this.styles.modalContainer}
                               cropWidth={this.width}
                               cropHeight={this.height}
                               imageWidth={width}
                               imageHeight={height}
                               longPressTime={600}
                               maxOverflow={this.props.maxOverflow}
                               horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset.bind(this)}
                               responderRelease={this.handleResponderRelease.bind(this)}
                               onLongPress={this.handleLongPress.bind(this, image)}
                               onClick={this.handleClick.bind(this)}
                               onDoubleClick={this.handleDoubleClick.bind(this)}>
                        <ImageLoad style={[this.styles.imageStyle, { width: width, height: height }]}
                               source={{ uri: image }}/>
                    </ImageZoom>
                );
            } else {
                switch (imageInfo.status) {
                    case 'loading':
                        return (
                            <TouchableHighlight key={index}
                                                onPress={this.handleClick.bind(this)}
                                                style={this.styles.loadingTouchable}>
                                <View style={this.styles.loadingContainer}>
                                    {this.props.loadingRender()}
                                </View>
                            </TouchableHighlight>
                        );
                    case 'success':
                        return (
                            <ImageLoad key={index}
                                   style={[this.styles.imageStyle, { width: width, height: height }]}
                                   source={{ uri: image }}/>
                        );
                    case 'fail':
                        return (
                            <ImageZoom key={index}
                                       style={this.styles.modalContainer}
                                       cropWidth={this.width}
                                       cropHeight={this.height}
                                       imageWidth={width}
                                       imageHeight={height}
                                       maxOverflow={this.props.maxOverflow}
                                       horizontalOuterRangeOffset={this.handleHorizontalOuterRangeOffset.bind(this)}
                                       responderRelease={this.handleResponderRelease.bind(this)}
                                       onLongPress={this.handleLongPress.bind(this, image)}
                                       onClick={this.handleClick.bind(this)}
                                       onDoubleClick={this.handleDoubleClick.bind(this)}>
                                <TouchableOpacity key={index}
                                                  style={this.styles.failContainer}>
                                    <ImageLoad source={this.props.failImageSource}
                                           style={this.styles.failImage}/>
                                </TouchableOpacity>
                            </ImageZoom>
                        );
                }
            }
        });

        return (
            <Animated.View style={[this.styles.container, { opacity: this.fadeAnim }]}>
                {this.props.renderHeader()}

                <View style={this.styles.arrowLeftContainer}>
                    <TouchableWithoutFeedback onPress={this.goBack.bind(this)}>
                        <View>
                            {this.props.renderArrowLeft()}
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <View style={this.styles.arrowRightContainer}>
                    <TouchableWithoutFeedback onPress={this.goNext.bind(this)}>
                        <View>
                            {this.props.renderArrowRight()}
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <Animated.View
                    style={[this.styles.moveBox, { transform: [{ translateX: this.positionX }] }, { width: this.width * this.props.imageUrls.length }]}>
                    {ImageElements}
                </Animated.View>

                {this.props.imageUrls.length > 1 &&
                this.props.renderIndicator(this.state.currentShowIndex + 1, this.props.imageUrls.length)
                }

                {this.props.imageUrls[this.state.currentShowIndex].originSizeKb && this.props.imageUrls[this.state.currentShowIndex].originUrl &&
                <View style={this.styles.watchOrigin}>
                    <TouchableOpacity style={this.styles.watchOriginTouchable}>
                        <Text style={this.styles.watchOriginText} allowFontScaling={false}>查看原图(2M)</Text>
                    </TouchableOpacity>
                </View>
                }

                {this.props.renderFooter()}
            </Animated.View>
        );
    }

    /**
     * 保存当前图片到本地相册
     */
    saveToLocal() {
        if (!this.props.onSave) {
            let that = this;
            if (Platform.OS === 'ios'){
                CameraRoll.saveToCameraRoll(that.props.imageUrls[that.state.currentShowIndex])
                    .then(()=> {that.props.onSaveToCamera(that.state.currentShowIndex);});
            }else {
                ImageCacheManager().downloadAndCacheUrl(this.props.imageUrls[this.state.currentShowIndex]).then(((path)=>{
                    CameraRoll.saveToCameraRoll(path)
                        .then(()=> {that.props.onSaveToCamera(that.state.currentShowIndex);})
                }));
            }

        } else {
            this.props.onSave(this.props.imageUrls[this.state.currentShowIndex]);
        }

        // this.setState({
        //     isShowMenu: false
        // });
    }

    getMenu() {
        if (!this.state.isShowMenu) {
            return null;
        }

        return (
            <View style={this.styles.menuContainer}>
                <View style={this.styles.menuShadow}/>
                <View style={this.styles.menuContent}>
                    <TouchableHighlight underlayColor={DesignRule.color_f2}
                                        onPress={this.saveToLocal.bind(this)}
                                        style={this.styles.operateContainer}>
                        <Text style={this.styles.operateText} allowFontScaling={false}>{this.props.menuContext.saveToLocal}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={DesignRule.color_f2}
                                        onPress={this.handleLeaveMenu.bind(this)}
                                        style={this.styles.operateContainer}>
                        <Text style={this.styles.operateText} allowFontScaling={false}>{this.props.menuContext.cancel}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    handleLeaveMenu() {
        this.setState({
            isShowMenu: false
        });
    }

    render() {
        let childs = null;

        childs = (
            <View>
                {this.getContent()}
                {this.getMenu()}
            </View>
        );

        return (
            <View onLayout={this.handleLayout.bind(this)}
                  style={[{ flex: 1, overflow: 'hidden' }, this.props.style]} {...this.props.others}>
                {childs}
            </View>
        );

    }
}
const simpleStyle = StyleSheet.create({
    count: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    countText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {
            width: 0, height: 0.5
        },
        textShadowRadius: 0
    }
});
