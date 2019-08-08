import React from 'react';
import { getSize } from '../../utils/OssHelper';
import UIImage from '@mr/image-placeholder';

export class AutoHeightImage extends React.Component {
    state = {
        imgHeight: 0
    };

    shouldComponentUpdate(nextProps) {
        if (this.state.imgHeight === 0 || this.props.imgUrl !== nextProps.imgUrl) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        const { imgUrl, ImgWidth } = this.props;
        getSize(imgUrl, (width, height) => {
            height = height / width * ImgWidth;
            this.setState({
                imgHeight: height
            });
        });
    }

    render() {
        const { ImgWidth, children, style, ...attributes } = this.props;
        const { imgHeight } = this.state;
        if (imgHeight === 0) {
            return null;
        }
        return <UIImage style={{ ...style, width: ImgWidth, height: imgHeight }}
                        {...attributes}>
            {children}
        </UIImage>;

    }
}
