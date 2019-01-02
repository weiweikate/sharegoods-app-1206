import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Modal from '../../../comm/components/CommModal';
import {
    MRText as Text, MRTextInput as TextInput
} from '../../../components/ui';
const MAX_SCREEN = Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
const PANNELHEIGHT = ScreenUtils.autoSizeWidth(357);
const Animated_Duration = 300; //默认的动画持续时间
import DesignRule from '../../../constants/DesignRule';
import res from '../res'
import ScreenUtils from '../../../utils/ScreenUtils';

const KeFuIcon = res.jbtk_03;

export default class ReportAlert extends Component {

    static propTypes = {
        confirmCallBack: PropTypes.func //点击确定的回调函数
    };

    static defaultProps = {
        confirmCallBack: () => {
            console.warn('DelAnnouncementAlert miss confirmCallBack func');
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            height: PANNELHEIGHT,
            title: props.title,
            confirmCallBack: props.confirmCallBack,
            //私有state
            modalVisible: false, //是否显示
            top: new Animated.Value(-PANNELHEIGHT), //白色面板顶部距离屏幕底部
            backOpacity: new Animated.Value(0) //背景颜色
        };
    }

    show = ({ confirmCallBack, title, height }) => {
        this.setState({
            height: height || PANNELHEIGHT,
            title: title || this.state.title,
            confirmCallBack: confirmCallBack || this.state.confirmCallBack,
            modalVisible: true
        }, this._startAnimated);
    };

    //开始动画
    _startAnimated = () => {
        //底部到顶部的
        Animated.parallel([
            Animated.timing(
                //透明度
                this.state.top,
                {
                    toValue: (MAX_SCREEN - this.state.height) / 2 - ScreenUtils.autoSizeHeight(135),
                    duration: Animated_Duration
                }
            ),
            Animated.timing(
                //透明度
                this.state.backOpacity,
                {
                    toValue: 1,
                    duration: Animated_Duration
                }
            )
        ]).start();
    };

    /**
     * 关闭动画
     * @callBack 动画结束的回到函数
     **/
    _closeAnimated = (cb) => {
        Animated.parallel([
            Animated.timing(
                //透明度
                this.state.top,
                {
                    toValue: -this.state.height,
                    duration: (Animated_Duration * 2) / 3
                }
            ),
            Animated.timing(
                //透明度
                this.state.backOpacity,
                {
                    toValue: 0,
                    duration: (Animated_Duration * 2) / 3
                }
            )
        ]).start(() => {
            this.setState({ modalVisible: false }, () => {
                if (cb && typeof cb === 'function') {
                    cb();
                }
            });
        });
    };

    _clickOk = () => {
        if (!this.state.text) {
            return;
        }
        this._closeAnimated(() => {
            this.state.confirmCallBack && this.state.confirmCallBack(this.state.text);
        });
    };

    _onChangeText = (text) => {
        this.setState({ text });
    };

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        return (
            <Modal visible={this.state.modalVisible} onRequestClose={this._closeAnimated}
                   style={styles.container}>
                <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                    <Animated.View
                        style={[
                            styles.container,
                            {
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                opacity: this.state.backOpacity
                            }
                        ]}
                    />

                    <Animated.View
                        style={[{
                            position: 'absolute',
                            left: 40,
                            right: 40,
                            height: PANNELHEIGHT
                        },
                            {
                                top: this.state.top,
                                opacity: this.state.backOpacity,
                                height: this.state.height
                            }
                        ]}
                    >
                        <Image style={{ position: 'absolute', top: 0, zIndex: 1, alignSelf: 'center' }}
                               source={KeFuIcon}/>
                        <View style={styles.whitePanel}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    autoFocus
                                    multiline
                                    placeholder='请输入其他举报内容'
                                    placeholderTextColor={DesignRule.textColor_hint}
                                    value={this.state.text}
                                    onChangeText={this._onChangeText}
                                    style={styles.input}/>
                            </View>
                            <View style={styles.btnContainer}>
                                <TouchableOpacity onPress={this._clickOk} style={styles.submitContainer}>
                                    <Text style={styles.submitTitle}>提交</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this._closeAnimated} style={styles.cancelContainer}>
                                    <Text style={styles.cancelTitleText}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
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
        bottom: 0
    },
    whitePanel: {
        flex: 1,
        marginTop: 31,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5
    },
    inputContainer: {
        marginTop: 62,
        flex: 1,
        borderRadius: 2,
        backgroundColor: DesignRule.lineColor_inColorBg,
        padding: 10
    },
    input: {
        textAlignVertical: 'top',
        width: ScreenUtils.autoSizeWidth(211),
        color: DesignRule.textColor_mainTitle
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 15
    },
    submitContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.mainColor,
        marginRight: ScreenUtils.autoSizeWidth(36),
        width: ScreenUtils.autoSizeWidth(99),
        height: 34,
        borderRadius: 5
    },
    submitTitle: {
        fontSize: 14,
        color: 'white'
    },
    cancelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.lineColor_inGrayBg,
        width: ScreenUtils.autoSizeWidth(99),
        height: 34,
        borderRadius: 5
    },
    cancelTitleText: {
        fontSize: 14,
        color: DesignRule.textColor_instruction
    }
});

