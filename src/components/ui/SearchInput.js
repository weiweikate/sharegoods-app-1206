import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';
import close_input_img from './searchBar/input_clear.png';
import search_img from '../../pages/order/res/search_icon.png';
import {
    UIText, UIImage, MRTextInput as TextInput
} from '../../components/ui';
import left_arrow from '../../comm/res/button/icon_header_back.png';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import { MRText as Text } from './UIText';

/**
 * 搜索输入框组件
 */
class SearchInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //是否展示清除图片
            isShowInputClear: false,
            //搜索的关键字
            inputText: this.props.keyWord,
            searchString: this.props.searchString
        };
    }

    componentDidMount() {

        // 添加监听者
        this.listener = DeviceEventEmitter.addListener('inputText', (inputText) => {
            this.setState({
                inputText: inputText,
                isShowInputClear: true
            });
            //直接开始搜索
            if (this.props.onSubmitEditing) {
                this.props.onSubmitEditing(inputText);
            }
        });
    }

    componentWillUnmount() {
        // 销毁监听者
        this.listener.remove();
    }

    modalKeyBoard = () => {
        this.refs.textInput._onPress();
    };

    render() {
        return (
            <View style={[styles.container, { paddingTop: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 20 }]}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.buttonNavigateBack()}>
                    <UIImage source={left_arrow} style={{
                        width: 10,
                        height: 18
                    }}/>
                    <UIText value={''} style={{ fontSize: 13, textAlign: 'center', marginLeft: 5 }}/>
                </TouchableOpacity>
                <View style={styles.searchBox}>
                    <Image
                        style={{ marginLeft: 8, width: 12.5, height: 12.5 }}
                        source={search_img}
                    />
                    <TextInput style={styles.inputText}
                               keyboardType='web-search'
                               placeholder={this.props.placeHolder}
                               placeholderTextColor='#6C6F74'
                               value={this.state.inputText}
                               onChangeText={(text) => this.onChangeText(text)}
                        // onChangeText={this.onChangeText(text)}
                               onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}
                               ref={'textInput'}
                    />
                    {this.renderCloseImg()}
                </View>
                <TouchableOpacity onPress={this.finish}>
                    <Text style={styles.text}>{this.state.searchString}</Text>
                </TouchableOpacity>

            </View>
        );
    }

    onChangeText = (text) => {
        if (text === '') {
            this.setState({
                inputText: text,
                isShowInputClear: false
            });
        } else {
            this.setState({
                inputText: text,
                isShowInputClear: true
            });
        }
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    };
    buttonNavigateBack = () => {
        this.navigateBack();
    };
    finish = () => {
        //把子组件的点击事件传递给父组件，由父组件来finish掉整个页面
        // if (this.props.finish) {
        this.props.finish();
        // }
    };

    onSubmitEditing = (text) => {
        let inputText = text;
        this.setState({
            inputText: inputText,
            isShowInputClear: inputText.length > 0 ? true : false
        });
        ////把输入框中的文字传给父组件
        if (this.props.onSubmitEditing) {
            this.props.onSubmitEditing(inputText);
        }
    };

    renderCloseImg = () => {
        if (this.state.isShowInputClear) {
            return (
                <TouchableWithoutFeedback onPress={() => this.clearInput()}>
                    <Image style={styles.image} source={close_input_img}/>
                </TouchableWithoutFeedback>
            );
        }
    };

    clearInput = () => {
        this.setState({
            inputText: '',
            isShowInputClear: false
        });
    };

}

const styles = StyleSheet.create(
    {
        //根布局
        container: {
            flexDirection: 'row',   // 水平排布
            paddingLeft: 16,
            // paddingRight: 16,

            backgroundColor: 'white',
            alignItems: 'center' //元素垂直居中排布
        },

        searchBox: { //搜索框
            height: 32,
            flexDirection: 'row',   // 水平排布,输入文字后有X
            flex: 1,
            borderRadius: 4, //设置圆角边
            backgroundColor: '#F0F0F0',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
            marginBottom: 6,
            marginLeft: 5
        },

        inputText: {
            flex: 1,
            height: 40,
            fontSize: 12,
            marginLeft: 12
        },

        text: {
            marginLeft: 10,
            marginRight: 10,
            marginTop: 5,
            marginBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            fontSize: 14,
            color: DesignRule.textColor_mainTitle,
            backgroundColor: '#F0F0F0',
            borderRadius: 15
        },
        image: {
            width: 20,
            height: 20,
            marginRight: 3,
            alignItems: 'flex-end'
        }
    }
);
//因为要在其他类中使用
export default SearchInput;
