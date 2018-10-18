import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Modal,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
const MAX_SCREEN = Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
const PANNELHEIGHT = 203;
const Animated_Duration = 300; //默认的动画持续时间
export default class ConfirmAlert extends Component {

    static propTypes = {
        confirmCallBack: PropTypes.func, //点击确定的回调函数
    };

    static defaultProps = {
        confirmCallBack: () => {
            console.warn('DelAnnouncementAlert miss confirmCallBack func');
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            height: PANNELHEIGHT,
            title: props.title,
            confirmCallBack: props.confirmCallBack,
            //私有state
            modalVisible: false, //是否显示
            top: new Animated.Value(-PANNELHEIGHT), //白色面板顶部距离屏幕底部
            backOpacity: new Animated.Value(0), //背景颜色
            alignType:'center'
        };
    }

    show = ({confirmCallBack,title,height,alignType})=>{
        this.setState({
            height: height || PANNELHEIGHT,
            alignType:alignType,
            title: title || this.state.title,
            confirmCallBack: confirmCallBack || this.state.confirmCallBack,
            modalVisible: true
        },this._startAnimated);
    };

    //开始动画
    _startAnimated = () => {
        //底部到顶部的
        Animated.parallel([
            Animated.timing(
                //透明度
                this.state.top,
                {
                    toValue: (MAX_SCREEN - this.state.height) / 2,
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
            this.setState({ modalVisible: false },()=>{
                if(cb && typeof cb === 'function'){
                    cb();
                }
            });
        });
    };

    _clickOk = ()=>{
        this._closeAnimated(()=>{
            this.state.confirmCallBack && this.state.confirmCallBack();
        });
    };

    render() {
        if (!this.state.modalVisible) {
            return null;
        }
        return (
            <Modal onRequestClose={this._closeAnimated} transparent={true} style={styles.container}>
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
                        style={[
                            styles.whitePanel,
                            {
                                top: this.state.top,
                                opacity: this.state.backOpacity,
                                height: this.state.height,
                            }
                        ]}
                    >
                        <View style={{flex: 1}}>
                            <Text style={{
                                fontFamily: "PingFang-SC-Medium",
                                fontSize: 15,
                                color: "#666666",
                                textAlign: this.state.alignType,
                                marginHorizontal: 15,
                                marginVertical:30,
                            }}>{this.state.title}</Text>
                        </View>
                        <View style={{flexDirection: 'row',alignItems: 'center',marginBottom: 27}}>
                            <TouchableOpacity onPress={this._clickOk} style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#e60012',
                                marginRight: 36,
                                width: 99,
                                height: 32,
                                borderRadius: 5,
                            }}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: 16,
                                    color: "#ffffff"
                                }}>确认</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._closeAnimated} style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#dddddd',
                                width: 99,
                                height: 32,
                                borderRadius: 5,
                            }}>
                                <Text style={{
                                    fontFamily: "PingFang-SC-Medium",
                                    fontSize: 16,
                                    color: "#999999"
                                }}>取消</Text>
                            </TouchableOpacity>
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
    titleContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    title: {
        textAlign: 'center',
        fontSize: 15,
        color: '#333'
    },
    whitePanel: {
        position: 'absolute',
        left: 40,
        right: 40,
        height: PANNELHEIGHT,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
    }
});

