import React, { Component } from 'react';
import {
    TouchableOpacity
} from 'react-native';

class NoMoreClick extends Component {

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        const { ...attributes } = this.props;
        return (
            <TouchableOpacity
                onPress={this.debouncePress(this.props.onPress)}{...attributes}>
                {this.props.children}
            </TouchableOpacity>);
    }

    debouncePress = onPress => () => {
        const clickTime = Date.now();
        if (!this.lastClickTime || Math.abs(this.lastClickTime - clickTime) > 600) {
            this.lastClickTime = clickTime;
            onPress();
        }
    };
}

export default NoMoreClick;
