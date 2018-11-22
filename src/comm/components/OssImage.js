/**
 * @author xzm
 * @date 2018/11/16
 *  @providesModule OssImage
 */

import React, { PureComponent } from 'react';
import {
    Image, Animated, ImageBackground, StyleSheet, PixelRatio
} from 'react-native';
import PropTypes from 'prop-types';
const pixelRatio = PixelRatio.get();      //当前设备的像素密度

import _ from 'lodash';


export default class OssImage extends PureComponent {

    /**
     * lfit：等比缩放，限制在指定w与h的矩形内的最大图片。
     * mfit：等比缩放，延伸出指定w与h的矩形框外的最小图片。
     * fill：固定宽高，将延伸出指定w与h的矩形框外的最小图片进行居中裁剪。
     * pad：固定宽高，缩略填充。
     * fixed：固定宽高，强制缩略。
     *
     */


    static propTypes = {
        source: PropTypes.any,
        isAnimated: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        children: PropTypes.any,
        style: PropTypes.any,
        isShowActivity: PropTypes.bool,
        borderRadius: PropTypes.number,
        cacheable: PropTypes.bool,
        type: PropTypes.oneOf['lfit','mfit','fill','pad','fixed']
    };

    static defaultProps = {
        type: 'lfit',
    };


    _getSource = (source) => {
        if (source && source.uri) {
            let newSource = this.htmlDecode(source.uri);
            if (_.startsWith(newSource, 'http')) {
                if (this.props.width && this.props.height) {
                    newSource = `${newSource}?x-oss-process=image/resize,m_${this.props.type},w_${Math.ceil(this.props.width * pixelRatio)},h_${Math.ceil(this.props.height * pixelRatio)}`;
                } else if (this.props.style) {
                    let style = StyleSheet.flatten(this.props.style);
                    newSource = `${newSource}?x-oss-process=image/resize,m_${this.props.type},w_${Math.ceil(style.width * pixelRatio)},h_${Math.ceil(style.height * pixelRatio)}`;
                }

            }
            console.log(newSource)
            return { uri: newSource };
        }
        return source;
    };

    htmlDecode = (str: string, ignoreBr: ?boolean) => {
        var s = '';
        if (str) {
            str = str.toString();
            str = decodeURIComponent(str);
            if (str.length == 0) {
                return '';
            }
            s = str.replace(/&amp;/g, '&');
            s = s.replace(/&lt;/g, '<');
            s = s.replace(/&gt;/g, '>');
            s = s.replace(/&#40;/g, '(');
            s = s.replace(/&#41;/g, ')');
            s = s.replace(/&le;/g, '≤');
            s = s.replace(/&ge;/g, '≥');
            s = s.replace(/&yen;/g, '¥');
            s = s.replace(/&nbsp;/g, ' ');
            s = s.replace(/&#39;/g, '\'');
            s = s.replace(/&quot;/g, '"');
            s = s.replace(/&middot;/g, '·');
            s = s.replace(/&mdash;/g, '—');
            s = s.replace(/&ldquo;/g, '“');
            s = s.replace(/&rdquo;/g, '”');
            s = s.replace(/&deg;/g, '°');
            if (!ignoreBr) {
                s = s.replace(/\r\n/g, '<br>');
                s = s.replace(/\n/g, '<br>');
            }
        }
        return s;
    };

    render() {
        let { children, source, style, ...props } = this.props;
        let imgSource = this._getSource(source);


        let Component = children
            ? ImageBackground
            : this.props.isAnimated
                ? Animated.Image
                : Image;

        return (
            <Component {...props} style={style} source={imgSource}>
                {children}
            </Component>
        );
    }
}


