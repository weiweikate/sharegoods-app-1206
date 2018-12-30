import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import { MRText as Text, MRTextInput as TextInput } from '../../../../components/ui';


export default class SearchBar extends Component {

    static propTypes = {
        placeholder: PropTypes.string,//占位字符
        onChangeText: PropTypes.func,
        onSubmitEditing: PropTypes.func.isRequired,
        cancel: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            inputText: ''
        };
    }


    onChangeText = (text) => {
        if (text !== '') {
            this.setState({
                isShowInputClear: true,
                inputText: text
            });
        } else {
            this.setState({
                isShowInputClear: false,
                inputText: text
            });
        }

        text = StringUtils.trim(text);
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    };

    onSubmitEditing = (text) => {
        text = StringUtils.trim(text);
        //把输入框中的文字传给父组件
        if (this.props.onSubmitEditing) {
            this.props.onSubmitEditing(text);
        }
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.contentView}>
                    <View style={styles.inputView}>
                        <TextInput style={{ marginLeft: 24, padding: 0 }}
                                   keyboardType='web-search'
                                   placeholder={this.props.placeholder}
                                   placeholderTextColor={DesignRule.textColor_hint}
                                   value={this.state.inputText}
                                   onChangeText={(text) => this.onChangeText(text)}
                                   onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}/>

                    </View>
                    <TouchableOpacity onPress={this.props.cancel}>
                        <Text style={{ paddingRight: 15, color: DesignRule.textColor_instruction }}
                              allowFontScaling={false}>取消</Text>
                    </TouchableOpacity>
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: ScreenUtils.headerHeight,
        width: ScreenUtils.width,
        backgroundColor: 'white'
    },
    contentView: {
        marginTop: ScreenUtils.statusBarHeight,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputView: {
        height: 30,
        borderRadius: 15,
        backgroundColor: DesignRule.bgColor,
        justifyContent: 'center',
        flex: 1,
        marginLeft: 15,
        marginRight: 10
    }


});

