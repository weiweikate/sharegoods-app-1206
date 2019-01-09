import React from 'react';
import BasePage from '../../BasePage';
import WebViewBridge from '@mr/webview';
import { View } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';

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
            uri: uri
        };
    }

    componentDidMount() {
        this.$NavigationBarResetTitle(this.state.title || '加载中...');
    }

    _render() {
        return (
            <View style={{ height:ScreenUtils.height - ScreenUtils.headerHeight, overflow: 'hidden' }}>
                <WebViewBridge
                    style={{ flex: 1 }}
                    source={{ uri: this.state.uri }}
                    navigateAppPage={(r, p) => {
                        this.$navigate(r, p);
                    }}
                    onNavigationStateChange={event => {
                        this.$NavigationBarResetTitle(this.state.title || event.title);
                    }}
                    onError={e => {this.$NavigationBarResetTitle('加载失败')}}

                    // onLoadStart={() => this._onLoadStart()}
                    // onLoadEnd={() => this._onLoadEnd()}
                    // onError={e => this._onError(e)}
                    // postMessage={msg => this._postMessage(msg)}
                />
            </View>
        );
    }
}

