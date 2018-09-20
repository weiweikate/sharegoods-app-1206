import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';
import connectStyle from './connectStyle';

const UIButton = props => {
    const {
        value,
        style,
        txStyle,
        themeStyle,
        ...attributes
    } = props;

    return (
        <TouchableOpacity style={[themeStyle.btn_container, style && style]} {...attributes}>
            <Text style={[themeStyle.btn_text, txStyle && txStyle]}>
                {value}
            </Text>
        </TouchableOpacity>
    );
};


export default connectStyle('Button')(UIButton);
