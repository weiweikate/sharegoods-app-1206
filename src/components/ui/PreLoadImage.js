import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View
} from 'react-native';
import PropTypes from 'prop-types';


export default class PreLoadImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoadComplete: false,
            /**
             * 0正常加载 1加载失败
             */
            type: 0
        };

    }

    render() {
        const { imageUri, style, defaultImage, errImage } = this.props;
        let source = imageUri;
        if (this.state.type === 1) {
            source = errImage;
        }
        return;
        (
            <View style={[styles.imgDefault, style]}>
                <Image
                    source={source}
                    style={style}
                    onError={(error) => {
                        this.setState({
                            type: 1
                        });
                    }}
                    onLoadEnd={() => {
                        this.setState({
                            isLoadComplete: true
                        });
                    }}
                />
                {this.state.isLoadComplete ? null : <Image style={[styles.imgDefault, style]} source={defaultImage}/>}
            </View>
        );


    }
}

PreLoadImage.propTypes = {
    //image Url
    imageUri: PropTypes.string.isRequired,
    //加载失败显示的图片
    errImage: PropTypes.number,
    //预加载展示的图片
    defaultImage: PropTypes.number,
    //图片的回调事件
    onClickAction: PropTypes.func
};

PreLoadImage.defaultProps = {};


const styles = StyleSheet.create({
    imgDefault: {
        width: 100,
        height: 100
    }
});
