import React from 'react'
import {Image, TouchableOpacity} from 'react-native'
import connectStyle from './connectStyle'

/**
 * @param props  使图片能够响应点击事件
 * @returns {*}
 * @constructor
 */
const UIImage = (props) => {
    const {themeStyle,style,onPress, ...imgProps} = props;
    return onPress?
        <TouchableOpacity onPress={onPress}>
            <Image style={[themeStyle.img,style]}{...imgProps} />
        </TouchableOpacity>:<Image style={[themeStyle.img,style]}{...imgProps} />

};

export default connectStyle('Image')(UIImage)
