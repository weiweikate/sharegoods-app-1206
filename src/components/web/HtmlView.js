import React from 'react';
import BasePage from '../../BasePage';
import WebViewBridge from '@mr/webview'

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

    _render(){
        return(
            <WebViewBridge
                style={{flex: 1}}
                source={{uri: this.state.uri}}
                navigateAppPage={(r, p) => {this.$navigate(r, p)}}
                onNavigationStateChange={event => { if (this.state.title || event.title) this.$NavigationBarResetTitle(this.state.title || event.title)}}
                // onLoadStart={() => this._onLoadStart()}
                // onLoadEnd={() => this._onLoadEnd()}
                onError={e => {this.$NavigationBarResetTitle('加载失败')}}
                // postMessage={msg => this._postMessage(msg)}
            />
        )
    }
}

