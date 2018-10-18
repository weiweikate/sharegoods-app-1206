import React from 'react';
import {
    WebView,
} from 'react-native';
import BasePage from '../../BasePage';

export default class RequestDetailPage extends BasePage {

    // 页面配置
    $navigationBarOptions = {
        title: ''
    };

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params || {};
        const { uri, title } = params;
        this.state = {
            title: title,
            uri: uri,
        };
    }

    componentDidMount() {
        this.$NavigationBarResetTitle(this.state.title);
    }

    _render() {

        return (
            <WebView source={{ uri: this.state.uri }}
                     javaScriptEnabled={true}
                     domStorageEnabled={true}
                     scalesPageToFit={true} />
        );
    }
}

