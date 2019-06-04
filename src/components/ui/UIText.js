import React from 'react';
import { Text as RNText, TextInput, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import connectStyle from './connectStyle';
import UITextInputCancel from './UITextInputCancel.png';

/**
 *
 * @param props  赋予文字可以响应点击事件
 * @returns {*}
 * @constructor
 */
const UIText = (props) => {
    const {
        value,
        ...attributes
    } = props;
    let theStyle = StyleSheet.flatten(props.style);
    let size = theStyle && theStyle.fontSize ? theStyle.fontSize * 1.5 : 0;
    return (
        <RNText {...attributes}
                allowFontScaling={false}
                style={[props.style, { includeFontPadding: false }, size > 0 ? { lineHeight: size } : null]}>
            {value}
        </RNText>
    );
};

const MRText = (props) => {
    const {
        ...attributes
    } = props;
    let theStyle = StyleSheet.flatten(props.style);
    let size = theStyle && theStyle.fontSize ? theStyle.fontSize * 1.5 : 0;
    return (
        <RNText {...attributes}
                allowFontScaling={false}
                style={[props.style, { includeFontPadding: false }, size > 0 ? { lineHeight: size } : null]}>
            {props.children}
        </RNText>
    );
};

class MRTextInputWithCancel extends React.Component {

    state = {
        showCancel: false
    };

    onChangeText = (text, onChangeText) => {
        this.changeShow(text);
        onChangeText && onChangeText(text);
    };

    changeShow = (text) => {
        const showCancel = text.length > 0;
        (showCancel !== this.state.showCancel) && this.setState({
            showCancel: showCancel
        });
    };

    render() {
        const { onChangeText, onFocus, value, style, ...attributes } = this.props;
        const { color, fontSize, ...styles } = style;
        const { showCancel } = this.state;
        return (
            <View style={{ ...styles, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput style={{ flex: 1, padding: 0, color, fontSize }}
                           onChangeText={(text) => {
                               this.onChangeText(text, onChangeText);
                           }}
                           allowFontScaling={false}
                           value={value}
                           onFocus={(nativeEvent) => {
                               this.changeShow(value);
                               onFocus && onFocus(nativeEvent);
                           }}
                           {...attributes}/>
                {showCancel && <TouchableOpacity onPress={() => {
                    this.onChangeText('', onChangeText);
                }}>
                    <Image style={{ width: 16, height: 16 }} source={UITextInputCancel}/>
                </TouchableOpacity>}
            </View>
        );
    }
}

const MRTextInput = (props) => {
    return (
        <TextInput {...props}
                   allowFontScaling={false}/>
    );
};

export default connectStyle('Text')(UIText);
export { MRText, MRTextInputWithCancel, MRTextInput };
