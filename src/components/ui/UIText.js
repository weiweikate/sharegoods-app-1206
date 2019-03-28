import React from 'react';
import { Text as RNText, TextInput, StyleSheet } from 'react-native';
import connectStyle from './connectStyle';

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
    let size = theStyle.fontSize ? theStyle.fontSize * 1.4 : 0;
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
    let size = theStyle.fontSize ? theStyle.fontSize * 1.4 : 0;
    return (
        <RNText {...attributes}
                allowFontScaling={false}
                style={[props.style, { includeFontPadding: false }, size > 0 ? { lineHeight: size } : null]}>
            {props.children}
        </RNText>
    );
};

const MRTextInput = (props) => {
    return (
        <TextInput {...props}
                   allowFontScaling={false}/>
    );
};

export default connectStyle('Text')(UIText);
export { MRText, MRTextInput };
