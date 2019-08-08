import React from 'react';
import { getSize } from '../../utils/OssHelper';
import UIImage from '@mr/image-placeholder';

export class AutoHeightImage extends React.Component {
    state = {
        imgHeight: 0
    };

    componentDidMount() {
        this.getImgHeight(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.source.uri !== nextProps.source.uri) {
            this.getImgHeight(nextProps);
        }
    }

    getImgHeight = (props) => {
        const { source, ImgWidth } = props;
        getSize(source.uri, (width, height) => {
            height = height / width * ImgWidth;
            this.setState({
                imgHeight: height
            });
        });
    };

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
