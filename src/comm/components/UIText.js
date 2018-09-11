import React from 'react'
import {Text as RNText} from 'react-native'
const UIText = (props) => {
    const {
        value,
        ...attributes
    } = props;
    return (<RNText {...attributes}>{value}</RNText>)
};

export default UIText
