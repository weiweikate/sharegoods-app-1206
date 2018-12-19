import React from 'react';
import { Text as RNText } from 'react-native';
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
    return (<RNText {...attributes} allowFontScaling={false}>{value}</RNText>);
};

export class MRText extends React.Component{

    render(){
        return(<RNText {...this.props} allowFontScaling={false}>{this.props.children}</RNText>)
    }
}
export default connectStyle('Text')(UIText);
