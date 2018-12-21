import React from 'react';
import { Text as RNText, TextInput } from 'react-native';
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
    return (
        <RNText {...attributes}
                allowFontScaling={false}
                style={[props.style, { includeFontPadding: false }]}>
            {value}
        </RNText>
    );
};

const MRText = (props) => {
    const {
        ...attributes
    } = props;
    return (
        <RNText {...attributes}
                allowFontScaling={false}
                style={[props.style, { includeFontPadding: false }]}>
            {props.children}
        </RNText>
    );
};

const MRTextInput = (props) => {
    return (
        <TextInput {...props}
                   allowFontScaling={false}
                   underlineColorAndroid={'transparent'}
                   style={[{ padding: 0 }, props.style]}/>
    );
};

export default connectStyle('Text')(UIText);
export { MRText, MRTextInput }
