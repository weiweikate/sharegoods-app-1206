import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    TextInput,
    StyleSheet
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class SearchBar extends Component {

    static propTypes = {
        placeholder: PropTypes.string.isRequired,//占位字符
        onChangeText: PropTypes.func,
        onSubmitEditing: PropTypes.func,
        cancel: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            inputText: ''
        };
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

    onSubmitEditing = (text) => {
        //把输入框中的文字传给父组件
        if (this.props.onSubmitEditing) {
            this.props.onSubmitEditing(text);
        }
    };

    render() {
        return (
            <View style={[{ height: ScreenUtils.headerHeight, width: ScreenUtils.width }, this.props.style]}>
                <View style={{ marginTop: ScreenUtils.statusBarHeight, flex: 1 }}>
                    <View style={{ height: 30, borderRadius: 15, backgroundColor: '#F7F7F7' }}>
                        <TextInput style={styles.inputText}
                                   keyboardType='web-search'
                                   underlineColorAndroid='transparent'
                                   placeholder={this.props.placeholder}
                                   placeholderTextColor='#C8C8C8'
                                   value={this.state.inputText}
                                   onChangeText={(text) => this.onChangeText(text)}
                                   onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}
                                   ref={'textInput'}/>
                    </View>
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({});

