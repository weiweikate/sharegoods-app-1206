import React, { Component } from 'react';
import {
    View,
    Platform,
    StatusBar,
    Keyboard,
    Animated,
    PixelRatio,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import Modal from 'CommModal';
import DesignRule from 'DesignRule';
import {
    MRText as Text,
} from '../../../components/ui';

const MAX_SCREENT = Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
const MIN_SCREENT = Math.min(Dimensions.get('window').width, Dimensions.get('window').height);
const IPHONEX = (Platform.OS === 'ios') && (MIN_SCREENT === 375.00 && MAX_SCREENT === 812.0);

const SCREEN_HEIGHT = Dimensions.get('window').height;
const Animated_Duration = 300;//默认的动画持续时间

//默认回调。防止用户使用时，回调设置为空
const defaultCallBack = () => {
    console.warn('Warn: Check whether set callBack function on ChoosePicAlertView show~');
};


export default class ActionSheetView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',              //可省参数
            items: [],              //必传参数
            selectCallBack: null,   //选择后的回调
            cancelCallBack: null,   //取消后的回调 可省

            //私有state
            modalVisible: false,//是否显示
            panelTopToBottom: new Animated.Value(SCREEN_HEIGHT),//白色面板顶部距离屏幕底部
            backOpacity: new Animated.Value(0)//背景颜色
        };
        this.show = this.show.bind(this);
    }

    //开始动画
    _startAnimated = () => {
        Animated.timing(
            this.state.panelTopToBottom,
            {
                toValue: (SCREEN_HEIGHT - this._calculatePanelHeight()),
                duration: Animated_Duration
            }
        ).start();
        //透明度
        Animated.timing(
            this.state.backOpacity,
            {
                toValue: 1,
                duration: Animated_Duration
            }
        ).start();
    };

    /**
     * 关闭动画
     * @callBack 动画结束的回到函数
     **/
    _closeAnimated = (callBack) => {
        Animated.timing(
            this.state.panelTopToBottom,
            {
                toValue: SCREEN_HEIGHT,
                duration: Animated_Duration * 2 / 3
            }
        ).start();
        //透明度
        Animated.timing(
            this.state.backOpacity,
            {
                toValue: 0,
                duration: Animated_Duration * 2 / 3
            }
        ).start(() => {
            callBack && callBack();
            this.setState({ modalVisible: false });
        });
    };


    componentWillUnmount() {
        this.__timer__ && clearTimeout(this.__timer__);
    }

    /**
     * 弹起弹框或者关闭弹框。
     * @param params            参数title(string),items(Array)
     * @param selectCallBack    选中回调
     * @param cancelCallBack    取消回调
     */
    show(params = {}, selectCallBack, cancelCallBack) {

        //节流，防止用户操作过于频繁
        if (this.__timer__) {
            return;
        }
        this.__timer__ = setTimeout(() => {
            clearTimeout(this.__timer__);
            this.__timer__ = null;
        }, 1000);

        Keyboard.dismiss();
        if (this.state.modalVisible) {
            this._closeAnimated();
            return;
        }

        const { title, items = [] } = params;
        this.setState({
            title: title || '',
            items,
            selectCallBack: selectCallBack || defaultCallBack,
            cancelCallBack,
            modalVisible: true
        }, () => {
            this._startAnimated();
        });
    }

    // 计算面板行高
    _calculatePanelHeight = () => {
        return 50 * (this.state.items.length + (this.state.title ? 1 : 0)) + 10 + 50 + (IPHONEX ? 34 : 0) + (Platform.OS === 'android' ? StatusBar.currentHeight : 0);
    };

    _renderItem = (item, index, onPress) => {
        return <TouchableWithoutFeedback key={index}
                                         onPress={() => {
                                             onPress && onPress(item, index);
                                         }}>
            <View style={[styles.titleContainer, {
                borderBottomColor: DesignRule.lineColor_inWhiteBg,
                borderBottomWidth: 1.0 / PixelRatio.get()
            }]}>
                <Text style={[styles.title, onPress ? null : { color: DesignRule.bgColor_grayHeader }]}>{item}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };


    // 渲染可选项
    _renderArrItems = () => {
        const clickItemPress = (item, index) => {
            this._closeAnimated();
            this.state.selectCallBack && this.state.selectCallBack(item, index);
        };
        return this.state.items.map((item, index) => {
            return this._renderItem(item, index, clickItemPress);
        });
    };


    // 渲染取消按钮
    _renderCancel = (item, index, onPress) => {
        if (!IPHONEX) {
            return this._renderItem(item, index, onPress);
        }
        return <TouchableWithoutFeedback onPress={() => {
            onPress(index);
        }}>
            <View style={[styles.titleContainer, {
                height: 50 + 34,
                paddingBottom: 34
            }]}>
                <Text style={styles.title}>{item}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        // 隐藏
        const clickHidden = () => {
            this._closeAnimated(this.state.cancelCallBack);
        };
        return (
            <Modal onRequestClose={clickHidden}  visible={this.state.modalVisible}>
                <TouchableWithoutFeedback disabled={!this.state.modalVisible} onPress={clickHidden}>
                    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

                        <Animated.View style={[styles.container, {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            opacity: this.state.backOpacity
                        }]}/>


                        <Animated.View style={[styles.whitePanel, {
                            height: this._calculatePanelHeight(),
                            top: this.state.panelTopToBottom
                        }]}>

                            {this.state.title ? this._renderItem(this.state.title, 0, null) : null}

                            {this._renderArrItems()}

                            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>

                            {this._renderCancel('取消', 999, clickHidden)}

                        </Animated.View>

                    </View>
                </TouchableWithoutFeedback>
            </Modal>);
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    title: {
        textAlign: 'center',
        marginHorizontal: 16,
        fontSize: 15,
        color: DesignRule.textColor_mainTitle
    },
    whitePanel: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'white'
    }
});
