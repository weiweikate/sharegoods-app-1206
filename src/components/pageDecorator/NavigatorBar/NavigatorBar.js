import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    Platform,
    StatusBar,
    PixelRatio,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import BackIcon from './source/icon_header_back.png';

const MAX_SCREENT = Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
const MIN_SCREENT = Math.min(Dimensions.get('window').width, Dimensions.get('window').height);
const IPHONEX = (MIN_SCREENT === 375.00 && MAX_SCREENT === 812.0);
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class NavigatorBar extends Component {

    static defaultProps = {

        title: '',

        leftNavImage: BackIcon,
        leftNavTitle: '',
        leftNavItemHidden: false,

        rightNavTitle: '',
        rightNavImage: null,
        rightNavItemHidden: false,

        hideNavBar: false,
        statusBarStyle: 'default',
        rightPressed: () => {
            console.warn('make sure you set rightPressed func~');
        }

    };

    static propTypes = {

        navigation: PropTypes.object,//导航

        headerStyle: PropTypes.object,
        title: PropTypes.string,
        titleStyle: PropTypes.object,

        leftNavTitle: PropTypes.string,
        leftNavImage: PropTypes.any,
        leftNavItemHidden: PropTypes.bool,

        rightNavTitle: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node,
            PropTypes.element
        ]),
        rightTitleStyle: PropTypes.any,
        rightNavImage: PropTypes.any,
        rightNavItemHidden: PropTypes.bool,

        hideNavBar: PropTypes.bool,
        statusBarStyle: PropTypes.string,
        leftPressed: PropTypes.func,
        rightPressed: PropTypes.func,

        renderRight: PropTypes.func
    };

    constructor(props) {
        super(props);
        const {
            title,
            hideNavBar,
            rightNavTitle,
            leftNavItemHidden,
            rightNavItemHidden
        } = props;
        this.state = {
            title,
            hideNavBar,
            rightNavTitle,
            leftNavItemHidden,
            rightNavItemHidden
        };
    }

    componentWillReceiveProps(props) {
        if (props.title !== this.state.title ||
            props.leftNavItemHidden !== this.state.leftNavItemHidden ||
            props.hideNavBar !== this.state.hideNavBar ||
            props.rightNavTitle !== this.state.rightNavTitle ||
            props.rightNavItemHidden !== this.state.rightNavItemHidden) {
            this.setState({
                title: props.title || this.state.title || '',
                hideNavBar: !!props.hideNavBar,
                rightNavTitle: props.rightNavTitle || this.state.rightNavTitle || '',
                leftNavItemHidden: !!props.leftNavItemHidden,
                rightNavItemHidden: !!props.rightNavItemHidden
            });
        }
    }

    //修改bar title 然后回调
    changeTitle = (newTitle, callBack) => {
        const title = (newTitle && typeof newTitle === 'string') ? newTitle : '';
        this.setState({ title }, callBack);
    };

    //修改右上角title
    changeRightTitle = (rightNavTitle, callBack) => {
        const title = (rightNavTitle && typeof rightNavTitle === 'string') ? rightNavTitle : '';
        this.setState({ rightNavTitle: title }, callBack);
    };

    //修改左item是否隐藏
    hiddenLeftItem = (hidden, callBack) => {
        this.setState({ leftNavItemHidden: !!hidden }, callBack);
    };

    //修改右item是否隐藏
    hiddenRightItem = (hidden, callBack) => {
        this.setState({ rightNavItemHidden: !!hidden }, callBack);
    };


    _onLeftPressed = () => {
        if (this.props.leftPressed) {
            this.props.leftPressed();
        } else {
            try {
                this.props.navigation.goBack();
            } catch (e) {
                console.warn('make sure you set leftPressed func~ or whether set navigation props' + e.toString());
            }
        }
    };

    _onRightPressed = () => {
        this.props.rightPressed && this.props.rightPressed();
    };

    //左边item
    _renderLeftItem = () => {
        const {
            leftNavImage,
            leftNavTitle
        } = this.props;

        if (this.state.leftNavItemHidden) {
            return null;
        }
        // 文案
        if (leftNavTitle && typeof leftNavTitle === 'string') {
            return <TouchableOpacity style={styles.left} onPress={this._onLeftPressed}>
                <Text numberOfLines={1}
                      allowFontScaling={false}
                      style={styles.button}>
                    {leftNavTitle || ''}
                </Text>
            </TouchableOpacity>;
        }
        // 图片
        if (leftNavImage) {
            return <TouchableOpacity style={[styles.left, { paddingLeft: 15 }]} onPress={this._onLeftPressed}>
                <Image
                    source={leftNavImage}
                    resizeMode={'stretch'}
                    style={{ height: 15, width: 15 }}
                />
            </TouchableOpacity>;
        }
        return null;
    };

    //右边item
    _renderRightItem = () => {

        if (this.state.rightNavItemHidden) {
            return null;
        }

        if (this.props.renderRight) {
            return <View style={styles.right}>
                {this.props.renderRight()}
            </View>;
        }

        const { rightNavImage } = this.props;
        const { rightNavTitle } = this.state;
        if (!rightNavImage && !rightNavTitle) {
            return null;
        }
        if (rightNavImage) {
            return <TouchableOpacity style={styles.right} onPress={this._onRightPressed}>
                <View>
                    <Image source={rightNavImage}/>
                </View>
            </TouchableOpacity>;
        }
        if (rightNavTitle && typeof rightNavTitle === 'string') {
            return <TouchableOpacity style={styles.right} onPress={this._onRightPressed}>
                <Text style={[styles.button, this.props.rightTitleStyle]}>{rightNavTitle || ''}</Text>
            </TouchableOpacity>;
        }
        return null;
    };

    _renderTitle = () => {
        const { title } = this.state;
        return (<Text style={styles.title} numberOfLines={1}>{title || ' '}</Text>);
    };

    _renderStatusBar = () => {
        if (Platform.OS === 'android') {
            return null;
        }
        const { statusBarStyle } = this.props;
        const _statusBarStyle = (statusBarStyle && ['light-content', 'default'].indexOf(statusBarStyle) >= 0) ? statusBarStyle : 'default';
        return (<StatusBar barStyle={_statusBarStyle}/>);
    };

    render() {
        if (this.state.hideNavBar) {
            return null;
        }

        const {
            headerStyle
        } = this.props;
        console.log(this.props.androidStatusH);
        return (
            <View style={[styles.navBar, headerStyle]}>
                {this._renderStatusBar()}
                {this._renderLeftItem()}
                {this._renderTitle()}
                {this._renderRightItem()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    navBar: { //考虑适配 iPhone X
        width: SCREEN_WIDTH,
        height: Platform.OS === 'ios' ? (IPHONEX ? 88 : 64) : 44 + global.androidStatusH,
        paddingTop: Platform.OS === 'ios' ? (IPHONEX ? 44 : 20) : global.androidStatusH,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
        borderBottomWidth: 1.0 / PixelRatio.get(),
        borderBottomColor: '#DCDCDC'
        // shadowColor: "rgba(0, 0, 0, 0.2)",
        // shadowOffset: {
        //     width: 0,
        //     height: 0
        // },
        // shadowRadius: 1,
        // shadowOpacity: 1
    },
    title: {
        fontSize: 17,
        color: '#222',
        backgroundColor: 'transparent'
    },
    left: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? (IPHONEX ? 44 : 20) : global.androidStatusH,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    leftImage: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? (IPHONEX ? 44 : 20) : global.androidStatusH,
        left: 40,
        bottom: 0,
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    right: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? (IPHONEX ? 44 : 20) : global.androidStatusH,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    button: {
        color: '#e60012',
        fontSize: 13
    }
});

