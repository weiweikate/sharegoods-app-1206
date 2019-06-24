/**
 * @author xzm
 * @date 2019/6/24
 */

import React, { PureComponent } from 'react';
import {
    View
} from 'react-native';

import ImageLoad from '@mr/image-placeholder';

export default class ShowImageItemView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hasLoad: false
        };
    }

    getDerivedStateFromProps(nextProps, prevState) {
        alert(JSON.stringify(nextProps));
    }

    render() {
        if (this.state.hasLoad || this.props.needLoad) {
            return (<View>
                <ImageLoad style={{
                    width: this.props.width,
                    height: this.props.imageHeight
                }} source={{ uri: this.props.item }} resizeMode='contain'/>
            </View>);
        }else {
            return (
                <View style={{
                    width: this.props.width,
                    height: this.props.imageHeight
                }}/>
            )
        }
    }
}


