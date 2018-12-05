import React from 'react';
import BasePage from '../../BasePage';
import WebViewBridge from '@mr/react-native-webview'

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
                onNavigationStateChange={event => {this.$NavigationBarResetTitle(this.state.title || event.title)}}
                // onLoadStart={() => this._onLoadStart()}
                // onLoadEnd={() => this._onLoadEnd()}
                // onError={e => this._onError(e)}
                // postMessage={msg => this._postMessage(msg)}
                // source={this.props.source} //uri: 'http://172.16.10.117:9528/topic/first'
            />
        )
    }
}

